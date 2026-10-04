/* One active SVG simulation, bounded to 30 fps; stopped offscreen or when motion is disabled. */
(() => {
 'use strict';
 let frame=0,last=0,time=0,state=null;
 const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const paused=()=>document.hidden||document.body.classList.contains('motion-paused');
 const transform=(el,value)=>el.setAttribute('transform',value);
 function waveform(y,phase,reverse=false){
  const p=state.profile,t=time*p.tempo,a=Math.sin(t*.84+phase)*p.wave,b=Math.cos(t*.62+phase)*p.wave*1.4;
  return reverse?`L370 ${y}C305 ${y+b} 280 ${y-a} 220 ${y+a*.35}S130 ${y-b} 70 ${y}`:`M70 ${y}C130 ${y-b} 160 ${y+a} 220 ${y+a*.35}S305 ${y+b} 370 ${y}`;
 }
 function feature({el,kind,o}){
  const t=time*state.profile.tempo,s=o.speed??.3,phase=o.phase??0,q=((t*s+phase)%1+1)%1;
  let x=o.x??0,y=o.y??0,angle=0,scale=o.scale??1,sy=1,alpha=o.opacity??.7;
  switch(kind){
   case 'fall':x+=Math.sin(q*5+phase)*o.spread*.8;y+=q*o.distance;angle=phase*180+q*150;alpha*=Math.pow(Math.sin(q*Math.PI),.65);break;
   case 'rise':x+=Math.sin(q*4+phase)*o.spread;y-=q*o.distance;angle=Math.sin(t*.3+phase)*20;alpha*=Math.sin(q*Math.PI);break;
   case 'leaf':x+=Math.sin(q*TAU+phase)*o.spread;y-=q*o.distance;angle=q*300+phase*110;sy=.5+.5*Math.abs(Math.cos(q*TAU));alpha*=Math.sin(q*Math.PI);break;
   case 'bubble':{
    const i=o.i,spiral=o.helix,offset=spiral?Math.sin(q*(spiral===1?TAU*1.5:TAU)+i%2*Math.PI)*o.spread:Math.sin(i*12.7)*o.spread+Math.sin(t+i)*5;
    x+=offset;y-=q*o.distance;scale=.65+q*.7;alpha*=Math.sin(q*Math.PI)*.9;break;
   }
   case 'fountain':x+=Math.sin(phase*17)*o.spread*q;y-=Math.sin(q*Math.PI)*o.distance;scale=.5+Math.sin(q*Math.PI)*.7;alpha*=Math.sin(q*Math.PI);break;
   case 'orbit':{const a=t*s+phase;x+=Math.cos(a)*o.rx;y+=Math.sin(a)*o.ry;angle=a*40;scale*=.85+Math.sin(a)*.15;alpha*=.8+Math.sin(a)*.2;break;}
   case 'ripple':scale=.3+q*.9;alpha*=(1-q)*.9;break;
   case 'turn':angle=t*s+(o.phase??0);sy=o.scaleY??1;break;
   case 'bloom':angle=Math.sin(t*s+phase)*30;scale*=(.7+.3*Math.sin(t*s+phase));break;
   case 'rosette':angle=t*4;scale=.8+Math.sin(t*s)*.2;sy=o.scaleY??1;break;
   case 'facet':y-=Math.sin(t*s+phase)*(o.rise??8);angle=Math.sin(t*s+phase)*4;alpha*=.45+.55*Math.pow(Math.sin(t*s+phase),2);break;
   case 'sun':y+=Math.sin(t*s)*(o.amplitude??15);scale=.95+Math.sin(t*s)*.05;break;
   case 'eclipse':x+=Math.sin(t*s)*(o.amplitude??20);y+=Math.cos(t*s)*12;break;
   case 'pendulum':angle=Math.sin(t*s)*(o.amplitude??12);break;
   case 'prism':angle=Math.sin(t*s)*7;scale=.94+Math.sin(t*s)*.04;alpha*=.75+.25*Math.sin(t*s);break;
   case 'flow':{
    const a=Math.sin(t*s+phase)*o.amplitude,b=Math.cos(t*s*.83+phase)*o.amplitude;
    el.setAttribute('d',`M${x-o.width/2} ${y}C${x-o.width*.3} ${y+a} ${x-30} ${y-b} ${x} ${y}S${x+o.width*.3} ${y+a} ${x+o.width/2} ${y}`);
    el.setAttribute('opacity',alpha*(.65+.35*Math.sin(t*s+phase)**2));return;
   }
   case 'pour':{
    const reach=o.depth*(.3+.7*(.5+.5*Math.sin(t*s+phase))),dx=Math.sin(t*s*.8+phase)*11;
    el.setAttribute('d',`M${x} ${y}C${x+dx} ${y+reach*.2} ${x-dx*1.7} ${y+reach*.64} ${x+dx*.4} ${y+reach}Q${x+dx*2} ${y+reach+8} ${x+dx*2.5} ${y+reach-5}`);
    el.setAttribute('opacity',alpha*(.45+.55*Math.sin(t*s*.65+phase)**2));return;
   }
  }
  transform(el,`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${scale.toFixed(3)} ${(scale*sy).toFixed(3)})`);
  el.setAttribute('opacity',clamp(alpha).toFixed(3));
 }
 function paint(){
  if(!state)return;
  const {profile:p,object,shadow,ice,garnish,shimmers}=state,t=time*p.tempo;
  let lean=Math.sin(t*.55)*p.sway,lift=Math.sin(t*.63)*1.4;
  // Each preparation has a different physical rhythm, including intentionally still glasses.
  if(p.signature==='citrus-prism'){const pulse=(t%10);lean+=(pulse<.9?Math.sin(pulse*25)*(1-pulse/.9)*.7:0);lift=0;}
  if(p.signature==='amber-monolith')lift=0;
  transform(object,`translate(0 ${lift.toFixed(2)}) rotate(${lean.toFixed(3)} 220 420)`);
  shadow.setAttribute('opacity',(.075-lift*.003).toFixed(3));
  state.paths.forEach(({el,y,h,phase})=>el.setAttribute('d',waveform(y,phase)+waveform(y+h,phase-1,true)+' Z'));
  state.surfaces.forEach(({el,y},i)=>el.setAttribute('cy',(y+Math.sin(t*.84+i)*p.wave*.23).toFixed(2)));
  ice.forEach((el,i)=>{
   const turn=Math.sin(t*.5+i*1.7)*p.ice*1.8,dy=Math.sin(t*.71+i)*p.ice;
   transform(el,`translate(0 ${dy.toFixed(2)}) rotate(${turn.toFixed(2)} 220 310)`);
  });
  const garnishAngle=p.signature==='amber-monolith'?0:p.signature==='vermouth-pendulum'?Math.sin(t*.9)*9:p.signature==='mint-muddle'?Math.sin(t*1.1)*4:Math.sin(t*.4)*1.3;
  transform(garnish,`rotate(${garnishAngle.toFixed(2)} 220 180)`);
  shimmers.forEach((el,i)=>{const q=((t*.075+i*.028)%1);transform(el,`translate(${(q*700-110).toFixed(2)} 0)`);el.setAttribute('opacity',(Math.sin(q*Math.PI)*.28).toFixed(3));});
  state.features.forEach(feature);
 }
 function tick(now){
  frame=0;if(!state||paused())return;
  if(!last)last=now;
  const dt=now-last;
  if(dt>=1000/30){time+=Math.min(dt/1000,.067);last=now;paint();}
  frame=requestAnimationFrame(tick);
 }
 function run(){cancelAnimationFrame(frame);frame=0;last=0;if(state&&!paused())frame=requestAnimationFrame(tick);}
 function activate(){
  const host=document.querySelector('#drink-detail:not([hidden])'),svg=host?.querySelector('.drink-illustration');
  if(!svg){state=null;run();return;}
  state={profile:window.DRINK_PERSONALITIES[svg.dataset.drink],object:svg.querySelector('.drink-object'),shadow:svg.querySelector('.drink-shadow'),garnish:svg.querySelector('.garnish-lift'),ice:[...svg.querySelectorAll('.ice-float')],shimmers:[...svg.querySelectorAll('.glass-shimmer')],paths:[...svg.querySelectorAll('.liquid-fill')].map(el=>({el,y:Number(el.dataset.y),h:Number(el.dataset.height),phase:Number(el.dataset.phase)})),surfaces:[...svg.querySelectorAll('.liquid-surface')].map(el=>({el,y:Number(el.getAttribute('cy'))})),features:[...svg.querySelectorAll('[data-fx]')].map(el=>({el,kind:el.dataset.fx,o:JSON.parse(el.dataset.motion)}))};
  time=1.2;paint();run();
 }
 window.addEventListener('menu:detail',activate);
 window.addEventListener('menu:page',()=>{state=null;run()});
 window.addEventListener('menu:motion',run);
 document.addEventListener('visibilitychange',run);
 activate();
})();
