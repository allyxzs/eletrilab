// Gera index.html autocontido, sem dependências de rede ou de subpastas.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const svg=read('assets/icon.svg');
const head='<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64')+'">\n<style>\n'+read('styles.css').replace(/<\/style/gi,'<\\/style')+'\n</style>';
const scripts=['boot','core','state','app'].map(name=>'<script>\n'+read('js/'+name+'.js').replace(/<\/script/gi,'<\\/script')+'\n</script>').join('\n');
const html=read('src/template.html').replace('<!-- ELETRILAB:HEAD -->',()=>head).replace('<!-- ELETRILAB:LOGO -->',()=>svg.replace('<svg ','<svg class="brand-icon" width="40" height="40" aria-hidden="true" focusable="false" ')).replace('<!-- ELETRILAB:SCRIPTS -->',()=>scripts);
if(process.argv.includes('--check')){if(read('index.html')!==html){console.error('index.html não corresponde aos fontes. Execute npm run build.');process.exit(1);}console.log('Página autocontida sincronizada.');}
else{fs.writeFileSync(path.join(root,'index.html'),html);console.log('EletriLab 1.1: index.html autocontido gerado.');}
