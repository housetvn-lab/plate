// Offline support: the app shell is fetched network-first (so updates arrive),
// photos/icons are cache-first, fonts are cached as they load.
const VERSION = "plate-202610312200";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-180.png"];
const IMGS = ["img/apull-0.jpg", "img/apull-1.jpg", "img/bbohp-0.jpg", "img/bbohp-1.jpg", "img/bbrow-0.jpg", "img/bbrow-1.jpg", "img/bench-0.jpg", "img/bench-1.jpg", "img/bike-0.jpg", "img/bike-1.jpg", "img/ccrunch-0.jpg", "img/ccrunch-1.jpg", "img/cgpd-0.jpg", "img/cgpd-1.jpg", "img/cpress-0.jpg", "img/cpress-1.jpg", "img/crow-0.jpg", "img/crow-1.jpg", "img/crunch-0.jpg", "img/crunch-1.jpg", "img/curl-0.jpg", "img/curl-1.jpg", "img/dbfly-0.jpg", "img/dbfly-1.jpg", "img/dbpress-0.jpg", "img/dbpress-1.jpg", "img/dbrdl-0.jpg", "img/dbrdl-1.jpg", "img/dbrow-0.jpg", "img/dbrow-1.jpg", "img/fly-0.jpg", "img/fly-1.jpg", "img/fpull-0.jpg", "img/fpull-1.jpg", "img/goblet-0.jpg", "img/goblet-1.jpg", "img/hammer-0.jpg", "img/hammer-1.jpg", "img/hthrust-0.jpg", "img/hthrust-1.jpg", "img/incline-0.jpg", "img/incline-1.jpg", "img/jog-0.jpg", "img/jog-1.jpg", "img/latpd-0.jpg", "img/latpd-1.jpg", "img/lcurl-0.jpg", "img/lcurl-1.jpg", "img/legraise-0.jpg", "img/legraise-1.jpg", "img/lext-0.jpg", "img/lext-1.jpg", "img/lpress-0.jpg", "img/lpress-1.jpg", "img/lraise-0.jpg", "img/lraise-1.jpg", "img/lraiseH-0.jpg", "img/lraiseH-1.jpg", "img/lunge-0.jpg", "img/lunge-1.jpg", "img/mclimb-0.jpg", "img/mclimb-1.jpg", "img/ohp-0.jpg", "img/ohp-1.jpg", "img/ohtri-0.jpg", "img/ohtri-1.jpg", "img/pdown-0.jpg", "img/pdown-1.jpg", "img/plank-0.jpg", "img/plank-1.jpg", "img/pushup-0.jpg", "img/pushup-1.jpg", "img/rdelt-0.jpg", "img/rdelt-1.jpg", "img/rdl-0.jpg", "img/rdl-1.jpg", "img/rdraise-0.jpg", "img/rdraise-1.jpg", "img/sapd-0.jpg", "img/sapd-1.jpg", "img/split-0.jpg", "img/split-1.jpg", "img/squat-0.jpg", "img/squat-1.jpg", "img/stepup-0.jpg", "img/stepup-1.jpg", "img/uhpd-0.jpg", "img/uhpd-1.jpg", "img/walk-0.jpg", "img/walk-1.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll([...SHELL, ...IMGS])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const font = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !font) return;
  if (req.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
