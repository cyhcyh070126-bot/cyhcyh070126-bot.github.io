const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { normalize, searchEntries, indexEntries } = require('../assets/js/command-palette.js');
const root = path.join(__dirname, '..');

function entry(title, keywords, body, order) {
  return { title, order, titleIndex: normalize(title), keywordIndex: normalize(keywords), bodyIndex: normalize(body) };
}
const records = [
  entry('GPU-Accelerated Hybrid FEM–Neural Operator Coupling Framework', 'FEM NO 纤维 三维 应力', 'one shared operator for all 100 fibers', 0),
  entry('ConvLSTM Modeling of Chemo-Mechanical Fields in Battery Materials', 'battery 电池 浓度 应力', 'stress images COMSOL', 1),
  entry('PINNs for Shock Capturing in the Burgers Equation', 'PINN 人工粘性 激波', 'constant artificial viscosity', 2),
  entry('Domain-Specific LLM Fine-Tuning for Mechanics of Materials', 'LLM Qwen 大模型', 'LoRA instruction dataset', 3),
  entry('LinkedIn', '领英 联系', '', 4)
];
test('normalizes case, Unicode dashes, accents and Chinese without regex search', () => {
  assert.equal(normalize(' FEM–NO / ＦＥＭ '), 'fem no fem');
  assert.equal(normalize('应力 Café'), '应力 cafe');
  assert.doesNotThrow(() => searchEntries(records, '[.*'));
});
test('blank query preserves order and never changes project titles', () => {
  assert.deepEqual(searchEntries(records, '').map(e => e.title), records.map(e => e.title));
  assert.notEqual(searchEntries(records, ''), records);
});
test('matches title, bilingual aliases and body; all terms are required', () => {
  for (const [query, title] of [['convLSTM', records[1].title], ['纤维', records[0].title], ['fiber', records[0].title], ['人工粘性', records[2].title], ['领英', 'LinkedIn'], ['FEM NO', records[0].title], ['100 fibers', records[0].title]]) {
    assert.equal(searchEntries(records, query)[0]?.title, title, query);
  }
  assert.equal(searchEntries(records, 'stress battery').length, 1);
  assert.equal(searchEntries(records, 'unfindable-token').length, 0);
});
test('literal title match outranks a body mention', () => {
  const duplicate = entry('A longer story', '', 'LinkedIn', -1);
  assert.equal(searchEntries([duplicate, ...records], 'LinkedIn')[0].title, 'LinkedIn');
});
test('every CV project has one stable anchor and there are exactly four', () => {
  const cv = fs.readFileSync(path.join(root, '_pages/cv.md'), 'utf8');
  const projects = [...cv.matchAll(/class="cv-project__title" id="([^"]+)">([^<]+)</g)];
  assert.equal(projects.length, 4);
  assert.deepEqual(projects.map(match => match[1]), ['fem-neural-operator', 'convlstm-battery', 'burgers-pinn', 'mechanics-llm']);
  assert.deepEqual(projects.map(match => match[2].replace(/^\d+\.\s*/, '')), records.slice(0, 4).map(e => e.title));
});
test('no clipboard action; no remote search provider; inert index parsing', () => {
  const js = fs.readFileSync(path.join(root, 'assets/js/command-palette.js'), 'utf8');
  assert.doesNotMatch(js, /navigator\.clipboard|execCommand|copy email/i);
  assert.match(js, /createElement\("template"\)/);
  assert.match(js, /fetch\(dialog\.dataset\.indexUrl/);
});

test('resource search keeps project collections at the root and searches children within their scope', () => {
  const tree = indexEntries([
    { group: 'Research', title: records[3].title, url: '/cv/#mechanics-llm' },
    { group: 'Resources', title: records[3].title, url: '/cv/#mechanics-llm', children: [
      { group: 'Datasets', title: 'Material-mechanics', url: 'https://huggingface.co/datasets/CYHcyh66/Material-mechanics', keywords: 'dataset 数据集' },
      { group: 'Models', title: 'AI_Material_mechanics_assistant_merged', url: 'https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged', keywords: 'model 模型 权重' }
    ] },
    { group: 'Contact & Links', title: 'LinkedIn', url: 'https://www.linkedin.com/' }
  ]);
  const collection = tree[1];
  assert.equal(tree.length, 3);
  assert.equal(tree.filter(e => e.group === 'Resources').length, 1);
  assert.equal(searchEntries(tree, 'AI_Material_mechanics_assistant_merged')[0], collection);
  assert.equal(searchEntries(tree, '数据集')[0], collection);
  assert.deepEqual(searchEntries(collection.children, '').map(e => e.group), ['Datasets', 'Models']);
  assert.equal(searchEntries(collection.children, 'merged')[0].title, 'AI_Material_mechanics_assistant_merged');
  assert.equal(searchEntries(collection.children, 'LinkedIn').length, 0);
});
