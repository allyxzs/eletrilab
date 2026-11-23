const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../js/core.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),`${a} ≈ ${b}`);
test('Lei de Ohm: seis pares recuperam 12 V, 2 A, 6 Ω e 24 W',()=>{
 const reference={V:12,I:2,R:6,P:24};
 for(const [a,b] of ['VI','VR','IR','VP','IP','RP']){
  const actual=E.ohm({[a]:reference[a]},{[b]:reference[b]});
  for(const k in reference)close(actual[k],reference[k]);
 }
});
test('série: corrente uniforme e soma das quedas de tensão',()=>{
 const r=E.circuit(12,[2,4],'series');close(r.R,6);close(r.I,2);close(r.P,24);
 close(r.branches[0].V,4);close(r.branches[1].V,8);
 close(r.branches.reduce((s,b)=>s+b.V,0),12);
});
test('paralelo: tensão uniforme e lei dos nós',()=>{
 const r=E.circuit(12,[6,3],'parallel');close(r.R,2);close(r.I,6);
 r.branches.forEach(b=>close(b.V,12));close(r.branches.reduce((s,b)=>s+b.I,0),r.I);
});
test('misto: R1 + (R2 ∥ R3), conservação da potência',()=>{
 const r=E.circuit(12,[2,6,3],'mixed');close(r.R,4);close(r.I,3);close(r.branches[0].V,6);close(r.branches[1].I,1);close(r.branches[2].I,2);
 close(r.branches.reduce((s,b)=>s+b.P,0),r.P);
});
test('propriedades em várias associações de um a seis resistores',()=>{
 for(let n=1;n<=6;n++){const rs=Array.from({length:n},(_,i)=>(i+1)*7.5);
 for(const mode of ['series','parallel',...(n>=3?['mixed']:[])]){
 const r=E.circuit(9.5,rs,mode);close(r.branches.reduce((s,b)=>s+b.P,0),r.P);
 if(mode==='parallel')assert.ok(r.R<=Math.min(...rs));
 if(mode==='mixed')close(r.branches.slice(1).reduce((s,b)=>s+b.I,0),r.I);
 }}
});
test('energia: 100 W × 5 h × 30 dias = 15 kWh',()=>{assert.deepEqual(E.energy(100,5,30,1),{kwh:15,cost:15});assert.deepEqual(E.energy(100,5,30,0),{kwh:15,cost:0});});
test('conversões de prefixos e ida e volta',()=>{
 close(E.convert(1000,'m',''),1);close(E.convert(2.2,'k',''),2200);close(E.convert(4.7,'µ','n'),4700);close(E.convert(0,'','k'),0);
 for(const a in E.scales)for(const b in E.scales)close(E.convert(E.convert(1.234,a,b),b,a),1.234);
});
test('entradas inválidas não produzem Infinity ou NaN',()=>{
 for(const bad of [0,-1,NaN,Infinity]){assert.throws(()=>E.ohm({V:12},{R:bad}));assert.throws(()=>E.circuit(12,[bad]));}
 assert.throws(()=>E.circuit(12,[]));assert.throws(()=>E.circuit(12,[1,2],'mixed'));assert.throws(()=>E.circuit(12,Array(7).fill(1)));
 assert.throws(()=>E.energy(100,25,30,1));assert.throws(()=>E.energy(100,1,1.5,1));assert.throws(()=>E.energy(100,1,30,-1));assert.throws(()=>E.convert(1,'x',''));
 assert.throws(()=>E.ohm({V:1e308},{I:1e308}));assert.throws(()=>E.ohm({R:6},{R:3}));
});
