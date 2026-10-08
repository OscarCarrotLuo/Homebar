/* How each drink is drawn. Cups, layers, ice and garnish follow the generation records
   (生成记录.json, 鸡尾酒生成记录.json); colours are painterly, not recipe quantities.
   L: layers from the bottom [colour, share of height, kind, soft seam]. kind: op opaque, cl clear,
   foam / cheese / cap / froth for toppings that sit on the drink.
   motion: the one thing that moves. Ingredients shown on the page stay in drink-data.js. */
(() => {
 'use strict';
 window.DRINK_RECIPES={
  /* ——— Sweet 01 ——— */
  'lemon-iced-milk':{cup:'slender',L:[['#efe4cc',.82,'op'],['#faf5ea',.18,'foam']],ice:{n:2,a:.2},
   top:[{k:'zest',c:['#6f8f34','#9ab452'],n:16}],motion:{m:'foam'}},
  'sea-salt-matcha':{cup:'tall',L:[['#5f7e37',.82,'op'],['#fbf8f1',.18,'foam']],ice:{n:3,a:.2},
   top:[{k:'powder',c:['#7b9b45','#66873a'],n:46,zone:'side'}],motion:{m:'seep',c:'#f3f1e6',from:1,depth:.34,a:.5}},
  'apple-black-tea':{cup:'tall',L:[['#b5612c',.82,'cl'],['#faf4e6',.18,'foam']],clear:.88,ice:{n:3,a:.36,edge:true},
   garn:[{t:'appleFoam'}],motion:{m:'float',what:'apple'}},
  'matcha-cheese':{cup:'tall',L:[['#55772f',.76,'op'],['#f6edd2',.24,'cheese']],ice:{n:3,a:.18},
   top:[{k:'powder',c:['#6f9240','#5c7e33'],n:60}],motion:{m:'marble',c:'#f5f1e2',lo:.04,hi:.34}},
  'thai-tea-cheese':{cup:'tall',L:[['#cd6a2b',.78,'op'],['#f8ecd0',.22,'cheese']],ice:{n:3,a:.18},
   still:['streaks'],streak:'#f8ecd0',motion:{m:'drip',c:'#f8ecd0',from:.78,len:.3,per:11,w:2.2}},
  /* ——— Sweet 02 ——— */
  'cocoa-coconut':{cup:'step',L:[['#e3e9da',.68,'cl'],['#8a5b3d',.32,'cap']],clear:.7,tint:1,ice:{style:'under',a:.55},
   motion:{m:'drift'}},
  'matcha-coconut':{cup:'step',L:[['#e2eadc',.68,'cl'],['#7d9850',.32,'cap']],clear:.7,tint:1,ice:{style:'under',a:.55},
   motion:{m:'glint'}},
  'blue-jasmine-coconut':{cup:'tall',L:[['#1f67a8',.15,'cl',.12],['#d6ebe8',.65,'cl'],['#fbf8ee',.2,'foam']],clear:.86,ice:{n:3,a:.42,edge:true},
   motion:{m:'gradient'}},
  'sunset-orange':{cup:'tall',L:[['#ec8622',.8,'op'],['#fbf6ec',.2,'foam']],ice:{n:3,a:.26},
   garn:[{t:'halfInside'}],motion:{m:'pulp'}},
  'miyazakis-summer':{cup:'tall',L:[['#bccb6c',.2,'op'],['#8fcbe0',.6,'op'],['#fbfaf4',.2,'foam']],tint:1,ice:{n:3,a:.26},
   still:['crush'],motion:{m:'marble',c:'#f2fafc',lo:.24,hi:.74}},
  'silver-needle-apple':{cup:'tall',L:[['#eec9bf',.9,'op'],['#fbf4ec',.1,'foam']],ice:{n:3,a:.3},
   garn:[{t:'appleRim'}],motion:{m:'drift'}},
  /* ——— Coffee 01 ——— */
  'black-sesame-latte':{cup:'tumbler',L:[['#ece2cf',.48,'op'],['#7a4a2c',.28,'op',.08],['#9d978e',.24,'foam']],ice:{n:2,a:.22},
   top:[{k:'sesame',c:['#1f1b18'],n:6}],garn:[{t:'sesameCrisp'}],motion:{m:'drip',c:'#3b3632',from:.74,len:.42,per:12,w:1.3}},
  'osmanthus-latte':{cup:'mug',L:[['#efe2c4',.48,'op'],['#9a5f31',.27,'op',.06],['#f7ecd2',.25,'foam']],ice:{n:2,a:.2},
   top:[{k:'osmanthus',c:['#e8a332','#f2b84a'],n:7}],headroom:64,motion:{m:'fall'}},
  'chocolate-mocha':{cup:'step',L:[['#4b281b',.1,'op',.06],['#7a4a33',.66,'op'],['#f4ebdc',.24,'foam']],tint:1,ice:{n:2,a:.2},
   top:[{k:'powder',c:['#5a3322','#6c3f2a'],n:70},{k:'salt',c:['#fff'],n:5}],still:['ganache'],motion:{m:'drip',c:'#3f2116',from:.76,len:.5,per:14,w:2.6,n:1}},
  'banana-cappuccino':{cup:'step',L:[['#eed78c',.3,'op',.07],['#c39a6a',.45,'op'],['#f6ecd0',.25,'foam']],ice:{n:2,a:.22},
   top:[{k:'powder',c:['#6e4628'],n:22}],garn:[{t:'bananaFoam'}],motion:{m:'foam'}},
  'pistachio-latte':{cup:'cone',L:[['#d8dba9',1,'foam']],paper:'#d9cfbd',
   top:[{k:'crumb',c:['#7d9a44','#a9c26a','#93ad55'],n:12}],motion:{m:'breath'}},
  /* ——— Coffee 02 ——— */
  'coconut-latte':{cup:'tall',L:[['#f2eee3',.65,'op'],['#8a5a35',.35,'op',.07]],ice:{n:3,a:.42,edge:true},
   motion:{m:'seep',c:'#8a5a35',from:1,depth:.5,a:.5}},
  'coconut-americano':{cup:'tall',L:[['#e6e8dc',.6,'cl'],['#3d2416',.4,'cl']],clear:.85,ice:{n:5,a:.42,edge:true},
   motion:{m:'tendril',c:'#6b3d1f',from:1,depth:.7,a:.6}},
  'sunset-americano':{cup:'step',L:[['#ec8a24',.55,'op'],['#3f2417',.45,'op']],ice:{n:3,a:.34,edge:true},
   garn:[{t:'wheelRim',fruit:'orange',r:12}],motion:{m:'wave'}},
  'moscow':{cup:'step',L:[['#efe7d9',.5,'op'],['#5b3420',.25,'op',.1],['#faf6ee',.25,'foam']],
   top:[{k:'powder',c:['#4a2a1a','#5a3624'],n:150}],motion:{m:'seep',c:'#5b3420',from:1,depth:.45,a:.42,speed:.75}},
  'sicilian-cold-brew':{cup:'step',L:[['#6a3c1d',.9,'cl'],['#e9d99a',.1,'froth']],clear:.9,ice:{n:3,a:.42,edge:true},
   top:[{k:'zest',c:['#6f8f34','#93ad4d'],n:12}],motion:{m:'drift'}},
  /* ——— Cocktail 01 ——— */
  'gin-tonic':{cup:'highball',fill:.93,L:[['#d8e6e0',1,'cl']],clear:.72,bg:'#f2f4f0',ice:{n:4,a:.5,edge:true},
   garn:[{t:'wheelRim',fruit:'lime'}],motion:{m:'bubbles',n:16,rise:6}},
  'mojito':{cup:'highball',L:[['#dfe8cf',1,'cl']],clear:.72,bg:'#f1f4ec',ice:{style:'crushed',a:.42},
   still:['muddle'],garn:[{t:'mint'},{t:'wheelRim',fruit:'lime',r:11}],headroom:34,motion:{m:'float',what:'mint'}},
  'screwdriver':{cup:'highball',L:[['#f09f2a',1,'op']],ice:{n:3,a:.3},
   garn:[{t:'wheelRim',fruit:'orange',half:true,r:14}],motion:{m:'drift'}},
  'long-island':{cup:'highball',L:[['#c88d3a',.6,'cl'],['#874c22',.4,'cl',.22]],clear:.86,ice:{n:4,a:.44,edge:true},
   garn:[{t:'wheelRim',fruit:'lemon'}],motion:{m:'seep',c:'#5e3317',from:1,depth:.42,a:.42}},
  'gin-fizz':{cup:'highball',fill:.86,L:[['#ece8c4',.95,'cl'],['#fbfaf2',.05,'froth']],clear:.8,
   garn:[{t:'twistRim'}],motion:{m:'bubbles',n:22,rise:12}},
  /* ——— Cocktail 02 ——— */
  'old-fashioned':{cup:'rocks',fill:.62,L:[['#b8692a',1,'cl']],clear:.86,ice:{style:'big',a:.46},
   garn:[{t:'peelCurl'},{t:'cherryBeside'}],motion:{m:'drift'}},
  'godfather':{cup:'rocks',fill:.6,L:[['#c08236',1,'cl']],clear:.86,ice:{style:'big',a:.42},
   garn:[{t:'cinnamon'}],motion:{m:'glint'}},
  'negroni':{cup:'rocks',fill:.66,L:[['#c13a2c',1,'cl']],clear:.86,ice:{style:'big',a:.42},
   garn:[{t:'peelOnIce'}],motion:{m:'spring'}},
  'whiskey-sour':{cup:'rocks',fill:.7,L:[['#d8a94e',.88,'op'],['#fbf7ec',.12,'froth']],ice:{n:2,a:.28},bitters:true,
   garn:[{t:'backRim'}],motion:{m:'bitters'}},
  'daiquiri':{cup:'martini',L:[['#eee6c4',1,'op']],
   garn:[{t:'wheelRim',fruit:'lime',r:10}],motion:{m:'condense'}},
  'sweet-martini':{cup:'martini',L:[['#c88a45',1,'cl']],clear:.82,
   garn:[{t:'cherryBottom'}],motion:{m:'bob'}}
 };
})();
