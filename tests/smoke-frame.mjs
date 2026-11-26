// Headless smoke test for the classic scripts: loads them in script-order.json order with
// stubbed browser APIs, runs frames and impacts with a seeded Math.random, and prints the
// `cam` and `bg` state. Run it before and after a refactor and diff the output.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);
const order = JSON.parse(fs.readFileSync('tools/script-order.json','utf8'));
const mk = () => new Proxy(function(){}, { get:(t,k)=> k===Symbol.toPrimitive? ()=>0 : (k==='width'||k==='height')?100 : k==='length'?0 : mk(), apply:()=>mk(), construct:()=>mk(), set:()=>true });
let _s=12345; const SM=Object.create(Math); SM.random=()=>{_s=(_s*1664525+1013904223)>>>0; return _s/4294967296;};
const ctx = { console, Math: SM, performance, Array, Object, JSON, Date, Number, String, Float32Array, Uint8Array, Uint8ClampedArray, Float64Array, Promise, Symbol, Map, Set, Error,
  getComputedStyle:()=>({paddingTop:'0px'}), cancelAnimationFrame(){}, matchMedia:()=>({matches:false,addEventListener(){}}), visualViewport:null, screen:{}, location:{hash:'',search:''}, innerWidth:800, innerHeight:600, devicePixelRatio:1, navigator:{}, localStorage:{getItem:()=>null,setItem(){}},
  requestAnimationFrame(){}, addEventListener(){}, setTimeout, clearTimeout, AudioContext: mk(), Image: mk(), OffscreenCanvas: mk(),
  document: { getElementById:()=>mk(), createElement:()=>mk(), querySelector:()=>mk(), querySelectorAll:()=>[], addEventListener(){}, body:mk(), fonts:{ready:Promise.resolve(), load:()=>Promise.resolve()} } };
ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
const { LABEL } = await imp('src/core/labels.js');
const { mul } = await imp('src/generators/rng.js');
const { GL } = await imp('src/generators/glyphs.js');
const { TN } = await imp('src/themes/colourways.js');
Object.assign(ctx, { LABEL, mul, GL, TN, selectNotes(){return []}, analyzeTrack(){} });
const src = order.map(f => fs.readFileSync(f,'utf8')).join('\n;\n');
const tail = `
;(function(){
  FB = mk2(); NCP = 1;
  function mk2(){ return new Proxy(function(){}, { get:(t,k)=> k===Symbol.toPrimitive? ()=>0 : (k==='width'||k==='height')?100 : k==='length'?0 : mk2(), apply:()=>mk2(), construct:()=>mk2(), set:()=>true }); }
  run.state='play'; run.t0=0; run.ac={currentTime:1};
  const r = [];
  try { for (let i=0;i<5;i++) frame(); impact(3, 1, 1, 100, 100); impact(1, 0.8, 1, 100, 100);
    for (let i=0;i<60;i++) frame();
    r.push(JSON.stringify({cam,bg})); } catch(e){ r.push('ERR '+e.stack.split('\\n').slice(0,4).join(' | ')); }
  globalThis.__result = r.join('\\n');
})();`;
try { vm.runInContext(src + tail, ctx, {filename:'bundle.js'}); console.log(ctx.__result); } catch(e){ console.log('LOAD ERR', e.stack.split('\n').slice(0,5).join('\n')); }
