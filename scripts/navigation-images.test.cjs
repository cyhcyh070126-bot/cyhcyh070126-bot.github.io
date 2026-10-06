const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets/js/site-speed.js'), 'utf8');
const {imageDestination} = require('../assets/js/site-speed.js');
const origin = 'https://example.com';

function setup({connection, hidden = false, complete = false, previewVariant = false} = {}) {
  const images = [], idle = [], events = {}, windowEvents = {};
  const src = i => '/images/research/' + i + '.png';
  const manifest = [{src:src(0)}, {src:src(0)}, ...[1,2,3,4].map(i=>({src:src(i)})),
    {src:'https://elsewhere.com/image.png'}];
  manifest[2] = {src:src(1), srcset:src(1) + ' 640w', sizes:'320px'};
  if (previewVariant) manifest.push({src:src(1),srcset:src(1)+' 640w',sizes:'600px'});
  const document = {
    readyState: complete ? 'complete' : 'loading',
    visibilityState: hidden ? 'hidden' : 'visible',
    getElementById: () => ({textContent:JSON.stringify(manifest)}),
    querySelectorAll: () => [{src:origin + src(0)}],
    head: {appendChild() {}},
    createElement: () => ({setAttribute() {}}),
    addEventListener: (name, handler) => {events[name] = handler;}
  };
  const window = {requestIdleCallback:fn=>idle.push(fn), addEventListener:(name,fn)=>{windowEvents[name]=fn;}};
  class Image {
    constructor() {images.push(this);}
    finish(event = 'load') {this['on' + event]?.call(this);}
  }
  vm.runInNewContext(script, {URL, Set, Image, navigator:{connection}, location:{href:origin+'/'}, document, window});
  return {images, idle, events, windowEvents, document};
}

test('responsive image warming accepts only local display assets', () => {
  const item = imageDestination({src:'/images/a.png',srcset:'/images/a.webp 640w',sizes:'320px'},origin+'/cv/');
  assert.equal(item.src,origin+'/images/a.png');
  assert.equal(item.srcset,'/images/a.webp 640w');
  assert.equal(item.sizes,'320px');
  for (const src of ['https://elsewhere.com/images/a.png','javascript:alert(1)','/logout','/files/CV.pdf']) {
    assert.equal(imageDestination({src},origin+'/'),null,src);
  }
});

test('cross-page images wait for page load, skip existing assets, and limit concurrency to two', () => {
  const app = setup();
  app.events.visibilitychange();
  assert.equal(app.images.length,0,'Do not compete with the first screen');
  app.windowEvents.load();
  app.idle.at(-1)();
  assert.equal(app.images.length,2);
  assert.equal(app.images[0].src,origin+'/images/research/1.png');
  assert.equal(app.images[0].sizes,'320px');
  assert.equal(app.images[0].srcset,'/images/research/1.png 640w');
  assert.equal(app.images[0].fetchPriority,'low');
  app.images[0].finish();
  assert.equal(app.images.length,3);
  app.images[1].finish('error');
  assert.equal(app.images.length,4,'Failed images must not block the queue');
  app.images[0].finish();
  assert.equal(app.images.length,4,'A completion cannot release the same job twice');
  assert.equal(app.events.click,undefined,'Original navigation is not intercepted');
});

test('preparation pauses in hidden tabs and respects constrained connections', () => {
  const app = setup({hidden:true,complete:true});
  app.idle.at(-1)();
  assert.equal(app.images.length,0);
  app.document.visibilityState='visible';
  app.events.visibilitychange();
  assert.equal(app.images.length,2);
  app.document.visibilityState='hidden';
  app.images[0].finish();
  assert.equal(app.images.length,2);
  app.document.visibilityState='visible';
  app.events.visibilitychange();
  assert.equal(app.images.length,3);
  for (const connection of [{saveData:true},{effectiveType:'2g'},{effectiveType:'slow-2g'}]) {
    const limited = setup({connection,complete:true});
    limited.idle.at(-1)();
    assert.equal(limited.images.length,0);
  }
});

test('the same figure warms both CV and Projects display sizes without discarding one', () => {
  const app=setup({complete:true,previewVariant:true});
  app.idle.at(-1)();
  for (let i=0;i<app.images.length;i++) app.images[i].finish();
  const selected=app.images.filter(image=>image.src===origin+'/images/research/1.png');
  assert.deepEqual(selected.map(image=>image.sizes),['320px','600px']);
});

test('display copies exist, materially reduce downloads, and preserve original link destinations', () => {
  const variants = JSON.parse(fs.readFileSync(path.join(root,'_data/image_variants.json')));
  let originalBytes=0, displayBytes=0;
  assert.equal(Object.keys(variants).length,13);
  for (const [src, item] of Object.entries(variants)) {
    assert.ok(fs.existsSync(path.join(root,src)));
    originalBytes+=fs.statSync(path.join(root,src.replace(/\.png$/,'.webp'))).size;
    displayBytes+=(item.candidates.find(c=>c.width>=1280)||item.candidates.at(-1)).bytes;
    for (const candidate of item.candidates) {
      assert.equal(fs.statSync(path.join(root,candidate.src)).size,candidate.bytes);
      assert.ok(item.srcset.includes(candidate.src+' '+candidate.width+'w'));
    }
  }
  assert.ok(displayBytes < originalBytes*0.5);
  const sealBytes=fs.statSync(path.join(root,'images/schools/tongji-university-seal-128.png')).size;
  assert.ok(sealBytes<25000);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'_data/navigation_images.json')));
  assert.equal(manifest.length,25);
  assert.equal(new Set(manifest.map(item=>item.src)).size,23);
  assert.equal(manifest.filter(item=>item.sizes?.endsWith('320px')).length,2);
  manifest.forEach(item=>assert.ok(fs.existsSync(path.join(root,item.src)),item.src));
  const links = text=>[...text.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
  for (const file of ['_pages/cv.md','_pages/projects.html','_includes/author-profile.html']) {
    const before=execFileSync('git',['show','HEAD:'+file],{cwd:root,encoding:'utf8'});
    assert.deepEqual(links(fs.readFileSync(path.join(root,file),'utf8')),links(before),file);
  }
});
