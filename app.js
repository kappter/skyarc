
const $=s=>document.getElementById(s),rad=Math.PI/180;let selected=5,playing=null,focusLayer='body-5',layerHistory=[],dropMode=false;const CUSTOM_KEY='skyarc-personal-points-v1';let customTargets=[];try{const saved=JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]');if(Array.isArray(saved))customTargets=saved.filter(t=>t&&typeof t.name==='string'&&Number.isFinite(+t.ra)&&Number.isFinite(+t.dec)&&+t.ra>=0&&+t.ra<24&&+t.dec>=-90&&+t.dec<=90&&typeof t.id==='string').map(t=>({...t,ra:+t.ra,dec:+t.dec,color:/^#[0-9a-f]{6}$/i.test(t.color)?t.color:'#f4a7d5',group:'Personal fixed points'}));}catch(e){customTargets=[]}
const deepObjects=[
 {id:'gc',name:'Milky Way center',group:'Milky Way center',ra:17.76,dec:-29.0,color:'#ffd16a'},
 {id:'m31',name:'Andromeda · M31',group:'Galaxies',ra:.712,dec:41.27,color:'#c9a0ff'},
 {id:'m33',name:'Triangulum · M33',group:'Galaxies',ra:1.564,dec:30.66,color:'#a8c1ff'},
 {id:'lmc',name:'Large Magellanic Cloud',group:'Galaxies',ra:5.39,dec:-69.76,color:'#f08bb1'},
 {id:'smc',name:'Small Magellanic Cloud',group:'Galaxies',ra:.88,dec:-72.8,color:'#d3a1e8'},
 {id:'m81',name:'Bode’s Galaxy · M81',group:'Galaxies',ra:9.93,dec:69.07,color:'#82dfcf'},
 {id:'m82',name:'Cigar Galaxy · M82',group:'Galaxies',ra:9.93,dec:69.68,color:'#e5a27d'},
 {id:'cen-a',name:'Centaurus A',group:'Galaxies',ra:13.42,dec:-43.02,color:'#e8b287'},
 {id:'m101',name:'Pinwheel · M101',group:'Galaxies',ra:14.05,dec:54.35,color:'#ffc878'},
 {id:'m104',name:'Sombrero · M104',group:'Galaxies',ra:12.67,dec:-11.62,color:'#d8c789'},
 {id:'m51',name:'Whirlpool · M51',group:'Galaxies',ra:13.50,dec:47.20,color:'#98b9ff'},
 {id:'m42',name:'Orion Nebula · M42',group:'Nebulae',ra:5.59,dec:-5.45,color:'#72d5ed'},
 {id:'m16',name:'Eagle Nebula · M16',group:'Nebulae',ra:18.31,dec:-13.8,color:'#f0b36d'},
 {id:'m17',name:'Omega Nebula · M17',group:'Nebulae',ra:18.34,dec:-16.18,color:'#ffce83'},
 {id:'m57',name:'Ring Nebula · M57',group:'Nebulae',ra:18.89,dec:33.03,color:'#c0aaff'},
 {id:'m8',name:'Lagoon Nebula · M8',group:'Nebulae',ra:18.06,dec:-24.38,color:'#f28da2'},
 {id:'m1',name:'Crab Nebula · M1',group:'Nebulae',ra:5.58,dec:22.01,color:'#ff9181'},
 {id:'carina',name:'Carina Nebula',group:'Nebulae',ra:10.75,dec:-59.87,color:'#ffd783'},
 {id:'helix',name:'Helix Nebula',group:'Nebulae',ra:22.49,dec:-20.84,color:'#86e0d5'},
 {id:'horsehead',name:'Horsehead Nebula',group:'Nebulae',ra:5.85,dec:-2.45,color:'#b4a0ff'},
 {id:'tarantula',name:'Tarantula Nebula',group:'Nebulae',ra:5.65,dec:-69.1,color:'#f18b9e'}
];
const skyConstellations=[
 {id:'libra',name:'Libra',color:'#a8e0d0',stars:[[14.848,-16.042],[15.283,-9.383],[15.592,-14.789],[15.644,-29.778]],edges:[[0,1],[1,2],[2,0],[2,3]]},
 {id:'orion',name:'Orion',color:'#75d5e9',stars:[[5.92,7.4],[5.42,6.3],[5.53,-.3],[5.60,-1.2],[5.68,-1.9],[5.80,-9.7],[5.24,-8.2],[5.58,-5.4]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[4,6],[2,7]]},
 {id:'ursa',name:'Ursa Major · Big Dipper',color:'#a9c0ff',stars:[[11.06,61.75],[11.03,56.38],[11.90,53.69],[12.26,57.03],[12.90,55.96],[13.40,54.93],[13.79,49.31]],edges:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]},
 {id:'cassiopeia',name:'Cassiopeia',color:'#f2b6d8',stars:[[.15,59.15],[.68,56.5],[.95,60.7],[1.43,60.2],[1.91,63.7]],edges:[[0,1],[1,2],[2,3],[3,4]]},
 {id:'scorpius',name:'Scorpius',color:'#ff927e',stars:[[16.09,-22.62],[16.01,-22.62],[16.49,-26.43],[16.84,-34.29],[16.91,-37.1],[16.90,-42.36],[17.56,-37.1]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
 {id:'leo',name:'Leo',color:'#ffd16a',stars:[[10.14,11.97],[10.33,19.84],[10.14,11.97],[11.24,15.43],[11.82,14.57],[11.24,20.52],[9.88,26.0]],edges:[[0,1],[1,6],[0,2],[2,3],[3,4],[4,5]]},
 {id:'cygnus',name:'Cygnus · Northern Cross',color:'#91d9ff',stars:[[20.69,45.28],[20.37,40.26],[19.51,27.96],[19.75,45.13],[19.94,35.08]],edges:[[0,1],[1,2],[3,1],[1,4]]},
 {id:'lyra',name:'Lyra',color:'#d2aaff',stars:[[18.62,38.78],[18.83,36.9],[18.91,36.9],[18.98,32.69],[18.87,33.36]],edges:[[0,1],[1,2],[2,3],[3,4],[4,0]]},
 {id:'taurus',name:'Taurus',color:'#ffca85',stars:[[5.44,28.61],[4.48,15.96],[4.6,16.51],[4.33,15.63],[3.79,24.11],[4.48,19.18],[3.79,24.11]],edges:[[0,1],[1,2],[2,3],[3,4],[2,5]]},
 {id:'gemini',name:'Gemini',color:'#9ee5bf',stars:[[7.58,31.89],[7.34,21.98],[6.63,16.4],[6.25,22.51],[7.76,28.03],[6.73,25.13]],edges:[[0,1],[1,2],[2,3],[4,5],[5,1]]},
 {id:'canis',name:'Canis Major',color:'#f4a778',stars:[[6.75,-16.72],[6.38,-17.96],[7.14,-26.39],[6.98,-28.97],[6.98,-29.3]],edges:[[0,1],[1,2],[2,3],[3,4]]},
 {id:'sagittarius',name:'Sagittarius',color:'#d6c780',stars:[[18.47,-25.42],[18.92,-26.3],[19.04,-29.88],[18.40,-34.38],[18.35,-29.83],[18.76,-26.99]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,1]]},
 {id:'crux',name:'Crux · Southern Cross',color:'#a3d9ff',stars:[[12.52,-57.11],[12.44,-63.1],[12.25,-58.75],[12.34,-60.4]],edges:[[0,1],[2,1],[1,3]]}
];
function localSidereal(s){return (Astronomy.SiderealTime(SkyCalc.date(s))+s.lon/15+24)%24;}
function horizontal(ra,dec,s){return SkyCalc.fixed(ra,dec,s);}
function buildSkyLayers(){
 const groups=[{name:'Solar system',items:bodies.map((b,i)=>({id:'body-'+i,name:b.name,color:b.color,checked:[0,1,5].includes(i)}))},
 {name:'Constellations',items:skyConstellations.map(c=>({id:'const-'+c.id,name:c.name,color:c.color,checked:c.id==='orion'}))},
 {name:'Milky Way center',items:deepObjects.filter(o=>o.group==='Milky Way center').map(o=>({id:o.id,name:o.name,color:o.color,checked:true}))},
 {name:'Galaxies',items:deepObjects.filter(o=>o.group==='Galaxies').map(o=>({id:o.id,name:o.name,color:o.color,checked:false}))},
 {name:'Nebulae · gas clouds',items:deepObjects.filter(o=>o.group==='Nebulae').map(o=>({id:o.id,name:o.name,color:o.color,checked:false}))}];
 $('layer-groups').innerHTML=groups.map(g=>'<div class="layer-group"><h3>'+g.name+'</h3><div class="layer-items">'+g.items.map(o=>'<label class="layer-item"><input type="checkbox" data-layer="'+o.id+'" '+(o.checked?'checked':'')+'><span class="layer-dot" style="background:'+o.color+'"></span><span>'+o.name+'</span></label>').join('')+'</div></div>').join('');
 layerHistory=Array.from(document.querySelectorAll('[data-layer]:checked')).filter(el=>el.dataset.layer.startsWith('body-')).map(el=>el.dataset.layer);
 focusLayer='body-'+selected;
 document.querySelectorAll('[data-layer]').forEach(el=>el.addEventListener('change',handleSkyLayerChange));
}
function drawSkyMap(){
 const svg=$('skymap'),cx=350,cy=265,R=205,s=state(),lst=localSidereal(s);
 const face=s.lat<0?-1:1,project=(alt,az)=>{const r=R*(1-alt/90),a=az*rad;return [cx-face*r*Math.sin(a),cy-face*r*Math.cos(a)]};
 let out='<rect width="700" height="520" fill="transparent"/>';
 out+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#101c2d" stroke="#60718a" stroke-opacity=".55"/>';
 for(const a of [30,60])out+='<circle class="alt-ring" cx="'+cx+'" cy="'+cy+'" r="'+(R*(1-a/90))+'"/><text class="degree" x="'+(cx+7)+'" y="'+(cy-R*(1-a/90)-4)+'">'+a+'° alt</text>';
 out+='<line class="crosshair" x1="'+cx+'" y1="'+(cy-R)+'" x2="'+cx+'" y2="'+(cy+R)+'"/><line class="crosshair" x1="'+(cx-R)+'" y1="'+cy+'" x2="'+(cx+R)+'" y2="'+cy+'"/>';
 [['N',0],['E',90],['S',180],['W',270]].forEach(([label,az])=>{const [x,y]=project(0,az);out+='<text class="cardinal" text-anchor="middle" x="'+x+'" y="'+(y+(label==='S'?18:label==='N'?-8:4))+'">'+label+'</text>'});
 out+='<circle cx="'+cx+'" cy="'+cy+'" r="3" fill="#fff"/><text class="degree" x="'+(cx+8)+'" y="'+(cy+15)+'">ZENITH</text>';
 let count=0;
 const place=(ra,dec,name,color,kind='object')=>{const pos=horizontal(ra,dec,s,lst);if(pos.alt<0)return null;const [x,y]=project(pos.alt,pos.az);count++;return {x,y,pos,name,color,kind}};
 const visible=[];
 bodies.forEach((b,i)=>{if(!document.querySelector('[data-layer="body-'+i+'"]')?.checked)return;const eq=SkyCalc.equator(b.name,s),p=place(eq.ra,eq.dec,b.name,b.color,'planet');if(p)visible.push(p)});
 deepObjects.forEach(o=>{if(!document.querySelector('[data-layer="'+o.id+'"]')?.checked)return;const p=place(o.ra,o.dec,o.name,o.color,o.group,o.id);if(p)visible.push(p)});
 customTargets.forEach(o=>{const id='custom-'+o.id;if(!document.querySelector('[data-layer="'+id+'"]')?.checked)return;const p=place(o.ra,o.dec,o.name,o.color,o.group,id);if(p)visible.push(p)});
 skyConstellations.forEach(c=>{if(!document.querySelector('[data-layer="const-'+c.id+'"]')?.checked)return;const pts=c.stars.map(([ra,dec])=>place(ra,dec,'',c.color,'star','const-'+c.id));c.edges.forEach(([a,b])=>{if(!pts[a]||!pts[b])return;out+='<line class="constellation-line" x1="'+pts[a].x+'" y1="'+pts[a].y+'" x2="'+pts[b].x+'" y2="'+pts[b].y+'" stroke="'+c.color+'"/>'});pts.forEach(p=>{if(p)visible.push(p)})});
 visible.forEach((p,i)=>{if(p.id===focusLayer)out+='<circle cx="'+p.x+'" cy="'+p.y+'" r="12" fill="none" stroke="#fff" stroke-width="1.5" opacity=".9"/>';const rr=p.kind==='planet'?5:p.kind==='star'?2.6:p.kind==='Galaxies'?4.5:p.kind==='Nebulae'?4.5:6;out+='<circle cx="'+p.x+'" cy="'+p.y+'" r="'+(rr+5)+'" fill="'+p.color+'" opacity=".10"/><circle cx="'+p.x+'" cy="'+p.y+'" r="'+rr+'" fill="'+p.color+'" stroke="#07101b" stroke-width="1.5"/>';if(p.name){const anchor=p.x>cx+90?'end':'start',dx=anchor==='end'?-8:8;out+='<text class="sky-label" text-anchor="'+anchor+'" x="'+(p.x+dx)+'" y="'+(p.y-7-(i%2)*11)+'" fill="'+p.color+'">'+p.name+'</text>'}});
 $('skymap').innerHTML=out;$('map-count').textContent=count+' visible above horizon';$('map-status').textContent=(s.lat<0?'Facing north · east right':'Facing south · east left')+' · LST '+fmt(lst)+' · '+fmt(s.h)+' local';$('skymap').setAttribute('aria-label',s.lat<0?'North-facing sky map; east is on the right':'South-facing sky map; east is on the left');
}

