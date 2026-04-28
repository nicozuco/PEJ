self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'ZUPPEJ', body: event.data ? event.data.text() : '' };
  }
  const appUrl = new URL('./', self.registration.scope).href;
  const iconUrl = new URL('icon.svg', self.registration.scope).href;
  const title = data.title || 'ZUPPEJ';
  const options = {
    body: data.body || '',
    icon: iconUrl,
    badge: iconUrl,
    tag: data.tag || undefined,
    data: {
      url: data.url || appUrl,
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || new URL('./', self.registration.scope).href;
  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = allClients.find(client => 'focus' in client);
    if (existing) {
      existing.focus();
      existing.navigate(targetUrl);
      return;
    }
    await clients.openWindow(targetUrl);
  })());
});
