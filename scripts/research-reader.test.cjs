const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'research-viewer/reader.js'),'utf8')
  .replace(/^import \{collectResearchFiles\} from [^;]+;/,'')
  .replace(/\bimport\(/g,'loadModule(');
const gif='/images/research/first.gif',pdf='/files/research/second.pdf',png='/images/research/third.png';
function deferred(){let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};}
const flush=()=>new Promise(r=>setImmediate(r));
function setup({file=gif,holdIndex=false,holdPdf=false,holdRender=false,indexOk=true,stored=null,blockedStorage=false}={}){
  const imports=[],styles=[],images=[],tasks=[],viewers=[],events={},downloads=[];
  const indexGate=deferred(),pdfGate=deferred();
  function element(){return {hidden:false,children:[],textContent:'',events:{},dataset:{},
    classList:{remove(){},toggle(){}},scrollTo(){},addEventListener(name,fn){this.events[name]=fn;},
    append(child){this.children.push(child);},replaceChildren(...children){this.children=children;},
    click(){downloads.push(this);}};}
  const nodes=Object.fromEntries(['document-container','image-container','loading','pdf-pages','reader-back'].map(id=>[id,element()]));
  const document={body:{dataset:{}},title:'',head:{append(link){styles.push(link);queueMicrotask(()=>link.onload());}},
    getElementById:id=>nodes[id],createElement:()=>element(),createTextNode:text=>({textContent:text}),
    addEventListener(name,fn){events[name]=fn;}};
  const window={addEventListener(name,fn){events[name]=fn;}};
  const location={href:'https://example.com/research-viewer/?project=p&file='+encodeURIComponent(file)+'&v=abc'};
  location.search=new URL(location.href).search;
  const history={replaceState(_a,_b,url){location.href=String(url);}};
  const files=[gif,pdf,png].map((file,i)=>({file,title:'Figure '+i,anchor:'anchor-'+i}));
  const requests=[];
  class EventBus {constructor(){this.handlers={};}on(name,fn){this.handlers[name]=fn;}}
  class PDFLinkService {setViewer(v){this.viewer=v;}setDocument(doc){this.document=doc;}}
  class PDFViewer {
    constructor({eventBus}){this.bus=eventBus;this.page={};viewers.push(this);}
    setDocument(doc){this.pdfDocument=doc;if(doc){this.bus.handlers.pagesinit();if(!holdRender)this.render();}}
    render(){this.bus.handlers.pagerendered({pageNumber:1,source:this.page});}
    getPageView(){return this.pdfDocument?this.page:undefined;}
    updateScale(value){this.lastScale=value;}
  }
  const api={GlobalWorkerOptions:{},getDocument(options){
    const task={options,destroyed:false,destroy(){this.destroyed=true;return Promise.resolve();},promise:holdPdf?pdfGate.promise:Promise.resolve({url:options.url})};
    tasks.push(task);return task;
  }};
  const context={URL,URLSearchParams,Promise,Image:class {constructor(){images.push(this);}},document,window,location,history,
    sessionStorage:{getItem(){if(blockedStorage)throw new Error('Storage blocked');return stored;}},
    console:{error(){}},collectResearchFiles:()=>({p:files}),
    loadModule(url){imports.push(url);return Promise.resolve(url.endsWith('/pdf.min.mjs')?api:{EventBus,PDFViewer,PDFLinkService});},
    fetch(url){requests.push(url);return holdIndex?indexGate.promise:Promise.resolve({ok:indexOk,json:async()=>({cv:{html:'fixture'}})});}};
  const ready=vm.runInNewContext('(async()=>{'+source+'})()',context);
  const key=(key,extra={})=>{const event={key,ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,preventDefault(){this.prevented=true;},...extra};events.keydown(event);return event;};
  return {ready,imports,styles,images,tasks,viewers,events,nodes,document,requests,key,indexGate,pdfGate,downloads};
}

test('opening an original GIF/image does not request PDF scripts or styles',async()=>{
  for(const file of [gif,png]){
    const app=setup({file});await app.ready;
    assert.equal(app.images[0].src,file);
    assert.equal(app.imports.length,0);assert.equal(app.styles.length,0);
    assert.equal(app.document.body.dataset.ready,'false');
    app.images[0].onload();assert.equal(app.document.body.dataset.ready,'true');
    assert.equal(app.nodes['document-container'].hidden,true);
    assert.equal(typeof app.images[0].onclick,'function','Original-image zoom remains available');
  }
});

const cachedItems=[gif,pdf,png].map((file,i)=>({file,title:'Figure '+i,anchor:'anchor-'+i}));
const storedContext=overrides=>JSON.stringify({project:'p',version:'abc',items:cachedItems,...overrides});
test('CV clicks show the original file without waiting for or requesting the index',async()=>{
  for(const file of [gif,pdf,png]){
    const app=setup({file,stored:storedContext(),holdIndex:true});await app.ready;
    assert.deepEqual(app.requests,[]);
    assert.equal(app.document.body.dataset.file,file);
    assert.equal(file===pdf?app.tasks[0].options.url:app.images[0].src,file);
    if(file!==pdf)assert.deepEqual(app.imports,[]);
    app.key('ArrowRight');await flush();
    assert.equal(app.document.body.dataset.file,cachedItems[Math.min(2,cachedItems.findIndex(x=>x.file===file)+1)].file);
  }
});
test('direct links and stale, blocked or invalid context safely use the normal index',async()=>{
  for(const settings of [
    {},{blockedStorage:true},{stored:'not json'},{stored:'null'},
    {stored:storedContext({project:'elsewhere'})},{stored:storedContext({version:'old'})},
    {stored:storedContext({items:[]})},{stored:storedContext({items:[cachedItems[1]]})},
    ...['https://example.org/file.gif','//example.org/file.gif','/private/file.gif','/images/research/%2e%2e%2fsecret.gif'].map(file=>({stored:storedContext({items:[cachedItems[0],{...cachedItems[1],file}]})})),
    {stored:storedContext({items:[{...cachedItems[0],anchor:'bad#anchor'}]})}
  ]){
    const app=setup(settings);await app.ready;
    assert.deepEqual(app.requests,['/search-index.json?v=abc']);
    assert.equal(app.images[0].src,gif);
  }
});

