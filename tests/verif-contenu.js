const fs=require('fs');const d=require('path').join(__dirname,'..','js')+'/';
globalThis.window=globalThis;globalThis.document={head:{appendChild(){}},createElement(){return {set textContent(v){},id:''}},getElementById(){return null}};
(0,eval)(['gfx.js','data.js','gen.js','lentilles.js'].map(f=>fs.readFileSync(d+f,'utf8')).join('\n;')+';globalThis.X={CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,GEN,QH,mulberry};');
const {CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,GEN,QH,mulberry}=X;
const s=x=>Math.sin(x*Math.PI/180),as=x=>Math.asin(x)*180/Math.PI;
const want={B1:1.28,B2:750,B3:3000,B4:3.6e7,B5:4.2*9.47e15,B6:2e8,B7:3/1.24,M1:4e6,M4:3000,M5:1.5e11,M6:500,C1:35,C2:65,D1:as(s(40)/1.33),D2:as(s(60)/1.5),D3:as(1.33*s(30)),D4:s(45)/s(32),D5:s(50)/s(30),D8:as(s(60)/1.33),D10:as(s(45)/2.42),E10:589,L5:0.125,L7:2.5,L8:4.5};
let bad=0;const B=m=>{console.log('***',m);bad++};
for(const e of EX){ if(!THEMES[e.t]||!e.hint)B('struct '+e.id);
 if(e.type==='qcm'&&!(e.a>=0&&e.a<e.opts.length))B('qcm '+e.id);
 if(e.type==='num'||e.type==='sci'){const w=want[e.id];if(w===undefined){B('no ref '+e.id);continue}
  if(!(e.type==='num'?Math.abs(w-e.a)<=e.tol:Math.abs(w/e.a-1)<=(e.tol||0.011)))B('ECART '+e.id)}
 if(e.fig&&!e.fig().startsWith('<svg'))B('fig '+e.id);}
if(!BLANC.every(b=>EX.some(e=>e.id===b)))B('BLANC');
for(const c of CH){if(/undefined|NaN/.test(c.html()))B('CH '+c.id);if(!KEEP[c.id])B('KEEP '+c.id);if(!QH[c.id])B('QH '+c.id)}
for(const a of AIGUILLAGE)if(!RC[a[1]])B('aiguillage');
for(let g=0;g<GEN.length;g++)for(let k=1;k<60;k++){const e=GEN[g](mulberry(k*7919+g));if(/undefined|NaN/.test(JSON.stringify(e)))B('gen '+g)}
console.log('chapitres',CH.length,'exos',EX.length,'cartes',FL.length,'recettes',RC.length);console.log(bad?'PROBLEMES '+bad:'CONTENU OK');
