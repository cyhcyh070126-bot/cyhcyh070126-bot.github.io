const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../research-viewer/figure-copy.js'),'utf8').replace('export function','function');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
function setup({holdFetch=false,fetchOk=true,clipboard=true,rejectCopy=false,type='image/png',holdRender=false}={}){
 const events={},windowEvents={},requests=[],writes=[],accepted=[],canvases=[],renders=[],revoked=[];
 const fetchGate=deferred(),renderGate=deferred();let selectedText=false;
 function element(){return {hidden:true,style:{},dataset:{},children:[],events:{},offsetWidth:140,offsetHeight:42,
  addEventListener(name,fn){this.events[name]=fn;},append(child){this.children.push(child);},
  replaceChildren(...children){this.children=children;},contains(node){return node===this||this.children.includes(node);},
  focus(){this.focused=true;},getBoundingClientRect(){return {left:20,top:60};}};}
 const container=element(),menu=element(),button=element(),status=element(),page=element();
 page.dataset.pageNumber='1';container.children=[page];menu.children=[button];
 const nodes={'figure-menu':menu,'figure-copy':button,'figure-copy-status':status};
 const document={getElementById:id=>nodes[id],createTextNode:text=>({textContent:text}),
  addEventListener(name,fn){events[name]=fn;},createElement(tag){
   const node=element();if(tag==='canvas'){
    node.getContext=()=>({fillRect(){},drawImage(){node.drawn=true;}});
    node.toBlob=callback=>callback(new Blob(['canvas:'+node.width+'x'+node.height],{type:'image/png'}));canvases.push(node);
   }return node;
  }};
 const pdf={numPages:1,async getPage(number){renders.push({number});return {
  getViewport({scale}){return {width:2000*scale,height:1600*scale};},
  render(options){renders.at(-1).options=options;const job={promise:holdRender?renderGate.promise:Promise.resolve(),cancel(){this.cancelled=true;}};renders.at(-1).job=job;return job;}
 };}};
 let state={entry:{file:'/files/research/first.pdf',image:'/images/research/first.png'},revision:1,pdfDocument:pdf,ready:true,documentMode:false};
 const window={innerWidth:1000,innerHeight:800,getSelection:()=>({isCollapsed:!selectedText}),addEventListener(name,fn){windowEvents[name]=fn;}};
 class MockImage{constructor(){this.naturalWidth=8000;this.naturalHeight=4000;}set src(url){this.url=url;queueMicrotask(()=>this.onload());}}
 class MockURL extends URL{static createObjectURL(){return 'blob:test';}static revokeObjectURL(url){revoked.push(url);}}
 class ClipboardItem{constructor(data){this.data=data;}}
 const navigator=clipboard?{clipboard:{write(items){writes.push(items);if(rejectCopy)return Promise.reject(new Error('NotAllowedError'));
  return Promise.all(items.map(item=>item.data['image/png'])).then(blobs=>accepted.push(...blobs));}}}:{};
 const context={document,window,navigator,ClipboardItem,DOMException,AbortController,URL:MockURL,Image:MockImage,Promise,
  fetch(url,options){requests.push({url,options});return holdFetch?fetchGate.promise:Promise.resolve({ok:fetchOk,blob:async()=>new Blob([url],{type})});}};
 const create=vm.runInNewContext(source+';createFigureCopyMenu',context);
 const api=create({container,getState:()=>state});
 function open(extra={}){
  const event={clientX:990,clientY:790,target:{closest(selector){return selector==='.page'?page:null;}},preventDefault(){this.prevented=true;},...extra};
  container.events.contextmenu(event);return event;
 }
 return {api,container,menu,button,status,page,events,windowEvents,requests,writes,accepted,canvases,renders,revoked,fetchGate,renderGate,open,
  copy:()=>button.events.click(),selectText(value){selectedText=value;},setState(value){state={...state,...value};},getState:()=>state};
}
test('each PDF copies its own original PNG and does not replace the PDF renderer',async()=>{
 const app=setup();const pdf=app.getState().pdfDocument;
 assert.equal(app.open().prevented,true);assert.equal(app.menu.hidden,false);assert.equal(app.menu.style.left,'856px');assert.equal(app.menu.style.top,'754px');
 app.copy();assert.equal(app.writes.length,1,'Clipboard write starts inside the click gesture');await flush();
 assert.equal(await app.accepted[0].text(),'/images/research/first.png');assert.equal(app.menu.hidden,true);
 assert.equal(app.status.children[0].textContent,'Image copied.');assert.equal(app.renders.length,0);
 app.api.reset();app.setState({entry:{file:'/files/research/second.pdf',image:'/images/research/second.png'},revision:2});
 app.open();app.copy();await flush();
 assert.equal(await app.accepted[1].text(),'/images/research/second.png');assert.equal(app.getState().pdfDocument,pdf);
});
test('native selected-text, link, unloaded, image and application-document menus remain intact',()=>{
 for(const changes of [{documentMode:true},{ready:false},{pdfDocument:null}]){
  const app=setup();app.setState(changes);assert.equal(app.open().prevented,undefined);assert.equal(app.menu.hidden,true);
 }
 const text=setup();text.selectText(true);assert.equal(text.open().prevented,undefined);
 const link=setup();assert.equal(link.open({target:{closest:selector=>selector==='.page'?link.page:{tagName:'A'}}}).prevented,undefined);
 const outside=setup();outside.container.children=[];assert.equal(outside.open().prevented,undefined);
});
test('changing figures cancels a pending copy without committing stale pixels or success feedback',async()=>{
 const app=setup({holdFetch:true});app.open();app.copy();assert.equal(app.writes.length,1);
 app.api.reset();app.setState({revision:2,entry:{file:'/files/research/new.pdf'}});
 assert.equal(app.requests[0].options.signal.aborted,true);
 app.fetchGate.resolve({ok:true,blob:async()=>new Blob(['old'],{type:'image/png'})});await flush();
 assert.equal(app.accepted.length,0);assert.equal(app.status.hidden,true);assert.equal(app.menu.hidden,true);
});
test('old contexts and unavailable companion images copy the selected PDF page at bounded high resolution',async()=>{
 for(const useImage of [false,true]){
  const app=setup({fetchOk:false});if(!useImage)app.setState({entry:{file:'/files/research/first.pdf'}});
  app.page.dataset.pageNumber='2';app.open();app.copy();await flush();
  assert.equal(app.renders[0].number,2);const vp=app.renders[0].options.viewport;
  assert(vp.width*vp.height<=16000000);assert(vp.width>2000);assert.equal(app.accepted.length,1);
  assert.match(await app.accepted[0].text(),/^canvas:/);assert.equal(app.canvases[0].width,0,'Release temporary render storage');
 }
});
test('SVG and other image formats convert to PNG and release temporary URLs',async()=>{
 const app=setup({type:'image/svg+xml'});app.setState({entry:{file:'/files/research/first.pdf',image:'/images/research/first.svg'}});
 app.open();app.copy();await flush();
 assert.equal(app.accepted[0].type,'image/png');assert.equal(app.canvases[0].drawn,true);assert.deepEqual(app.revoked,['blob:test']);
 const dimensions=(await app.accepted[0].text()).match(/(\d+)x(\d+)/);assert(Number(dimensions[1])*Number(dimensions[2])<=16000000);
});
test('a multi-page PDF copies the chosen page instead of reusing its cover image',async()=>{
 const app=setup();app.getState().pdfDocument.numPages=3;app.page.dataset.pageNumber='2';
 app.open();app.copy();await flush();
 assert.equal(app.requests.length,0);assert.equal(app.renders[0].number,2);assert.equal(app.accepted.length,1);
});
test('copy permission failures are visible and retain the correct original-image fallback',async()=>{
 for(const options of [{clipboard:false},{rejectCopy:true}]){
  const app=setup(options);app.open();app.copy();await flush();
  assert.equal(app.accepted.length,0);assert.equal(app.status.hidden,false);
  assert.equal(app.status.children.at(-1).href,'/images/research/first.png');
  assert.doesNotMatch(app.status.children[0].textContent,/Image copied/);
 }
});
test('Escape closes the menu before the reader returns, and outside clicks/scroll dismiss it',()=>{
 const app=setup();app.open();const event={key:'Escape',preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};
 app.events.keydown(event);assert.equal(event.prevented,true);assert.equal(event.stopped,true);assert.equal(app.menu.hidden,true);assert.equal(app.container.focused,true);
 app.open();app.events.pointerdown({target:app.button});assert.equal(app.menu.hidden,false);
 app.events.pointerdown({target:{}});assert.equal(app.menu.hidden,true);
 app.open();app.container.events.scroll();assert.equal(app.menu.hidden,true);
});
test('switching figures cancels a pending PDF export',async()=>{
 const app=setup({holdRender:true});app.setState({entry:{file:'/files/research/first.pdf'}});app.open();app.copy();await flush();
 app.api.reset();app.setState({revision:2});assert.equal(app.renders[0].job.cancelled,true);
 app.renderGate.resolve();await flush();assert.equal(app.accepted.length,0);assert.equal(app.status.hidden,true);
});