const bodies=[{name:'Sun',color:'#edca8e'},{name:'Moon',color:'#c6d5ea'},{name:'Mercury',color:'#b8c0cc'},{name:'Venus',color:'#f3d28b'},{name:'Mars',color:'#ef927f'},{name:'Jupiter',color:'#dfb38c'},{name:'Saturn',color:'#b7b0df'},{name:'Uranus',color:'#82ded8'},{name:'Neptune',color:'#718af4'}];
function state(){let date=$('date').value||'2026-11-05';let d=new Date(date+'T12:00:00Z');let day=(d-new Date('2026-11-05T12:00:00Z'))/864e5;return {lat:Math.max(-90,Math.min(90,+$('lat').value)),lon:+$('lon').value,z:+$('zone').value,h:+$('slider').value/60,day,date};}
function model(b,s){return SkyCalc.daily(b,s);}
function altitude(h,m,s){return SkyCalc.position(m.body,{...s,h}).alt;}
const fmt=h=>{h=((h%24)+24)%24;let n=Math.round(h*60)%1440;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};const dur=h=>{let n=Math.round(h*60);return `${Math.floor(n/60)}h ${String(n%60).padStart(2,'0')}m`};
function getLayerObject(id){
 if(!id)return null;
 if(id.startsWith('body-'))return bodies[Number(id.slice(5))]||null;
 const deep=deepObjects.find(o=>o.id===id);if(deep)return deep;
 const personal=customTargets.find(o=>'custom-'+o.id===id);if(personal)return personal;
 if(id.startsWith('const-')){
  const c=skyConstellations.find(q=>q.id===id.slice(6));if(!c)return null;
  const si=c.stars.reduce((n,q)=>n+Math.sin(q[0]*Math.PI/12),0),co=c.stars.reduce((n,q)=>n+Math.cos(q[0]*Math.PI/12),0);
  return {name:c.name,color:c.color,ra:(Math.atan2(si,co)*12/Math.PI+24)%24,dec:c.stars.reduce((n,q)=>n+q[1],0)/c.stars.length,group:'Constellations'};
 }
 return null;
}
function modelAtFixedCoordinates(o,s){return SkyCalc.daily(o,s);}

