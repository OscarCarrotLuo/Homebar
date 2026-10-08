/* 交个朋友 — Simplified Chinese typography and the intersection mark.
   Two rims meet; what they share is the friendship. */
(() => {
 'use strict';
 // A real Simplified Chinese display face; only the four brand characters are shipped.
 function wordmark(){
  return '<span class="logo-word" lang="zh-CN" aria-hidden="true">交个朋友</span>';
 }
 function mark(){
  return `<svg class="logo-mark" viewBox="0 0 42 28" aria-hidden="true" focusable="false"><path class="logo-lens" d="M21 5.51A11 11 0 0 1 21 22.49A11 11 0 0 1 21 5.51Z"/><circle class="logo-ring logo-ring-a" cx="14" cy="14" r="11"/><circle class="logo-ring logo-ring-b" cx="28" cy="14" r="11"/></svg>`;
 }
 window.BRAND={wordmark,mark};
 document.querySelectorAll('[data-logo]').forEach(el=>{
  const kind=el.dataset.logo;
  el.innerHTML=kind==='mark'?mark():kind==='word'?wordmark(Number(el.dataset.weight)||11):mark()+wordmark(Number(el.dataset.weight)||11);
 });
})();
