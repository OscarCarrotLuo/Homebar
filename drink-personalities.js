/* Art direction is authored per drink; shared drawing primitives never choose the recipe. */
(() => {
 'use strict';
 const P=(cn,en,signature,opts={})=>({cn,en,signature,weight:400,tracking:'.04em',enStyle:'normal',enWeight:500,tempo:1,wave:2,sway:.3,ice:2,...opts});
 window.DRINK_PERSONALITIES={
  'lemon-iced-milk':P('ZCOOL KuaiLe','Fraunces','zest-breeze',{wave:1.7,sway:.6}),
  'sea-salt-matcha':P('Noto Serif SC','Cormorant Garamond','salt-whisk',{weight:500,tracking:'.13em',wave:2.4}),
  'apple-black-tea':P('Ma Shan Zheng','Caveat','orchard-current',{wave:2.8,tempo:.9}),
  'matcha-cheese':P('ZCOOL KuaiLe','Fraunces','cream-fold',{wave:1.1,enWeight:700,tempo:.7}),
  'thai-tea-cheese':P('ZCOOL QingKe HuangYou','Bebas Neue','thai-silk',{tracking:'.07em',wave:2.6,sway:.45}),
  'cocoa-coconut':P('Noto Serif SC','Fraunces','cocoa-rain',{weight:700,enWeight:700,wave:1.4,ice:1}),
  'matcha-coconut':P('Ma Shan Zheng','Cormorant Garamond','jade-ripple',{enStyle:'italic',wave:1.7,tempo:.85}),
  'blue-jasmine-coconut':P('ZCOOL QingKe HuangYou','Space Grotesk','glacier-bloom',{tracking:'.07em',wave:.8,ice:.8}),
  'sunset-orange':P('ZCOOL KuaiLe','Fraunces','orange-horizon',{wave:2.4,sway:.55}),
  'miyazakis-summer':P('Ma Shan Zheng','Caveat','summer-wind',{tracking:'.07em',wave:3.5,sway:.65,ice:3}),
  'silver-needle-apple':P('Noto Serif SC','Cormorant Garamond','needle-blossom',{weight:500,tracking:'.15em',enStyle:'italic',wave:1.3,tempo:.8}),
  'black-sesame-latte':P('Noto Serif SC','Fraunces','sesame-constellation',{weight:700,enWeight:700,wave:1.4,sway:.2}),
  'osmanthus-latte':P('Ma Shan Zheng','Cormorant Garamond','osmanthus-hourglass',{tracking:'.09em',wave:1.6,tempo:.9}),
  'chocolate-mocha':P('ZCOOL QingKe HuangYou','Fraunces','chocolate-melt',{enWeight:700,wave:1,tempo:.72}),
  'banana-cappuccino':P('ZCOOL KuaiLe','Caveat','banana-cloud',{wave:3.3,sway:.8,ice:3}),
  'pistachio-latte':P('Noto Serif SC','Fraunces','pistachio-rosette',{weight:500,tracking:'.10em',wave:.7,tempo:.8}),
  'coconut-latte':P('ZCOOL KuaiLe','Fraunces','espresso-bloom',{wave:1.8,sway:.3}),
  'coconut-americano':P('ZCOOL QingKe HuangYou','Space Grotesk','clear-extraction',{tracking:'.12em',wave:1.2,ice:1.5}),
  'sunset-americano':P('ZCOOL QingKe HuangYou','Bebas Neue','coffee-eclipse',{tracking:'.09em',wave:1.7,sway:.2}),
  'moscow':P('Noto Serif SC','Cormorant Garamond','dirty-cascade',{weight:700,tracking:'.18em',wave:.8,tempo:.8}),
  'sicilian-cold-brew':P('Ma Shan Zheng','Cormorant Garamond','sicilian-peel',{enStyle:'italic',wave:1.8,ice:1.3}),
  'gin-tonic':P('ZCOOL QingKe HuangYou','Space Grotesk','tonic-helix',{tracking:'.16em',wave:1.7,tempo:1.15}),
  'mojito':P('Ma Shan Zheng','Caveat','mint-muddle',{wave:3.2,ice:4,sway:.55}),
  'screwdriver':P('ZCOOL KuaiLe','Bebas Neue','orange-turbine',{wave:2.8,tempo:1.1,ice:3}),
  'long-island':P('ZCOOL QingKe HuangYou','Bebas Neue','five-spirit-braid',{tracking:'.11em',wave:2.7,ice:3}),
  'gin-fizz':P('ZCOOL KuaiLe','Space Grotesk','fizz-fountain',{wave:3.1,tempo:1.2,sway:.3}),
  'old-fashioned':P('Noto Serif SC','Cormorant Garamond','bitters-spiral',{weight:700,tracking:'.2em',wave:.7,tempo:.65,ice:.6}),
  'godfather':P('Noto Serif SC','Bebas Neue','amber-monolith',{weight:700,tracking:'.18em',wave:.35,tempo:.6,sway:0,ice:.35}),
  'negroni':P('ZCOOL QingKe HuangYou','Fraunces','negroni-trinity',{tracking:'.1em',enWeight:700,wave:1.5,tempo:.9}),
  'whiskey-sour':P('Noto Serif SC','Fraunces','sour-cloud',{weight:500,wave:2.8,ice:2.5}),
  'daiquiri':P('Ma Shan Zheng','Cormorant Garamond','citrus-prism',{enStyle:'italic',tracking:'.16em',wave:.9,tempo:1.1,sway:.2}),
  'sweet-martini':P('Noto Serif SC','Cormorant Garamond','vermouth-pendulum',{weight:500,enStyle:'italic',tracking:'.15em',wave:.5,tempo:.7,sway:.15})
 };
})();
