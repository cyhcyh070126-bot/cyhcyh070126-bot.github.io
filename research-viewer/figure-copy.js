// PDF figures keep their vector renderer; copying uses the current original image.
export function createFigureCopyMenu({container,getState}) {
 const menu=document.getElementById('figure-menu');
 const button=document.getElementById('figure-copy');
 const status=document.getElementById('figure-copy-status');
 let selected=null,copyToken=0,request=null,renderTask=null;
 function close(){menu.hidden=true;selected=null;}
 function reset(){
  close();copyToken++;status.hidden=true;
  request?.abort();request=null;renderTask?.cancel();renderTask=null;
 }
 function isCurrent(snapshot,token){
  const current=getState();
  return token===copyToken&&current.ready&&current.revision===snapshot.revision&&
   current.entry?.file===snapshot.entry.file&&current.pdfDocument===snapshot.pdfDocument;
 }
 function assertCurrent(snapshot,token){
  if(!isCurrent(snapshot,token))throw new DOMException('Figure changed','AbortError');
 }
 function report(text,snapshot,failed=false){
  status.replaceChildren(document.createTextNode(text));
  if(failed){
   const link=document.createElement('a');link.href=snapshot.entry.image||snapshot.entry.file;
   link.textContent=snapshot.entry.image?'Open original image':'Open original file';
   link.target='_blank';link.rel='noopener';status.append(link);
  }
  status.hidden=false;
 }
 function canvasBlob(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Unable to export image')),'image/png'));
 }
 async function rasterize(blob,snapshot,token){
  const url=URL.createObjectURL(blob),image=new Image();
  const canvas=document.createElement('canvas');
  try{
   const loaded=new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Unable to decode image'));});
   image.src=url;await loaded;assertCurrent(snapshot,token);
   const scale=Math.min(1,Math.sqrt(16000000/(image.naturalWidth*image.naturalHeight)));
   canvas.width=Math.max(1,Math.floor(image.naturalWidth*scale));
   canvas.height=Math.max(1,Math.floor(image.naturalHeight*scale));
   const context=canvas.getContext('2d');
   context.fillStyle='white';context.fillRect(0,0,canvas.width,canvas.height);
   context.drawImage(image,0,0,canvas.width,canvas.height);
   return await canvasBlob(canvas);
  }finally{URL.revokeObjectURL(url);canvas.width=canvas.height=0;}
 }
 async function renderPage(snapshot,token){
  const page=await snapshot.pdfDocument.getPage(snapshot.pageNumber);
  assertCurrent(snapshot,token);
  const base=page.getViewport({scale:1});
  const scale=Math.min(4,4096/Math.max(base.width,base.height),Math.sqrt(16000000/(base.width*base.height)));
  const viewport=page.getViewport({scale}),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.floor(viewport.width));canvas.height=Math.max(1,Math.floor(viewport.height));
  const rendering=page.render({canvasContext:canvas.getContext('2d'),viewport,background:'white'});
  renderTask=rendering;
  try{await rendering.promise;assertCurrent(snapshot,token);return await canvasBlob(canvas);}
  finally{if(renderTask===rendering)renderTask=null;canvas.width=canvas.height=0;}
 }
 async function imageBlob(snapshot,token){
  assertCurrent(snapshot,token);
  if(snapshot.entry.image&&snapshot.pdfDocument.numPages===1){
   const controller=new AbortController();request=controller;
   try{
    const response=await fetch(snapshot.entry.image,{signal:controller.signal});
    if(!response.ok)throw new Error('Unable to load original image');
    const blob=await response.blob();assertCurrent(snapshot,token);
    const png=blob.type==='image/png'?blob:await rasterize(blob,snapshot,token);
    assertCurrent(snapshot,token);return png;
   }catch(error){assertCurrent(snapshot,token);}
   finally{if(request===controller)request=null;}
  }
  // Old saved reader contexts may not yet include the companion image.
  const blob=await renderPage(snapshot,token);assertCurrent(snapshot,token);return blob;
 }
 container.addEventListener('contextmenu',event=>{
  close();
  const state=getState(),page=event.target.closest?.('.page');
  if(state.documentMode||!state.ready||!state.pdfDocument||!page||!container.contains(page)||
    event.target.closest?.('a,button,input,textarea,select')||window.getSelection()?.isCollapsed===false)return;
  event.preventDefault();
  selected={...state,pageNumber:Number(page.dataset.pageNumber)||1};
  status.hidden=true;menu.hidden=false;
  const bounds=page.getBoundingClientRect();
  const x=event.clientX||bounds.left+16,y=event.clientY||bounds.top+16;
  menu.style.left=Math.max(4,Math.min(x,window.innerWidth-menu.offsetWidth-4))+'px';
  menu.style.top=Math.max(4,Math.min(y,window.innerHeight-menu.offsetHeight-4))+'px';
  button.focus({preventScroll:true});
 });
 button.addEventListener('click',()=>{
  const snapshot=selected;close();
  if(!snapshot)return;
  const token=++copyToken;
  if(!isCurrent(snapshot,token))return;
  if(!navigator.clipboard?.write||typeof ClipboardItem==='undefined'){
   report('Image copying is unavailable in this browser. ',snapshot,true);return;
  }
  report('Copying image…',snapshot);
  // Keep clipboard.write inside the user gesture while the image bytes load.
  let writing;
  try{
   const blob=imageBlob(snapshot,token);blob.catch(()=>{});
   writing=navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
  }
  catch(error){report('Could not copy image. ',snapshot,true);return;}
  Promise.resolve(writing).then(()=>{
   if(isCurrent(snapshot,token))report('Image copied.',snapshot);
  },()=>{if(isCurrent(snapshot,token))report('Could not copy image. ',snapshot,true);});
 });
 document.addEventListener('pointerdown',event=>{if(!menu.hidden&&!menu.contains(event.target))close();},true);
 document.addEventListener('keydown',event=>{
  if(!menu.hidden&&event.key==='Escape'){
   event.preventDefault();event.stopImmediatePropagation();close();container.focus({preventScroll:true});
  }
 },true);
 container.addEventListener('scroll',close,{passive:true});
 window.addEventListener('blur',close);window.addEventListener('resize',close);
 return {reset};
}
