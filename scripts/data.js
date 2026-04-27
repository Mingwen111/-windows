// Zion Mock Data - 20 stocks, key points, news, causal chains
// All session-only data — no persistence across reload

window.STOCKS = [
  { id: '600519', name: '贵州茅台', name_en: 'Kweichow Moutai', market: 'A股', sector: '消费', is_featured: false, hot_score: 92, current_price: 1688.00, prev_close: 1667.50, change_pct: 1.23, market_cap: 21204, pe_ratio: 28.4, pb_ratio: 9.2, eps: 59.50, dividend_yield: 1.85, currency: 'CNY' },
  { id: '300750', name: '宁德时代', name_en: 'CATL', market: 'A股', sector: '新能源', is_featured: true, featured_reason: '全球动力电池出货量连续7年第一，新一代钠离子电池量产在即，海外建厂提速，估值已回落至历史中枢区间。', hot_score: 98, current_price: 218.50, prev_close: 212.42, change_pct: 2.86, market_cap: 9612, pe_ratio: 18.6, pb_ratio: 3.8, eps: 11.74, dividend_yield: 0.82, currency: 'CNY' },
  { id: '688981', name: '中芯国际', name_en: 'SMIC', market: 'A股', sector: '半导体', is_featured: false, hot_score: 78, current_price: 83.40, prev_close: 83.80, change_pct: -0.48, market_cap: 6678, pe_ratio: 56.2, pb_ratio: 2.4, eps: 1.48, dividend_yield: 0, currency: 'CNY' },
  { id: '002594', name: '比亚迪', name_en: 'BYD', market: 'A股', sector: '新能源', is_featured: false, hot_score: 88, current_price: 287.60, prev_close: 283.20, change_pct: 1.55, market_cap: 8362, pe_ratio: 22.8, pb_ratio: 4.6, eps: 12.61, dividend_yield: 0.76, currency: 'CNY' },
  { id: '600036', name: '招商银行', name_en: 'CMB', market: 'A股', sector: '金融', is_featured: false, hot_score: 70, current_price: 42.30, prev_close: 42.00, change_pct: 0.71, market_cap: 10675, pe_ratio: 6.4, pb_ratio: 0.95, eps: 6.61, dividend_yield: 5.4, currency: 'CNY' },
  { id: '300760', name: '迈瑞医疗', name_en: 'Mindray', market: 'A股', sector: '医药', is_featured: false, hot_score: 66, current_price: 268.00, prev_close: 265.60, change_pct: 0.90, market_cap: 3252, pe_ratio: 28.6, pb_ratio: 7.1, eps: 9.37, dividend_yield: 1.6, currency: 'CNY' },
  { id: '601012', name: '隆基绿能', name_en: 'LONGi', market: 'A股', sector: '新能源', is_featured: false, hot_score: 60, current_price: 24.50, prev_close: 24.80, change_pct: -1.21, market_cap: 1856, pe_ratio: 14.2, pb_ratio: 1.5, eps: 1.73, dividend_yield: 2.1, currency: 'CNY' },
  { id: '601318', name: '中国平安', name_en: 'Ping An', market: 'A股', sector: '金融', is_featured: false, hot_score: 72, current_price: 48.80, prev_close: 48.50, change_pct: 0.62, market_cap: 8898, pe_ratio: 8.2, pb_ratio: 1.0, eps: 5.95, dividend_yield: 4.8, currency: 'CNY' },
  { id: '300059', name: '东方财富', name_en: 'East Money', market: 'A股', sector: '科技', is_featured: false, hot_score: 75, current_price: 18.90, prev_close: 18.30, change_pct: 3.28, market_cap: 2986, pe_ratio: 32.5, pb_ratio: 3.8, eps: 0.58, dividend_yield: 0.5, currency: 'CNY' },
  { id: '603288', name: '海天味业', name_en: 'Haitian', market: 'A股', sector: '消费', is_featured: false, hot_score: 55, current_price: 38.60, prev_close: 38.40, change_pct: 0.52, market_cap: 2148, pe_ratio: 36.2, pb_ratio: 6.8, eps: 1.07, dividend_yield: 1.9, currency: 'CNY' },
  { id: '600276', name: '恒瑞医药', name_en: 'Hengrui', market: 'A股', sector: '医药', is_featured: false, hot_score: 58, current_price: 45.20, prev_close: 45.30, change_pct: -0.22, market_cap: 2882, pe_ratio: 52.6, pb_ratio: 5.2, eps: 0.86, dividend_yield: 0.6, currency: 'CNY' },
  { id: '002475', name: '立讯精密', name_en: 'Luxshare', market: 'A股', sector: '科技', is_featured: false, hot_score: 68, current_price: 37.80, prev_close: 37.10, change_pct: 1.88, market_cap: 2724, pe_ratio: 22.4, pb_ratio: 4.8, eps: 1.69, dividend_yield: 0.8, currency: 'CNY' },
  { id: '601166', name: '兴业银行', name_en: 'Industrial Bank', market: 'A股', sector: '金融', is_featured: false, hot_score: 52, current_price: 24.10, prev_close: 24.00, change_pct: 0.42, market_cap: 5008, pe_ratio: 5.2, pb_ratio: 0.6, eps: 4.63, dividend_yield: 6.2, currency: 'CNY' },
  { id: '601088', name: '中国神华', name_en: 'Shenhua', market: 'A股', sector: '能源', is_featured: false, hot_score: 65, current_price: 38.50, prev_close: 38.20, change_pct: 0.78, market_cap: 7649, pe_ratio: 11.4, pb_ratio: 1.6, eps: 3.38, dividend_yield: 7.2, currency: 'CNY' },
  { id: '00700', name: '腾讯控股', name_en: 'Tencent', market: '港股', sector: '科技', is_featured: true, featured_reason: '微信月活14亿稳定增长，游戏出海与视频号商业化双引擎发力，港股回购规模创历史新高，基本面与估值双双改善。', hot_score: 96, current_price: 413.20, prev_close: 407.60, change_pct: 1.37, market_cap: 38640, pe_ratio: 16.8, pb_ratio: 4.2, eps: 24.60, dividend_yield: 0.9, currency: 'HKD' },
  { id: '03690', name: '美团', name_en: 'Meituan', market: '港股', sector: '消费', is_featured: false, hot_score: 74, current_price: 135.60, prev_close: 136.50, change_pct: -0.66, market_cap: 8326, pe_ratio: 28.4, pb_ratio: 4.5, eps: 4.78, dividend_yield: 0, currency: 'HKD' },
  { id: '01211', name: '比亚迪（港）', name_en: 'BYD HK', market: '港股', sector: '新能源', is_featured: false, hot_score: 71, current_price: 263.40, prev_close: 260.60, change_pct: 1.08, market_cap: 7720, pe_ratio: 21.2, pb_ratio: 4.3, eps: 12.42, dividend_yield: 0.78, currency: 'HKD' },
  { id: 'NVDA', name: '英伟达', name_en: 'NVIDIA', market: '美股', sector: '半导体', is_featured: true, featured_reason: 'Blackwell架构GPU供不应求，AI算力基础设施投资持续加码，FY2025营收指引超预期，科技巨头资本开支扩张直接受益。', hot_score: 100, current_price: 875.40, prev_close: 857.10, change_pct: 2.14, market_cap: 21580, pe_ratio: 68.2, pb_ratio: 42.6, eps: 12.84, dividend_yield: 0.03, currency: 'USD' },
  { id: 'AAPL', name: '苹果', name_en: 'Apple', market: '美股', sector: '科技', is_featured: false, hot_score: 90, current_price: 169.80, prev_close: 168.24, change_pct: 0.93, market_cap: 26210, pe_ratio: 27.6, pb_ratio: 38.4, eps: 6.15, dividend_yield: 0.56, currency: 'USD' },
  { id: 'TSLA', name: '特斯拉', name_en: 'Tesla', market: '美股', sector: '新能源', is_featured: false, hot_score: 85, current_price: 172.50, prev_close: 175.00, change_pct: -1.42, market_cap: 5482, pe_ratio: 42.6, pb_ratio: 7.2, eps: 4.05, dividend_yield: 0, currency: 'USD' }
];

