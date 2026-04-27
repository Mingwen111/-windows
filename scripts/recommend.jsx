// Recommend (Discovery) Page
const { useState: uS_R, useMemo: uM_R } = React;

function RecommendPage() {
  const { navigate, addRecent } = useApp();
  const [search, setSearch] = uS_R('');
  const [sector, setSector] = uS_R('全部');
  const [market, setMarket] = uS_R('全部');
  const [sort, setSort] = uS_R('hot');

  const featured = window.STOCKS.filter(s => s.is_featured);

  const filtered = uM_R(() => {
    let list = window.STOCKS.slice();
    if (sector !== '全部') list = list.filter(s => s.sector === sector);
    if (market !== '全部') list = list.filter(s => s.market === market);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.name_en || '').toLowerCase().includes(q));
    }
    if (sort === 'hot') list.sort((a, b) => b.hot_score - a.hot_score);
    else if (sort === 'event_count') list.sort((a, b) => window.getKeyPoints(b.id).length - window.getKeyPoints(a.id).length);
    else if (sort === 'gain_desc') list.sort((a, b) => b.change_pct - a.change_pct);
    else if (sort === 'loss_desc') list.sort((a, b) => a.change_pct - b.change_pct);
    return list;
  }, [search, sector, market, sort]);

  const goTo = (id) => { addRecent(id); navigate({ name: 'detail', stockId: id }); };

  // Highlight match
  const highlight = (text) => {
    if (!search.trim()) return text;
    const q = search.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--warning-100)', color: 'inherit', padding: '0 2px', borderRadius: 2 }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>;
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 48px' }}>
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 560, marginBottom: 32 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Icon.Search size={16}/>
        </span>
        <input className="input-base"
          placeholder="搜索股票或代码..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 40, height: 44 }}
        />
      </div>

      {/* Featured */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>Select for You</h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>本周精选 · 编辑推荐</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {featured.map(s => (
            <div key={s.id} onClick={() => goTo(s.id)}
              className="featured-card"
              style={{
                background: 'var(--bg-base)', borderRadius: 12, padding: 20,
                border: '1px solid var(--border-default)', cursor: 'pointer',
                transition: 'all 200ms ease', display: 'flex', flexDirection: 'column', gap: 12,
                position: 'relative', overflow: 'hidden'
              }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                background: `radial-gradient(circle at 100% 0%, ${s.market === 'A股' ? 'var(--danger-50)' : s.market === '港股' ? 'var(--auxiliary-50)' : 'var(--primary-50)'} 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
                <StockBlock code={s.id} market={s.market} size={40}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.id} · {s.market}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {s.current_price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 12, color: s.change_pct >= 0 ? 'var(--quote-up)' : 'var(--quote-down)', fontWeight: 600 }}>
                    {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, position: 'relative' }}>
                {s.featured_reason}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary-600)', fontWeight: 600 }}>
                <Icon.Sparkles size={13}/> AI 精选理由
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {window.SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              style={{
                padding: '6px 12px', borderRadius: 999,
                background: sector === s ? 'var(--neutral-900)' : 'var(--bg-base)',
                color: sector === s ? '#fff' : 'var(--text-secondary)',
                border: '1px solid ' + (sector === s ? 'var(--neutral-900)' : 'var(--border-default)'),
                fontSize: 13, fontWeight: 500, transition: 'all 150ms'
              }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Select value={market} onChange={setMarket} options={window.MARKETS} label="市场"/>
          <Select value={sort} onChange={setSort} options={window.SORTS.map(s => s.id)} labels={window.SORTS.reduce((a, s) => ({...a, [s.id]: s.label}), {})} label="排序"/>
        </div>
      </div>

      {/* Waterfall */}
      {filtered.length === 0 ? (
        <EmptyState
          title="未找到相关股票"
          desc="请尝试其他关键词或调整筛选条件"/>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtered.map(s => {
            const kpCount = window.getKeyPoints(s.id).length;
            return (
              <div key={s.id} onClick={() => goTo(s.id)}
                className="stock-card"
                style={{
                  background: 'var(--bg-base)', borderRadius: 10, padding: 16,
                  border: '1px solid var(--border-default)', cursor: 'pointer',
                  transition: 'all 150ms ease', display: 'flex', flexDirection: 'column', gap: 10
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <StockBlock code={s.id} market={s.market} size={36}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {highlight(s.name)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{highlight(s.id)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                    {s.current_price.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.change_pct >= 0 ? 'var(--quote-up)' : 'var(--quote-down)' }}>
                    {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(2)}%
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{s.market} · {s.sector}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary-600)' }}>
                    <Icon.Diamond size={8}/> {kpCount} 个事件
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options, labels, label }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        appearance: 'none', background: 'var(--bg-base)',
        border: '1px solid var(--border-default)', borderRadius: 8,
        padding: '6px 32px 6px 12px', fontSize: 13, color: 'var(--text-primary)',
        fontFamily: 'inherit', cursor: 'pointer', height: 32
      }}>
        {options.map(o => <option key={o} value={o}>{labels?.[o] ?? o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
        <Icon.ChevronDown size={14}/>
      </span>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Icon.Search size={28}/>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</div>
      {desc && <div style={{ fontSize: 13, marginTop: 6 }}>{desc}</div>}
    </div>
  );
}

if (!document.getElementById('rec-style')) {
  const s = document.createElement('style');
  s.id = 'rec-style';
  s.textContent = `
    .featured-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); border-color: var(--primary-300); }
    .stock-card:hover { box-shadow: var(--shadow-sm); border-color: var(--border-strong); transform: translateY(-1px); }
  `;
  document.head.appendChild(s);
}

window.RecommendPage = RecommendPage;
