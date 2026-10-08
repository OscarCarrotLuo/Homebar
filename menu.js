/* 交个朋友 — menu pages, drink detail, hash routing and transitions. */
(() => {
 'use strict';
 const pages=window.MENU_PAGES,main=document.getElementById('menu'),drinks=window.DRINK_DETAILS,body=document.body,root=document.documentElement;
 const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionButton=document.querySelector('.motion-toggle');
 let current=0,paused=motionQuery.matches,activeDrink=null,lastDrink=null,pendingDir=0,navSeq=0;
 const store={get:k=>{try{return sessionStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{sessionStorage.setItem(k,v)}catch{}}};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const hexA=(hex,a)=>{const n=parseInt(hex.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
 const repeat=(n,c)=>Array.from({length:n},(_,i)=>`<i class="${c}" style="--i:${i}"></i>`).join('');
 const arrow=dir=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${dir<0?'M15 5l-7 7 7 7':'M9 5l7 7-7 7'}"/></svg>`;
 // The original three animated bars indicate motion; the button still toggles playback.
 const motionIcon='<span class="motion-symbol" aria-hidden="true"><i></i><i></i><i></i></span>';
 // CSS geometry shown until WebGL is ready, and kept when it is unavailable.
 const artwork={
  'sweet-one':`<div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="wire-orb">${repeat(7,'orb-line')}</div><div class="satellite"></div><div class="orbital-line"></div>`,
  'sweet-two':`<div class="fruit-disc"></div><div class="layer-stack">${repeat(9,'layer')}</div><div class="square-float"></div>`,
  'coffee-one':`<div class="roast-rings">${repeat(10,'roast-ring')}</div><div class="roast-dot"></div>`,
  'coffee-two':`<div class="sun-disc"></div><div class="brew-lines">${repeat(11,'brew-line')}</div><div class="brew-square"></div>`,
  'cocktail-one':`<div class="fizz-column">${repeat(13,'fizz-bubble')}</div><div class="fizz-frame"></div>`,
  'cocktail-two':`<div class="stir-system">${repeat(7,'stir-plane')}</div><div class="stir-circle"></div>`
 };

 /* ---------- menu pages ---------- */
 pages.forEach((p,index)=>{
  const section=document.createElement('section');
  section.id=p.id;section.className=`menu-page ${p.theme} ${p.drinks.length>5?'six-drinks':''}`;
  section.hidden=index!==0;section.setAttribute('aria-labelledby',`title-${p.id}`);
  section.innerHTML=`<div class="poster-grid"><div class="poster-art"><h1 id="title-${p.id}"><span class="title-inner">${p.title}<span class="title-stop">.</span></span></h1><div class="geometry geometry-${p.theme}" aria-hidden="true"><div class="css-art">${artwork[p.theme]}</div></div></div><div class="menu-column"><ol class="drink-list"></ol></div></div>`;
  const list=section.querySelector('.drink-list');
  p.drinks.forEach(([name,en],row)=>{
   const d=drinks.find(x=>x.pageIndex===index&&x.row===row);
   const li=document.createElement('li');li.style.setProperty('--row',row);
   li.innerHTML=`<a class="drink-link" id="link-${d.id}" href="#drink/${d.id}" aria-label="${esc(name)}，查看饮品详情"><div><h3>${esc(name)}</h3><span class="drink-en">${esc(en)}</span></div><span class="drink-number" aria-hidden="true">${d.number}</span></a>`;
   list.append(li);
  });
  main.append(section);
 });
 const sections=[...main.querySelectorAll('.menu-page')],categoryLinks=[...document.querySelectorAll('[data-category]')];
 const controls=document.querySelector('.page-controls'),pager=document.querySelector('.pagination');
 pages.forEach(p=>{const a=document.createElement('a');a.href=`#${p.id}`;a.textContent=p.number;a.setAttribute('aria-label',`${p.title}，${p.label}`);pager.append(a)});
 const pageLinks=[...pager.querySelectorAll('a')];
 const detail=document.createElement('article');detail.id='drink-detail';detail.className='drink-detail';detail.hidden=true;main.append(detail);
 motionButton.innerHTML=motionIcon;

 function setTheme(page,ink,accent,line){
  root.style.setProperty('--page',page);root.style.setProperty('--ink',ink);root.style.setProperty('--accent',accent);root.style.setProperty('--line',line);
  document.querySelector('meta[name="theme-color"]').content=page;
 }
 function restart(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}

 function showPage(index,dir=0){
  current=Math.max(0,Math.min(pages.length-1,index));const p=pages[current];
  activeDrink=null;window.DrinkScene&&DrinkScene.hide();detail.hidden=true;detail.innerHTML='';
  controls.hidden=false;body.classList.remove('detail-mode');
  sections.forEach((s,i)=>{s.hidden=i!==current;if(i!==current)s.classList.remove('is-active')});
  const s=sections[current];s.style.setProperty('--dir',dir||0);restart(s,'is-active');
  setTheme(p.colors[0],p.colors[1],p.colors[2],p.colors[3]);body.dataset.theme=p.theme;
  document.title=`${p.title} · ${p.label} — 交个朋友`;
  pager.style.setProperty('--i',current);
  pageLinks.forEach((a,i)=>i===current?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  categoryLinks.forEach(a=>a.dataset.category===p.category?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  document.getElementById('page-status').textContent=`${p.title}，${p.label}，第 ${current+1} 页，共 ${pages.length} 页。`;
  window.dispatchEvent(new CustomEvent('menu:page',{detail:{index:current,section:s}}));
 }

 // A drink page holds only the cup, its two names and the core ingredients.
 function showDrink(d,dir=0){
  activeDrink=d;lastDrink=d;current=d.pageIndex;const p=pages[current],ingredients=d.essentials||d.ingredients;
  const pal=DrinkScene.palette(d);
  const prev=drinks[(d.index-1+drinks.length)%drinks.length],next=drinks[(d.index+1)%drinks.length];
  sections.forEach(s=>{s.hidden=true;s.classList.remove('is-active')});controls.hidden=true;
  body.classList.add('detail-mode');body.dataset.theme=p.theme;
  setTheme(pal[0],pal[2],pal[3],hexA(pal[2],.18));
  detail.hidden=false;detail.dataset.drink=d.id;detail.dataset.cat=d.category;detail.style.setProperty('--dir',dir);
  detail.setAttribute('aria-labelledby','drink-title');
  detail.innerHTML=`<nav class="detail-top" aria-label="饮品详情导航">
   <a class="detail-back icon-button" href="#${p.id}" aria-label="返回饮品单">${arrow(-1)}</a>
   <span class="detail-brand" aria-hidden="true">${window.BRAND?BRAND.mark():''}</span>
   <button class="detail-motion icon-button" type="button" aria-pressed="${paused}" aria-label="${paused?'播放动效':'暂停动效'}">${motionIcon}</button>
  </nav>
  <div class="detail-body${dir?' is-sliding':''}">
   <div class="drink-stage"></div>
   <header class="detail-heading">
    <h1 id="drink-title" class="detail-name" tabindex="-1">${esc(d.name)}</h1>
    <p class="detail-english" lang="en">${esc(d.en)}</p>
    <p class="detail-ingredients">${ingredients.map(n=>`<span class="ing">${esc(n)}</span>`).join('<span class="sep" aria-hidden="true"> · </span><span class="sr-only">、</span>')}</p>
   </header>
  </div>
  <nav class="detail-pager" aria-label="切换饮品">
   <a class="detail-step icon-button" href="#drink/${prev.id}" data-step="-1" aria-label="上一杯：${esc(prev.name)}">${arrow(-1)}</a>
   <a class="detail-step icon-button" href="#drink/${next.id}" data-step="1" aria-label="下一杯：${esc(next.name)}">${arrow(1)}</a>
  </nav>`;
  detail.querySelector('.detail-motion').addEventListener('click',()=>setMotion(!paused));
  detail.querySelectorAll('[data-step]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigateDrink(Number(a.dataset.step))}));
  document.title=`${d.name} · ${d.en} — 交个朋友`;
  document.getElementById('page-status').textContent=`${d.name}，${ingredients.join('、')}。`;
  DrinkScene.show(d,{stage:detail.querySelector('.drink-stage'),dir});
  window.dispatchEvent(new CustomEvent('menu:detail',{detail:{drink:d}}));
 }

 /* ---------- paper-coloured wipes between menu and detail ---------- */
 function wipe(color,x,y,grow){
  if(paused||!Element.prototype.animate)return Promise.resolve(null);
  const el=document.createElement('div');el.className='color-wipe';el.style.background=color;document.body.append(el);
  const R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))+20;
  const small=`circle(0px at ${x}px ${y}px)`,big=`circle(${R}px at ${x}px ${y}px)`;
  const anim=el.animate({clipPath:grow?[small,big]:[big,small]},{duration:grow?440:480,easing:'cubic-bezier(.6,0,.2,1)',fill:'forwards'});
  setTimeout(()=>el.remove(),1500);
  return anim.finished.then(()=>el,()=>el);
 }
 function fadeOut(el){if(!el)return;el.animate({opacity:[1,0]},{duration:280,easing:'ease-out',fill:'forwards'}).finished.then(()=>el.remove(),()=>el.remove())}
 main.addEventListener('click',e=>{
  const a=e.target.closest('.drink-link');
  if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button>0)return;
  e.preventDefault();
  const d=drinks.find(x=>`#drink/${x.id}`===a.getAttribute('href')),r=a.getBoundingClientRect();
  const x=e.clientX||r.left+r.width/2,y=e.clientY||r.top+r.height/2,ticket=++navSeq;
  a.classList.add('is-pressed');
  wipe(DrinkScene.palette(d)[0],x,y,true).then(el=>{
   a.classList.remove('is-pressed');
   // Another navigation happened while the colour spread: drop this one.
   if(ticket!==navSeq){el&&el.remove();return}
   pendingDir=0;location.hash=`drink/${d.id}`;fadeOut(el);
  });
 });

 /* ---------- routing ---------- */
 function readHash(focus=false){
  navSeq++;
  const match=location.hash.match(/^#drink\/([a-z0-9-]+)$/),d=match&&drinks.find(x=>x.id===match[1]);
  const dir=pendingDir;pendingDir=0;
  if(d){showDrink(d,dir);if(focus)detail.querySelector('h1').focus({preventScroll:true});return}
  const i=pages.findIndex(p=>`#${p.id}`===location.hash),wasDetail=activeDrink;
  const leaving=wasDetail?DrinkScene.palette(wasDetail)[0]:null;
  showPage(i<0?0:i,dir);
  if(wasDetail&&lastDrink?.pageIndex===current){
   const link=document.getElementById(`link-${lastDrink.id}`);
   if(focus)link?.focus({preventScroll:true});
   if(link&&leaving){const r=link.getBoundingClientRect();wipe(leaving,r.left+r.width*.3,r.top+r.height/2,false).then(el=>el&&el.remove())}
  }
 }
 // Switching drinks is immediate: the next cup slides in, so nothing is left waiting to fire later.
 function navigateDrink(delta){
  if(!activeDrink)return;
  const target=drinks[(activeDrink.index+delta+drinks.length)%drinks.length];
  pendingDir=delta;location.hash=`drink/${target.id}`;
 }
 function navigate(index){if(index>=0&&index<pages.length&&index!==current){pendingDir=Math.sign(index-current);location.hash=pages[index].id}}
 pageLinks.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();navigate(i)}));
 categoryLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(pages.findIndex(p=>`#${p.id}`===a.getAttribute('href')))}));
 window.addEventListener('hashchange',()=>{readHash(true);window.scrollTo({top:0,behavior:'instant'})});
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(activeDrink&&e.key==='Escape'){location.hash=activeDrink.pageId;return}
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const delta=e.key==='ArrowRight'?1:-1;activeDrink?navigateDrink(delta):navigate(current+delta)}
 });
 // A swipe is a quick, mostly horizontal flick with one finger. Slow drags and scrolls are ignored.
 let touchStart;
 document.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY,t:performance.now()}:undefined},{passive:true});
 document.addEventListener('touchmove',e=>{if(e.touches.length>1)touchStart=undefined},{passive:true});
 document.addEventListener('touchend',e=>{
  const s=touchStart;touchStart=undefined;
  if(!s||!e.changedTouches.length||body.classList.contains('is-intro'))return;
  const dx=e.changedTouches[0].clientX-s.x,dy=e.changedTouches[0].clientY-s.y,dt=performance.now()-s.t;
  if(dt<600&&Math.abs(dx)>56&&Math.abs(dx)>Math.abs(dy)*1.8){const delta=dx<0?1:-1;activeDrink?navigateDrink(delta):navigate(current+delta)}
 },{passive:true});
 document.addEventListener('touchcancel',()=>{touchStart=undefined},{passive:true});

 /* ---------- motion ---------- */
 function setMotion(value){
  paused=value;body.classList.toggle('motion-paused',paused);
  [motionButton,detail.querySelector('.detail-motion')].forEach(b=>{if(b){b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'播放动效':'暂停动效')}});
  window.DrinkScene&&DrinkScene.setPaused(paused);
  window.dispatchEvent(new CustomEvent('menu:motion',{detail:{paused}}));
 }
 motionButton.addEventListener('click',()=>setMotion(!paused));
 motionQuery.addEventListener('change',e=>setMotion(e.matches));
 document.addEventListener('visibilitychange',()=>body.classList.toggle('tab-inactive',document.hidden));

 /* ---------- first-visit intro ---------- */
 const splash=document.querySelector('.splash');
 if(splash&&!paused&&!location.hash.startsWith('#drink/')&&!store.get('jgpy-intro')){
  store.set('jgpy-intro','1');splash.hidden=false;body.classList.add('is-intro');
  const done=()=>{if(!splash.isConnected||splash.classList.contains('is-leaving'))return;splash.classList.add('is-leaving');body.classList.remove('is-intro');if(!activeDrink)restart(sections[current],'is-active');setTimeout(()=>splash.remove(),900)};
  const timer=setTimeout(done,2300);splash.addEventListener('click',()=>{clearTimeout(timer);done()});
 }else splash?.remove();

 setMotion(paused);readHash();
 // Warm the faces used only on drink pages while the menu is idle, so a first tap does not wait on them.
 const warm=()=>{for(const f of['16px "Ma Shan Zheng"','300 16px "Source Han Serif CN"','16px Caveat','italic 500 16px "Cormorant Garamond"'])document.fonts?.load(f,'字Aa').catch(()=>{})};
 'requestIdleCallback' in window?requestIdleCallback(warm,{timeout:2500}):setTimeout(warm,1200);
})();
