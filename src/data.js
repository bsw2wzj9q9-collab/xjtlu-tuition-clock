'use strict';
// Fee facts checked on 2026-11-06. Exact entry years only; never extrapolate.
const HISTORY=typeof module!=='undefined'?require('./history.js'):TUITION_HISTORY;
const SOURCES = {
 ug2022:'https://www.xjtlu.edu.cn/assets/files/flyer/2022/2022_ug_brochure.pdf',
 ug2023:'https://www.xjtlu.edu.cn/wp-content/uploads/2024/02/XJTLU-2024-admissions-regulations-for-GSAT-students.pdf',
 ug2024:'https://www.xjtlu.edu.cn/wp-content/uploads/2025/01/XJTLU-chasing-your-dream-CN-2425.pdf',
 ug2025:'https://gaokao.chsi.com.cn/zsgs/zhangcheng/listVerifedZszc--infoId-7637501870,method-view,schId-1228482.dhtml',
 ug2026:'https://www.xjtlu.edu.cn/zh/admissions/domestic/fees-and-scholarship',
 master:'https://www.xjtlu.edu.cn/zh/admissions/master/fees-and-scholarship',
 phd:'https://www.xjtlu.edu.cn/wp-content/uploads/2026/01/XJTLU-Doctoral-Research-Prospectus-2026-ZH.pdf',
 doctoralCurrent:'https://www.xjtlu.edu.cn/zh/admissions/doctoral/programme-fees',
 global:'https://www.xjtlu.edu.cn/zh/admissions/ug/global/fees-and-scholarship'
};
// id, Chinese label, English label, total CNY, full-time months, part-time months.
const MASTERS = [
 ['materials','材料科学与工程（研究型）','Materials Science and Engineering (Research)',200000,24,0],
 ['urban','城市规划与设计','Urban Planning and Design',150000,18,0],
 ['entrepreneurship','创业与创新','Entrepreneurship and Innovation',200000,24,36],
 ['energy-research','低碳电力与能源技术（研究型）','Low Carbon Electrical Power and Energy Technology (Research)',200000,24,0],
 ['telecom','多媒体通信','Multimedia Telecommunications',180000,18,0],
 ['tesol','对外英语教育','TESOL',180000,18,0],
 ['child','儿童发展与家庭教育学','Child Development and Family Education',180000,18,30],
 ['molecular','分子生物学（研究型）','Molecular Bioscience (Research)',200000,24,0],
 ['policy','全球公共政策与国际关系','Global Public Policy and International Relations',180000,18,36],
 ['education','国际化教育','Global Education',180000,18,30],
 ['architecture-practice','国际建筑专业实践','International Professional Practice in Architecture',150000,18,36],
 ['international-business','国际商务与全球事务','International Business and Global Affairs',180000,18,36],
 ['imba','国际工商管理硕士（IMBA）','International MBA (IMBA)',320000,0,24],
 ['industrial-design','工业设计','Industrial Design',200000,24,0],
 ['management','管理学','Management',180000,18,30],
 ['management-research','管理学（研究型）','Management (Research)',200000,24,0],
 ['chemistry','高级化学（研究型）','Advanced Chemical Sciences (Research)',200000,24,0],
 ['environment','环境科学（研究型）','Environmental Sciences (Research)',200000,24,0],
 ['construction','建筑工程管理','Construction Management',150000,18,36],
 ['architecture','建筑设计','Architectural Design',200000,24,0],
 ['economics','经济与金融','Economics and Finance',180000,18,0],
 ['cs','计算机科学（研究型）','Computer Science (Research)',200000,24,0],
 ['finance','金融学','Finance',180000,18,0],
 ['financial-maths','金融数学','Financial Mathematics',180000,18,0],
 ['financial-computing','金融计算学','Financial Computing',180000,18,0],
 ['actuarial','精算学','Actuarial Science',150000,18,0],
 ['sustainable-building','可持续房屋设计与工程','Sustainable Building Design and Engineering',150000,18,36],
 ['sustainable-energy','可持续能源技术','Sustainable Energy Technology',180000,18,0],
 ['media','数字媒体与全球传播','Media and Communication',180000,18,0],
 ['pattern','模式识别和智能系统（研究型）','Pattern Recognition and Intelligent Systems (Research)',200000,24,0],
 ['ai','人工智能','Artificial Intelligence',200000,24,0],
 ['hci','人机交互','Human-Computer Interaction',180000,18,0],
 ['analytics','商业分析','Business Analytics',180000,18,0],
 ['social-computing','社会网络计算技术','Social Computing',180000,18,0],
 ['data-science','数据科学','Data Science',200000,24,0],
 ['bioinformatics','生物信息学（研究型）','Bioinformatics (Research)',200000,24,0],
 ['digital-education','数字化教育','Digital Education',200000,24,36],
 ['digital-business','数字化商业','Digital Business',200000,24,0],
 ['civil','土木工程','Civil Engineering',150000,18,36],
 ['investment','投资管理','Investment Management',180000,18,0],
 ['culture','文化创意产业','Cultural and Creative Industries',200000,24,0],
 ['project','项目管理','Project Management',180000,18,30],
 ['manufacturing','先进智能制造科技（研究型）','Advanced Intelligent Manufacturing Technology (Research)',200000,24,0],
 ['robotics','先进机器人技术系统','Advanced Robotics Systems',200000,24,36],
 ['microelectronics','先进微电子技术与材料（研究型）','Advanced Microelectronic Technology and Materials (Research)',200000,24,0],
 ['pharmacy','药学（研究型）','Pharmacy (Research)',200000,24,36],
 ['informatics','应用信息学','Applied Informatics',180000,18,0],
 ['statistics','应用统计学','Applied Statistics',200000,24,0],
 ['maths','应用数学','Applied Mathematics',180000,18,0],
 ['medicinal-chemistry','药物化学（研究型）','Medicinal Chemistry (Research)',200000,24,36],
 ['linguistics','应用语言学和多语研究','Applied Linguistics and Multilingualism',180000,18,0],
 ['supply-chain','运营与供应链管理','Operations and Supply Chain Management',180000,18,36],
 ['accounting','专业会计','Professional Accounting',180000,18,0],
 ['china','中国研究','China Studies',180000,18,0],
 ['engineering','智能工程科学与工业运营','Intelligent Engineering Science and Industrial Operations',200000,24,36]
];
const UG_FEES={2022:88000,2023:88000,2024:93000,2025:93000,2026:99000};
const MASTER_CATALOGUE=[...MASTERS.map(p=>p.slice(0,3)),...HISTORY.programmes.filter(p=>!MASTERS.some(m=>m[0]===p[0]))];
const Core={
 academicYear(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric'}).formatToParts(now);
  const year=Number(parts.find(p=>p.type==='year').value),month=Number(parts.find(p=>p.type==='month').value);
  return year-(month<9?1:0);
 },
 grade(entry,now=new Date()){return Math.max(0,Core.academicYear(now)-Number(String(entry).slice(0,4))+1);},
 match(c){
  const year=Number(String(c.entry).slice(0,4));
  if(c.location!=='china')return null;
  if(c.level==='bachelor' && c.program==='domestic' && c.mode==='ft' && UG_FEES[year])return {fee:UG_FEES[year],basis:'annual',months:48,source:SOURCES['ug'+year],status:'matched'};
  const historical=HISTORY.fees.find(r=>r.year===year&&r.level===c.level&&r.program===c.program&&r.mode===c.mode);
  if(historical)return {...historical,source:HISTORY.sources[historical.source].url,status:'matched'};
  if(c.level==='master' && year===2026){
   const p=MASTERS.find(p=>p[0]===c.program);const months=p?.[c.mode==='pt'?5:4];
   if(p&&months)return {fee:p[3],basis:'total',months,source:SOURCES.master,status:'matched'};
  }
  if(c.level==='doctorate' && year===2026 && c.program==='phd')return {fee:c.mode==='pt'?75000:99000,basis:'annual',months:c.mode==='pt'?60:48,source:SOURCES.phd,status:'matched'};
  // A missing cohort or study mode never inherits the nearest year's price.
  return null;
 },
 catalogue(level){return level==='master'?MASTER_CATALOGUE:HISTORY.doctoralProgrammes;},
 label(c){return HISTORY.labels[String(c.entry).slice(0,4)+'/'+c.program]||Core.catalogue(c.level).find(p=>p[0]===c.program)?.slice(1,3);},
 modes(c){return ['ft','pt'].filter(mode=>Core.match({...c,mode}));},
 fee(c){const m=Core.match(c);return c.manual?{fee:c.amount*(c.currency==='CNY'?1:c.fx),basis:c.feeBasis,months:c.months,status:'manual',source:null}:m;},
 rate(c){
  const m=Core.fee(c);if(!m)return null;
  const fee=m.fee*(1-c.discount/100);
  const years=m.basis==='total'?m.months/12:1;
  const hours=c.basis==='calendar'?365.2425*24*years:c.weeks*c.hours*years;
  if(!Number.isFinite(fee)||fee<0||!Number.isFinite(hours)||hours<=0)return null;
  return fee/(hours*3600);
 },
 elapsed(s,now=Date.now()){return Math.min(s.duration,Math.max(0,s.elapsed+(s.running?Math.max(0,now-s.anchor)/1000:0)));},
 snapshot(s,now=Date.now()){const elapsed=Core.elapsed(s,now);return {elapsed,remaining:Math.max(0,s.duration-elapsed),spent:elapsed*s.rate,remainingCost:Math.max(0,s.duration-elapsed)*s.rate,progress:Math.min(100,elapsed/s.duration*100)};},
 valid(c){
  return ['bachelor','master','doctorate'].includes(c.level)&&/^\d{4}$/.test(c.entry)&&+c.entry.slice(0,4)>=2006&&+c.entry.slice(0,4)<=2100&&['ft','pt'].includes(c.mode)&&['china','overseas'].includes(c.location)&&['contact','calendar'].includes(c.basis)&&Number.isFinite(c.weeks)&&c.weeks>=1&&c.weeks<=52&&Number.isFinite(c.hours)&&c.hours>=.5&&c.hours<=168&&Number.isFinite(c.discount)&&c.discount>=0&&c.discount<=100&&Number.isFinite(c.duration)&&c.duration>=1&&c.duration<=720&&(!c.manual||(Number.isFinite(c.amount)&&c.amount>=0&&c.amount<=10000000&&['annual','total'].includes(c.feeBasis)&&Number.isFinite(c.months)&&c.months>=1&&c.months<=120&&['CNY','GBP','USD'].includes(c.currency)&&Number.isFinite(c.fx)&&c.fx>0&&c.fx<=10000));
 }
};
if(typeof module!=='undefined')module.exports={Core,MASTERS,SOURCES,HISTORY,MASTER_CATALOGUE};
