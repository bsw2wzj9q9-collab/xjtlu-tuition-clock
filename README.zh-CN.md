# 西浦学费燃烧计

[English](README.md) · **简体中文**

一个给同学们上课用的小鼓励器。选好学习阶段、入学年份和项目，按下开始，就能看到这节课每秒分摊了多少学费，大概相当于几杯奶茶、几份食堂饭、几杯咖啡。希望能让大家好好学习，也好好珍惜学费。

[打开网站](https://xjtlu-tuition-clock.netlify.app/) · [本地使用](#本地使用) · [学费数据](docs/tuition-data.md#中文说明) · [反馈问题](https://github.com/bsw2wzj9q9-collab/xjtlu-tuition-clock/issues)

![中文界面：正在进行的课堂计时、每秒学费、剩余时间，以及奶茶、食堂饭和咖啡的价格对比。](docs/assets/preview-zh.png)

## 能做什么

- **只选入学年份，自动算年级。** 不用填写具体入学日期，按上海时间每年 9 月升一届。
- **本硕博分别匹配。** 根据入学年份、项目、全日制或非全日制匹配学费和学制，区分每年学费与整个项目的总学费。
- **给这节课计时。** 支持开始、暂停、继续和结束，同时显示已用时间、剩余时间、分摊金额和进度；刷新后可以接着计。
- **看看能换成什么。** 把金额换算成奶茶、食堂饭和咖啡的数量，价格、课时和学习时长都可以自己改。
- **中英双语。** 手机和电脑都能用，随时切换语言。
- **保存上课记录。** 当前浏览器最多保留 100 次记录，可以导出 CSV。

## 本地使用

准备 **Node.js 22 或更新版本**，运行下面三行即可生成网页，不需要先安装依赖。

```sh
git clone https://github.com/bsw2wzj9q9-collab/xjtlu-tuition-clock.git
cd xjtlu-tuition-clock
node build.cjs
```

用浏览器打开 **`dist/index.html`** 就能使用。也可以直接把这个 HTML 文件发给同学；生成后，使用的人不需要 Node.js、服务器或账号，断网也能打开。

生成的网页自带样式、脚本和学费数据，不加载第三方脚本、在线字体或访问统计。设置和历史记录保存在当前浏览器中，清除浏览器存储后会丢失。线上托管平台可能另有访问日志或附加功能。

## 学费覆盖到哪里

这份数据核对于 **2026 年 11 月 6 日**，不会自动随学校官网更新。

| 学习阶段 | 自动匹配范围 |
| --- | --- |
| 中国内地统招本科 | 2006 年创校至 2026 年的每一届 |
| 硕士 | 2015–2025 年的 397 条项目与年份记录，加上 2026 年的 55 个项目；分别匹配有资料支持的学习形式和学制 |
| 博士 | 有明确年份依据的部分 PhD、EdD 项目与学习形式；特定学科的收费单独保留 |

没有足够资料的组合会提示填写实际学费，不会拿最近一年的价格替代。手动填写支持人民币、英镑和美元，外币汇率由使用者填写，最终金额统一显示为人民币。

这里算的是学费随学习时间的分摊估计，不能代替学校账单。具体来源、缺失年份和计算方法见[学费数据说明](docs/tuition-data.md#中文说明)。

## 开发与检查

构建和核心检查只需要 Node.js。浏览器检查另外使用 **pnpm 11.25.0** 安装依赖。

```sh
node build.cjs
node tests/core.cjs
node export-fees.cjs

pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:browser
```

- 学费匹配表导出至 **`dist/学费匹配表_含出处.csv`**，每个支持的组合都有来源链接。
- 核心检查包括历史收费、学习形式、学制、汇率、减免、时间分摊和 9 月升年级。
- 浏览器检查包括两种语言、五种屏幕宽度、离线请求、计时操作、刷新恢复和 CSV 导出；截图和测试导出文件在 `qa/`。

Linux 缺少浏览器系统依赖时，可在有安装权限的环境中运行 `pnpm exec playwright install --with-deps chromium`。也可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 指定已有的 Chromium 系浏览器。

## 文件放在哪里

| 路径 | 内容 |
| --- | --- |
| `src/index.html`、`src/style.css` | 页面结构与样式 |
| `src/app.js` | 双语切换、设置、计时和本地存储 |
| `src/data.js` | 学费匹配、当前数据快照和计算规则 |
| `research/` | 历史学费、来源和资料缺口 |
| `compile-history.cjs` | 根据资料生成 `src/history.js` |
| `build.cjs` | 生成独立的 `dist/index.html` |
| `export-fees.cjs` | 导出带来源的学费匹配表 |
| `tests/` | 核心计算与浏览器检查 |

`dist/`、`src/history.js` 和 `qa/` 是生成文件，不提交到 Git。自行部署时，构建后把 `dist/` 的内容上传到静态网站托管平台即可；如果不想公开导出的 CSV，只上传 `index.html`。

## 一起完善

欢迎通过 [Issue](https://github.com/bsw2wzj9q9-collab/xjtlu-tuition-clock/issues) 或 Pull Request 反馈问题、改进翻译、补充学费。修改学费时，请一起提供入学年份、项目、学习形式、收费周期、适用学制和带年份的来源。更新步骤见[数据说明](docs/tuition-data.md#中文说明)。

## 开源许可

原创代码和文档采用 [MIT 许可证](LICENSE)，可以使用、修改和分发，保留许可证及版权声明即可。学校名称、商标和引用的第三方资料仍归各自权利人所有。本项目为独立学生项目，与学校没有官方隶属或背书关系。
