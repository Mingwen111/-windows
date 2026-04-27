// Stock Detail Page - K-line + AI panel + bottom tabs
const { useState: uS_D, useMemo: uM_D, useRef: uR_D, useEffect: uE_D } = React;

function DetailPage({ stockId }) {
  const { aiModalOpen, setAiModalOpen, sidebarCollapsed, setSidebarCollapsed, kpModalOpen, setKpModalOpen } = useApp();
  const [period, setPeriod] = uS_D('daily');
  const [maType, setMaType] = uS_D('SMA');
  const [maPeriod, setMaPeriod] = uS_D(20);
  const [bottomTab, setBottomTab] = uS_D('company');
  const [bottomTimeFilter, setBottomTimeFilter] = uS_D('week');
  const [hoverKp, setHoverKp] = uS_D(null);
  const hoverHideTimer = uR_D(null);
  const [klineWidthFraction, setKlineWidthFraction] = uS_D(1);
  const [aiPeriod, setAiPeriod] = uS_D('daily');
  const [qaInput, setQaInput] = uS_D('');
  const [qaHistory, setQaHistory] = uS_D([]);
  const stock = window.getStock(stockId);
  if (!stock) return <div style={{ padding: 40 }}>股票不存在</div>;

  const kpts = window.getKeyPoints(stockId);
  const kline = window.getKline(stockId, period);
  const aiReport = window.getAIReport(stockId, aiPeriod);

  // AI panel & K-line linkage
  const setAiPeriodLink = (p) => { setAiPeriod(p); setPeriod(p); };
  const setKlinePeriodLink = (p) => { setPeriod(p); setAiPeriod(p); };

  // When AI modal opens, sidebar collapses
  uE_D(() => {
    if (aiModalOpen) setSidebarCollapsed(true);
  }, [aiModalOpen]);

  const handleQa = () => {
    if (!qaInput.trim()) return;
    const ans = window.getAnswer(qaInput);
    setQaHistory(h => [...h.slice(-9), { q: qaInput, a: ans }]);
    setQaInput('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header bar */}
      <DetailHeader stock={stock}/>

      {/* Top region: K-line + (AI modal squeezed in) + AI panel */}
      <div style={{ display: 'flex', gap: 0, padding: '16px 24px', height: 520, position: 'relative' }}>
        {/* K-line area - squeezed when modal open */}
        <div style={{
          flex: aiModalOpen ? '0 0 38%' : 1,
          transition: 'flex 220ms ease',
          paddingRight: 16, minWidth: 0
        }}>
          <KlineCard
            stock={stock} kline={kline} period={period} setPeriod={setKlinePeriodLink}
            maType={maType} setMaType={setMaType} maPeriod={maPeriod} setMaPeriod={setMaPeriod}
            kpts={kpts} hoverKp={hoverKp} setHoverKp={setHoverKp}
            hoverHideTimer={hoverHideTimer}
            onOpenKp={(id) => setKpModalOpen(id)}
            squeezed={aiModalOpen}
          />
        </div>

        {/* AI Modal (in-flow, squeezed between K-line and AI panel) */}
        {aiModalOpen && (
          <div style={{
            flex: '0 0 32%',
            paddingRight: 16, minWidth: 0,
            animation: 'slideInLeft 220ms ease-out'
          }}>
            <AIReportModal stock={stock} report={aiReport} onClose={() => setAiModalOpen(false)}/>
          </div>
        )}

        {/* AI Panel (right) */}
        <div style={{ flex: aiModalOpen ? '0 0 30%' : '0 0 36%', minWidth: 320 }}>
          <AIPanel stock={stock} aiPeriod={aiPeriod} setAiPeriod={setAiPeriodLink}
            report={aiReport} onOpen={() => setAiModalOpen(true)}
            qaInput={qaInput} setQaInput={setQaInput} qaHistory={qaHistory} handleQa={handleQa}/>
        </div>
      </div>

      {/* Bottom Tabs - statically about 1/5 viewport, scrollable as part of page */}
      <BottomTabs stock={stock} kpts={kpts} bottomTab={bottomTab} setBottomTab={setBottomTab}
        bottomTimeFilter={bottomTimeFilter} setBottomTimeFilter={setBottomTimeFilter}/>

      {/* KP Modal */}
      {kpModalOpen && <KeyPointModal kpId={kpModalOpen} stockId={stockId} onClose={() => setKpModalOpen(null)}/>}
    </div>
  );
}

function DetailHeader({ stock }) {
  const { isFav, toggleFavorite, navigate } = useApp();
  const fav = isFav(stock.id);
  const up = stock.change_pct >= 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '16px 24px', background: 'var(--bg-base)',
      borderBottom: '1px solid var(--border-default)'
    }}>
      <button onClick={() => navigate({ name: 'recommend' })} className="btn-ghost"
        style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, flexShrink: 0 }}>
        <Icon.ChevronLeft size={14}/> 推荐
      </button>
      <div style={{ width: 1, height: 24, background: 'var(--border-default)', flexShrink: 0 }}/>
      <StockBlock code={stock.id} market={stock.market} size={48}/>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{stock.name}</h1>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stock.id}</span>
          <span className="tag tag-market">{stock.market}</span>
          <span className="tag tag-market">{stock.sector}</span>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: up ? 'var(--quote-up)' : 'var(--quote-down)' }}>
          {stock.current_price.toFixed(2)}
          <span style={{ fontSize: 14, color: 'var(--text-tertiary)', marginLeft: 8 }}>{stock.currency}</span>
        </div>
        <div style={{ fontSize: 14, color: up ? 'var(--quote-up)' : 'var(--quote-down)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          {up ? '+' : ''}{(stock.current_price - stock.prev_close).toFixed(2)} · {up ? '+' : ''}{stock.change_pct.toFixed(2)}%
        </div>
      </div>
      <button onClick={() => toggleFavorite(stock.id)} className="btn-secondary"
        style={{ height: 36, color: fav ? 'var(--warning-600)' : 'var(--text-secondary)' }}>
        <Icon.Star size={14} fill={fav}/>
        <span style={{ marginLeft: 6 }}>{fav ? '已收藏' : '收藏'}</span>
      </button>
    </div>
  );
}

