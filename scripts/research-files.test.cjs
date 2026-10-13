const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../assets/js/research-files.js'),'utf8').replace('export function','function');
function setup({blockedStorage=false,blockedPopup=false}={}){
  const files=['/images/research/first.gif','/files/research/second.pdf'];
  const links=files.map(file=>({getAttribute:()=>file,querySelector:()=>({alt:'Original image'})}));
  const nodes=[{classList:{contains:()=>true},querySelector:()=>({id:'project'})},...links.map((link,i)=>({
    id:'figure-'+i,classList:{contains:()=>false},querySelector:s=>s==='strong'?{textContent:'Figure '+i}:link
  }))];
  const events={},writes=[],opened=[],reader={opener:'original'};
  vm.runInNewContext(source,{URL,Map,document:{querySelectorAll:()=>nodes,
    scripts:[{src:'https://example.com/assets/js/research-files.js?v=abc'}],addEventListener:(name,fn)=>events[name]=fn},
    location:{origin:'https://example.com'},sessionStorage:{setItem(k,v){if(blockedStorage)throw new Error('blocked');writes.push([k,JSON.parse(v)]);}},
    window:{open(url,target){opened.push({url,target,writesBeforeOpen:writes.length});return blockedPopup?null:reader;}}});
  const click=extra=>{const event={target:{closest:()=>links[0]},button:0,preventDefault(){this.prevented=true;},...extra};events.click(event);return event;};
  return {click,writes,opened,reader,files};
}
test('normal figure clicks hand off only ordered metadata before opening and sever the opener',()=>{
  const app=setup(),event=app.click();
  assert.equal(event.prevented,true);assert.equal(app.reader.opener,null);
  assert.equal(app.opened[0].target,'_blank');assert.equal(app.opened[0].writesBeforeOpen,1);
  const [key,context]=app.writes[0];assert.equal(key,'research-reader-context');
  assert.equal(context.project,'project');assert.equal(context.version,'abc');
  assert.deepEqual(context.items.map(x=>x.file),app.files);
  assert(context.items.every(x=>!('link' in x)));
  assert.equal(new URL(app.opened[0].url).searchParams.get('file'),app.files[0]);
});
test('native modified clicks remain untouched and restrictions never lose the original link',()=>{
  for(const extra of [{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{button:1},{defaultPrevented:true}]){
    const app=setup();assert.equal(app.click(extra).prevented,undefined);assert.equal(app.opened.length,0);assert.equal(app.writes.length,0);
  }
  const storage=setup({blockedStorage:true});assert.equal(storage.click().prevented,true);assert.equal(storage.opened.length,1);
  const popup=setup({blockedPopup:true});assert.equal(popup.click().prevented,undefined);
});
