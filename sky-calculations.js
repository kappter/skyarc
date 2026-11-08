/* Astronomy Engine adapter. All catalog coordinates are J2000 (EQJ).
   Local clock + manually selected UTC offset defines the observation instant. */
(function(root){
const A=root.Astronomy || (typeof require==='function'?require('./astronomy.browser.min.js'):null);
const cache=new Map();
const date=s=>new Date(Date.parse(s.date+'T00:00:00Z')+(s.h-s.z)*3600000);
const observer=s=>new A.Observer(s.lat,s.lon,0);
function equator(name,s){return A.Equator(name,date(s),observer(s),false,true);}
function fixed(ra,dec,s){
 const t=date(s),v=A.VectorFromSphere(new A.Spherical(dec,ra*15,1),t);
 const eq=A.EquatorFromVector(A.RotateVector(A.Rotation_EQJ_EQD(t),v));
 const h=A.Horizon(t,observer(s),eq.ra,eq.dec);
 return {alt:h.altitude,az:h.azimuth};
}
function position(body,s){
 if(body.group)return fixed(body.ra,body.dec,s);
 const eq=equator(body.name,s);return fixed(eq.ra,eq.dec,s);
}
function constellation(body,s){const eq=body.group?body:equator(body.name,s);return A.Constellation(eq.ra,eq.dec).name;}
function daily(body,s){
 const key=JSON.stringify([body.name,body.group,body.ra,body.dec,s.date,s.z,s.lat,s.lon]);
 if(cache.has(key))return cache.get(key);
 // Five-minute bracketing, then bisection for actual geometric horizon crossings.
 const at=h=>position(body,{...s,h}).alt;
 const step=1/12;let prev=at(0),total=0,rise=null,set=null,best=prev,tr=0;
 for(let i=1;i<=288;i++){
  const h=i*step,a=at(h);if(a>best){best=a;tr=h;}
  if((prev>=0)!==(a>=0)){
   let lo=h-step,hi=h;for(let j=0;j<18;j++){const mid=(lo+hi)/2;if((at(mid)>=0)===(prev>=0))lo=mid;else hi=mid;}
   const crossing=(lo+hi)/2;if(a>=0){rise=crossing;total+=h-crossing;}else{set=crossing;total+=crossing-(h-step);}
  }else if(a>=0)total+=step;
  prev=a;
 }
 // Refine the daily altitude maximum within its sample bracket.
 let lo=Math.max(0,tr-step),hi=Math.min(24,tr+step);
 for(let i=0;i<24;i++){const x=lo+(hi-lo)/3,y=hi-(hi-lo)/3;if(at(x)<at(y))lo=x;else hi=y;}
 tr=(lo+hi)/2;
 const result={body,tr,rise,set,total:Math.abs(total-24)<1e-8?24:total,half:total/2};
 if(cache.size>150)cache.clear();cache.set(key,result);return result;
}
function inverse(alt,az,s){
 const t=date(s),v=A.VectorFromSphere(new A.Spherical(alt,-az,1),t);
 return A.EquatorFromVector(A.RotateVector(A.Rotation_HOR_EQJ(t,observer(s)),v));
}
root.SkyCalc={date,equator,fixed,position,constellation,daily,inverse};
if(typeof module!=='undefined')module.exports=root.SkyCalc;
})(typeof globalThis!=='undefined'?globalThis:this);
