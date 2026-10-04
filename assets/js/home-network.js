/* A quiet, Home-only background. No pointer handlers or third-party dependencies. */
(() => {
  const canvas = document.querySelector('.home-network');
  const button = document.querySelector('.home-network-toggle');
  const masthead = document.querySelector('.masthead');
  if (!canvas || !button || !masthead) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const host = canvas.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = false;
  let frame = 0;
  let previous = 0;
  let width = 0;
  let height = 0;
  let elapsed = 0;
  let points = [];
  let centers = [];
  let nextFormation = 0;
  let formation = 0;
  let seed = 29;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  function reshape() {
    // Reassign particles to different numbers of moving destinations. Existing
    // networks split, travel and join again instead of remaining fixed islands.
    const groups = [3, 8, 4, 7, 2, 6][formation++ % 6];
    const columns = Math.ceil(Math.sqrt(groups * width / Math.max(height, 1)));
    const rows = Math.ceil(groups / columns);
    centers = Array.from({ length: groups }, (_, i) => ({
      x: ((i % columns) + 0.3 + random() * 0.4) * width / columns,
      y: (Math.floor(i / columns) + 0.3 + random() * 0.4) * height / rows,
      phase: random() * Math.PI * 2
    }));
    for (const point of points) {
      point.group = Math.floor(random() * groups);
      const angle = random() * Math.PI * 2;
      const radius = (35 + random() * 100) * Math.min(1, width / 700);
      point.ox = Math.cos(angle) * radius;
      point.oy = Math.sin(angle) * radius;
      // A few independent particles bridge groups and keep empty space alive.
      point.free = random() < 0.18;
      point.tx = random() * width;
      point.ty = random() * height;
    }
    nextFormation = elapsed + 12;
  }
  // A fixed seed avoids a different composition after every resize.
  function populate() {
    seed = 29;
    formation = 0;
    const count = Math.min(84, Math.max(28, Math.round(width * height / 14000)));
    points = Array.from({ length: count }, () => ({
      x: random() * width, y: random() * height,
      vx: (random() - 0.5) * 28, vy: (random() - 0.5) * 28,
      phase: random() * Math.PI * 2
    }));
    reshape();
  }
  function paint(seconds = 0) {
    context.clearRect(0, 0, width, height);
    elapsed += seconds;
    if (elapsed >= nextFormation) reshape();
    const reach = Math.min(210, Math.max(100, Math.min(width, height) * 0.3));
    for (const point of points) {
      const center = centers[point.group];
      const tx = point.free ? point.tx : center.x + point.ox + 28 * Math.sin(elapsed * 0.35 + center.phase);
      const ty = point.free ? point.ty : center.y + point.oy + 24 * Math.cos(elapsed * 0.4 + center.phase);
      let vx = (tx - point.x) * 0.45 + 9 * Math.sin(elapsed * 0.7 + point.phase);
      let vy = (ty - point.y) * 0.45 + 9 * Math.cos(elapsed * 0.6 + point.phase);
      const speed = Math.hypot(vx, vy);
      if (speed > 65) { vx *= 65 / speed; vy *= 65 / speed; }
      const blend = 1 - Math.exp(-seconds * 1.8);
      point.vx += (vx - point.vx) * blend;
      point.vy += (vy - point.vy) * blend;
      point.x += point.vx * seconds;
      point.y += point.vy * seconds;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
      // Independent depth cycles gently fold and unfold the projected network.
      const depth = 1 + 0.07 * Math.sin(elapsed * 0.55 + point.phase);
      point.px = width / 2 + (point.x - width / 2) * depth;
      point.py = height / 2 + (point.y - height / 2) * depth;
    }
    context.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const distance = Math.hypot(a.px - b.px, a.py - b.py);
        if (distance >= reach) continue;
        context.strokeStyle = `rgba(207, 168, 70, ${0.42 * (1 - distance / reach)})`;
        context.beginPath();
        context.moveTo(a.px, a.py);
        context.lineTo(b.px, b.py);
        context.stroke();
      }
      context.fillStyle = 'rgba(218, 188, 114, 0.28)';
      context.beginPath();
      context.arc(a.px, a.py, 1.6, 0, Math.PI * 2);
      context.fill();
    }
  }
  function tick(time) {
    frame = requestAnimationFrame(tick);
    // Cap drawing at 30 fps; do no layout reads inside the animation loop.
    if (time - previous < 1000 / 30) return;
    paint(previous ? Math.min((time - previous) / 1000, 0.1) : 0);
    previous = time;
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
    button.dataset.paused = String(paused);
    const label = paused ? 'Play background animation' : 'Pause background animation';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  function resize() {
    // One viewport-sized canvas follows the whole Home page without allocating
    // a canvas as tall as the document. The fixed masthead remains clear.
    const top = masthead.getBoundingClientRect().height;
    const nextWidth = document.documentElement.clientWidth;
    const nextHeight = Math.max(0, Math.round(window.innerHeight - top));
    canvas.style.top = `${top}px`;
    canvas.style.width = `${nextWidth}px`;
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    populate();
    paint();
  }
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', () => { visible = false; sync(); });
  window.addEventListener('pageshow', () => {
    const rect = canvas.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < window.innerHeight;
    sync();
  });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(host);
  sizeObserver.observe(masthead);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  resize();
  sync();
  button.hidden = false;
})();
