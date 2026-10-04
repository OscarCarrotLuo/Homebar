(() => {
 'use strict';
 const pages=window.MENU_PAGES, main=document.getElementById('menu');
 const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionButton=document.querySelector('.motion-toggle');
 let current=0, paused=motionQuery.matches, activeDrink=null, lastDrink=null;
 const drinks=window.DRINK_DETAILS;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  section.innerHTML=`<div class="poster-grid"><div class="poster-art"><h1 id="title-${p.id}">${p.title}<span class="title-stop">.</span></h1><div class="geometry geometry-${p.theme}" aria-hidden="true"><div class="css-art">${artwork[p.theme]}</div></div></div><div class="menu-column"><ol class="drink-list"></ol></div></div>`;
  const list=section.querySelector('.drink-list');
  p.drinks.forEach(([name,en],row)=>{
   const li=document.createElement('li'),content=document.createElement('div'),h=document.createElement('h3'),sub=document.createElement('span'),num=document.createElement('span');
   li.style.setProperty('--row',row);h.textContent=name;sub.className='drink-en';sub.textContent=en;
   num.className='drink-number';num.setAttribute('aria-hidden','true');
   const drink=drinks.find(d=>d.pageIndex===index&&d.row===row),link=document.createElement('a');
   link.href=`#drink/${drink.id}`;link.className='drink-link';link.id=`link-${drink.id}`;link.setAttribute('aria-label',`${name}，查看饮品详情`);
   num.textContent=String(drink.number);
   content.append(h,sub);link.append(content,num);li.append(link);list.append(li);
  });
  main.append(section);
 });
 const sections=[...main.querySelectorAll('.menu-page')],pageLinks=[...document.querySelectorAll('.pagination a')],categoryLinks=[...document.querySelectorAll('[data-category]')];
 const detail=document.createElement('article');detail.id='drink-detail';detail.className='drink-detail';detail.hidden=true;main.append(detail);
 const controls=document.querySelector('.page-controls');
 function setTheme(p){
  p.colors.forEach((c,i)=>document.documentElement.style.setProperty(['--page','--ink','--accent','--line'][i],c));
  document.body.dataset.theme=p.theme;document.querySelector('meta[name="theme-color"]').content=p.colors[0];
  categoryLinks.forEach(a=>a.dataset.category===p.category?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
 }
 function showPage(index){
  current=Math.max(0,Math.min(pages.length-1,index));const p=pages[current];
  activeDrink=null;detail.hidden=true;controls.hidden=false;document.body.classList.remove('detail-mode');
  sections.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('is-active',i===current)});
  p.colors.forEach((c,i)=>document.documentElement.style.setProperty(['--page','--ink','--accent','--line'][i],c));
  document.body.dataset.theme=p.theme;document.querySelector('meta[name="theme-color"]').content=p.colors[0];
  document.title=`${p.title} ${p.part} — 饮品单`;
  pageLinks.forEach((a,i)=>i===current?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  categoryLinks.forEach(a=>a.dataset.category===p.category?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  document.getElementById('page-status').textContent=`${p.title}，${p.label}，第 ${current+1} 页，共 6 页。`;
  window.dispatchEvent(new CustomEvent('menu:page',{detail:{index:current,section:sections[current]}}));
 }
 function showDrink(d){
  activeDrink=d;lastDrink=d;current=d.pageIndex;const p=pages[current],ingredients=d.essentials||d.ingredients;
  sections.forEach(s=>{s.hidden=true;s.classList.remove('is-active')});controls.hidden=true;
  document.body.classList.add('detail-mode');setTheme(p);detail.hidden=false;
  detail.setAttribute('aria-labelledby','drink-title');
  const personality=window.DRINK_PERSONALITIES[d.id];detail.dataset.drink=d.id;detail.dataset.signature=personality.signature;
  const props={'--drink-cn':`"${personality.cn}"`,'--drink-en':`"${personality.en}"`,'--drink-weight':personality.weight,'--drink-tracking':personality.tracking,'--drink-en-style':personality.enStyle,'--drink-en-weight':personality.enWeight,'--ingredient-weight':personality.cn==='Noto Serif SC'?500:400};
  Object.entries(props).forEach(([key,value])=>detail.style.setProperty(key,value));
  detail.innerHTML=`<nav class="detail-topline" aria-label="饮品详情导航"><a class="back-to-menu" href="#${p.id}" aria-label="返回酒单"><span aria-hidden="true">←</span></a><button class="detail-motion" type="button" aria-pressed="${paused}" aria-label="${paused?'播放动效':'暂停动效'}"><span class="motion-symbol" aria-hidden="true"><i></i><i></i><i></i></span></button></nav>
  <div class="detail-grid">
   <figure class="drink-stage" data-glass="${d.glass}">${window.renderDrinkArt(d)}</figure>
   <header class="detail-heading"><h1 id="drink-title" tabindex="-1">${esc(d.name)}</h1><p class="detail-english">${esc(d.en)}</p></header>
   <p class="detail-ingredients" aria-label="主要用料">${ingredients.map((name,i)=>`<span class="ingredient-name">${esc(name)}${i<ingredients.length-1?'<span class="ingredient-separator" aria-hidden="true"> · </span>':''}</span>`).join(' ')}</p>
  </div>
`;
  detail.querySelector('.detail-motion').addEventListener('click',()=>setMotion(!paused));
  document.title=`${d.name} · ${d.en} — MENU`;
  document.getElementById('page-status').textContent=`${d.name}，饮品详情，${ingredients.join('、')}。`;
  window.dispatchEvent(new CustomEvent('menu:detail',{detail:{drink:d}}));
 }
 function readHash(focus=false){
  const match=location.hash.match(/^#drink\/([a-z0-9-]+)$/),d=match&&drinks.find(d=>d.id===match[1]);
  if(d){showDrink(d);if(focus)detail.querySelector('h1').focus({preventScroll:true});return;}
  const i=pages.findIndex(p=>`#${p.id}`===location.hash),wasDetail=activeDrink;
  showPage(i<0?0:i);
  if(focus&&wasDetail&&lastDrink?.pageIndex===current)document.getElementById(`link-${lastDrink.id}`)?.focus({preventScroll:true});
 }
 function navigateDrink(delta){location.hash=`drink/${drinks[(activeDrink.index+delta+drinks.length)%drinks.length].id}`;}

 function navigate(index){if(index>=0&&index<pages.length)location.hash=pages[index].id}
 window.addEventListener('hashchange',()=>{readHash(true);window.scrollTo({top:0,behavior:'instant'})});
 document.addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  if(activeDrink&&e.key==='Escape'){location.hash=activeDrink.pageId;return;}
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const delta=e.key==='ArrowRight'?1:-1;activeDrink?navigateDrink(delta):navigate(current+delta)}
 });
 let touchStart;
 main.addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:undefined},{passive:true});
 main.addEventListener('touchend',e=>{
  if(!touchStart||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.7){const delta=dx<0?1:-1;activeDrink?navigateDrink(delta):navigate(current+delta)}touchStart=undefined;
 },{passive:true});
 main.addEventListener('touchcancel',()=>{touchStart=undefined},{passive:true});
 function setMotion(value){
  paused=value;document.body.classList.toggle('motion-paused',paused);
  const detailMotion=detail.querySelector('.detail-motion');if(detailMotion){detailMotion.setAttribute('aria-pressed',String(paused));detailMotion.setAttribute('aria-label',paused?'播放动效':'暂停动效');}motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.setAttribute('aria-label',paused?'播放动效':'暂停动效');
  window.dispatchEvent(new CustomEvent('menu:motion',{detail:{paused}}));
 }
 motionButton.addEventListener('click',()=>setMotion(!paused));motionQuery.addEventListener('change',e=>setMotion(e.matches));
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('tab-inactive',document.hidden));
 setMotion(paused);readHash();
})();
