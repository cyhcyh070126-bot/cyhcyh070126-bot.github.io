const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

function setup(rectangles = []) {
  const frames = [], events = {}, labels = [], lines = [];
  let lineStart;
  let selected = rectangles, mutations;
  const context = { save() {}, restore() {}, beginPath() {}, stroke() {},
    moveTo(x, y) { lineStart = { x, y }; }, lineTo(x, y) { lines.push({ a: lineStart, b: { x, y } }); },
    measureText(text) { return { width: text.length * 8, actualBoundingBoxAscent: 12, actualBoundingBoxDescent: 3 }; },
    fillText(text, x, y) { labels.push({ text, x, y, color: this.fillStyle }); }
  };
  const document = { body: {},
    querySelectorAll(selector) { return selector.startsWith('img, figure') ? selected.map(rect => ({ getBoundingClientRect: () => rect })) : []; },
    addEventListener(name, cb) { events[name] = cb; }
  };
  let mathRandomCalls = 0;
  const window = { crypto: { getRandomValues(seed) { seed[0] = 42; } },
    getComputedStyle() { return { display: 'block', visibility: 'visible' }; },
    addEventListener(name, cb) { events[name] = cb; }
  };
  runInNewContext(readFileSync(join(__dirname, '../assets/js/home-formulas.js'), 'utf8'), {
    window, document, Uint32Array, Date,
    Math: Object.assign(Object.create(Math), { random() { mathRandomCalls++; return 0.5; } }),
    requestAnimationFrame: cb => { frames.push(cb); },
    ResizeObserver: class { observe() {} },
    MutationObserver: class { constructor(cb) { mutations = cb; } observe() {} }
  });
  const layer = window.createHomeFormulas({ context });
  return { layer, labels, lines, frames, events, context, randomCalls: () => mathRandomCalls,
    setRectangles(next) { selected = next; mutations(); },
    draw(seconds = 0.04, staticFrame = false, points = [], pointer = {}) {
      labels.length = 0; lines.length = 0;
      layer.draw(seconds, true, staticFrame, points, pointer); return labels;
    },
    refresh() { while (frames.length) frames.shift()(); }
  };
}

test('short notation is varied, unique in a frame and uses no particle randomness or extra animation loop', () => {
  const app = setup(); app.layer.resize(1440, 900, 64);
  const seen = new Set();
  for (let i = 0; i < 2400; i++) {
    const labels = app.draw(0.1);
    assert.equal(new Set(labels.map(x => x.text)).size, labels.length);
    for (const { text, x, y } of labels) { seen.add(text); assert(Number.isFinite(x) && Number.isFinite(y)); }
  }
  assert(seen.size > 55, `Expected a broad rotating library, saw ${seen.size}`);
  assert.equal(app.randomCalls(), 0);
  assert.equal(app.frames.length, 0);
});

test('a typical desktop has eight or more complete expressions instead of a four-formula limit', () => {
  const app = setup(); app.layer.resize(1440, 935, 65);
  const labels = app.draw(0, true);
  const expressions = labels.filter(item => item.text.length > 1);
  assert(expressions.length >= 8 && expressions.length <= 11);
  assert(labels.length >= 24);
});

test('entire label boxes avoid protected content with canvas offset after scrolling and layout changes', () => {
  const rect = { left: 300, right: 1100, top: 150, bottom: 750, width: 800, height: 600 };
  const app = setup([rect]); app.layer.resize(1440, 900, 64);
  for (let i = 0; i < 800; i++) {
    for (const { text, x, y } of app.draw(0.1)) {
      const halfWidth = text.length * 8 / 2 + 3;
      assert(x + halfWidth <= 286 || x - halfWidth >= 1114 || y + 64 + 3 <= 136 || y + 64 - 12 >= 764);
    }
  }
  app.setRectangles([{ left: 0, right: 1440, top: 64, bottom: 964, width: 1440, height: 900 }]);
  assert.equal(app.draw().length, 0, 'Stale geometry must not be drawn');
  app.refresh(); assert.equal(app.draw().length, 0, 'Full content coverage leaves no labels over text');
});

