// Sidebar Navigation
const { useState: uS_S, useRef: uR_S } = React;

function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, recents, favorites, navigate, route, toggleFavorite, isFav, removeFromBucket } = useApp();
  const [search, setSearch] = uS_S('');
  const [mySectionOpen, setMySectionOpen] = uS_S(true);
  const [confirmDelete, setConfirmDelete] = uS_S(null); // `${bucket}-${id}`
  const [dragOver, setDragOver] = uS_S(false);
  const [draggedId, setDraggedId] = uS_S(null);

  const collapsed = sidebarCollapsed;
  const width = collapsed ? 60 : 240;

  const filterFn = (id) => {
    if (!search.trim()) return true;
    const s = window.getStock(id); if (!s) return false;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
  };
  const favFiltered = favorites.filter(filterFn);
  const recFiltered = recents.filter(filterFn);

  const onDrop = (e, target) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (target === 'favorites' && id) {
      if (favorites.includes(id)) {
        useApp().showToast?.('已在收藏夹中');
        return;
      }
      toggleFavorite(id);
    }
    setDraggedId(null);
  };

  return (
    <aside style={{
      width, height: '100vh', flexShrink: 0,
      background: 'var(--bg-base)', borderRight: '1px solid var(--border-default)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 200ms ease',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      {/* Brand */}
      <div style={{
        height: 64, padding: collapsed ? '0 8px' : '0 8px 0 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-default)'
      }}>
        <div onClick={() => navigate({ name: 'recommend' })} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <ZionLogo size={28}/>
          {!collapsed && <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Zion</span>}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!collapsed)}
          className="btn-ghost"
          style={{ padding: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={collapsed ? '展开导航' : '收起导航'}
        >
          {collapsed ? <Icon.ChevronRight size={16}/> : <Icon.ChevronLeft size={16}/>}
        </button>
      </div>

      {/* Nav items */}
      <div style={{ padding: collapsed ? '8px 6px' : '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavItem icon={<Icon.Compass size={18}/>} label="推荐" active={route.name === 'recommend'} collapsed={collapsed}
          onClick={() => navigate({ name: 'recommend' })}/>
      </div>

      {/* My section */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setMySectionOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 8px 4px', color: 'var(--text-tertiary)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            <Icon.ChevronDown size={12} style={{ transform: mySectionOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 150ms' }}/>
            我的
          </button>

          {mySectionOpen && (
            <>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Icon.Search size={13}/>
                </span>
                <input
                  className="input-base"
                  placeholder="搜索收藏与最近"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ height: 32, fontSize: 12, paddingLeft: 30 }}
                />
              </div>

              {/* Favorites */}
              <SectionLabel
                title="收藏"
                count={favorites.length}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => onDrop(e, 'favorites')}
                highlighted={dragOver}
              />
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 1,
                background: dragOver ? 'var(--primary-50)' : 'transparent',
                borderRadius: 6, padding: dragOver ? 4 : 0,
                border: dragOver ? '1px dashed var(--primary-400)' : '1px dashed transparent',
                transition: 'all 150ms'
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => onDrop(e, 'favorites')}>
                {favFiltered.length === 0 && (
                  <div style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    {search ? '无匹配结果' : '从「最近」拖入或点击 ★ 收藏'}
                  </div>
                )}
                {favFiltered.map(id => (
                  <StockNavItem key={id} stockId={id} bucket="favorites"
                    confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete}
                    setDraggedId={setDraggedId}/>
                ))}
              </div>

              {/* Recents */}
              <SectionLabel title="最近" count={recents.length} style={{ marginTop: 8 }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {recFiltered.length === 0 && (
                  <div style={{ padding: '12px 8px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    {search ? '无匹配结果' : '尚未访问任何股票'}
                  </div>
                )}
                {recFiltered.map(id => (
                  <StockNavItem key={id} stockId={id} bucket="recents"
                    confirmDelete={confirmDelete} setConfirmDelete={setConfirmDelete}
                    setDraggedId={setDraggedId} draggable/>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Collapsed mini list */}
      {collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[...favorites, ...recents.filter(r => !favorites.includes(r))].slice(0, 12).map(id => {
            const s = window.getStock(id); if (!s) return null;
            const active = route.name === 'detail' && route.stockId === id;
            return (
              <button key={id} onClick={() => navigate({ name: 'detail', stockId: id })}
                title={s.name}
                style={{
                  padding: 4, borderRadius: 6,
                  background: active ? 'var(--primary-50)' : 'transparent',
                  display: 'flex', justifyContent: 'center'
                }}>
                <StockBlock code={s.id} market={s.market} size={32}/>
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: 12, borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <Icon.User size={16}/>
          </div>
          <div style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {useApp().user?.phone ? useApp().user.phone.slice(0,3) + '****' + useApp().user.phone.slice(-4) : '未登录'}
          </div>
        </div>
      )}
    </aside>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: collapsed ? 10 : '8px 10px',
      borderRadius: 8,
      background: active ? 'var(--primary-50)' : 'transparent',
      color: active ? 'var(--primary-700)' : 'var(--text-secondary)',
      fontWeight: active ? 600 : 500,
      fontSize: 14,
      justifyContent: collapsed ? 'center' : 'flex-start',
      transition: 'all 150ms'
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--neutral-100)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      {icon}{!collapsed && label}
    </button>
  );
}

function SectionLabel({ title, count, style, ...rest }) {
  return (
    <div {...rest} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 8px 4px', color: 'var(--text-tertiary)',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      ...style
    }}>
      <span>{title}</span>
      {count !== undefined && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{count}</span>}
    </div>
  );
}

function StockNavItem({ stockId, bucket, confirmDelete, setConfirmDelete, setDraggedId, draggable }) {
  const { navigate, route, isFav, toggleFavorite, removeFromBucket, showToast } = useApp();
  const s = window.getStock(stockId); if (!s) return null;
  const active = route.name === 'detail' && route.stockId === stockId;
  const key = `${bucket}-${stockId}`;
  const isConfirming = confirmDelete === key;
  const fav = isFav(stockId);

  return (
    <div
      draggable={draggable}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', stockId);
        setDraggedId(stockId);
      }}
      onDragEnd={() => setDraggedId(null)}
      onClick={() => navigate({ name: 'detail', stockId })}
      onMouseLeave={() => isConfirming && setConfirmDelete(null)}
      className="stock-nav-item"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', borderRadius: 6, cursor: 'pointer',
        background: isConfirming ? 'var(--danger-50)' : (active ? 'var(--primary-50)' : 'transparent'),
        color: active ? 'var(--primary-700)' : 'var(--text-primary)',
        fontSize: 13, fontWeight: active ? 600 : 500,
        position: 'relative', overflow: 'hidden'
      }}>
      <button
        className="hover-action"
        onClick={e => { e.stopPropagation(); toggleFavorite(stockId); }}
        title={fav ? '取消收藏' : '收藏'}
        style={{
          color: fav ? 'var(--warning-500)' : 'var(--text-muted)',
          padding: 2, display: 'flex'
        }}>
        <Icon.Star size={13} fill={fav}/>
      </button>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {s.name}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.id}</span>
      <button
        className="hover-action"
        onClick={e => {
          e.stopPropagation();
          if (isConfirming) {
            removeFromBucket(bucket, stockId);
            setConfirmDelete(null);
          } else {
            setConfirmDelete(key);
          }
        }}
        title={isConfirming ? '确认删除' : '删除'}
        style={{
          color: isConfirming ? 'var(--danger-600)' : 'var(--text-muted)',
          padding: 2, display: 'flex'
        }}>
        <Icon.Trash size={13}/>
      </button>
    </div>
  );
}

// Inject hover style once
if (!document.getElementById('sidebar-hover-style')) {
  const s = document.createElement('style');
  s.id = 'sidebar-hover-style';
  s.textContent = `
    .stock-nav-item .hover-action { opacity: 0; transition: opacity 150ms; }
    .stock-nav-item:hover .hover-action { opacity: 1; }
    .stock-nav-item:hover { background: var(--neutral-100); }
    @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;
  document.head.appendChild(s);
}

window.Sidebar = Sidebar;
