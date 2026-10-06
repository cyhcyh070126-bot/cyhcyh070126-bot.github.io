/* Warm native navigation caches without intercepting clicks or changing URLs. */
(function () {
  "use strict";
  function destination(href, current) {
    try {
      var here = new URL(current);
      var url = new URL(href, here);
      if (url.origin !== here.origin || !/^https?:$/.test(url.protocol)) return null;
      url.hash = "";
      if (url.pathname === here.pathname && url.search === here.search) return null;
      if (["/", "/cv/", "/projects/"].includes(url.pathname)) return { url: url.href, type: "document" };
      if (/^\/(images|files)\//.test(url.pathname) && /\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(url.pathname)) {
        return { url: url.href, type: "asset" };
      }
    } catch (_) { /* Invalid or non-navigation link. */ }
    return null;
  }
  function imageDestination(item, current) {
    try {
      var here = new URL(current);
      var url = new URL(item.src, here);
      if (url.origin !== here.origin || !/^https?:$/.test(url.protocol) ||
          !/^\/(?:images|assets\/icons)\//.test(url.pathname)) return null;
      return { src: url.href, srcset: item.srcset || "", sizes: item.sizes || "" };
    } catch (_) { return null; }
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { destination: destination, imageDestination: imageDestination };
  if (typeof document === "undefined") return;
  var connection = navigator.connection;
  function constrained() {
    return connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType));
  }
  var warmed = new Set();
  var connected = new Set();
  var assetCount = 0;
  function connect(href) {
    if (constrained()) return;
    try {
      var url = new URL(href, location.href);
      if (url.origin === new URL(location.href).origin || url.protocol !== "https:" || connected.has(url.origin) || connected.size >= 4) return;
      connected.add(url.origin);
      var hint = document.createElement("link");
      hint.rel = "preconnect";
      hint.href = url.origin;
      document.head.appendChild(hint);
    } catch (_) { /* Native navigation still handles invalid links. */ }
  }
  function warm(href) {
    if (window.sitePrepareSection) window.sitePrepareSection(href, false);
    if (constrained()) return;
    var item = destination(href, location.href);
    if (!item) { connect(href); return; }
    if (warmed.has(item.url) || (item.type === "asset" && assetCount >= 8)) return;
    warmed.add(item.url);
    if (item.type === "asset") assetCount++;
    var hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = item.url;
    hint.setAttribute("fetchpriority", "low");
    document.head.appendChild(hint);
  }
  window.siteWarmLink = warm;
  function intent(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (link && !link.hasAttribute("download")) warm(link.href);
  }
  document.addEventListener("pointerover", intent, { passive: true });
  document.addEventListener("pointerdown", intent, { passive: true });
  document.addEventListener("focusin", intent);
  function warmPages() {
    if (document.visibilityState === "hidden") return;
    ["/", "/cv/", "/projects/"].forEach(warm);
  }
  // Warm route documents independently of the lower-priority image queue below.
  if (window.requestIdleCallback) window.requestIdleCallback(warmPages, { timeout: 1500 });
  else window.setTimeout(warmPages, 600);

  // Warm the actual responsive display files, not just the other pages' HTML.
  // Current-page images are already prepared by section-images.js; avoid duplicates.
  var manifest = document.getElementById && document.getElementById("site-navigation-images");
  if (!manifest || typeof Image === "undefined") return;
  var queue;
  try { queue = JSON.parse(manifest.textContent).map(function (item) { return imageDestination(item, location.href); }).filter(Boolean); }
  catch (_) { return; }
  function imageKey(item) { return item.src + "|" + item.srcset + "|" + item.sizes; }
  var current = new Set(Array.from(document.querySelectorAll("img[src]")).map(function (img) {
    var picture = img.closest && img.closest("picture");
    var source = picture && picture.querySelector('source[type="image/webp"]');
    return imageKey({ src: img.src, srcset: source ? source.getAttribute("srcset") || "" : "", sizes: source ? source.getAttribute("sizes") || "" : "" });
  }));
  var seen = new Set();
  queue = queue.filter(function (item) {
    var key = imageKey(item);
    if (current.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  var active = 0;
  var pageLoaded = document.readyState === "complete";
  function pumpImages() {
    if (!pageLoaded || constrained() || document.visibilityState === "hidden") return;
    while (active < 2 && queue.length) {
      var item = queue.shift();
      var img = new Image();
      active++;
      img.fetchPriority = "low";
      img.decoding = "async";
      img.onload = img.onerror = function () {
        this.onload = this.onerror = null;
        active--;
        pumpImages();
      };
      if (item.srcset) { img.sizes = item.sizes; img.srcset = item.srcset; }
      img.src = item.src;
    }
  }
  function scheduleImages() {
    pageLoaded = true;
    if (window.requestIdleCallback) window.requestIdleCallback(pumpImages, { timeout: 1500 });
    else window.setTimeout(pumpImages, 100);
  }
  document.addEventListener("visibilitychange", pumpImages);
  if (document.readyState === "complete") scheduleImages();
  else window.addEventListener("load", scheduleImages, { once: true });
})();
