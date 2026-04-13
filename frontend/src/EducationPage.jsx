// EducationPage.jsx — Fan bo'limlari tanlash + HoloMed ochish
import React, { useState } from 'react';
import BorderGlow from './BorderGlow';

const SUBJECTS = [
  {
    id: 'medicine',
    icon: '🫀',
    label: 'TIBBIYOT',
    sublabel: '3D Anatomiya',
    desc: "Ko'z, miya, yuqori tana va boshqa anatomik tuzilmalarni qo'l harakati va AI yordamida o'rganing.",
    color: '#06b6d4',
    glow: '190 90 75',
    colors: ['#06b6d4','#6366f1','#38bdf8'],
    active: true,
    features: ['3D Interaktiv Modellar','Qo\'l bilan Boshqarish','AI Ovoz Tafsiri','24 Anatomik Qism'],
  },
  {
    id: 'chemistry',
    icon: '⚗️',
    label: 'KIMYO',
    sublabel: '3D Molekulalar',
    desc: "Molekulalar, kimyoviy reaksiyalar va atom tuzilishini 3D ko'rinishda o'rganing.",
    color: '#10b981',
    glow: '160 80 65',
    colors: ['#10b981','#34d399','#6ee7b7'],
    active: false,
  },
  {
    id: 'astronomy',
    icon: '🔭',
    label: 'ASTRONOMIYA',
    sublabel: '3D Sayyoralar',
    desc: "Quyosh tizimi, yulduzlar va galaktikalarni 3D interaktiv simulatsiyada kashf eting.",
    color: '#8b5cf6',
    glow: '265 75 68',
    colors: ['#8b5cf6','#a78bfa','#c4b5fd'],
    active: false,
  },
  {
    id: 'physics',
    icon: '⚡',
    label: 'FIZIKA',
    sublabel: '3D Simulatsiya',
    desc: "Mexanika, elektr va kvant fizikasi qonunlarini real-time simulatsiyada kuzating.",
    color: '#f59e0b',
    glow: '45 90 70',
    colors: ['#f59e0b','#fbbf24','#fcd34d'],
    active: false,
  },
];

