/* A quiet, Home-only background. No pointer handlers or third-party dependencies. */
(() => {
  const canvas = document.querySelector('.home-network');
  const button = document.querySelector('.home-network-toggle');
  const news = document.querySelector('.home-page #news');
  const masthead = document.querySelector('.masthead');
  if (!canvas || !button || !news || !masthead) return;
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
  // A fixed seed avoids a different composition after every resize.
  function populate() {
    let seed = 29;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const count = Math.min(64, Math.max(20, Math.round(width * height / 20000)));
    points = Array.from({ length: count }, () => ({
      x: random() * width, y: random() * height,
      vx: (random() - 0.5) * 28, vy: (random() - 0.5) * 28,
      phase: random() * Math.PI * 2
    }));
  }
  function paint(seconds = 0) {
    context.clearRect(0, 0, width, height);
    elapsed += seconds;
    const reach = Math.min(220, width * 0.45);
    for (const point of points) {
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
      context.fillStyle = 'rgba(207, 168, 70, 0.55)';
      context.beginPath();
      context.arc(a.px, a.py, 1.9, 0, Math.PI * 2);
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
    const rect = host.getBoundingClientRect();
    // Cover the entire page width, from the masthead rule to just above News.
    // Use document coordinates so resizing while scrolled keeps the same bounds.
    const top = masthead.getBoundingClientRect().height;
    const nextWidth = document.documentElement.clientWidth;
    const nextHeight = Math.max(0, Math.round(news.getBoundingClientRect().top + window.scrollY - top - 12));
    canvas.style.left = `${-rect.left}px`;
    canvas.style.top = `${top - rect.top - window.scrollY}px`;
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
