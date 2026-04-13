// GuidePage.jsx — Boshlang'ich qo'llanma (onboarding)
import { useState, useEffect, useRef } from 'react';

const SLIDES = [
  {
    id: 1,
    title: "AIcenna ga Xush Kelibsiz",
    desc: "Sun'iy intellekt va 3D anatomiya platformasi. Ko'z, miya va yuqori tana tuzilmalarini qo'lingiz bilan boshqaring.",
    icon: '🧬',
    color: '#06b6d4',
    anim: 'pulse',
    hint: "Kamera va qo'l kuzatish avtomatik yoqiladi",
  },
  {
    id: 2,
    title: "Qo'l Harakatlari",
    desc: null, // gestures ko'rsatiladi
    icon: '🤏',
    color: '#8b5cf6',
    anim: 'gestures',
    hint: "Barcha harakatlar kamera orqali taniladi",
  },
  {
    id: 3,
    title: "3D Model Boshqaruvi",
    desc: "Modelni aylantiring, kattalashtiring va har bir anatomik qismni tanlang. AI darhol tushuntirish beradi.",
    icon: '🧠',
    color: '#10b981',
    anim: 'model',
    hint: "Qismni tanlash uchun 0.4s ushlab turing",
  },
  {
    id: 4,
    title: "AI Ovoz Yordamchisi",
    desc: "Ko'rsatkich barmoq + kaft ko'taring yoki mic tugmasini bosing. O'zbek tilida anatomik savollar bering.",
    icon: '🎙️',
    color: '#f59e0b',
    anim: 'voice',
    hint: "GPT-4o modeli o'zbek tilida javob beradi",
  },
];

const GESTURES = [
  { icon:'🖐', label:'Kaft', desc:'Model aylantirish' },
  { icon:'🤏', label:'Pinch', desc:'Qism tanlash (0.4s)' },
  { icon:'✌️', label:'Ikki qo\'l', desc:'Zoom in/out' },
  { icon:'✊', label:'Mushtlash', desc:'Explode / Yig\'ish' },
  { icon:'☝️+🖐', label:'Ovoz', desc:'AI ga savol' },
  { icon:'🤙', label:'Sho\'xa', desc:'Qism bekor' },
];

// ── Animatsiyalar ──────────────────────────────────────────────────────────────

function AnimPulse({ color }) {
  return (
    <div style={{ position:'relative', width:120, height:120, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes g-ring { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.15);opacity:1} }
        @keyframes g-ring2{ 0%,100%{transform:scale(1);opacity:.25} 50%{transform:scale(1.25);opacity:.6} }
        @keyframes g-dna  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
      {[0,1,2].map(i=>(
        <div key={i} style={{
          position:'absolute', borderRadius:'50%',
          width:120-i*24, height:120-i*24,
          border:`1.5px solid ${color}`,
          opacity: 0.6-i*0.15,
          animation:`g-ring ${2+i*0.5}s ease-in-out ${i*0.3}s infinite`,
        }}/>
      ))}
      <div style={{ fontSize:52, animation:'g-dna 8s linear infinite', zIndex:2 }}>🧬</div>
    </div>
  );
}

function AnimGestures() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % GESTURES.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width:'100%', maxWidth:340 }}>
      <style>{`@keyframes g-pop{0%{opacity:0;transform:scale(.85)}100%{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {GESTURES.map((g, i) => (
          <div key={i} style={{
            padding:'10px 6px', borderRadius:12, textAlign:'center',
            background: i===active ? 'rgba(139,92,246,.2)' : 'rgba(255,255,255,.04)',
            border:`1.5px solid ${i===active ? '#8b5cf6' : 'rgba(255,255,255,.1)'}`,
            transition:'all .3s',
          }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{g.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, color: i===active ? '#c4b5fd' : 'rgba(255,255,255,.5)', marginBottom:2 }}>{g.label}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', lineHeight:1.3 }}>{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimModel({ color }) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAngle(a => (a+1.5) % 360), 30);
    return () => clearInterval(t);
  }, []);
  const parts = [
    { r:45, col:'#a46842', w:60, h:55 },
    { r:25, col:'#e1eef7', w:28, h:28 },
    { r:25, col:'#572c20', w:8, h:8 },
    { r:35, col:'#df0912', w:6, h:6 },
  ];
  return (
    <div style={{ position:'relative', width:120, height:120 }}>
      <style>{`@keyframes g-orbit{to{transform:rotate(360deg)}}`}</style>
      {/* Rotating model representation */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{
          width:70, height:85,
          borderRadius:'40% 40% 35% 35%',
          background:`conic-gradient(from ${angle}deg, #a46842 0%, #c4b39a 30%, #a46842 60%, #8a5230 100%)`,
          boxShadow:`0 0 20px ${color}44`,
          transition:'none',
        }}/>
      </div>
      {/* Orbit line */}
      <div style={{
        position:'absolute', inset:-8,
        borderRadius:'50%',
        border:`1px dashed ${color}66`,
        animation:'g-orbit 4s linear infinite',
      }}>
        <div style={{
          position:'absolute', top:-5, left:'50%', transform:'translateX(-50%)',
          width:10, height:10, borderRadius:'50%',
          background:color, boxShadow:`0 0 8px ${color}`,
        }}/>
      </div>
      {/* Selected indicator */}
      <div style={{
        position:'absolute', bottom:-14, left:'50%', transform:'translateX(-50%)',
        padding:'2px 8px', borderRadius:6,
        background:`${color}22`, border:`1px solid ${color}55`,
        fontSize:9, color:color, fontWeight:700, whiteSpace:'nowrap',
      }}>TANLANGAN</div>
    </div>
  );
}

