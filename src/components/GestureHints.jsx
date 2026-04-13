const HINTS = [
  { gesture: 'FIST',          icon: '✊', desc: 'Musht + harakat → aylantirish' },
  { gesture: 'PINCH_SELECT',  icon: '🤏', desc: 'Bir qo\'l pinch → organ belgilash' },
  { gesture: 'ZOOM',          icon: '🤏↔', desc: 'Pinch(anchor) + ikkinchi qo\'l → zoom' },
  { gesture: 'SELECT',        icon: '☝️', desc: 'Ko\'rsatkich → ko\'rsatish' },
  { gesture: 'VOICE_GESTURE', icon: '✌️', desc: 'Ko\'rsatkich+o\'rta → ovoz yozish' },
  { gesture: 'RESET',         icon: '👐', desc: 'Ikki ochiq kaft → RESET' },
];

export default function GestureHints({ currentGesture }) {
  return (
    <div style={{ position:'fixed', bottom:80, left:16, zIndex:100, display:'flex', flexDirection:'column', gap:4 }}>
      {HINTS.map(({ gesture, icon, desc }) => {
        const active = currentGesture === gesture;
        return (
          <div key={gesture} style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'4px 10px 4px 6px', borderRadius:20,
            background: active?'rgba(0,212,255,0.18)':'rgba(0,0,0,0.3)',
            border: active?'1px solid rgba(0,212,255,0.5)':'1px solid transparent',
            transition:'all 0.15s',
          }}>
            <span style={{ fontSize:14 }}>{icon}</span>
            <span style={{ fontSize:11, fontFamily:'monospace', color:active?'#00d4ff':'rgba(255,255,255,0.3)', fontWeight:active?600:400 }}>
              {desc}
            </span>
          </div>
        );
      })}
    </div>
  );
}
