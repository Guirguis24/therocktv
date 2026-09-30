const CACHE='therock-tv-v9';
const ASSETS=['/','/index.html','/manifest.webmanifest','/icon.svg','/poster-v4.jpg','/whatsapp-qr.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.pathname==='/'||url.pathname==='/index.html'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match('/index.html')));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('/'))));
});