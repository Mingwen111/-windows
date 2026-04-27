// Shared UI components & utilities for Zion
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Fragment } = React;

// ============== Icons ==============
const Icon = {
  Search: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  Star: ({ size = 16, fill = false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trash: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Close: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  ChevronDown: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>,
  ChevronRight: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>,
  ChevronLeft: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>,
  Menu: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></svg>,
  Compass: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  User: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Send: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  Sparkles: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>,
  Network: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>,
  Phone: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  QR: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M21 21v-3"/><path d="M21 14v3"/><path d="M14 21h3"/></svg>,
  Plus: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Filter: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  TrendUp: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Diamond: ({ size = 12, fill = 'currentColor' }) => <svg width={size} height={size} viewBox="0 0 12 12"><polygon points="6,1 11,6 6,11 1,6" fill={fill}/></svg>,
};

// ============== App State Context ==============
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState({ name: 'login' }); // {name:'login'|'recommend'|'detail'|'causal', stockId?, kpId?}
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [kpModalOpen, setKpModalOpen] = useState(null); // kpId
  const [toast, setToastState] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // {bucket, id, item, originalIndex}

  const navigate = (r) => setRoute(r);

  const showToast = (msg, action) => {
    setToastState({ msg, action, ts: Date.now() });
    setTimeout(() => setToastState(t => (t && t.ts === t.ts ? null : t)), 3000);
  };

  const addRecent = (stockId) => {
    setRecents(prev => {
      const next = [stockId, ...prev.filter(x => x !== stockId)];
      return next.slice(0, 10);
    });
  };

  const toggleFavorite = (stockId) => {
    setFavorites(prev => {
      if (prev.includes(stockId)) {
        showToast('已取消收藏');
        return prev.filter(x => x !== stockId);
      }
      showToast('已加入收藏');
      return [stockId, ...prev];
    });
  };

  const isFav = (id) => favorites.includes(id);

  const removeFromBucket = (bucket, id) => {
    let original;
    if (bucket === 'favorites') {
      setFavorites(prev => {
        const idx = prev.indexOf(id);
        original = { idx, items: [...prev] };
        return prev.filter(x => x !== id);
      });
    } else {
      setRecents(prev => {
        const idx = prev.indexOf(id);
        original = { idx, items: [...prev] };
        return prev.filter(x => x !== id);
      });
    }
    setPendingDelete({ bucket, id });
    const undo = () => {
      if (bucket === 'favorites') setFavorites(original.items);
      else setRecents(original.items);
      setToastState(null);
      setPendingDelete(null);
    };
    setToastState({ msg: '已删除', action: { label: '撤销', onClick: undo }, ts: Date.now() });
    setTimeout(() => {
      setToastState(t => (t && t.action === undo ? null : t));
      setPendingDelete(null);
    }, 3000);
  };

  const value = {
    user, setUser, route, navigate,
    favorites, recents, addRecent, toggleFavorite, isFav,
    sidebarCollapsed, setSidebarCollapsed,
    aiModalOpen, setAiModalOpen,
    kpModalOpen, setKpModalOpen,
    toast, showToast, removeFromBucket
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ============== Toast ==============
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--neutral-900)', color: '#fff',
      padding: '10px 16px', borderRadius: 8, boxShadow: 'var(--shadow-md)',
      display: 'flex', alignItems: 'center', gap: 12, fontSize: 14,
      zIndex: 10000, animation: 'toastIn 200ms ease-out'
    }}>
      <span>{toast.msg}</span>
      {toast.action && (
        <button onClick={toast.action.onClick} style={{
          color: 'var(--primary-300)', fontWeight: 600, fontSize: 13
        }}>{toast.action.label}</button>
      )}
    </div>
  );
}

// ============== StockBlock (code square) ==============
function StockBlock({ code, market, size = 36 }) {
  // Color by market
  const palette = {
    'A股': { bg: 'var(--danger-50)', fg: 'var(--danger-700)' },
    '港股': { bg: 'var(--auxiliary-50)', fg: 'var(--auxiliary-700)' },
    '美股': { bg: 'var(--primary-50)', fg: 'var(--primary-700)' },
  };
  const p = palette[market] || { bg: 'var(--neutral-100)', fg: 'var(--neutral-700)' };
  const display = /^\d/.test(code) ? code.slice(0, 4) : code.slice(0, 4);
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: p.bg, color: p.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size < 32 ? 9 : 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
      flexShrink: 0, letterSpacing: '-0.02em'
    }}>{display}</div>
  );
}

// ============== Brand Logo ==============
function ZionLogo({ size = 28, color = 'var(--primary-500)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.5, letterSpacing: '-0.04em'
    }}>Z</div>
  );
}

Object.assign(window, { Icon, AppCtx, useApp, AppProvider, Toast, StockBlock, ZionLogo });
