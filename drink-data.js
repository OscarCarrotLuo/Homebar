/* Main ingredients only. Specialty drinks follow the project's confirmed components;
   unconfirmed additions are a reference composition, never an exact house recipe.
   Layer weights are visual proportions, NOT recipe quantities. */
(() => {
 'use strict';
 const layer=(label,color,weight,ingredients)=>({label,color,weight,ingredients});
 const L=layer;
 const reference='用料参考，可按实际出品调整。';
 const iba=id=>({label:'IBA 配方参考',url:`https://iba-world.com/iba-cocktail/${id}/`});
 const data=[
 {id:'lemon-iced-milk',glass:'tall',flavor:'清新柠香 · 轻盈乳香',ingredients:['鲜牛奶','淡奶油','柠檬糖浆','柠檬皮屑'],layers:[L('冰奶','#f4edd9',.80,[0,2]),L('轻奶盖','#fff9e9',.20,[1])],garnish:'zest',ice:0,note:'柠檬香气来自糖浆与皮屑，保留顺滑奶底。'},
 {id:'sea-salt-matcha',glass:'tall',flavor:'抹茶清苦 · 海盐奶香',ingredients:['抹茶','鲜牛奶','淡奶油','海盐','糖浆'],layers:[L('抹茶奶','#7d9850',.78,[0,1,4]),L('海盐奶盖','#faf0d8',.22,[2,3])],garnish:'matcha',ice:3},
 {id:'apple-black-tea',glass:'tall',flavor:'苹果清甜 · 红茶回甘',ingredients:['苹果汁','红茶','淡奶油','鲜牛奶','糖浆'],layers:[L('苹果红茶','#ce873d',.79,[0,1,4]),L('绵密奶盖','#fff2d8',.21,[2,3])],garnish:'apple',ice:3},
 {id:'matcha-cheese',glass:'tall',flavor:'醇厚茶香 · 咸甜乳酪',ingredients:['抹茶','鲜牛奶','奶油奶酪','淡奶油','海盐','糖浆'],layers:[L('抹茶奶','#65833c',.72,[0,1,5]),L('咸乳酪','#f5e8bc',.28,[2,3,4])],garnish:'matcha',ice:3},
 {id:'thai-tea-cheese',glass:'tall',flavor:'浓郁泰茶 · 咸香乳酪',ingredients:['泰式红茶','炼乳','鲜牛奶','奶油奶酪','淡奶油','海盐'],layers:[L('泰式奶茶','#cf6f31',.74,[0,1,2]),L('咸乳酪','#fbeac3',.26,[3,4,5])],garnish:'tea',ice:3},
 {id:'cocoa-coconut',glass:'waist',flavor:'轻甜椰水 · 浓醇可可',ingredients:['椰子水','可可粉','椰乳','奶油奶酪','淡奶油'],layers:[L('椰子水','#d8e5c8',.73,[0]),L('可可奶盖','#966545',.27,[1,2,3,4])],garnish:'cocoa',ice:1,source:{label:'可可椰子糖 · 用料参考',url:'https://www.nckfhsm.com/products/ke-ke-ye-zi-tang'}},
 {id:'matcha-coconut',glass:'waist',flavor:'清冽椰水 · 青绿茶香',ingredients:['椰子水','抹茶','椰乳','淡奶油'],layers:[L('椰子水','#d4e3ce',.73,[0]),L('抹茶奶盖','#829b57',.27,[1,2,3])],garnish:'matcha',ice:1},
 {id:'blue-jasmine-coconut',glass:'tall',flavor:'茉莉清香 · 冰蓝椰海',ingredients:['蓝色糖浆','椰子水','茉莉花茶','淡奶油'],layers:[L('冰蓝糖浆','#167fbb',.17,[0]),L('茉莉椰水','#b8ded0',.62,[1,2]),L('轻奶盖','#fcf3dc',.21,[3])],garnish:'flower',ice:3},
 {id:'sunset-orange',glass:'tall',flavor:'明亮橙香 · 柔软奶云',ingredients:['橙汁','淡奶油','鲜牛奶'],layers:[L('鲜橙汁','#f0a12a',.78,[0]),L('轻奶盖','#fff1d3',.22,[1,2])],garnish:'orange',ice:3},
 {id:'miyazakis-summer',glass:'tall',flavor:'青提果香 · 蓝色夏日',ingredients:['青提果肉','蓝色糖浆','鲜牛奶','淡奶油'],layers:[L('青提果肉','#a8b951',.22,[0]),L('蓝色牛奶','#78c6d6',.57,[1,2]),L('轻奶盖','#fff4db',.21,[3])],garnish:'grape',ice:3},
 {id:'silver-needle-apple',glass:'tall',flavor:'苹果柔甜 · 茉莉花香',ingredients:['苹果汁','茉莉针王茶','鲜牛奶','淡奶油','糖浆'],layers:[L('苹果茉莉奶茶','#e8b9af',.87,[0,1,2,4]),L('轻乳泡','#faecdb',.13,[3])],garnish:'apple',ice:3},
 {id:'black-sesame-latte',glass:'waist',flavor:'烘焙芝麻 · 醇厚咖啡',ingredients:['浓缩咖啡','鲜牛奶','黑芝麻酱','淡奶油','黑芝麻粒'],layers:[L('鲜奶','#e8dcc2',.48,[1]),L('浓缩咖啡','#865331',.29,[0]),L('芝麻奶盖','#aaa18f',.23,[2,3])],garnish:'sesame',ice:3},
 {id:'osmanthus-latte',glass:'handle',flavor:'金桂花香 · 奶油流沙',ingredients:['浓缩咖啡','鲜牛奶','桂花酱','淡奶油','干桂花'],layers:[L('桂花牛奶','#e7c782',.49,[1,2]),L('浓缩咖啡','#a46a37',.27,[0]),L('桂花奶盖','#f5dfac',.24,[3,4])],garnish:'osmanthus',ice:3},
 {id:'chocolate-mocha',glass:'waist',flavor:'深烘可可 · 微咸回甘',ingredients:['浓缩咖啡','黑巧克力','鲜牛奶','淡奶油','海盐','可可粉'],layers:[L('巧克力牛奶','#8d5439',.49,[1,2]),L('浓缩咖啡','#543528',.27,[0]),L('海盐奶盖','#e9d7b7',.24,[3,4,5])],garnish:'cocoa',ice:3},
 {id:'banana-cappuccino',glass:'waist',flavor:'香蕉绵甜 · 咖啡轻泡',ingredients:['浓缩咖啡','香蕉果泥','鲜牛奶','奶泡','可可粉'],layers:[L('香蕉牛奶','#e4ca83',.48,[1,2]),L('浓缩咖啡','#8d5f36',.28,[0]),L('绵密奶泡','#f7e9bd',.24,[3])],garnish:'cocoa',ice:3},
 {id:'pistachio-latte',glass:'ceramic',flavor:'开心果香 · 丝滑拿铁',ingredients:['浓缩咖啡','鲜牛奶','开心果酱','淡奶油','开心果碎'],layers:[L('开心果奶','#b1b47b',.48,[1,2]),L('浓缩咖啡','#96714a',.27,[0]),L('开心果奶盖','#cbd19a',.25,[3,4])],garnish:'pistachio',ice:0},
 {id:'coconut-latte',glass:'tall',flavor:'浓郁椰乳 · 咖啡醇香',ingredients:['浓缩咖啡','厚椰乳','椰子水'],layers:[L('厚椰乳','#eae5d0',.70,[1,2]),L('浓缩咖啡','#a77b4b',.30,[0])],ice:3},
 {id:'coconut-americano',glass:'tall',flavor:'清冽椰水 · 轻盈咖啡',ingredients:['浓缩咖啡','椰子水'],layers:[L('椰子水','#d6d2af',.66,[1]),L('浓缩咖啡','#8e582e',.34,[0])],ice:3},
 {id:'sunset-americano',glass:'waist',flavor:'橙香明亮 · 咖啡回甘',ingredients:['浓缩咖啡','橙汁'],layers:[L('鲜橙汁','#f4aa32',.64,[1]),L('浓缩咖啡','#814626',.36,[0])],garnish:'orange',ice:3},
 {id:'moscow',glass:'waist',flavor:'冷奶浓缩 · 可可奶油',ingredients:['浓缩咖啡','冰牛奶','淡奶油','巧克力粉'],layers:[L('冰牛奶','#f0e3cd',.54,[1]),L('浓缩咖啡','#744528',.25,[0]),L('可可奶盖','#e9d8b9',.21,[2,3])],garnish:'cocoa',ice:0,note:'以 Dirty 为底，搭配奶油与巧克力粉。'},
 {id:'sicilian-cold-brew',glass:'waist',flavor:'清亮柠香 · 冷萃回甘',ingredients:['冷萃咖啡','柠檬汁','糖浆','柠檬皮屑'],layers:[L('柠檬冷萃','#86512d',.93,[0,1,2]),L('轻盈泡沫','#e7cd81',.07,[0,1])],garnish:'zest',ice:3},
 {id:'gin-tonic',glass:'tall',flavor:'杜松草本 · 清脆气泡',ingredients:['金酒','汤力水','青柠'],layers:[L('金酒 · 汤力','#c5dba6',1,[0,1])],garnish:'lime',ice:4,fizz:true,source:{label:'Tanqueray 配方参考',url:'https://www.tanqueray.com/en-gb/cocktails/gin-and-tonic-tanqueray-london-dry'}},
 {id:'mojito',glass:'tall',flavor:'薄荷清凉 · 青柠气泡',ingredients:['白朗姆酒','青柠汁','薄荷','白砂糖','苏打水'],layers:[L('青柠 · 朗姆','#c6d48d',.83,[0,1,3,4]),L('苏打气泡','#dce8b0',.17,[4])],garnish:'mint',ice:4,fizz:true,source:iba('mojito')},
 {id:'screwdriver',glass:'tall',flavor:'鲜橙饱满 · 清爽直接',ingredients:['伏特加','橙汁','橙片'],layers:[L('伏特加 · 鲜橙','#ec9d28',1,[0,1])],garnish:'orange',ice:4},
 {id:'long-island',glass:'tall',flavor:'柑橘微酸 · 可乐尾韵',ingredients:['伏特加','金酒','白朗姆酒','龙舌兰','橙味利口酒','柠檬汁','糖浆','可乐'],layers:[L('柑橘 · 基酒','#c29b4f',.68,[0,1,2,3,4,5,6]),L('可乐','#80502e',.32,[7])],garnish:'lemon',ice:4,fizz:true,source:iba('long-island-iced-tea')},
 {id:'gin-fizz',glass:'tall',flavor:'明亮柠檬 · 细密气泡',ingredients:['金酒','柠檬汁','糖浆','苏打水'],layers:[L('金酒 · 柠檬','#dbe4b6',.90,[0,1,2,3]),L('绵细泡沫','#eff4d6',.10,[3])],garnish:'lemon',ice:0,fizz:true,source:iba('gin-fizz')},
 {id:'old-fashioned',glass:'rocks',flavor:'橡木暖香 · 柑橘苦甜',ingredients:['波本或黑麦威士忌','方糖','安格仕苦精','水','橙皮','鸡尾酒樱桃'],layers:[L('威士忌 · 苦精','#b06a27',1,[0,1,2,3])],garnish:'twist',ice:1,source:iba('old-fashioned')},
 {id:'godfather',glass:'rocks',flavor:'威士忌醇厚 · 杏仁甜香',ingredients:['威士忌','杏仁利口酒'],layers:[L('威士忌 · 杏仁','#af702f',1,[0,1])],ice:1,source:{label:'Disaronno 配方参考',url:'https://disaronno.com/zh-hans/drinks/godfather/'}},
 {id:'negroni',glass:'rocks',flavor:'草本苦韵 · 红橙回甘',ingredients:['金酒','金巴利','甜红味美思','橙片'],layers:[L('金酒 · 金巴利 · 味美思','#bd4c32',1,[0,1,2])],garnish:'orange',ice:1,source:iba('negroni')},
 {id:'whiskey-sour',glass:'rocks',flavor:'威士忌暖香 · 柠檬酸甜',ingredients:['波本威士忌','柠檬汁','糖浆','巴氏蛋清（可选）','橙皮','鸡尾酒樱桃'],layers:[L('威士忌 · 柠檬','#d2a85b',.83,[0,1,2]),L('轻盈蛋白泡','#f8e4c2',.17,[3])],garnish:'cherry',ice:3,source:iba('whiskey-sour')},
 {id:'daiquiri',glass:'martini',flavor:'朗姆清香 · 青柠明酸',ingredients:['白朗姆酒','青柠汁','细砂糖'],layers:[L('朗姆 · 青柠','#d5dea6',1,[0,1,2])],ice:0,source:iba('daiquiri')},
 {id:'sweet-martini',glass:'martini',flavor:'杜松草本 · 甜润酒香',ingredients:['金酒','甜红味美思','鸡尾酒樱桃'],layers:[L('金酒 · 甜味美思','#bf885f',1,[0,1])],garnish:'cherry',ice:0,source:{label:'Difford’s Guide 配方参考',url:'https://www.diffordsguide.com/cocktails/recipe/2887/sweet-martini'}}
 ];
 const essentials={
  'lemon-iced-milk':['鲜奶','奶油','柠檬糖浆'],
  'sea-salt-matcha':['抹茶','鲜奶','海盐奶盖'],
  'apple-black-tea':['苹果','红茶','奶盖'],
  'matcha-cheese':['抹茶','鲜奶','咸乳酪'],
  'thai-tea-cheese':['泰式红茶','鲜奶','咸乳酪'],
  'cocoa-coconut':['椰子水','可可奶盖'],
  'matcha-coconut':['椰子水','抹茶奶盖'],
  'blue-jasmine-coconut':['椰子水','茉莉茶','蓝色糖浆','奶盖'],
  'sunset-orange':['橙汁','奶盖'],
  'miyazakis-summer':['青提','牛奶','蓝色糖浆','奶盖'],
  'silver-needle-apple':['苹果','茉莉茶','鲜奶'],
  'black-sesame-latte':['咖啡','鲜奶','黑芝麻奶盖'],
  'osmanthus-latte':['咖啡','鲜奶','桂花奶盖'],
  'chocolate-mocha':['咖啡','巧克力','鲜奶','海盐奶盖'],
  'banana-cappuccino':['咖啡','香蕉','鲜奶','奶泡'],
  'pistachio-latte':['咖啡','鲜奶','开心果'],
  'coconut-latte':['咖啡','厚椰乳'],
  'coconut-americano':['咖啡','椰子水'],
  'sunset-americano':['咖啡','橙汁'],
  'moscow':['咖啡','牛奶','奶油','巧克力粉'],
  'sicilian-cold-brew':['冷萃咖啡','柠檬'],
  'gin-tonic':['金酒','汤力水','青柠'],
  'mojito':['朗姆酒','青柠','薄荷','苏打水'],
  'screwdriver':['伏特加','橙汁'],
  'long-island':['伏特加','金酒','朗姆酒','龙舌兰','橙酒','柠檬','可乐'],
  'gin-fizz':['金酒','柠檬','苏打水'],
  'old-fashioned':['威士忌','苦精','糖'],
  'godfather':['威士忌','杏仁利口酒'],
  'negroni':['金酒','金巴利','甜味美思'],
  'whiskey-sour':['威士忌','柠檬','糖','蛋白泡'],
  'daiquiri':['朗姆酒','青柠','糖'],
  'sweet-martini':['金酒','甜味美思']
 };
 const menu=window.MENU_PAGES.flatMap((p,pageIndex)=>p.drinks.map(([name,en],row)=>({name,en,pageIndex,row,pageId:p.id,category:p.category})));
 window.DRINK_DETAILS=data.map((d,i)=>({...menu[i],...d,essentials:essentials[d.id],note:d.note||(!d.source?reference:''),index:i}));
})();
