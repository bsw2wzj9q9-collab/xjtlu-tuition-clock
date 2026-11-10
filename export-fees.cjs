const fs=require('node:fs');
const path=require('node:path');
const {Core}=require('./src/data.js');
const rows=[['入学年份 / Intake','阶段 / Level','项目 / Programme','形式 / Mode','学费 CNY / Tuition','计费周期 / Basis','总价分摊月数 / Months for total fee','来源 / Source']];
for(let year=2006;year<=2026;year++){
 for(const level of ['bachelor','master','doctorate']){
  const programmes=level==='bachelor'?[['domestic','中国内地统招本科','Mainland undergraduate']]:level==='master'?Core.catalogue(level):[['phd','哲学博士','PhD'],['edd','教育博士','EdD'],['joint','三校联合培养博士','Joint doctorate'],...Core.catalogue(level)];
  for(const p of programmes)for(const mode of ['ft','pt']){
   const c={entry:String(year),level,program:p[0],mode,location:'china'};
   const m=Core.match(c);if(!m)continue;
   const labels=level==='bachelor'?p.slice(1):Core.label(c)||p.slice(1);
   rows.push([year,{bachelor:'本科 / Undergraduate',master:'硕士 / Master',doctorate:'博士 / Doctoral'}[level],labels.join(' / '),mode==='ft'?'全日制 / Full-time':'非全日制 / Part-time',m.fee,m.basis==='annual'?'每学年 / Annual':'整个项目 / Programme total',m.basis==='total'?m.months:'',m.source]);
  }
 }
}
const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
fs.writeFileSync(path.join(__dirname,'dist/学费匹配表_含出处.csv'),'\uFEFF'+rows.map(row=>row.map(quote).join(',')).join('\r\n'));
console.log(`Exported ${rows.length-1} supported intake / programme / mode matches.`);
