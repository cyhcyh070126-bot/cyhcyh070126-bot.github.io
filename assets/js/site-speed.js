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
  if (typeof module !== "undefined" && module.exports) module.exports = { destination: destination };
  if (typeof document === "undefined") return;
  var connection = navigator.connection;
  function constrained() {
    return connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType));
  }
  var warmed = new Set();
  var assetCount = 0;
  function warm(href) {
    if (constrained()) return;
    var item = destination(href, location.href);
    if (!item || warmed.has(item.url) || (item.type === "asset" && assetCount >= 8)) return;
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
  // Only three small HTML documents; do not eagerly download the image gallery.
  if (window.requestIdleCallback) window.requestIdleCallback(warmPages, { timeout: 1500 });
  else window.setTimeout(warmPages, 600);
})();
