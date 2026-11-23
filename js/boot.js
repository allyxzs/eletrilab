/* Mensagem utilizável mesmo quando a inicialização do app falha. */
(() => {
'use strict';
let timer;
function fail(){
 clearTimeout(timer);
 const main=document.getElementById('main');
 if(!main)return;
 main.replaceChildren();
 const section=document.createElement('section');section.className='panel';
 const body=document.createElement('div');body.className='panel-body';body.setAttribute('role','alert');
 const heading=document.createElement('h1');heading.textContent='Não foi possível abrir a bancada.';
 const message=document.createElement('p');message.textContent='Recarregue a página para tentar novamente. Seu histórico e progresso não foram apagados. Se continuar, confira se a página principal corresponde ao EletriLab 1.1.';
 const button=document.createElement('button');button.className='primary';button.textContent='Recarregar EletriLab';button.onclick=()=>window.location.reload();
 body.append(heading,message,button);section.append(body);main.append(section);
}
window.EletriLabBoot={ready(){clearTimeout(timer);},fail};
window.addEventListener('error',event=>{if(event.error)fail();});
timer=setTimeout(fail,8000);
})();
