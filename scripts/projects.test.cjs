const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('Projects lists the same four titles and stable anchors as the CV', () => {
  const projects = read('_data/projects.yml');
  const cv = [...read('_pages/cv.md').matchAll(/class="cv-project__title" id="([^"]+)">\d+\. ([^<]+)</g)];
  assert.equal(cv.length, 4);
  assert.deepEqual([...projects.matchAll(/^- id: (.+)$/gm)].map(m => m[1]), cv.map(m => m[1]));
  assert.deepEqual([...projects.matchAll(/^  title: (.+)$/gm)].map(m => m[1]), cv.map(m => m[2]));
  assert.deepEqual([...projects.matchAll(/^  research_url: (.+)$/gm)].map(m => m[1]), cv.map(m => '/cv/#' + m[1]));
});

test('Missing repository URLs render non-navigating, accessible placeholders', () => {
  const page = read('_pages/projects.html');
  assert.match(page, /if project\.repository and project\.repository != ''/);
  assert.match(page, /<span class="project-list__repository project-list__repository--pending" role="link" aria-disabled="true"/);
  assert.doesNotMatch(page, /href=["'](?:#|javascript:)/);
  assert.match(page, /rel="noopener noreferrer"/);
  assert.match(page, /author_profile: false/);
});

test('Projects has a page route, navigation entry and optional search entry', () => {
  assert.match(read('_pages/projects.html'), /permalink: \/projects\//);
  assert.match(read('_data/navigation.yml'), /title: "Projects"\s+url: \/projects\//);
  assert.match(read('_pages/search-index.json'), /"projects":\s*\{\s*"url":/);
  assert.match(read('assets/js/command-palette.js'), /if \(data\.projects\) add\("Navigation", "Projects", data\.projects\.url/);
  assert.match(read('assets/js/command-palette.js'), /add\("Projects", heading\.textContent/);
  assert.doesNotMatch(read('assets/js/command-palette.js'), /add\("Research"|add\("Navigation", "Research Experience"/);
  assert.match(read('_layouts/archive.html'), /if page\.projects_page.*projects-page/);
});
