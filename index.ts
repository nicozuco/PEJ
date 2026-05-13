import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

type CalendarEvent = {
  id: string
  title?: string
  time?: string
  color?: string
  type?: string
  eventType?: string
  remind?: boolean
  repeatUnit?: 'none' | 'hour' | 'day' | 'week' | 'month' | 'year'
  repeatEvery?: number
}

type UserRow = {
  user_id: string
  journal: { calEvents?: Record<string, CalendarEvent[]> } | null
  settings: {
    pushSubscriptions?: PushDevice[]
    pushDeliveryHistory?: Record<string, number>
  } | null
}

type PushDevice = {
  endpoint: string
  subscription: Record<string, unknown>
  user_agent?: string | null
  time_zone?: string | null
  app_version?: string | null
  active?: boolean
  last_error?: string | null
  updated_at?: string
}

const CRON_SECRET = Deno.env.get('PUSH_CRON_SECRET') ?? Deno.env.get('CRON_SECRET') ?? ''
const VAPID_PUBLIC = Deno.env.get('PUSH_VAPID_PUBLIC_KEY') ?? ''
const VAPID_PRIVATE = Deno.env.get('PUSH_VAPID_PRIVATE_KEY') ?? ''
const VAPID_SUBJECT = Deno.env.get('PUSH_VAPID_SUBJECT') ?? 'mailto:notifications@example.com'
const DEFAULT_TIME_ZONE = Deno.env.get('PUSH_DEFAULT_TIME_ZONE') ?? 'Europe/Madrid'
const REMINDER_EARLY_MS = 15000
const REMINDER_LATE_MS = 75000

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function parseDateKeyParts(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return { y, m: m || 1, d: d || 1 }
}

function safeTimeZone(timeZone?: string | null) {
  const candidate = timeZone || DEFAULT_TIME_ZONE
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: candidate }).format(new Date())
    return candidate
  } catch {
    return DEFAULT_TIME_ZONE
  }
}

function timeToParts(time = '00:00') {
  const [hh, mm] = time.split(':').map((v) => parseInt(v, 10) || 0)
  return { hh, mm }
}

function dateKeyFromParts(parts: { y: number; m: number; d: number }) {
  return `${parts.y}-${String(parts.m).padStart(2, '0')}-${String(parts.d).padStart(2, '0')}`
}

function partsInTimeZone(date: Date, timeZone: string) {
  const values: Record<string, number> = {}
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = Number(part.value)
  }
  return {
    y: values.year,
    m: values.month,
    d: values.day,
    hh: values.hour,
    mm: values.minute,
    ss: values.second,
  }
}

function dateKeyInTimeZone(date: Date, timeZone: string) {
  return dateKeyFromParts(partsInTimeZone(date, timeZone))
}

function timeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = partsInTimeZone(date, timeZone)
  const localAsUtc = Date.UTC(parts.y, parts.m - 1, parts.d, parts.hh, parts.mm, parts.ss || 0)
  return localAsUtc - date.getTime()
}

function combineDateKeyAndTime(key: string, time = '00:00', timeZone = DEFAULT_TIME_ZONE) {
  const { y, m, d } = parseDateKeyParts(key)
  const { hh, mm } = timeToParts(time)
  let utc = new Date(Date.UTC(y, m - 1, d, hh, mm, 0, 0))
  for (let i = 0; i < 3; i += 1) {
    utc = new Date(Date.UTC(y, m - 1, d, hh, mm, 0, 0) - timeZoneOffsetMs(utc, timeZone))
  }
  return utc
}

