self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'ZUPPEJ', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'ZUPPEJ';
  const options = {
    body: data.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: data.tag || undefined,
    data: {
      url: data.url || '/',
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
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