window.SECTORS = ['全部', '科技', '新能源', '半导体', '消费', '医药', '金融', '能源'];
window.MARKETS = ['全部', 'A股', '港股', '美股'];
window.SORTS = [
  { id: 'hot', label: '热门' },
  { id: 'event_count', label: '事件最多' },
  { id: 'gain_desc', label: '涨幅最大' },
  { id: 'loss_desc', label: '跌幅最大' }
];

// Generate K-line data with seeded random
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function genKline(stock, days, period = 'daily') {
  const rand = seededRand(stock.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + days);
  const result = [];
  let price = stock.current_price * (period === 'daily' ? 0.85 : period === 'weekly' ? 0.7 : 0.55);
  const today = new Date('2025-04-25');
  const stepDays = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * stepDays);
    const volatility = price * 0.025;
    const drift = (rand() - 0.48) * volatility;
    const open = price;
    const close = +(price + drift).toFixed(2);
    const high = +(Math.max(open, close) + rand() * volatility * 0.5).toFixed(2);
    const low = +(Math.min(open, close) - rand() * volatility * 0.5).toFixed(2);
    const volume = Math.floor((rand() * 0.5 + 0.5) * 1000000);
    result.push({ date: d.toISOString().slice(0, 10), open, high, low, close, volume, change_pct: +(((close - open) / open) * 100).toFixed(2) });
    price = close;
  }
  // Force last close to current_price
  if (result.length) {
    const last = result[result.length - 1];
    last.close = stock.current_price;
    last.high = Math.max(last.high, stock.current_price);
    last.low = Math.min(last.low, stock.current_price);
  }
  return result;
}

