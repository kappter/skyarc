const assert=require('node:assert/strict');
const S=require('./sky-calculations');
const A=require('./astronomy.browser.min');
const s={date:'2026-11-09',h:2/60,z:-7,lat:40.76,lon:-111.89};
const moon={name:'Moon'},sun={name:'Sun'};
assert.equal(S.date(s).toISOString(),'2026-11-09T07:02:00.000Z');
assert.equal(S.constellation(moon,s),'Libra');
const eq=S.equator('Moon',s);
assert(Math.abs(eq.ra-(14+46/60+33/3600))<.1);
assert(A.AngleBetween(A.GeoVector('Moon',S.date(s),true),A.GeoVector('Sun',S.date(s),true))<6);
for(const name of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune']){
 const p=S.position({name},s);assert(Number.isFinite(p.alt)&&Number.isFinite(p.az));
 const ofdate=A.Equator(name,S.date(s),new A.Observer(s.lat,s.lon,0),true,true);
 const expected=A.Horizon(S.date(s),new A.Observer(s.lat,s.lon,0),ofdate.ra,ofdate.dec);
 assert(Math.abs(p.alt-expected.altitude)<1e-8);
 const daily=S.daily({name},s);assert(daily.total>=0&&daily.total<=24);
 for(const h of [daily.rise,daily.set])if(h!==null)assert(Math.abs(S.position({name},{...s,h}).alt)<.001);
}
const later=S.equator('Moon',{...s,date:'2026-11-10'});assert(Math.abs(later.ra-eq.ra)>.5);
const point={ra:5.5,dec:22},h=S.fixed(point.ra,point.dec,s),round=S.inverse(h.alt,h.az,s);
assert(Math.abs(round.ra-point.ra)<1e-8&&Math.abs(round.dec-point.dec)<1e-8);
const polar=S.daily(sun,{...s,lat:89,date:'2026-06-21'});assert.equal(polar.total,24);
const near=S.position(moon,s),far=S.position(moon,{...s,lon:40});assert(Math.abs(near.alt-far.alt)>10);
console.log('Passed: UTC conversion, Libra new moon, reference coordinates, all planets, horizon crossings, lunar motion, inverse projection, polar day, local viewpoint.');
