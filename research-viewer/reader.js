const container = document.getElementById('document-container');
const imageContainer = document.getElementById('image-container');
const message = document.getElementById('loading');
const params = new URLSearchParams(location.search);
let pdfApiPromise, viewerPromise, viewer, linkService;
let task=null,pdfFetch=null,revision=0,index=0,items=[];

function readyImage(){
 return !imageContainer.hidden&&document.body.dataset.ready==='true'?imageContainer.querySelector('img'):null;
}
function resetImageZoom(){
 const image=readyImage();if(!image)return;
 image.style.width='';image.style.height='';imageContainer.classList.remove('enlarged');imageContainer.scrollTo(0,0);
}
function setImageZoom(scale,origin){
 const image=readyImage();if(!image||!image.naturalWidth||!Number.isFinite(scale))return;
 const bounds=imageContainer.getBoundingClientRect(),before=image.getBoundingClientRect();
 const fit=Math.min(1,imageContainer.clientWidth/image.naturalWidth,imageContainer.clientHeight/image.naturalHeight);
 scale=Math.max(fit*.1,Math.min(8,scale));
 const point=origin||[bounds.left+imageContainer.clientWidth/2,bounds.top+imageContainer.clientHeight/2];
 const x=Math.max(0,Math.min(1,(point[0]-before.left)/before.width));
 const y=Math.max(0,Math.min(1,(point[1]-before.top)/before.height));
 imageContainer.classList.add('enlarged');
 image.style.width=image.naturalWidth*scale+'px';image.style.height=image.naturalHeight*scale+'px';
 const after=image.getBoundingClientRect();
 imageContainer.scrollLeft+=after.left+x*after.width-point[0];
 imageContainer.scrollTop+=after.top+y*after.height-point[1];
}
function zoomImage(factor,origin){
 const image=readyImage();if(image)setImageZoom(image.getBoundingClientRect().width/image.naturalWidth*factor,origin);
}

// Images/GIFs use the original file directly, without downloading a PDF renderer.
function loadPdfApi() {
 if (!pdfApiPromise) pdfApiPromise=import('/assets/vendor/pdfjs-5.6.205/pdf.min.mjs').then(pdfjs=>{
  globalThis.pdfjsLib=pdfjs;
  pdfjs.GlobalWorkerOptions.workerSrc='/assets/vendor/pdfjs-5.6.205/pdf.worker.min.mjs';
  return pdfjs;
 });
 return pdfApiPromise;
}
function loadPdfViewer() {
 if (!viewerPromise) viewerPromise=(async()=>{
  // Start the stylesheet and API together; the viewer module needs pdfjsLib first.
  const styles=new Promise((resolve,reject)=>{
   const link=document.createElement('link');link.rel='stylesheet';
   link.href='/assets/vendor/pdfjs-5.6.205/pdf_viewer.css';
   link.onload=resolve;link.onerror=()=>reject(new Error('Unable to load PDF styles'));
   document.head.append(link);
  });
  const module=loadPdfApi().then(()=>import('/assets/vendor/pdfjs-5.6.205/pdf_viewer.mjs'));
  const [{EventBus,PDFViewer,PDFLinkService}]=await Promise.all([module,styles]);
  const eventBus=new EventBus();
  linkService=new PDFLinkService({eventBus});
  viewer=new PDFViewer({container,viewer:document.getElementById('pdf-pages'),eventBus,linkService,removePageBorders:false});
  linkService.setViewer(viewer);
  eventBus.on('pagesinit',()=>{viewer.currentScaleValue='page-fit';container.scrollTo(0,0);});
  eventBus.on('pagerendered',event=>{
   if (event.source!==viewer.getPageView(event.pageNumber-1)) return;
   message.hidden=true;document.body.dataset.ready='true';
  });
  return viewer;
 })();
 return viewerPromise;
}

