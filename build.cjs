const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,'src',name),'utf8');
require('./compile-history.cjs');
let html=read('index.html').replace('/* STYLE */',()=>read('style.css')).replace('/* DATA */',()=>read('history.js')+'\n'+read('data.js')).replace('/* APP */',()=>read('app.js'));
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/index.html'),html);
console.log(`Built self-contained HTML (${Buffer.byteLength(html)} bytes)`);
