/* Recuperação independente por campo; não apaga os dados originais. */
(function(root){
'use strict';
function defaults(){return {version:1,history:[],xp:0,answered:0,correct:0,lab:{mode:'series',voltage:12,resistors:[6,6],closed:true}};}
function restore(raw,math){
 const state=defaults(), warnings=[];
 if(raw===null||raw===undefined||raw==='')return {state,warnings};
 let stored;
 try{stored=JSON.parse(raw);}catch{return {state,warnings:['Os dados salvos não puderam ser lidos. A sessão começou com os valores padrão; os dados originais não foram apagados.']};}
 if(!stored||typeof stored!=='object'||Array.isArray(stored)||stored.version!==1)return {state,warnings:['Formato de dados salvo não reconhecido. Os dados originais foram preservados.']};
 for(const key of ['xp','answered','correct'])if(Number.isSafeInteger(stored[key])&&stored[key]>=0)state[key]=Math.min(stored[key],1e9);
 state.correct=Math.min(state.correct,state.answered);
 if(Array.isArray(stored.history))state.history=stored.history.filter(h=>h&&typeof h.title==='string'&&typeof h.detail==='string'&&typeof h.date==='string'&&Number.isFinite(Date.parse(h.date))).slice(0,100).map(h=>({title:h.title.slice(0,200),detail:h.detail.slice(0,4000),date:h.date}));
 if(stored.lab){try{math.circuit(stored.lab.voltage,stored.lab.resistors,stored.lab.mode);state.lab={mode:stored.lab.mode,voltage:stored.lab.voltage,resistors:[...stored.lab.resistors],closed:stored.lab.closed!==false};}catch{warnings.push('O último circuito tinha valores inválidos e foi restaurado ao exemplo. Seu histórico e progresso foram mantidos.');}}
 return {state,warnings};
}
function routeKey(hash){const key=String(hash||'').replace(/^#/,'');return ['laboratorio','ohm','energia','unidades','aprender','historico'].includes(key)?key:'laboratorio';}
const api={defaults,restore,routeKey};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EletriLabState=api;
})(typeof globalThis!=='undefined'?globalThis:this);