window.getKline = function(stockId, period = 'daily') {
  const stock = window.STOCKS.find(s => s.id === stockId);
  if (!stock) return [];
  const cnt = period === 'daily' ? 120 : period === 'weekly' ? 52 : 24;
  if (!stock._kline) stock._kline = {};
  if (!stock._kline[period]) stock._kline[period] = genKline(stock, cnt, period);
  return stock._kline[period];
};

// Key points - generate 5-8 per stock with type distribution
const KP_TEMPLATES = {
  'NVDA': [
    { offset: -8, title: 'Blackwell B200 量产交付', label: '利好', short: '新一代AI芯片正式量产，主要云厂商订单确认' },
    { offset: -16, title: 'FY2025 Q4 财报超预期', label: '利好', short: '数据中心营收同比增长409%，远超华尔街预期' },
    { offset: -25, title: '美对华芯片管制升级', label: '利空', short: '商务部新规将H800加入限制清单，中国市场承压' },
    { offset: -35, title: 'GTC 大会发布 AI 工厂战略', label: '利好', short: 'NIM 微服务平台发布，软件订阅业务初见端倪' },
    { offset: -48, title: 'AMD MI300X 出货加速', label: '利空', short: '主要竞争对手AI加速器订单增长，市场竞争加剧' },
    { offset: -60, title: '与台积电签订CoWoS扩产协议', label: '中性', short: '保障2025-2026年高端封装产能，缓解供应瓶颈' },
    { offset: -75, title: '英伟达加入道琼斯指数', label: '利好', short: '取代英特尔加入道指，被动配置资金流入' },
    { offset: -90, title: '内部高管减持披露', label: '中性', short: '多名高管按计划减持股票，符合预设交易计划' }
  ],
  '300750': [
    { offset: -6, title: '钠离子电池量产时间表确认', label: '利好', short: '宣布2025年Q3实现钠离子电池规模量产' },
    { offset: -15, title: '匈牙利工厂产能爬坡', label: '利好', short: '欧洲首座工厂顺利投产，年产能达40GWh' },
    { offset: -22, title: 'Q1 业绩低于分析师预期', label: '利空', short: '净利润同比下滑10.6%，毛利率承压' },
    { offset: -33, title: '碳酸锂价格大幅下跌', label: '利空', short: '上游材料价格走低，影响存货跌价准备' },
    { offset: -45, title: '与福特签署LFP电池供应协议', label: '利好', short: '北美市场新增大客户，长期订单可见度提升' },
    { offset: -60, title: '研发新型凝聚态电池', label: '中性', short: '能量密度突破500Wh/kg，eVTOL应用前景广阔' },
    { offset: -85, title: '股东减持公告', label: '中性', short: '部分早期投资人按计划减持，市场反应平淡' }
  ],
  '00700': [
    { offset: -5, title: '《元梦之星》流水超预期', label: '利好', short: '春节档活动表现强劲，单日峰值流水创新高' },
    { offset: -18, title: '视频号广告收入翻倍', label: '利好', short: 'Q4视频号广告收入同比增长超100%' },
    { offset: -28, title: '游戏版号审批趋紧', label: '利空', short: '4月版号数量低于市场预期，影响新品节奏' },
    { offset: -42, title: '回购规模创历史新高', label: '利好', short: '年内累计回购金额突破500亿港币' },
    { offset: -58, title: '海外市场监管不确定性', label: '利空', short: '部分地区对中国应用监管政策收紧' },
    { offset: -78, title: '腾讯云重组完成', label: '中性', short: '云业务架构调整，聚焦头部客户和AI业务' }
  ],
  '600519': [
    { offset: -8, title: '直营渠道占比提升', label: '利好', short: 'i茅台月活创新高，直营收入占比达45%' },
    { offset: -22, title: '出厂价上调消息', label: '利好', short: '飞天茅台出厂价上调20%，Q2业绩有望加速' },
    { offset: -38, title: '高端白酒消费疲软', label: '利空', short: '行业去库存持续，部分经销商主动降价' },
    { offset: -55, title: '管理层人事变动', label: '中性', short: '新任总经理上任，市场关注战略延续性' },
    { offset: -75, title: '新品发布推迟', label: '利空', short: '高端新品上市时间晚于预期，影响估值' }
  ],
  '002594': [
    { offset: -6, title: '海洋系列发布', label: '利好', short: '新一代刀片电池量产，搭载多款新车型' },
    { offset: -16, title: '欧洲销量月度新高', label: '利好', short: '4月欧洲市场交付量同比增长250%' },
    { offset: -28, title: '价格战压力加剧', label: '利空', short: '国内竞品集中降价，毛利率压力上升' },
    { offset: -42, title: '智能驾驶 v3.0 发布', label: '利好', short: '高速NOA全国开通，智驾水平接近第一梯队' },
    { offset: -58, title: '海外建厂进展顺利', label: '中性', short: '泰国、巴西工厂按期投产' },
    { offset: -78, title: '原材料成本上行', label: '利空', short: '稀土、锂资源价格反弹影响成本' }
  ]
};

