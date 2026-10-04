const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../assets/js/section-images.js'), 'utf8');
function setup(connection) {
  const idle = [], events = {}, decoded = [], cleared = [];
  const images = Array.from({ length: 6 }, (_, index) => ({
    index, loading: 'lazy', complete: false, naturalWidth: 0, listeners: {},
    style: { removeProperty: () => cleared.push(index) },
    decode: () => { decoded.push(index); return Promise.resolve(); },
    addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); },
    finish() { this.complete = true; this.naturalWidth = 100; (this.listeners.load || []).forEach(fn => fn()); }
  }));
  const targets = [0, 3].map(index => ({
    index, closest() { return this; }, contains() { return false; },
    compareDocumentPosition(img) { return img.index >= index ? 4 : 2; }
  }));
  const window = { requestIdleCallback: fn => idle.push(fn) };
  vm.runInNewContext(script, {
    URL, Promise, WeakMap, navigator: { connection }, window,
    location: { href: 'https://example.com/cv/', origin: 'https://example.com', pathname: '/cv/' },
    document: {
      visibilityState: 'visible',
      querySelectorAll: selector => selector.includes('img') ? images : targets,
      getElementById: id => id === 'second' ? targets[1] : null,
      addEventListener: (name, fn) => { events[name] = fn; }
    }
  });
  return { window, images, idle, events, decoded, cleared };
}
test('background image preparation is bounded to two requests, seeded across projects', async () => {
  const app = setup();
  assert.ok(app.images.every(img => img.loading === 'lazy'));
  app.idle[0]();
  assert.deepEqual(app.images.filter(img => img.loading === 'eager').map(img => img.index), [0, 3]);
  app.images[0].finish();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(app.images.filter(img => img.loading === 'eager' && !img.complete).map(img => img.index), [1, 3]);
  assert.ok(app.decoded.includes(0));
  assert.ok(app.cleared.includes(0), 'Preview is removed once the real image is decoded');
});
test('target section overtakes the background queue without warming earlier images', () => {
  const app = setup();
  app.window.sitePrepareSection('#second', true);
  assert.deepEqual(app.images.filter(img => img.fetchPriority === 'high').map(img => img.index), [3, 4, 5]);
  assert.ok(app.images.slice(0, 3).every(img => img.loading === 'lazy'));
  app.idle[0]();
  assert.equal(app.images[3].fetchPriority, 'high', 'Background work cannot downgrade a requested image');
});
test('data saver skips speculative image loading but explicit navigation still prepares the target', () => {
  const app = setup({ saveData: true });
  app.idle[0]();
  app.window.sitePrepareSection('#second', false);
  assert.ok(app.images.every(img => img.loading === 'lazy'));
  app.window.sitePrepareSection('#second', true);
  assert.equal(app.images[3].loading, 'eager');
});
test('external, other-page and malformed anchors leave this gallery untouched', () => {
  const app = setup();
  for (const href of ['https://elsewhere.com/cv/#second', '/projects/#second', '#%invalid', '#missing']) {
    app.window.sitePrepareSection(href, true);
  }
  assert.ok(app.images.every(img => img.loading === 'lazy'));
});