function KlineCard({ stock, kline, period, setPeriod, maType, setMaType, maPeriod, setMaPeriod, kpts, hoverKp, setHoverKp, hoverHideTimer, onOpenKp, squeezed }) {
  const scheduleHide = () => {
    clearTimeout(hoverHideTimer.current);
    hoverHideTimer.current = setTimeout(() => setHoverKp(null), 200);
  };
  const cancelHide = () => clearTimeout(hoverHideTimer.current);
  const containerRef = uR_D(null);
  const [w, setW] = uS_D(700);
  uE_D(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setW(e.contentRect.width);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const h = 380;
  const padL = 50, padR = 16, padT = 16, padB = 28;
  const innerW = Math.max(100, w - padL - padR);
  const innerH = h - padT - padB;

  const prices = kline.flatMap(b => [b.high, b.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const stepX = innerW / Math.max(1, kline.length);
  const candleW = Math.max(2, stepX * 0.6);

  const yFor = (p) => padT + ((maxP - p) / range) * innerH;
  const xFor = (i) => padL + i * stepX + stepX / 2;

  // SMA calc
  const ma = [];
  for (let i = 0; i < kline.length; i++) {
    if (i < maPeriod - 1) { ma.push(null); continue; }
    let sum = 0;
    for (let j = i - maPeriod + 1; j <= i; j++) sum += kline[j].close;
    ma.push(sum / maPeriod);
  }

  // Map kpts to bar indices by date
  const dateIndex = {};
  kline.forEach((b, i) => { dateIndex[b.date] = i; });
  const visibleKps = kpts.map(k => {
    // find nearest bar
    let idx = dateIndex[k.date];
    if (idx === undefined) {
      const t = new Date(k.date).getTime();
      let best = -1, bestDiff = Infinity;
      kline.forEach((b, i) => {
        const d = Math.abs(new Date(b.date).getTime() - t);
        if (d < bestDiff) { bestDiff = d; best = i; }
      });
      idx = best;
    }
    return idx >= 0 ? { ...k, _i: idx, _bar: kline[idx] } : null;
  }).filter(Boolean);

  // Aggregate same idx
  const grouped = {};
  visibleKps.forEach(k => { (grouped[k._i] = grouped[k._i] || []).push(k); });

  return (
    <div ref={containerRef} style={{
      background: 'var(--bg-base)', borderRadius: 12,
      border: '1px solid var(--border-default)', padding: 16, height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>K线图</span>
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {[['daily', '日K'], ['weekly', '周K'], ['monthly', '月K']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: period === v ? 'var(--primary-500)' : 'transparent',
              color: period === v ? '#fff' : 'var(--text-secondary)'
            }}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Select value={maType} onChange={setMaType} options={['SMA', 'EMA', 'BOLL']} label="均线"/>
          <Select value={String(maPeriod)} onChange={(v) => setMaPeriod(Number(v))} options={['5', '10', '20', '60']} labels={{'5':'5日','10':'10日','20':'20日','60':'60日'}} label="周期"/>
        </div>
      </div>

      <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padT + p * innerH;
          const val = maxP - p * range;
          return (
            <g key={i}>
              <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="var(--border-default)" strokeWidth={1}/>
              <text x={padL - 6} y={y + 3} textAnchor="end" fontSize={10} fill="var(--text-muted)" fontFamily="var(--font-mono)">{val.toFixed(2)}</text>
            </g>
          );
        })}
        {/* Candles */}
        {kline.map((b, i) => {
          const x = xFor(i);
          const isUp = b.close >= b.open;
          const color = isUp ? 'var(--quote-up)' : 'var(--quote-down)';
          const yO = yFor(b.open), yC = yFor(b.close), yH = yFor(b.high), yL = yFor(b.low);
          const top = Math.min(yO, yC), height = Math.max(1, Math.abs(yO - yC));
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth={1}/>
              <rect x={x - candleW/2} y={top} width={candleW} height={height} fill={color}/>
            </g>
          );
        })}
        {/* MA line */}
        <path d={ma.map((v, i) => v == null ? null : `${i === 0 || ma[i-1] == null ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`).filter(Boolean).join(' ')}
          stroke="var(--primary-500)" strokeWidth={1.5} fill="none" opacity={0.7}/>

        {/* X axis labels */}
        {kline.filter((_, i) => i % Math.ceil(kline.length / 6) === 0).map((b, _, arr) => {
          const i = kline.indexOf(b);
          return (
            <text key={i} x={xFor(i)} y={h - 8} textAnchor="middle" fontSize={10} fill="var(--text-muted)" fontFamily="var(--font-mono)">
              {b.date.slice(5)}
            </text>
          );
        })}

        {/* Key Point markers */}
        {Object.entries(grouped).map(([i, group]) => {
          const idx = Number(i);
          const bar = kline[idx];
          const x = xFor(idx);
          const y = yFor(bar.high) - 16;
          const top = group.reduce((a, k) => a.priority < k.priority ? a : k);
          const color = top.ai_label === '利空' ? 'var(--kp-bearish)' : top.ai_label === '利好' ? 'var(--kp-bullish)' : 'var(--kp-neutral)';
          return (
            <g key={i}
              onMouseEnter={() => { cancelHide(); setHoverKp({ group, x, y, idx }); }}
              onMouseLeave={scheduleHide}
              onClick={() => { cancelHide(); setHoverKp({ group, x, y, idx }); }}
              style={{ cursor: 'pointer' }}>
              {/* Invisible hit-pad bridging marker → card */}
              <rect x={x - 14} y={y - 10} width={28} height={32} fill="transparent"/>
              <polygon points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`} fill={color}/>
              {group.length > 1 && (
                <g transform={`translate(${x + 5}, ${y - 9})`}>
                  <circle r={6} fill="var(--neutral-900)"/>
                  <text textAnchor="middle" y={3} fontSize={9} fill="#fff" fontWeight={700}>{group.length}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover Card */}
      {hoverKp && (
        <KpHoverCard
          group={hoverKp.group}
          x={hoverKp.x} y={hoverKp.y}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          onOpen={(id) => { cancelHide(); setHoverKp(null); onOpenKp(id); }}
        />
      )}
    </div>
  );
}

function KpHoverCard({ group, x, y, onMouseEnter, onMouseLeave, onOpen }) {
  const left = Math.max(16, Math.min(x - 140, window.innerWidth - 320));
  // top: y is marker center; card sits 14px below marker so cursor can travel onto it
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute', left, top: y + 70,
        width: 280, background: 'var(--bg-base)', borderRadius: 10,
        boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-default)',
        padding: 14, zIndex: 100, animation: 'fadeIn 100ms ease-out'
      }}>
      {/* Invisible bridge between marker and card so cursor doesn't trigger leave mid-flight */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: -70, height: 70, pointerEvents: 'auto' }}/>
      {group.map(kp => (
        <div key={kp.id} style={{ paddingBottom: group.length > 1 ? 12 : 0, borderBottom: group.length > 1 ? '1px solid var(--border-default)' : 'none', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span className={`tag tag-${kp.ai_label === '利好' ? 'bullish' : kp.ai_label === '利空' ? 'bearish' : 'neutral'}`}>{kp.ai_label}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {kp.date.replace(/-/g, '/')}
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {kp.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
            {kp.short_desc}
          </div>
          <button onClick={() => onOpen(kp.id)} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--primary-600)',
            display: 'inline-flex', alignItems: 'center', gap: 4
          }}>查看详情 <Icon.ChevronRight size={12}/></button>
        </div>
      ))}
    </div>
  );
}

function AIPanel({ stock, aiPeriod, setAiPeriod, report, onOpen, qaInput, setQaInput, qaHistory, handleQa }) {
  return (
    <div style={{
      background: 'var(--bg-base)', borderRadius: 12,
      border: '1px solid var(--border-default)', height: '100%',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Sparkles size={15}/>
          <span style={{ fontSize: 14, fontWeight: 700 }}>AI 分析</span>
        </div>
        <Select value={aiPeriod} onChange={setAiPeriod} options={['daily', 'weekly', 'monthly']} labels={{daily:'今日',weekly:'本周',monthly:'本月'}} label="周期"/>
      </div>

      {/* Summary card */}
      <div onClick={onOpen} style={{
        margin: 12, padding: 16, background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--auxiliary-50) 100%)',
        borderRadius: 10, cursor: 'pointer', border: '1px solid var(--primary-100)',
        transition: 'all 150ms', position: 'relative', overflow: 'hidden'
      }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-300)'}
         onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--primary-100)'}>
        <div style={{ fontSize: 11, color: 'var(--primary-700)', fontWeight: 600, marginBottom: 6 }}>{report.period_label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>
          {report.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {report.summary}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          点击查看详情 <Icon.ChevronRight size={12}/>
        </div>
      </div>

      {/* Q&A history */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {qaHistory.length === 0 && (
          <div style={{
            padding: 14, background: 'var(--bg-subtle)', borderRadius: 8,
            fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>试着问问 AI：</div>
            <div>· 最近为什么涨？</div>
            <div>· 现在估值贵吗？</div>
            <div>· 主力资金动向如何？</div>
          </div>
        )}
        {qaHistory.map((it, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--primary-500)', color: '#fff', padding: '8px 12px', borderRadius: 12, borderBottomRightRadius: 4, fontSize: 13 }}>
              {it.q}
            </div>
            <div style={{ alignSelf: 'flex-start', maxWidth: '90%', background: 'var(--neutral-100)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 12, borderBottomLeftRadius: 4, fontSize: 13, lineHeight: 1.6 }}>
              {it.a}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
        <input className="input-base" placeholder={`问问 AI 关于 ${stock.name}…`}
          value={qaInput} onChange={e => setQaInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleQa()}
          style={{ flex: 1, height: 36, fontSize: 13 }}/>
        <button className="btn-primary" onClick={handleQa} style={{ height: 36, padding: '0 12px' }}>
          <Icon.Send size={14}/>
        </button>
      </div>
    </div>
  );
}

function AIReportModal({ stock, report, onClose }) {
  uE_D(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sec = report.sections;
  const up = stock.change_pct >= 0;

  return (
    <div style={{
      background: 'var(--bg-base)', borderRadius: 12,
      border: '1px solid var(--border-default)', height: '100%',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.Sparkles size={15}/>
          <span style={{ fontSize: 14, fontWeight: 700 }}>AI 分析报告 · {report.period_label}</span>
        </div>
        <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}>
          <Icon.Close size={16}/>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
        {/* Title */}
        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
          {report.title}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{stock.name} · {stock.id}</span>
          <span>·</span>
          <span>2025-04-25</span>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
            background: 'var(--success-50)', color: 'var(--success-700)'
          }}>● 收盘</span>
        </div>

        <Section title="今日表现" body={sec.performance}>
          <InlineMiniBar value={stock.change_pct}/>
        </Section>

        <Section title="关键财务与估值指标" body={sec.financials}>
          <ValuationBars stock={stock}/>
        </Section>

        <Section title="市场动向" body={sec.market}>
          <RatingPie/>
        </Section>

        <Section title="影响因素分析">
          <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)' }}>
            {sec.events.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin: '0 0 12px' }} dangerouslySetInnerHTML={{
                __html: para.replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--primary-700);">$1</strong>')
              }}/>
            ))}
          </div>
        </Section>

        <Section title="潜在风险因素">
          <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.75 }}>
            {sec.risks.split('\n\n').filter(Boolean).map((line, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{line.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        </Section>

        <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border-default)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {sec.footer}
        </div>
      </div>
    </div>
  );
}

function Section({ title, body, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
      {body && <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.75 }}>{body}</p>}
      {children}
    </div>
  );
}

function InlineMiniBar({ value }) {
  const max = 5;
  const pct = Math.min(1, Math.abs(value) / max);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
      <div style={{ width: 80, height: 16, position: 'relative', background: 'var(--neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: pct * 40 + '%',
          background: value >= 0 ? 'var(--quote-up)' : 'var(--quote-down)',
          transform: value >= 0 ? 'none' : 'translateX(-100%)'
        }}/>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--text-muted)' }}/>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: value >= 0 ? 'var(--quote-up)' : 'var(--quote-down)', fontFamily: 'var(--font-mono)' }}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </span>
    </div>
  );
}

function ValuationBars({ stock }) {
  const items = [
    { label: 'P/E (TTM)', cur: stock.pe_ratio, ind: stock.pe_ratio * 0.85, hist: stock.pe_ratio * 1.1 },
    { label: 'P/B', cur: stock.pb_ratio, ind: stock.pb_ratio * 0.9, hist: stock.pb_ratio * 1.05 },
    { label: '股息率 %', cur: stock.dividend_yield, ind: stock.dividend_yield * 1.3, hist: stock.dividend_yield * 1.1 }
  ];
  const max = Math.max(...items.flatMap(i => [i.cur, i.ind, i.hist]));
  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16, marginTop: 8 }}>
      {items.map((it, idx) => (
        <div key={idx} style={{ marginBottom: idx === items.length - 1 ? 0 : 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>{it.label}</div>
          {[
            { label: '当前', val: it.cur, color: 'var(--primary-500)' },
            { label: '行业均值', val: it.ind, color: 'var(--neutral-400)' },
            { label: '5年均值', val: it.hist, color: 'var(--neutral-300)' }
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 60 }}>{row.label}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--neutral-100)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: (row.val / max) * 100 + '%', height: '100%', background: row.color }}/>
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', width: 50, textAlign: 'right' }}>{row.val.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function RatingPie() {
  const data = [
    { label: '买入', value: 58, color: 'var(--success-500)' },
    { label: '持有', value: 30, color: 'var(--warning-500)' },
    { label: '卖出', value: 12, color: 'var(--danger-500)' }
  ];
  let acc = 0;
  const total = 100;
  const cx = 60, cy = 60, r = 50, ir = 30;
  const arcs = data.map(d => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = d.value > 50 ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const x3 = cx + ir * Math.cos(end), y3 = cy + ir * Math.sin(end);
    const x4 = cx + ir * Math.cos(start), y4 = cy + ir * Math.sin(start);
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`, color: d.color, label: d.label, value: d.value };
  });
  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16, marginTop: 8, display: 'flex', alignItems: 'center', gap: 24 }}>
      <svg width={120} height={120}>
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color}/>)}
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {arcs.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color }}/>
            <span style={{ flex: 1 }}>{a.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{a.value}%</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>分析师评级 · 共 24 家机构</div>
      </div>
    </div>
  );
}