function monthDiff(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

function repeatUnit(ev: CalendarEvent) {
  return ev.repeatUnit || 'none'
}

function repeatEvery(ev: CalendarEvent) {
  return Math.max(1, parseInt(String(ev.repeatEvery ?? 1), 10) || 1)
}

function eventOccursOnDate(baseKey: string, ev: CalendarEvent, targetKey: string) {
  const unit = repeatUnit(ev)
  const every = repeatEvery(ev)
  const baseParts = parseDateKeyParts(baseKey)
  const targetParts = parseDateKeyParts(targetKey)
  const base = new Date(Date.UTC(baseParts.y, baseParts.m - 1, baseParts.d, 0, 0, 0, 0))
  const target = new Date(Date.UTC(targetParts.y, targetParts.m - 1, targetParts.d, 0, 0, 0, 0))
  const diffDays = Math.floor((target.getTime() - base.getTime()) / 86400000)
  if (unit === 'none') return baseKey === targetKey
  if (diffDays < 0) return false
  if (unit === 'hour') return true
  if (unit === 'day') return diffDays % every === 0
  if (unit === 'week') return diffDays % (every * 7) === 0
  if (unit === 'month') {
    const diffMonths = monthDiff(base, target)
    return diffMonths >= 0 && diffMonths % every === 0 && base.getDate() === target.getDate()
  }
  if (unit === 'year') {
    const diffYears = target.getFullYear() - base.getFullYear()
    return diffYears >= 0 && diffYears % every === 0
      && base.getMonth() === target.getMonth() && base.getDate() === target.getDate()
  }
  return false
}

function reminderOccurrenceKey(baseKey: string, ev: CalendarEvent, occAt: Date) {
  return `${ev.id}|${baseKey}|${occAt.toISOString()}`
}

function isDueReminder(now: Date, occAt: Date) {
  const diff = now.getTime() - occAt.getTime()
  return diff >= -REMINDER_EARLY_MS && diff < REMINDER_LATE_MS
}

function repeatSummary(ev: CalendarEvent) {
  const unit = repeatUnit(ev)
  const every = repeatEvery(ev)
  if (unit === 'none') return 'Una vez'
  if (unit === 'hour') return every === 1 ? 'Cada hora' : `Cada ${every} horas`
  if (unit === 'day') return every === 1 ? 'Cada dia' : `Cada ${every} dias`
  if (unit === 'week') return every === 1 ? 'Cada semana' : `Cada ${every} semanas`
  if (unit === 'month') return every === 1 ? 'Cada mes' : `Cada ${every} meses`
  if (unit === 'year') return every === 1 ? 'Cada ano' : `Cada ${every} anos`
  return 'Una vez'
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  recordatorio: 'Recordatorio',
  cumpleanos: 'Cumpleaños',
  cita: 'Cita',
  tarea: 'Tarea',
  evento: 'Evento',
}

function eventTypeLabel(ev: CalendarEvent) {
  return EVENT_TYPE_LABELS[ev.type || ev.eventType || 'recordatorio'] || EVENT_TYPE_LABELS.recordatorio
}

function notificationTitle(ev: CalendarEvent) {
  return eventTypeLabel(ev).toUpperCase()
}

function notificationBody(ev: CalendarEvent, occAt: Date, timeZone: string) {
  const time = occAt.toLocaleTimeString('es-ES', { timeZone, hour: '2-digit', minute: '2-digit' })
  const title = (ev.title || '').trim()
  const repeat = repeatUnit(ev) === 'none' ? '' : repeatSummary(ev)
  return [time, title, repeat].filter(Boolean).join(' · ')
}

function dueReminderOccurrences(calEvents: Record<string, CalendarEvent[]>, now = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const due: { ev: CalendarEvent; baseKey: string; occAt: Date }[] = []
  const todayKey = dateKeyInTimeZone(now, timeZone)

  for (const [baseKey, items] of Object.entries(calEvents || {})) {
    for (const ev of items || []) {
      if (!ev?.remind) continue
      const unit = repeatUnit(ev)
      const every = repeatEvery(ev)
      const baseAt = combineDateKeyAndTime(baseKey, ev.time || '00:00', timeZone)
      if (now < baseAt) continue

      if (unit === 'hour') {
        const stepMs = every * 3600000
        const diff = now.getTime() - baseAt.getTime()
        const count = Math.floor(diff / stepMs)
        const occAt = new Date(baseAt.getTime() + count * stepMs)
        if (isDueReminder(now, occAt)) due.push({ ev, baseKey, occAt })
        continue
      }

      if (!eventOccursOnDate(baseKey, ev, todayKey)) continue
      const occAt = combineDateKeyAndTime(todayKey, ev.time || '00:00', timeZone)
      if (isDueReminder(now, occAt)) due.push({ ev, baseKey, occAt })
    }
  }

  return due
}

Deno.serve(async (req) => {
  const secret = req.headers.get('x-cron-secret') ?? ''
  if (!CRON_SECRET || secret !== CRON_SECRET) return json({ error: 'Unauthorized' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const now = new Date()
  const { data: users, error: userError } = await supabase
    .from('user_data')
    .select('user_id,journal,settings')

  if (userError) return json({ error: userError.message }, 500)

  let sent = 0
  let skipped = 0

  for (const userRow of (users || []) as UserRow[]) {
    const calEvents = userRow.journal?.calEvents || {}
    const settings = userRow.settings ?? {}
    const subscriptions = (Array.isArray(settings.pushSubscriptions) ? settings.pushSubscriptions : [])
      .filter((sub) => sub?.endpoint && sub?.subscription && sub.active !== false)
    if (!subscriptions.length) continue

    const history = { ...(settings.pushDeliveryHistory || {}) }
    let dirty = false
    const nextSubscriptions = subscriptions.map((sub) => ({ ...sub }))

    for (const sub of nextSubscriptions) {
      const timeZone = safeTimeZone(sub.time_zone)
      const due = dueReminderOccurrences(calEvents, now, timeZone)
      if (!due.length) continue

      for (const item of due) {
        const occurrenceKey = reminderOccurrenceKey(item.baseKey, item.ev, item.occAt)
        const deliveryKey = `${sub.endpoint}|${occurrenceKey}`
        if (history[deliveryKey]) {
          skipped += 1
          continue
        }

        try {
          await webpush.sendNotification(
            sub.subscription as webpush.PushSubscription,
            JSON.stringify({
              title: notificationTitle(item.ev),
              body: notificationBody(item.ev, item.occAt, timeZone),
              tag: occurrenceKey,
              url: '/',
            }),
            { TTL: 120 }
          )

          history[deliveryKey] = Date.now()
          dirty = true
          sent += 1
        } catch (err) {
          const statusCode = (err as { statusCode?: number }).statusCode
          const message = err instanceof Error ? err.message : String(err)
          sub.last_error = message
          sub.updated_at = new Date().toISOString()
          dirty = true
          if (statusCode === 400 || statusCode === 403 || statusCode === 404 || statusCode === 410) {
            sub.active = false
          }
        }
      }
    }

    if (!dirty) continue

    const prunedEntries = Object.entries(history)
      .filter(([, ts]) => typeof ts === 'number' && ts > Date.now() - 1000 * 60 * 60 * 24 * 45)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 500)

    const nextSettings = {
      ...settings,
      pushSubscriptions: nextSubscriptions,
      pushDeliveryHistory: Object.fromEntries(prunedEntries),
    }

    await supabase
      .from('user_data')
      .update({ settings: nextSettings })
      .eq('user_id', userRow.user_id)
  }

  return json({ ok: true, sent, skipped, checkedAt: now.toISOString() })
})
