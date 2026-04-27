// Login page
const { useState: uS_L } = React;

function LoginPage() {
  const { setUser, navigate } = useApp();
  const [tab, setTab] = uS_L('phone');
  const [phone, setPhone] = uS_L('');
  const [code, setCode] = uS_L('');
  const [countdown, setCountdown] = uS_L(0);
  const [error, setError] = uS_L(null);
  const [toast, setToast] = uS_L(null);

  const sendCode = () => {
    if (phone.length !== 11) return;
    setCountdown(60);
    setToast('验证码已发送（Demo：123456）');
    setTimeout(() => setToast(null), 2500);
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const submit = () => {
    if (phone.length !== 11 || code.length !== 6) return;
    if (code !== '123456') {
      setError('验证码错误，请重试');
      setCode('');
      return;
    }
    setUser({ phone, login_time: new Date().toISOString() });
    navigate({ name: 'recommend' });
  };

  const canSubmit = phone.length === 11 && code.length === 6;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-subtle)', position: 'relative', padding: 32
    }}>
      {/* Backdrop pattern */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(61,99,221,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.04) 0%, transparent 50%)'
      }}/>

      <div style={{
        background: 'var(--bg-base)', borderRadius: 16, padding: '48px 40px',
        width: 420, boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-default)',
        position: 'relative', zIndex: 1
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <ZionLogo size={36}/>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Zion</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            Stock Event Insight · 看懂股票事件，做更好的决策
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, padding: 4, background: 'var(--neutral-100)',
          borderRadius: 10, marginBottom: 28
        }}>
          {['phone', 'wechat'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7,
              background: tab === t ? 'var(--bg-base)' : 'transparent',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontWeight: 600, fontSize: 13,
              boxShadow: tab === t ? 'var(--shadow-xs)' : 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 150ms'
            }}>
              {t === 'phone' ? <Icon.Phone size={14}/> : <Icon.QR size={14}/>}
              {t === 'phone' ? '手机号登录' : '微信扫码'}
            </button>
          ))}
        </div>

        {tab === 'phone' ? (
          <div>
            <Field label="手机号 Phone Number">
              <input className="input-base"
                placeholder="请输入手机号"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              />
            </Field>
            <div style={{ height: 16 }}/>
            <Field label="验证码 Verification Code" hint={error}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className={"input-base" + (error ? " error" : "")}
                  placeholder="6 位验证码"
                  value={code}
                  onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null); }}
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-secondary"
                  disabled={countdown > 0 || phone.length !== 11}
                  onClick={sendCode}
                  style={{ width: 130, flexShrink: 0, opacity: (countdown > 0 || phone.length !== 11) ? 0.5 : 1 }}
                >
                  {countdown > 0 ? `重新发送 ${countdown}s` : '获取验证码'}
                </button>
              </div>
            </Field>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              未注册的手机号将自动注册
            </div>
            <button
              className="btn-primary"
              disabled={!canSubmit}
              onClick={submit}
              style={{ width: '100%', height: 44, marginTop: 24, fontSize: 15 }}
            >
              登录 / 注册
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 200, height: 200, margin: '0 auto', borderRadius: 12,
              border: '1px solid var(--border-default)', padding: 16,
              background: '#fff', position: 'relative', opacity: 0.4
            }}>
              <div style={{
                width: '100%', height: '100%',
                background: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 8px 8px`
              }}/>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              暂未开放，敬请期待
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-default)',
          fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6
        }}>
          本平台内容仅供参考，AI 分析不构成任何投资建议<br/>
          投资有风险，入市须谨慎
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--neutral-900)', color: '#fff',
          padding: '10px 16px', borderRadius: 8, boxShadow: 'var(--shadow-md)',
          fontSize: 14, zIndex: 1000
        }}>{toast}</div>
      )}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--danger-500)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

window.LoginPage = LoginPage;