const DEFAULT_KPS = (price) => ([
  { offset: -7, title: '财报披露超预期', label: '利好', short: '本季度营收和利润均超分析师一致预期' },
  { offset: -22, title: '行业政策利好', label: '利好', short: '主管部门发布支持性政策，行业景气度提升' },
  { offset: -38, title: '上游成本上行', label: '利空', short: '原材料价格上涨影响公司毛利率' },
  { offset: -52, title: '机构调研活动', label: '中性', short: '多家头部机构集中调研，关注未来战略' },
  { offset: -75, title: '主要客户订单变化', label: '利空', short: '主要客户调整采购节奏，短期收入承压' }
]);

window.getKeyPoints = function(stockId) {
  const stock = window.STOCKS.find(s => s.id === stockId);
  if (!stock) return [];
  if (stock._kps) return stock._kps;
  const tpl = KP_TEMPLATES[stockId] || DEFAULT_KPS();
  const today = new Date('2025-04-25');
  stock._kps = tpl.map((t, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + t.offset);
    return {
      id: `KP_${stockId}_${String(i + 1).padStart(3, '0')}`,
      stock_id: stockId,
      title: t.title,
      date: d.toISOString().slice(0, 10),
      short_desc: t.short,
      ai_label: t.label,
      priority: t.label === '利空' ? 1 : t.label === '利好' ? 2 : 3,
      has_causal: i === 0 || i === 2  // First and third have causal chains
    };
  });
  return stock._kps;
};

