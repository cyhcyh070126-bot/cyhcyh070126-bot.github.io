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

test('Published projects have the supplied links; the ongoing NO keeps its placeholder', () => {
  const blocks = read('_data/projects.yml').split(/(?=^- id: )/m).filter(Boolean);
  assert.equal(blocks.length, 4);
  assert.match(blocks[0], /status: Ongoing/);
  assert.match(blocks[0], /repository:\s*$/);
  assert.match(blocks[1], /repository: https:\/\/github\.com\/cyhcyh070126-bot\/convlstm-battery-field-prediction#readme/);
  assert.match(blocks[2], /repository: https:\/\/github\.com\/cyhcyh070126-bot\/burgers-pinn#readme/);
  assert.match(blocks[3], /^  repository: https:\/\/huggingface\.co\/CYHcyh66\r?$/m);
  assert.match(blocks[3], /repository_label: Hugging Face/);
  assert.match(read('_pages/projects.html'), /project\.repository_label \| default: 'Repository'/);
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

test('Search script, stylesheet and index share the deployment cache version', () => {
  assert.match(read('_includes/head.html'), /capture main_css_version/);
  for (const file of ['_includes/scripts.html', '_includes/head/custom.html', '_includes/command-palette.html']) {
    assert.match(read(file), /\?v=\{\{ main_css_version \| strip \}\}/, file);
  }
});
