# 西浦学费燃烧计 / XJTLU Tuition Clock

Build with `node build.cjs`, then open dist/index.html in a modern browser. It is one standalone file,
with no third-party scripts, remote fonts, analytics or server dependency.
Settings and up to 100 sessions are stored locally in the browser.

运行 `node build.cjs` 后打开 dist/index.html 即可使用。可以把此文件直接发给同学。
中英切换、计时、暂停、刷新续计、历史记录与 CSV 导出都在本地运行。

Verified automatic fee coverage (snapshot checked 2026-11-06):
- Mainland undergraduate intakes 2006–2026, with evidence for every year.
- 397 historical master's programme/intake records across 2015–2025,
  plus 55 programmes for 2026; matching includes the verified FT/PT duration.
- Historical PhD and EdD records with dated evidence, by intake and study mode.
  Subject-specific doctoral recruitment is kept separate from standard PhD fees.
Early master's fees (2011–2014), some doctoral cohorts/modes, joint programmes,
international/HK/Macao/Taiwan undergraduate admission, overseas study and
exceptional bills still require the actual fee where evidence is insufficient.
Do not extrapolate current fees to unsupported cohorts.

中国内地本科已覆盖2006年创校至2026年每一届：
2006–2009：50,000元/年；2010–2012：60,000元/年；2013：66,000元/年；
2014–2015：77,000元/年；2016–2023：88,000元/年；
2024–2025：93,000元/年；2026：99,000元/年。
2006年依据明确回溯创校当年收费的新闻报道，其余年份分别核对当届招生资料或明确的历史记载。
硕士2015–2025年新增397条项目年份记录；历史项目名与全/非全日制学制分别保留。
2017年媒介与传播全日制学制在原简章中存在疑点，暂不自动匹配该组合。
博士按已核实的项目和年份接入，教育学PhD与教育博士EdD分开。
2023年博士调价生效时间不明，单靠入学年份无法准确区分，保留实际学费填写。
未找到充分资料的早期硕博项目保留空缺，不使用最近年份替代。

学费不按年级统一套用；自动匹配考虑学习阶段、入学年份、项目与全/非全日制。
硕士全程学费按学制分摊；博士研究默认提供全天分摊模式。
手动金额可用人民币、英镑或美元；外币须自己填写汇率。
所有输出均为人民币。奖学金只应用已填写的最终减免，不自动叠加优惠。
默认每年 28 周、每周 16 小时是演算假设，可修改。
这不是学校账单或官方收费网站。逐项出处保存在 research/ 与学费匹配表CSV中，网页不显示来源角注。

Source files: src/index.html, src/style.css, src/data.js, src/app.js and research/*.json.
Build with Node.js 22 or newer: node build.cjs
The build regenerates src/history.js and dist/index.html from the reviewed source data.
Export the supported fee/source table after building: node export-fees.cjs
Calculation checks after building: node tests/core.cjs
Browser checks (pnpm 11): pnpm install --frozen-lockfile
Install Chromium: pnpm exec playwright install chromium
Run the browser suite against the offline build: pnpm test:browser
On Linux, if Chromium's system dependencies are missing, install with
`pnpm exec playwright install --with-deps chromium` where system package access is available.
Browser screenshots and exported test CSV files go to qa/.

Current year is inferred from entry year, advancing each September (Asia/Shanghai).
当前年级按入学年份自动匹配，每年 9 月升一届。
