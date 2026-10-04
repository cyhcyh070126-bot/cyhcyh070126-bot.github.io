(function () {
  "use strict";
  var button = document.querySelector(".back-to-top");
  if (!button) return;
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
    var main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    });
  });
  update();
}());