function BottomTabs({ stock, kpts, bottomTab, setBottomTab, bottomTimeFilter, setBottomTimeFilter }) {
  const tabs = [
    { id: 'company', label: '公司简介' },
    { id: 'sentiment', label: '市场情绪' },
    { id: 'news', label: '新闻与政策' },
    { id: 'fund', label: '资金流向' }
  ];
  return (
    <div style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-default)', minHeight: '20vh' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', borderBottom: '1px solid var(--border-default)',
        position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10
      }}>
        <div style={{ display: 'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setBottomTab(t.id)} style={{
              padding: '14px 16px', fontSize: 14, fontWeight: 600,
              color: bottomTab === t.id ? 'var(--primary-600)' : 'var(--text-secondary)',
              borderBottom: '2px solid ' + (bottomTab === t.id ? 'var(--primary-500)' : 'transparent'),
              marginBottom: -1
            }}>{t.label}</button>
          ))}
        </div>
        {(bottomTab === 'sentiment' || bottomTab === 'fund') && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[['day', '日'], ['week', '周'], ['month', '月']].map(([v, l]) => (
              <button key={v} onClick={() => setBottomTimeFilter(v)} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: bottomTimeFilter === v ? 'var(--neutral-900)' : 'transparent',
                color: bottomTimeFilter === v ? '#fff' : 'var(--text-secondary)'
              }}>{l}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 24 }}>
        {bottomTab === 'company' && <CompanyTab stock={stock}/>}
        {bottomTab === 'sentiment' && <SentimentTab stock={stock} period={bottomTimeFilter}/>}
        {bottomTab === 'news' && <NewsTab stock={stock}/>}
        {bottomTab === 'fund' && <FundTab stock={stock} period={bottomTimeFilter}/>}
      </div>
    </div>
  );
}