function handleSkyLayerChange(e){
 const id=e.currentTarget.dataset.layer;
 layerHistory=layerHistory.filter(item=>item!==id);
 if(e.currentTarget.checked)layerHistory.push(id);
 focusLayer=e.currentTarget.checked?id:(layerHistory[layerHistory.length-1]||null);
 if(focusLayer&&focusLayer.startsWith('body-'))selected=Number(focusLayer.slice(5));
 render();
}
function renderCustomLayerControls(checkedIds=[]){
 const root=$('custom-layer-items');root.replaceChildren();
 if(!customTargets.length){const empty=document.createElement('span');empty.className='empty-targets';empty.textContent='Your saved stars will appear here.';root.appendChild(empty)}
 customTargets.forEach(t=>{
  const id='custom-'+t.id,row=document.createElement('div');row.className='custom-row';
  const label=document.createElement('label');label.className='personal-target';
  const input=document.createElement('input');input.type='checkbox';input.dataset.layer=id;input.checked=checkedIds.includes(id);input.addEventListener('change',handleSkyLayerChange);
  const dot=document.createElement('span');dot.className='layer-dot';dot.style.background=t.color;
  const name=document.createElement('span');name.textContent=t.name;
  label.append(input,dot,name);
  const remove=document.createElement('button');remove.type='button';remove.className='remove-target';remove.textContent='×';remove.title='Remove '+t.name;remove.setAttribute('aria-label','Remove '+t.name);
  remove.addEventListener('click',()=>{customTargets=customTargets.filter(q=>q.id!==t.id);try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customTargets))}catch(e){}layerHistory=layerHistory.filter(q=>q!==id);if(focusLayer===id){focusLayer=layerHistory[layerHistory.length-1]||null;if(focusLayer&&focusLayer.startsWith('body-'))selected=Number(focusLayer.slice(5))}renderCustomLayerControls();render()});
  row.append(label,remove);root.appendChild(row);
 });
}
function persistCustomTarget(){
 const name=$('target-name').value.trim(),raRaw=Number($('target-ra').value),dec=Number($('target-dec').value),color=$('target-color').value;
 if(!name){$('target-message').textContent='Give this point a name first.';$('target-name').focus();return}
 if(!Number.isFinite(raRaw)||raRaw<0||raRaw>24||!Number.isFinite(dec)||dec< -90||dec>90){$('target-message').textContent='Enter right ascension from 0 to 24 hours and declination from −90° to +90°.';return}
 const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),target={id,name,ra:raRaw%24,dec,color,group:'Personal fixed points'};
 const checked=Array.from(document.querySelectorAll('[data-layer]:checked')).map(el=>el.dataset.layer);
 customTargets.push(target);try{localStorage.setItem(CUSTOM_KEY,JSON.stringify(customTargets))}catch(e){}
 renderCustomLayerControls([...checked,'custom-'+id]);const focus='custom-'+id;layerHistory=layerHistory.filter(q=>q!==focus);layerHistory.push(focus);focusLayer=focus;
 $('target-message').textContent='Saved '+name+' · RA '+target.ra.toFixed(4)+' h · Dec '+(dec>=0?'+':'')+dec.toFixed(4)+'°.';
 render();
}
function horizontalToEquatorial(alt,az,s){return SkyCalc.inverse(alt,az,s);}
function setDropMode(active){
 dropMode=active;$('drop-target').setAttribute('aria-pressed',String(active));
 $('drop-target').textContent=active?'Tap the sky map to place your point':'◎ Drop point on map';
 $('skymap').style.cursor=active?'crosshair':'';
 $('target-message').textContent=active?'Tap a point above the horizon. Its current direction will be saved as fixed sky coordinates.':'Enter coordinates from a star chart or certificate, or drop a point on the horizon map.';
}
function handleSkyMapDrop(e){
 if(!dropMode)return;
 const svg=$('skymap'),rect=svg.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width*700,py=(e.clientY-rect.top)/rect.height*520,cx=350,cy=265,R=205,dx=px-cx,dy=py-cy,r=Math.hypot(dx,dy),ss=state(),face=ss.lat<0?-1:1;
 if(r>R){$('target-message').textContent='Choose a point inside the horizon circle.';return}
 const alt=90*(1-r/R),az=((Math.atan2(face*(cx-px),face*(cy-py))/rad)%360+360)%360,eq=horizontalToEquatorial(alt,az,ss);
 $('target-ra').value=eq.ra.toFixed(4);$('target-dec').value=eq.dec.toFixed(4);
 if(!$('target-name').value.trim())$('target-name').value='My fixed sky point';
 setDropMode(false);
 $('target-message').textContent='Point captured · RA '+eq.ra.toFixed(4)+' h · Dec '+(eq.dec>=0?'+':'')+eq.dec.toFixed(4)+'°. Give it a name and save.';
}

