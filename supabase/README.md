# Push notifications setup

This project now includes:

- `functions/zuppej-push-reminders`
- `functions/send-calendar-reminders`
- `sql/schedule_calendar_reminders.sql`

## 1. Generate VAPID keys

Use the official `web-push` tool once:

```bash
npx web-push generate-vapid-keys
```

Save the resulting keys as Supabase secrets:

```bash
supabase secrets set \
  PUSH_VAPID_PUBLIC_KEY="..." \
  PUSH_VAPID_PRIVATE_KEY="..." \
  PUSH_VAPID_SUBJECT="mailto:tu-correo@ejemplo.com" \
  PUSH_CRON_SECRET="una-cadena-larga-y-aleatoria"
```

## 2. Deploy Edge Functions

The subscriptions function should keep JWT verification enabled.

```bash
supabase functions deploy zuppej-push-reminders
```

The reminder sender should be deployed without JWT verification because it is invoked by cron using `x-cron-secret`.

```bash
supabase functions deploy send-calendar-reminders --no-verify-jwt
```

No extra database migration is required because subscriptions and delivery history are stored in the existing `user_data.settings` JSON.

## 3. Create the cron job

Run:

```bash
psql "<your-supabase-connection-string>" -f supabase/sql/schedule_calendar_reminders.sql
```

Or paste the SQL into the Supabase SQL editor after replacing `YOUR_CRON_SECRET`.

## 4. Important platform notes

- Desktop browsers require HTTPS in production.
- iPhone/iPad require iOS/iPadOS 16.4+.
- On iPhone/iPad, Web Push works for web apps added to the Home Screen.
- Each device must activate notifications once from `Agenda`.
