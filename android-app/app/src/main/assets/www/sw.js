self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// دریافت نوتیفیکیشن از سرور
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'هبیت ترکر';
  const options = {
    body: data.body || 'وقت انجام عادت‌های روزانه است!',
    icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305432.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/4305/4305432.png',
    dir: 'rtl',
    lang: 'fa',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'مشاهده برنامه'}
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// کلیک روی نوتیفیکیشن
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((clientList) => {
      // اگر برنامه باز است، روی آن فوکوس کن
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      // اگر باز نیست، بازش کن
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
