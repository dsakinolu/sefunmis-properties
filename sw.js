// Sefunmi's Properties — offline-first service worker
const CACHE = "sefunmi-properties-v1";
const ASSETS = [
  "./", "./index.html", "./directory.html", "./admin.html",
  "./css/style.css",
  "./js/db.js", "./js/ui.js", "./js/search.js", "./js/directory.js", "./js/admin.js",
  "./data/owners.csv", "./data/properties.csv", "./data/tenants.csv",
  "./data/employees.csv", "./data/leases.csv", "./data/payments.csv",
  "./images/logo.png", "./images/icon-192.png", "./images/icon-512.png",
  "./js/seed.js",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll fails entirely if any one request fails; add individually instead
      .then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => { }))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) =>
      hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        // cache same-origin assets AND the sql.js wasm from the CDN
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => { });
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
