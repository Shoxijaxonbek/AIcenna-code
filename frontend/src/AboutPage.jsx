import React from 'react';
import BorderGlow from './BorderGlow';

const TECH = [
  { icon:'🤖', n:'GPT-4o Vision',   d:"OpenAI eng zamonaviy multimodal modeli — anatomik savollar uchun", c:'#0ea5e9', g:'200 80 80' },
  { icon:'🖐️', n:'MediaPipe Hands', d:"Qo'l imo-ishoralarini real vaqtda 21 nuqta bilan kuzatish",        c:'#10b981', g:'160 80 70' },
  { icon:'⚛️', n:'React + R3F',     d:'React Three Fiber — 3D modellarni brauzerda render qilish',          c:'#38bdf8', g:'200 90 75' },
  { icon:'📦', n:'Three.js',        d:'WebGL asosidagi 3D grafika kutubxonasi',                              c:'#f59e0b', g:'45 90 70'  },
  { icon:'🎤', n:'Web Speech API',  d:"Brauzer o'rnatilgan nutq tanish va sintez texnologiyasi",           c:'#6366f1', g:'240 70 65' },
  { icon:'🧬', n:'GLB/GLTF',       d:"3D anatomiya modellari — ko'z, miya, yuqori tana",                   c:'#8b5cf6', g:'265 75 68' },
];

const CARDS = [
  { icon:'🎯', t:'Maqsad', d:"Tibbiyot ta'limida 3D vizualizatsiya va sun'iy intellektni birlashtirish. Talabalar anatomik tuzilmalarni qo'l imo-ishoralari orqali boshqarib, AI dan ovozli tushuntirish olishlari mumkin.", color:'#818cf8', glow:'240 70 65' },
  { icon:'🔬', t:'Yondashuv', d:"Interaktiv 3D modellarda 24+ ko'z qismi, miya loblari va yuqori tana tuzilmalari. Har bir qismni tanlaganda real anatomik ma'lumot va AI tafsiri beriladi.", color:'#38bdf8', glow:'200 90 75' },
  { icon:'⚡', t:'Texnologiya', d:"MediaPipe qo'l kuzatish, Three.js 3D render, GPT-4o AI va Web Speech API birgalikda ishlatiladi. Brauzerda to'liq ishlaydi — hech qanday o'rnatish kerak emas.", color:'#34d399', glow:'160 80 65' },
  { icon:'🛡️', t:'Xavfsizlik', d:"Barcha ma'lumotlar faqat sessiya davomida saqlanadi. Kamera faqat qo'l kuzatish uchun ishlatiladi va hech qanday yozib olinmaydi.", color:'#f472b6', glow:'330 80 70' },
];

