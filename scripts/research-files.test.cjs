const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../assets/js/research-files.js'),'utf8').replace('export function','function');
function setup({blockedStorage=false}={}){
  const files=['/images/research/first.gif','/files/research/second.pdf'];
  const links=files.map(file=>({getAttribute:()=>file,querySelector:()=>({alt:'Original image'})}));
  const nodes=[{classList:{contains:()=>true},querySelector:()=>({id:'project'})},...links.map((link,i)=>({
    id:'figure-'+i,classList:{contains:()=>false},querySelector:s=>s==='strong'?{textContent:'Figure '+i}:link
  }))];
  const events={},writes=[],navigations=[],warm=[];
  vm.runInNewContext(source,{URL,Map,document:{querySelectorAll:()=>nodes,
    scripts:[{src:'https://example.com/assets/js/research-files.js?v=abc'}],addEventListener:(name,fn)=>events[name]=fn},
    location:{origin:'https://example.com',assign(url){navigations.push({url,writesBeforeNavigation:writes.length});}},
    sessionStorage:{setItem(k,v){if(blockedStorage)throw new Error('blocked');writes.push([k,JSON.parse(v)]);}},
    window:{siteWarmLink:url=>warm.push(url),open(){throw new Error('Normal figure clicks must never create a tab');}}});
  const click=extra=>{const event={target:{closest:()=>links[0]},button:0,preventDefault(){this.prevented=true;},...extra};events.click(event);return event;};
  return {click,writes,navigations,files,events,links,warm};
}
test('normal figure clicks reuse the current tab and preserve ordered metadata',()=>{
  const app=setup(),event=app.click();
  assert.equal(event.prevented,true);assert.equal(app.navigations.length,1);
  assert.equal(app.navigations[0].writesBeforeNavigation,1);
  const [key,context]=app.writes[0];assert.equal(key,'research-reader-context');
  assert.equal(context.project,'project');assert.equal(context.version,'abc');
  assert.deepEqual(context.items.map(x=>x.file),app.files);
  assert(context.items.every(x=>!('link' in x)));
  assert.equal(new URL(app.navigations[0].url).searchParams.get('file'),app.files[0]);
  assert.equal(new URL(app.navigations[0].url).searchParams.get('from'),'cv');
});
test('intent prepares the exact reader URL without navigation or extra context writes',()=>{
  const app=setup();for(const name of ['pointerover','pointerdown','focusin'])app.events[name]({target:{closest:()=>app.links[0]}});
  assert.equal(app.warm.length,3);assert.equal(app.writes.length,0);assert.equal(app.navigations.length,0);
  app.click();assert(app.warm.every(url=>url===app.navigations[0].url));
});
test('expanding a project prepares only its first original and reader, never the entire gallery',()=>{
  const app=setup();const panel={open:false,matches:()=>true,querySelector:()=>app.links[0]};
  app.events.toggle({target:panel});assert.equal(app.warm.length,0);
  panel.open=true;app.events.toggle({target:panel});
  assert.equal(app.warm.length,2);assert.equal(app.warm[0],app.files[0]);
  assert.equal(new URL(app.warm[1]).searchParams.get('file'),app.files[0]);
  assert.equal(app.navigations.length,0);assert.equal(app.writes.length,0);
});
test('native modified clicks remain untouched and restrictions never lose the original link',()=>{
  for(const extra of [{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{button:1},{defaultPrevented:true}]){
    const app=setup();assert.equal(app.click(extra).prevented,undefined);assert.equal(app.navigations.length,0);assert.equal(app.writes.length,0);
  }
  const storage=setup({blockedStorage:true});assert.equal(storage.click().prevented,true);assert.equal(storage.navigations.length,1);
});
