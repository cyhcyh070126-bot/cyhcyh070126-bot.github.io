/* Native per-project figure disclosure; keep the actual cards and links intact. */
(function () {
  "use strict";
  var panels = Array.from(document.querySelectorAll("details.project-figures"));
  if (!panels.length) return;
  var key = "cv-project-figures";
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(key) || "{}"); }
  catch (_) { /* Native disclosure still works when storage is unavailable. */ }
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) saved = {};
  var printing = false;
  panels.forEach(function (panel) {
    var summary = panel.querySelector(":scope > summary");
    var count = summary.querySelector(".project-figures__count");
    count.textContent = " (" + panel.querySelectorAll(".research-card").length + ")";
    if (typeof saved[panel.id] === "boolean") panel.open = saved[panel.id];
    panel.addEventListener("toggle", function (event) {
      if (printing || event.target !== panel) return;
      saved[panel.id] = panel.open;
      try { sessionStorage.setItem(key, JSON.stringify(saved)); } catch (_) {}
    });
    // Markdown may wrap a button in a paragraph; match its owning disclosure.
    var close = Array.from(panel.querySelectorAll(".project-figures__collapse")).find(function (button) {
      return button.closest("details.project-figures") === panel;
    });
    close.hidden = false;
    close.addEventListener("click", function () {
      panel.open = false;
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ block: "start", behavior: "instant" });
    });
  });

  function reveal(href, alignOpenPanel) {
    try {
      var url = new URL(href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return null;
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      var panel = target && target.closest("details.project-figures");
      var ancestors = [];
      while (panel) {
        ancestors.unshift(panel);
        panel = panel.parentElement && panel.parentElement.closest("details.project-figures");
      }
      var changed = ancestors.some(function (item) { return !item.open; });
      ancestors.forEach(function (item) { item.open = true; });
      return ancestors.length && (changed || alignOpenPanel) ? target : null;
    } catch (_) { return null; }
  }
  window.siteRevealFigure = reveal;
  function revealHash() {
    var target = reveal(location.href, true);
    if (target) window.requestAnimationFrame(function () {
      target.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  // Open before the existing Contents/search/smooth-scroll code measures the target.
  document.addEventListener("click", function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest && event.target.closest("a[href]");
    if (link) reveal(link.href);
  }, true);
  var interacted = false;
  ["pointerdown", "wheel", "keydown"].forEach(function (name) {
    window.addEventListener(name, function () { interacted = true; }, { once: true, passive: true });
  });
  window.addEventListener("hashchange", revealHash);
  function restoreReaderPosition() {
    try {
      var context = JSON.parse(sessionStorage.getItem("research-reader-context") || "{}");
      var point = context.returnPosition;
      if (!point || point.url !== location.href || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.y < 0) return false;
      delete context.returnPosition;
      sessionStorage.setItem("research-reader-context", JSON.stringify(context));
      // Open panels change the layout before native history restoration settles.
      var ready = document.fonts ? document.fonts.ready : Promise.resolve();
      ready.then(function () {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { window.scrollTo({ left: point.x, top: point.y, behavior: "instant" }); });
        });
      });
      return true;
    } catch (_) { return false; }
  }
  window.addEventListener("pageshow", function (event) {
    if (restoreReaderPosition()) return;
    if (!event.persisted && !interacted) revealHash();
  });
  revealHash();

  // Printing the web CV should not silently omit figures that are folded onscreen.
  var printState;
  window.addEventListener("beforeprint", function () {
    printing = true;
    printState = panels.map(function (panel) { var open = panel.open; panel.open = true; return open; });
  });
  window.addEventListener("afterprint", function () {
    if (printState) panels.forEach(function (panel, i) { panel.open = printState[i]; });
    printing = false;
  });
})();
