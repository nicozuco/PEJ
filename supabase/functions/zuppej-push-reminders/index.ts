import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function loadUserRow(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from('user_data')
    .select('user_id, habits, journal, settings, twelve')
    .eq('user_id', userId)
    .maybeSingle()

  return data ?? {
    user_id: userId,
    habits: {},
    journal: {},
    settings: {},
    twelve: {},
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  if (req.method === 'GET') {
    return json({ vapidPublicKey: Deno.env.get('PUSH_VAPID_PUBLIC_KEY') ?? '' })
  }

  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'Missing auth token.' }, 401)

  const { data: authData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !authData.user) return json({ error: 'Unauthorized.' }, 401)
  const user = authData.user

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null)
    const subscription = body?.subscription
    const endpoint = subscription?.endpoint
    if (!subscription || !endpoint) return json({ error: 'Invalid subscription payload.' }, 400)

    const row = await loadUserRow(supabase, user.id)
    const settings = row.settings ?? {}
    const current = Array.isArray(settings.pushSubscriptions) ? settings.pushSubscriptions : []
    const nextSubscription = {
      endpoint,
      subscription,
      user_agent: body?.userAgent ?? null,
      active: true,
      last_error: null,
      updated_at: new Date().toISOString(),
    }
    const nextPushSubscriptions = current.some((item: { endpoint: string }) => item.endpoint === endpoint)
      ? current.map((item: { endpoint: string }) => item.endpoint === endpoint ? nextSubscription : item)
      : [...current, nextSubscription]

    const { error } = await supabase
      .from('user_data')
      .upsert({
        ...row,
        settings: {
          ...settings,
          pushSubscriptions: nextPushSubscriptions,
        },
      }, { onConflict: 'user_id' })

    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  if (req.method === 'DELETE') {
    const body = await req.json().catch(() => null)
    const endpoint = body?.endpoint
    if (!endpoint) return json({ error: 'Missing endpoint.' }, 400)

    const row = await loadUserRow(supabase, user.id)
    const settings = row.settings ?? {}
    const current = Array.isArray(settings.pushSubscriptions) ? settings.pushSubscriptions : []
    const nextPushSubscriptions = current.map((item: { endpoint: string }) => (
      item.endpoint === endpoint
        ? { ...item, active: false, updated_at: new Date().toISOString() }
        : item
    ))

    const { error } = await supabase
      .from('user_data')
      .upsert({
        ...row,
        settings: {
          ...settings,
          pushSubscriptions: nextPushSubscriptions,
        },
      }, { onConflict: 'user_id' })

    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed.' }, 405)
})
