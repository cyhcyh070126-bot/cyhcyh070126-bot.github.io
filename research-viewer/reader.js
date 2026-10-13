import * as pdfjs from '/assets/vendor/pdfjs-5.6.205/pdf.min.mjs';
import {collectResearchFiles} from '/assets/js/research-files.js';
globalThis.pdfjsLib = pdfjs;
pdfjs.GlobalWorkerOptions.workerSrc = '/assets/vendor/pdfjs-5.6.205/pdf.worker.min.mjs';
const {EventBus, PDFViewer, PDFLinkService} = await import('/assets/vendor/pdfjs-5.6.205/pdf_viewer.mjs');
const container = document.getElementById('document-container');
const imageContainer = document.getElementById('image-container');
const message = document.getElementById('loading');
const eventBus = new EventBus();
const linkService = new PDFLinkService({eventBus});
const viewer = new PDFViewer({container, viewer:document.getElementById('pdf-pages'),eventBus,linkService,removePageBorders:false});
linkService.setViewer(viewer);
eventBus.on('pagesinit',()=>{viewer.currentScaleValue='page-fit';container.scrollTo(0,0);});
eventBus.on('pagerendered',event=>{
 if (event.source !== viewer.getPageView(event.pageNumber-1)) return;
 message.hidden=true;document.body.dataset.ready='true';
});
let task=null,revision=0,index=0,items=[];
const params=new URLSearchParams(location.search);
// Reuse the site's existing rendered CV index so changed figures never leave a stale list.
const response=await fetch('/search-index.json'+(params.get('v')?'?v='+encodeURIComponent(params.get('v')):''));
const data=await response.json();
const template=document.createElement('template');template.innerHTML=data.cv.html;
const groups=collectResearchFiles(template.content);
const project=params.get('project');
items=groups[project]||[];
const requested=items.findIndex(entry=>entry.file===params.get('file'));
index=requested>=0?requested:Math.max(0,Math.min(items.length-1,Number(params.get('figure')||1)-1));
if(!items.length){message.textContent='Document not found.';throw new Error('Unknown research project');}

async function show(nextIndex){
 if(nextIndex<0||nextIndex>=items.length)return;
 index=nextIndex;const entry=items[index],generation=++revision;
 document.body.dataset.ready='false';document.body.dataset.file=entry.file;
 document.body.dataset.returnUrl='/cv/#'+(entry.anchor||project);
 document.title=entry.file.split('/').pop();message.hidden=false;message.textContent='Loading document…';
 const url=new URL(location.href);url.searchParams.set('file',entry.file);url.searchParams.delete('figure');history.replaceState(null,'',url);
 const previousTask=task;task=null;viewer.setDocument(null);linkService.setDocument(null);
 if(previousTask)previousTask.destroy().catch(()=>{});
 imageContainer.replaceChildren();imageContainer.classList.remove('enlarged');
 if(!/\.pdf$/i.test(entry.file)){
  container.hidden=true;imageContainer.hidden=false;
  const image=new Image();image.alt=entry.title;
  image.onload=()=>{if(generation===revision){message.hidden=true;document.body.dataset.ready='true';}};
  image.onerror=()=>fail(entry,generation);
  image.onclick=()=>imageContainer.classList.toggle('enlarged');
  image.src=entry.file;imageContainer.append(image);return;
 }
 container.hidden=false;imageContainer.hidden=true;
 try{
  const loadingTask=pdfjs.getDocument({url:entry.file,standardFontDataUrl:'/assets/vendor/pdfjs-5.6.205/standard_fonts/',isEvalSupported:false});task=loadingTask;
  const pdf=await loadingTask.promise;
  if(generation!==revision){await loadingTask.destroy();return;}
  viewer.setDocument(pdf);linkService.setDocument(pdf);
 }catch(error){if(generation===revision){console.error(error);fail(entry,generation);}}
}
function fail(entry,generation){
 if(generation!==revision)return;message.replaceChildren(document.createTextNode('Unable to load. '));
 const link=document.createElement('a');link.href=entry.file;link.textContent='Open original file';message.append(link);
}
document.addEventListener('keydown',event=>{
 if(event.key==='Escape')return;
 if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='s'){
  event.preventDefault();const link=document.createElement('a');link.href=items[index].file;link.download=items[index].file.split('/').pop();link.click();return;
 }
 if((event.ctrlKey||event.metaKey)&&['+','=','-','0'].includes(event.key)&&viewer.pdfDocument){
  event.preventDefault();
  if(event.key==='0')viewer.currentScaleValue='page-fit';
  else viewer.updateScale({steps:event.key==='-'?-1:1,drawingDelay:150});
  return;
 }
 if(event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
  event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));
 }
});
container.addEventListener('wheel',event=>{
 if(!event.ctrlKey&&!event.metaKey)return;
 event.preventDefault();viewer.updateScale({scaleFactor:Math.exp(-event.deltaY*.002),origin:[event.clientX,event.clientY],drawingDelay:150});
},{passive:false});
window.addEventListener('resize',()=>{if(viewer.pdfDocument)viewer.currentScaleValue='page-fit';});
show(index);
