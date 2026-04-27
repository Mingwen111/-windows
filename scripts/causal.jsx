// Causal Chain Page
const { useState: uS_C, useMemo: uM_C, useEffect: uE_C } = React;

// Adapt raw data (uses `layer` 3→0 + `is_focal` + `content`) to renderer shape
function adaptChain(raw, kp) {
  if (!raw) return raw;
  const maxLayer = Math.max(...raw.nodes.map(n => n.layer ?? 0));
  const inferKind = (node) => {
    if (node.is_focal) {
      if (kp?.ai_label === '利好') return 'bullish';
      if (kp?.ai_label === '利空') return 'bearish';
      return 'neutral';
    }
    if (node.layer === maxLayer) return 'cause';
    if (node.layer === 0) {
      if (kp?.ai_label === '利好') return 'bullish';
      if (kp?.ai_label === '利空') return 'bearish';
      return 'neutral';
    }
    return 'neutral';
  };
  return {
    ...raw,
    nodes: raw.nodes.map(n => ({
      id: n.id,
      title: n.title,
      date: n.date,
      level: maxLayer - (n.layer ?? 0),
      is_root: !!n.is_focal,
      kind: inferKind(n),
      detail: n.content || n.detail || '暂无详情。',
      evidence: n.evidence || []
    })),
    edges: raw.edges.map(e => ({
      from: e.from, to: e.to,
      label: e.type === 'direct' ? '直接' : e.type === 'indirect' ? '间接' : e.label
    }))
  };
}

