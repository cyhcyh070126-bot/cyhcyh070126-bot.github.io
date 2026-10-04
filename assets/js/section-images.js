/* Prepare real gallery images ahead of section jumps, without changing links. */
(function () {
  "use strict";
  var selector = ".research-card img, .project-list__preview img";
  function followingImages(target, images, limit) {
    var root = target.closest(".cv-project, .project-list__item") || target;
    return images.filter(function (img) {
      return root.contains(img) || (root.compareDocumentPosition(img) & 4);
    }).slice(0, limit);
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { followingImages: followingImages };
  if (typeof document === "undefined") return;
  var images = Array.from(document.querySelectorAll(selector));
  if (!images.length) return;
  function reveal(img) {
    if (!img.naturalWidth) return;
    var ready = img.decode ? img.decode() : Promise.resolve();
    ready.then(function () { img.style.removeProperty("background-image"); }).catch(function () {});
  }
  images.forEach(function (img) {
    img.addEventListener("load", function () { reveal(img); }, { once: true });
    if (img.complete) reveal(img);
  });
  var connection = navigator.connection;
  var jobs = new WeakMap();
  function limited() {
    return connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType));
  }
  function prepare(img, priority) {
    if (priority === "high" || !jobs.has(img)) img.fetchPriority = priority;
    img.loading = "eager";
    if (!jobs.has(img)) {
      var job = new Promise(function (resolve) {
        if (img.complete) { resolve(); return; }
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      }).then(function () {
        if (img.naturalWidth && img.decode) return img.decode().catch(function () {});
      });
      jobs.set(img, job);
    }
    return jobs.get(img);
  }
  window.sitePrepareSection = function (href, urgent) {
    if (!urgent && limited()) return;
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) followingImages(target, images, 3).forEach(function (img) { prepare(img, "high"); });
    } catch (_) { /* Invalid or external anchors are handled by native navigation. */ }
  };
  // Prepare the current deep link immediately, before any background work.
  window.sitePrepareSection(location.href, true);
  // Seed one image per project before the rest, so all directory destinations warm up.
  var first = [];
  document.querySelectorAll(".cv-project__title[id], .project-list__item[id]").forEach(function (target) {
    followingImages(target, images, 1).forEach(function (img) { if (!first.includes(img)) first.push(img); });
  });
  var queue = first.concat(images.filter(function (img) { return !first.includes(img); }));
  var active = 0;
  function pump() {
    if (limited() || document.visibilityState === "hidden") return;
    while (active < 2 && queue.length) {
      var img = queue.shift();
      if (img.complete && img.naturalWidth) continue;
      active++;
      prepare(img, "low").finally(function () { active--; pump(); });
    }
  }
  document.addEventListener("visibilitychange", pump);
  if (window.requestIdleCallback) window.requestIdleCallback(pump, { timeout: 1200 });
  else window.setTimeout(pump, 400);
})();
