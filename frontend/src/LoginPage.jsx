// src/LoginPage.jsx
import React, { useState } from 'react';
import { login } from './utils/auth';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [show, setShow]         = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true); setError('');
    try {
      const user = await login(username.trim(), password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      padding: '20px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,.12), rgba(99,102,241,.08), transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 20, padding: '40px 36px',
        boxShadow: '0 24px 80px rgba(0,0,0,.15)',
        position: 'relative', overflow: 'hidden',
        animation: 'su .5s cubic-bezier(.22,.68,0,1.2) both',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #0ea5e9, #6366f1, #8b5cf6)',
        }}/>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 900, color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 8px 24px rgba(14,165,233,.35)',
          }}>V</div>
          <div style={{
            fontSize: 20, fontWeight: 800, letterSpacing: '-.02em',
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>AIcenna</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: '.1em', marginTop: 2 }}>
            3D TA'LIM PLATFORMASI
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: 'var(--t1)',
            fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4,
          }}>Tizimga kirish</h2>
          <p style={{ fontSize: 13, color: 'var(--t3)' }}>
            Login va parolingizni kiriting
          </p>
        </div>

        <form onSubmit={handle}>
          {/* Username */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'var(--t2)', marginBottom: 6, letterSpacing: '.03em',
            }}>Foydalanuvchi nomi</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="var(--t3)" strokeWidth="1.8"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--t3)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="foydalanuvchi"
                autoComplete="username"
                style={{
                  width: '100%', padding: '11px 12px 11px 36px',
                  borderRadius: 10, border: '1px solid var(--brd2)',
                  background: 'var(--surf2)', color: 'var(--t1)',
                  fontSize: 14, outline: 'none', transition: 'border-color .2s',
                  fontFamily: 'var(--font)', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e  => e.target.style.borderColor = 'var(--brd2)'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'var(--t2)', marginBottom: 6, letterSpacing: '.03em',
            }}>Parol</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--t3)" strokeWidth="1.8"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--t3)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type={show ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '11px 40px 11px 36px',
                  borderRadius: 10, border: '1px solid var(--brd2)',
                  background: 'var(--surf2)', color: 'var(--t1)',
                  fontSize: 14, outline: 'none', transition: 'border-color .2s',
                  fontFamily: 'var(--font)', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                onBlur={e  => e.target.style.borderColor = 'var(--brd2)'}
              />
              {/* Show/hide */}
              <button type="button" onClick={() => setShow(s => !s)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: 'var(--t3)',
              }}>
                {show
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 9, marginBottom: 16,
              background: 'var(--er-bg)', border: '1px solid var(--er-b)',
              fontSize: 13, color: 'var(--er)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading || !username || !password}
            className="btn btn-p" style={{ width: '100%', padding: '13px', fontSize: 15, justifyContent: 'center' }}>
            <span>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Kirilmoqda...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="10 17 15 12 10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="15" y1="12" x2="3" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Kirish
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer hint */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', marginTop: 20 }}>
          Muammo bo'lsa foydalanuvchiistrator bilan bog'laning
        </p>
      </div>
    </div>
  );
}