function reportTargets(){
 const ids=Array.from(document.querySelectorAll('[data-layer]:checked')).map(el=>el.dataset.layer);
 if(!ids.length&&focusLayer)ids.push(focusLayer);
 return ids.map(id=>{
  if(id.startsWith('body-')){const item=bodies[Number(id.slice(5))];return item?{id,name:item.name,color:item.color,kind:'body',item}:null}
  const deep=deepObjects.find(o=>o.id===id);if(deep)return {id,name:deep.name,color:deep.color,kind:'fixed',ra:deep.ra,dec:deep.dec};
  const personal=customTargets.find(o=>'custom-'+o.id===id);if(personal)return {id,name:personal.name,color:personal.color,kind:'fixed',ra:personal.ra,dec:personal.dec};
  if(id.startsWith('const-')){const c=skyConstellations.find(q=>'const-'+q.id===id);if(c){const si=c.stars.reduce((n,q)=>n+Math.sin(q[0]*Math.PI/12),0),co=c.stars.reduce((n,q)=>n+Math.cos(q[0]*Math.PI/12),0);return {id,name:c.name,color:c.color,kind:'fixed',ra:(Math.atan2(si,co)*12/Math.PI+24)%24,dec:c.stars.reduce((n,q)=>n+q[1],0)/c.stars.length}}}
  return null;
 }).filter(Boolean);
}
function reportStateAt(base,offset){
 const stamp=Date.parse(base.date+'T00:00:00Z')+(base.h+offset)*3600000,d=new Date(stamp),date=d.toISOString().slice(0,10);
 return {...base,date,h:d.getUTCHours()+d.getUTCMinutes()/60+d.getUTCSeconds()/3600,day:(Date.parse(date+'T12:00:00Z')-Date.parse('2026-11-05T12:00:00Z'))/864e5};
}
function reportPosition(target,s){
 if(target.kind==='body')return SkyCalc.position(target.item,s);
 return horizontal(target.ra,target.dec,s);
}
function escapeReport(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function reportCoordinate(p){return p.alt.toFixed(1)+'° alt · '+p.az.toFixed(1)+'° az'}
function reportMapSvg(targets,series,durationMode,latitude){
 const cx=350,cy=245,R=190,face=latitude<0?-1:1,project=p=>[cx-face*R*(1-p.alt/90)*Math.sin(p.az*rad),cy-face*R*(1-p.alt/90)*Math.cos(p.az*rad)];
 let svg='<svg viewBox="0 0 700 470" role="img" aria-label="SkyArc report sky map"><rect width="700" height="470" fill="#f5f8fb"/><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="#fff" stroke="#65768a" stroke-width="1.5"/>';
 [30,60].forEach(a=>{svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R*(1-a/90))+'" fill="none" stroke="#bdc8d5" stroke-dasharray="3 5"/><text x="'+(cx+6)+'" y="'+(cy-R*(1-a/90)-4)+'" fill="#68788a" font-size="10">'+a+'°</text>'});
 [['N',0],['E',90],['S',180],['W',270]].forEach(([n,az])=>{const [x,y]=project({alt:0,az});svg+='<text x="'+x+'" y="'+(y+(n==='S'?17:n==='N'?-7:4))+'" text-anchor="middle" fill="#40546b" font-size="12">'+n+'</text>'});
 svg+='<text x="'+(cx+8)+'" y="'+(cy+13)+'" fill="#68788a" font-size="9">ZENITH</text>';
 targets.forEach((t,i)=>{
  const points=series[i].points,color=t.color;
  if(durationMode){
   let segment=[];
   const flush=()=>{if(segment.length>1)svg+='<polyline points="'+segment.join(' ')+'" fill="none" stroke="'+color+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';segment=[]};
   points.forEach(p=>{if(p.pos.alt<0){flush();return}const [x,y]=project(p.pos);segment.push(x.toFixed(1)+','+y.toFixed(1))});flush();
  }
  const first=points[0],last=points[points.length-1];
  [first,last].forEach((pt,j)=>{if(pt&&pt.pos.alt>=0){const [x,y]=project(pt.pos);svg+='<circle cx="'+x+'" cy="'+y+'" r="'+(j===0?5:4)+'" fill="'+color+'" stroke="#fff" stroke-width="1.6"><title>'+escapeReport(t.name)+' · '+(j===0?'start':'end')+'</title></circle>'}});
  const labelPoint=last&&last.pos.alt>=0?last:first;
  if(labelPoint&&labelPoint.pos.alt>=0){const [x,y]=project(labelPoint.pos);svg+='<text x="'+(x+7)+'" y="'+(y-6-(i%2)*11)+'" fill="'+color+'" font-size="10" stroke="#fff" stroke-width="2.5" paint-order="stroke">'+escapeReport(t.name)+'</text>'}
 });
 return svg+'</svg>';
}
function reportAltitudeSvg(targets,series,base,durationMode,hours){
 const W=900,H=420,L=48,R=16,T=18,B=40,pw=W-L-R,ph=H-T-B,x=f=>L+f*pw,y=a=>T+(90-Math.max(-5,Math.min(90,a)))/95*ph;
 let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Selected objects altitude over time"><rect width="'+W+'" height="'+H+'" fill="#f5f8fb"/>';
 [0,30,60,90].forEach(a=>{const yy=y(a);svg+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="#cbd3dc" stroke-dasharray="'+(a?'3 4':'')+'"/><text x="'+(L-8)+'" y="'+(yy+4)+'" text-anchor="end" fill="#536173" font-size="11">'+a+'°</text>'});
 targets.forEach((target,i)=>{let points=[];if(durationMode)points=series[i].points;else for(let n=0;n<=144;n++){const h=n/6,ss=reportStateAt(base,h-base.h);points.push({state:ss,pos:reportPosition(target,ss)})}let d='';points.forEach((pt,j)=>{d+=(j?'L':'M')+x(durationMode?j/Math.max(1,points.length-1):j/144).toFixed(1)+','+y(pt.pos.alt).toFixed(1)+' '});svg+='<path d="'+d+'" fill="none" stroke="'+target.color+'" stroke-width="'+(target.id===focusLayer?'3':'2')+'" stroke-linecap="round" stroke-linejoin="round"/>'});
 if(durationMode)svg+='<text x="'+L+'" y="'+(H-12)+'" fill="#536173" font-size="11">START · '+fmt(base.h)+'</text><text x="'+(W-R)+'" y="'+(H-12)+'" text-anchor="end" fill="#536173" font-size="11">END · '+hours+' h later</text>';
 else{[0,6,12,18,24].forEach(h=>svg+='<text x="'+x(h/24)+'" y="'+(H-12)+'" text-anchor="middle" fill="#536173" font-size="11">'+(h===24?'24:00':fmt(h))+'</text>');const nx=x(base.h/24);svg+='<line x1="'+nx+'" x2="'+nx+'" y1="'+T+'" y2="'+(H-B+3)+'" stroke="#17263a" stroke-width="1.5" stroke-dasharray="4 4"/><text x="'+Math.min(W-R-4,nx+4)+'" y="'+(T+12)+'" fill="#17263a" font-size="10">NOW</text>'}
 return svg+'</svg>';
}
function preparePrintReport(){
 const mode=$('report-mode').value,durationMode=mode==='duration',hours=durationMode?Number($('report-hours').value):0,base=state();
 if(durationMode&&(!Number.isFinite(hours)||hours<.25||hours>168)){$('report-hours').focus();alert('Choose a duration from 0.25 to 168 hours (7 days).');return}
 const targets=reportTargets();if(!targets.length){alert('Check at least one sky layer before making the report.');return}
 const samplesCount=durationMode?Math.max(1,Math.ceil(hours/Math.max(1/6,hours/360))):0;
 const series=targets.map(target=>{
  const points=[],count=durationMode?samplesCount:0,step=count?hours/count:0;
  for(let i=0;i<=count;i++){const ss=reportStateAt(base,durationMode?i*step:0);points.push({state:ss,pos:reportPosition(target,ss)})}
  let max=points[0],above=0,track=0;
  for(let i=1;i<points.length;i++){
   const prev=points[i-1],cur=points[i],dt=cur.state.h-prev.state.h+(Date.parse(cur.state.date+'T00:00:00Z')-Date.parse(prev.state.date+'T00:00:00Z'))/3600000;
   if(durationMode){if(prev.pos.alt>=0&&cur.pos.alt>=0)above+=dt;else if((prev.pos.alt>=0)!==(cur.pos.alt>=0))above+=dt*Math.abs(prev.pos.alt)/(Math.abs(prev.pos.alt)+Math.abs(cur.pos.alt)||1)}
   if(cur.pos.alt>max.pos.alt)max=cur;
   const a1=prev.pos.alt*rad,a2=cur.pos.alt*rad,dAz=(cur.pos.az-prev.pos.az)*rad,cos=Math.sin(a1)*Math.sin(a2)+Math.cos(a1)*Math.cos(a2)*Math.cos(dAz);
   track+=Math.acos(Math.max(-1,Math.min(1,cos)))/rad;
  }
  return {points,max,above,track};
 });
 const start=reportStateAt(base,0),end=reportStateAt(base,durationMode?hours:0),dateLabel=new Date(start.date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'UTC'});
 const loc=$('place').selectedOptions[0]?.textContent||'Custom location',offset='UTC'+(base.z>=0?'+':'')+base.z;
 const timeLabel=durationMode?fmt(start.h)+'–'+fmt(end.h)+' · '+hours+' hours':fmt(start.h)+' · selected moment',facing=base.lat<0?'north':'south',eastSide=base.lat<0?'right':'left';
 let rows=targets.map((t,i)=>{
  const q=series[i],first=q.points[0].pos,last=q.points[q.points.length-1].pos,peak=q.max;
  return '<tr><td><span class="report-color" style="background:'+t.color+'"></span>'+escapeReport(t.name)+(t.kind==='fixed'?'<br><small>RA '+t.ra.toFixed(3)+' h · Dec '+(t.dec>=0?'+':'')+t.dec.toFixed(2)+'°</small>':'')+'</td><td>'+reportCoordinate(first)+'</td><td>'+peak.pos.alt.toFixed(1)+'° · '+fmt(peak.state.h)+'</td><td>'+reportCoordinate(last)+'</td><td>'+(durationMode?dur(q.above):first.alt>=0?'Above at this moment':'Below at this moment')+'</td><td>'+(durationMode?q.track.toFixed(1)+'°':'—')+'</td></tr>'
 }).join('');
 $('printable-report').innerHTML='<header class="report-head"><div><div class="report-kicker">SkyArc · Daily briefing reverse</div><h1>Sky report</h1><div>'+escapeReport(loc)+' · '+base.lat.toFixed(2)+'°, '+base.lon.toFixed(2)+'°</div></div><div class="report-meta"><strong>'+escapeReport(dateLabel)+'</strong><br>'+escapeReport(timeLabel)+'<br>'+escapeReport(offset)+'</div></header><div class="report-visual"><div class="report-chart-block"><h2>Altitude through time</h2>'+reportAltitudeSvg(targets,series,base,durationMode,hours)+'<div class="report-summary">'+(durationMode?'Colored lines show altitude across the selected interval.':'Colored lines show each object’s daily arc; the marker shows the selected moment.')+'</div></div><div class="report-chart-block"><h2>Horizon map · facing '+facing+'</h2>'+reportMapSvg(targets,series,durationMode,base.lat)+'<div class="report-summary">'+(durationMode?'Colored trails show each selected point’s apparent path while above the horizon.':'Colored dots show selected positions at this moment.')+' Facing '+facing+'; east is on the '+eastSide+'.</div></div></div><div class="report-summary"><h2>Reading this sky</h2><p>Start: '+escapeReport(start.date)+' at '+fmt(start.h)+' local.</p><p>End: '+escapeReport(end.date)+' at '+fmt(end.h)+' local.</p><p>'+targets.length+' selected layer'+(targets.length===1?'':'s')+'. Dark-sky visibility is not calculated in this prototype.</p><p>For fixed stars and galaxies, the track is apparent motion caused by Earth’s rotation; the target is treated as fixed.</p></div></div><h2>Selected objects</h2><table><thead><tr><th>Object</th><th>Start</th><th>Highest point</th><th>End</th><th>Above horizon</th><th>Sky track</th></tr></thead><tbody>'+rows+'</tbody></table><div class="report-foot">SkyArc is an educational model. Solar-system positions use Astronomy Engine; fixed-point targets use J2000 RA/Dec. UTC offset is manual. Rise/set use the geometric center without refraction. Altitude and azimuth describe direction in the local sky, not physical distance traveled. Report sampling is approximate.</div>';
 window.print();
}
function render(){let s=state(),b=getLayerObject(focusLayer)||bodies[selected],m=(focusLayer&&!focusLayer.startsWith('body-'))?modelAtFixedCoordinates(b,s):model(b,s),sun=model(bodies[0],s),a=altitude(s.h,m,s);$('clock').textContent=fmt(s.h);$('tz').textContent=`UTC${s.z>=0?'+':''}${s.z}`;$('selected').textContent=b.name;$('skytitle').textContent=b.name+'’s daily arc';const orb=$('orb');orb.dataset.orb=b.group==='Galaxies'||b.group==='Milky Way center'?'galaxy':b.group==='Nebulae'?'nebula':b.group==='Constellations'?'constellation':b.group==='Personal fixed points'?'custom':b.name.toLowerCase();orb.style.boxShadow='0 0 32px '+(b.color||'#edca8e')+'66';orb.style.background=b.group==='Personal fixed points'?'radial-gradient(circle at 30% 28%,#fff 0 6%,'+b.color+' 27%,#0a1220 80%)':'';$('status').textContent=(a>=0?'Above your horizon':'Below your horizon')+' · '+SkyCalc.constellation(b,s);$('alt').textContent=a.toFixed(1)+'°';$('total').textContent=m.total===24?'24h':dur(m.total);let delta=((m.tr-s.h)%24+24)%24;$('countdown').textContent=dur(delta);$('until').textContent='until next highest point';$('rise').textContent=m.total===24?'Always above':m.total===0?'Does not rise':(m.rise===null?'No rise today':fmt(m.rise));$('set').textContent=m.total===24?'Does not set':m.total===0?'Always below':(m.set===null?'No set today':fmt(m.set));$('transit').textContent=fmt(m.tr);$('journey').textContent=m.total===24?'Above the horizon throughout this modeled day. A long northern journey.':m.total===0?'This object stays below your horizon throughout this modeled day.':`Highest altitude: ${altitude(m.tr,m,s).toFixed(1)}°. Rise/set use the geometric center at the horizon; atmospheric refraction is excluded.`;
if(b.group==='Personal fixed points')$('journey').textContent+=' Fixed sky coordinates · RA '+b.ra.toFixed(4)+' h · Dec '+(b.dec>=0?'+':'')+b.dec.toFixed(2)+'°.';
let x=h=>60+h/24*790,y=a=>285-a/90*220;let svg=`<defs><linearGradient id="fade" x2="0" y2="1"><stop stop-color="${b.color}" stop-opacity=".20"/><stop offset="1" stop-color="${b.color}" stop-opacity="0"/></linearGradient></defs>`;
for(let i=0;i<72;i++){let h=i/3,sa=altitude(h,sun,s);if($('daylight').checked&&sa>-18)svg+=`<rect x="${x(h)}" y="35" width="11.1" height="250" fill="${sa>0?'#edca8e':'#9e96d7'}" opacity="${sa>0?.055:.03}"/>`;}
for(let a of [0,30,60,90])svg+=`<line x1="60" x2="850" y1="${y(a)}" y2="${y(a)}" stroke="#29374b" ${a?'stroke-dasharray="3 6"':''}/><text x="24" y="${y(a)+4}" fill="#7e91ab" font-size="11">${a}°</text>`;
for(let i=0;i<55;i++){let xx=65+((i*157)%780),yy=43+((i*73)%225);svg+=`<circle cx="${xx}" cy="${yy}" r="${i%4===0?1.3:.65}" fill="#dce8ff" opacity=".35"/>`;}
function path(mm){let points=[];for(let i=0;i<=240;i++)points.push((i?'L':'M')+x(i/10).toFixed(1)+','+y(Math.max(-4,altitude(i/10,mm,s))).toFixed(1));return points.join(' ')}
let p=path(m);
svg+='<path d="'+p+' L850,300 L60,300 Z" fill="url(#fade)"/><path d="'+path(sun)+'" fill="none" stroke="#edca8e" opacity=".45" stroke-dasharray="5 7"/>';
const sunAlt=altitude(s.h,sun,s);
svg+='<circle cx="'+x(s.h)+'" cy="'+y(Math.max(-4,sunAlt))+'" r="4" fill="#edca8e" stroke="#0a1220" stroke-width="1.5"><title>Sun at '+sunAlt.toFixed(1)+'° altitude</title></circle>';
let overlayCount=0;
function overlayArc(name,color,altAt){
 let d='';for(let i=0;i<=240;i++){const hh=i/10,aa=altAt(hh);d+=(i?'L':'M')+x(hh).toFixed(1)+','+y(Math.max(-4,aa)).toFixed(1)+' ';}
 svg+='<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="5 5" opacity=".78"><title>'+name+' daily altitude arc</title></path>';
 const ca=altAt(s.h),trackerY=y(Math.max(-4,ca));
 svg+='<circle cx="'+x(s.h)+'" cy="'+trackerY+'" r="4" fill="'+color+'" stroke="#0a1220" stroke-width="1.5"><title>'+name+' at '+ca.toFixed(1)+'° altitude</title></circle>';
 if(ca>=0)svg+='<text x="'+Math.min(820,x(s.h)+7)+'" y="'+(trackerY-6)+'" fill="'+color+'" font-size="10">'+name+'</text>';
 overlayCount++;
}
bodies.forEach((bb,i)=>{const layer=document.querySelector('[data-layer="body-'+i+'"]');if(!layer||!layer.checked||focusLayer==='body-'+i||(!focusLayer&&i===selected)||i===0)return;const mm=model(bb,s);overlayArc(bb.name,bb.color,hh=>altitude(hh,mm,s));});
const lstNow=localSidereal(s);
function fixedArc(ra,dec,name,color){overlayArc(name,color,hh=>{return horizontal(ra,dec,{...s,h:hh}).alt;});}
deepObjects.forEach(o=>{const layer=document.querySelector('[data-layer="'+o.id+'"]');if(layer&&layer.checked&&focusLayer!==o.id)fixedArc(o.ra,o.dec,o.name,o.color);});
customTargets.forEach(o=>{const id='custom-'+o.id,layer=document.querySelector('[data-layer="'+id+'"]');if(layer&&layer.checked&&focusLayer!==id)fixedArc(o.ra,o.dec,o.name,o.color);});
skyConstellations.forEach(c=>{const layer=document.querySelector('[data-layer="const-'+c.id+'"]');if(!layer||!layer.checked||focusLayer==='const-'+c.id)return;const si=c.stars.reduce((n,q)=>n+Math.sin(q[0]*Math.PI/12),0),co=c.stars.reduce((n,q)=>n+Math.cos(q[0]*Math.PI/12),0),ra=(Math.atan2(si,co)*12/Math.PI+24)%24,dec=c.stars.reduce((n,q)=>n+q[1],0)/c.stars.length;fixedArc(ra,dec,c.name,c.color);});
svg+='<path d="'+p+'" fill="none" stroke="'+b.color+'" stroke-width="2.8"/><line x1="'+x(s.h)+'" x2="'+x(s.h)+'" y1="35" y2="298" stroke="#b6c5da" stroke-dasharray="3 5" opacity=".4"/>';
if(overlayCount)svg+='<text x="72" y="50" fill="#aab9ce" font-size="10" letter-spacing="1">CHECKED LAYER ARCS · DASHED</text>';
if(a>=0)svg+='<circle cx="'+x(s.h)+'" cy="'+y(a)+'" r="18" fill="'+b.color+'" opacity=".09"/><circle cx="'+x(s.h)+'" cy="'+y(a)+'" r="6" fill="'+b.color+'"/><text x="'+Math.min(780,Math.max(70,x(s.h)+15))+'" y="'+(y(a)-13)+'" fill="'+b.color+'" font-size="13">'+b.name+' · '+a.toFixed(0)+'°</text>';
else svg+='<circle cx="'+x(s.h)+'" cy="'+y(Math.max(-4,a))+'" r="4" fill="'+b.color+'" stroke="#0a1220" stroke-width="1.5"><title>'+b.name+' below horizon · '+a.toFixed(1)+'°</title></circle>';
for(let h of [0,6,12,18,24])svg+=`<text x="${x(h)}" y="325" text-anchor="middle" fill="#8b9db5" font-size="11">${h===24?'24:00':fmt(h)}</text>`;$('sky').innerHTML=svg;
$('rows').innerHTML=bodies.map((bb,j)=>{let mm=model(bb,s),bands='';for(let i=0;i<144;i++){let h=i/6;if(altitude(h,mm,s)>=0)bands+=`<span class="band" style="left:${i/144*100}%;width:.8%;background:${bb.color}"></span>`;if($('daylight').checked&&altitude(h,sun,s)>0)bands+=`<span style="position:absolute;inset:0 auto 0 ${i/144*100}%;width:.75%;background:#edca8e0c"></span>`;}return `<div class="row"><button data-body="${j}" class="${(focusLayer==='body-'+j||(!focusLayer&&j===selected))?'active':''}" style="color:${bb.color}">● ${bb.name}</button><div class="track">${bands}<span class="diamond" style="left:${mm.tr/24*100}%;background:${bb.color}"></span><span class="marker" style="left:${s.h/24*100}%"></span></div><span class="duration">${mm.total===24?'All day':mm.total===0?'Below all day':dur(mm.total)}</span></div>`}).join('');document.querySelectorAll('[data-body]').forEach(el=>el.onclick=()=>{
 selected=+el.dataset.body;focusLayer='body-'+selected;
 const layer=document.querySelector('[data-layer="'+focusLayer+'"]');if(layer&&!layer.checked)layer.checked=true;
 layerHistory=layerHistory.filter(item=>item!==focusLayer);layerHistory.push(focusLayer);render()
});drawSkyMap();}
['lat','lon','zone','date','slider','daylight'].forEach(id=>$(id).addEventListener('input',render));$('place').onchange=()=>{if($('place').value==='custom')return;let [a,b,c]=$('place').value.split(',');$('lat').value=a;$('lon').value=b;$('zone').value=c;render()};function shift(n){let d=new Date(state().date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);$('date').value=d.toISOString().slice(0,10);render()}$('prev').onclick=()=>shift(-1);$('next').onclick=()=>shift(1);$('play').onclick=()=>{if(playing){clearInterval(playing);playing=null;$('play').textContent='▶'}else{$('play').textContent='Ⅱ';playing=setInterval(()=>{let v=+$('slider').value+5;if(v>=1440)shift(1);$('slider').value=v%1440;render()},120)}};$('now').onclick=()=>{let d=new Date(Date.now()+state().z*36e5);$('date').value=d.toISOString().slice(0,10);$('slider').value=d.getUTCHours()*60+d.getUTCMinutes();render()};$('geo').onclick=()=>{if(!navigator.geolocation)return alert('Geolocation is unavailable. Enter coordinates instead.');navigator.geolocation.getCurrentPosition(p=>{$('lat').value=p.coords.latitude.toFixed(2);$('lon').value=p.coords.longitude.toFixed(2);$('zone').value=-new Date().getTimezoneOffset()/60;$('place').value='custom';render()},()=>alert('Location unavailable. Enter your coordinates instead.'))};buildSkyLayers();renderCustomLayerControls();$('drop-target').addEventListener('click',()=>setDropMode(!dropMode));$('skymap').addEventListener('click',handleSkyMapDrop);$('save-target').addEventListener('click',persistCustomTarget);$('report-mode').addEventListener('change',()=>{$('report-hours').disabled=$('report-mode').value!=='duration'});$('report-hours').disabled=true;$('print-report').addEventListener('click',preparePrintReport);render();