function AnimVoice({ color }) {
  const [bars, setBars] = useState([3,5,8,4,6,9,3,5,7,4]);
  useEffect(() => {
    const t = setInterval(() => {
      setBars(b => b.map(() => 2 + Math.floor(Math.random()*10)));
    }, 150);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      {/* Mic */}
      <div style={{
        width:64, height:64, borderRadius:'50%',
        background:`${color}22`, border:`2px solid ${color}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28,
        boxShadow:`0 0 20px ${color}44, 0 0 40px ${color}22`,
      }}>🎙️</div>
      {/* Wave bars */}
      <div style={{ display:'flex', alignItems:'center', gap:3, height:32 }}>
        {bars.map((h,i) => (
          <div key={i} style={{
            width:4, borderRadius:2,
            height:h*3,
            background:`linear-gradient(to top, ${color}, ${color}88)`,
            transition:'height .12s ease',
          }}/>
        ))}
      </div>
      <div style={{ fontSize:11, color:`${color}cc`, fontFamily:'monospace', letterSpacing:'1px' }}>
        TINGLANMOQDA...
      </div>
    </div>
  );
}

function SlideAnim({ slide }) {
  if (slide.anim === 'pulse')    return <AnimPulse color={slide.color}/>;
  if (slide.anim === 'gestures') return <AnimGestures/>;
  if (slide.anim === 'model')    return <AnimModel color={slide.color}/>;
  if (slide.anim === 'voice')    return <AnimVoice color={slide.color}/>;
  return null;
}

// ── Main GuidePage ─────────────────────────────────────────────────────────────
export default function GuidePage({ onDone }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const next = () => {
    if (isLast) { onDone(); return; }
    setStep(s => s+1);
  };

  const skip = () => onDone();

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(2,11,26,.92)',
      backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <style>{`
        @keyframes slide-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%,100%{opacity:.6} 50%{opacity:1} }
      `}</style>

      {/* Box */}
      <div style={{
        width: 420, maxWidth:'92vw',
        background:'rgba(4,14,36,.96)',
        border:`1.5px solid ${slide.color}44`,
        borderRadius:24,
        boxShadow:`0 0 60px ${slide.color}22, 0 32px 80px rgba(0,0,0,.6)`,
        overflow:'hidden',
        animation:'slide-in .4s cubic-bezier(.22,.68,0,1.2)',
        key: step,
      }}>
        {/* Top bar */}
        <div style={{ height:3, background:`linear-gradient(90deg, transparent, ${slide.color}, transparent)` }}/>

        {/* Dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, padding:'16px 0 0' }}>
          {SLIDES.map((_,i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              width: i===step ? 24 : 8, height:8, borderRadius:4,
              background: i===step ? slide.color : 'rgba(255,255,255,.18)',
              transition:'all .3s', cursor:'pointer',
            }}/>
          ))}
        </div>

        {/* Anim zone */}
        <div style={{
          height:160, display:'flex', alignItems:'center', justifyContent:'center',
          padding:'16px 24px 0',
        }}>
          <SlideAnim key={step} slide={slide}/>
        </div>

        {/* Text zone */}
        <div style={{ padding:'20px 28px 24px', textAlign:'center' }}>
          <h2 style={{
            fontFamily:"'Space Grotesk',sans-serif",
            fontSize:20, fontWeight:900, color:'#f0f6ff',
            marginBottom:10, letterSpacing:'-.02em',
            textShadow:`0 0 20px ${slide.color}66`,
          }}>{slide.title}</h2>

          {slide.desc && (
            <p style={{
              fontSize:13.5, color:'rgba(196,220,255,.82)',
              lineHeight:1.75, marginBottom:12,
            }}>{slide.desc}</p>
          )}

          {/* Hint */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'5px 12px', borderRadius:100,
            background:`${slide.color}14`,
            border:`1px solid ${slide.color}40`,
            fontSize:11, color:`${slide.color}cc`,
            marginBottom:20, animation:'shimmer 2.5s ease-in-out infinite',
          }}>
            <span>💡</span> {slide.hint}
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', gap:10 }}>
            {/* Skip */}
            {!isLast && (
              <button onClick={skip} style={{
                flex:1, padding:'11px', borderRadius:12,
                background:'rgba(255,255,255,.05)',
                border:'1px solid rgba(255,255,255,.12)',
                color:'rgba(255,255,255,.4)', fontSize:13, fontWeight:600,
                cursor:'pointer', fontFamily:'inherit',
              }}>O'tkazib yuborish</button>
            )}

            {/* Next / Start */}
            <button onClick={next} style={{
              flex:2, padding:'12px', borderRadius:12,
              background:`linear-gradient(135deg, ${slide.color}, ${slide.color}99)`,
              border:'none', color:'#fff',
              fontSize:14, fontWeight:700, cursor:'pointer',
              fontFamily:'inherit',
              boxShadow:`0 8px 24px ${slide.color}44`,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}>
              {isLast ? (
                <><span>🚀</span> Boshlash</>
              ) : (
                <>Keyingi <span style={{ fontSize:16 }}>→</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Step counter */}
      <div style={{
        position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
        fontSize:11, color:'rgba(255,255,255,.25)', fontFamily:'monospace',
      }}>
        {step+1} / {SLIDES.length}
      </div>
    </div>
  );
}