/* Placeholder service worker — stops /sw.js 404 in dev when browsers or tools probe this URL.
   Remove or replace with a real PWA (e.g. next-pwa) when you add offline support. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
