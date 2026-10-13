const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'assets/js/project-figures.js'),'utf8');
function setup({stored='{}',hash='',blocked=false}={}){
  const events={},documentEvents={},frames=[],writes=[];
  const panels=[13,7,5,1].map((number,i)=>{
    const listeners={};
    const summary={focused:false,scrolled:false,focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}};
    const button={hidden:true,addEventListener(name,fn){this[name]=fn;}};
    const count={};
    return {id:'p'+i,open:false,number,summary,button,count,listeners,
      querySelector(s){return s==='summary'?summary:s==='.project-figures__count'?count:button;},
      querySelectorAll(){return Array(number).fill({});},addEventListener(name,fn){listeners[name]=fn;}};
  });
  const target={closest(){return panels[0];},scrollIntoView(){this.scrolled=true;}};
  const heading={closest(){return null;}};
  const location={href:'https://example.com/cv/'+hash,origin:'https://example.com',pathname:'/cv/'};
  const window={addEventListener(name,fn){events[name]=fn;},requestAnimationFrame(fn){frames.push(fn);}};
  vm.runInNewContext(code,{URL,Array,JSON,window,location,
    sessionStorage:{getItem(){if(blocked)throw new Error('blocked');return stored;},setItem(k,v){if(blocked)throw new Error('blocked');writes.push([k,JSON.parse(v)]);}},
    document:{querySelectorAll:()=>panels,getElementById:id=>id==='figure'?target:id==='project'?heading:null,
      addEventListener(name,fn){documentEvents[name]=fn;}}});
  return {panels,target,heading,location,window,events,documentEvents,frames,writes};
}
test('figures default to independent closed panels with accurate counts',()=>{
  const app=setup();assert(app.panels.every(p=>!p.open));
  assert.deepEqual(app.panels.map(p=>p.count.textContent),[' (13)',' (7)',' (5)',' (1)']);
  app.panels[1].open=true;app.panels[1].listeners.toggle();
  assert.equal(app.writes.at(-1)[1].p1,true);assert.equal(app.panels[0].open,false);
});
test('saved choices restore and blocked or invalid storage does not break controls',()=>{
  assert.equal(setup({stored:'{"p1":true}'}).panels[1].open,true);
  for(const settings of [{blocked:true},{stored:'null'},{stored:'[]'},{stored:'not json'}]){
    const app=setup(settings);app.panels[0].open=true;app.panels[0].button.click();
    assert.equal(app.panels[0].open,false);assert.equal(app.panels[0].summary.focused,true);assert.equal(app.panels[0].summary.scrolled,true);
  }
});
test('a figure deep link expands only its owner before scrolling; headings stay folded',()=>{
  const app=setup({hash:'#figure'});assert.equal(app.panels[0].open,true);assert.equal(app.panels[1].open,false);
  app.frames[0]();assert.equal(app.target.scrolled,true);
  assert(setup({hash:'#project'}).panels.every(p=>!p.open));
  const closed=setup();for(const url of ['https://elsewhere.test/cv/#figure','/projects/#figure','#%bad','#absent'])closed.window.siteRevealFigure(url);
  assert(closed.panels.every(p=>!p.open));
  const restored=setup({hash:'#figure',stored:'{"p0":true}'});
  assert.equal(restored.frames.length,1,'Native/saved open panels still align their initial figure anchor');
  restored.events.wheel();restored.events.pageshow({persisted:false});
  assert.equal(restored.frames.length,1,'Do not move the viewport after the visitor starts scrolling');
});
test('capture opens same-page figure links without changing native clicks',()=>{
  const app=setup();const event={button:0,target:{closest:()=>({href:'https://example.com/cv/#figure'})}};
  app.documentEvents.click({...event,ctrlKey:true});assert.equal(app.panels[0].open,false);
  app.documentEvents.click(event);assert.equal(app.panels[0].open,true);
});
test('browser-back restores the user state; printing temporarily includes all figures',()=>{
  const app=setup({hash:'#figure'});app.panels[0].open=false;
  app.events.pageshow({persisted:true});assert.equal(app.panels[0].open,false);
  app.panels[2].open=true;const original=app.panels.map(p=>p.open);
  app.events.beforeprint();assert(app.panels.every(p=>p.open));
  app.events.afterprint();assert.deepEqual(app.panels.map(p=>p.open),original);
});
test('wrappers preserve cards, sources, URLs and prose apart from approved in-place targets',()=>{
  const before=execFileSync('git',['show','HEAD:_pages/cv.md'],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n')
    .replace(/(<a href="\/(?:files|images)\/research\/[^\"]+" target=")_blank(")/g,'$1_self$2');
  const after=fs.readFileSync(path.join(root,'_pages/cv.md'),'utf8').replace(/\r\n/g,'\n');
  const cards=s=>[...s.matchAll(/<figure class="research-card[\s\S]*?<\/figure>/g)].map(m=>m[0]);
  assert.deepEqual(cards(after),cards(before));assert.equal(cards(after).length,26);
  assert(cards(after).every(card=>/<a href="[^\"]+" target="_self"/.test(card)),'Even pre-script/native figure clicks must stay in the same tab');
  const anchors=s=>[...s.matchAll(/<a\b[^>]+>/g)].map(m=>m[0]);assert.deepEqual(anchors(after),anchors(before));
  const folds=[...after.matchAll(/<details class="project-figures" id="([^"]+)">([\s\S]*?)<\/details>/g)];
  assert.equal(folds.length,4);
  assert.deepEqual(folds.map(m=>cards(m[2]).length),[13,7,5,1]);
  for(const fold of folds)assert.doesNotMatch(fold[2],/class="cv-project(?: |")/,'Project text must remain outside the fold');
  const strip=s=>s.replace(/<details class="project-figures"[^>]*>\n  <summary[^\n]*<\/summary>\n  <div class="project-figures__body"[^>]*>\n/g,'')
    .replace(/  <button class="project-figures__collapse"[^\n]*<\/button>\n  <\/div>\n<\/details>\n\n/g,'');
  assert.equal(strip(after),strip(before));
});