function CausalPage({ stockId, kpId }) {
  const { navigate } = useApp();
  const stock = window.getStock(stockId);
  const rootKp = window.getKeyPoints(stockId).find(k => k.id === kpId);

  // chainStack: [{ label, rawChain, kpMeta }] — last entry = currently shown chain
  const [chainStack, setChainStack] = uS_C(() => {
    const raw = window.getCausalChain(stockId, kpId);
    return [{ label: rootKp?.title || kpId, rawChain: raw, kpMeta: rootKp }];
  });

  const currentEntry = chainStack[chainStack.length - 1];
  const chain = uM_C(
    () => adaptChain(currentEntry.rawChain, currentEntry.kpMeta),
    [currentEntry]
  );

  const [selectedNodeId, setSelectedNodeId] = uS_C(null);
  const [hoverNode, setHoverNode] = uS_C(null);

  uE_C(() => {
    const root = chain?.nodes.find(n => n.is_root) || chain?.nodes[0];
    setSelectedNodeId(root?.id || null);
  }, [chain]);

  if (!chain || !chain.nodes.length) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16 }}>暂无因果链数据</div>
        <button className="btn-primary" onClick={() => navigate({ name: 'detail', stockId })}>返回详情页</button>
      </div>
    );
  }

  // ── Vertical layout ──────────────────────────────────────────────
  const nodeW = 220, nodeH = 84;         // extra height for hint text row
  const outNodeW = 280, outNodeH = 108;
  const gapX = 40, gapY = 64;
  const rowH = nodeH + gapY;
  const paddingTop = 56;

  const maxLevel = Math.max(...chain.nodes.map(n => n.level));

  const colsPerLevel = {};
  chain.nodes.forEach(n => {
    (colsPerLevel[n.level] = colsPerLevel[n.level] || []).push(n);
  });

  const maxNodesInRow = Math.max(...Object.values(colsPerLevel).map(ns => ns.length));
  const canvasW = Math.max(480, maxNodesInRow * outNodeW + (maxNodesInRow - 1) * gapX + 120);

  // layout[id] = { x, y, w, h, isOutcome }
  const layout = {};
  Object.entries(colsPerLevel).forEach(([lv, nodes]) => {
    const lvNum = Number(lv);
    const isOutcome = lvNum === maxLevel;
    const nW = isOutcome ? outNodeW : nodeW;
    const nH = isOutcome ? outNodeH : nodeH;
    const totalRowW = nodes.length * nW + (nodes.length - 1) * gapX;
    const rowStartX = (canvasW - totalRowW) / 2;
    nodes.forEach((n, ni) => {
      layout[n.id] = {
        x: rowStartX + ni * (nW + gapX),
        y: paddingTop + lvNum * rowH,
        w: nW, h: nH, isOutcome
      };
    });
  });

  const canvasH = paddingTop + maxLevel * rowH + outNodeH + 64;

  // ── Drill-down ──────────────────────────────────────────────────
  const drillInto = (node) => {
    const subRaw = window.getNodeCausalChain(node.id, node.title, stockId);
    const subKpMeta = {
      ai_label: node.kind === 'bullish' ? '利好' : node.kind === 'bearish' ? '利空' : '中性',
      title: node.title
    };
    setChainStack(s => [...s, { label: node.title, rawChain: subRaw, kpMeta: subKpMeta }]);
  };

  const selected = chain.nodes.find(n => n.id === selectedNodeId);

  const levelLabels = {
    0: '上游因素', 1: '直接动因', 2: '核心事件', 3: '直接影响', 4: '最终结论'
  };
  const kindColor = {
    bullish: 'var(--kp-bullish)', bearish: 'var(--kp-bearish)',
    cause: 'var(--auxiliary-500)', neutral: 'var(--neutral-400)'
  };
  const kindBg = {
    bullish: 'var(--success-50)', bearish: 'var(--danger-50)',
    cause: 'var(--auxiliary-50)', neutral: 'var(--neutral-100)'
  };
  const outcomeBg = {
    bullish: 'var(--success-100)', bearish: 'var(--danger-100)',
    cause: 'var(--primary-50)', neutral: 'var(--primary-50)'
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Header + breadcrumb */}
      <div style={{
        padding: '14px 24px', borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-base)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'
      }}>
        <button onClick={() => navigate({ name: 'detail', stockId })} className="btn-ghost"
          style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, flexShrink: 0 }}>
          <Icon.ChevronLeft size={14}/> 返回详情
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border-default)', flexShrink: 0 }}/>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
          {chainStack.map((entry, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>›</span>}
              <button
                onClick={() => i < chainStack.length - 1 && setChainStack(s => s.slice(0, i + 1))}
                style={{
                  color: i === chainStack.length - 1 ? 'var(--text-primary)' : 'var(--primary-600)',
                  fontWeight: i === chainStack.length - 1 ? 700 : 400,
                  cursor: i < chainStack.length - 1 ? 'pointer' : 'default',
                  maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
              >{entry.label}</button>
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
          <Icon.Network size={14}/>
          {chain.nodes.length} 个节点 · {chain.edges.length} 条因果关系
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Graph canvas */}
        <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-subtle)' }}>
          <svg width={canvasW} height={canvasH} style={{ display: 'block', minWidth: '100%' }}>
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--neutral-300)"/>
              </marker>
              <marker id="arrHi" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--primary-500)"/>
              </marker>
            </defs>

            {/* Level labels (left margin) */}
            {Object.keys(colsPerLevel).map(lv => {
              const lvNum = Number(lv);
              const p = layout[colsPerLevel[lvNum][0].id];
              if (!p) return null;
              return (
                <text key={lv} x={10} y={p.y + p.h / 2 + 4}
                  fontSize={10} fill="var(--text-muted)" fontWeight={700}
                  letterSpacing="0.04em" textAnchor="start">
                  {levelLabels[lvNum] || `层级 ${lvNum}`}
                </text>
              );
            })}

            {/* Edges */}
            {chain.edges.map((e, i) => {
              const a = layout[e.from], b = layout[e.to];
              if (!a || !b) return null;
              const x1 = a.x + a.w / 2, y1 = a.y + a.h;
              const x2 = b.x + b.w / 2, y2 = b.y;
              const midY = (y1 + y2) / 2;
              const isRel = selectedNodeId === e.from || selectedNodeId === e.to;
              const isDash = e.label === '间接';
              return (
                <g key={i}>
                  <path
                    d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 6}`}
                    stroke={isRel ? 'var(--primary-500)' : 'var(--neutral-300)'}
                    strokeWidth={isRel ? 2 : 1.5}
                    fill="none"
                    strokeDasharray={isDash ? '5 4' : 'none'}
                    markerEnd={`url(#${isRel ? 'arrHi' : 'arr'})`}
                    opacity={isRel ? 1 : 0.7}
                  />
                  {e.label && (
                    <g>
                      <rect x={(x1+x2)/2 - 18} y={midY - 9} width={36} height={18} rx={9}
                        fill="var(--bg-base)" stroke={isRel ? 'var(--primary-300)' : 'var(--border-default)'}/>
                      <text x={(x1+x2)/2} y={midY + 4} textAnchor="middle" fontSize={10}
                        fill={isRel ? 'var(--primary-700)' : 'var(--text-muted)'} fontWeight={600}>
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {chain.nodes.map(n => {
              const p = layout[n.id]; if (!p) return null;
              const color = kindColor[n.kind] || 'var(--neutral-400)';
              const bg    = p.isOutcome
                ? (outcomeBg[n.kind] || 'var(--primary-50)')
                : (kindBg[n.kind]   || 'var(--neutral-100)');
              const isSel = n.id === selectedNodeId;
              const isHov = n.id === hoverNode;
              const isDrillable = !p.isOutcome;

              // Bottom row y positions
              const hintY  = p.y + p.h - 7;   // hint / date row
              const dateX  = p.x + 10;
              const hintX  = p.x + p.w - 10;

              return (
                <g key={n.id}
                  onMouseEnter={() => setHoverNode(n.id)}
                  onMouseLeave={() => setHoverNode(null)}
                  onClick={() => setSelectedNodeId(n.id)}
                  onDoubleClick={() => isDrillable && drillInto(n)}
                  style={{ cursor: isDrillable ? 'pointer' : 'default' }}>

                  {/* Outcome glow ring */}
                  {p.isOutcome && (
                    <rect x={p.x - 7} y={p.y - 7} width={p.w + 14} height={p.h + 14} rx={16}
                      fill="none" stroke={color} strokeWidth={1.5} opacity={0.3}/>
                  )}

                  {/* Card */}
                  <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={10}
                    fill={bg}
                    stroke={isSel ? 'var(--primary-500)' : p.isOutcome ? color : isHov ? color : 'var(--border-default)'}
                    strokeWidth={isSel ? 2.5 : p.isOutcome ? 2.5 : isHov ? 1.5 : 1}
                    style={{ filter: p.isOutcome
                      ? 'drop-shadow(0 6px 20px rgba(0,0,0,0.12))'
                      : isSel ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' : 'none' }}
                  />

                  {/* Focal dashed border */}
                  {n.is_root && !p.isOutcome && (
                    <rect x={p.x - 4} y={p.y - 4} width={p.w + 8} height={p.h + 8} rx={12}
                      fill="none" stroke="var(--primary-500)" strokeWidth={1.5}
                      strokeDasharray="4 3" opacity={0.65}/>
                  )}

                  {/* Title */}
                  <foreignObject x={p.x + 10} y={p.y + 8} width={p.w - 20} height={p.h - 28}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{
                      fontSize: p.isOutcome ? 13 : 12,
                      fontWeight: p.isOutcome ? 700 : 600,
                      lineHeight: 1.35, color: 'var(--text-primary)',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
                    }}>{n.title}</div>
                  </foreignObject>

                  {/* Date (bottom-left) */}
                  {n.date && (
                    <text x={dateX} y={hintY}
                      fontSize={9} fill="var(--text-muted)" fontFamily="var(--font-mono)">
                      {n.date}
                    </text>
                  )}

                  {/* "双击展开因果链" hint (bottom-right, non-outcome only) */}
                  {isDrillable && (
                    <text x={hintX} y={hintY}
                      textAnchor="end" fontSize={9} fontWeight={600}
                      fill="var(--auxiliary-600)"
                      opacity={isHov ? 1 : 0.35}>
                      双击展开因果链
                    </text>
                  )}

                  {/* Kind dot (top-right) */}
                  <circle cx={p.x + p.w - 10} cy={p.y + 10} r={4} fill={color}/>

                  {/* "最终结论" label below outcome card */}
                  {p.isOutcome && (
                    <text x={p.x + p.w / 2} y={p.y + p.h + 20}
                      textAnchor="middle" fontSize={11} fontWeight={700}
                      fill={color} letterSpacing="0.06em">
                      最终结论
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div style={{ width: 360, borderLeft: '1px solid var(--border-default)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className={`tag tag-${selected.kind === 'bullish' ? 'bullish' : selected.kind === 'bearish' ? 'bearish' : 'neutral'}`}>
                    {selected.kind === 'bullish' ? '利好' : selected.kind === 'bearish' ? '利空' : selected.kind === 'cause' ? '动因' : '中性'}
                  </span>
                  {selected.is_root && (
                    <span style={{ fontSize: 11, color: 'var(--primary-700)', fontWeight: 600, background: 'var(--primary-50)', padding: '2px 8px', borderRadius: 4 }}>
                      核心事件
                    </span>
                  )}
                  {layout[selected.id]?.isOutcome && (
                    <span style={{ fontSize: 11, color: 'var(--success-700)', fontWeight: 600, background: 'var(--success-50)', padding: '2px 8px', borderRadius: 4 }}>
                      最终结论
                    </span>
                  )}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{selected.title}</h3>
                {selected.date && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{selected.date}</div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  详细说明
                </div>
                <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)' }}>
                  {selected.detail}
                </p>

                {/* Drill button for non-outcome nodes */}
                {!layout[selected.id]?.isOutcome && (
                  <button
                    onClick={() => drillInto(selected)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--auxiliary-100)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--auxiliary-50)'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 8,
                      background: 'var(--auxiliary-50)', color: 'var(--auxiliary-700)',
                      border: '1px solid var(--auxiliary-100)',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 150ms'
                    }}>
                    <Icon.Network size={13}/> 追溯此事件的原因
                  </button>
                )}

                {selected.evidence && selected.evidence.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginTop: 20, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      支撑证据
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selected.evidence.map((ev, i) => (
                        <div key={i} style={{ padding: 10, background: 'var(--bg-subtle)', borderRadius: 6, fontSize: 12, lineHeight: 1.6 }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 4 }}>{ev.source}</div>
                          {ev.text}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              点击节点查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CausalPage = CausalPage;
