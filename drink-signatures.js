/* Thirty-two ingredient-led compositions. All elements are drawn locally as vectors. */
(() => {
 'use strict';
 const cfg=o=>JSON.stringify(o).replace(/'/g,'&#39;');
 const fx=(kind,body,o={})=>`<g data-fx="${kind}" data-motion='${cfg(o)}'>${body}</g>`;
 const circle=(r,color,outline=false)=>`<circle r="${r}" fill="${outline?'none':color}" ${outline?`stroke="${color}" stroke-width="1.2"`:''}/>`;
 const leaf=color=>`<path d="M0 15 Q-18 1 0 -18 Q18 0 0 15Z" fill="${color}"/><path d="M0 12V-14" stroke="#f9f1bf" stroke-width=".6" opacity=".7"/>`;
 const flower=color=>Array.from({length:5},(_,i)=>`<ellipse cx="0" cy="-8" rx="4" ry="9" fill="${color}" transform="rotate(${i*72})"/>`).join('')+circle(2,'#dfbb56');
 const seed=(color,kind)=>kind==='petal'?flower(color):kind==='leaf'?leaf(color):kind==='needle'?`<path d="M0 -9L1 9" stroke="${color}" stroke-width="1.2"/>`:kind==='crystal'?`<path d="M0 -4L4 0 0 4 -4 0Z" fill="${color}"/>`:`<ellipse rx="${kind==='sesame'?1.5:2.2}" ry="${kind==='sesame'?3.2:2}" fill="${color}"/>`;
 function particles(kind,n,color,o={}){return Array.from({length:n},(_,i)=>fx(o.motion||'fall',seed(color,kind),{x:o.x??220,y:o.y??120,spread:o.spread??65,distance:o.distance??70,phase:i*.618,speed:o.speed??.19,scale:kind==='petal'?.45:kind==='leaf'?.55:1,opacity:o.opacity??.8,...o,i})).join('');}
 function bubbles(n,color,o={}){return Array.from({length:n},(_,i)=>fx('bubble',circle(1.7+(i%4)*.55,color,true),{x:220,y:402,spread:55,distance:240,phase:i*.618,speed:.18,helix:0,...o,i})).join('');}
 function ripple(x,y,r,color,i=0,o={}){return fx('ripple',`<ellipse rx="${r}" ry="${r*.14}" fill="none" stroke="${color}" stroke-width="1"/>`,{x,y,phase:i*.27,speed:.16,opacity:.65,...o});}
 function orbit(shape,x,y,rx,ry,i,o={}){return fx('orbit',shape,{x,y,rx,ry,phase:i*1.9,speed:.45,opacity:.75,...o});}
 function flow(x,y,width,color,i=0,o={}){return `<path data-fx="flow" data-motion='${cfg({x,y,width,phase:i*.91,speed:.65,amplitude:13,opacity:.6,...o})}' d="M${x-width/2} ${y}H${x+width/2}" fill="none" stroke="${color}" stroke-width="${o.stroke||2}" stroke-linecap="round"/>`;}
 function pour(x,y,depth,color,i=0,o={}){return `<path data-fx="pour" data-motion='${cfg({x,y,depth,phase:i*.87,speed:.27,opacity:.5,...o})}' d="M${x} ${y}v${depth*.5}" fill="none" stroke="${color}" stroke-width="${o.stroke||9}" stroke-linecap="round"/>`;}
 function rays(x,y,r,color,n,o={}){return fx('turn',Array.from({length:n},(_,i)=>`<path d="M${r*.50} 0 L${r} 0" stroke="${color}" stroke-width="${o.stroke||2}" transform="rotate(${i*360/n})"/>`).join(''),{x,y,speed:4,opacity:.2,...o});}
 function facet(x,y,r,color,i,o={}){return fx('facet',`<path d="M0 -${r} L${r*.67} 0 0 ${r} -${r*.67} 0Z" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width=".7"/><path d="M0 -${r}V${r}M-${r*.67} 0H${r*.67}" fill="none" stroke="${color}" stroke-width=".6"/>`,{x,y,phase:i*1.6,speed:.5,opacity:.5,...o});}
 const join=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
 window.renderDrinkSignature=(d,b)=>{
  const {top,bottom,w,liquidTop:y,layers}=b,p=window.DRINK_PERSONALITIES[d.id];
  const cream=layers.at(-1).color,edge=layers.length>1?layers.at(-1).y+layers.at(-1).h:y+20;
  let back='',liquid='',front='',crown='';
  switch(p.signature){
   case 'zest-breeze':
    crown=join(7,i=>orbit(seed('#6c8737','needle'),220,y-10,60,13,i,{speed:.5,scale:.85}));
    liquid=join(3,i=>flow(220,y+75+i*61,144,'#fffaf0',i,{stroke:9,amplitude:9,opacity:.6}));
    back=join(2,i=>flow(220,top+38+i*31,236,'#8caa49',i,{stroke:1,opacity:.3,amplitude:15}));break;
   case 'salt-whisk':
    crown=particles('crystal',16,'#fff9df',{y:y-40,distance:43,spread:55,speed:.22});
    liquid=join(4,i=>flow(220,edge+26+i*50,145,i%2?'#c7d68c':'#486934',i,{stroke:2.4,amplitude:18}));break;
   case 'orchard-current':
    liquid=particles('leaf',8,'#8d662c',{y:bottom-22,distance:heightOf(b)-50,spread:53,motion:'leaf',speed:.16,opacity:.5});
    back=join(3,i=>ripple(220,top+145,123,'#c98841',i,{opacity:.3}));
    crown=join(3,i=>orbit(seed('#ebb679','petal'),220,y-10,70,13,i,{speed:.28,scale:.4}));break;
   case 'cream-fold':
    liquid=join(5,i=>pour(164+i*27,edge-5,45+i%2*25,'#efe6b9',i,{stroke:11,speed:.18,opacity:.78}));
    crown=join(3,i=>ripple(220,y,37+i*15,'#fff9dc',i,{speed:.12,opacity:.6}));break;
   case 'thai-silk':
    back=rays(220,top+130,155,'#bf6d3e',24,{speed:2.5,opacity:.18,stroke:3});
    liquid=join(5,i=>pour(162+i*29,edge,130,'#ffbd5b',i,{stroke:4,speed:.32,opacity:.48}));
    crown=particles('crystal',7,'#d08b42',{y:y-16,distance:20,spread:45,speed:.14});break;
   case 'cocoa-rain':
    crown=particles('dust',23,'#6d3826',{y:y-60,distance:61,spread:67,speed:.2,opacity:.8});
    liquid=join(4,i=>ripple(220,edge+35+i*27,74,'#fbffec',i,{speed:.23,opacity:.62}));
    front=join(2,i=>orbit(circle(2,'#efe5b7'),220,edge+77,98,10,i,{speed:.35,opacity:.5}));break;
   case 'jade-ripple':
    liquid=join(6,i=>flow(220,edge+15+i*27,183,i%2?'#9bb970':'#f1f3d7',i,{stroke:1.5,amplitude:9,speed:.37}));
    crown=fx('turn',join(9,i=>`<ellipse cx="0" cy="-26" rx="7" ry="23" fill="none" stroke="#537535" stroke-width="1" transform="rotate(${i*40})"/>`),{x:220,y,speed:8,scaleY:.3,opacity:.5});break;
   case 'glacier-bloom':
    liquid=join(6,i=>facet(172+(i%3)*49,bottom-40-Math.floor(i/3)*68,27+i%2*9,['#88d8e5','#bbf4ef','#47a5d4'][i%3],i,{rise:42}));
    crown=join(3,i=>fx('bloom',flower('#fff7dc'),{x:184+i*36,y:y-5-i%2*20,phase:i,speed:.55,scale:.65,opacity:.9}));
    back=join(3,i=>flow(220,top+100+i*42,245,'#64b4c5',i,{stroke:1,amplitude:7,opacity:.18}));break;
   case 'orange-horizon':
    back=fx('sun',circle(104,'#eeb446'),{x:220,y:top+114,speed:.27,amplitude:24,opacity:.38});
    liquid=join(5,i=>flow(220,edge+26+i*37,150,['#ffe07b','#e58228'][i%2],i,{stroke:4,amplitude:3,speed:.3,opacity:.55}));
    crown=join(3,i=>ripple(220,y,44+i*12,'#fffbe7',i,{speed:.11}));break;
   case 'summer-wind':
    back=join(3,i=>flow(220,top+80+i*62,300,'#6c9984',i,{stroke:1,amplitude:22,speed:.72,opacity:.24}));
    liquid=join(6,i=>orbit(circle(6+i%3,'#a6bf5c'),220,bottom-40,51,19,i,{speed:.44,opacity:.6}));
    front=particles('leaf',5,'#83aa56',{y:bottom-70,distance:235,spread:132,motion:'leaf',speed:.09,scale:.4,opacity:.55});break;
   case 'needle-blossom':
    liquid=particles('needle',17,'#bc9787',{y:bottom-15,distance:245,spread:55,motion:'rise',speed:.09,opacity:.45});
    crown=join(4,i=>orbit(seed('#fff2df','petal'),220,y-5,70,22,i,{speed:.19,scale:.4}));
    back=ripple(220,top+156,124,'#c99eaa',0,{opacity:.2,speed:.1});break;
   case 'sesame-constellation':
    crown=join(21,i=>orbit(seed('#332b27','sesame'),220,y-9,13+i%5*13,4+i%4*4,i,{speed:.25+i%3*.07,scale:.8}));
    liquid=join(3,i=>flow(220,edge+26+i*44,181,'#655046',i,{stroke:5,amplitude:11,opacity:.35}));break;
   case 'osmanthus-hourglass':
    crown=particles('petal',15,'#e6ae44',{y:y-88,distance:91,spread:63,speed:.15,scale:.30});
    liquid=join(5,i=>pour(161+i*28,edge-12,144,'#e2ad47',i,{stroke:3.2,speed:.2,opacity:.74}));
    back=join(3,i=>orbit(seed('#e4b970','petal'),220,top+80,134,70,i,{speed:.15,scale:.4,opacity:.35}));break;
   case 'chocolate-melt':
    liquid=join(6,i=>pour(157+i*25,edge-3,155-i%3*25,i%2?'#412721':'#c69462',i,{stroke:12-i%3*2,speed:.17,opacity:.7}));
    crown=particles('crystal',10,'#fff0ca',{y:y-35,distance:37,spread:72,speed:.21,scale:.75});break;
   case 'banana-cloud':
    crown=join(8,i=>orbit(circle(5+i%3*3,'#f6e2a5'),220,y-9,12+i%4*19,8+i%3*5,i,{speed:.65,opacity:.7}));
    back=fx('pendulum','<path d="M-67 -20Q0 76 67 -20Q0 111 -67 -20Z" fill="#ddbc65"/>',{x:220,y:top-26,amplitude:7,speed:.62,opacity:.18});
    liquid=join(3,i=>flow(220,edge+30+i*44,179,'#e8bf6d',i,{stroke:6,amplitude:15,speed:.7}));break;
   case 'pistachio-rosette':
    crown=fx('rosette',join(8,i=>`<ellipse cx="0" cy="-23" rx="8" ry="22" transform="rotate(${i*45})" fill="#719143" stroke="#d4dba5" stroke-width="1"/>`),{x:220,y:y+2,speed:.43,opacity:.75,scaleY:.3});
    crown+=particles('crystal',8,'#7d944c',{y:y-50,distance:48,spread:57,speed:.14});
    back=join(2,i=>orbit(leaf('#819960'),220,top+52,138,36,i,{speed:.17,scale:.6,opacity:.4}));break;
   case 'espresso-bloom':
    liquid=join(7,i=>pour(157+i*21,edge-5,193-i%3*32,['#6b432b','#986438','#c69b69'][i%3],i,{stroke:6+i%3*4,speed:.24,opacity:.63}));
    liquid+=join(3,i=>flow(220,edge+60+i*38,155,'#ece7d6',i,{stroke:4,amplitude:19,speed:.37,opacity:.5}));break;
   case 'clear-extraction':
    liquid=join(10,i=>pour(162+i*13,edge,178-i%4*27,'#835231',i,{stroke:.9+i%2,speed:.14,opacity:.55}));
    front=join(4,i=>flow(220,top+50+i*58,134,'#fff9dc',i,{stroke:.8,amplitude:4,speed:.5,opacity:.3}));break;
   case 'coffee-eclipse':
    back=fx('sun',circle(109,'#e2a447'),{x:220,y:top+66,speed:.19,amplitude:10,opacity:.32});
    back+=fx('eclipse',circle(103,'#796246'),{x:220,y:top+66,speed:.28,amplitude:26,opacity:.22});
    liquid=join(4,i=>flow(220,edge+30+i*31,181,'#ddab55',i,{stroke:2,amplitude:3,speed:.24,opacity:.55}));break;
   case 'dirty-cascade':
    liquid=join(4,i=>pour(165+i*36,edge,143,'#68432e',i,{stroke:13-i*1.6,speed:.19,opacity:.74}));
    crown=particles('dust',14,'#73503b',{y:y-25,distance:26,spread:71,speed:.13});
    liquid+=flow(220,bottom-42,184,'#f2e1bb',1,{stroke:10,amplitude:5,speed:.22});break;
   case 'sicilian-peel':
    front=join(3,i=>orbit(seed('#87a14b','needle'),220,top+93,101,28,i,{speed:.51,scale:1.3}));
    liquid=join(5,i=>ripple(220,bottom-30-i*32,72,'#d1a25a',i,{speed:.12,opacity:.5}));
    crown=particles('needle',7,'#748e36',{y:y-24,distance:22,spread:50,speed:.12});break;
   case 'tonic-helix':
    liquid=bubbles(32,'#f5f6ce',{y:bottom-10,distance:heightOf(b)-10,helix:1,spread:46,speed:.22});
    front=join(3,i=>flow(220,top+67+i*83,138,'#dff7bd',i,{stroke:1,amplitude:3,opacity:.35}));break;
   case 'mint-muddle':
    liquid=particles('leaf',10,'#5a923d',{y:bottom-12,distance:heightOf(b)-30,spread:49,motion:'leaf',speed:.17,scale:.54});
    liquid+=bubbles(19,'#edf5ba',{distance:heightOf(b)-10,speed:.28,helix:2,spread:48});
    crown=join(2,i=>orbit(leaf('#8aad52'),220,y-5,72,13,i,{speed:.37,scale:.45}));break;
   case 'orange-turbine':
    back=rays(220,top+145,134,'#ffe089',12,{speed:10,opacity:.19,stroke:4});
    liquid=join(12,i=>orbit(seed('#ffd678','crystal'),220,top+160,47,102,i,{speed:.48,opacity:.62}));
    liquid+=join(3,i=>flow(220,top+85+i*69,143,'#f8c953',i,{stroke:4,amplitude:14,speed:.76}));break;
   case 'five-spirit-braid':
    liquid=join(5,i=>pour(163+i*28,y+26,heightOf(b)-58,['#e9d393','#d5b45e','#b99767','#e5ba71','#b47937'][i],i,{stroke:3.3,speed:.46,opacity:.54}));
    liquid+=bubbles(17,'#f5d398',{y:bottom-13,distance:heightOf(b)-10,speed:.19,spread:53});break;
   case 'fizz-fountain':
    liquid=bubbles(43,'#fcffe5',{y:bottom-10,distance:heightOf(b),speed:.32,spread:61,helix:3});
    crown=join(17,i=>fx('fountain',circle(2+i%3,'#f3f7d7'),{x:220,y:y-3,phase:i*.618,speed:.3,spread:53,distance:33,opacity:.8}));break;
   case 'bitters-spiral':
    liquid=join(3,i=>flow(220,top+72+i*41,182,'#693725',i,{stroke:1.5,amplitude:19,speed:.24,opacity:.6}));
    crown=fx('pendulum','<path d="M-28 -9C-46 -51 41 -55 29 -8S-27 29 -12 4" fill="none" stroke="#d69136" stroke-width="5"/>',{x:278,y:y+2,amplitude:14,speed:.35,opacity:.8});
    back=join(2,i=>ripple(220,bottom-24,125,'#cf936b',i,{speed:.07,opacity:.17}));break;
   case 'amber-monolith':
    liquid=join(5,i=>facet(158+i*30,top+118,85-i%2*29,['#e2b275','#f5d8a7','#805133'][i%3],i,{speed:.16,rise:0,opacity:.32}));
    front=flow(220,top+104,181,'#eec99a',0,{stroke:.65,speed:.16,amplitude:20,opacity:.5});break;
   case 'negroni-trinity':
    back=join(3,i=>fx('turn',`<path d="M-112 0A112 112 0 0 1 56 -97" fill="none" stroke="${['#d98451','#e0ad80','#ac646f'][i]}" stroke-width="2"/>`,{x:220,y:top+111,phase:i*120,speed:7,opacity:.32}));
    liquid=join(3,i=>flow(220,top+64+i*54,186,['#da8455','#952f39','#d7a171'][i],i,{stroke:5,amplitude:17,speed:.47,opacity:.54}));break;
   case 'sour-cloud':
    crown=join(13,i=>orbit(circle(4+i%4*2,'#ffeed0'),220,y-3,13+i%6*14,4+i%3*5,i,{speed:.61,opacity:.6}));
    liquid=join(4,i=>flow(220,edge+15+i*30,188,'#ecc877',i,{stroke:3,amplitude:15,speed:.66}));break;
   case 'citrus-prism':
    back=fx('prism','<path d="M0 -104L116 80H-116Z" fill="none" stroke="#d8ddb3" stroke-width="1.1"/><path d="M0 -87L98 70H-98Z" fill="none" stroke="#e9e5c4" stroke-width=".65"/>',{x:220,y:top+64,speed:.4,opacity:.25});
    liquid=join(4,i=>flow(220,y+16+i*18,232,'#f2f2cd',i,{stroke:1,amplitude:2,speed:.9,opacity:.6}));break;
   case 'vermouth-pendulum':
    back=fx('pendulum','<path d="M-70 -35Q0 89 70 -35" fill="none" stroke="#d79c9e" stroke-width="1"/>',{x:220,y:top+115,amplitude:13,speed:.3,opacity:.32});
    liquid=join(3,i=>flow(220,y+17+i*22,233,['#ead1ad','#955c60','#d5a076'][i],i,{stroke:2,amplitude:7,speed:.25,opacity:.58}));
    front=orbit(circle(2,'#f5ddc7'),220,368,32,37,0,{speed:.32,opacity:.65});break;
  }
  return {back,liquid,front,crown};
 };
 function heightOf(b){return b.bottom-b.liquidTop-10;}
})();
