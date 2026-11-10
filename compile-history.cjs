// Turn reviewed evidence into a small, offline-only fee registry.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=__dirname;
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'research',name),'utf8'));
const history={checkedOn:'2026-11-06',programmes:[],doctoralProgrammes:[],labels:{},sources:{},fees:[]};
const add=row=>{
 assert(Number.isInteger(row.year)&&row.year>=2006&&row.year<=2026);
 assert(['ft','pt'].includes(row.mode));
 assert(Number.isFinite(row.fee)&&row.fee>=0);
 assert(['annual','total'].includes(row.basis));
 assert(row.basis==='annual'||Number.isFinite(row.months)&&row.months>0);
 assert(history.sources[row.source]?.url?.startsWith('https://'));
 const key=r=>[r.level,r.year,r.program,r.mode].join('/');
 assert(!history.fees.some(r=>key(r)===key(row)),`Duplicate fee ${key(row)}`);
 history.fees.push(row);
};
for(const r of read('undergraduate-2006-2013.json').years){
 const source='ug'+r.year;
 history.sources[source]={url:r.source_url,title:r.source_title};
 add({year:r.year,level:'bachelor',program:'domestic',mode:'ft',fee:r.annual_cny,basis:'annual',months:48,source});
}
for(const r of read('undergraduate-2014-2021.json').records){
 const source='ug'+r.year;
 history.sources[source]={url:r.source,title:r.title};
 add({year:r.year,level:'bachelor',program:'domestic',mode:'ft',fee:r.fee,basis:'annual',months:48,source});
}
for(const file of ['masters-history.json','masters-2011-2014.json']){
 if(!fs.existsSync(path.join(root,'research',file)))continue;
 const data=read(file);
 Object.assign(history.sources,data.sources||{});
 for(const p of data.historical_programmes||[]){
  if(!history.programmes.some(r=>r[0]===p.programme_id))history.programmes.push([p.programme_id,p.name_zh,p.name_en]);
 }
 for(const r of data.records||[]){
  if(r.safeForAutomaticMatch===false)continue;
  history.labels[r.entry_year+'/'+r.programme_id]=[r.name_zh,r.name_en];
  for(const mode of ['ft','pt']){
   const months=r[mode+'_months'];
   if(!months)continue;
   add({year:r.entry_year,level:'master',program:r.programme_id,mode,fee:r.fee,basis:r.basis,months,source:r.source});
  }
 }
}
for(const r of read('doctoral-history.json').records){
 if(!(r.safeForGenericAutomaticMatch||r.safeForScopedAutomaticMatch)||r.basis!=='annual')continue;
 const program=r.programme==='three_school_joint_phd'?'joint':r.programme;
 const source=r.id;
 const evidence=r.sources[0];
 history.sources[source]={url:evidence.url,title:evidence.title};
 if(!['phd','edd','joint'].includes(program)&&!history.doctoralProgrammes.some(p=>p[0]===program)){
  assert(r.programmeLabel?.zh&&r.programmeLabel?.en,`Missing bilingual label for ${program}`);
  history.doctoralProgrammes.push([program,r.programmeLabel.zh,r.programmeLabel.en]);
 }
 for(const year of r.supportedYears){
  add({year,level:'doctorate',program,mode:r.mode==='part_time'?'pt':'ft',fee:r.annualFee,basis:'annual',months:r.durationMonths||null,durationRange:r.durationMonthsRange||null,source});
 }
}
history.fees.sort((a,b)=>a.year-b.year||a.level.localeCompare(b.level)||a.program.localeCompare(b.program)||a.mode.localeCompare(b.mode));
fs.writeFileSync(path.join(root,'src/history.js'),"'use strict';\n// Generated from research/*.json by compile-history.cjs. No adjacent-year fallback.\nconst TUITION_HISTORY="+JSON.stringify(history)+";\nif(typeof module!=='undefined')module.exports=TUITION_HISTORY;\n");
console.log(`Compiled ${history.fees.length} historical fee / study-mode matches.`);
