(function () {
  "use strict";
  var button = document.querySelector(".back-to-top");
  if (!button) return;
  var contents = document.querySelector(".page-contents");
  var toggle = contents && contents.querySelector(".page-contents__toggle");
  var panel = contents && contents.querySelector(".page-contents__panel");
  function closeContents() {
    if (!panel) return;
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  if (contents) {
    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });
    document.addEventListener("click", function (event) {
      if (!contents.contains(event.target)) closeContents();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closeContents();
        toggle.focus();
      }
    });
    contents.addEventListener("focusout", function (event) {
      if (!contents.contains(event.relatedTarget)) closeContents();
    });
    // Handle these anchors before the site's generic smooth-scroll listener.
    panel.addEventListener("click", function (event) {
      var link = event.target.closest("a[href^='#']");
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      var target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      if (window.sitePrepareSection) window.sitePrepareSection(link.href, true);
      event.preventDefault();
      event.stopPropagation();
      closeContents();
      var masthead = document.querySelector(".masthead");
      var offset = masthead ? masthead.getBoundingClientRect().height + 16 : 16;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      window.history.pushState(null, "", link.hash);
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "instant"
      });
    }, true);
  }
  var pending = false;
  function update() {
    button.hidden = window.scrollY < Math.max(400, window.innerHeight * 0.65);
    pending = false;
  }
  function scheduleUpdate() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  button.addEventListener("click", function () {
    closeContents();
    var main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  });
  update();
}());