function CompanyTab({ stock }) {
  const founded = { '600519': 1999, '300750': 2011, 'NVDA': 1993, '00700': 1998, 'AAPL': 1976, 'TSLA': 2003 }[stock.id] || 2000;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
      <div>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700 }}>{stock.name}</h3>
        <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          {stock.name} 是 {stock.sector} 领域的领先企业，成立于 {founded} 年，主营业务覆盖产业链核心环节，长期为行业提供高质量产品和服务。公司在 {stock.market} 市场上市，是该板块的代表性公司之一。
        </p>
        <p style={{ margin: '0 0 24px', fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
          公司持续投入研发，在核心技术上保持行业领先地位。近年来积极拓展海外市场，推动产能国际化布局。管理层稳定，战略方向清晰，具备穿越周期的能力。
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: '成立', value: founded + ' 年' },
            { label: '总市值', value: stock.market_cap.toFixed(0) + ' 亿' },
            { label: 'P/E (TTM)', value: stock.pe_ratio.toFixed(1) },
            { label: '股息率', value: stock.dividend_yield.toFixed(2) + '%' }
          ].map((it, i) => (
            <div key={i} style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{it.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ background: `repeating-linear-gradient(45deg, var(--neutral-100), var(--neutral-100) 8px, var(--bg-subtle) 8px, var(--bg-subtle) 16px)`, height: 200, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          [公司/产品图]
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          {stock.name_en || stock.name}
        </div>
      </div>
    </div>
  );
}

function SentimentTab({ stock, period }) {
  const score = 50 + (stock.change_pct * 8);
  const bull = Math.round(40 + stock.change_pct * 4);
  const bear = Math.round(40 - stock.change_pct * 4);
  const neutral = 100 - bull - bear;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <SentimentGauge score={score}/>
      <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>看多 / 看空人数</div>
        {[
          { label: '看多', val: bull, color: 'var(--quote-up)' },
          { label: '中性', val: neutral, color: 'var(--neutral-400)' },
          { label: '看空', val: bear, color: 'var(--quote-down)' }
        ].map((it, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span>{it.label}</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{it.val}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--neutral-100)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: it.val + '%', height: '100%', background: it.color }}/>
            </div>
          </div>
        ))}
      </div>
      <SentimentTrend stock={stock} period={period}/>
    </div>
  );
}

