const CACHE_VERSION = 'cercamoneta-v1.0.0.6';
const ASSETS = ['./', './index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('anthropic.com')||e.request.url.includes('fonts.googleapis')) return;
  if(e.request.mode==='navigate'||e.request.url.endsWith('index.html')){
    e.respondWith(fetch(e.request).then(res=>{ const cl=res.clone(); caches.open(CACHE_VERSION).then(c=>c.put(e.request,cl)); return res; }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
