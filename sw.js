const CACHE='growth-practice-v1.0.8';
const ASSETS=['./','./index.html','./styles.css?v=1.0.8','./content.js?v=1.0.8','./pdf-export.js?v=1.0.8','./app.js?v=1.0.8','./manifest.webmanifest?v=1.0.8','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('growth-practice-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put('./',c)).catch(()=>{});}return r;}).catch(()=>caches.match('./')));
   return;
 }
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,cp)).catch(()=>{});}return r;})));
});
