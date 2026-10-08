/* 交个朋友 — quiet drink portraits.
   Each detail draws one small cut-paper cup on a scrap of paper. One motion belongs to the drink;
   everything else stays still. Cup shapes follow the cups confirmed in the project's generation records. */
(() => {
 'use strict';
 const TAU=Math.PI*2,{sin,cos,abs,min,max,PI,sqrt,hypot,pow,floor,round,random}=Math;
 const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,span=(t,a,b)=>clamp((t-a)/(b-a));
 const easeOut=t=>1-pow(1-clamp(t),3),easeInOut=t=>(t=clamp(t))<.5?4*t*t*t:1-pow(-2*t+2,3)/2;
 function seeded(a){return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 const hash=s=>[...s].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619),2166136261)>>>0;

 /* ---------- colour ---------- */
 const memo=new Map();
 function rgb(c){if(Array.isArray(c))return c;let v=memo.get(c);if(v)return v;let h=c.slice(1);if(h.length===3)h=[...h].map(x=>x+x).join('');const n=parseInt(h,16);v=[n>>16&255,n>>8&255,n&255];memo.set(c,v);return v}
 const rgba=(c,a=1)=>{const[r,g,b]=rgb(c);return`rgba(${r|0},${g|0},${b|0},${clamp(a).toFixed(3)})`};
 const mix=(a,b,t)=>{a=rgb(a);b=rgb(b);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]};
 const hex=c=>'#'+rgb(c).map(v=>round(clamp(v,0,255)).toString(16).padStart(2,'0')).join('');
 const INK='#2f2a24',PAPER='#f7f4ee';

 /* ---------- a dry-brush grain, used only inside painted shapes ---------- */
 let grainCanvas=null;const patterns=new WeakMap();
 function grain(c){
  if(!grainCanvas){
   const n=200,cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d'),r=seeded(42);
   for(let i=0;i<2600;i++){
    const x=r()*n,y=r()*n,l=1.5+r()*7,a=-PI/2+(r()-.5)*.9,lightStroke=r()<.55;
    g.strokeStyle=lightStroke?`rgba(255,255,255,${.06+r()*.16})`:`rgba(60,45,30,${.035+r()*.08})`;g.lineWidth=.5+r()*1.4;
    g.beginPath();g.moveTo(x,y);g.lineTo(x+cos(a)*l,y+sin(a)*l);g.stroke();
   }
   grainCanvas=cv;
  }
  let p=patterns.get(c);if(!p){p=c.createPattern(grainCanvas,'repeat');patterns.set(c,p)}return p;
 }
 function texture(c,path,a=.6){c.save();c.clip(path);c.globalAlpha*=a;c.setTransform(1,0,0,1,0,0);c.fillStyle=grain(c);c.fillRect(0,0,c.canvas.width,c.canvas.height);c.restore()}

 /* ---------- cups (units ≈ millimetres; origin at the base, up is negative) ---------- */
 let PERS=.12;
 const CUPS={
  slender:{prof:[[0,25],[-160,26]],base:12,wall:2.2,fill:.88},
  tall:{prof:[[0,27],[-150,33]],base:11,wall:2.2,fill:.88},
  highball:{prof:[[0,29],[-150,30.5]],base:12,wall:2.2,fill:.9},
  step:{prof:[[0,28],[-3,31],[-12,33.5],[-38,35],[-41,35.6],[-42.5,39.6],[-45,40.5],[-92,41]],base:9,wall:2.4,fill:.88},
  tumbler:{prof:[[0,34],[-86,40]],base:10,wall:2.4,fill:.86},
  mug:{prof:[[0,33],[-5,36.5],[-45,40],[-108,38]],base:9,wall:2.4,fill:.86,handle:'amber'},
  cone:{prof:[[0,22],[-76,44]],base:6,wall:3,fill:.9,opaque:true,handle:'wood',pedestal:true,pers:.2},
  rocks:{prof:[[0,38],[-80,41]],base:15,wall:2.6,fill:.62},
  martini:{prof:[[-64,1.2],[-124,54]],base:0,wall:1.4,fill:.84,stem:64,foot:30}
 };
 function makeCup(type,seed,fillOverride){
  const o=CUPS[type]||CUPS.tall,pr=o.prof,g={...o,type};PERS=o.pers||.12;
  g.yb=pr[0][0];g.yt=pr.at(-1)[0];g.h=g.yb-g.yt;
  g.hw=y=>{if(y>=pr[0][0])return pr[0][1];if(y<=g.yt)return pr.at(-1)[1];for(let i=1;i<pr.length;i++){const[y1,w1]=pr[i-1],[y2,w2]=pr[i];if(y<=y1&&y>=y2)return lerp(w1,w2,(y-y1)/(y2-y1))}return pr.at(-1)[1]};
  g.ihw=y=>max(0,g.hw(y)-o.wall);
  g.iyb=g.yb-o.base;g.R=g.hw(g.yt);g.iR=g.R-o.wall;
  g.level=g.iyb-(g.iyb-g.yt)*(fillOverride||o.fill);
  g.maxW=max(...pr.map(p=>p[1]));
  const r=seeded(seed),ph=[r()*TAU,r()*TAU,r()*TAU];
  const wob=(u,a)=>a*(sin(u*7+ph[0])*.5+sin(u*13+ph[1])*.3+sin(u*29+ph[2])*.2);
  g.outerPts=silhouette(g.hw,g.yt,g.yb,u=>wob(u,.55));
  g.innerPts=silhouette(g.ihw,g.yt,g.iyb,u=>wob(u+.4,.3));
  g.outer=toPath(g.outerPts);g.inner=toPath(g.innerPts);
  return g;
 }
 const SIL=36;
 function silhouette(fn,yt,yb,n){
  const pts=[],wt=fn(yt),wb=fn(yb);
  for(let i=0;i<=SIL;i++){const y=lerp(yt,yb,i/SIL);pts.push([-fn(y)+n(i/SIL),y])}
  for(let i=1;i<SIL;i++){const a=PI-PI*i/SIL;pts.push([wb*cos(a),yb+wb*PERS*sin(a)])}
  for(let i=0;i<=SIL;i++){const y=lerp(yb,yt,i/SIL);pts.push([fn(y)+n(2+i/SIL),y])}
  for(let i=1;i<SIL;i++){const a=-PI*i/SIL;pts.push([wt*cos(a),yt+wt*PERS*sin(a)])}
  return pts;
 }
 function toPath(pts){const p=new Path2D();p.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)p.lineTo(pts[i][0],pts[i][1]);p.closePath();return p}
 function strokePts(c,pts,from,to){c.beginPath();c.moveTo(pts[from][0],pts[from][1]);for(let i=from+1;i<=to;i++)c.lineTo(pts[i][0],pts[i][1]);c.stroke()}

 /* ---------- small painted things ---------- */
 const FRUIT={lemon:['#e5bd25','#fbf2c9','#f3d75a'],orange:['#e8781c','#ffe2b8','#f6a03b'],lime:['#5d8f2a','#eef4c8','#a9cf5c']};
 function wheel(c,kind,r,half){
  const[rind,pith,flesh]=FRUIT[kind]||FRUIT.lemon;
  const disc=rr=>{c.beginPath();if(half){c.moveTo(-rr,0);c.arc(0,0,rr,PI,TAU);c.closePath()}else c.arc(0,0,rr,0,TAU)};
  c.fillStyle=rind;disc(r);c.fill();c.fillStyle=pith;disc(r*.86);c.fill();
  const a0=half?PI:0,n=half?5:9,st=(half?PI:TAU)/n;c.fillStyle=flesh;
  for(let i=0;i<n;i++){const a=a0+i*st;c.beginPath();c.moveTo(cos(a+st/2)*r*.12,sin(a+st/2)*r*.12);c.arc(0,0,r*.76,a+.09,a+st-.09);c.closePath();c.fill()}
 }
 // A thin wedge of apple seen from the side: red skin along the outer curve, pale flesh inside.
 function appleSlice(c,r){
  c.fillStyle='#b8392f';c.beginPath();c.moveTo(-r,0);c.quadraticCurveTo(0,-r*1.05,r,0);c.quadraticCurveTo(0,-r*.42,-r,0);c.fill();
  c.fillStyle='#f5e7c8';c.beginPath();c.moveTo(-r*.86,-.02*r);c.quadraticCurveTo(0,-r*.86,r*.86,-.02*r);c.quadraticCurveTo(0,-r*.36,-r*.86,-.02*r);c.fill();
 }
 function cherry(c,r,stem=true){
  if(stem){c.strokeStyle='#6d5a2c';c.lineWidth=r*.16;c.lineCap='round';c.beginPath();c.moveTo(0,-r*.8);c.quadraticCurveTo(r*.5,-r*2,r*1.3,-r*2.5);c.stroke()}
  c.fillStyle='#8e1c2a';c.beginPath();c.arc(0,0,r,0,TAU);c.fill();
  c.fillStyle='rgba(255,220,220,.55)';c.beginPath();c.ellipse(-r*.35,-r*.35,r*.22,r*.14,-.6,0,TAU);c.fill();
 }
 function leaf(c,s,col){
  c.fillStyle=col;c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*.62,-s*.5,s*.5,s*.5,0,s);c.bezierCurveTo(-s*.5,s*.5,-s*.62,-s*.5,0,-s);c.fill();
  c.strokeStyle='rgba(240,255,220,.5)';c.lineWidth=s*.08;c.beginPath();c.moveTo(0,-s*.8);c.lineTo(0,s*.85);c.stroke();
 }
 function floret(c,s,col='#e8a332'){c.fillStyle=col;for(let i=0;i<4;i++){c.save();c.rotate(i*PI/2+.4);c.beginPath();c.ellipse(0,-s*.5,s*.4,s*.52,0,0,TAU);c.fill();c.restore()}c.fillStyle='#c76d18';c.beginPath();c.arc(0,0,s*.2,0,TAU);c.fill()}
 function iceShape(c,x,y,size,rot,a,seed,edge){
  const r=seeded(seed),h=size/2,j=()=>(r()-.5)*size*.12;
  c.save();c.translate(x,y);c.rotate(rot);
  const p=new Path2D();p.moveTo(-h+j(),-h+j());p.quadraticCurveTo(0,-h-size*.04,h+j(),-h+j());p.quadraticCurveTo(h+size*.04,0,h+j(),h+j());p.quadraticCurveTo(0,h+size*.03,-h+j(),h+j());p.quadraticCurveTo(-h-size*.04,0,-h+j(),-h+j());p.closePath();
  c.fillStyle=`rgba(255,255,255,${a*.75})`;c.fill(p);
  c.strokeStyle=`rgba(255,255,255,${min(1,a*1.25)})`;c.lineWidth=size*.03;c.stroke(p);
  const gl=c.createRadialGradient(-h*.35,-h*.4,0,-h*.35,-h*.4,h*.7);gl.addColorStop(0,`rgba(255,255,255,${min(1,a*1.3)})`);gl.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gl;c.fill(p);
  if(edge){c.strokeStyle=`rgba(40,30,20,${a*.16})`;c.lineWidth=size*.03;c.beginPath();c.moveTo(h*.72,-h*.2);c.quadraticCurveTo(h*.75,h*.6,-h*.1,h*.74);c.stroke()}
  c.restore();
 }
 // A torn scrap of paper.
 function scrap(c,x,y,w,h,rot,col,seed){
  const r=seeded(seed),j=()=>(r()-.5)*1.3,p=new Path2D(),n=max(4,round(w/3)),m=max(3,round(h/3));
  c.save();c.translate(x,y);c.rotate(rot);
  p.moveTo(-w/2,-h/2+j());for(let i=1;i<=n;i++)p.lineTo(-w/2+w*i/n,-h/2+j());
  for(let i=1;i<=m;i++)p.lineTo(w/2+j(),-h/2+h*i/m);
  for(let i=1;i<=n;i++)p.lineTo(w/2-w*i/n,h/2+j());
  for(let i=1;i<m;i++)p.lineTo(-w/2+j(),h/2-h*i/m);p.closePath();
  c.fillStyle=col;c.fill(p);texture(c,p,.45);
  c.restore();
 }

 /* ---------- runtime ---------- */
 const canvas=document.createElement('canvas');canvas.className='drink-canvas';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d');
 const back=document.createElement('canvas'),front=document.createElement('canvas');
 let W=0,H=0,DPR=1,S=null,stage=null,raf=0,last=0,paused=false,ro=null;
 const CAPS=['foam','cheese','cap','froth'];

 function palette(d){
  const R=(window.DRINK_RECIPES||{})[d.id]||{},main=R.L?R.L[R.tint??0][0]:d.layers[0].color;
  const bg=R.bg||hex(mix(PAPER,main,.075));
  return[bg,bg,R.ink||INK,R.accent||hex(mix(main,INK,.3))];
 }
 function create(d,dir){
  const R=(window.DRINK_RECIPES||{})[d.id]||{L:d.layers.map(l=>[l.color,l.weight,'op'])},seed=hash(d.id),g=makeCup(R.cup||'tall',seed,R.fill);
  const total=R.L.reduce((a,l)=>a+l[1],0);let acc=0;
  const layers=R.L.map(([c,w,k,soft])=>{const s=acc/total;acc+=w;return{c,s,e:acc/total,k:k||'op',soft:soft||0}});
  return{d,R,g,seed,layers,t:0,dir,slope:0,slopeV:0,spring:0,springV:0,pal:palette(d),florets:[],nextFloret:.8,surfaceY:0};
 }

 /* liquid geometry */
 const HL=()=>S.g.iyb-S.g.level;
 const yAt=f=>S.g.iyb-HL()*f;
 function arc(y,w,front,k=1,wave=null,n=24){
  const out=[];for(let i=0;i<=n;i++){const a=front?PI-PI*i/n:PI+PI*i/n,x=w*cos(a);out.push([x,y+w*PERS*sin(a)+S.slope*x*k+(wave?wave(x):0)])}return out;
 }
 function bandPath(top,bottom){const p=new Path2D();p.moveTo(top[0][0],top[0][1]);for(const q of top)p.lineTo(q[0],q[1]);if(bottom)for(let i=bottom.length-1;i>=0;i--)p.lineTo(bottom[i][0],bottom[i][1]);else{p.lineTo(top.at(-1)[0],60);p.lineTo(top[0][0],60)}p.closePath();return p}

 /* ---------- layout ---------- */
 // All cups share one scale, so a rocks glass stays shorter than a highball. In a single column the stage
 // takes the height of its cup; beside the text it fills the space the layout gives it.
 const sideBySide=()=>matchMedia('(min-aspect-ratio:5/4) and (min-width:640px)').matches;
 function measure(){
  if(!stage||!S)return;
  const g=S.g,R=S.R,need=g.maxW*2+(g.handle?20:0)+10,lift=g.pedestal?9:0,head=R.headroom??26;
  let r=stage.getBoundingClientRect();W=max(1,r.width);
  if(sideBySide()){
   stage.style.height='';r=stage.getBoundingClientRect();H=max(1,r.height);
   S.s=min(H*.64/150,W*.52/need,1.8);S.cx=W*.5-(g.handle?6*S.s:0);S.by=min(H*.86,H*.5+(-g.yt+lift)*S.s*.5+8*S.s)-lift*S.s;
  }else{
   S.s=min(window.innerHeight*.29/150,W*.5/need,1.8);
   H=round((-g.yt+lift+head+20)*S.s);stage.style.height=H+'px';
   S.cx=W*(.5+(R.shift??0))-(g.handle?6*S.s:0);S.by=H-20*S.s-lift*S.s;
  }
  DPR=min(window.devicePixelRatio||1,2);
  for(const cv of[canvas,back,front]){cv.width=round(W*DPR);cv.height=round(H*DPR)}
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  bake();
 }
 const local=(c,dy=0,dx=0)=>c.setTransform(DPR*S.s,0,0,DPR*S.s,DPR*(S.cx+dx),DPR*(S.by+dy));

 /* ---------- the still parts, painted once per size ---------- */
 function bake(){
  const g=S.g,R=S.R,r=seeded(S.seed+11),cupW=g.maxW*2;
  let c=back.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,back.width,back.height);local(c);
  // scraps of paper, a short shadow, the far side of the glass
  const side=R.paperSide??1,bh=max(26,min(-g.yt*.34,48)),cw=min(cupW,84),p1=R.paper||hex(mix(S.pal[0],'#c8b694',.45)),p2=R.strip||hex(mix(S.pal[0],'#4f4a44',.24));
  const lift=g.pedestal?9:0;
  scrap(c,side*cw*.42,lift+5-bh*.42,cw*1.7,bh,(r()-.5)*.05,p1,S.seed+1);
  if(R.strip!==false)scrap(c,-side*cw*.6,lift+7-bh*.22,cw*.46,bh*.52,(r()-.5)*.12,p2,S.seed+2);
  c.fillStyle=rgba(INK,.09);const wb=g.stem?g.foot:g.pedestal?31:g.hw(g.yb),sy=(g.pedestal?9:0)+wb*PERS*.6;
  c.beginPath();c.moveTo(-wb*.1,sy+1);c.quadraticCurveTo(wb*1.1,sy+wb*PERS*1.3,wb*1.9,sy-1);c.quadraticCurveTo(wb*1.2,sy-wb*PERS*1.2,wb*.3,sy-wb*PERS);c.closePath();c.fill();
  if(g.pedestal)pedestal(c);
  if(g.stem)stemFoot(c,g);
  if(g.opaque)cone(c,g,'back');
  if(!g.opaque){c.fillStyle='rgba(255,255,255,.42)';c.fill(g.outer);c.strokeStyle=rgba(INK,.16);c.lineWidth=1/S.s;c.beginPath();c.ellipse(0,g.yt,g.iR,g.iR*PERS,0,PI,TAU);c.stroke()}
  rimGarnish(c,'back');
  // the near wall, rim, highlights, handle and anything clipped on the rim
  c=front.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,front.width,front.height);local(c);if(g.pedestal)c.translate(0,-9);
  if(g.opaque)cone(c,g,'front');else glassFront(c,g);
  if(g.handle==='amber')amberHandle(c,g);
  rimGarnish(c,'front');
 }
 function glassFront(c,g){
  const u=1/S.s,pts=g.outerPts;
  if(g.base>0){
   c.save();c.clip(g.outer);c.fillStyle='rgba(255,255,255,.36)';c.fillRect(-g.maxW-4,g.iyb,g.maxW*2+8,g.yb-g.iyb+g.hw(g.yb)*PERS+3);c.restore();
   c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.2*u;c.beginPath();c.ellipse(0,g.iyb,g.ihw(g.iyb),g.ihw(g.iyb)*PERS,0,.15,PI-.15);c.stroke();
  }
  // a brushed highlight on the left wall and a faint shade on the right
  const top=g.stem?g.yt+4:g.yt+9,bot=g.stem?lerp(g.yt,g.yb,.7):g.yb-6,hx=y=>-g.hw(y)+(g.stem?6:3.4);
  c.lineCap='round';c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;c.beginPath();
  for(let y=top;y<lerp(top,bot,.55);y+=3)y===top?c.moveTo(hx(y),y):c.lineTo(hx(y),y);c.stroke();
  c.lineWidth=1.3;c.beginPath();for(let y=lerp(top,bot,.66);y<bot;y+=3)c.lineTo(hx(y),y);c.stroke();
  if(!g.stem){c.strokeStyle=rgba(INK,.07);c.lineWidth=1.6;c.beginPath();for(let y=g.yt+6;y<g.yb-4;y+=3)c.lineTo(g.hw(y)-3,y);c.stroke()}
  // a pencil outline: one confident line, one faint echo
  const end=pts.length-SIL+1;c.lineJoin='round';
  c.strokeStyle=rgba(INK,.32);c.lineWidth=1.05*u;const rb=seeded(S.seed+31);for(let i=0;i<end;){const n=8+floor(rb()*16);strokePts(c,pts,i,min(end,i+n));i+=n+(rb()<.35?1:0)}
  c.save();c.translate(.55,.35);c.strokeStyle=rgba(INK,.09);c.lineWidth=.9*u;strokePts(c,pts,0,end);c.restore();
  c.lineWidth=1.05*u;c.strokeStyle=rgba(INK,.3);c.beginPath();c.ellipse(0,g.yt,g.R,g.R*PERS,0,0,PI);c.stroke();
  c.strokeStyle=rgba(INK,.22);c.beginPath();c.ellipse(0,g.yt,g.R,g.R*PERS,0,PI,TAU);c.stroke();
  c.strokeStyle='rgba(255,255,255,.65)';c.beginPath();c.ellipse(0,g.yt+.8,g.iR,g.iR*PERS,0,.2,PI-.2);c.stroke();
 }
 function stemFoot(c,g){
  const u=1/S.s,f=g.foot;
  c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(0,0,f,f*PERS,0,0,TAU);c.fill();c.strokeStyle=rgba(INK,.38);c.lineWidth=1.05*u;c.stroke();
  c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.moveTo(-1.5,g.yb);c.lineTo(1.5,g.yb);c.lineTo(2.6,-f*PERS*.4);c.lineTo(-2.6,-f*PERS*.4);c.closePath();c.fill();
  c.strokeStyle=rgba(INK,.32);c.beginPath();c.moveTo(-1.5,g.yb+1);c.lineTo(-2.6,-f*PERS*.5);c.moveTo(1.5,g.yb+1);c.lineTo(2.6,-f*PERS*.5);c.stroke();
 }
 function amberHandle(c,g){
  const a=g.yt+g.h*.17,b=g.yb-g.h*.2,x0=g.hw(a)-1.5,x1=g.hw(b)-1.5,o=g.R+g.h*.19;
  const path=()=>{c.beginPath();c.moveTo(x0,a);c.bezierCurveTo(o+6,a-4,o+8,b+4,x1,b)};
  c.lineCap='round';path();c.strokeStyle='rgba(194,120,38,.8)';c.lineWidth=8;c.stroke();
  path();c.strokeStyle='rgba(248,200,112,.75)';c.lineWidth=2.3;c.stroke();
 }
 // The ceramic cone is opaque: its body sits behind the foam, only the lip is drawn on top.
 function cone(c,g,pass){
  const u=1/S.s,col='#ebe3d1';
  if(pass==='back'){
   const y1=-58,y2=-24,x1=g.hw(y1)-2.5,x2=g.hw(y2)-2.5,p=new Path2D();
   p.moveTo(x1,y1);p.lineTo(x1+19,y1);p.quadraticCurveTo(x1+22,y1,x1+22,y1+3);p.lineTo(x1+22,y2-3);p.quadraticCurveTo(x1+22,y2,x1+19,y2);p.lineTo(x2,y2);p.closePath();
   const hx=x1+12,hy=(y1+y2)/2;p.moveTo(hx+4.2,hy);p.arc(hx,hy,4.2,0,TAU);
   c.fillStyle='#57382a';c.fill(p,'evenodd');texture(c,p,.5);
   c.fillStyle=col;c.fill(g.outer);texture(c,g.outer,.55);
   c.save();c.clip(g.outer);const sh=c.createLinearGradient(-g.maxW,0,g.maxW,0);sh.addColorStop(0,'rgba(255,255,255,.4)');sh.addColorStop(.35,'rgba(255,255,255,0)');sh.addColorStop(.75,rgba(INK,.03));sh.addColorStop(1,rgba(INK,.15));c.fillStyle=sh;c.fill(g.outer);c.restore();
   c.strokeStyle=rgba(INK,.28);c.lineWidth=1.05*u;c.stroke(g.outer);
   return;
  }
  c.lineWidth=2.2;c.strokeStyle='#f4eee2';c.beginPath();c.ellipse(0,g.yt,g.R-1,(g.R-1)*PERS,0,0,TAU);c.stroke();
  c.lineWidth=.9*u;c.strokeStyle=rgba(INK,.28);c.beginPath();c.ellipse(0,g.yt,g.R,g.R*PERS,0,0,PI);c.stroke();
 }
 function pedestal(c){
  const r=31,t=9;
  c.fillStyle='#7a4d2d';c.beginPath();c.moveTo(-r,-t);c.lineTo(-r,0);c.ellipse(0,0,r,r*PERS,0,PI,0,true);c.lineTo(r,-t);c.closePath();c.fill();
  c.fillStyle='#a26f45';c.beginPath();c.ellipse(0,-t,r,r*PERS,0,0,TAU);c.fill();
  c.strokeStyle='rgba(70,35,12,.22)';c.lineWidth=.6;for(let i=1;i<4;i++){c.beginPath();c.ellipse(0,-t,r*i/4,r*PERS*i/4,0,0,TAU);c.stroke()}
  texture(c,new Path2D(`M${-r} ${-t-r*PERS}h${r*2}v${t+r*PERS*2}h${-r*2}z`),.35);
  c.translate(0,-t);
 }

 /* ---------- garnish ---------- */
 function rimGarnish(c,pass){
  const g=S.g;
  for(const gm of S.R.garn||[]){
   const t=gm.t;
   if(pass==='back'&&t==='backRim'){c.save();c.translate(-g.R*.32,g.yt-2);c.rotate(-.12);wheel(c,'orange',12,true);c.restore();c.save();c.translate(g.R*.3,g.yt-3.5);cherry(c,4.3);c.restore()}
   if(pass!=='front')continue;
   if(t==='wheelRim'){const r=gm.r||13;c.save();c.translate(g.R*.86,g.yt-r*.22);c.rotate(-.35);c.scale(.92,1);wheel(c,gm.fruit,r,gm.half);c.restore()}
   if(t==='appleRim'){c.save();c.translate(g.R*.84,g.yt+1.5);c.rotate(-.55);appleSlice(c,11);c.restore()}
   if(t==='twistRim'){c.save();c.translate(g.R*.72,g.yt-3);c.rotate(.18);c.strokeStyle='#e3b92a';c.lineWidth=2.4;c.lineCap='round';c.beginPath();for(let i=0;i<=30;i++){const q=i/30,x=sin(q*TAU*1.6)*3.6+q*5,y=q*20-5;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}
  }
 }
 // garnish inside the glass, or anything that moves: painted between the drink and the near wall
 function innerGarnish(c){
  const g=S.g,t=S.t;
  for(const gm of S.R.garn||[]){
   switch(gm.t){
    case 'halfInside':{c.save();c.translate(-g.iR*.3,yAt(1)+3.5);c.rotate(.06);wheel(c,'orange',15,true);c.restore();break}
    case 'mint':{
     c.save();c.translate(-g.iR*.28,g.yt+2);c.strokeStyle='#4a7a2c';c.lineWidth=1.3;c.lineCap='round';c.beginPath();c.moveTo(3,30);c.quadraticCurveTo(0,6,-1,-12);c.stroke();
     [[-5,-15,-.7,6.8,'#4f8f34'],[6,-17,.6,6.5,'#6aaa45'],[-1,-23,-.1,6.2,'#5e9c3b'],[-8,-7,-1.2,5.6,'#6aaa45'],[8,-8,1.1,5.4,'#4f8f34'],[2,-28,.2,4.6,'#77b04e'],[-4,-26,-.5,4.2,'#4f8f34']].forEach(([x,y,a,sz,col])=>{c.save();c.translate(x,y);c.rotate(a);leaf(c,sz,col);c.restore()});
     c.restore();break}
    case 'peelCurl':{
     // a wide expressed peel draped over the big cube
     c.save();c.translate(g.R*.08,g.level-g.iR*.62);c.rotate(-.12);
     const peel=(inset,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(-22+inset,2);c.bezierCurveTo(-14,-9+inset,10,-11+inset,24-inset,-3);c.bezierCurveTo(27-inset,3,24-inset,9-inset,19-inset,6);c.bezierCurveTo(8,-1+inset*.6,-10,1+inset*.6,-18+inset,9-inset);c.closePath();c.fill()};
     peel(0,'#d9681a');peel(1.6,'#f4a64a');peel(3.4,'#fcd9a2');
     c.restore();break}
    case 'peelOnIce':{const k=S.spring;c.save();c.translate(g.R*.04,g.level-15);c.rotate(-.16+k*.5);const band=(w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(-21,4);c.bezierCurveTo(-10,-10-k*26,8,-12-k*26,22,-4+k*9);c.stroke()};band(8.5,'#d6611a');band(4.6,'#f7ae4d');c.restore();break}
    case 'cinnamon':{
     // a rolled bark quill: resting in the far corner, leaning on the right rim, half under the whisky
     const a=[-g.iR*.45,g.iyb-4],b=[g.R*.7,g.yt-22],ang=Math.atan2(b[1]-a[1],b[0]-a[0]),len=hypot(b[0]-a[0],b[1]-a[1]);
     const quill=()=>{c.save();c.translate(a[0],a[1]);c.rotate(ang);
      c.fillStyle='#7e4223';c.fillRect(0,-4.2,len,8.4);
      c.fillStyle='#a9632f';c.fillRect(0,-4.2,len,3);c.fillStyle='rgba(255,210,160,.25)';c.fillRect(0,-3.6,len,1);
      c.strokeStyle='rgba(70,30,12,.5)';c.lineWidth=.6;c.beginPath();c.moveTo(0,.8);c.lineTo(len,.8);c.stroke();
      for(let i=7;i<len-3;i+=9){c.beginPath();c.moveTo(i,-3.4);c.lineTo(i+1.5,3.4);c.stroke()}
      c.translate(len,0);c.fillStyle='#b8733d';c.beginPath();c.ellipse(0,0,2.3,3.8,0,0,TAU);c.fill();
      c.strokeStyle='#5e2c14';c.lineWidth=.75;c.beginPath();c.arc(0,.3,2.1,-1.6,2.5);c.stroke();c.beginPath();c.arc(.2,.25,1,0,4.6);c.stroke();
      c.restore()};
     const surf=S.surfaceY;
     c.save();c.beginPath();c.rect(-200,surf,400,200);c.clip();c.clip(g.inner);c.globalAlpha*=.6;quill();c.globalAlpha=1;c.fillStyle=rgba(S.layers[0].c,.32);c.fill(g.inner);c.restore();
     c.save();c.beginPath();c.rect(-200,-400,400,400+surf-.3);c.clip();quill();c.restore();break}
    case 'cherryBeside':{c.save();c.translate(g.iR*.6,g.level+11);cherry(c,4.3,false);c.fillStyle=rgba(S.layers[0].c,.3);c.beginPath();c.arc(0,0,4.5,0,TAU);c.fill();c.restore();break}
    case 'cherryBottom':{const y=g.yb-8+(S.R.motion?.m==='bob'?sin(t*1.1)*.9:0);c.save();c.translate(0,y);cherry(c,5,true);c.fillStyle=rgba(S.layers[0].c,.3);c.beginPath();c.arc(0,0,5.2,0,TAU);c.fill();c.restore();break}
    case 'sesameCrisp':{c.save();c.translate(-g.R*.6,g.yt-2);c.rotate(-.3);const r=seeded(7),p=new Path2D();p.moveTo(-5,-13);for(let i=1;i<=6;i++)p.lineTo(-5+i*10/6+(r()-.5),-13+(r()-.5)*1.4);p.lineTo(5.4,18);for(let i=1;i<=6;i++)p.lineTo(5-i*10/6+(r()-.5),18+(r()-.5)*1.4);p.closePath();c.fillStyle='#3a3530';c.fill(p);c.fillStyle='rgba(240,232,215,.7)';for(let i=0;i<16;i++){c.beginPath();c.ellipse(-3.6+r()*7.2,-11+r()*27,.5,.95,r()*3,0,TAU);c.fill()}c.fillStyle='rgba(15,12,10,.8)';for(let i=0;i<10;i++){c.beginPath();c.ellipse(-3.6+r()*7.2,-11+r()*27,.5,.95,r()*3,0,TAU);c.fill()}c.restore();break}
    case 'appleFoam':{const y=yAt(1)-2;for(const[x,a]of[[-7,-.25],[3,.2]]){c.save();c.translate(x,y);c.rotate(a);appleSlice(c,7);c.restore()}break}
    case 'bananaFoam':{const y=yAt(1)-1.2;for(const x of[-9,5]){c.save();c.translate(x,y);c.scale(1,.45);c.fillStyle='#e6d394';c.beginPath();c.arc(0,0,6,0,TAU);c.fill();c.fillStyle='#fbf1cb';c.beginPath();c.arc(0,0,5.1,0,TAU);c.fill();c.fillStyle='#a88a4a';for(let i=0;i<6;i++){c.beginPath();c.arc(cos(i)*1.6,sin(i)*1.6,.45,0,TAU);c.fill()}c.restore()}break}
   }
  }
 }

 /* ---------- the drink, redrawn every frame ---------- */
 function drawLiquid(c){
  const g=S.g,L=S.layers,u=1/S.s,t=S.t,R=S.R,m=R.motion||{};
  if(g.opaque){coneSurface(c,g);return}
  c.save();c.clip(g.inner);
  const caps=L.filter(l=>CAPS.includes(l.k)),body=L.filter(l=>!caps.includes(l)),topBody=body.at(-1);
  const wave=m.m==='wave'?(x=>sin(x*.12+t*.9)*1.4):null;
  body.forEach((l,i)=>{
   const yT=yAt(l.e),yB=yAt(l.s),wT=g.ihw(yT),wB=g.ihw(yB),isTop=l===topBody&&!caps.length;
   const top=isTop?arc(yT,wT,false):arc(yT,wT,true,.6,i===0?wave:null);
   const bottom=i===0?null:arc(yB,wB,true,.6,i===1?wave:null);
   c.fillStyle=rgba(l.c,l.k==='cl'?(R.clear??.8):1);c.fill(bandPath(top,bottom));
  });
  // gouache: a few soft blooms of lighter and darker pigment, and colour pooling at the edges
  const rm=seeded(S.seed+77);
  body.forEach(l=>{const y0=yAt(l.e),y1=yAt(l.s);for(let i=0;i<6;i++){const y=lerp(y0,y1,rm()),w=g.ihw(y),x=(rm()*2-1)*w*.8,rr=w*(.35+rm()*.4),lt=rm()<.5,gr=c.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,rgba(mix(l.c,lt?'#ffffff':INK,lt?.25:.18),l.k==='cl'?.1:.16));gr.addColorStop(1,rgba(l.c,0));c.fillStyle=gr;c.fillRect(x-rr,y-rr,rr*2,rr*2)}});
  c.save();c.beginPath();c.rect(-200,yAt(1),400,300);c.clip();c.strokeStyle=rgba(INK,.1);c.lineWidth=2.4;c.stroke(g.inner);c.restore();
  body.forEach((l,i)=>{
   if(!i)return;const lo=body[i-1],soft=max(l.soft,lo.soft)*(m.m==='gradient'&&i===1?1+.45*sin(t*.45):1);if(soft<=0)return;
   const y=yAt(l.s),hs=HL()*soft,gr=c.createLinearGradient(0,y-hs,0,y+hs);
   gr.addColorStop(0,rgba(l.c,0));gr.addColorStop(.5,rgba(mix(l.c,lo.c,.5),.85));gr.addColorStop(1,rgba(lo.c,0));
   c.fillStyle=gr;c.fillRect(-g.maxW-4,y-hs,g.maxW*2+8,hs*2+g.R*PERS);
  });
  const bodyTop=yAt(topBody?topBody.e:0);
  c.save();c.beginPath();c.rect(-g.maxW-5,bodyTop-g.R*PERS,g.maxW*2+10,g.iyb-bodyTop+20);c.clip();
  stillDetails(c);motion(c,'inside');
  c.restore();
  ice(c);
  caps.forEach(l=>{
   const yT=yAt(l.e),yB=yAt(l.s),wT=g.ihw(yT),wB=g.ihw(yB),fr=arc(yB,wB,true,.6);
   let top=arc(yT,wT,false);
   if(l.k==='foam'){const ph=S.seed%7;top=top.map(([x,y],i)=>[x,y-abs(sin(i*1.7+ph))*1.1*(1+(m.m==='foam'?.3*sin(t*.9+i):0))])}
   if(l.k==='cheese')top=top.map(([x,y])=>[x,y-(1-(x/wT)**2)*3.4]);
   c.fillStyle=rgba(l.c);c.fill(bandPath(top,fr));
   c.strokeStyle=rgba(mix(l.c,INK,.3),.22);c.lineWidth=.8*u;c.beginPath();c.moveTo(fr[0][0],fr[0][1]);for(const q of fr)c.lineTo(q[0],q[1]);c.stroke();
  });
  const topL=caps.length?caps.at(-1):topBody,yS=yAt(1)-(topL.k==='cheese'?3.4:topL.k==='foam'?.6:0),wS=g.ihw(yAt(1));S.surfaceY=yS;
  const sc=topL.k==='cl'?mix(topL.c,'#ffffff',.32):mix(topL.c,'#ffffff',.16);
  c.fillStyle=rgba(sc,topL.k==='cl'?(R.clear??.8)+.08:1);c.beginPath();c.ellipse(0,yS,wS,wS*PERS,Math.atan(S.slope),0,TAU);c.fill();
  c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=u;c.beginPath();c.ellipse(0,yS,wS,wS*PERS,Math.atan(S.slope),.15,PI-.15);c.stroke();
  toppings(c,yS,wS);motion(c,'surface',yS,wS);
  texture(c,g.inner,.85);
  c.restore();
 }
 function coneSurface(c,g){
  const y=g.yt+3,w=g.iR,b=(S.R.motion||{}).m==='breath'?sin(S.t*.55)*.6:0,col=S.layers.at(-1).c;
  c.save();c.beginPath();c.ellipse(0,g.yt,g.iR,g.iR*PERS,0,0,TAU);c.clip();
  c.fillStyle=rgba(mix(col,INK,.14));c.fillRect(-g.R,g.yt-g.R*PERS-2,g.R*2,g.R*PERS*2+4);
  c.fillStyle=rgba(mix(col,'#ffffff',.12));c.beginPath();c.ellipse(0,y-b,w,w*PERS+1.4,0,0,TAU);c.fill();
  toppings(c,y-b,w*.9);S.surfaceY=y-b;
  c.restore();
 }
 function stillDetails(c){
  const g=S.g,R=S.R,r=seeded(S.seed+5);
  for(const st of R.still||[]){
   if(st==='streaks'){c.lineCap='round';for(let i=0;i<2;i++){const side=i?1:-1,x=side*g.iR*(.66+r()*.1),y=yAt(.05+r()*.06),h=18+r()*12,x1=x-side*(8+r()*6);for(const[w,al]of[[7,.09],[3.6,.16],[1.5,.32]]){c.strokeStyle=rgba(R.streak||'#f7f1e2',al);c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+side*2,y-h*.35,x1+side*7,y-h*.7,x1,y-h);c.stroke()}}}
   if(st==='crush'){const l=S.layers[0];for(let i=0;i<46;i++){const y=yAt(l.s+(l.e-l.s)*r()),w=g.ihw(y)*.92,x=(r()*2-1)*w;c.fillStyle=r()<.3?'#7e9d2e':r()<.5?'#d8e39a':'#c3d178';c.beginPath();c.ellipse(x,y,1.2+r()*2.2,.8+r()*1.4,r()*3,0,TAU);c.fill()}}
   if(st==='muddle'){c.save();c.translate(g.iR*.32,yAt(.12));c.rotate(.5);wheel(c,'lime',7,true);c.restore()}
   if(st==='ganache'){c.fillStyle=rgba('#3a1d12',.4);for(let i=0;i<3;i++){const x=(-.65+i*.55)*g.iR;c.beginPath();c.ellipse(x,yAt(.14+i*.05),1.3,6+i*2,.1,0,TAU);c.fill()}}
  }
 }
 function toppings(c,y,w){
  const r=seeded(S.seed+3);
  for(const tp of S.R.top||[]){
   const n=tp.n||20,ry=w*PERS;
   for(let i=0;i<n;i++){
    let a=r()*TAU,q=sqrt(r())*.8;if(tp.zone==='side'){a=PI*.95+r()*PI*.6;q=.3+r()*.5}
    const x=cos(a)*q*w,yy=y+sin(a)*q*ry+S.slope*x,col=tp.c[i%tp.c.length];c.fillStyle=col;
    switch(tp.k){
     case 'zest':c.save();c.translate(x,yy);c.rotate(r()*3);c.fillRect(-1.1,-.3,2.2,.6);c.restore();break;
     case 'powder':c.fillRect(x,yy,.6,.42);break;
     case 'sesame':c.beginPath();c.ellipse(x,yy,.55,1.05,r()*3,0,TAU);c.fill();break;
     case 'osmanthus':c.save();c.translate(x,yy);c.scale(1,.6);floret(c,1.5,col);c.restore();break;
     case 'crumb':c.beginPath();c.moveTo(x-1,yy);c.lineTo(x,yy-.9);c.lineTo(x+1.2,yy-.2);c.lineTo(x+.3,yy+.7);c.closePath();c.fill();break;
     case 'salt':c.fillStyle='rgba(255,255,255,.95)';c.fillRect(x,yy,.7,.7);break;
    }
   }
  }
  if(S.R.bitters){const k=(S.R.motion||{}).m==='bitters';for(let i=0;i<3;i++){const p=k?.5+.5*sin(S.t*.32+i*2.1):1,rr=lerp(1.9,1.25,p);c.fillStyle=rgba('#7a3418',.42+.38*p);c.beginPath();c.ellipse((i-1)*6,y+.3,rr,rr*.55,0,0,TAU);c.fill()}}
 }
 function ice(c){
  const R=S.R,g=S.g;if(!R.ice)return;
  const n=R.ice.n||0,style=R.ice.style||'cubes',a=R.ice.a??.35,r=seeded(S.seed+9),drift=(R.motion||{}).m==='drift',t=S.t;
  const capB=yAt(S.layers.find(l=>CAPS.includes(l.k))?.s??1);
  if(style==='big'||style==='under'){
   const size=style==='under'?g.iR*1.02:g.iR*1.1,y=style==='under'?capB+size*.56:g.level+size*.28;
   iceShape(c,drift?sin(t*.32)*1.4:0,y,size,(drift?sin(t*.25)*.035:0)-.05,a,S.seed,true);return;
  }
  if(style==='crushed'){for(let i=0;i<24;i++){const y=yAt(.1+r()*.86),x=(r()*1.8-.9)*g.ihw(y)*.82;iceShape(c,x,y,5+r()*5,r()*3,a,S.seed+i,false)}return}
  for(let i=0;i<n;i++){
   const size=g.iR*(n>=4?.66:.72),row=floor(i/2),col=i%2;
   const x=(col?.36:-.32)*g.iR+(row%2?3:-2),y=capB+size*.56+row*size*.84;
   const dx=drift?sin(t*.35+i*1.7)*1.3:0,dy=drift?sin(t*.5+i)*.7:0,rot=(col?.18:-.12)+(drift?sin(t*.3+i)*.04:0)+(r()-.5)*.2;
   if(y<g.iyb-size*.3)iceShape(c,x+dx,y+dy,size,rot,a,S.seed+i,R.ice.edge);
  }
 }

 /* ---------- one motion per drink ---------- */
 function motion(c,where,yS,wS){
  const m=S.R.motion||{},g=S.g,t=S.t*(m.speed||1),r=seeded(S.seed+21);
  if(where==='inside')switch(m.m){
   case 'seep':case 'tendril':{
    const k=m.from??(S.layers.length-1),y0=yAt(S.layers[k].s),col=m.c||S.layers[k].c,thin=m.m==='tendril',n=thin?4:3,per=thin?9:12;
    for(let i=0;i<n;i++){
     const p=((t/per)+i/n+r()*.2)%1,x=(r()*1.2-.6)*g.iR,len=lerp(5,(m.depth||.42)*HL(),easeInOut(p)),a=sin(PI*p)*(m.a??.55),sw=sin(t*.6+i*2)*2.5;
     for(const[wk,ak]of thin?[[1,1]]:[[1.9,.35],[1,.75]]){
      const w=(thin?.9:lerp(3,7,p))*wk,gr=c.createLinearGradient(0,y0-2,0,y0+len);gr.addColorStop(0,rgba(col,a*ak));gr.addColorStop(.7,rgba(col,a*ak*.55));gr.addColorStop(1,rgba(col,0));
      c.fillStyle=gr;c.beginPath();c.moveTo(x-w,y0-2);
      c.bezierCurveTo(x-w*1.1+sw*.3,y0+len*.45,x+sw-w*.7,y0+len*.85,x+sw,y0+len);
      c.bezierCurveTo(x+sw+w*.7,y0+len*.85,x+w*1.1+sw*.3,y0+len*.45,x+w,y0-2);c.closePath();c.fill();
     }
    }
    break;}
   case 'marble':{
    // milk or cream curling off the inside wall, leaning inward, each at its own height
    const col=m.c||'#ffffff',lo=yAt(m.lo??.06),hi=yAt(m.hi??.55);c.lineCap='round';
    for(let i=0;i<3;i++){
     const side=i===1?1:-1,k=i===2?.55:1,x0=side*g.iR*(.62+r()*.12)*(i===2?.4:1),y0=lerp(lo,hi,i===2?.15:r()*.15),y1=lerp(lo,hi,.55+r()*.4*k),a=sin(t*.32+i*2.3),b=cos(t*.26+i*1.7);
     const x1=x0-side*(9+r()*7)+a*2.5;
     for(const[w,al]of[[8,.08],[4.2,.15],[1.7,.3]]){c.strokeStyle=rgba(col,al*k);c.lineWidth=w*k;c.beginPath();c.moveTo(x0,y0);c.bezierCurveTo(x0+side*3+b*2,lerp(y0,y1,.35),x1+side*8+a*3,lerp(y0,y1,.7),x1,y1);c.stroke()}
    }
    break;}
   case 'pulp':{for(let i=0;i<14;i++){const y=yAt(.1+r()*.72)+sin(t*.4+i)*2,x=(r()*1.7-.85)*g.ihw(y)*.88+sin(t*.3+i*1.3)*1.6;c.fillStyle=rgba('#ffd690',.6);c.beginPath();c.ellipse(x,y,1.5,.6,r()*3+sin(t*.2+i)*.3,0,TAU);c.fill()}break}
   case 'float':{
    if(m.what==='apple')for(let i=0;i<3;i++){const y=yAt(.24+i*.2)+sin(t*.5+i*1.9)*1.8,x=(i%2?.45:-.48)*g.iR+sin(t*.3+i)*1.2;c.save();c.translate(x,y);c.rotate((i%2?.6:-.5)+sin(t*.4+i)*.12);c.globalAlpha*=.72;c.scale(1,.75);appleSlice(c,8);c.restore()}
    if(m.what==='mint')for(let i=0;i<5;i++){const y=yAt(.1+r()*.38)+sin(t*.45+i*1.4)*1.6,x=(r()*1.4-.7)*g.iR+sin(t*.35+i)*1.4;c.save();c.translate(x,y);c.rotate(r()*3+sin(t*.5+i)*.25);leaf(c,4+r()*2.2,i%2?'#5a9a3a':'#77b04e');c.restore()}
    break;}
   case 'glint':{const p=(t/8)%1,x=lerp(-g.maxW*1.5,g.maxW*1.5,easeInOut(p)),gr=c.createLinearGradient(x-14,0,x+14,0);gr.addColorStop(0,'rgba(255,240,210,0)');gr.addColorStop(.5,`rgba(255,240,210,${.34*sin(PI*p)})`);gr.addColorStop(1,'rgba(255,240,210,0)');c.save();c.transform(1,0,-.35,1,0,0);c.fillStyle=gr;c.fillRect(x-14,g.yt,28,g.h+10);c.restore();break}
   case 'bubbles':{
    const n=m.n||14,sp=m.rise||7;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=.45;
    for(let i=0;i<n;i++){const lane=(r()*1.6-.8)*g.iR,per=(HL()+4)/sp*(.7+r()*.6),p=((t/per)+r())%1,y=g.iyb-2-p*(HL()-3),x=lane+sin(t*1.5+i)*.8,rr=.45+r()*.7;c.globalAlpha=sin(PI*min(1,p*1.15));c.beginPath();c.arc(x,y,rr,0,TAU);c.stroke()}
    c.globalAlpha=1;break;}
   case 'drip':{
    for(let i=0;i<(m.n||2);i++){
     const p=((t/(m.per||10))+i*.5)%1,x=(i?.42:-.52)*g.iR,y0=yAt(m.from??.76),len=easeInOut(min(1,p*1.25))*HL()*(m.len||.35),a=p>.8?(1-p)/.2:1,w=m.w||1.8;
     if(len<1)continue;c.fillStyle=rgba(m.c,a*.85);c.beginPath();c.moveTo(x-w*.35,y0);c.quadraticCurveTo(x-w*.2,y0+len*.6,x-w*.5,y0+len-w*.4);c.arc(x,y0+len-w*.2,w*.52,PI*1.05,-PI*.05,true);c.quadraticCurveTo(x+w*.2,y0+len*.6,x+w*.35,y0);c.closePath();c.fill();
    }
    break;}
  }
  if(where==='surface'&&m.m==='foam'){
   for(let i=0;i<12;i++){const p=((t/(3+r()*3))+r())%1,a=r()*TAU,q=sqrt(r())*.8,x=cos(a)*q*wS,y=yS+sin(a)*q*wS*PERS-.6;c.strokeStyle=`rgba(255,255,255,${sin(PI*p)*.85})`;c.lineWidth=.35;c.beginPath();c.arc(x,y,.3+p*.9,0,TAU);c.stroke()}
  }
 }
 // things that leave the glass: an osmanthus floret drifting down, a bead of condensation
 function overlay(c){
  const g=S.g,m=S.R.motion||{},t=S.t;
  if(m.m==='fall')for(const f of S.florets){c.save();c.globalAlpha*=clamp(f.a);c.translate(f.x+sin(f.age*1.3+f.ph)*(f.land?0:3),f.y);c.rotate(f.land?f.ph:f.age*.6+f.ph);c.scale(1,f.land?.55:.8+.2*sin(f.age*2));floret(c,2.3);c.restore()}
  if(m.m==='condense'){
   const r=seeded(S.seed+4),top=g.stem?g.yt+5:g.yt+8,bot=g.stem?lerp(g.yt,g.yb,.72):g.yb-8;c.fillStyle='rgba(255,255,255,.6)';
   for(let i=0;i<16;i++){const y=lerp(top,bot,r()),w=g.hw(y)*.85,x=(r()*2-1)*w,rr=.45+r()*.85;c.beginPath();c.arc(x,y,rr,0,TAU);c.fill()}
   const p=(t/9)%1,x=-g.hw(top)*.42,y=lerp(top+2,bot,easeInOut(p));c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x-.45,top,.9,y-top);c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(x,y,1.25,0,TAU);c.fill();
  }
 }
 function stepFlorets(dt){
  const g=S.g;S.nextFloret-=dt;
  if(S.nextFloret<=0&&S.florets.length<2){S.nextFloret=5.5+random()*2.5;const side=random()<.5?-1:1;S.florets.push({x:side*g.R*(.3+random()*.45),y:g.yt-48-random()*10,vy:7+random()*2,age:0,ph:random()*6,a:0,land:false,rest:0})}
  for(let i=S.florets.length-1;i>=0;i--){
   const f=S.florets[i];f.age+=dt;
   if(!f.land){f.y+=f.vy*dt;f.a=min(1,f.a+dt*1.5);if(f.y>=S.surfaceY-1&&abs(f.x)<g.iR*.82){f.land=true;f.y=S.surfaceY-1}if(f.y>8)f.a-=dt*1.2}
   else{f.rest+=dt;if(f.rest>3)f.a-=dt*.6}
   if(f.a<=0&&f.age>1)S.florets.splice(i,1);
  }
 }

 /* ---------- frame ---------- */
 function step(dt){
  S.t+=dt;
  S.slopeV+=(-S.slope*40-S.slopeV*2.8)*dt;S.slope+=S.slopeV*dt;
  S.springV+=(-S.spring*60-S.springV*3.2)*dt;S.spring+=S.springV*dt;
  if((S.R.motion||{}).m==='spring')S.spring+=sin(S.t*1.3)*.0004;
  if((S.R.motion||{}).m==='fall')stepFlorets(dt);
 }
 function draw(){
  const c=ctx,e=easeOut(span(S.t,0,.5)),dy=(1-e)*8,dx=S.dir*(1-e)*24;
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.globalAlpha=e;
  c.drawImage(back,dx*DPR,dy*DPR);
  local(c,dy,dx);if(!S.surfaceY)S.surfaceY=yAt(1);
  if(S.g.pedestal)c.translate(0,-9);
  drawLiquid(c);innerGarnish(c);
  c.setTransform(1,0,0,1,0,0);c.drawImage(front,dx*DPR,dy*DPR);
  local(c,dy,dx);if(S.g.pedestal)c.translate(0,-9);overlay(c);
  c.globalAlpha=1;
 }
 function frame(now){
  raf=0;if(!S)return;
  if(!last||now-last>=21){const dt=last?min(.05,(now-last)/1000):1/60;last=now;try{step(dt);draw()}catch(err){console.error(err);return}}
  if(!paused&&!document.hidden)raf=requestAnimationFrame(frame);
 }
 function safeDraw(){try{draw()}catch(err){console.error(err)}}
 function start(){cancelAnimationFrame(raf);raf=0;last=0;if(!S)return;if(paused||document.hidden){safeDraw();return}raf=requestAnimationFrame(frame)}
 function settle(){while(S.t<2.6)step(1/30)}

 function show(d,opts={}){
  stage=opts.stage;S=create(d,opts.dir||0);
  stage.append(canvas);measure();
  if(ro)ro.disconnect();
  ro=new ResizeObserver(()=>{if(!S)return;measure();if(paused||!raf)safeDraw()});ro.observe(stage);
  if(paused)settle();
  start();
 }
 function hide(){S=null;stage=null;if(ro)ro.disconnect();cancelAnimationFrame(raf);raf=0;canvas.remove()}
 function setPaused(p){paused=p;if(S&&p)settle();start()}
 // A touch on the cup only nudges the liquid; nothing bursts out.
 function tap(){if(!S)return;S.slopeV+=(random()<.5?-1:1)*.05;S.springV+=.12;if(paused){step(.25);safeDraw()}}
 function seek(t){if(!S)return;while(S.t<t)step(1/30);safeDraw()}
 canvas.addEventListener('click',tap);
 document.addEventListener('visibilitychange',start);
 window.DrinkScene={show,hide,setPaused,tap,seek,palette};
})();
