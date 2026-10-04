/* A quiet, site-wide background. No pointer handlers or third-party dependencies. */
(() => {
  const canvas = document.querySelector('.home-network');
  const masthead = document.querySelector('.masthead');
  if (!canvas || !masthead) return;
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
  // No fixed seed or repeating choreography: every load is a fresh arrangement.
  const random = Math.random;
  const cameraPhase = random() * Math.PI * 2;
  const edges = new Set();
  function populate() {
    const count = Math.min(72, Math.max(22, Math.round(width * height / 19000)));
    points = [];
    edges.clear();
    const spacing = Math.min(80, Math.sqrt(width * height / count) * 0.55);
    for (let i = 0; i < count; i++) {
      let x, y;
      for (let attempt = 0; attempt < 60; attempt++) {
        x = random() * width;
        y = random() * height;
        if (points.every(p => Math.hypot(p.x - x, p.y - y) > spacing)) break;
      }
      const angle = random() * Math.PI * 2;
      const speed = 16 + random() * 16;
      points.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        angle, speed, turnAt: elapsed + 2 + random() * 5,
        depthPhase: random() * Math.PI * 2, depthRate: 0.22 + random() * 0.2 });
    }
  }
  function paint(seconds = 0) {
    context.clearRect(0, 0, width, height);
    elapsed += seconds;
    const reach = Math.min(225, Math.max(125, Math.sqrt(width * height / points.length) * 1.65));
    const depthRange = Math.min(210, height * 0.3);
    const focalLength = Math.max(700, width * 0.7);
    const yaw = Math.sin(elapsed * 0.18 + cameraPhase) * 0.10;
    const pitch = Math.cos(elapsed * 0.15 + cameraPhase) * 0.065;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const forces = points.map(() => ({ x: 0, y: 0 }));
    // Gentle separation prevents crowding; there are no attraction centers.
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.max(0.1, Math.hypot(dx, dy));
        if (distance >= 75) continue;
        const push = (75 - distance) * 1.4 / distance;
        forces[i].x += dx * push; forces[i].y += dy * push;
        forces[j].x -= dx * push; forces[j].y -= dy * push;
      }
    }
    points.forEach((point, i) => {
      if (elapsed > point.turnAt) {
        point.angle += (random() - 0.5) * 1.6;
        point.turnAt = elapsed + 3 + random() * 5;
      }
      const blend = 1 - Math.exp(-seconds * 0.6);
      point.vx += (Math.cos(point.angle) * point.speed - point.vx) * blend + forces[i].x * seconds;
      point.vy += (Math.sin(point.angle) * point.speed - point.vy) * blend + forces[i].y * seconds;
      const speed = Math.hypot(point.vx, point.vy);
      if (speed > 42) { point.vx *= 42 / speed; point.vy *= 42 / speed; }
      point.x += point.vx * seconds;
      point.y += point.vy * seconds;
      if (point.x < 0 || point.x > width) { point.vx *= -1; point.angle = Math.PI - point.angle; }
      if (point.y < 0 || point.y > height) { point.vy *= -1; point.angle *= -1; }
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
      // Perspective projection and slow camera rotation provide actual depth;
      // simulation/separation still run in the spread-out underlying field.
      const x = point.x - width / 2;
      const y = point.y - height / 2;
      const z = Math.sin(elapsed * point.depthRate + point.depthPhase) * depthRange;
      const rotatedX = x * cy + z * sy;
      const yawZ = z * cy - x * sy;
      const rotatedY = y * cp - yawZ * sp;
      point.z = y * sp + yawZ * cp;
      const perspective = focalLength / (focalLength - point.z);
      point.px = width / 2 + rotatedX * perspective;
      point.py = height / 2 + rotatedY * perspective;
      point.depth = Math.max(0, Math.min(1, (point.z / Math.max(depthRange, 1) + 1) / 2));
    });
    const candidates = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.hypot(points[i].px - points[j].px, points[i].py - points[j].py,
          (points[i].z - points[j].z) * 0.35);
        if (distance < reach) candidates.push({ i, j, distance, key: `${i}:${j}` });
      }
    }
    // Prefer existing edges to avoid flicker. Three connections per point at most.
    candidates.sort((a, b) => a.distance * (edges.has(a.key) ? 0.8 : 1) - b.distance * (edges.has(b.key) ? 0.8 : 1));
    edges.clear();
    const degree = points.map(() => 0);
    for (const { i, j, distance, key } of candidates) {
      if (degree[i] >= 3 || degree[j] >= 3) continue;
      degree[i]++; degree[j]++; edges.add(key);
      const depth = (points[i].depth + points[j].depth) / 2;
      context.lineWidth = 0.55 + depth * 0.55;
      context.strokeStyle = `rgba(215, 184, 108, ${(0.18 + depth * 0.14) * (1 - distance / reach)})`;
      context.beginPath();
      context.moveTo(points[i].px, points[i].py);
      context.lineTo(points[j].px, points[j].py);
      context.stroke();
    }
    for (const point of points) {
      context.fillStyle = `rgba(220, 193, 127, ${0.14 + point.depth * 0.14})`;
      context.beginPath();
      context.arc(point.px, point.py, 0.9 + point.depth * 1.1, 0, Math.PI * 2);
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
  }
  function resize() {
    // One viewport-sized canvas follows the whole page without allocating
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
})();
