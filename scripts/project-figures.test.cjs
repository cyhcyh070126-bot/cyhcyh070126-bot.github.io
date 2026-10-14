const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'assets/js/project-figures.js'),'utf8');
function setup({stored='{}',hash='',blocked=false,nested=false,readerContext='{}',noFooters=false}={}){
  const events={},documentEvents={},frames=[],writes=[];
  function makePanel(number,id,parent){
    const listeners={};
    const count={};
    const summary={focused:false,scrolled:false,focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},querySelector(){return count;}};
    const button={hidden:true,addEventListener(name,fn){this[name]=fn;}};
    const body={querySelector(){return button;}};
    const panel={id,open:false,number,summary,button,count,listeners,parentElement:parent?{closest:()=>parent}:null,
      querySelector(s){return s===':scope > summary'?summary:s===':scope > .project-figures__body'?body:s==='summary'?summary:s==='.project-figures__count'?count:button;},
      querySelectorAll(s){return s==='.project-figures__collapse'?(noFooters&&(parent||id==='p0')?[]:[button]):Array(number).fill({});},addEventListener(name,fn){listeners[name]=fn;}};
    button.closest=()=>panel;
    return panel;
  }
  const panels=[13,7,5,1].map((number,i)=>makePanel(number,'p'+i));
  const children=nested?[makePanel(7,'cylinder',panels[0]),makePanel(3,'bracket',panels[0]),makePanel(3,'fiber',panels[0])]:[];
  const allPanels=[panels[0],...children,...panels.slice(1)];
  const target={closest(){return nested?children[2]:panels[0];},scrollIntoView(){this.scrolled=true;}};
  const heading={closest(){return null;}};
  const location={href:'https://example.com/cv/'+hash,origin:'https://example.com',pathname:'/cv/'};
  const scrolls=[];
  const window={addEventListener(name,fn){events[name]=fn;},requestAnimationFrame(fn){frames.push(fn);},scrollTo(point){scrolls.push(point);}};
  vm.runInNewContext(code,{URL,Array,JSON,window,location,
    sessionStorage:{getItem(k){if(blocked)throw new Error('blocked');return k==='research-reader-context'?readerContext:stored;},setItem(k,v){if(blocked)throw new Error('blocked');if(k==='research-reader-context')readerContext=v;writes.push([k,JSON.parse(v)]);}},
    document:{querySelectorAll:()=>allPanels,getElementById:id=>id==='figure'?target:id==='project'?heading:null,
      addEventListener(name,fn){documentEvents[name]=fn;}}});
  return {panels,children,allPanels,target,heading,location,window,events,documentEvents,frames,writes,scrolls};
}
test('figures default to independent closed panels with accurate counts',()=>{
  const app=setup();assert(app.panels.every(p=>!p.open));
  assert.deepEqual(app.panels.map(p=>p.count.textContent),[' (13)',' (7)',' (5)',' (1)']);
  app.panels[1].open=true;app.panels[1].listeners.toggle({target:app.panels[1]});
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
test('nested groups count their own cards and close independently without losing child choices',()=>{
  const app=setup({nested:true});const outer=app.panels[0],child=app.children[1];
  assert.deepEqual([outer,...app.children].map(p=>p.count.textContent),[' (13)',' (7)',' (3)',' (3)']);
  outer.open=true;child.open=true;
  child.button.click();assert.equal(child.open,false);assert.equal(outer.open,true);assert.equal(child.summary.focused,true);assert.equal(outer.summary.focused,false);
  child.open=true;outer.button.click();assert.equal(outer.open,false);assert.equal(child.open,true);
  outer.listeners.toggle({target:child});assert.equal(app.writes.length,0,'A child toggle cannot be saved as a parent toggle');
  outer.listeners.toggle({target:outer});child.listeners.toggle({target:child});
  const restored=setup({nested:true,stored:JSON.stringify(app.writes.at(-1)[1])});
  assert.equal(restored.panels[0].open,false);assert.equal(restored.children[1].open,true);
});
test('nested figure navigation reveals every ancestor while leaving sibling groups closed',()=>{
  const app=setup({nested:true,hash:'#figure'});
  assert.equal(app.panels[0].open,true);assert.deepEqual(app.children.map(p=>p.open),[false,false,true]);
  app.frames[0]();assert.equal(app.target.scrolled,true);
  app.panels[0].open=false;
  assert.equal(app.window.siteRevealFigure('#figure'),app.target,'An open inner group still needs its closed parent revealed');
  assert.equal(app.panels[0].open,true);
  assert.equal(app.window.siteRevealFigure('#figure'),null,'Already-visible anchors preserve the existing scroll owner');
  const original=app.allPanels.map(p=>p.open);app.events.beforeprint();assert(app.allPanels.every(p=>p.open));app.events.afterprint();
  assert.deepEqual(app.allPanels.map(p=>p.open),original);
  app.children[2].open=false;app.events.pageshow({persisted:true});assert.equal(app.children[2].open,false,'BFCache back preserves each inner choice');
});
test('native summary toggles work without redundant footer controls',()=>{
  const app=setup({nested:true,noFooters:true});
  assert.deepEqual([app.panels[0],...app.children].map(p=>p.count.textContent),[' (13)',' (7)',' (3)',' (3)']);
  app.panels[0].open=true;app.children[1].open=true;
  app.children[1].listeners.toggle({target:app.children[1]});
  assert.equal(app.writes.at(-1)[1].bracket,true);
  app.children[1].open=false;app.children[1].listeners.toggle({target:app.children[1]});
  assert.equal(app.writes.at(-1)[1].bracket,false);assert.equal(app.panels[0].open,true);
});
test('reader return restores the captured viewport once, after folded layout and fonts settle',async()=>{
  const context={project:'p0',items:[{file:'/files/research/example.pdf'}],returnPosition:{url:'https://example.com/cv/',x:0,y:1234}};
  const app=setup({nested:true,readerContext:JSON.stringify(context)});app.events.pageshow({persisted:true});
  await Promise.resolve();app.frames.shift()();app.frames.shift()();
  assert.equal(app.scrolls.length,1);assert.equal(app.scrolls[0].top,1234);
  const saved=app.writes.find(w=>w[0]==='research-reader-context')[1];assert.equal(saved.returnPosition,undefined);assert.deepEqual(saved.items,context.items);
  app.events.pageshow({persisted:true});await Promise.resolve();assert.equal(app.scrolls.length,1);
  for(const point of [{url:'https://example.com/projects/',x:0,y:1234},{url:'https://example.com/cv/',x:0,y:-1},{url:'https://example.com/cv/',x:0,y:'1234'}]){
    const invalid=setup({readerContext:JSON.stringify({returnPosition:point})});invalid.events.pageshow({persisted:true});await Promise.resolve();assert.equal(invalid.scrolls.length,0);
  }
});
test('case overviews are large first figures and preserve the remaining cards and prose',()=>{
  const before=execFileSync('git',['show','HEAD:_pages/cv.md'],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n')
    .replace(/(<a href="\/(?:files|images)\/research\/[^\"]+" target=")_blank(")/g,'$1_self$2');
  const after=fs.readFileSync(path.join(root,'_pages/cv.md'),'utf8').replace(/\r\n/g,'\n');
  const cards=s=>[...s.matchAll(/<figure class="research-card[\s\S]*?<\/figure>/g)].map(m=>m[0]);
  const existingCards=s=>cards(s).filter(card=>!/_workflow_overview(?:_v\d+)?\.pdf/.test(card));
  assert.deepEqual(existingCards(after),existingCards(before));assert.equal(cards(after).length,30);
  assert(cards(after).every(card=>/<a href="[^\"]+" target="_self"/.test(card)),'Even pre-script/native figure clicks must stay in the same tab');
  const anchors=s=>[...s.matchAll(/<a\b[^>]+>/g)].map(m=>m[0]).filter(tag=>!/_workflow_overview(?:_v\d+)?\.pdf/.test(tag));assert.deepEqual(anchors(after),anchors(before));
  const folds=[],stack=[];
  for(const match of after.matchAll(/<details\b[^>]*>|<\/details>/g)){
    if(match[0].startsWith('</')){const fold=stack.pop();fold.body=after.slice(fold.start,match.index);folds.push(fold);}
    else stack.push({start:match.index+match[0].length,group:match[0].includes('project-figures--group')});
  }
  assert.equal(folds.length,7);
  assert.deepEqual(folds.filter(f=>!f.group).map(f=>cards(f.body).length),[17,7,5,1]);
  assert.deepEqual(folds.filter(f=>f.group).map(f=>cards(f.body).length),[7,6,4]);
  for(const [fold,name] of folds.filter(f=>f.group).map((fold,i)=>[fold,['cylinder','bracket','fiber100'][i]])){
    assert(cards(fold.body)[0].includes('/'+name+'_workflow_overview'+(['cylinder','fiber100'].includes(name)?'_v2':'')+'.pdf'));
    assert.equal(fold.body.match(/<div class="research-gallery[^\"]*">/)[0],'<div class="research-gallery research-gallery--single research-gallery--overview">');
  }
  for(const fold of folds)assert.doesNotMatch(fold.body,/class="cv-project(?: |")/,'Project text must remain outside the fold');
  const outsideNoFigures=s=>{
    const start=s.search(/<details class="project-figures(?: project-figures--nested)?" id="fem-neural-operator-figures">/);
    let depth=0;
    for(const match of s.slice(start).matchAll(/<details\b[^>]*>|<\/details>/g)){
      depth+=match[0].startsWith('</')?-1:1;
      if(depth===0)return s.slice(0,start)+s.slice(start+match.index+match[0].length);
    }
    throw new Error('NO disclosure must have a matching close');
  };
  assert.equal(outsideNoFigures(after),outsideNoFigures(before),'Project prose and other disclosures must stay unchanged');
});