test('PDF engine starts alongside the existing index instead of waiting for it',async()=>{
  const app=setup({file:pdf,holdIndex:true});await flush();
  assert.deepEqual(app.requests,['/search-index.json?v=abc']);
  assert.equal(app.imports.length,2);assert.equal(app.styles.length,1);assert.equal(app.tasks.length,0);
  app.indexGate.resolve({ok:true,json:async()=>({cv:{html:'fixture'}})});await app.ready;
  assert.equal(app.tasks[0].options.url,pdf);
  assert.equal(app.tasks[0].options.isEvalSupported,false);
  assert.equal(app.document.body.dataset.ready,'true');
  assert.equal(app.viewers[0].currentScaleValue,'page-fit');
});

test('left/right cross-format navigation, original saving and PDF zoom remain intact',async()=>{
  const app=setup();await app.ready;app.images[0].onload();
  app.key('ArrowRight');await flush();
  assert.equal(app.document.body.dataset.file,pdf);
  assert.equal(app.document.body.dataset.returnUrl,'/cv/#anchor-1');
  assert.equal(app.nodes['reader-back'].href,'/cv/#anchor-1');
  assert.equal(app.document.body.dataset.ready,'true');
  app.key('+',{ctrlKey:true});assert.equal(app.viewers[0].lastScale.steps,1);
  app.key('0',{ctrlKey:true});assert.equal(app.viewers[0].currentScaleValue,'page-fit');
  app.key('s',{ctrlKey:true});assert.equal(app.downloads[0].href,pdf);assert.equal(app.downloads[0].download,'second.pdf');
  app.key('ArrowRight');await flush();app.images.at(-1).onload();
  assert.equal(app.document.body.dataset.file,png);assert.equal(app.viewers[0].pdfDocument,null);
  app.key('ArrowLeft');await flush();
  assert.equal(app.document.body.dataset.file,pdf);assert.equal(app.imports.length,2,'PDF engine is reused');
  assert.equal(app.key('Escape').prevented,undefined,'Existing inline Escape handler owns closing');
});

test('a slow previous PDF cannot replace a newly selected image',async()=>{
  const app=setup({file:pdf,holdPdf:true});await flush();assert.equal(app.tasks.length,1);
  app.key('ArrowRight');await flush();app.images.at(-1).onload();
  app.pdfGate.resolve({url:pdf});await app.ready;await flush();
  assert.equal(app.document.body.dataset.file,png);assert.equal(app.document.body.dataset.ready,'true');
  assert.equal(app.nodes['document-container'].hidden,true);assert.equal(app.viewers[0].pdfDocument,null);
  assert.equal(app.tasks[0].destroyed,true);
});

test('only the loaded image or completed PDF page reveals content, never stale callbacks',async()=>{
  const app=setup();await app.ready;
  assert.equal(app.document.body.dataset.ready,'false');assert.equal(app.nodes.loading.dataset.state,'loading');
  const previous=app.images[0];app.key('ArrowRight');await flush();
  app.key('ArrowRight');await flush();
  previous.onload();assert.equal(app.document.body.dataset.ready,'false');
  previous.onerror();assert.equal(app.nodes.loading.dataset.state,'loading');
  app.images.at(-1).onload();assert.equal(app.document.body.dataset.ready,'true');
  const pdfApp=setup({file:pdf,holdRender:true});await pdfApp.ready;
  assert.equal(pdfApp.document.body.dataset.ready,'false');
  pdfApp.viewers[0].render();assert.equal(pdfApp.document.body.dataset.ready,'true');
});

test('index/asset errors retain an original-file link rather than a forced download',async()=>{
  const app=setup({indexOk:false});await app.ready;
  assert.equal(app.nodes.loading.children.at(-1).href,gif);
  assert.equal(app.nodes.loading.children.at(-1).download,undefined);
  assert.equal(app.nodes.loading.dataset.state,'error');
  const image=setup();await image.ready;image.images[0].onerror();
  assert.equal(image.nodes.loading.children.at(-1).href,gif);
  assert.equal(image.nodes.loading.hidden,false);
  assert.equal(image.nodes.loading.dataset.state,'error');assert.equal(image.document.body.dataset.ready,'false');
  const invalid=setup({file:'/private/file.pdf',indexOk:false});await invalid.ready;
  assert.equal(invalid.nodes.loading.dataset.state,'error');
});

test('the reader shell keeps its Escape fallback and no render-blocking PDF stylesheet',()=>{
  const html=fs.readFileSync(path.join(root,'research-viewer/index.html'),'utf8');
  assert.doesNotMatch(html,/<link[^>]+pdf_viewer\.css/);
  assert.match(html,/window\.close\(\)/);assert.match(html,/dataset\.returnUrl\|\|'\/cv\/'/);
  assert.match(html,/image-container\.enlarged img\{max-width:none;max-height:none/);
  assert.match(html,/<body data-ready="false">/);
  assert.match(html,/body:not\(\[data-ready="true"\]\) #pdf-pages,body:not\(\[data-ready="true"\]\) #image-container img\{visibility:hidden;opacity:0\}/);
  assert.match(html,/#loading\[data-state="loading"\]\{color:transparent\}/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\)/);
});
