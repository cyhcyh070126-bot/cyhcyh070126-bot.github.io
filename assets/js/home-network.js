/* A quiet, site-wide background with nearby mouse connections. No dependencies. */
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
  let canvasTop = 0;
  let elapsed = 0;
  let points = [];
  const ripples = [];
  const pointer = { x: 0, y: 0, active: false };
  // No fixed seed or repeating choreography: every load is a fresh arrangement.
  const random = Math.random;
  // Retain the current particle speed independently of removed notation.
  const motionScale = 1.2;
  const cameraPhase = random() * Math.PI * 2;
  const edges = new Set();
  function populate() {
    const count = Math.min(80, Math.max(36, Math.round(width * height / 19000)));
    // Retain existing particles on resize (including mobile browser chrome).
    // Only add or remove the number needed for the new visible area.
    points.length = Math.min(points.length, count);
    const spacing = Math.min(80, Math.sqrt(width * height / count) * 0.55);
    for (let i = points.length; i < count; i++) {
      let x, y;
      for (let attempt = 0; attempt < 60; attempt++) {
        x = random() * width;
        y = random() * height;
        if (points.every(p => Math.hypot(p.x - x, p.y - y) > spacing)) break;
      }
      const angle = random() * Math.PI * 2;
      const speed = (20 + random() * 20) * motionScale;
      points.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        angle, speed, turnAt: elapsed + 2 + random() * 5,
        depthPhase: random() * Math.PI * 2, depthRate: 0.22 + random() * 0.2 });
    }
  }
  function paint(seconds = 0) {
    context.clearRect(0, 0, width, height);
    elapsed += seconds;
    const lightTheme = document.documentElement.dataset?.theme !== 'dark';
    const intensity = lightTheme ? 1.1 : 1;
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
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= 75 * 75 || distanceSquared === 0) continue;
        const distance = Math.sqrt(Math.max(0.01, distanceSquared));
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
      if (speed > 42 * motionScale) { point.vx *= 42 * motionScale / speed; point.vy *= 42 * motionScale / speed; }
      point.x += point.vx * seconds;
      point.y += point.vy * seconds;
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
      // Bounce at the visible canvas edges, after perspective, so near points
      // cannot drift beyond the screen before their underlying position turns.
      const insetX = Math.min(4, width / 2), insetY = Math.min(4, height / 2);
      const hitX = point.px < insetX || point.px > width - insetX;
      const hitY = point.py < insetY || point.py > height - insetY;
      if (hitX || hitY) {
        // Give grazing contacts a clear inward impulse instead of reflecting
        // a nearly zero normal velocity and leaving the particle on the edge.
        const reboundSpeed = 40 * motionScale;
        if (hitX) point.vx = (point.px < insetX ? 1 : -1) * Math.max(reboundSpeed, Math.abs(point.vx));
        if (hitY) point.vy = (point.py < insetY ? 1 : -1) * Math.max(reboundSpeed, Math.abs(point.vy));
        point.angle = Math.atan2(point.vy, point.vx);
        point.px = Math.max(insetX, Math.min(width - insetX, point.px));
        point.py = Math.max(insetY, Math.min(height - insetY, point.py));
        // Unproject the corrected position onto its original depth plane.
        // This keeps motion continuous instead of only clipping the drawing.
        const u = (point.px - width / 2) / focalLength;
        const v = (point.py - height / 2) / focalLength;
        const a = cy - u * sy * cp, b = u * sp;
        const c = sy * sp - v * sy * cp, d = cp + v * sp;
        const e = u * (focalLength - z * cy * cp) - z * sy;
        const f = v * (focalLength - z * cy * cp) + z * cy * sp;
        const determinant = a * d - b * c;
        const correctedX = (e * d - b * f) / determinant;
        const correctedY = (a * f - e * c) / determinant;
        point.x = width / 2 + correctedX;
        point.y = height / 2 + correctedY;
        point.z = correctedY * sp + (z * cy - correctedX * sy) * cp;
      }
      point.depth = Math.max(0, Math.min(1, (point.z / Math.max(depthRange, 1) + 1) / 2));
      // Edge points have fewer possible neighbours outside the visible area.
      // Compensate locally without increasing density in the screen centre.
      const edgeDistance = Math.min(point.px, width - point.px, point.py, height - point.py);
      point.reach = reach * (1 + 0.35 * Math.max(0, 1 - edgeDistance / reach));
    });
    const candidates = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].px - points[j].px;
        const dy = points[i].py - points[j].py;
        const dz = (points[i].z - points[j].z) * 0.35;
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        const pairReach = Math.max(points[i].reach, points[j].reach);
        if (distanceSquared < pairReach * pairReach) {
          candidates.push({ i, j, distance: Math.sqrt(distanceSquared), reach: pairReach, key: `${i}:${j}` });
        }
      }
    }
    // Prefer existing edges to avoid flicker. Six connections per point at most.
    candidates.sort((a, b) => a.distance * (edges.has(a.key) ? 0.8 : 1) - b.distance * (edges.has(b.key) ? 0.8 : 1));
    edges.clear();
    const degree = points.map(() => 0);
    // Give sparsely connected points a turn before filling denser clusters.
    for (const minimum of [2, 6]) {
      for (const { i, j, key } of candidates) {
        if (edges.has(key) || degree[i] >= 6 || degree[j] >= 6) continue;
        if (degree[i] >= minimum && degree[j] >= minimum) continue;
        degree[i]++; degree[j]++; edges.add(key);
      }
    }
    for (const { i, j, distance, reach: pairReach, key } of candidates) {
      if (!edges.has(key)) continue;
      const depth = (points[i].depth + points[j].depth) / 2;
      const proximity = 1 - distance / pairReach;
      // Lift longer edges gently while still fading to zero at the cutoff.
      const visibility = proximity * (1 + 0.35 * (1 - proximity));
      context.lineWidth = 0.55 + depth * 0.55;
      context.strokeStyle = `rgba(215, 184, 108, ${(0.18 + depth * 0.14) * visibility * intensity})`;
      context.beginPath();
      context.moveTo(points[i].px, points[i].py);
      context.lineTo(points[j].px, points[j].py);
      context.stroke();
    }
    if (pointer.active) {
      const nearby = points.map(point => ({ point, distance: Math.hypot(point.px - pointer.x, point.py - pointer.y) }))
        .filter(({ distance }) => distance < reach)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);
      for (const { point, distance } of nearby) {
        const proximity = 1 - distance / reach;
        context.lineWidth = 0.8 + point.depth * 0.4;
        context.strokeStyle = `rgba(215, 184, 108, ${(0.36 + point.depth * 0.14) * proximity * intensity})`;
        context.beginPath();
        context.moveTo(point.px, point.py);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }
    }
    for (const point of points) {
      const distantLift = 0.02 * (1 - point.depth);
      context.fillStyle = `rgba(220, 193, 127, ${(0.14 + point.depth * 0.14 + distantLift) * intensity})`;
      context.beginPath();
      context.arc(point.px, point.py, 0.9 + point.depth * 1.1, 0, Math.PI * 2);
      context.fill();
    }
    // Reference expanding ring: radius 130, width 1.5, fading from alpha 0.5.
    // 0.045 per 60 Hz frame becomes 2.7 per second; rAF stays uncapped.
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.progress += seconds * 2.7;
      if (ripple.progress >= 1) { ripples.splice(i, 1); continue; }
      if (ripple.progress <= 0) continue;
      context.lineWidth = 1.5;
      context.strokeStyle = `rgba(215, 184, 108, ${0.5 * (1 - ripple.progress)})`;
      context.beginPath();
      context.arc(ripple.x, ripple.y, 130 * ripple.progress, 0, Math.PI * 2);
      context.stroke();
    }
  }
  function tick(time) {
    frame = requestAnimationFrame(tick);
    // Follow the display refresh rate; elapsed time keeps particle speed consistent.
    // Do no layout reads inside the animation loop.
    paint(previous ? Math.min((time - previous) / 1000, 0.1) : 0);
    previous = time;
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (paused || !visible || document.hidden) clearInteraction();
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function clearPointer() {
    if (!pointer.active) return;
    pointer.active = false;
    paint();
  }
  function clearInteraction() {
    const redraw = pointer.active || ripples.length > 0;
    pointer.active = false;
    ripples.length = 0;
    if (redraw) paint();
  }
  function trackPointer(event) {
    if (paused || !visible || document.hidden || event.pointerType !== 'mouse') {
      clearPointer();
      return;
    }
    pointer.x = event.clientX;
    pointer.y = event.clientY - canvasTop;
    pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
  }
  function repelFromClick(event) {
    if (paused || !visible || document.hidden || event.button !== 0 || event.defaultPrevented ||
      (event.pointerType && event.pointerType !== 'mouse') || event.sourceCapabilities?.firesTouchEvents) return;
    // Leave links, images, controls and text editing to their existing handlers.
    if (event.target?.closest?.('a, img, picture, button, input, textarea, select, summary, [role="button"], [contenteditable="true"]')) return;
    const x = event.clientX, y = event.clientY - canvasTop;
    if (x < 0 || x > width || y < 0 || y > height) return;
    ripples.push({ x, y, progress: 0 });
    const radius = 170;
    for (const point of points) {
      const dx = point.px - x, dy = point.py - y;
      const distance = Math.hypot(dx, dy);
      if (distance >= radius || distance <= 0.001) continue;
      // Reference radial impulse: 3 px/frame at 60 Hz becomes 180 px/s.
      // The existing speed limit and cruising blend handle the return to normal.
      const strength = 180 * (1 - distance / radius);
      point.vx += dx / distance * strength;
      point.vy += dy / distance * strength;
    }
  }
  function resize() {
    // One viewport-sized canvas follows the whole page without allocating
    // a canvas as tall as the document. The fixed masthead remains clear.
    const top = masthead.getBoundingClientRect().height;
    canvasTop = top;
    clearInteraction();
    const nextWidth = document.documentElement.clientWidth;
    const nextHeight = Math.max(0, Math.round(window.innerHeight - top));
    canvas.style.top = `${top}px`;
    canvas.style.width = `${nextWidth}px`;
    if (nextWidth === width && nextHeight === height) return;
    if (width > 0 && height > 0) {
      for (const point of points) {
        point.x *= nextWidth / width;
        point.y *= nextHeight / height;
      }
    }
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
  // Listen on the window: the decorative canvas must never intercept links or images.
  window.addEventListener('pointermove', trackPointer, { passive: true });
  window.addEventListener('click', repelFromClick, { passive: true });
  window.addEventListener('pointerout', event => { if (!event.relatedTarget) clearPointer(); }, { passive: true });
  window.addEventListener('pointercancel', clearPointer, { passive: true });
  window.addEventListener('blur', clearPointer);
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