export default function EducationPage({ navigateTo, dark }) {
  const [hovered, setHovered] = useState(null);
  const [holoMedOpen, setHoloMedOpen] = useState(false);
  const t1 = dark ? '#f0f6ff' : '#0f172a';
  const t2 = dark ? 'rgba(196,220,255,.85)' : '#374151';
  const t3 = dark ? 'rgba(148,180,220,.65)' : '#94a3b8';
  const cardBg = dark ? 'rgba(4,14,36,.82)' : '#ffffff';
  const border = dark ? 'rgba(99,180,255,.2)' : '#cbd5e1';

  const openMedicine = () => setHoloMedOpen(true);

  return (
    <div style={{ padding:'0 0 80px', minHeight:'100vh' }}>
      {/* ── HoloMed 3D Modal ── */}
      {holoMedOpen && (
        <div style={{
          position:'fixed', inset:0, zIndex:9999,
          background:'rgba(0,0,0,.92)',
          display:'flex', flexDirection:'column',
        }}>
          {/* Modal header */}
          <div style={{
            height:52, flexShrink:0,
            background: dark?'rgba(2,11,26,.95)':'#0f172a',
            borderBottom:'1px solid rgba(6,182,212,.3)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 20px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:28, height:28, borderRadius:8,
                background:'linear-gradient(135deg,#06b6d4,#6366f1)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14, fontWeight:800, color:'#fff',
              }}>H</div>
              <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:14, fontFamily:'Space Grotesk' }}>
                AIcenna — Tibbiyot Anatomiyasi
              </span>
              <span style={{
                padding:'2px 10px', borderRadius:100, fontSize:10, fontWeight:700,
                background:'rgba(16,185,129,.15)', border:'1px solid rgba(16,185,129,.4)',
                color:'#34d399',
              }}>● LIVE</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <a href="http://localhost:5173" target="_blank" rel="noreferrer" style={{
                padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600,
                background:'rgba(6,182,212,.15)', border:'1px solid rgba(6,182,212,.35)',
                color:'#67e8f9', textDecoration:'none', cursor:'pointer',
              }}>⤢ To'liq ekran</a>
              <button onClick={() => setHoloMedOpen(false)} style={{
                padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600,
                background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.35)',
                color:'#fb7185', cursor:'pointer',
              }}>✕ Yopish</button>
            </div>
          </div>
          {/* iframe */}
          <iframe
            src="http://localhost:5173"
            title="AIcenna"
            allow="camera; microphone"
            style={{ flex:1, border:'none', width:'100%' }}
          />
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ padding:'64px clamp(24px,5vw,80px) 48px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ maxWidth:680 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'4px 14px', borderRadius:100, marginBottom:28,
            background: dark?'rgba(6,182,212,.14)':'rgba(6,182,212,.08)',
            border:`1px solid ${dark?'rgba(6,182,212,.45)':'rgba(6,182,212,.3)'}`,
            fontFamily:'monospace', fontSize:10, fontWeight:800,
            letterSpacing:'.16em', textTransform:'uppercase',
            color: dark?'#67e8f9':'#0891b2',
          }}>◎ Ta'lim Markazi</div>
          <h1 style={{
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:'clamp(36px,4.5vw,60px)', fontWeight:900,
            lineHeight:1.08, letterSpacing:'-.04em',
            color:t1, marginBottom:20,
            textShadow: dark?'0 0 40px rgba(6,182,212,.22)':'none',
          }}>Fan Bo'limini Tanlang</h1>
          <div style={{
            background: dark?'rgba(2,11,26,.62)':'#ffffff',
            backdropFilter: dark?'blur(16px)':'none',
            borderRadius:16, padding:'18px 22px',
            border:`1px solid ${dark?'rgba(6,182,212,.2)':'rgba(6,182,212,.18)'}`,
          }}>
            <p style={{ fontSize:'clamp(15px,1.4vw,17px)', lineHeight:1.82, color:t2, margin:0 }}>
              3D interaktiv muhitda o'zingiz tanlagan fan bo'yicha chuqur bilim oling.
              Hozircha{' '}
              <span style={{ color:dark?'#06b6d4':'#0891b2', fontWeight:700 }}>Tibbiyot</span>{' '}
              bo'limi to'liq ishlaydi. Boshqa bo'limlar tez kunda qo'shiladi.
            </p>
          </div>
        </div>
      </section>

      {/* ── Subject Cards ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
          {SUBJECTS.map(sub => (
            <div key={sub.id} style={{ position:'relative' }}>
              {sub.active ? (
                /* ACTIVE — Tibbiyot */
                <BorderGlow
                  backgroundColor={cardBg}
                  glowColor={sub.glow}
                  borderRadius={22}
                  glowRadius={55}
                  glowIntensity={1.5}
                  coneSpread={38}
                  colors={sub.colors}
                >
                  <div
                    onClick={openMedicine}
                    onMouseEnter={() => setHovered(sub.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding:'38px 36px',
                      cursor:'pointer',
                      transition:'transform .22s',
                      transform: hovered===sub.id ? 'translateY(-4px)' : 'none',
                    }}>
                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                      <div style={{
                        width:64, height:64, borderRadius:18, flexShrink:0,
                        background: dark?`${sub.color}22`:`${sub.color}14`,
                        border:`2px solid ${sub.color}55`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:30,
                        boxShadow:`0 0 24px ${sub.color}33`,
                      }}>{sub.icon}</div>
                      <div>
                        <div style={{
                          fontSize:22, fontWeight:900, color:t1,
                          fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'-.02em',
                        }}>{sub.label}</div>
                        <div style={{
                          fontSize:12, fontWeight:700, color:sub.color,
                          letterSpacing:'.08em', textTransform:'uppercase', marginTop:2,
                        }}>{sub.sublabel}</div>
                      </div>
                      {/* FAOL belgisi */}
                      <div style={{
                        marginLeft:'auto',
                        display:'flex', alignItems:'center', gap:6,
                        padding:'5px 12px', borderRadius:100,
                        background:`${sub.color}18`,
                        border:`1.5px solid ${sub.color}55`,
                        fontSize:11, fontWeight:800, color:sub.color,
                      }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:sub.color, boxShadow:`0 0 8px ${sub.color}` }}/>
                        FAOL
                      </div>
                    </div>

                    <p style={{ fontSize:14.5, color:t2, lineHeight:1.7, marginBottom:24 }}>
                      {sub.desc}
                    </p>

                    {/* Features */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
                      {sub.features.map(f => (
                        <span key={f} style={{
                          padding:'5px 12px', borderRadius:100, fontSize:12, fontWeight:600,
                          background:`${sub.color}15`,
                          border:`1px solid ${sub.color}40`,
                          color:dark?sub.color:'#374151',
                        }}>{f}</span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      padding:'14px', borderRadius:13,
                      background:`linear-gradient(135deg,${sub.color},${sub.colors[1]})`,
                      color:'#fff', fontSize:15, fontWeight:700,
                      boxShadow:`0 8px 28px ${sub.color}44`,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      AIcenna ni Ochish
                    </div>
                  </div>
                </BorderGlow>
              ) : (
                /* INACTIVE — Tez kunda (bezakli) */
                <div style={{
                  borderRadius:22, overflow:'hidden', position:'relative',
                  background: dark?'rgba(4,14,36,.78)':'rgba(248,250,252,.95)',
                  border:`1px solid ${dark?`${sub.color}30`:sub.color+'22'}`,
                  boxShadow: dark?`0 0 32px ${sub.color}18, inset 0 1px 0 rgba(255,255,255,.06)`:
                                  `0 4px 24px ${sub.color}14`,
                  transition:'box-shadow .3s',
                }}>
                  <style>{`@keyframes badge-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-4px) rotate(2deg)}}`}</style>

                  {/* Yuqori gradient chiziq */}
                  <div style={{
                    height:3,
                    background:`linear-gradient(90deg, transparent, ${sub.color}88, ${sub.color}, ${sub.color}88, transparent)`,
                  }}/>

                  {/* "TEZ KUNDA" — yuqori o'rta badge */}
                  <div style={{
                    position:'absolute', top:14, left:'50%',
                    transform:'translateX(-50%)',
                    zIndex:6,
                    display:'flex', alignItems:'center', gap:7,
                    padding:'5px 16px', borderRadius:100,
                    background: dark?`rgba(0,0,0,.7)`:'rgba(255,255,255,.9)',
                    backdropFilter:'blur(12px)',
                    border:`1.5px solid ${sub.color}66`,
                    boxShadow:`0 0 18px ${sub.color}44, 0 4px 12px rgba(0,0,0,.3)`,
                    animation:'badge-float 3s ease-in-out infinite',
                    whiteSpace:'nowrap',
                  }}>
                    <span style={{
                      width:7, height:7, borderRadius:'50%', flexShrink:0,
                      background:sub.color,
                      boxShadow:`0 0 8px ${sub.color}`,
                      animation:'pulse 1.4s ease-in-out infinite',
                    }}/>
                    <span style={{
                      fontSize:11, fontWeight:800, letterSpacing:'.12em',
                      textTransform:'uppercase', color:sub.color,
                    }}>Tez Kunda</span>
                    <span style={{ fontSize:14 }}>🚀</span>
                  </div>

                  {/* Overlay — bosilmasin */}
                  <div style={{ position:'absolute', inset:0, zIndex:5, cursor:'not-allowed' }}/>

                  <div style={{ padding:'52px 36px 36px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:18 }}>
                      <div style={{
                        width:64, height:64, borderRadius:18, flexShrink:0,
                        background: dark?`${sub.color}20`:`${sub.color}12`,
                        border:`2px solid ${sub.color}45`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:30,
                        boxShadow:`0 0 20px ${sub.color}22`,
                      }}>{sub.icon}</div>
                      <div>
                        <div style={{
                          fontSize:22, fontWeight:900, color:t1,
                          fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'-.02em',
                        }}>{sub.label}</div>
                        <div style={{
                          fontSize:12, fontWeight:700, color:sub.color,
                          letterSpacing:'.08em', textTransform:'uppercase', marginTop:2,
                        }}>{sub.sublabel}</div>
                      </div>
                    </div>

                    <p style={{ fontSize:14, color:t2, lineHeight:1.7, marginBottom:24, opacity:.85 }}>
                      {sub.desc}
                    </p>

                    {/* Kutish paneli */}
                    <div style={{
                      padding:'14px 16px', borderRadius:13,
                      background: dark?`${sub.color}0e`:`${sub.color}08`,
                      border:`1.5px dashed ${sub.color}44`,
                      display:'flex', alignItems:'center', gap:10,
                    }}>
                      <span style={{ fontSize:18 }}>⏳</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:sub.color, marginBottom:2 }}>
                          Ishlab chiqilmoqda...
                        </div>
                        <div style={{ fontSize:11, color:t3 }}>
                          Bu bo'lim tez orada sizga taqdim etiladi
                        </div>
                      </div>
                      <div style={{ marginLeft:'auto', fontSize:18 }}>🔧</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Info banner ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px)', maxWidth:1280, margin:'0 auto' }}>
        <div style={{
          padding:'24px 28px', borderRadius:16,
          background: dark?'rgba(6,182,212,.08)':'rgba(6,182,212,.05)',
          border:`1px solid ${dark?'rgba(6,182,212,.25)':'rgba(6,182,212,.2)'}`,
          display:'flex', alignItems:'center', gap:16,
        }}>
          <div style={{ fontSize:28, flexShrink:0 }}>💡</div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:dark?'#67e8f9':'#0891b2', marginBottom:4 }}>
              Tibbiyot bo'limi haqida
            </div>
            <div style={{ fontSize:13.5, color:t2, lineHeight:1.65 }}>
              AIcenna da qo'l harakatlari orqali 3D anatomik modellarni aylantiring,
              qismlarni tanlang va AI yordamida ovozli anatomik tushuntirish oling.
              Ko'z (24 qism), Miya 3D va Yuqori Tana modellari mavjud.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}