function SentimentGauge({ score }) {
  const angle = (score / 100) * 180 - 90;
  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textAlign: 'left' }}>多空情绪指数</div>
      <svg width={200} height={120} viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gauge" x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--quote-down)"/>
            <stop offset="50%" stopColor="var(--warning-500)"/>
            <stop offset="100%" stopColor="var(--quote-up)"/>
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="url(#gauge)" strokeWidth={14} fill="none" strokeLinecap="round"/>
        <g transform={`translate(100, 100) rotate(${angle})`}>
          <line x1={0} y1={0} x2={0} y2={-65} stroke="var(--neutral-900)" strokeWidth={2}/>
          <circle r={6} fill="var(--neutral-900)"/>
        </g>
      </svg>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{score.toFixed(0)}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{score > 65 ? '乐观' : score > 50 ? '偏乐观' : score > 35 ? '偏谨慎' : '悲观'}</div>
    </div>
  );
}

function SentimentTrend({ stock, period }) {
  const rand = (() => { let s = stock.id.length * 7; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const data = Array.from({ length: 15 }, () => 40 + rand() * 30);
  const w = 220, h = 100;
  const max = Math.max(...data), min = Math.min(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * (w - 20) + 10},${h - 10 - ((v - min) / (max - min || 1)) * (h - 20)}`).join(' ');
  return (
    <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>近 15 日情绪趋势</div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
        <polyline points={points} fill="none" stroke="var(--primary-500)" strokeWidth={2}/>
        <polygon points={`${points} ${w-10},${h-10} 10,${h-10}`} fill="var(--primary-500)" opacity={0.1}/>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
        <span>15日前</span><span>今日</span>
      </div>
    </div>
  );
}

function NewsTab({ stock }) {
  const news = window.getNews(stock.id);
  const [filter, setFilter] = uS_D('all');
  const [expanded, setExpanded] = uS_D(null);
  const filtered = filter === 'all' ? news : news.filter(n => n.type === filter);
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[['all', '全部'], ['news', '新闻'], ['policy', '政策']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: filter === v ? 'var(--primary-50)' : 'transparent',
            color: filter === v ? 'var(--primary-700)' : 'var(--text-secondary)',
            border: '1px solid ' + (filter === v ? 'var(--primary-200)' : 'var(--border-default)')
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(n => (
          <NewsCard key={n.id} news={n} expanded={expanded === n.id} onToggle={() => setExpanded(expanded === n.id ? null : n.id)}/>
        ))}
      </div>
    </div>
  );
}

function NewsCard({ news, expanded, onToggle }) {
  return (
    <div style={{
      background: 'var(--bg-base)', border: '1px solid var(--border-default)',
      borderRadius: 8, overflow: 'hidden',
      borderColor: expanded ? 'var(--primary-300)' : 'var(--border-default)'
    }}>
      <div onClick={onToggle} style={{ padding: 14, cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
          <span style={{ padding: '1px 6px', background: news.type === 'policy' ? 'var(--auxiliary-50)' : 'var(--neutral-100)', color: news.type === 'policy' ? 'var(--auxiliary-700)' : 'var(--text-secondary)', borderRadius: 3, fontWeight: 600 }}>
            {news.type === 'policy' ? '政策' : '新闻'}
          </span>
          <span>{news.source}</span>
          <span>·</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{news.publish_time}</span>
        </div>
        <div style={{ fontSize: expanded ? 16 : 14, fontWeight: 600, lineHeight: 1.4, marginBottom: expanded ? 12 : 6 }}>
          {news.title}
        </div>
        {!expanded && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {news.summary}
          </div>
        )}
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 14px' }}>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)' }}>
            {news.content.split('\n\n').slice(1).map((p, i) => (
              <p key={i} style={{ margin: '0 0 10px' }}>{p}</p>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-default)' }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: 'var(--primary-600)', fontWeight: 600 }}>
              查看原文 →
            </a>
            <button onClick={onToggle} className="btn-ghost" style={{ fontSize: 12 }}>收起</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FundTab({ stock, period }) {
  const rand = (() => { let s = stock.id.length * 11; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const days = 15;
  const data = Array.from({ length: days }, (_, i) => ({
    date: i,
    main: (rand() - 0.4) * 5,
    big: (rand() - 0.5) * 3,
    mid: (rand() - 0.5) * 2,
    small: (rand() - 0.5) * 1.5
  }));
  const max = Math.max(...data.map(d => Math.abs(d.main)));
  const w = 480, h = 180;
  const stepX = w / days;
  const cy = h / 2;
  const inflow = 62, outflow = 38;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>主力资金净流入 (亿元)</div>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <line x1={0} x2={w} y1={cy} y2={cy} stroke="var(--border-default)"/>
          {data.map((d, i) => {
            const barH = (Math.abs(d.main) / max) * (cy - 10);
            const x = i * stepX + 4;
            const bw = stepX - 8;
            const up = d.main >= 0;
            return <rect key={i} x={x} y={up ? cy - barH : cy} width={bw} height={barH} fill={up ? 'var(--quote-up)' : 'var(--quote-down)'}/>;
          })}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          <span>15日前</span><span>今日</span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>净流入 / 流出占比</div>
        <svg width={120} height={120} style={{ display: 'block', margin: '0 auto' }}>
          <circle cx={60} cy={60} r={45} fill="none" stroke="var(--neutral-100)" strokeWidth={18}/>
          <circle cx={60} cy={60} r={45} fill="none" stroke="var(--quote-up)" strokeWidth={18}
            strokeDasharray={`${inflow / 100 * 283} 283`}
            transform="rotate(-90 60 60)" strokeLinecap="round"/>
        </svg>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{color:'var(--quote-up)'}}>● 流入</span><span style={{fontFamily:'var(--font-mono)'}}>{inflow}%</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{color:'var(--quote-down)'}}>● 流出</span><span style={{fontFamily:'var(--font-mono)'}}>{outflow}%</span></div>
        </div>
      </div>
    </div>
  );
}

// =================== Key Point Modal ===================
function KeyPointModal({ kpId, stockId, onClose }) {
  const { navigate } = useApp();
  const allKps = window.getKeyPoints(stockId);
  const [activeId, setActiveId] = uS_D(kpId);
  const [tab, setTab] = uS_D('summary');
  const [filterType, setFilterType] = uS_D('全部');
  const [expandedNews, setExpandedNews] = uS_D(null);

  const kp = allKps.find(k => k.id === activeId) || allKps[0];

  uE_D(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, []);

  const visibleKps = filterType === '全部' ? allKps : allKps.filter(k => k.ai_label === filterType);
  const stock = window.getStock(stockId);
  const newsList = window.getNews(stockId).slice(0, 3);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(20,24,36,0.5)',
      zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 200ms ease-out'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-base)', borderRadius: 16, width: '90%', height: '85%',
        maxWidth: 1400, display: 'flex', flexDirection: 'column',
        animation: 'modalIn 200ms ease-out', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>关键点详情</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stock.name} · {stock.id}</span>
          <button onClick={onClose} className="btn-ghost" style={{ marginLeft: 'auto', padding: 6 }}>
            <Icon.Close size={18}/>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left timeline */}
          <div style={{ width: '30%', minWidth: 280, borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
              <Select value={filterType} onChange={setFilterType} options={['全部', '利好', '利空', '中性']} label="类型"/>
              <Select value="近30日" onChange={() => {}} options={['近5日', '近10日', '近30日']} label="时间"/>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              <div style={{ position: 'relative', paddingLeft: 16 }}>
                <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 2, background: 'var(--border-default)' }}/>
                {visibleKps.map(k => {
                  const active = k.id === activeId;
                  const color = k.ai_label === '利好' ? 'var(--kp-bullish)' : k.ai_label === '利空' ? 'var(--kp-bearish)' : 'var(--kp-neutral)';
                  return (
                    <div key={k.id} onClick={() => { setActiveId(k.id); }} style={{ position: 'relative', marginBottom: 14, cursor: 'pointer', paddingLeft: 16 }}>
                      <div style={{ position: 'absolute', left: -15, top: 6, width: 12, height: 12, borderRadius: '50%', background: active ? color : '#fff', border: `2px solid ${color}`, transform: 'rotate(45deg)' }}/>
                      <div style={{ padding: 10, borderRadius: 8, background: active ? 'var(--primary-50)' : 'transparent', border: '1px solid ' + (active ? 'var(--primary-200)' : 'transparent') }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{k.date.replace(/-/g, '/')}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{k.title}</div>
                        <div style={{ marginTop: 6 }}>
                          <span className={`tag tag-${k.ai_label === '利好' ? 'bullish' : k.ai_label === '利空' ? 'bearish' : 'neutral'}`}>{k.ai_label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-default)', padding: '0 20px' }}>
              {[
                { id: 'summary', label: 'AI 总结' },
                { id: 'snapshot', label: '数据快照' },
                { id: 'news', label: '相关新闻' },
                { id: 'fund', label: '资金流向' },
                { id: 'sentiment', label: '市场情绪' }
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: '14px 14px', fontSize: 13, fontWeight: 600,
                  color: tab === t.id ? 'var(--primary-600)' : 'var(--text-secondary)',
                  borderBottom: '2px solid ' + (tab === t.id ? 'var(--primary-500)' : 'transparent'), marginBottom: -1
                }}>{t.label}</button>
              ))}
              <button
                disabled={!kp.has_causal}
                onClick={() => navigate({ name: 'causal', stockId, kpId: kp.id })}
                style={{
                  marginLeft: 'auto', padding: '6px 12px', borderRadius: 6,
                  background: kp.has_causal ? 'var(--auxiliary-500)' : 'var(--neutral-200)',
                  color: kp.has_causal ? '#fff' : 'var(--text-disabled)',
                  fontSize: 12, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  cursor: kp.has_causal ? 'pointer' : 'not-allowed'
                }}
                title={kp.has_causal ? '探索因果链' : '暂无因果链数据'}>
                <Icon.Network size={13}/> 因果链
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {tab === 'summary' && <KpSummary kp={kp}/>}
              {tab === 'snapshot' && <KpSnapshot kp={kp} stock={stock}/>}
              {tab === 'news' && <NewsTab stock={stock}/>}
              {tab === 'fund' && <FundTab stock={stock} period="day"/>}
              {tab === 'sentiment' && <SentimentTab stock={stock} period="day"/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpSummary({ kp }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span className={`tag tag-${kp.ai_label === '利好' ? 'bullish' : kp.ai_label === '利空' ? 'bearish' : 'neutral'}`}>{kp.ai_label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{kp.date}</span>
      </div>
      <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700 }}>{kp.title}</h2>
      <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.75, color: 'var(--text-primary)' }}>
        <strong style={{ color: 'var(--primary-700)' }}>核心判断：</strong>{kp.short_desc}本次事件直接影响公司基本面，需密切关注后续进展。
      </p>
      <h3 style={{ margin: '24px 0 12px', fontSize: 15, fontWeight: 700 }}>影响时间维度</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: '短期 (1-2周)', desc: '股价直接反应，市场情绪波动', color: 'var(--primary-50)' },
          { label: '中期 (1-3月)', desc: '业绩兑现或预期修正阶段', color: 'var(--auxiliary-50)' },
          { label: '长期 (6月+)', desc: '影响公司战略与产业格局', color: 'var(--success-50)' }
        ].map((it, i) => (
          <div key={i} style={{ padding: 14, background: it.color, borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{it.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{it.desc}</div>
          </div>
        ))}
      </div>
      <h3 style={{ margin: '24px 0 12px', fontSize: 15, fontWeight: 700 }}>事件因果分析</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
        从事件本身出发，可以追溯到上游的政策与产业链动因，并向下延伸出市场反应、机构持仓变化等结果。点击右上方"因果链"按钮可查看完整事件追溯关系图。
      </p>
    </div>
  );
}

function KpSnapshot({ kp, stock }) {
  const rand = (() => { let s = kp.id.length * 13; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })();
  const days = 21;
  const center = 10;
  const data = Array.from({ length: days }, (_, i) => ({
    day: i - center,
    vol: 0.5 + rand() * 0.5 + (i === center ? 0.5 : 0)
  }));
  const max = Math.max(...data.map(d => d.vol));
  const w = 600, h = 160;
  const stepX = w / days;
  return (
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>关键点前后 10 日成交量</h3>
      <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: 16 }}>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {data.map((d, i) => {
            const bh = (d.vol / max) * (h - 30);
            const x = i * stepX + 4;
            const bw = stepX - 8;
            const isToday = d.day === 0;
            return (
              <g key={i}>
                <rect x={x} y={h - 20 - bh} width={bw} height={bh} fill={isToday ? 'var(--primary-500)' : 'var(--neutral-300)'} rx={2}/>
                {isToday && <text x={x + bw/2} y={h - 4} textAnchor="middle" fontSize={10} fill="var(--primary-700)" fontWeight={700}>事件日</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: '换手率', val: '2.85%' },
          { label: '市值变化', val: '+1.2%' },
          { label: 'P/E', val: stock.pe_ratio.toFixed(1) },
          { label: 'P/B', val: stock.pb_ratio.toFixed(2) }
        ].map((it, i) => (
          <div key={i} style={{ background: 'var(--bg-subtle)', padding: 14, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{it.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{it.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.DetailPage = DetailPage;