test('reduced motion can show static notation; narrow screens stay bounded and sparse', () => {
  const app = setup(); app.layer.resize(390, 740, 64);
  const initial = app.draw(0, true);
  assert(initial.length > 0 && initial.length <= 14);
  assert(initial.every(x => !x.color.endsWith(', 0)')));
  const before = JSON.stringify(initial);
  assert.equal(JSON.stringify(app.draw(0, true)), before);
  for (let i = 0; i < 100; i++) for (const { x, y } of app.draw()) assert(x > 12 && x < 378 && y > 12 && y < 728);
});

test('notation uses elapsed time consistently across display refresh rates', () => {
  const results = [];
  for (const rate of [60, 120, 144]) {
    const app = setup(); app.layer.resize(1800, 1200, 64);
    for (let i = 0; i < rate; i++) app.draw(1 / rate);
    results.push(app.labels.map(({ text, x, y }) => ({ text, x, y })));
  }
  for (let i = 1; i < results.length; i++) {
    assert.deepEqual(results[i].map(x => x.text), results[0].map(x => x.text));
    results[i].forEach((p, j) => assert(Math.hypot(p.x - results[0][j].x, p.y - results[0][j].y) < 0.5,
      'Time-based steering should agree to within half a CSS pixel after one second'));
  }
});

test('asset order loads notation before the network, and point algorithm is left intact', () => {
  const scripts = readFileSync(join(__dirname, '../_includes/scripts.html'), 'utf8');
  assert(scripts.indexOf('/assets/js/home-formulas.js') < scripts.indexOf('/assets/js/home-network.js'));
  const source = readFileSync(join(__dirname, '../assets/js/home-network.js'), 'utf8');
  assert(source.includes('paint(previous ? Math.min((time - previous) / 1000, 0.1) : 0)'));
  assert(!source.includes('1000 / 30'));
});

test('notation keeps rotating after multiple deck cycles instead of stalling on visible entries', () => {
  const app = setup(); app.layer.resize(1440, 900, 64);
  const late = new Set();
  for (let i = 0; i < 12000; i++) {
    const labels = app.draw(0.1);
    if (i > 11000) for (const item of labels) late.add(item.text);
  }
  assert(late.size > 35, 'A broad set of new choices should still appear late in a long session');
});

test('labels connect to points and the cursor while full segments avoid a narrow text obstacle', () => {
  const app = setup(); app.layer.resize(1440, 900, 64);
  const label = app.draw(0, true).find(l => l.text.length === 1 && l.x > 100 && l.x < 1100);
  const target = Object.freeze({ px: label.x + 160, py: label.y, z: 0 });
  const cursor = { x: target.px, y: target.py, active: true };
  app.draw(0, true, [target], cursor);
  assert(app.lines.length > 0, 'Nearby labels should participate in sparse connections');
  // The obstacle is away from the line midpoint, so checking only that midpoint fails.
  const obstacle = { left: label.x + 110, right: label.x + 114, top: label.y + 64 - 20,
    bottom: label.y + 64 + 20, width: 4, height: 40 };
  app.setRectangles([obstacle]); app.refresh(); app.draw(0, true, [target], cursor);
  for (const { a, b } of app.lines) {
    for (let i = 0; i <= 200; i++) {
      const x = a.x + (b.x - a.x) * i / 200, y = a.y + (b.y - a.y) * i / 200 + 64;
      assert(!(x >= obstacle.left - 18 && x <= obstacle.right + 18 &&
        y >= obstacle.top - 18 && y <= obstacle.bottom + 18));
    }
  }
  assert.equal(target.px, label.x + 160, 'The original point must not be moved');
});

test('a small contact pushes the label gently outward and rebounds without adding click effects', () => {
  const app = setup(); app.layer.resize(1440, 900, 64);
  const label = app.draw(0, true).find(l => l.text.length === 1 && l.x > 100 && l.x < 1100);
  app.setRectangles([{ left: label.x + 22, right: label.x + 26,
    top: label.y + 64 - 20, bottom: label.y + 64 + 20, width: 4, height: 40 }]);
  app.refresh();
  const afterContact = app.draw(0, true).find(l => l.text === label.text);
  assert(afterContact, 'A shallow contact should retain the label instead of replacing it');
  assert(afterContact.x < label.x && afterContact.x > label.x - 20);
  for (let i = 0; i < 30; i++) app.draw(1 / 60, true);
  const afterRebound = app.labels.find(l => l.text === label.text);
  assert(afterRebound && afterRebound.x < afterContact.x);
  assert.equal(app.events.click, undefined);
});
