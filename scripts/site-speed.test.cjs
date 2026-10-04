const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { destination } = require('../assets/js/site-speed.js');
const origin = 'https://example.com';

test('prefetch keeps document routes and file URLs while excluding external and current-page links', () => {
  assert.equal(destination('/cv/#education', origin + '/').url, origin + '/cv/');
  assert.equal(destination('/files/CV.pdf?v=2', origin + '/').url, origin + '/files/CV.pdf?v=2');
  for (const url of ['#news', '/', 'https://elsewhere.com/cv/', 'mailto:a@example.com', '/logout', 'javascript:alert(1)']) {
    assert.equal(destination(url, origin + '/'), null, url);
  }
});

function setup(connection) {
  const links = [], events = {}, idle = [];
  const window = { requestIdleCallback: fn => idle.push(fn) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js/site-speed.js'), 'utf8'), {
    URL, Set, location: { href: origin + '/' }, navigator: { connection }, window,
    document: {
      visibilityState: 'visible',
      head: { appendChild: link => links.push(link) },
      createElement: () => ({ setAttribute() {} }),
      addEventListener: (name, handler) => { events[name] = handler; }
    }
  });
  return { links, events, idle, window };
}

test('idle warming only downloads the two other documents and deduplicates section links', () => {
  const app = setup();
  app.idle[0]();
  assert.deepEqual(app.links.map(l => l.href), [origin + '/cv/', origin + '/projects/']);
  app.window.siteWarmLink('/cv/#education');
  app.window.siteWarmLink('/cv/#burgers-pinn');
  assert.equal(app.links.length, 2);
  assert.ok(app.links.every(l => l.rel === 'prefetch'));
  assert.equal(app.events.click, undefined, 'Warming must never intercept navigation');
});

test('asset warming is bounded and respects data saver and slow connections', () => {
  const app = setup();
  for (let i = 0; i < 30; i++) app.window.siteWarmLink('/images/research/' + i + '.png');
  assert.equal(app.links.length, 8);
  for (const connection of [{ saveData: true }, { effectiveType: '2g' }, { effectiveType: 'slow-2g' }]) {
    const limited = setup(connection);
    limited.idle[0]();
    limited.window.siteWarmLink('/files/CV.pdf');
    assert.equal(limited.links.length, 0);
  }
});
