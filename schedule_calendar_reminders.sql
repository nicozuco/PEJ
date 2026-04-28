select vault.create_secret('YOUR_CRON_SECRET', 'cron_secret');

select
  cron.schedule(
    'send-calendar-reminders-every-minute',
    '* * * * *',
    $$
    select
      net.http_post(
        url:= 'https://xrtvyidrcmakqvbxuhwr.supabase.co/functions/v1/send-calendar-reminders',
        headers:= jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
        ),
        body:= '{}'::jsonb
      ) as request_id;
    $$
  );
