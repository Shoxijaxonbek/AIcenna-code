// App.jsx — AIcenna 3D Ta'lim Platformasi
import React, { useState, useEffect } from 'react';

import LandingPage    from './LandingPage';
import EducationPage  from './EducationPage';
import AboutPage      from './AboutPage';
import ContactPage    from './ContactPage';
import LoginPage      from './LoginPage';
import FloatingLines  from './FloatingLines';
import { isLoggedIn, getUser, logout } from './utils/auth';

/* ── Logo ─────────────────────────────────────────────────── */
const Logo = ({ onClick }) => (
  <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:11, cursor:'pointer' }}>
    <div style={{
      width:36, height:36, borderRadius:10, flexShrink:0,
      background:'linear-gradient(135deg,#06b6d4,#6366f1)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontFamily:'Space Grotesk', fontWeight:800, fontSize:16,
      boxShadow:'0 4px 16px rgba(6,182,212,.35)',
    }}>H</div>
    <div>
      <div style={{
        fontSize:15, fontFamily:'Space Grotesk', fontWeight:800,
        letterSpacing:'-.03em', lineHeight:1,
        background:'linear-gradient(135deg,#06b6d4,#6366f1)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
      }}>AIcenna</div>
      <div style={{ fontSize:9, color:'var(--t3)', letterSpacing:'.1em', marginTop:1, fontWeight:600 }}>
        3D ANATOMIYA · AI
      </div>
    </div>
  </div>
);

/* ── NAV ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id:'landing',   label:'Bosh Sahifa' },
  { id:'education', label:"Ta'lim"      },
  { id:'about',     label:'Haqimizda'   },
  { id:'contact',   label:"Bog'lanish"  },
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(() => isLoggedIn() ? getUser() : null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  if (!user) {
    return (
      <div data-theme={dark ? 'dark' : 'light'}>
        <LoginPage onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  const handleLogout = () => { logout(); setUser(null); setPage('landing'); };
  const nav = (p) => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); };

  return (
    <div data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight:'100vh', position:'relative', transition:'background .35s' }}>

      {/* ── GLOBAL BACKGROUND ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0 }}>
        <div style={{
          position:'absolute', inset:0,
          background: dark ? '#020b1a' : '#ffffff',
          transition: 'background .35s',
        }}/>
        {dark && (
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            <FloatingLines
              enabledWaves={['top','middle','bottom']}
              lineCount={7}
              lineDistance={5}
              bendRadius={5}
              bendStrength={-0.5}
              interactive={false}
              parallax={false}
              animationSpeed={0.9}
              linesGradient={['#06b6d4','#6366f1','#38bdf8','#8b5cf6','#0ea5e9','#06b6d4']}
              mixBlendMode="screen"
            />
          </div>
        )}
      </div>

      {/* ── NAVBAR ── */}
      <nav className="navbar" style={{ position:'relative', zIndex:100 }}>
        <div className="nav-wrap">
          <Logo onClick={() => nav('landing')}/>
          <div style={{ display:'flex', gap:2 }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id}
                className={`nav-link${page === n.id ? ' on' : ''}`}
                onClick={() => nav(n.id)}>
                {n.label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="tgl" onClick={() => setDark(d => !d)}>
              <div className="tgl-k">{dark ? '🌙' : '☀️'}</div>
            </button>
            {page !== 'education' && (
              <button className="btn btn-p" style={{ fontSize:13, padding:'9px 22px' }}
                onClick={() => nav('education')}>
                <span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  O'rganish
                </span>
              </button>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                display:'flex', alignItems:'center', gap:7,
                padding:'5px 11px', borderRadius:10,
                background:'var(--surf2)', border:'1px solid var(--brd2)',
              }}>
                <div style={{
                  width:22, height:22, borderRadius:6,
                  background:'linear-gradient(135deg,#06b6d4,#6366f1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:800, color:'#fff',
                }}>
                  {(user.full_name || user.username || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--t2)' }}>
                  {user.full_name || user.username}
                </span>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 5px #10b981' }}/>
              </div>
              <button title="Chiqish" onClick={handleLogout} style={{
                width:34, height:34, borderRadius:9,
                background:'var(--er-bg)', border:'1px solid var(--er-b)',
                cursor:'pointer', padding:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .2s', color:'var(--er)',
              }}
                onMouseOver={e => e.currentTarget.style.background='rgba(239,68,68,.15)'}
                onMouseOut={e  => e.currentTarget.style.background='var(--er-bg)'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGES ── */}
      <div style={{ position:'relative', zIndex:1 }}>
        {page === 'landing'   && <LandingPage   navigateTo={nav} dark={dark}/>}
        {page === 'education' && <EducationPage  navigateTo={nav} dark={dark}/>}
        {page === 'about'     && <AboutPage      navigateTo={nav} dark={dark}/>}
        {page === 'contact'   && <ContactPage    navigateTo={nav} dark={dark}/>}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        position:'relative', zIndex:1,
        borderTop:`1px solid ${dark?'rgba(6,182,212,.15)':'#e2e8f0'}`,
        background: dark?'rgba(2,11,26,.85)':'#ffffff',
        backdropFilter: dark?'blur(14px)':'none',
        padding:'28px 28px',
      }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:24, height:24, borderRadius:7, background:'linear-gradient(135deg,#06b6d4,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:800 }}>H</div>
              <span style={{ fontSize:13, fontWeight:600, color:dark?'#e2e8f0':'#374151' }}>AIcenna</span>
              <span style={{ fontSize:12, color:dark?'rgba(148,163,184,.7)':'#94a3b8' }}>· 3D Anatomiya Ta'lim Platformasi · 2026</span>
            </div>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {NAV_ITEMS.slice(1).map(n => (
                <button key={n.id} onClick={() => nav(n.id)} style={{
                  background:'none', border:'none', cursor:'pointer',
                  fontSize:12, color:dark?'rgba(148,163,184,.7)':'#94a3b8',
                  fontFamily:'var(--font)', transition:'color .2s',
                }}
                  onMouseOver={e => e.target.style.color = dark?'#06b6d4':'#4f46e5'}
                  onMouseOut={e => e.target.style.color = dark?'rgba(148,163,184,.7)':'#94a3b8'}>
                  {n.label}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {["Ko'z","Miya","Yuqori Tana","Hand Tracking"].map(t => (
                <span key={t} style={{
                  padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:600,
                  background: dark?'rgba(6,182,212,.1)':'rgba(79,70,229,.08)',
                  border:`1px solid ${dark?'rgba(6,182,212,.2)':'rgba(79,70,229,.2)'}`,
                  color: dark?'rgba(186,230,255,.7)':'#6b7280',
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