// Q&A presets
window.AI_QA = [
  { keys: ['涨', '上涨', '为什么涨'], answer: '近期主要由几个利好关键点推动：业绩超预期、行业政策利好以及机构资金流入。建议查看上方AI报告中的"影响因素分析"章节，可以看到完整的因果链条。' },
  { keys: ['跌', '下跌', '为什么跌'], answer: '近期承压主要来自利空事件：上游成本上行、行业竞争加剧。建议关注"潜在风险因素"章节。' },
  { keys: ['买', '能买吗', '值得'], answer: '本平台不构成任何投资建议。请综合参考AI分析报告中的估值、风险与因果链分析，结合您自身的风险偏好做出决策。投资有风险，入市须谨慎。' },
  { keys: ['市盈率', 'pe', '估值'], answer: '当前市盈率与行业均值和五年历史均值的对比详见报告"关键财务与估值指标"章节中的对比条形图。' },
  { keys: ['关键事件', '最近发生', '什么事'], answer: '最近的3个关键点已在K线图上用菱形标出，鼠标悬浮可查看详情。点击"查看详情"可进入完整分析。' },
  { keys: ['资金', '主力', '机构'], answer: '近5日主力资金呈净流入状态，详见下方"资金流向"Tab中的正负柱状图。' },
  { keys: ['技术', '支撑', '压力'], answer: 'AI报告"市场动向"章节给出了短期支撑位和压力位区间。' }
];

window.getAnswer = function(q) {
  const ql = q.toLowerCase();
  for (const item of window.AI_QA) {
    if (item.keys.some(k => ql.includes(k.toLowerCase()))) return item.answer;
  }
  return '这是一个很好的问题，目前我对该股票的AI分析尚在完善中，请参考上方报告中的详细分析。如有投资决策需求，请咨询专业投资顾问。';
};

// News templates
window.getNews = function(stockId) {
  const stock = window.STOCKS.find(s => s.id === stockId);
  if (!stock) return [];
  if (stock._news) return stock._news;
  const today = new Date('2025-04-25');
  const items = [
    { type: 'news', source: '财联社', title: `${stock.name}发布最新季度业绩，关键指标全面向好`, ai: '利好' },
    { type: 'news', source: '彭博社', title: `分析师上调${stock.name}目标价，看好未来12个月表现`, ai: '利好' },
    { type: 'policy', source: '证监会', title: `${stock.sector}行业新规出台，强化合规与信息披露`, ai: '中性' },
    { type: 'news', source: '路透社', title: `${stock.name}与海外大客户签署框架协议`, ai: '利好' },
    { type: 'news', source: '新华社', title: `行业景气度调查：${stock.sector}板块景气指数环比上升`, ai: '利好' },
    { type: 'policy', source: '工信部', title: `推动${stock.sector}产业高质量发展指导意见发布`, ai: '中性' },
    { type: 'news', source: '澎湃财经', title: `机构调研显示${stock.name}订单能见度提升`, ai: '利好' },
    { type: 'news', source: '21世纪经济报道', title: `${stock.name}内部架构调整，聚焦核心业务`, ai: '中性' }
  ];
  stock._news = items.map((it, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 2 - 1);
    d.setHours(9 + (i % 8), 30 + i * 5);
    return {
      id: `NEWS_${stockId}_${String(i + 1).padStart(3, '0')}`,
      ...it,
      publish_time: d.toISOString().slice(0, 16).replace('T', ' '),
      summary: `${it.title}。本次事件预计对公司基本面产生积极影响，市场对此反应积极。后续需关注实施进度与具体落地节奏。`,
      content: `${it.title}\n\n根据最新披露信息显示，${stock.name}在本次事件中展现了较强的执行力和战略定力。市场普遍认为，此次进展将对公司中长期发展产生积极影响。\n\n从行业层面看，${stock.sector}板块整体呈现回暖趋势，多家头部公司近期均有积极动作。机构投资者普遍看好该板块未来3-6个月的表现。\n\n分析师指出，需要持续关注的关键变量包括：1）实施进度与落地节奏；2）竞争对手的反应与策略调整；3）宏观经济与行业政策环境的变化。\n\n本平台所提供信息仅供参考，不构成投资建议。投资有风险，入市须谨慎。`
    };
  });
  return stock._news;
};

