const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

function setup(reduce = false) {
  const events = {};
  const callbacks = new Map();
  let id = 0;
  let draws = 0;
  let intersect;
  const context = new Proxy({}, { get: (_, name) => name === 'clearRect' ? () => draws++ : () => {} });
  const host = { getBoundingClientRect: () => ({ width: 1000, top: 100, left: 120 }) };
  const canvas = { parentElement: host, style: {}, getContext: () => context, getBoundingClientRect: () => ({ top: 100, bottom: 900 }) };
  const button = { dataset: {}, setAttribute: (name, value) => button[name] = value, addEventListener: (_, cb) => events.click = cb };
  const media = { matches: reduce, addEventListener: (_, cb) => events.motion = cb };
  const document = {
    hidden: false,
    documentElement: { clientWidth: 1280 },
    querySelector: selector => selector === '.home-network' ? canvas : selector === '.home-network-toggle' ? button : selector === '.masthead' ? { getBoundingClientRect: () => ({ height: 64 }) } : { getBoundingClientRect: () => ({ top: 920 }) },
    addEventListener: (name, cb) => events[name] = cb
  };
  runInNewContext(readFileSync(join(__dirname, '../assets/js/home-network.js'), 'utf8'), {
    document,
    window: { matchMedia: () => media, devicePixelRatio: 3, innerHeight: 720, scrollY: 0, addEventListener: (name, cb) => events[name] = cb },
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(cb) { intersect = cb; } observe() {} },
    requestAnimationFrame: cb => { callbacks.set(++id, cb); return id; },
    cancelAnimationFrame: n => callbacks.delete(n)
  });
  return { events, canvas, button, document, media, callbacks,
    visible: value => intersect([{ isIntersecting: value }]),
    draws: () => draws,
    frame: time => { const [key, cb] = callbacks.entries().next().value; callbacks.delete(key); cb(time); }
  };
}

test('background stops offscreen, in hidden tabs and when manually paused', () => {
  const app = setup();
  assert.equal(app.callbacks.size, 0);
  app.visible(true);
  assert.equal(app.callbacks.size, 1);
  app.events.click();
  assert.equal(app.callbacks.size, 0);
  assert.equal(app.button['aria-label'], 'Play background animation');
  app.events.click();
  app.document.hidden = true;
  app.events.visibilitychange();
  assert.equal(app.callbacks.size, 0);
  app.document.hidden = false;
  app.events.visibilitychange();
  assert.equal(app.callbacks.size, 1);
  app.visible(false);
  assert.equal(app.callbacks.size, 0);
});

test('reduced motion starts static, drawing frequency and pixel ratio are bounded', () => {
  const app = setup(true);
  app.visible(true);
  assert.equal(app.callbacks.size, 0);
  assert.equal(app.canvas.width, 1920);
  assert.equal(app.canvas.style.height, '844px');
  assert.equal(app.canvas.style.width, '1280px');
  assert.equal(app.canvas.style.left, '-120px');
  assert.equal(app.canvas.style.top, '-36px');
  app.events.click();
  app.frame(100);
  const count = app.draws();
  app.frame(116);
  assert.equal(app.draws(), count);
  app.frame(140);
  assert.equal(app.draws(), count + 1);
  app.events.pagehide();
  assert.equal(app.callbacks.size, 0);
});
