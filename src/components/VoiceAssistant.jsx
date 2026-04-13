import { useEffect, useRef, useState } from 'react';

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
}
function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  );
}

export default function VoiceAssistant({
  isListening, isTranscribing, isWaitingConfirm, isLoading, isSpeaking,
  pendingTranscript, transcript, answer, history, error,
  onMicToggle, onStopSpeaking, onConfirm, onDiscard,
}) {
  const chatRef = useRef(null);
  const [chatOpen,  setChatOpen]  = useState(false);
  const [editText,  setEditText]  = useState('');

  // Chat panelni avtomatik ochish
  useEffect(() => {
    if (isListening || isTranscribing || isWaitingConfirm || isLoading || isSpeaking) {
      setChatOpen(true);
    }
  }, [isListening, isTranscribing, isWaitingConfirm, isLoading, isSpeaking]);

  useEffect(() => {
    if (history.length > 0) setChatOpen(true);
  }, [history.length]);

  // Yangi pendingTranscript kelganda edit maydonini to'ldirish
  useEffect(() => {
    if (pendingTranscript) setEditText(pendingTranscript);
  }, [pendingTranscript]);

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [history, isLoading, isWaitingConfirm]);

  const handleConfirm = () => {
    const text = editText.trim();
    if (text) onConfirm(text);
  };

  const handleMicClick = (e) => {
    e.stopPropagation();
    setChatOpen(true);
    onMicToggle();
  };

  // Status text
  const statusText = isListening    ? '🔴 Tinglanmoqda...'
                   : isTranscribing ? '⚙️ Matn ajratilmoqda...'
                   : isWaitingConfirm ? '✏️ Tekshirib tasdiqlang'
                   : isLoading      ? '⏳ AI javob yozmoqda...'
                   : isSpeaking     ? '🔊 Gapirmoqda...'
                   : error          ? '⚠️ ' + error.slice(0, 28)
                   : '☝️+🖐 Ovoz yozish';

  const statusColor = isListening    ? '#ff6666'
                    : isTranscribing ? '#a78bfa'
                    : isWaitingConfirm ? '#ffd700'
                    : isLoading      ? '#ffd700'
                    : isSpeaking     ? '#00d4ff'
                    : error          ? '#ff8888'
                    : 'rgba(255,255,255,0.32)';

  const hasActivity = isListening || isTranscribing || isWaitingConfirm || isLoading || isSpeaking;
  const unread      = !chatOpen && history.length > 0;

  return (
    <div style={{
      position:'fixed', bottom:16, right:16,
      width:310, zIndex:1000,
      display:'flex', flexDirection:'column', gap:0,
    }}>

      {/* Chat panel */}
      <div style={{
        maxHeight: chatOpen ? 480 : 0,
        opacity: chatOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
        pointerEvents: chatOpen ? 'auto' : 'none',
      }}>

        {/* Header */}
        <div style={{
          background:'rgba(4,14,30,0.97)',
          border:'1px solid rgba(0,212,255,0.2)',
          borderBottom:'none',
          borderRadius:'12px 12px 0 0',
          padding:'8px 12px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{
              width:6, height:6, borderRadius:'50%',
              background: hasActivity ? '#ff4444' : '#00d4ff',
              animation: hasActivity ? 'blink 1s infinite' : 'none',
            }}/>
            <span style={{ fontSize:10, fontFamily:'monospace', color:'#00d4ff', letterSpacing:'1.5px' }}>AI CHAT</span>
          </div>
          <button onClick={() => setChatOpen(false)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:20, height:20, color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{
          minHeight:80, maxHeight:300,
          overflowY:'auto',
          background:'rgba(4,14,30,0.97)',
          borderLeft:'1px solid rgba(0,212,255,0.2)',
          borderRight:'1px solid rgba(0,212,255,0.2)',
          padding:'10px 12px',
          display:'flex', flexDirection:'column', gap:8,
          scrollbarWidth:'none',
        }}>

          {/* Bo'sh holat */}
          {history.length === 0 && !isListening && !isTranscribing && !isWaitingConfirm && !isLoading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'18px 0', gap:8 }}>
              <div style={{ fontSize:22, opacity:0.3 }}>🎙️</div>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontFamily:'monospace', textAlign:'center', lineHeight:1.5 }}>
                ☝️ Ko'rsatkich + 🖐 Kaft<br/>yoki mic tugmasini bosing
              </span>
            </div>
          )}

          {/* Yozilayotgan indikator */}
          {isListening && (
            <div style={{
              background:'rgba(255,68,68,0.07)',
              border:'1px solid rgba(255,68,68,0.25)',
              borderRadius:10, padding:'10px 14px',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ fontSize:10, color:'rgba(255,100,100,0.7)', fontFamily:'monospace', flexShrink:0 }}>REC</span>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ width:3, background:'#ff6666', borderRadius:2, animation:`voiceWave 0.7s ${i*0.1}s ease-in-out infinite` }}/>
                ))}
              </div>
            </div>
          )}

          {/* STT jarayoni */}
          {isTranscribing && (
            <div style={{ background:'rgba(167,139,250,0.07)', border:'1px solid rgba(167,139,250,0.25)', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:14, height:14, border:'2px solid #a78bfa', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 }}/>
              <span style={{ fontSize:11, color:'rgba(167,139,250,0.8)', fontFamily:'monospace' }}>Matn ajratilmoqda...</span>
            </div>
          )}

          {/* ── TASDIQLASH PANELI ── */}
          {isWaitingConfirm && (
            <div style={{
              background:'rgba(255,215,0,0.05)',
              border:'1px solid rgba(255,215,0,0.3)',
              borderRadius:10,
              padding:'12px',
              display:'flex', flexDirection:'column', gap:8,
            }}>
              <div style={{ fontSize:9, color:'rgba(255,215,0,0.6)', fontFamily:'monospace', letterSpacing:'1px' }}>
                MATN TEKSHIRING → TASDIQLANG
              </div>

              {/* Tahrirlash maydoni */}
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows={3}
                style={{
                  width:'100%',
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,215,0,0.2)',
                  borderRadius:6,
                  padding:'8px 10px',
                  color:'#fde68a',
                  fontSize:13,
                  fontFamily:"'Segoe UI', sans-serif",
                  lineHeight:1.5,
                  resize:'vertical',
                  outline:'none',
                  boxSizing:'border-box',
                }}
                placeholder="Matnni tahrirlashingiz mumkin..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleConfirm(); }
                  if (e.key === 'Escape') onDiscard();
                }}
              />

              {/* Tugmalar */}
              <div style={{ display:'flex', gap:6 }}>
                <button
                  onClick={handleConfirm}
                  disabled={!editText.trim()}
                  style={{
                    flex:1,
                    background: editText.trim() ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                    border:`1px solid ${editText.trim() ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius:6, padding:'7px 0',
                    color: editText.trim() ? '#4ade80' : 'rgba(255,255,255,0.2)',
                    fontSize:11, fontFamily:'monospace', cursor: editText.trim() ? 'pointer' : 'not-allowed',
                    transition:'all 0.15s',
                  }}
                >
                  ✓ Yuborish
                </button>
                <button
                  onClick={onDiscard}
                  style={{
                    flex:1,
                    background:'rgba(239,68,68,0.1)',
                    border:'1px solid rgba(239,68,68,0.3)',
                    borderRadius:6, padding:'7px 0',
                    color:'#f87171', fontSize:11, fontFamily:'monospace', cursor:'pointer',
                    transition:'all 0.15s',
                  }}
                >
                  ✕ Bekor
                </button>
              </div>

              <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace', textAlign:'center' }}>
                Enter → yuborish · Esc → bekor
              </div>
            </div>
          )}

          {/* History */}
          {history.map((msg, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', marginBottom:2, fontFamily:'monospace' }}>
                {msg.role==='user' ? 'SIZ' : 'AI'}
              </span>
              <div style={{
                maxWidth:'92%',
                background: msg.role==='user' ? 'rgba(0,212,255,0.09)' : 'rgba(255,255,255,0.05)',
                border:`1px solid ${msg.role==='user' ? 'rgba(0,212,255,0.22)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:8, padding:'6px 10px',
                fontSize:12, lineHeight:1.6,
                color: msg.role==='user' ? '#7dd3fc' : '#e2e8f0',
                fontFamily:"'Segoe UI', sans-serif",
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div style={{ display:'flex', gap:5, padding:'4px 2px', alignItems:'center' }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>AI</span>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#00d4ff', animation:`bounce 0.9s ${i*0.2}s ease-in-out infinite`, opacity:0.7 }}/>
              ))}
            </div>
          )}
        </div>

        {/* Bottom border */}
        <div style={{ height:8, background:'rgba(4,14,30,0.97)', borderLeft:'1px solid rgba(0,212,255,0.2)', borderRight:'1px solid rgba(0,212,255,0.2)', borderBottom:'1px solid rgba(0,212,255,0.1)' }}/>
      </div>

      {/* Controls bar */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background:'rgba(4,14,30,0.95)',
        border:`1px solid ${hasActivity ? 'rgba(0,212,255,0.4)' : 'rgba(0,212,255,0.18)'}`,
        borderRadius:12,
        padding:'10px 14px',
        transition:'border-color 0.2s',
      }}>

        {/* Mic button */}
        <button
          onClick={handleMicClick}
          onPointerDown={e=>e.stopPropagation()}
          style={{
            width:46, height:46, borderRadius:'50%', flexShrink:0,
            border: isListening ? '2px solid #ff4444' : '2px solid rgba(0,212,255,0.45)',
            background: isListening ? 'rgba(255,68,68,0.12)' : 'rgba(0,212,255,0.06)',
            color: isListening ? '#ff4444' : '#00d4ff',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.2s', zIndex:1001, pointerEvents:'auto',
            animation: isListening ? 'pulseRing 1.4s ease-out infinite' : 'none',
          }}
        >
          {(isTranscribing || isLoading)
            ? <div style={{ width:18, height:18, border:'2px solid #00d4ff', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            : isListening ? <StopIcon/> : <MicIcon/>
          }
        </button>

        {/* Status */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, color:statusColor, fontFamily:'monospace', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {statusText}
          </div>
          {isSpeaking && (
            <div style={{ display:'flex', alignItems:'center', gap:2, height:14 }}>
              {[3,5,8,5,3].map((h,i) => (
                <div key={i} style={{ width:3, height:h, borderRadius:2, background:'#00d4ff', animation:`wave ${0.4+i*0.1}s ease-in-out infinite alternate` }}/>
              ))}
            </div>
          )}
        </div>

        {/* Stop tugmasi — gapirayotganda YOKI yuklanayotganda */}
        {(isSpeaking || isLoading) && (
          <button
            onClick={onStopSpeaking}
            title="To'xtatish"
            style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${isSpeaking ? '#ff4444' : 'rgba(255,165,0,0.5)'}`,
              background: isSpeaking ? 'rgba(255,68,68,0.15)' : 'rgba(255,165,0,0.08)',
              color: isSpeaking ? '#ff6666' : '#ffa500',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 0.2s',
              boxShadow: isSpeaking ? '0 0 10px rgba(255,68,68,0.3)' : 'none',
            }}
          >
            ⏹
          </button>
        )}

        {/* Chat toggle */}
        <button
          onClick={() => setChatOpen(o => !o)}
          style={{
            width:30, height:30, borderRadius:'50%', flexShrink:0,
            border: chatOpen
              ? '1px solid rgba(0,212,255,0.5)'
              : unread ? '1px solid rgba(255,215,0,0.6)' : '1px solid rgba(255,255,255,0.1)',
            background: chatOpen ? 'rgba(0,212,255,0.1)' : 'transparent',
            color: chatOpen ? '#00d4ff' : unread ? '#ffd700' : 'rgba(255,255,255,0.3)',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, transition:'all 0.2s', position:'relative',
          }}
        >
          💬
          {unread && (
            <span style={{ position:'absolute', top:2, right:2, width:7, height:7, borderRadius:'50%', background:'#ffd700', border:'1px solid rgba(4,14,30,0.9)' }}/>
          )}
        </button>
      </div>

      <style>{`
        @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(255,68,68,0.5)} 70%{box-shadow:0 0 0 14px rgba(255,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(255,68,68,0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-4px);opacity:1} }
        @keyframes wave { from{transform:scaleY(0.4)} to{transform:scaleY(1.2)} }
        @keyframes voiceWave { 0%,100%{height:4px} 50%{height:16px} }
      `}</style>
    </div>
  );
}