// Causal chain - generic 3-layer template
window.getCausalChain = function(stockId, kpId) {
  const stock = window.STOCKS.find(s => s.id === stockId);
  if (!stock) return null;
  if (stockId === 'NVDA') {
    return {
      chain_id: 'CC_NVDA_001',
      root_kp_id: kpId,
      nodes: [
        { id: 'N001', layer: 3, x: 0, title: '美对华芯片出口管制升级', date: '2023-10', content: '美国商务部更新出口管制规则，将H800/A800加入限制清单，中国数据中心客户无法采购NVIDIA高端GPU' },
        { id: 'N002', layer: 2, x: 0, title: '数据中心业务格局重构', date: '2023-11', content: '中国市场营收占比从原25%大幅压缩，NVIDIA被迫推出H20等特供版本，高性能计算市场竞争格局发生变化', is_focal: true },
        { id: 'N003', layer: 1, x: 0, title: '华为昇腾填补市场空缺', date: '2024-Q1', content: '国内AI企业加速采购华为昇腾910B，华为AI芯片订单量同比增长300%以上' },
        { id: 'N004', layer: 1, x: 1, title: '美欧盟友市场需求激增', date: '2024-Q1', content: '中国限制导致欧美日本等地区数据中心加快抢购NVIDIA芯片，订单积压创历史纪录' },
        { id: 'N005', layer: 0, x: 0, title: 'NVIDIA全球营收超预期增长', date: '2024-Q2', content: '美国等非中国市场强劲弥补中国损失，FY2024Q3数据中心营收同比增长279%，股价创历史新高' }
      ],
      edges: [
        { from: 'N001', to: 'N002', type: 'direct' },
        { from: 'N002', to: 'N003', type: 'direct' },
        { from: 'N002', to: 'N004', type: 'direct' },
        { from: 'N003', to: 'N005', type: 'indirect' },
        { from: 'N004', to: 'N005', type: 'direct' }
      ]
    };
  }
  // Generic template based on stock
  return {
    chain_id: `CC_${stockId}_001`,
    root_kp_id: kpId,
    nodes: [
      { id: 'N001', layer: 3, x: 0, title: `${stock.sector}行业宏观政策变化`, date: '2024-Q3', content: `主管部门发布${stock.sector}行业指导文件，从顶层设计上影响整个行业发展节奏` },
      { id: 'N002', layer: 2, x: 0, title: `${stock.sector}产业链重塑`, date: '2024-Q4', content: '产业链上下游开始联动调整，头部公司加速整合，行业集中度进一步提升', is_focal: true },
      { id: 'N003', layer: 1, x: 0, title: `${stock.name}加大研发投入`, date: '2025-Q1', content: '公司宣布大幅提升研发预算，重点投向核心技术与前沿领域' },
      { id: 'N004', layer: 1, x: 1, title: '主要竞争对手承压', date: '2025-Q1', content: '行业竞争对手遭遇技术或资金困难，市场份额向头部公司集中' },
      { id: 'N005', layer: 0, x: 0, title: `${stock.name}基本面持续改善`, date: '2025-Q2', content: '公司收入与利润双双超预期，估值中枢上移' }
    ],
    edges: [
      { from: 'N001', to: 'N002', type: 'direct' },
      { from: 'N002', to: 'N003', type: 'direct' },
      { from: 'N002', to: 'N004', type: 'direct' },
      { from: 'N003', to: 'N005', type: 'direct' },
      { from: 'N004', to: 'N005', type: 'indirect' }
    ]
  };
};

