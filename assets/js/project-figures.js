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
    var summary = panel.querySelector("summary");
    var count = panel.querySelector(".project-figures__count");
    count.textContent = " (" + panel.querySelectorAll(".research-card").length + ")";
    if (typeof saved[panel.id] === "boolean") panel.open = saved[panel.id];
    panel.addEventListener("toggle", function () {
      if (printing) return;
      saved[panel.id] = panel.open;
      try { sessionStorage.setItem(key, JSON.stringify(saved)); } catch (_) {}
    });
    var close = panel.querySelector(".project-figures__collapse");
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
      if (!panel || (panel.open && !alignOpenPanel)) return null;
      panel.open = true;
      return target;
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
  window.addEventListener("pageshow", function (event) {
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
