import React, { useState } from 'react';
import BorderGlow from './BorderGlow';

export default function ContactPage({ navigateTo, dark }) {
  const [form, setForm] = useState({ name:'', email:'', type:'general', message:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const t1 = dark ? '#ffffff' : '#0f172a';
  const t2 = dark ? 'rgba(196,220,255,.85)' : '#374151';
  const t3 = dark ? 'rgba(148,180,220,.6)' : '#94a3b8';
  const border = dark ? 'rgba(99,180,255,.22)' : 'rgba(199,210,254,.9)';
  const cardBg = dark ? 'rgba(4,14,36,.82)' : '#ffffff';
  const inputStyle = {
    width:'100%', padding:'13px 16px', borderRadius:12, fontSize:14.5,
    background: dark?'rgba(255,255,255,.06)':'#f8fafc',
    border:`1.5px solid ${border}`,
    color:t1, outline:'none', fontFamily:'var(--font)',
    transition:'border-color .2s',
    boxSizing:'border-box',
  };

  const submit = e => {
    e.preventDefault(); setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  if (sent) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'70vh', padding:'40px' }}>
      <div style={{ textAlign:'center', maxWidth:420 }}>
        <div style={{ fontSize:64, marginBottom:20 }}>✅</div>
        <h2 style={{
          fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:900,
          color:t1, marginBottom:12, letterSpacing:'-.03em',
          textShadow: dark?'0 0 30px rgba(52,211,153,.3)':'none',
        }}>Xabar yuborildi!</h2>
        <p style={{ fontSize:16, color:t2, lineHeight:1.75, marginBottom:30 }}>
          Tez orada siz bilan bog'lanamiz. Odatda 1-2 ish kuni ichida javob beramiz.
        </p>
        <button onClick={() => navigateTo('landing')} style={{
          padding:'14px 32px', borderRadius:13,
          background:'linear-gradient(135deg,#4f46e5,#0ea5e9)',
          color:'#fff', fontSize:15.5, fontWeight:700, border:'none', cursor:'pointer',
          boxShadow:'0 8px 30px rgba(79,70,229,.5)', fontFamily:'var(--font)',
        }}>Bosh sahifaga qaytish</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding:'0 0 80px', minHeight:'100vh' }}>

      {/* ── Hero ── */}
      <section style={{ padding:'64px clamp(24px,5vw,80px) 56px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ maxWidth:560 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'4px 14px', borderRadius:100, marginBottom:28,
            background: dark?'rgba(167,139,250,.14)':'rgba(124,58,237,.08)',
            border:`1px solid ${dark?'rgba(167,139,250,.4)':'rgba(124,58,237,.25)'}`,
            fontFamily:'monospace', fontSize:10, fontWeight:800,
            letterSpacing:'.16em', textTransform:'uppercase',
            color: dark?'#c4b5fd':'#7c3aed',
          }}>◎ Aloqa</div>
          <h1 style={{
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:'clamp(36px,4.5vw,60px)', fontWeight:900,
            lineHeight:1.08, letterSpacing:'-.04em',
            color:t1, marginBottom:18,
            textShadow: dark?'0 0 40px rgba(167,139,250,.22)':'none',
          }}>Biz bilan bog'laning</h1>
          <p style={{ fontSize:'clamp(15px,1.4vw,18px)', lineHeight:1.82, color:t2 }}>
            Savollaringiz, takliflaringiz yoki hamkorlik bo'yicha murojaat qiling.
          </p>
        </div>
      </section>

      {/* ── Main grid ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, alignItems:'start' }}>

          {/* Form card */}
          <BorderGlow
            backgroundColor={cardBg}
            glowColor="265 70 68"
            borderRadius={22}
            glowRadius={55}
            glowIntensity={1.4}
            coneSpread={38}
            colors={['#a78bfa','#818cf8','#38bdf8']}
          >
            <div style={{ padding:'38px 36px' }}>
              <h2 style={{
                fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:800,
                color:t1, marginBottom:28, letterSpacing:'-.025em',
              }}>Xabar yuborish</h2>
              <form onSubmit={submit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Ism-familiya *</div>
                    <input style={inputStyle} placeholder="Sizning ismingiz"
                      value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required
                      onFocus={e=>e.target.style.borderColor=dark?'rgba(99,180,255,.55)':'rgba(79,70,229,.55)'}
                      onBlur={e=>e.target.style.borderColor=border}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Email *</div>
                    <input type="email" style={inputStyle} placeholder="email@example.com"
                      value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required
                      onFocus={e=>e.target.style.borderColor=dark?'rgba(99,180,255,.55)':'rgba(79,70,229,.55)'}
                      onBlur={e=>e.target.style.borderColor=border}
                    />
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Murojaat turi</div>
                  <select style={inputStyle} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                    onFocus={e=>e.target.style.borderColor=dark?'rgba(99,180,255,.55)':'rgba(79,70,229,.55)'}
                    onBlur={e=>e.target.style.borderColor=border}>
                    <option value="general">Umumiy savol</option>
                    <option value="technical">Texnik yordam</option>
                    <option value="bug">Xato xabari</option>
                    <option value="partnership">Hamkorlik</option>
                  </select>
                </div>
                <div style={{ marginBottom:26 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Xabar *</div>
                  <textarea style={{ ...inputStyle, resize:'vertical', minHeight:130 }}
                    rows={5} placeholder="Xabaringizni yozing..."
                    value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required
                    onFocus={e=>e.target.style.borderColor=dark?'rgba(99,180,255,.55)':'rgba(79,70,229,.55)'}
                    onBlur={e=>e.target.style.borderColor=border}
                  />
                </div>
                <button type="submit" disabled={sending} style={{
                  width:'100%', padding:'15px 0', borderRadius:13,
                  background:'linear-gradient(135deg,#4f46e5,#0ea5e9)',
                  color:'#fff', fontSize:16, fontWeight:700, border:'none', cursor:'pointer',
                  boxShadow:'0 8px 28px rgba(79,70,229,.48)',
                  transition:'transform .2s,box-shadow .2s', fontFamily:'var(--font)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                }}
                  onMouseOver={e=>{ if(!sending){ e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 12px 38px rgba(79,70,229,.62)'; } }}
                  onMouseOut={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 28px rgba(79,70,229,.48)'; }}>
                  {sending ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>Yuborilmoqda...</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/>
                    </svg>Xabar Yuborish</>
                  )}
                </button>
              </form>
            </div>
          </BorderGlow>

          {/* Right sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { icon:'📧', t:'Email',    v:'jarvis@example.com', d:'Texnik savollar uchun', c:'#38bdf8', g:'200 90 75' },
              { icon:'📱', t:'Telegram', v:'@jarvis',         d:'Tezkor javob uchun',    c:'#818cf8', g:'240 70 65' },
              { icon:'🕐', t:'Ish vaqti',v:'09:00 – 18:00',     d:'Dushanba – Juma',       c:'#34d399', g:'160 80 65' },
            ].map(c => (
              <BorderGlow key={c.t} backgroundColor={cardBg} glowColor={c.g}
                borderRadius={16} glowRadius={44} glowIntensity={1.3} coneSpread={30}
                colors={[c.c,'#818cf8','#38bdf8']}>
                <div style={{ padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{
                    width:48, height:48, borderRadius:13, flexShrink:0,
                    background:`${c.c}1e`, border:`1.5px solid ${c.c}44`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>{c.t}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:c.c, marginBottom:2, letterSpacing:'-.01em' }}>{c.v}</div>
                    <div style={{ fontSize:12.5, color:t2 }}>{c.d}</div>
                  </div>
                </div>
              </BorderGlow>
            ))}

            {/* Links */}
            <div style={{
              padding:'22px', borderRadius:16,
              background: dark?'rgba(4,14,36,.75)':'#ffffff',
              border:`1px solid ${border}`,
              backdropFilter: dark?'blur(12px)':'none',
            }}>
              <div style={{ fontSize:11, fontWeight:700, color:t3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:16 }}>Foydali havolalar</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { icon:'🎓', l:"Ta'lim bo'limiga o'tish", p:'education' },
                  { icon:'◎',  l:"Loyiha haqida",           p:'about'    },
                  { icon:'🏠', l:"Bosh sahifa",              p:'landing'  },
                ].map(l => (
                  <button key={l.l} onClick={() => navigateTo(l.p)} style={{
                    display:'flex', alignItems:'center', gap:10, padding:'11px 14px',
                    borderRadius:10,
                    background: dark?'rgba(255,255,255,.06)':'rgba(79,70,229,.05)',
                    border:`1px solid ${border}`,
                    cursor:'pointer', color:t1, fontSize:14, fontWeight:600,
                    textAlign:'left', fontFamily:'var(--font)', transition:'all .2s',
                  }}
                    onMouseOver={e=>{ e.currentTarget.style.borderColor=dark?'rgba(99,180,255,.45)':'rgba(79,70,229,.45)'; e.currentTarget.style.background=dark?'rgba(99,180,255,.1)':'rgba(79,70,229,.08)'; }}
                    onMouseOut={e=>{ e.currentTarget.style.borderColor=border; e.currentTarget.style.background=dark?'rgba(255,255,255,.04)':'rgba(79,70,229,.04)'; }}>
                    <span style={{ fontSize:18 }}>{l.icon}</span>{l.l}
                    <span style={{ marginLeft:'auto', color:t3, fontSize:14 }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{
              padding:'18px 20px', borderRadius:16,
              background: dark?'rgba(4,14,36,.75)':'#ffffff',
              border:`1px solid ${dark?'rgba(52,211,153,.25)':'rgba(16,185,129,.2)'}`,
              backdropFilter: dark?'blur(12px)':'none',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 10px rgba(16,185,129,.7)', flexShrink:0 }}/>
                <span style={{ fontSize:15, fontWeight:700, color:t1 }}>Tizim ishlayapti</span>
              </div>
              <div style={{ fontSize:13, color:t2, lineHeight:1.6 }}>Barcha servislar normal ishlayapti. Javob vaqti &lt;30s</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}