// AI Reports
window.getAIReport = function(stockId, period = 'daily') {
  const stock = window.STOCKS.find(s => s.id === stockId);
  if (!stock) return null;
  const periodLabel = { daily: '日报', weekly: '周报', monthly: '月报' }[period];
  const periodCN = { daily: '今日', weekly: '本周', monthly: '本月' }[period];
  const dir = stock.change_pct >= 0 ? '上涨' : '下跌';
  return {
    period,
    period_label: periodLabel,
    title: `${stock.name} ${periodCN}表现解读：${dir} ${Math.abs(stock.change_pct).toFixed(2)}%，事件驱动主导行情`,
    summary: `${stock.name}${periodCN}收报 ${stock.current_price.toFixed(2)} ${stock.currency}，较前一交易日${dir} ${Math.abs(stock.change_pct).toFixed(2)}%。多重事件叠加影响，建议结合关键点详情查看完整分析逻辑。`,
    sections: {
      performance: `${stock.name}（${stock.id}）${periodCN}收盘报 ${stock.current_price.toFixed(2)} ${stock.currency}，较前一交易日${dir} ${Math.abs(stock.change_pct).toFixed(2)}%（${(stock.current_price - stock.prev_close).toFixed(2)} ${stock.currency}）。盘中走势上，开盘后受到 ${stock.sector} 板块整体情绪影响，呈现震荡格局，午后在大单流入推动下逐步走强，临近收盘维持升势。`,
      financials: `当前市盈率（P/E TTM）${stock.pe_ratio.toFixed(1)} 倍，市净率（P/B）${stock.pb_ratio.toFixed(2)} 倍，每股收益（EPS）${stock.eps.toFixed(2)} ${stock.currency}，股息率 ${stock.dividend_yield.toFixed(2)}%。总市值 ${stock.market_cap.toFixed(0)} 亿。从估值水平看，当前 P/E 处于行业均值附近，相较五年历史均值略有溢价。`,
      market: `下次财报披露窗口预计在 6 周后。技术面看，短期支撑位约为当前价格的 95%，压力位约为 108%。分析师评级方面，多数机构维持"买入"或"增持"，少数给出"持有"，"卖出"评级占比较低。`,
      events: `本期表现的核心驱动力来自几个关键事件：

**业绩超预期** —— 最新财报显示公司核心业务保持稳健增长，主要财务指标全面向好，市场对未来盈利增长的预期明显改善。

**行业景气度** —— ${stock.sector} 板块整体回暖，主管部门发布的政策文件进一步明确了行业发展方向，头部公司确定性受益。

**资金面** —— 近期主力资金呈现净流入态势，机构调研活动密集，反映出大资金对公司基本面的认可。

需要注意的是，部分利空事件如上游成本上行、海外市场不确定性等仍在演绎，对公司中短期业绩可能带来一定扰动。`,
      risks: `1. 行业竞争加剧风险：核心赛道竞争对手众多，价格战可能压缩毛利率空间。

2. 宏观经济波动风险：消费需求与企业开支节奏受到宏观经济影响。

3. 监管政策不确定性：相关行业政策的具体执行细则仍待明确，存在变化空间。`,
      footer: `数据来源：公开市场行情数据、公司公告、行业研究报告。本报告由 AI 基于结构化数据自动生成，仅供参考，不构成任何投资建议。投资有风险，入市须谨慎。`
    }
  };
};

window.getStock = function(id) { return window.STOCKS.find(s => s.id === id); };

// getNodeCausalChain: traces WHY the clicked event happened.
// The clicked node (nodeTitle) is placed at layer:0 = bottom conclusion.
// All nodes above it are its upstream causes.
window.getNodeCausalChain = function(nodeId, nodeTitle, stockId) {
  return {
    chain_id: `CC_NODE_${nodeId}`,
    root_kp_id: nodeId,
    nodes: [
      { id: `${nodeId}_A`, layer: 3, x: 0, title: '宏观政策与监管环境', date: '2022-Q4',
        content: '宏观政策收紧与监管环境变化是此类事件发生的根本背景，源自更高层面的战略考量与博弈。' },
      { id: `${nodeId}_B`, layer: 3, x: 1, title: '行业竞争格局演变', date: '2022-Q4',
        content: '主要参与者之间的竞争持续加剧，技术路线与市场份额争夺进入关键节点。' },
      { id: `${nodeId}_C`, layer: 2, x: 0, title: '利益方博弈与决策推进', date: '2023-Q1',
        content: '相关利益方就政策、资源与市场准入展开深度博弈，关键决策事项进入实质讨论阶段。' },
      { id: `${nodeId}_D`, layer: 1, x: 0, title: '触发条件与时机成熟', date: '2023-Q2',
        content: '关键触发条件逐步具备，市场预期与舆论共识形成，事件进入倒计时阶段。' },
      { id: `${nodeId}_E`, layer: 0, x: 0, title: nodeTitle, date: '2023-Q4',
        content: `${nodeTitle}是上述多重因素共同积累、持续演进的必然结果，各前置条件成熟后的集中显现。`,
        is_focal: true }
    ],
    edges: [
      { from: `${nodeId}_A`, to: `${nodeId}_C`, type: 'direct' },
      { from: `${nodeId}_B`, to: `${nodeId}_C`, type: 'indirect' },
      { from: `${nodeId}_C`, to: `${nodeId}_D`, type: 'direct' },
      { from: `${nodeId}_D`, to: `${nodeId}_E`, type: 'direct' }
    ]
  };
};
