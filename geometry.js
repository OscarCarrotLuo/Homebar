/* Six original, procedural geometry scenes. No images, models, textures or network requests. */
(() => {
 'use strict';
 if(!window.THREE)return;
 const T=window.THREE;
 let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.setClearColor(0,0);renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.className='geometry-canvas';
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-4,4,2.7,-2.7,.1,100);
 camera.position.set(0,.3,12);camera.lookAt(0,0,0);
 scene.add(new T.HemisphereLight(0xffffff,0x645b55,1.1));
 const key=new T.DirectionalLight(0xffffff,2.4);key.position.set(-3,6,7);scene.add(key);
 const edge=new T.DirectionalLight(0xffffff,2);edge.position.set(4,1,-3);scene.add(edge);
 const fill=new T.DirectionalLight(0xffd8a0,.75);fill.position.set(-3,-3,3);scene.add(fill);
 // A procedural light studio provides reflections without external environment images.
 const studio=new T.Scene();studio.background=new T.Color('#c0beb9');
 [[0,6,0,10,2,7],[-6,0,0,2,9,8],[6,1,1,2,5,9],[0,0,7,4,7,1]].forEach(v=>{
  const panel=new T.Mesh(new T.BoxGeometry(v[3],v[4],v[5]),new T.MeshBasicMaterial({color:0xffffff}));panel.position.set(v[0],v[1],v[2]);studio.add(panel);
 });
 const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.025);scene.environment=environment.texture;
 studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});pmrem.dispose();
 const root=new T.Group();scene.add(root);
 const scenes=[];let active=0,elapsed=0,previous=0,frame,paused=document.body.classList.contains('motion-paused'),host;
 let pointer={x:0,y:0},smooth={x:0,y:0},hoverEnergy=0,targetEnergy=0;
 const physical=(color,extra={})=>new T.MeshPhysicalMaterial({color,roughness:.28,metalness:.07,clearcoat:1,clearcoatRoughness:.25,...extra});
 const cream=physical('#fff5d9'),yellow=physical('#ddd231'),jade=physical('#518d78'),orange=physical('#db672d'),brown=physical('#68442d'),silver=physical('#d3ddcd',{metalness:.82,roughness:.21});
 function ball(radius,material){return new T.Mesh(new T.SphereGeometry(radius,40,28),material)}
 function ring(radius,thickness,material){return new T.Mesh(new T.TorusGeometry(radius,thickness,12,120),material)}
 function add(group,mesh,position){if(position)mesh.position.set(...position);group.add(mesh);return mesh}
 function wireSphere(radius,color,meridians=22,latitudes=15){
  const g=new T.Group(),material=new T.LineBasicMaterial({color,transparent:true,opacity:.52});
  for(let j=0;j<meridians;j++){
   const points=[];for(let k=0;k<=100;k++){const a=k/100*Math.PI*2,b=j/meridians*Math.PI;points.push(new T.Vector3(radius*Math.cos(a)*Math.cos(b),radius*Math.sin(a),radius*Math.cos(a)*Math.sin(b)))}
   g.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(points),material));
  }
  for(let j=1;j<latitudes;j++){
   const a=j/latitudes*Math.PI,r=radius*Math.sin(a),y=radius*Math.cos(a),points=[];
   for(let k=0;k<100;k++){const b=k/100*Math.PI*2;points.push(new T.Vector3(r*Math.cos(b),y,r*Math.sin(b)))}
   g.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(points),material));
  }return g;
 }
 // 01 — cream aeration: a lemon-yellow wire sphere surrounded by weightless satellites.
 {
  const g=new T.Group(),core=new T.Group();g.add(core);core.rotation.z=-.35;core.position.x=-.25;
  core.add(ball(1.36,yellow));core.add(wireSphere(1.372,'#fdfbe7'));
  const orbit=add(g,ring(2.13,.013,physical('#7b8171')));orbit.rotation.set(.88,.2,-.4);orbit.scale.y=.76;
  const satellites=[];
  for(let i=0;i<7;i++){const m=ball(.085+(i%3)*.055,i%2?cream:yellow);g.add(m);satellites.push(m)}
  const plates=new T.Group();g.add(plates);
  for(let i=0;i<7;i++){const m=new T.Mesh(new T.BoxGeometry(.49,.045,.49),cream);m.position.set(1.1+i*.07,-1.4+i*.4,-.2);m.rotation.set(.16+i*.06,0,-.37);plates.add(m)}
  scenes.push({group:g,tick:t=>{core.rotation.y=t*.13;core.position.y=Math.sin(t*.65)*.09;plates.rotation.y=Math.sin(t*.35)*.35;plates.children.forEach((m,i)=>m.rotation.y=t*.25+i*.18);satellites.forEach((m,i)=>{const a=t*.2+i*.91;m.position.set(Math.cos(a)*2.05,Math.sin(a)*1.68,Math.sin(a+.7)*.65)})}});
 }
 // 02 — fruit and coconut layers: rippling mint discs, coral orb and translucent cubes.
 {
  const g=new T.Group(),stack=new T.Group();g.add(stack);stack.rotation.set(.28,0,-.3);
  for(let i=0;i<10;i++){
   const r=1.05+Math.sin(i/9*Math.PI)*.22;
   const m=new T.Mesh(new T.CylinderGeometry(r,r,.048,80),i%3===0?jade:cream);m.position.y=(i-4.5)*.29;stack.add(m);
  }
  const orb=add(g,ball(.67,orange),[1.17,.87,.8]);orb.add(wireSphere(.676,'#ffd5a2',12,8));
  const cube=add(g,new T.Mesh(new T.BoxGeometry(.65,.65,.65),physical('#a2c6c6',{transparent:true,opacity:.6,metalness:.15})),[-1.56,-.8,.6]);
  const halo=add(g,ring(2.01,.012,jade));halo.rotation.set(.3,.9,-.4);
  scenes.push({group:g,tick:t=>{stack.rotation.y=t*.17;stack.children.forEach((m,i)=>{m.position.x=Math.sin(t*.85+i*.32)*.19;m.rotation.y=t*.15+i*.22});orb.position.y=.95+Math.sin(t*.7)*.19;cube.rotation.set(t*.19,t*.27,.4);halo.rotation.z=-.4+t*.07}});
 }
 // 03 — coffee and cream: a slow continuous ribbon with roasted concentric orbits.
 {
  const g=new T.Group(),knot=add(g,new T.Mesh(new T.TorusKnotGeometry(1.1,.31,200,32,2,3),physical('#d9b888',{roughness:.32})));knot.rotation.x=.5;
  const dark=add(g,ring(1.9,.035,brown));dark.rotation.set(.7,.3,-.4);
  const thin=add(g,ring(2.1,.008,cream));thin.rotation.set(.4,.5,-.2);
  const moon=add(g,ball(.28,physical('#8b6643')),[1.8,.7,.1]);
  scenes.push({group:g,tick:t=>{knot.rotation.y=t*.15;knot.rotation.z=t*.055;knot.scale.setScalar(1+Math.sin(t*.6)*.028);dark.rotation.z=-.4+t*.1;thin.rotation.x=.4+Math.sin(t*.28)*.3;moon.position.set(Math.cos(t*.22)*1.98,Math.sin(t*.22)*1.4,.3)}});
 }
 // 04 — iced extraction: staggered square sheets, amber gradient and falling beads.
 {
  const g=new T.Group(),tower=new T.Group();g.add(tower);tower.rotation.set(.4,.6,-.35);
  for(let i=0;i<11;i++){
   const color=new T.Color('#f4ecdc').lerp(new T.Color('#944b24'),i/10);
   const m=new T.Mesh(new T.BoxGeometry(1.83,.085,1.83),physical(color));m.position.y=(i-5)*.24;tower.add(m);
  }
  const orb=add(g,ball(.67,orange),[1.15,.9,-.2]);
  const frameMesh=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.25,2.25,2.25)),new T.LineBasicMaterial({color:'#a08767',transparent:true,opacity:.5}));g.add(frameMesh);frameMesh.rotation.set(.3,.5,-.2);
  const beads=[];for(let i=0;i<4;i++)beads.push(add(g,ball(.075,brown),[-1.5,1.5-i,.3]));
  scenes.push({group:g,tick:t=>{tower.rotation.y=.6+t*.1;tower.children.forEach((m,i)=>m.rotation.y=Math.sin(t*.5+i*.21)*.45);orb.position.y=.95+Math.sin(t*.8)*.15;frameMesh.rotation.y=.5-t*.055;beads.forEach((m,i)=>m.position.y=1.8-((t*.32+i*.85)%3.6))}});
 }
 // 05 — carbonation: a lime helix of rising spheres through tilted angular frames.
 {
  const g=new T.Group(),lime=physical('#dfef91'),bubbles=[];
  const geo=new T.BoxGeometry(2.25,2.8,.85),frameGroup=new T.Group();g.add(frameGroup);
  const edges=new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:'#a6caff',transparent:true,opacity:.8}));frameGroup.add(edges);
  frameGroup.rotation.set(.2,.4,.3);
  for(let i=0;i<19;i++){const b=ball(.085+(i%5)*.065,i%4===0?silver:lime);g.add(b);bubbles.push(b)}
  const disc=add(g,ring(1.58,.07,lime));disc.rotation.set(1.07,.25,-.3);
  const extra=add(g,new T.Mesh(new T.OctahedronGeometry(.55),silver),[1.42,-.4,.1]);
  scenes.push({group:g,tick:t=>{bubbles.forEach((b,i)=>{const y=((t*.32+i*.31)%4)-2,a=i*2.4+t*.19;b.position.set(Math.cos(a)*(.85+i%3*.12),y,Math.sin(a)*.83);b.scale.setScalar(.8+Math.sin((y+2)/4*Math.PI)*.35)});frameGroup.rotation.y=.4+t*.06;disc.rotation.z=-.3+t*.07;extra.rotation.set(t*.2,t*.25,.25)}});
 }
 // 06 — stirred classics: radial copper planes and orbiting vermouth-coloured spheres.
 {
  const g=new T.Group(),fan=new T.Group();g.add(fan);fan.rotation.set(.44,-.3,.4);
  const copper=physical('#e4a47d',{metalness:.35,roughness:.28});
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,m=new T.Mesh(new T.BoxGeometry(.56,1.45,.04),i%3===0?cream:copper);m.position.set(Math.cos(a)*1.18,Math.sin(a)*1.18,0);m.rotation.z=a;fan.add(m)}
  const sphere=add(g,ball(.51,physical('#9b324b',{metalness:.28,roughness:.18})),[0,0,.6]);
  const halo=add(g,ring(2.13,.01,copper));halo.rotation.set(.6,.2,-.4);
  const orbit=add(g,ball(.17,copper));
  scenes.push({group:g,tick:t=>{fan.rotation.z=.4+t*.13;fan.children.forEach((m,i)=>m.rotation.y=Math.sin(t*.55+i*.16)*.5);sphere.position.y=Math.sin(t*.5)*.17;orbit.position.set(Math.cos(t*.25)*2.12,Math.sin(t*.25)*1.76,Math.sin(t*.25)*.5);halo.rotation.y=.2+Math.sin(t*.3)*.2}});
 }
 scenes.forEach((s,i)=>{root.add(s.group);s.group.visible=i===0});
 function size(){
  if(!host)return;const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
  renderer.setSize(width,height,false);const ratio=width/height,h=ratio<1.12?2.72/ratio:2.66;
  camera.left=-h*ratio;camera.right=h*ratio;camera.top=h;camera.bottom=-h;camera.updateProjectionMatrix();render();
 }
 function render(){if(!host||document.hidden||document.body.classList.contains('detail-mode'))return;scenes[active].tick(elapsed);root.rotation.set(smooth.y*.16,smooth.x*.28,0);renderer.render(scene,camera)}
 function loop(time){
  frame=undefined;if(paused||document.hidden||document.body.classList.contains('detail-mode'))return;
  const dt=previous?Math.min((time-previous)/1000,.045):0;previous=time;
  hoverEnergy+=(targetEnergy-hoverEnergy)*.04;elapsed+=dt*(1+hoverEnergy*.4);
  smooth.x+=(pointer.x-smooth.x)*.045;smooth.y+=(pointer.y-smooth.y)*.045;
  render();frame=requestAnimationFrame(loop);
 }
 function run(){if(frame)cancelAnimationFrame(frame);frame=undefined;previous=0;render();if(!paused&&!document.hidden&&!document.body.classList.contains('detail-mode'))frame=requestAnimationFrame(loop)}
 const observer=new ResizeObserver(size);
 function activate(index,section){
  if(host){observer.unobserve(host);host.classList.remove('has-webgl')}
  active=index;scenes.forEach((s,i)=>s.group.visible=i===index);
  host=section.querySelector('.geometry');host.append(renderer.domElement);host.classList.add('has-webgl');
  pointer={x:0,y:0};smooth={x:0,y:0};observer.observe(host);size();run();
 }
 window.addEventListener('menu:page',e=>activate(e.detail.index,e.detail.section));
 window.addEventListener('menu:detail',run);
 window.addEventListener('menu:motion',e=>{paused=e.detail.paused;run()});
 window.addEventListener('pointermove',e=>{if(paused||!host)return;const r=host.getBoundingClientRect();pointer.x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));pointer.y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1))},{passive:true});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)pointer={x:0,y:0}});
 document.querySelectorAll('.drink-list li').forEach(li=>{li.addEventListener('pointerenter',()=>targetEnergy=1);li.addEventListener('pointerleave',()=>targetEnergy=0)});
 document.addEventListener('visibilitychange',run);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;if(frame)cancelAnimationFrame(frame);host?.classList.remove('has-webgl')});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{host?.classList.add('has-webgl');paused=document.body.classList.contains('motion-paused');run()});
 const initial=document.querySelector('.menu-page:not([hidden])');if(initial)activate(window.MENU_PAGES.findIndex(p=>p.id===initial.id),initial);
})();
