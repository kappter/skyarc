const assert=require('node:assert/strict');
const S=require('./sky-calculations');
const A=require('./astronomy.browser.min');
const locations=[
 {name:'Sydney',lat:-33.87,lon:151.21,z:11},
 {name:'Cape Town',lat:-33.92,lon:18.42,z:2},
 {name:'Buenos Aires',lat:-34.60,lon:-58.38,z:-3},
 {name:'South Pole',lat:-90,lon:0,z:0}
];
const names=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune'];
for(const loc of locations){
 for(const date of ['2026-06-21','2026-11-09','2026-12-21']){
  const s={...loc,date,h:12};
  for(const name of names){
   const body={name},p=S.position(body,s);
   assert(Number.isFinite(p.alt)&&p.alt>=-90&&p.alt<=90,`${loc.name} ${name} altitude`);
   assert(Number.isFinite(p.az)&&p.az>=0&&p.az<360,`${loc.name} ${name} azimuth`);
   const eq=A.Equator(name,S.date(s),new A.Observer(s.lat,s.lon,0),true,true);
   const expected=A.Horizon(S.date(s),new A.Observer(s.lat,s.lon,0),eq.ra,eq.dec);
   assert(Math.abs(p.alt-expected.altitude)<1e-8);
   const d=S.daily(body,s);assert(d.total>=0&&d.total<=24);
   for(const h of [d.rise,d.set])if(h!==null)assert(Math.abs(S.position(body,{...s,h}).alt)<.001);
  }
  // Southern celestial pole has altitude equal to the magnitude of latitude,
  // allowing for precession of the catalog epoch.
  assert(Math.abs(S.fixed(0,-90,s).alt+loc.lat)<.2);
  if(loc.lat>-90){
   for(const point of [{ra:12,dec:-60},{ra:5.5,dec:22}]){
    const p=S.fixed(point.ra,point.dec,s),eq=S.inverse(p.alt,p.az,s);
    assert(Math.abs(eq.ra-point.ra)<1e-8&&Math.abs(eq.dec-point.dec)<1e-8);
   }
   if(date==='2026-12-21')assert(S.daily({name:'Sun'},s).total>12);
   if(date==='2026-06-21')assert(S.daily({name:'Sun'},s).total<12);
  }
 }
 // Compare constellations at exactly the same UTC instant worldwide.
 const s={...loc,date:'2026-11-09',h:7+2/60+loc.z};
 assert.equal(S.constellation({name:'Moon'},s),'Libra');
 console.log(`${loc.name}: nine objects, three dates, horizon events, southern pole, new-moon constellation passed.`);
}
assert.equal(S.daily({name:'Sun'},{...locations[3],date:'2026-12-21',h:12}).total,24);
assert.equal(S.daily({name:'Sun'},{...locations[3],date:'2026-06-21',h:12}).total,0);
// Actual app and report must rotate the chart together: north down, east right.
const fs=require('node:fs'),source=fs.readFileSync(__dirname+'/app.js','utf8');
for(const snippet of ['const face=s.lat<0?-1:1','face=latitude<0?-1:1','Facing north · east right'])assert(source.includes(snippet));
console.log('Southern hemisphere passed, including opposite seasons and South Pole polar day/night.');