export default function AboutPage({ navigateTo, dark }) {
  const cardBg    = dark ? 'rgba(2,10,28,.92)' : '#ffffff';
  const t1        = dark ? '#ffffff' : '#0f172a';
  const t2        = dark ? 'rgba(196,220,255,.9)' : '#374151';
  const t3        = dark ? 'rgba(148,180,220,.65)' : '#64748b';
  const border    = dark ? 'rgba(99,180,255,.2)' : '#cbd5e1';
  const sectionBg = dark ? 'rgba(2,10,28,.75)' : 'rgba(248,250,252,.9)';

  return (
    <div style={{ padding:'0 0 80px', minHeight:'100vh' }}>
      <style>{`
        @keyframes about-glow { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes count-up   { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ padding:'64px clamp(24px,5vw,80px) 56px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{
          borderRadius:24, overflow:'hidden', position:'relative',
          background: dark?'rgba(2,10,28,.88)':'#ffffff',
          border:`1px solid ${dark?'rgba(99,102,241,.35)':'rgba(79,70,229,.2)'}`,
          boxShadow: dark?'0 32px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)':'0 8px 40px rgba(79,70,229,.1)',
          padding:'52px clamp(28px,4vw,64px)',
        }}>
          {/* glow blobs */}
          {dark && <>
            <div style={{ position:'absolute', top:-60, left:-60, width:280, height:280, borderRadius:'50%', background:'rgba(99,102,241,.15)', filter:'blur(60px)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', bottom:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(56,189,248,.12)', filter:'blur(50px)', pointerEvents:'none' }}/>
          </>}

          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:40, flexWrap:'wrap' }}>
            {/* Chap */}
            <div style={{ flex:'1 1 340px' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'5px 16px', borderRadius:100, marginBottom:24,
                background: dark?'rgba(99,102,241,.18)':'rgba(79,70,229,.08)',
                border:`1.5px solid ${dark?'rgba(129,140,248,.5)':'rgba(79,70,229,.25)'}`,
                fontFamily:'monospace', fontSize:10, fontWeight:800,
                letterSpacing:'.16em', textTransform:'uppercase',
                color: dark?'#a5b4fc':'#4338ca',
              }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#818cf8', boxShadow:'0 0 8px #818cf8' }}/>
                Loyiha haqida
              </div>

              <h1 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:'clamp(38px,4.8vw,68px)', fontWeight:900,
                lineHeight:1.05, letterSpacing:'-.045em',
                color:t1, marginBottom:8,
                textShadow: dark?'0 0 50px rgba(99,102,241,.3)':'none',
              }}>
                AIcenna
              </h1>
              <h1 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:'clamp(38px,4.8vw,68px)', fontWeight:900,
                lineHeight:1.05, letterSpacing:'-.045em',
                marginBottom:24,
                background:'linear-gradient(135deg,#38bdf8 0%,#818cf8 50%,#f472b6 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text',
              }}>
                3D Anatomiya
              </h1>

              <p style={{
                fontSize:'clamp(15px,1.3vw,17.5px)', lineHeight:1.85,
                color:t2, maxWidth:480, marginBottom:28,
              }}>
                Tibbiyot talabalari va professionallar uchun yaratilgan interaktiv 3D anatomiya platformasi.
                Qo'l imo-ishoralari, AI va real modellar bilan anatomiyani yangi darajada o'rganing.
              </p>

              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['GPT-4o AI','3D Modelli',"Qo'l Boshqaruvi","O'zbek tilida",'Bepul'].map((b,i) => {
                  const colors = ['#38bdf8','#818cf8','#34d399','#f59e0b','#f472b6'];
                  return (
                    <span key={b} style={{
                      padding:'6px 15px', borderRadius:100, fontSize:12, fontWeight:700,
                      background: dark?`${colors[i]}18`:`${colors[i]}0f`,
                      border:`1.5px solid ${colors[i]}${dark?'44':'30'}`,
                      color: dark?colors[i]:'#374151',
                    }}>{b}</span>
                  );
                })}
              </div>
            </div>

            {/* O'ng — statistika */}
            <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', gap:14, minWidth:200 }}>
              {[
                { n:'24+', l:"Ko'z qismlari", c:'#38bdf8' },
                { n:'3',   l:'3D Model',      c:'#818cf8' },
                { n:'AI',  l:"Ovozli tafsir", c:'#34d399' },
                { n:'60+', l:'FPS real-time', c:'#f59e0b' },
              ].map((s,i) => (
                <div key={i} style={{
                  padding:'16px 22px', borderRadius:14,
                  background: dark?'rgba(255,255,255,.05)':'rgba(79,70,229,.04)',
                  border:`1px solid ${dark?`${s.c}28`:border}`,
                  display:'flex', alignItems:'center', gap:14,
                  animation:`count-up .5s ${i*.1}s both`,
                }}>
                  <div style={{
                    fontSize:28, fontWeight:900, color:s.c,
                    fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'-.03em',
                    textShadow: dark?`0 0 20px ${s.c}88`:'none',
                    minWidth:52,
                  }}>{s.n}</div>
                  <div style={{ fontSize:12, color:t3, fontWeight:600, letterSpacing:'.02em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ASOSLAR ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:32 }}>
          <h2 style={{
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:'clamp(24px,2.8vw,38px)', fontWeight:900,
            color:t1, letterSpacing:'-.04em',
            textShadow: dark?'0 0 30px rgba(56,189,248,.2)':'none',
          }}>Platformaning asoslari</h2>
          <div style={{
            height:2, flex:1,
            background: dark?'linear-gradient(90deg,rgba(56,189,248,.4),transparent)':'linear-gradient(90deg,rgba(79,70,229,.3),transparent)',
            borderRadius:2,
          }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
          {CARDS.map(c => (
            <BorderGlow key={c.t} backgroundColor={cardBg} glowColor={c.glow}
              borderRadius={20} glowRadius={55} glowIntensity={1.6} coneSpread={38}
              colors={[c.color,'#818cf8','#38bdf8']}>
              <div style={{ padding:'36px 32px' }}>
                {/* Icon */}
                <div style={{
                  width:58, height:58, borderRadius:16, marginBottom:22,
                  background: dark?`${c.color}20`:`${c.color}12`,
                  border:`2px solid ${c.color}${dark?'55':'30'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
                  boxShadow: dark?`0 0 28px ${c.color}33`:'none',
                }}>{c.icon}</div>
                <h3 style={{
                  fontFamily:"'Space Grotesk',sans-serif",
                  fontSize:22, fontWeight:900, color:t1,
                  marginBottom:14, letterSpacing:'-.03em',
                }}>{c.t}</h3>
                <p style={{ fontSize:15, color:t2, lineHeight:1.82 }}>{c.d}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:32 }}>
          <h2 style={{
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:'clamp(24px,2.8vw,38px)', fontWeight:900,
            color:t1, letterSpacing:'-.04em',
            textShadow: dark?'0 0 30px rgba(56,189,248,.2)':'none',
          }}>Texnologiya steki</h2>
          <div style={{
            height:2, flex:1,
            background: dark?'linear-gradient(90deg,rgba(56,189,248,.4),transparent)':'linear-gradient(90deg,rgba(79,70,229,.3),transparent)',
            borderRadius:2,
          }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {TECH.map((t,i) => (
            <BorderGlow key={t.n} backgroundColor={cardBg} glowColor={t.g}
              borderRadius={16} glowRadius={46} glowIntensity={1.45} coneSpread={32}
              colors={[t.c,'#818cf8','#38bdf8']}>
              <div style={{ padding:'24px 22px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{
                  width:52, height:52, borderRadius:14, flexShrink:0,
                  background: dark?`${t.c}20`:`${t.c}12`,
                  border:`2px solid ${t.c}${dark?'50':'28'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                  boxShadow: dark?`0 0 24px ${t.c}33`:'none',
                }}>{t.icon}</div>
                <div>
                  <div style={{
                    fontWeight:800, fontSize:16, color:t1, marginBottom:5,
                    letterSpacing:'-.01em',
                  }}>{t.n}</div>
                  <div style={{ fontSize:12.5, color:t2, lineHeight:1.6 }}>{t.d}</div>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── MODELLAR ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <BorderGlow backgroundColor={cardBg} glowColor="200 80 75"
          borderRadius={22} glowRadius={60} glowIntensity={1.3} coneSpread={42}
          colors={['#38bdf8','#818cf8','#34d399']}>
          <div style={{ padding:'40px 42px' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:28 }}>
              <h3 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:'clamp(20px,2.2vw,28px)', fontWeight:900, color:t1,
              }}>Mavjud 3D Modellar</h3>
              <div style={{
                height:2, flex:1,
                background:'linear-gradient(90deg,rgba(56,189,248,.4),transparent)',
                borderRadius:2,
              }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { icon:'👁', n:"Ko'z Anatomiyasi", d:'24 ta alohida qism. Kranium, retina, ko\'ruv nervi, iris, sklera, shisha tana va boshqalar. Explode rejimi mavjud.', tag:'24 Qism', tc:'#38bdf8' },
                { icon:'🧠', n:'Miya 3D',          d:'Real miya GLB modeli. Frontal, parietal, temporal, oksipital loblar, miyacha va miya poyasi.',                      tag:'GLB Model', tc:'#818cf8' },
                { icon:'🫀', n:'Yuqori Tana',       d:"Bosh suyagi, ko'krak qafasi, muskullar, asosiy organlar va qon tomir tizimi.",                                    tag:'Anatomiya', tc:'#34d399' },
              ].map(d => (
                <div key={d.n} style={{
                  padding:'22px', borderRadius:16,
                  background: dark?'rgba(255,255,255,.06)':'rgba(79,70,229,.04)',
                  border:`1.5px solid ${dark?`${d.tc}28`:border}`,
                  transition:'border-color .2s, transform .2s',
                }}
                  onMouseOver={e=>{ e.currentTarget.style.borderColor=`${d.tc}55`; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseOut={e=>{ e.currentTarget.style.borderColor=dark?`${d.tc}28`:border; e.currentTarget.style.transform='none'; }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{
                      width:44, height:44, borderRadius:12, flexShrink:0,
                      background: dark?`${d.tc}18`:`${d.tc}10`,
                      border:`1.5px solid ${d.tc}${dark?'44':'28'}`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                    }}>{d.icon}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14.5, color:t1 }}>{d.n}</div>
                      <span style={{
                        padding:'2px 9px', borderRadius:100, fontSize:10, fontWeight:700,
                        background:`${d.tc}18`, border:`1px solid ${d.tc}44`, color:d.tc,
                      }}>{d.tag}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:t2, lineHeight:1.68 }}>{d.d}</p>
                </div>
              ))}
            </div>
          </div>
        </BorderGlow>
      </section>

      {/* ── CTA ── */}
      <div style={{ textAlign:'center', padding:'8px 0' }}>
        <button onClick={() => navigateTo('education')} style={{
          display:'inline-flex', alignItems:'center', gap:10,
          padding:'16px 40px', borderRadius:14,
          background:'linear-gradient(135deg,#06b6d4,#6366f1)',
          color:'#fff', fontSize:17, fontWeight:800, border:'none', cursor:'pointer',
          boxShadow:'0 12px 40px rgba(6,182,212,.5)',
          transition:'transform .2s,box-shadow .2s', fontFamily:'var(--font)',
          letterSpacing:'-.01em',
        }}
          onMouseOver={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 20px 52px rgba(6,182,212,.65)'; }}
          onMouseOut={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 12px 40px rgba(6,182,212,.5)'; }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ta'limni Boshlash →
        </button>
      </div>
    </div>
  );
}