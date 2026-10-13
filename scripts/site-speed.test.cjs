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

test('external connections prepare only HTTPS origins, deduplicated and bounded', () => {
  const app=setup();
  for (const href of ['/', '#news', 'mailto:a@example.com', 'http://elsewhere.com/',
    'https://github.com/a','https://github.com/b','https://huggingface.co/a',
    'https://engineering.jhu.edu/','https://tongji.edu.cn/','https://fifth.example/']) app.window.siteWarmLink(href);
  assert.deepEqual(app.links.map(l=>l.href),['https://github.com','https://huggingface.co','https://engineering.jhu.edu','https://tongji.edu.cn']);
  assert.ok(app.links.every(l=>l.rel==='preconnect'));
});

test('reader intent warms at most four shells and a single matching module, without executing it',()=>{
  const app=setup();
  for(let i=0;i<12;i++)app.window.siteWarmLink('/research-viewer/?project=p&file='+i+'&from=cv&v=abc');
  const scripts=app.links.filter(l=>l.rel==='modulepreload'),pages=app.links.filter(l=>l.rel==='prefetch');
  assert.equal(scripts.length,1);assert.equal(scripts[0].href,origin+'/research-viewer/reader.js?v=abc');assert.equal(pages.length,4);
  assert.equal(app.events.click,undefined);
  for(const connection of [{saveData:true},{effectiveType:'2g'}]){
    const limited=setup(connection);limited.window.siteWarmLink('/research-viewer/?project=p&file=a&v=abc');assert.equal(limited.links.length,0);
  }
});

test('only PDF intent warms its four engine resources once, even after the shell budget is used',()=>{
  const app=setup();
  for(let i=0;i<4;i++)app.window.siteWarmLink('/research-viewer/?project=p&file=%2Fimages%2Fresearch%2F'+i+'.gif');
  assert.equal(app.links.filter(l=>l.href.includes('/pdfjs-')).length,0);
  app.window.siteWarmLink('/research-viewer/?project=p&file=%2Ffiles%2Fresearch%2Ffirst.pdf');
  app.window.siteWarmLink('/research-viewer/?project=p&file=%2Ffiles%2Fresearch%2Fsecond.pdf');
  const engine=app.links.filter(l=>l.href.includes('/pdfjs-'));
  assert.equal(engine.length,4);assert(engine.every(l=>l.rel==='prefetch'));
  assert.equal(new Set(engine.map(l=>l.href)).size,4);
  const constrained=setup({saveData:true});constrained.window.siteWarmLink('/research-viewer/?file=%2Ffiles%2Fresearch%2Fa.pdf');assert.equal(constrained.links.length,0);
});
