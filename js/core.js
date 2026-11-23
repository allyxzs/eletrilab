/* EletriLab: núcleo independente da interface. Unidades internas no SI. */
(function(root){
'use strict';
const positive=(x,name)=>{if(!Number.isFinite(x)||x<=0)throw new Error(`${name} deve ser maior que zero e finito.`);return x;};
const finite=(x)=>{if(!Number.isFinite(x)||x<=0)throw new Error('Resultado fora do intervalo numérico. Use valores menos extremos.');return x;};
function ohm(a,b){
 const keys=Object.keys(a);if(keys.length!==1||Object.keys(b).length!==1)throw new Error('Informe duas grandezas.');
 const k=keys[0], l=Object.keys(b)[0];if(k===l||![k,l].every(x=>['V','I','R','P'].includes(x)))throw new Error('Escolha grandezas diferentes.');
 const v={...a,...b};Object.entries(v).forEach(([n,x])=>positive(x,n));
 let V=v.V,I=v.I,R=v.R,P=v.P;
 if(V!==undefined&&I!==undefined)R=V/I;
 else if(V!==undefined&&R!==undefined)I=V/R;
 else if(I!==undefined&&R!==undefined)V=I*R;
 else if(V!==undefined&&P!==undefined){I=P/V;R=V/I;}
 else if(I!==undefined&&P!==undefined){V=P/I;R=V/I;}
 else if(R!==undefined&&P!==undefined){I=Math.sqrt(P/R);V=I*R;}
 if(R===undefined)R=V/I;
 P=V*I;[V,I,R,P].forEach(finite);return {V,I,R,P};
}
function circuit(voltage,resistors,mode='series'){
 positive(voltage,'Tensão');if(!Array.isArray(resistors)||resistors.length<1||resistors.length>6)throw new Error('Use entre 1 e 6 resistores.');
 resistors.forEach(r=>positive(r,'Resistência'));if(!['series','parallel','mixed'].includes(mode))throw new Error('Associação inválida.');
 if(mode==='mixed'&&resistors.length<3)throw new Error('O circuito misto precisa de pelo menos 3 resistores.');
 const parallel=rs=>{const min=Math.min(...rs);return min/rs.reduce((s,r)=>s+min/r,0);};
 const req=mode==='series'?resistors.reduce((s,r)=>s+r,0):mode==='parallel'?parallel(resistors):resistors[0]+parallel(resistors.slice(1));
 const current=voltage/req;finite(req);finite(current);
 const branches=resistors.map((r,i)=>{
 const v=mode==='series'||(mode==='mixed'&&i===0)?current*r:mode==='parallel'?voltage:current*parallel(resistors.slice(1));
 const a=v/r,p=v*a;[v,a,p].forEach(finite);return {R:r,V:v,I:a,P:p};
 });const power=finite(voltage*current);return {R:req,I:current,V:voltage,P:power,branches};
}
function energy(power,hours,days,tariff){
 positive(power,'Potência');if(!Number.isFinite(hours)||hours<=0||hours>24)throw new Error('Use mais de 0 e até 24 horas por dia.');
 if(!Number.isInteger(days)||days<1||days>366)throw new Error('Use de 1 a 366 dias inteiros.');
 if(!Number.isFinite(tariff)||tariff<0)throw new Error('A tarifa deve ser zero ou positiva.');
 const kwh=finite(power/1000*hours*days),cost=kwh*tariff;if(!Number.isFinite(cost))throw new Error('Custo fora do intervalo numérico.');return {kwh,cost};
}
const scales={p:1e-12,n:1e-9,'µ':1e-6,m:1e-3,'':1,k:1e3,M:1e6,G:1e9};
function convert(value,from,to){if(!Number.isFinite(value)||!(from in scales)||!(to in scales))throw new Error('Conversão inválida.');const result=value*scales[from]/scales[to];if(!Number.isFinite(result)||(value!==0&&result===0))throw new Error('Conversão fora do intervalo numérico.');return result;}
const api={ohm,circuit,energy,convert,scales};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Electro=api;
})(typeof globalThis!=='undefined'?globalThis:this);
