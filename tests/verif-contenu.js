const fs=require('fs');const d=require('path').join(__dirname,'..','js')+'/';
globalThis.window=globalThis;globalThis.document={head:{appendChild(){}},createElement(){return {set textContent(v){},id:''}},getElementById(){return null}};
(0,eval)(['gfx.js','data.js','gen.js','lentilles.js','methode.js'].map(f=>fs.readFileSync(d+f,'utf8')).join('\n;')+';globalThis.X={CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,GEN,QH,mulberry,PB,ETAPES};');
const {CH,EX,FL,RC,BLANC,THEMES,KEEP,AIGUILLAGE,GEN,QH,mulberry,PB,ETAPES}=X;
const s=x=>Math.sin(x*Math.PI/180),as=x=>Math.asin(x)*180/Math.PI;
const want={U2:4.5*1000,U3:250/1000,U4:384000*1e3,U6:150*1e6*1e3,U7:3*60,U8:2*3600,U9:8*60+20,U10:760-12*60,U11:589*1e-9,U12:6.5e-7/1e-9,U15:3600+30*60,B1:1.28,B2:750,B3:3000,B4:3.6e7,B5:4.2*9.47e15,B6:2e8,B7:3/1.24,M1:4e6,M4:3000,M5:1.5e11,M6:500,C1:35,C2:65,D1:as(s(40)/1.33),D2:as(s(60)/1.5),D3:as(1.33*s(30)),D4:s(45)/s(32),D5:s(50)/s(30),D8:as(s(60)/1.33),D10:as(s(45)/2.42),E10:589,L5:0.125,L7:2.5,L8:4.5};
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
const c=3e8,pbWant={PB1:[36000*1e3,36000*1e3/c],PB2:[780e6*1e3,780e6*1e3/c],PB3:[5*60,c*5*60],PB4:[c*1e-5],PB5:[6000*1e3,6000*1e3/2e8],PB6:[900*1e3,0.0030,900*1e3/0.0030],PB7:[225000*1e3,c/(225000*1e3)],PB8:[c/2.42]};
if(new Set(EX.map(e=>e.id)).size!==EX.length)B('identifiants en double');
for(const p of PB){const w=pbWant[p.id]||[];let i=0,last=0;if(p.modele.length!==5)B('modele '+p.id);
 for(const q of p.qs){if(!q.hint||!q.show||!(q.e>=last&&q.e<=ETAPES.length))B('struct '+p.id);last=q.e;
  if(q.pick){if(!(q.a>=0&&q.a<q.pick.length))B('pick '+p.id)}
  else{const v=q.sci!==undefined?q.sci:q.num,r=w[i++];if(r===undefined||Math.abs(v/r-1)>0.011)B('ECART '+p.id+' '+v+' / '+r)}}
 if(i!==w.length)B('nb calculs '+p.id);if(new Set(p.qs.map(q=>q.e)).size!==ETAPES.length)B('etapes '+p.id)}
console.log('problemes guides',PB.length);
console.log('chapitres',CH.length,'exos',EX.length,'cartes',FL.length,'recettes',RC.length);console.log(bad?'PROBLEMES '+bad:'CONTENU OK');
