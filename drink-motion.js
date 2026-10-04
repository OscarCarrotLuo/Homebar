/* Animate only the visible glass. Geometry, names and ingredients remain legible at rest. */
(() => {
 'use strict';
 let paths=[],surfaces=[],frame=0,time=0,last=0,active=false;
 const isPaused=()=>document.hidden||document.body.classList.contains('motion-paused');
 function wave(y,phase,reverse=false){
  const a=Math.sin(time*.85+phase)*4.5,b=Math.cos(time*.67+phase)*5.5;
  return reverse?`L370 ${y} C305 ${y+b} 280 ${y-a} 220 ${y+a*.35} S130 ${y-b} 70 ${y}`:`M70 ${y} C130 ${y-b} 160 ${y+a} 220 ${y+a*.35} S305 ${y+b} 370 ${y}`;
 }
 function paint(){
  paths.forEach(({el,y,h,phase})=>el.setAttribute('d',wave(y,phase)+wave(y+h,phase-1,true)+' Z'));
  surfaces.forEach(({el,y},i)=>el.setAttribute('cy',y+Math.sin(time*.85+i)*1.5));
 }
 function tick(now){
  frame=0;if(!active||isPaused())return;
  if(!last)last=now;
  const dt=now-last;
  if(dt>=1000/30){time+=Math.min(dt/1000,.06);last=now;paint();}
  frame=requestAnimationFrame(tick);
 }
 function run(){
  cancelAnimationFrame(frame);frame=0;last=0;
  if(active&&!isPaused())frame=requestAnimationFrame(tick);
 }
 function activate(){
  const host=document.querySelector('#drink-detail:not([hidden])');active=!!host;
  paths=host?[...host.querySelectorAll('.liquid-fill')].map(el=>({el,y:Number(el.dataset.y),h:Number(el.dataset.height),phase:Number(el.dataset.phase)})):[];
  surfaces=host?[...host.querySelectorAll('.liquid-surface')].map(el=>({el,y:Number(el.getAttribute('cy'))})):[];
  time=0;run();
 }
 window.addEventListener('menu:detail',activate);
 window.addEventListener('menu:page',()=>{active=false;paths=[];surfaces=[];run()});
 window.addEventListener('menu:motion',run);
 document.addEventListener('visibilitychange',run);
 activate();
})();
