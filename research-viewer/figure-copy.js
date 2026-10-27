// Keep the original renderers; all figure formats share one ordered clipboard path.
export function createFigureCopyMenu({container,imageContainer,getState}) {
 const menu=document.getElementById('figure-menu');
 const button=document.getElementById('figure-copy');
 const download=document.getElementById('figure-download');
 const status=document.getElementById('figure-copy-status');
 let selected=null,copyToken=0,request=null,renderTask=null,writeTail=Promise.resolve();
 function close(){menu.hidden=true;selected=null;}
 function cancelExport(){request?.abort();request=null;renderTask?.cancel();renderTask=null;}
 function reset(){close();copyToken++;status.hidden=true;cancelExport();}
 function isCurrent(snapshot,token){
  const current=getState();
  return token===copyToken&&current.ready&&current.revision===snapshot.revision&&
   current.entry?.file===snapshot.entry.file&&current.pdfDocument===snapshot.pdfDocument&&
   current.image===snapshot.image&&(!snapshot.image||
    (snapshot.image.currentSrc||snapshot.image.src)===snapshot.imageSource);
 }
 function assertCurrent(snapshot,token){
  if(!isCurrent(snapshot,token))throw new DOMException('Figure changed','AbortError');
 }
 function report(text,snapshot,failed=false){
  status.replaceChildren(document.createTextNode(text));
  if(failed){
   const link=document.createElement('a');link.href=snapshot.imageSource||snapshot.entry.image||snapshot.entry.file;
   link.textContent=snapshot.image||snapshot.entry.image?'Open original image':'Open original file';
   link.target='_blank';link.rel='noopener';status.append(link);
  }
  status.hidden=false;
 }
 function canvasBlob(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Unable to export image')),'image/png'));
 }
 async function imagePixels(image){
  const canvas=document.createElement('canvas');
  try{
   const scale=Math.min(1,Math.sqrt(16000000/(image.naturalWidth*image.naturalHeight)));
   canvas.width=Math.max(1,Math.floor(image.naturalWidth*scale));
   canvas.height=Math.max(1,Math.floor(image.naturalHeight*scale));
   const context=canvas.getContext('2d');
   context.fillStyle='white';context.fillRect(0,0,canvas.width,canvas.height);
   context.drawImage(image,0,0,canvas.width,canvas.height);
   return await canvasBlob(canvas);
  }finally{canvas.width=canvas.height=0;}
 }
 async function rasterize(blob,snapshot,token){
  const url=URL.createObjectURL(blob),image=new Image();
  try{
   const loaded=new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Unable to decode image'));});
   image.src=url;await loaded;assertCurrent(snapshot,token);
   return await imagePixels(image);
  }finally{URL.revokeObjectURL(url);}
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
  // GIF copying uses the selected image's poster frame; saving preserves its animation.
  if(snapshot.image&&/\.gif(?:[?#]|$)/i.test(snapshot.imageSource)){
   const blob=await imagePixels(snapshot.image);assertCurrent(snapshot,token);return blob;
  }
  const source=snapshot.imageSource||(snapshot.pdfDocument?.numPages===1?snapshot.entry.image:null);
  if(source){
   const controller=new AbortController();request=controller;
   try{
    const response=await fetch(source,{signal:controller.signal});
    if(!response.ok)throw new Error('Unable to load original image');
    const blob=await response.blob();assertCurrent(snapshot,token);
    const png=blob.type==='image/png'?blob:await rasterize(blob,snapshot,token);
    assertCurrent(snapshot,token);return png;
   }catch(error){assertCurrent(snapshot,token);}
   finally{if(request===controller)request=null;}
  }
  // Older PDF contexts lack companion images; loaded images also survive a failed refetch.
  const blob=snapshot.image?await imagePixels(snapshot.image):await renderPage(snapshot,token);
  assertCurrent(snapshot,token);return blob;
 }
 function open(event){
  close();
  const state=getState(),page=event.target.closest?.('.page');
  const image=state.image&&event.target===state.image&&imageContainer?.contains(state.image)?state.image:null;
  if(state.documentMode||!state.ready||event.target.closest?.('a,button,input,textarea,select')||
    (!image&&(!state.pdfDocument||!page||!container.contains(page)||window.getSelection()?.isCollapsed===false)))return;
  event.preventDefault();
  selected={...state,pageNumber:Number(page?.dataset.pageNumber)||1,imageSource:image?(image.currentSrc||image.src):null};
  status.hidden=true;menu.hidden=false;
  const bounds=(image||page).getBoundingClientRect();
  const x=event.clientX||bounds.left+16,y=event.clientY||bounds.top+16;
  menu.style.left=Math.max(4,Math.min(x,window.innerWidth-menu.offsetWidth-4))+'px';
  menu.style.top=Math.max(4,Math.min(y,window.innerHeight-menu.offsetHeight-4))+'px';
  button.focus({preventScroll:true});
 }
 container.addEventListener('contextmenu',open);
 imageContainer?.addEventListener('contextmenu',open);
 button.addEventListener('click',()=>{
  const snapshot=selected;close();
  if(!snapshot)return;
  cancelExport();const token=++copyToken;
  if(!isCurrent(snapshot,token))return;
  if(!navigator.clipboard?.write||typeof ClipboardItem==='undefined'){
   report('Image copying is unavailable in this browser. ',snapshot,true);return;
  }
  report('Copying image…',snapshot);
  // Start write in the user gesture, but withhold its bytes until all older writes settle.
  // Keep this chain across resets and rejected writes: an older OS commit cannot overtake it.
  const previous=writeTail;
  let writing;
  try{
   const blob=imageBlob(snapshot,token);
   const ready=Promise.all([previous,blob]).then(([,value])=>{assertCurrent(snapshot,token);return value;});
   ready.catch(()=>{});
   writing=Promise.resolve(navigator.clipboard.write([new ClipboardItem({'image/png':ready})]));
   writeTail=Promise.allSettled([previous,writing]).then(()=>{});
  }
  catch(error){report('Could not copy image. ',snapshot,true);return;}
  writing.then(()=>{
   if(isCurrent(snapshot,token))report('Image copied.',snapshot);
  },()=>{if(isCurrent(snapshot,token))report('Could not copy image. ',snapshot,true);});
 });
 download.addEventListener('click',()=>{
  const snapshot=selected;close();if(!snapshot||!isCurrent(snapshot,copyToken))return;
  const link=document.createElement('a');link.href=snapshot.entry.file;
  link.download=snapshot.entry.file.split('/').pop().split(/[?#]/)[0];link.click();
 });
 document.addEventListener('pointerdown',event=>{if(!menu.hidden&&!menu.contains(event.target))close();},true);
 document.addEventListener('keydown',event=>{
  if(menu.hidden)return;
  if(event.key==='Escape'){
   const target=selected?.image?imageContainer:container;
   event.preventDefault();event.stopImmediatePropagation();close();target.focus({preventScroll:true});
  }else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();event.stopImmediatePropagation();
   (event.key==='Home'?button:event.key==='End'?download:document.activeElement===button?download:button).focus({preventScroll:true});
  }else if(event.key==='Tab')close();
 },true);
 container.addEventListener('scroll',close,{passive:true});
 imageContainer?.addEventListener('scroll',close,{passive:true});
 window.addEventListener('blur',close);window.addEventListener('resize',close);
 return {reset};
}
