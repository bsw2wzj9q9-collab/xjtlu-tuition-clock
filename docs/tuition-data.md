# Tuition data and calculations

[English README](../README.md) · [中文说明](#中文说明)

## Snapshot and sources

The bundled records were reviewed on **6 November 2026**. The app matches a specific intake, level, programme and study mode. A missing combination returns no automatic price; current fees are never carried backwards or forwards to fill a gap.

| Records | Source file |
| --- | --- |
| Undergraduate, 2006–2013 | [undergraduate-2006-2013.json](../research/undergraduate-2006-2013.json) |
| Undergraduate, 2014–2021 | [undergraduate-2014-2021.json](../research/undergraduate-2014-2021.json) |
| Master's, 2015–2025 | [masters-history.json](../research/masters-history.json) |
| Master's, 2011–2014 evidence and gaps | [masters-2011-2014.json](../research/masters-2011-2014.json) |
| Historical PhD and EdD records | [doctoral-history.json](../research/doctoral-history.json) |
| Undergraduate, 2022–2026; master's and standard PhD, 2026 | [src/data.js](../src/data.js) |

Sources include dated university prospectuses, admissions pages, archived regulations and historical reporting. The 2006 undergraduate fee comes from a retrospective report explicitly stating the founding-year price. Source links and evidence notes remain alongside the records; the app does not fetch them during use.

The snapshot contains **397 historical master's programme/intake records** and **55 master's programmes for 2026**. Expanding supported study modes produces **558 historical fee/mode matches**; combining these with the other snapshot records produces **637 exported matches**. These counts describe different units, not 637 separate programmes.

To inspect every supported combination and its source:

```sh
node build.cjs
node export-fees.cjs
```

Open `dist/学费匹配表_含出处.csv` in a spreadsheet application.

## Known gaps

- **Master's intakes, 2011–2014:** programme lists and fee ranges do not establish exact programme prices. No automatic fee records are compiled for those years.
- **2017 Media and Communication, full-time:** the duration in the source is unclear; this combination is excluded from automatic matching.
- **Standard PhD, 2023:** the effective date of a fee change is unclear, so entry year alone cannot select the correct annual fee.
- **Other doctoral combinations:** a subject-specific recruitment fee is not a generic PhD fee. Only explicitly supported programme, year and mode combinations are compiled.
- **Other admission routes and overseas study:** international, Hong Kong/Macao/Taiwan undergraduate admission, unsupported joint programmes, overseas periods and exceptional bills require the user's actual tuition.
- **Beyond the snapshot:** new intakes need new evidence. A year appearing in the selector does not mean its fee is available.

## Calculation rules

All results are displayed in CNY. Manual GBP or USD tuition is converted using the exchange rate entered by the user. A scholarship or waiver is applied only through the entered final discount percentage; the app does not combine separate offers automatically.

```text
net fee = tuition in CNY × (1 − discount / 100)
allocation years = programme months / 12  [whole-programme fee]
allocation years = 1                      [annual fee]

contact-hours rate = net fee / (weeks per year × hours per week × allocation years × 3,600)
calendar rate      = net fee / (365.2425 × 24 × allocation years × 3,600)

session amount = active elapsed seconds × rate
item equivalent = session amount / configured item price
```

Contact-hours mode defaults to **28 weeks per year and 16 hours per week**. These are adjustable assumptions, not an official timetable. Doctoral study defaults to calendar allocation. Paused time does not count, and a session's amount stops increasing at its configured duration.

For example, an annual fee of CNY 93,000 with no discount, 28 weeks and 16 hours per week gives approximately **CNY 0.0577 per second**, or **CNY 173.00 for 50 minutes**. Changing the study-time assumptions changes that estimate.

The study-year indicator advances on **1 September, Asia/Shanghai**. It counts from the entry year; it does not verify a student's enrolment, leave of absence or graduation status.

## Updating records

1. Find a dated source tying the fee to the exact intake, programme and study mode. Record whether the fee is annual or for the whole programme, and the applicable duration.
2. Edit the relevant `research/` JSON file or the snapshot records in `src/data.js`. Keep uncertain combinations unsupported and preserve source links and evidence notes.
3. Run `node build.cjs` to regenerate `src/history.js` and the standalone HTML. Do not edit the generated history file directly.
4. Run the core checks and fee export. Inspect the affected rows; run the browser checks if matching or interface behaviour changes.
5. Include the evidence and changed coverage in the pull request. Update the documented counts and review date when the data changes.

## 中文说明

这份学费数据核对于 **2026 年 11 月 6 日**。匹配条件包括入学年份、学习阶段、项目和全日制／非全日制；没有充分资料的组合保留空缺，不用现价或邻近年份补齐。

**本科年费快照**（中国内地统招）：

| 入学年份 | 每学年学费（人民币） |
| --- | ---: |
| 2006–2009 | 50,000 元 |
| 2010–2012 | 60,000 元 |
| 2013 | 66,000 元 |
| 2014–2015 | 77,000 元 |
| 2016–2023 | 88,000 元 |
| 2024–2025 | 93,000 元 |
| 2026 | 99,000 元 |

2006 年使用明确回溯创校当年收费的报道，其余资料和出处见上方文件表。硕士有 397 条历史项目／年份记录及 2026 年的 55 个项目；区分学习形式后，历史匹配为 558 条，全部可导出组合为 637 条。它们不是同一种计数，也不代表 637 个专业。

**尚未自动匹配的情况：** 2011–2014 年硕士缺少逐项目准确收费；2017 年媒介与传播全日制学制有疑点；2023 年普通 PhD 调价的具体生效时间不清楚。其他没有资料支持的博士、联合培养、海外学习及非中国内地统招本科组合，也需要填写实际学费。特定学科的博士收费不会套用到所有博士项目。

**计算方法：** 先将学费换算成人民币并扣除填写的最终减免，再按学习时间分摊。按课时计算时，默认每年 28 周、每周 16 小时，均可修改；整个项目的总学费还要结合学制月数分摊。博士默认按全年时间计算，每年取 365.2425 天。暂停期间不增加金额，到达设定时长后停止累计。

例如，每年 93,000 元、没有减免、每年 28 周且每周 16 小时，约为每秒 0.0577 元，一节 50 分钟的课约分摊 173.00 元。这是按所选条件计算的估计，不是学校逐秒收费。

**自动年级：** 按上海时间每年 9 月 1 日递增，只根据入学年份推算，不核实休学、延毕或毕业情况。

**补充数据：** 请提供带年份的来源、项目、学习形式、金额、收费周期和适用学制，修改 `research/` 或 `src/data.js` 后重新构建，再执行核心检查并核对导出的 CSV。涉及界面或匹配行为时运行浏览器检查。不要手动修改生成的 `src/history.js`；修改数据后同步更新覆盖范围、计数和核对日期。
