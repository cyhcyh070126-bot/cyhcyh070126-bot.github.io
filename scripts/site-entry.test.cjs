const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
// Jekyll's HTML compression collapses inline scripts to one line in production.
const script = readFileSync(join(__dirname, '../_includes/site-entry.html'), 'utf8').replace(/<\/?script>/g, '').replace(/\s+/g, ' ');

function visit({ referrer = '', type = 'navigate', reduced = false } = {}) {
  const classes = new Set();
  const events = {};
  const timers = [];
  runInNewContext(script, {
    URL,
    document: {
      referrer,
      documentElement: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } },
      addEventListener: (name, callback) => { events[name] = callback; }
    },
    window: {
      matchMedia: () => ({ matches: reduced }),
      location: { origin: 'https://example.com' },
      performance: { getEntriesByType: () => [{ type }] },
      setTimeout: callback => timers.push(callback),
      addEventListener: (name, callback) => { events[name] = callback; }
    }
  });
  return { active: () => classes.has('site-enter'), events, timers };
}

test('external sites, direct visits and local/hosted PDFs receive an entrance', () => {
  for (const referrer of ['', 'https://another.example/profile', 'file:///resume.pdf', 'https://example.com/files/CV.pdf']) {
    assert.equal(visit({ referrer }).active(), true, referrer);
  }
});

test('internal page navigation, refresh and history traversal stay immediate', () => {
  assert.equal(visit({ referrer: 'https://example.com/projects/' }).active(), false);
  assert.equal(visit({ type: 'reload' }).active(), false);
  assert.equal(visit({ type: 'back_forward' }).active(), false);
});

test('reduced motion bypasses the entrance', () => {
  assert.equal(visit({ reduced: true }).active(), false);
});

test('entrance cleans up after playing and before history caching', () => {
  const app = visit();
  app.events.DOMContentLoaded();
  assert.equal(app.timers.length, 1);
  app.timers[0]();
  assert.equal(app.active(), false);
  const leaving = visit();
  leaving.events.pagehide();
  assert.equal(leaving.active(), false);
});
