const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const root = path.join(__dirname, '..');

test('shared page JavaScript stays within the lightweight bundle budget', () => {
  const bundle = fs.readFileSync(path.join(root, 'assets/js/main.min.js'));
  assert.ok(bundle.length < 150_000, `Shared bundle is ${bundle.length} bytes`);
  assert.ok(gzipSync(bundle).length < 50_000, 'Compressed shared bundle exceeds 50 KB');
});

test('CV research images defer loading and reserve their intrinsic dimensions', () => {
  const cv = fs.readFileSync(path.join(root, '_pages/cv.md'), 'utf8');
  const images = [...cv.matchAll(/<img\b[^>]*src="(\/images\/research\/[^\"]+)"[^>]*>/g)];
  assert.ok(images.length >= 20);
  for (const [tag, src] of images) {
    assert.match(tag, /loading="lazy"/, src);
    assert.match(tag, /decoding="async"/, src);
    assert.match(tag, /width="[1-9]\d*"/, src);
    assert.match(tag, /height="[1-9]\d*"/, src);
    assert.ok(fs.existsSync(path.join(root, src)), src);
  }
});
