(() => {
 'use strict';
 const pages=window.MENU_PAGES, main=document.getElementById('menu');
 const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionButton=document.querySelector('.motion-toggle');
 let current=0, paused=motionQuery.matches;
 const repeat=(n,c)=>Array.from({length:n},(_,i)=>`<i class="${c}" style="--i:${i}"></i>`).join('');
 const artwork={
  'sweet-one':`<div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="wire-orb">${repeat(7,'orb-line')}</div><div class="satellite"></div><div class="orbital-line"></div>`,
  'sweet-two':`<div class="fruit-disc"></div><div class="layer-stack">${repeat(9,'layer')}</div><div class="square-float"></div>`,
  'coffee-one':`<div class="roast-rings">${repeat(10,'roast-ring')}</div><div class="roast-dot"></div>`,
  'coffee-two':`<div class="sun-disc"></div><div class="brew-lines">${repeat(11,'brew-line')}</div><div class="brew-square"></div>`,
  'cocktail-one':`<div class="fizz-column">${repeat(13,'fizz-bubble')}</div><div class="fizz-frame"></div>`,
  'cocktail-two':`<div class="stir-system">${repeat(7,'stir-plane')}</div><div class="stir-circle"></div>`
 };
 pages.forEach((p,index)=>{
  const section=document.createElement('section');
  section.id=p.id;section.className=`menu-page ${p.theme} ${p.drinks.length>5?'six-drinks':''}`;
  section.hidden=index!==0;section.setAttribute('aria-labelledby',`title-${p.id}`);
  section.innerHTML=`<div class="page-eyebrow"><span>${p.category.toUpperCase()} / ${p.number}</span><span>${p.label}</span></div><div class="poster-grid"><div class="poster-art"><h1 id="title-${p.id}">${p.title}<span class="title-stop">.</span></h1><div class="geometry geometry-${p.theme}" aria-hidden="true"><div class="css-art">${artwork[p.theme]}</div></div><div class="art-caption"><span>${p.caption}</span><span class="caption-rule"></span><span>${p.part}</span></div></div><div class="menu-column"><div class="menu-heading"><h2>${p.label}</h2><span>${p.number} — 06</span></div><ol class="drink-list"></ol></div></div>`;
  const list=section.querySelector('.drink-list');
  p.drinks.forEach(([name,en],row)=>{
   const li=document.createElement('li'),content=document.createElement('div'),h=document.createElement('h3'),sub=document.createElement('span'),num=document.createElement('span');
   li.style.setProperty('--row',row);h.textContent=name;sub.className='drink-en';sub.textContent=en;
   num.className='drink-number';num.textContent=String(row+1).padStart(2,'0');num.setAttribute('aria-hidden','true');
   content.append(h,sub);li.append(content,num);list.append(li);
  });
  main.append(section);
 });
 const sections=[...main.querySelectorAll('.menu-page')],pageLinks=[...document.querySelectorAll('.pagination a')],categoryLinks=[...document.querySelectorAll('[data-category]')];
 const previous=document.querySelector('.previous'),next=document.querySelector('.next');
 function showPage(index){
  current=Math.max(0,Math.min(pages.length-1,index));const p=pages[current];
  sections.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('is-active',i===current)});
  p.colors.forEach((c,i)=>document.documentElement.style.setProperty(['--page','--ink','--accent','--line'][i],c));
  document.body.dataset.theme=p.theme;document.querySelector('meta[name="theme-color"]').content=p.colors[0];
  document.title=`${p.title} ${p.part} — 饮品单`;
  pageLinks.forEach((a,i)=>i===current?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  categoryLinks.forEach(a=>a.dataset.category===p.category?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  previous.disabled=current===0;next.disabled=current===pages.length-1;
  document.getElementById('page-status').textContent=`${p.title}，${p.label}，第 ${current+1} 页，共 6 页。`;
  window.dispatchEvent(new CustomEvent('menu:page',{detail:{index:current,section:sections[current]}}));
 }
 function readHash(){const i=pages.findIndex(p=>`#${p.id}`===location.hash);showPage(i<0?0:i)}
 function navigate(index){if(index>=0&&index<pages.length)location.hash=pages[index].id}
 previous.addEventListener('click',()=>navigate(current-1));next.addEventListener('click',()=>navigate(current+1));
 window.addEventListener('hashchange',()=>{readHash();window.scrollTo({top:0,behavior:'instant'})});
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();navigate(current+(e.key==='ArrowRight'?1:-1))}
 });
 let touchStart;
 main.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:undefined},{passive:true});
 main.addEventListener('touchend',e=>{
  if(!touchStart||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.7)navigate(current+(dx<0?1:-1));touchStart=undefined;
 },{passive:true});
 function setMotion(value){
  paused=value;document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.setAttribute('aria-label',paused?'播放动效':'暂停动效');motionButton.querySelector('.motion-label').textContent=paused?'动效关':'动效开';
  window.dispatchEvent(new CustomEvent('menu:motion',{detail:{paused}}));
 }
 motionButton.addEventListener('click',()=>setMotion(!paused));motionQuery.addEventListener('change',e=>setMotion(e.matches));
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('tab-inactive',document.hidden));
 setMotion(paused);readHash();
})();