async function show(nextIndex) {
 if(nextIndex<0||nextIndex>=items.length)return;
 index=nextIndex;const entry=items[index],generation=++revision;
 document.body.dataset.ready='false';document.body.dataset.file=entry.file;
 document.body.dataset.returnUrl='/cv/#'+(entry.anchor||params.get('project'));
 const backLink=document.getElementById('reader-back');
 if(backLink)backLink.href=document.body.dataset.returnUrl;
 document.title=entry.file.split('/').pop();message.hidden=false;message.dataset.state='loading';message.textContent='Loading document…';
 const url=new URL(location.href);url.searchParams.set('file',entry.file);url.searchParams.delete('figure');history.replaceState(null,'',url);
 const previousTask=task;task=null;viewer?.setDocument(null);linkService?.setDocument(null);
 if(pdfFetch){pdfFetch.abort();pdfFetch=null;}
 if(previousTask)previousTask.destroy().catch(()=>{});
 imageContainer.replaceChildren();imageContainer.classList.remove('enlarged');imageContainer.scrollTo(0,0);
 if(!/\.pdf$/i.test(entry.file)){
  container.hidden=true;imageContainer.hidden=false;
  const image=new Image();image.alt=entry.title;image.fetchPriority='high';
  image.onload=()=>{if(generation===revision){message.hidden=true;document.body.dataset.ready='true';}};
  image.onerror=()=>fail(entry,generation);
  image.onclick=()=>{if(imageContainer.classList.contains('enlarged'))resetImageZoom();else setImageZoom(1);};
  image.src=entry.file;imageContainer.append(image);return;
 }
 container.hidden=false;imageContainer.hidden=true;
 const controller=new AbortController();pdfFetch=controller;
 try{
  // These research-figure PDFs are small: fetch their original bytes while the engine starts.
  const bytesRequest=fetch(entry.file,{signal:controller.signal,priority:'high'}).then(response=>{
   if(!response.ok)throw new Error('Unable to load PDF ('+response.status+')');
   return response.arrayBuffer();
  });
  const [pdfjs,bytes]=await Promise.all([loadPdfApi(),bytesRequest]);
  if(generation!==revision)return;
  const loadingTask=pdfjs.getDocument({data:new Uint8Array(bytes),docBaseUrl:new URL(entry.file,location.href).href,
   standardFontDataUrl:'/assets/vendor/pdfjs-5.6.205/standard_fonts/',isEvalSupported:false});task=loadingTask;
  const [pdf]=await Promise.all([loadingTask.promise,loadPdfViewer()]);
  if(generation!==revision){await loadingTask.destroy();return;}
  viewer.setDocument(pdf);linkService.setDocument(pdf);
 }catch(error){controller.abort();if(generation===revision){console.error(error);fail(entry,generation);}}
 finally{if(pdfFetch===controller)pdfFetch=null;}
}
function fail(entry,generation){
 if(generation!==revision)return;document.body.dataset.ready='false';message.hidden=false;message.dataset.state='error';message.replaceChildren(document.createTextNode('Unable to load. '));
 const link=document.createElement('a');link.href=entry.file;link.textContent='Open original file';message.append(link);
}
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'||!items.length)return;
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'){
  event.preventDefault();const link=document.createElement('a');link.href=items[index].file;link.download=items[index].file.split('/').pop();link.click();return;
 }
 if((event.ctrlKey||event.metaKey)&&['+','=','-','0'].includes(event.key)&&viewer?.pdfDocument){
  event.preventDefault();
  if(event.key==='0')viewer.currentScaleValue='page-fit';
  else viewer.updateScale({steps:event.key==='-'?-1:1,drawingDelay:150});
  return;
 }
 if((event.ctrlKey||event.metaKey)&&['+','=','-','0'].includes(event.key)&&readyImage()){
  event.preventDefault();
  if(event.key==='0')resetImageZoom();else zoomImage(event.key==='-'?1/1.2:1.2);
  return;
 }
 if(event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
  event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));
 }
});
container.addEventListener('wheel',event=>{
 if((!event.ctrlKey&&!event.metaKey)||!viewer?.pdfDocument)return;
 event.preventDefault();viewer.updateScale({scaleFactor:Math.exp(-event.deltaY*.002),origin:[event.clientX,event.clientY],drawingDelay:150});
},{passive:false});
imageContainer.addEventListener('wheel',event=>{
 if((!event.ctrlKey&&!event.metaKey)||!readyImage())return;
 event.preventDefault();
 const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?imageContainer.clientHeight:1);
 zoomImage(Math.exp(-Math.max(-500,Math.min(500,pixels))*.002),[event.clientX,event.clientY]);
},{passive:false});
window.addEventListener('resize',()=>{if(viewer?.pdfDocument)viewer.currentScaleValue='page-fit';});

// A CV click already knows the ordered figures. Direct links retain the index fallback.
function readContext(){
 try{
  const context=JSON.parse(sessionStorage.getItem('research-reader-context'));
  if(!context||context.project!==params.get('project')||context.version!==(params.get('v')||''))return null;
  if(!Array.isArray(context.items)||!context.items.length||context.items.length>250)return null;
  if(!context.items.every(entry=>entry&&typeof entry.file==='string'&&
    /^\/(files|images)\/research\/[^/?#%\\]+\.(pdf|png|webp|gif|jpe?g|svg)$/i.test(entry.file)&&
    typeof entry.title==='string'&&typeof entry.anchor==='string'&&/^[\w-]+$/.test(entry.anchor)))return null;
  if(!context.items.some(entry=>entry.file===params.get('file')))return null;
  return context.items;
 }catch(_){return null;}
}
const contextItems=readContext();
const indexRequest=contextItems?null:fetch('/search-index.json'+(params.get('v')?'?v='+encodeURIComponent(params.get('v')):''));
const collectorRequest=contextItems?null:import('/assets/js/research-files.js'+(params.get('v')?'?v='+encodeURIComponent(params.get('v')):''));
if(/^\/files\/research\/[^/?#]+\.pdf$/i.test(params.get('file')||'')) {
 loadPdfViewer().catch(()=>{}); // Actual display reports errors with the original-file fallback.
}
try{
 if(contextItems)items=contextItems;
 else{
  const [response,{collectResearchFiles}]=await Promise.all([indexRequest,collectorRequest]);
  if(!response.ok)throw new Error('Unable to load research index');
  const data=await response.json();
  const template=document.createElement('template');template.innerHTML=data.cv.html;
  const groups=collectResearchFiles(template.content);
  items=groups[params.get('project')]||[];
 }
 const requested=items.findIndex(entry=>entry.file===params.get('file'));
 index=requested>=0?requested:Math.max(0,Math.min(items.length-1,Number(params.get('figure')||1)-1));
 if(!items.length){message.dataset.state='error';message.textContent='Document not found.';}
 else await show(index);
}catch(error){
 console.error(error);
 const file=params.get('file')||'';
 if(/^\/(files|images)\/research\/[^/?#]+\.(pdf|png|webp|gif|jpe?g|svg)$/i.test(file))fail({file},revision);
 else{message.dataset.state='error';message.textContent='Unable to load research index.';}
}
