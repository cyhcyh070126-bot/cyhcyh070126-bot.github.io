const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../research-viewer/index.html'),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function setup({from='cv',referrer='https://example.com/cv/#research-projects',length=2}={}){
 const events={},actions=[],timers=[],back={addEventListener:(name,fn)=>events['back-'+name]=fn};
 vm.runInNewContext(source,{URL,URLSearchParams,
  location:{origin:'https://example.com',search:from?'?from='+from:'',replace:url=>actions.push(['replace',url])},
  document:{referrer,body:{dataset:{returnUrl:'/cv/#figure'}},getElementById:()=>back,addEventListener:(name,fn)=>events[name]=fn},
  history:{length,back:()=>actions.push(['back'])},window:{close:()=>actions.push(['close'])},setTimeout:fn=>timers.push(fn)});
 const fire=(name,extra={})=>{const event={key:'Escape',button:0,preventDefault(){this.prevented=true;},...extra};events[name](event);return event;};
 return {actions,timers,fire};
}
test('Back and Escape return in-place readers through browser history without closing the tab',()=>{
 for(const name of ['back-click','keydown']){
  const app=setup();assert.equal(app.fire(name).prevented,true);
  assert.deepEqual(app.actions,[['back']]);assert.equal(app.timers.length,0);
 }
});
test('direct/shared links and missing referrers return to the project, never unrelated history',()=>{
 for(const options of [{from:''},{referrer:''},{referrer:'https://other.test/cv/'},{referrer:'https://example.com/projects/'},{length:1}]){
  const app=setup(options);app.fire('back-click');assert.deepEqual(app.actions,[['replace','/cv/#figure']]);
 }
 const app=setup({referrer:''});app.fire('keydown');assert.deepEqual(app.actions,[['replace','/cv/#figure']]);
});
test('modified native return clicks and legacy popup Escape keep their existing behavior',()=>{
 for(const extra of [{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{button:1}]){
  const app=setup();assert.equal(app.fire('back-click',extra).prevented,undefined);assert.deepEqual(app.actions,[]);
 }
 const legacy=setup({from:''});legacy.fire('keydown');assert.deepEqual(legacy.actions,[['close']]);
 legacy.timers[0]();assert.deepEqual(legacy.actions.at(-1),['replace','/cv/#figure']);
});
