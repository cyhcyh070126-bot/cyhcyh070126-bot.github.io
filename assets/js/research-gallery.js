/* View CV research figures without leaving the page or losing its scroll position. */
(function () {
  "use strict";
  var entries = new Map();
  var group;
  document.querySelectorAll(".cv-project, .research-card").forEach(function (node) {
    if (node.classList.contains("cv-project")) {
      group = [];
      return;
    }
    var link = node.querySelector(":scope > a[href]");
    var image = link && link.querySelector("img");
    if (!link || !image) return;
    if (!group) group = [];
    var source = link.querySelector('source[type="image/webp"]');
    var candidates = source ? source.srcset.split(",").map(function (part) {
      var fields = part.trim().split(/\s+/);
      return { src: fields[0], width: parseInt(fields[1], 10) || 0 };
    }).sort(function (a, b) { return b.width - a.width; }) : [];
    var entry = { link: link, image: image, card: node, group: group,
      source: candidates.length ? candidates[0].src : image.getAttribute("src") };
    group.push(entry);
    entries.set(link, entry);
  });
  if (!entries.size || typeof HTMLDialogElement === "undefined") return;

  // Reuse the site's native-dialog approach (also used by site search).
  var dialog = document.createElement("dialog");
  dialog.className = "research-viewer";
  dialog.setAttribute("aria-labelledby", "research-viewer-title");
  dialog.innerHTML = '<header class="research-viewer__header">' +
    '<h2 id="research-viewer-title"></h2><button type="button" class="research-viewer__close" aria-label="Close image viewer" title="Close (Esc)">×</button></header>' +
    '<div class="research-viewer__media"><p class="research-viewer__message" role="status"></p></div>' +
    '<div class="research-viewer__caption"></div>' +
    '<nav class="research-viewer__controls" aria-label="Image navigation">' +
    '<button type="button" class="research-viewer__previous" aria-label="Previous image">← Previous</button>' +
    '<span class="research-viewer__count" role="status" aria-live="polite"></span>' +
    '<button type="button" class="research-viewer__next" aria-label="Next image">Next →</button>' +
    '<button type="button" class="research-viewer__zoom" aria-pressed="false">Zoom in</button>' +
    '<a class="research-viewer__original" target="_blank" rel="noopener noreferrer">Open original</a></nav>';
  document.body.appendChild(dialog);
  if (typeof dialog.showModal !== "function") { dialog.remove(); return; }
  var media = dialog.querySelector(".research-viewer__media");
  var message = dialog.querySelector(".research-viewer__message");
  var title = dialog.querySelector("h2");
  var caption = dialog.querySelector(".research-viewer__caption");
  var previous = dialog.querySelector(".research-viewer__previous");
  var next = dialog.querySelector(".research-viewer__next");
  var zoom = dialog.querySelector(".research-viewer__zoom");
  var original = dialog.querySelector(".research-viewer__original");
  var count = dialog.querySelector(".research-viewer__count");
  var activeGroup, index, opener, fullImage, revision = 0;
  var scrollX, scrollY;

  function resetZoom() {
    media.classList.remove("is-zoomed");
    if (fullImage) fullImage.style.removeProperty("width");
    zoom.textContent = "Zoom in";
    zoom.setAttribute("aria-pressed", "false");
    media.scrollTo(0, 0);
  }
  function show(position) {
    if (position < 0 || position >= activeGroup.length) return;
    index = position;
    var entry = activeGroup[index];
    var currentRevision = ++revision;
    resetZoom();
    if (fullImage) fullImage.remove();
    var text = entry.card.querySelector("figcaption");
    var heading = text && text.querySelector("strong");
    title.textContent = heading ? heading.textContent : entry.image.alt;
    caption.replaceChildren();
    if (text) {
      var copy = text.cloneNode(true);
      var strong = copy.querySelector("strong");
      if (strong) strong.remove();
      var br = copy.querySelector("br");
      if (br) br.remove();
      caption.append.apply(caption, Array.from(copy.childNodes));
    }
    count.textContent = (index + 1) + " / " + activeGroup.length;
    previous.disabled = index === 0;
    next.disabled = index === activeGroup.length - 1;
    original.href = entry.link.href;
    original.textContent = /\.pdf(?:[?#]|$)/i.test(entry.link.href) ? "Open original PDF ↗" : "Open original image ↗";
    message.textContent = "Loading image…";
    zoom.disabled = true;
    fullImage = new Image();
    var image = fullImage;
    image.className = "research-viewer__image";
    image.alt = entry.image.alt;
    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = function () {
      if (revision !== currentRevision || !dialog.open) return;
      message.textContent = "";
      zoom.disabled = false;
    };
    image.onerror = function () {
      if (revision !== currentRevision || !dialog.open) return;
      var fallback = entry.image.getAttribute("src");
      if (image.getAttribute("src") !== fallback) { image.src = fallback; return; }
      message.textContent = "Unable to load this image. Use the original file link below.";
    };
    image.addEventListener("click", toggleZoom);
    media.appendChild(image);
    image.src = entry.source;
  }
  function toggleZoom() {
    if (!fullImage || !fullImage.naturalWidth) return;
    if (media.classList.contains("is-zoomed")) { resetZoom(); return; }
    media.classList.add("is-zoomed");
    fullImage.style.width = Math.max(fullImage.naturalWidth, media.clientWidth * 2) + "px";
    zoom.textContent = "Fit image";
    zoom.setAttribute("aria-pressed", "true");
  }
  entries.forEach(function (_, link) { link.setAttribute("aria-haspopup", "dialog"); });
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest(".research-card > a[href]");
    var entry = entries.get(link);
    if (!entry || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    activeGroup = entry.group;
    scrollX = window.scrollX;
    scrollY = window.scrollY;
    document.documentElement.classList.add("research-viewer-open");
    dialog.showModal();
    show(activeGroup.indexOf(entry));
  });
  previous.onclick = function () { show(index - 1); };
  next.onclick = function () { show(index + 1); };
  zoom.onclick = toggleZoom;
  dialog.querySelector(".research-viewer__close").onclick = function () { dialog.close(); };
  dialog.addEventListener("cancel", function (event) { event.preventDefault(); dialog.close(); });
  dialog.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); dialog.close(); }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); event.stopPropagation();
      show(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  // Match site search: a drag starting inside must not close on the backdrop.
  var backdropDown = false;
  function outside(event) {
    var box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  }
  dialog.addEventListener("pointerdown", function (event) { backdropDown = event.target === dialog && outside(event); });
  dialog.addEventListener("click", function (event) {
    if (backdropDown && event.target === dialog && outside(event)) dialog.close();
    backdropDown = false;
  });
  dialog.addEventListener("close", function () {
    revision++;
    if (fullImage) { fullImage.remove(); fullImage = null; }
    document.documentElement.classList.remove("research-viewer-open");
    if (opener) opener.focus({ preventScroll: true });
    window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
  });
})();
