/* Short, general mathematical notation; shares the existing network's frame clock. */
(() => {
  const symbols = [
    'x', 'y', 'z', 't', 'u', 'v', 'w', 'E', 'G', 'K', 'M', 'N', 'B', 'W', 'b', 'J',
    'α', 'β', 'γ', 'δ', 'ε', 'η', 'θ', 'κ', 'λ', 'μ', 'ν', 'ρ', 'σ', 'τ', 'ω', 'Ω', 'Γ', 'φ', 'ψ',
    '∇', '∂', '∫', '∑', 'Δ', '∞', '≈', '∝', '↦', '⊗', '∈'
  ];
  const expressions = [
    // Mechanics, field derivatives and constitutive relations.
    '∇·σ', '∇×v', '∇u', '∇²u', 'tr(σ)', 'dev(σ)', 'F = ma', 'σ = Eε',
    'τ = Gγ', 'σ = C:ε', 't = σn', 'δΠ = 0',
    // Finite elements and weak/discrete formulations.
    'Ku = f', 'uₕ = Nq', 'ε = Bq', 'r = f − Ku', 'uₕ ∈ Vₕ',
    'Nᵢ(xⱼ) = δᵢⱼ', '∑Nᵢ = 1', '∇Nᵢ', '∫Ω f dΩ', 'R(u) = 0',
    // Neural networks, differentiation and learning.
    'y = Wx + b', 'h = φ(z)', 'φ(x) = max(0,x)', 'ŷ = fθ(x)', 'L = ‖ŷ − y‖²',
    '∇θ L', '∂L/∂W', 'Jᵀv', 'θ ← θ − η∇θL', 'softmax(z)',
    // Generic neural-operator and spectral notation, without project-specific interfaces.
    'G:A → U', 'u = Gθ(a)', 'Gθ ≈ G', 'Kv', 'v̂ = F(v)', 'F⁻¹(v̂)', 'F⁻¹(K̂v̂)', 'k∗v',
    // General PDE and transport notation.
    '∂ₜu', '∇·v = 0', 'q = −k∇T', 'J = −D∇c', '∂ₜu = α∇²u',
    '∂ₜu + u∂ₓu = 0', 'Δu = 0', '−Δu = f',
    // Probability, optimization and general analysis.
    'X ∼ N(μ,Σ)', 'E[X]', 'Var[X]', 'minθ L', '∇f = 0', '∇²f', '∂f/∂x', '‖r‖₂'
  ];
  const protectedSelector = [
    'img', 'figure', 'table', 'pre', 'video', 'iframe',
    '.research-card', '.home-news', '.page__footer', '.page-contents__panel',
    '.sidebar i', 'svg', 'button', 'input', 'select', 'textarea',
    '[role="dialog"]', 'dialog[open]'
  ].join(', ');
  const overlaps = (a, b, padding = 0) => a.left < b.right + padding &&
    a.right > b.left - padding && a.top < b.bottom + padding && a.bottom > b.top - padding;

  // Slab intersection checks the full segment, including either endpoint.
  function crosses(a, b, box) {
    let low = 0, high = 1;
    for (const [start, delta, min, max] of [
      [a.x, b.x - a.x, box.left, box.right], [a.y, b.y - a.y, box.top, box.bottom]
    ]) {
      if (Math.abs(delta) < 1e-8) { if (start < min || start > max) return false; }
      else {
        const t1 = (min - start) / delta, t2 = (max - start) / delta;
        low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2));
        if (low > high) return false;
      }
    }
    return true;
  }

  window.createHomeFormulas = ({ context, repaint = () => {} }) => {
    // A private random stream keeps decorative text from changing particle randomness.
    const seed = new Uint32Array(1);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(seed);
    else seed[0] = Date.now() >>> 0;
    let state = seed[0] || 1;
    const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    const decks = { symbols: [], expressions: [] };
    const items = [];
    let width = 0, height = 0, top = 0, masks = [], dirty = true, pending = false;
    let view, staticDrawing = false;
    const projections = new Map();
    const padding = 18;
    const font = size => `${size}px "Cambria Math", "STIX Two Math", Georgia, serif`;
    function project(item, x = item.x, y = item.y) {
      const { cy = 1, sy = 0, cp = 1, sp = 0, depthRange = 90,
        focalLength = Math.max(700, width * 0.7), elapsed = 0 } = view || {};
      const z = Math.sin(elapsed * item.depthRate + item.phase) * Math.min(depthRange, 110);
      const dx = x - width / 2, dy = y - height / 2;
      const yawZ = z * cy - dx * sy;
      const pz = dy * sp + yawZ * cp;
      const perspective = focalLength / (focalLength - pz);
      const scale = Math.max(item.kind === 'symbols' ? 0.85 : 0.9,
        Math.min(item.kind === 'symbols' ? 1.15 : 1.1, perspective));
      const px = width / 2 + (dx * cy + z * sy) * perspective;
      const py = height / 2 + (dy * cp - yawZ * sp) * perspective;
      return { x: px, y: py, z: pz, scale,
        box: { left: px - item.width * scale / 2 - 3, right: px + item.width * scale / 2 + 3,
          top: py - item.ascent * scale - 3, bottom: py + item.descent * scale + 3 } };
    }
    function unproject(item, px, py) {
      const { cy = 1, sy = 0, cp = 1, sp = 0, depthRange = 90,
        focalLength = Math.max(700, width * 0.7), elapsed = 0 } = view || {};
      const z = Math.sin(elapsed * item.depthRate + item.phase) * Math.min(depthRange, 110);
      const u = (px - width / 2) / focalLength, v = (py - height / 2) / focalLength;
      const a = cy - u * sy * cp, b = u * sp, c = sy * sp - v * sy * cp, d = cp + v * sp;
      const e = u * (focalLength - z * cy * cp) - z * sy;
      const f = v * (focalLength - z * cy * cp) + z * cy * sp;
      const det = a * d - b * c;
      return { x: width / 2 + (e * d - b * f) / det, y: height / 2 + (a * f - e * c) / det };
    }
    const currentProjection = item => {
      if (!projections.has(item)) projections.set(item, project(item));
      return projections.get(item);
    };
    const bounds = (item, x = item.x, y = item.y) =>
      (x === item.x && y === item.y ? currentProjection(item) : project(item, x, y)).box;
    const moveTo = (item, x, y) => { item.x = x; item.y = y; projections.delete(item); };
    const separation = (a, b) => a.kind === 'expressions' || b.kind === 'expressions' ? 30 : 24;
    function clear(box, except) {
      return box.left >= 12 && box.right <= width - 12 && box.top >= 12 && box.bottom <= height - 12 &&
        !masks.some(mask => overlaps(box, mask)) &&
        !items.some(item => item !== except && item.placed && overlaps(box, bounds(item), separation(item, except)));
    }
    function refresh() {
      pending = false;
      masks = [];
      const addRect = rect => {
        if (!rect.width || !rect.height || rect.bottom < top || rect.top > top + height) return;
        masks.push({ left: rect.left - padding, right: rect.right + padding,
          top: rect.top - top - padding, bottom: rect.bottom - top + padding });
      };
      for (const element of document.querySelectorAll(protectedSelector)) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        addRect(rect);
      }
      // Protect rendered text lines, not entire paragraph/heading layout boxes.
      // This frees genuine white space without letting labels cross any text.
      if (document.createTreeWalker) {
        const lines = [];
        const walker = document.createTreeWalker(document.body, 4);
        for (let node; (node = walker.nextNode());) {
          const parent = node.parentElement;
          if (!parent || !node.nodeValue.trim() || parent.closest(protectedSelector) ||
            parent.closest('script, style, noscript, canvas, svg, [aria-hidden="true"]')) continue;
          const style = window.getComputedStyle(parent);
          if (style.visibility === 'hidden' || style.display === 'none') continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (!rect.width || !rect.height || rect.bottom < top || rect.top > top + height) continue;
            const existing = lines.find(line => Math.abs(line.top - rect.top) < 3 &&
              Math.abs(line.bottom - rect.bottom) < 3 && rect.left <= line.right + 12 && rect.right >= line.left - 12);
            if (existing) {
              existing.left = Math.min(existing.left, rect.left); existing.right = Math.max(existing.right, rect.right);
              existing.top = Math.min(existing.top, rect.top); existing.bottom = Math.max(existing.bottom, rect.bottom);
            } else lines.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
          }
        }
        for (const line of lines) addRect({ ...line, width: line.right - line.left, height: line.bottom - line.top });
      }
      // Nested image/card and text rectangles often cover the same area. Remove
      // contained copies so collision forces do not accumulate on one boundary.
      masks.sort((a, b) => (b.right - b.left) * (b.bottom - b.top) - (a.right - a.left) * (a.bottom - a.top));
      masks = masks.filter((box, i, all) => !all.slice(0, i).some(other =>
        box.left >= other.left && box.right <= other.right && box.top >= other.top && box.bottom <= other.bottom));
      dirty = false;
      if (staticDrawing) repaint();
    }
    function invalidate() {
      dirty = true;
      if (pending) return;
      pending = true;
      requestAnimationFrame(refresh);
    }
    function next(kind) {
      const pool = kind === 'symbols' ? symbols : expressions;
      if (!decks[kind].length) {
        decks[kind] = pool.filter(text => !items.some(item => item.text === text));
        for (let i = decks[kind].length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [decks[kind][i], decks[kind][j]] = [decks[kind][j], decks[kind][i]];
        }
      }
      // Refill boundaries must not introduce duplicates still visible on screen.
      const index = decks[kind].findIndex(text => !items.some(item => item.text === text));
      return index < 0 ? null : decks[kind].splice(index, 1)[0];
    }
    function measure(item) {
      projections.delete(item);
      context.save();
      context.font = font(item.size);
      const metrics = context.measureText(item.text);
      item.width = Math.max(metrics.width, (metrics.actualBoundingBoxLeft || 0) + (metrics.actualBoundingBoxRight || 0));
      item.ascent = Math.max(metrics.actualBoundingBoxAscent || 0, item.size * 0.85);
      item.descent = Math.max(metrics.actualBoundingBoxDescent || 0, item.size * 0.3);
      context.restore();
    }
    function place(item) {
      item.placed = false;
      for (let attempt = 0; attempt < 120; attempt++) {
        const position = unproject(item, 12 + random() * Math.max(0, width - 24),
          12 + random() * Math.max(0, height - 24));
        const { x, y } = position;
        if (!clear(bounds(item, x, y), item)) continue;
        moveTo(item, x, y); item.placed = true;
        return true;
      }
      return false; // A crowded viewport stays readable instead of forcing text into it.
    }
    function renew(item) {
      const text = next(item.kind);
      if (!text) return;
      item.text = text;
      item.size = item.kind === 'symbols' ? 16 + random() * 5 : 13 + random() * 2;
      measure(item);
      // Reserve room for perspective scaling without shrinking the chosen font.
      for (let attempt = 0; item.width * 1.1 > 164 && attempt < 8; attempt++) {
        item.text = next(item.kind) || item.text;
        measure(item);
      }
      const angle = random() * Math.PI * 2;
      const speed = item.kind === 'symbols' ? 16 + random() * 8 : 12 + random() * 8;
      item.vx = Math.cos(angle) * speed; item.vy = Math.sin(angle) * speed;
      item.cruise = speed; item.heading = angle;
      item.age = 0; item.life = 24 + random() * 14; item.retry = 0;
      item.phase = random() * Math.PI * 2; item.depthRate = 0.10 + random() * 0.06;
      projections.delete(item);
      item.connections = [];
      place(item);
    }
    function resize(w, h, offset) {
      width = w; height = h; top = offset;
      projections.clear();
      refresh();
      const area = width * height;
      const symbolCount = Math.min(24, Math.max(8, Math.round(area / 70000)));
      const referenceCount = Math.round(Math.min(64, Math.max(20, area / 26000)));
      const formulaCount = Math.min(11, Math.max(6, Math.round(referenceCount / 6)));
      const wanted = [...Array(symbolCount).fill('symbols'), ...Array(formulaCount).fill('expressions')];
      // Keep existing choices through resizes; move only labels that no longer fit.
      for (let i = items.length - 1; i >= 0; i--) {
        const index = wanted.indexOf(items[i].kind);
        if (index < 0) items.splice(i, 1);
        else wanted.splice(index, 1);
      }
      for (const item of items) {
        measure(item);
        if (!item.placed || !clear(bounds(item), item)) { item.age = 0; place(item); }
      }
      for (const kind of wanted) {
        const item = { kind, placed: false };
        items.push(item); renew(item);
      }
    }
    function recoverContact(item) {
      const current = currentProjection(item), box = current.box, options = [];
      const add = (dx, dy) => {
        // Small contact corrections remain continuous; major reflows use a fresh free area.
        if (Math.hypot(dx, dy) <= 48) options.push({ dx, dy });
      };
      if (box.left < 12) add(12 - box.left + 0.5, 0);
      if (box.right > width - 12) add(width - 12 - box.right - 0.5, 0);
      if (box.top < 12) add(0, 12 - box.top + 0.5);
      if (box.bottom > height - 12) add(0, height - 12 - box.bottom - 0.5);
      const obstacles = masks.slice();
      for (const other of items) if (other !== item && other.placed) {
        const b = bounds(other);
        const gap = separation(item, other);
        obstacles.push({ left: b.left - gap, right: b.right + gap, top: b.top - gap, bottom: b.bottom + gap });
      }
      for (const obstacle of obstacles) if (overlaps(box, obstacle)) {
        add(obstacle.left - box.right - 0.5, 0); add(obstacle.right - box.left + 0.5, 0);
        add(0, obstacle.top - box.bottom - 0.5); add(0, obstacle.bottom - box.top + 0.5);
      }
      options.sort((a, b) => Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy));
      for (const { dx, dy } of options) {
        const position = unproject(item, current.x + dx, current.y + dy);
        if (!clear(bounds(item, position.x, position.y), item)) continue;
        moveTo(item, position.x, position.y);
        // Damped outward motion makes contact visible without a sudden, fast kick.
        if (dx) item.vx = Math.sign(dx) * Math.max(4, Math.abs(item.vx) * 0.7);
        if (dy) item.vy = Math.sign(dy) * Math.max(4, Math.abs(item.vy) * 0.7);
        return true;
      }
      return false;
    }
    function steer(item, seconds, points) {
      const projected = currentProjection(item), box = projected.box;
      let fx = 0, fy = 0;
      const buffer = 42;
      const repel = obstacle => {
        if (!overlaps(box, obstacle, buffer)) return;
        const distances = [Math.abs(box.right - obstacle.left), Math.abs(obstacle.right - box.left),
          Math.abs(box.bottom - obstacle.top), Math.abs(obstacle.bottom - box.top)];
        const edge = distances.indexOf(Math.min(...distances));
        const force = 26 * Math.max(0, 1 - distances[edge] / buffer);
        if (edge === 0) fx -= force;
        if (edge === 1) fx += force;
        if (edge === 2) fy -= force;
        if (edge === 3) fy += force;
      };
      masks.forEach(repel);
      for (const other of items) if (other !== item && other.placed) {
        const b = bounds(other), gap = separation(item, other);
        repel({ left: b.left - gap, right: b.right + gap, top: b.top - gap, bottom: b.bottom + gap });
      }
      if (box.left < 40) fx += (40 - box.left) * 0.6;
      if (box.right > width - 40) fx -= (box.right - width + 40) * 0.6;
      if (box.top < 40) fy += (40 - box.top) * 0.6;
      if (box.bottom > height - 40) fy -= (box.bottom - height + 40) * 0.6;
      // One-way steering: labels can yield to points, but never write to point state.
      for (const point of points) {
        const dx = projected.x - point.px, dy = projected.y - point.py;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance < 24) { fx += dx / distance * (24 - distance) * 0.15; fy += dy / distance * (24 - distance) * 0.15; }
      }
      item.vx += fx * seconds; item.vy += fy * seconds;
      let speed = Math.hypot(item.vx, item.vy);
      // Gradually recover cruising speed after a damped contact, instead of
      // spending the rest of a label's lifetime almost stationary.
      if (speed < item.cruise) {
        const recovered = speed + (item.cruise - speed) * (1 - Math.exp(-seconds * 0.8));
        const angle = speed > 0.1 ? Math.atan2(item.vy, item.vx) : item.heading;
        item.vx = Math.cos(angle) * recovered; item.vy = Math.sin(angle) * recovered;
        speed = recovered;
      }
      if (speed > 0.1) item.heading = Math.atan2(item.vy, item.vx);
      if (speed > 28) { item.vx *= 28 / speed; item.vy *= 28 / speed; }
      const x = item.x + item.vx * seconds, y = item.y + item.vy * seconds;
      if (clear(bounds(item, x, y), item)) moveTo(item, x, y);
      else {
        // Stop before contact; turn into the free direction without an elastic kick.
        if (!clear(bounds(item, x, item.y), item)) item.vx *= -0.5;
        if (!clear(bounds(item, item.x, y), item)) item.vy *= -0.5;
      }
    }
    function drawLink(label, target, alpha, lightTheme, active) {
      const box = label.box, center = { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
      const dx = target.x - center.x, dy = target.y - center.y;
      if (Math.hypot(dx, dy) < 1) return;
      const fraction = Math.min((box.right - box.left) / 2 / Math.max(Math.abs(dx), 0.001),
        (box.bottom - box.top) / 2 / Math.max(Math.abs(dy), 0.001));
      if (fraction >= 1) return;
      const start = { x: center.x + dx * fraction, y: center.y + dy * fraction };
      if (masks.some(mask => crosses(start, target, mask)) ||
        active.some(other => other !== label && crosses(start, target, other.box))) return;
      context.lineWidth = 0.6 + (label.scale - 0.85) * 1.2;
      context.strokeStyle = lightTheme ? `rgba(190, 151, 75, ${alpha})` : `rgba(220, 193, 127, ${alpha})`;
      context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(target.x, target.y); context.stroke();
    }
    function draw(seconds, lightTheme, staticFrame = false, points = [], pointer = {}, camera) {
      staticDrawing = staticFrame;
      if (camera) view = camera;
      projections.clear();
      // Hide labels during the site's moving entrance, then measure its settled content.
      if (dirty || document.documentElement?.classList?.contains('site-enter')) return;
      const active = [];
      for (const item of items) {
        item.age += seconds;
        if (!item.placed) {
          item.retry -= seconds;
          if (item.retry <= 0) { place(item); item.retry = 2; item.age = 0; }
        }
        if (!item.placed) continue;
        if (item.age > item.life) { renew(item); continue; }
        if (!clear(bounds(item), item) && !recoverContact(item)) {
          item.placed = false; item.retry = 0; continue;
        }
        if (seconds) steer(item, seconds, points);
        const projected = currentProjection(item);
        const fade = staticFrame ? 1 : Math.max(0, Math.min(1, item.age / 1.6, (item.life - item.age) / 1.6));
        active.push({ ...projected, item, fade });
      }
      context.save();
      for (const label of active) {
        const { item, fade } = label;
        if (fade < 0.02) continue;
        const reach = 185;
        const nearby = points.map((point, index) => ({ point, index,
          distance: Math.hypot(label.x - point.px, label.y - point.py, (label.z - point.z) * 0.2) }))
          .filter(candidate => candidate.distance < reach)
          .sort((a, b) => a.distance * (item.connections.includes(a.index) ? 0.8 : 1) -
            b.distance * (item.connections.includes(b.index) ? 0.8 : 1))
          .slice(0, item.kind === 'symbols' ? 2 : 1);
        item.connections = nearby.map(candidate => candidate.index);
        for (const { point, distance } of nearby) drawLink(label, { x: point.px, y: point.py },
          0.19 * fade * (1 - distance / reach), lightTheme, active);
      }
      if (pointer.active) {
        const nearby = active.map(label => ({ label, distance: Math.hypot(label.x - pointer.x, label.y - pointer.y) }))
          .filter(({ distance, label }) => distance < 180 && label.fade > 0.02)
          .sort((a, b) => a.distance - b.distance).slice(0, 2);
        for (const { label, distance } of nearby) drawLink(label, pointer,
          0.36 * label.fade * (1 - distance / 180), lightTheme, active);
      }
      context.textAlign = 'center'; context.textBaseline = 'alphabetic';
      for (const label of active) {
        const { item, scale, fade } = label;
        const depth = Math.max(0, Math.min(1, (scale - 0.85) / 0.3));
        const alpha = (item.kind === 'symbols' ? 0.29 : 0.34) * fade * (0.85 + 0.25 * depth);
        context.font = font(item.size * scale);
        context.fillStyle = lightTheme ? `rgba(159, 114, 40, ${alpha})` : `rgba(220, 193, 127, ${alpha})`;
        context.fillText(item.text, label.x, label.y);
      }
      context.restore();
    }
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('pageshow', invalidate);
    document.addEventListener('load', invalidate, true);
    const observer = new ResizeObserver(invalidate);
    for (const element of document.querySelectorAll('#main, .sidebar, .page__content')) observer.observe(element);
    new MutationObserver(invalidate).observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ['class', 'hidden', 'open']
    });
    new MutationObserver(invalidate).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    document.fonts?.ready.then(() => { for (const item of items) measure(item); invalidate(); });
    return { resize, draw };
  };
})();
