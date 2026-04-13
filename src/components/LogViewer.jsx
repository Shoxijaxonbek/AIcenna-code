// import { useState, useEffect, useRef } from 'react';
// import { getAllLogs, downloadLogs } from '../utils/logger';

// const MOD_CLR = { SCENE:'#00d4ff', HAND:'#00ff88', VOICE:'#ffd700', APP:'#ff9966' };
// const LVL_CLR = { INFO:'rgba(220,220,220,0.85)', DEBUG:'rgba(100,100,100,0.7)', WARN:'#ffd700', ERROR:'#ff5555' };

// export default function LogViewer() {
//   const [open, setOpen] = useState(false);
//   const [logs, setLogs] = useState({});
//   const [tab,  setTab]  = useState('ALL');
//   const [filter, setFilter] = useState('ALL'); // ALL | INFO | WARN | ERROR
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     const refresh = () => setLogs({ ...getAllLogs() });
//     window.addEventListener('holomed-log', refresh);
//     const id = setInterval(refresh, 500);
//     refresh();
//     return () => { window.removeEventListener('holomed-log', refresh); clearInterval(id); };
//   }, []);

//   useEffect(() => {
//     if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [logs, tab, open, filter]);

//   const errCount = Object.values(logs).flat().filter(l => l.lvl === 'ERROR').length;
//   const modules  = ['ALL', ...Object.keys(logs)];

//   const visible = (tab === 'ALL'
//     ? Object.entries(logs).flatMap(([m, es]) => es.map(e => ({ ...e, module: m })))
//       .sort((a, b) => a.t.localeCompare(b.t))
//     : (logs[tab] || []).map(e => ({ ...e, module: tab }))
//   ).filter(l => filter === 'ALL' || l.lvl === filter);

//   return (
//     <>
//       {/* ── Toggle button — always visible ── */}
//       <div style={{
//         position: 'fixed', bottom: 72, left: '50%',
//         transform: 'translateX(-50%)', zIndex: 300,
//       }}>
//         <button onClick={() => setOpen(o => !o)} style={{
//           background: errCount > 0 ? 'rgba(255,68,68,0.18)' : 'rgba(4,14,30,0.9)',
//           border: `1px solid ${errCount > 0 ? '#ff5555' : 'rgba(0,212,255,0.3)'}`,
//           borderRadius: 20, padding: '5px 16px',
//           color: errCount > 0 ? '#ff7777' : 'rgba(0,212,255,0.65)',
//           fontSize: 11, fontFamily: 'monospace', cursor: 'pointer',
//           display: 'flex', alignItems: 'center', gap: 8,
//           boxShadow: errCount > 0 ? '0 0 10px rgba(255,68,68,0.25)' : 'none',
//         }}>
//           <span>📋</span>
//           <span>DEBUG LOGS</span>
//           {errCount > 0 && (
//             <span style={{
//               background: '#ff4444', color: '#fff',
//               borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 700,
//             }}>{errCount} XATO</span>
//           )}
//           <span style={{ opacity: 0.4 }}>{open ? '▼' : '▲'}</span>
//         </button>
//       </div>

//       {/* ── Log panel ── */}
//       {open && (
//         <div style={{
//           position: 'fixed', bottom: 110, left: '50%',
//           transform: 'translateX(-50%)',
//           width: 620, maxWidth: '96vw', height: 300,
//           zIndex: 299,
//           background: 'rgba(2,5,14,0.97)',
//           border: '1px solid rgba(0,212,255,0.18)',
//           borderRadius: 12, display: 'flex', flexDirection: 'column',
//           fontFamily: 'monospace',
//           boxShadow: '0 -4px 30px rgba(0,0,0,0.7)',
//         }}>

//           {/* Header: module tabs + level filter + download */}
//           <div style={{
//             padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)',
//             display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, flexWrap: 'wrap',
//           }}>
//             {/* Module tabs */}
//             {modules.map(m => (
//               <button key={m} onClick={() => setTab(m)} style={{
//                 padding: '2px 9px', borderRadius: 12, fontSize: 10, cursor: 'pointer',
//                 border: tab === m ? `1px solid ${MOD_CLR[m] || '#00d4ff'}` : '1px solid rgba(255,255,255,0.08)',
//                 background: tab === m ? 'rgba(0,212,255,0.08)' : 'transparent',
//                 color: tab === m ? (MOD_CLR[m] || '#00d4ff') : 'rgba(255,255,255,0.3)',
//               }}>
//                 {m}
//                 {m !== 'ALL' && logs[m] && ` (${logs[m].filter(l => l.lvl === 'ERROR').length > 0 ? '⚠' : ''}${logs[m].length})`}
//               </button>
//             ))}

//             <div style={{ flex: 1 }} />

//             {/* Level filter */}
//             {['ALL', 'INFO', 'WARN', 'ERROR'].map(lv => (
//               <button key={lv} onClick={() => setFilter(lv)} style={{
//                 padding: '2px 8px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
//                 border: filter === lv ? `1px solid ${LVL_CLR[lv] || '#aaa'}` : '1px solid transparent',
//                 background: 'transparent',
//                 color: filter === lv ? (LVL_CLR[lv] || '#fff') : 'rgba(255,255,255,0.25)',
//               }}>{lv}</button>
//             ))}

//             {/* Download */}
//             <button onClick={downloadLogs} title="Log faylni yuklab oling" style={{
//               padding: '2px 9px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
//               border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
//               color: 'rgba(255,255,255,0.4)',
//             }}>💾 Saqlash</button>
//           </div>

//           {/* Entries */}
//           <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px', scrollbarWidth: 'thin' }}>
//             {visible.length === 0
//               ? <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, padding: 10 }}>Log yo'q...</div>
//               : visible.map((l, i) => (
//                 <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.5, marginBottom: 1 }}>
//                   <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 86 }}>{l.t}</span>
//                   {tab === 'ALL' && (
//                     <span style={{ color: MOD_CLR[l.module] || '#aaa', flexShrink: 0, minWidth: 52 }}>
//                       [{l.module}]
//                     </span>
//                   )}
//                   <span style={{
//                     color: LVL_CLR[l.lvl] || '#ddd',
//                     fontWeight: l.lvl === 'ERROR' ? 700 : 400,
//                     wordBreak: 'break-all',
//                   }}>
//                     {l.lvl !== 'INFO' && <span style={{ marginRight: 4 }}>
//                       {l.lvl === 'ERROR' ? '❌' : l.lvl === 'WARN' ? '⚠️' : ''}
//                     </span>}
//                     {l.msg}
//                   </span>
//                 </div>
//               ))
//             }
//             <div ref={bottomRef} />
//           </div>

//           {/* Footer */}
//           <div style={{
//             padding: '3px 10px', borderTop: '1px solid rgba(255,255,255,0.04)',
//             fontSize: 10, color: 'rgba(255,255,255,0.18)', flexShrink: 0,
//             display: 'flex', gap: 12, alignItems: 'center',
//           }}>
//             <span>Console: <code style={{ color: 'rgba(0,212,255,0.35)' }}>window.__HOLOMED_LOGS__</code></span>
//             <span>{visible.length} ta yozuv</span>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import { useState, useEffect, useRef } from 'react';

// const MOD_CLR = { SCENE:'#00d4ff', HAND:'#00ff88', VOICE:'#ffd700', APP:'#ff9966' };
// const LVL_CLR = { INFO:'rgba(220,220,220,0.85)', DEBUG:'rgba(100,100,100,0.7)', WARN:'#ffd700', ERROR:'#ff5555' };

// export default function LogViewer() {
//   const [open, setOpen] = useState(false);
//   const [logs, setLogs] = useState({});
//   const [tab,  setTab]  = useState('ALL');
//   const [filter, setFilter] = useState('ALL'); // ALL | INFO | WARN | ERROR
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     const refresh = () => setLogs({ ...getAllLogs() });
//     window.addEventListener('holomed-log', refresh);
//     const id = setInterval(refresh, 500);
//     refresh();
//     return () => { window.removeEventListener('holomed-log', refresh); clearInterval(id); };
//   }, []);

//   useEffect(() => {
//     if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [logs, tab, open, filter]);

//   const errCount = Object.values(logs).flat().filter(l => l.lvl === 'ERROR').length;
//   const modules  = ['ALL', ...Object.keys(logs)];

//   const visible = (tab === 'ALL'
//     ? Object.entries(logs).flatMap(([m, es]) => es.map(e => ({ ...e, module: m })))
//       .sort((a, b) => a.t.localeCompare(b.t))
//     : (logs[tab] || []).map(e => ({ ...e, module: tab }))
//   ).filter(l => filter === 'ALL' || l.lvl === filter);

//   return (
//     <>
//       {/* ── Toggle button — always visible ── */}
//       <div style={{
//         position: 'fixed', bottom: 72, left: '50%',
//         transform: 'translateX(-50%)', zIndex: 300,
//       }}>
//         <button onClick={() => setOpen(o => !o)} style={{
//           background: errCount > 0 ? 'rgba(255,68,68,0.18)' : 'rgba(4,14,30,0.9)',
//           border: `1px solid ${errCount > 0 ? '#ff5555' : 'rgba(0,212,255,0.3)'}`,
//           borderRadius: 20, padding: '5px 16px',
//           color: errCount > 0 ? '#ff7777' : 'rgba(0,212,255,0.65)',
//           fontSize: 11, fontFamily: 'monospace', cursor: 'pointer',
//           display: 'flex', alignItems: 'center', gap: 8,
//           boxShadow: errCount > 0 ? '0 0 10px rgba(255,68,68,0.25)' : 'none',
//         }}>
//           <span>📋</span>
//           <span>DEBUG LOGS</span>
//           {errCount > 0 && (
//             <span style={{
//               background: '#ff4444', color: '#fff',
//               borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 700,
//             }}>{errCount} XATO</span>
//           )}
//           <span style={{ opacity: 0.4 }}>{open ? '▼' : '▲'}</span>
//         </button>
//       </div>

//       {/* ── Log panel ── */}
//       {open && (
//         <div style={{
//           position: 'fixed', bottom: 110, left: '50%',
//           transform: 'translateX(-50%)',
//           width: 620, maxWidth: '96vw', height: 300,
//           zIndex: 299,
//           background: 'rgba(2,5,14,0.97)',
//           border: '1px solid rgba(0,212,255,0.18)',
//           borderRadius: 12, display: 'flex', flexDirection: 'column',
//           fontFamily: 'monospace',
//           boxShadow: '0 -4px 30px rgba(0,0,0,0.7)',
//         }}>

//           {/* Header: module tabs + level filter + download */}
//           <div style={{
//             padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)',
//             display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, flexWrap: 'wrap',
//           }}>
//             {/* Module tabs */}
//             {modules.map(m => (
//               <button key={m} onClick={() => setTab(m)} style={{
//                 padding: '2px 9px', borderRadius: 12, fontSize: 10, cursor: 'pointer',
//                 border: tab === m ? `1px solid ${MOD_CLR[m] || '#00d4ff'}` : '1px solid rgba(255,255,255,0.08)',
//                 background: tab === m ? 'rgba(0,212,255,0.08)' : 'transparent',
//                 color: tab === m ? (MOD_CLR[m] || '#00d4ff') : 'rgba(255,255,255,0.3)',
//               }}>
//                 {m}
//                 {m !== 'ALL' && logs[m] && ` (${logs[m].filter(l => l.lvl === 'ERROR').length > 0 ? '⚠' : ''}${logs[m].length})`}
//               </button>
//             ))}

//             <div style={{ flex: 1 }} />

//             {/* Level filter */}
//             {['ALL', 'INFO', 'WARN', 'ERROR'].map(lv => (
//               <button key={lv} onClick={() => setFilter(lv)} style={{
//                 padding: '2px 8px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
//                 border: filter === lv ? `1px solid ${LVL_CLR[lv] || '#aaa'}` : '1px solid transparent',
//                 background: 'transparent',
//                 color: filter === lv ? (LVL_CLR[lv] || '#fff') : 'rgba(255,255,255,0.25)',
//               }}>{lv}</button>
//             ))}

//             {/* Download */}
//             <button onClick={downloadLogs} title="Log faylni yuklab oling" style={{
//               padding: '2px 9px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
//               border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
//               color: 'rgba(255,255,255,0.4)',
//             }}>💾 Saqlash</button>
//           </div>

//           {/* Entries */}
//           <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px', scrollbarWidth: 'thin' }}>
//             {visible.length === 0
//               ? <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, padding: 10 }}>Log yo'q...</div>
//               : visible.map((l, i) => (
//                 <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.5, marginBottom: 1 }}>
//                   <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 86 }}>{l.t}</span>
//                   {tab === 'ALL' && (
//                     <span style={{ color: MOD_CLR[l.module] || '#aaa', flexShrink: 0, minWidth: 52 }}>
//                       [{l.module}]
//                     </span>
//                   )}
//                   <span style={{
//                     color: LVL_CLR[l.lvl] || '#ddd',
//                     fontWeight: l.lvl === 'ERROR' ? 700 : 400,
//                     wordBreak: 'break-all',
//                   }}>
//                     {l.lvl !== 'INFO' && <span style={{ marginRight: 4 }}>
//                       {l.lvl === 'ERROR' ? '❌' : l.lvl === 'WARN' ? '⚠️' : ''}
//                     </span>}
//                     {l.msg}
//                   </span>
//                 </div>
//               ))
//             }
//             <div ref={bottomRef} />
//           </div>

//           {/* Footer */}
//           <div style={{
//             padding: '3px 10px', borderTop: '1px solid rgba(255,255,255,0.04)',
//             fontSize: 10, color: 'rgba(255,255,255,0.18)', flexShrink: 0,
//             display: 'flex', gap: 12, alignItems: 'center',
//           }}>
//             <span>Console: <code style={{ color: 'rgba(0,212,255,0.35)' }}>window.__HOLOMED_LOGS__</code></span>
//             <span>{visible.length} ta yozuv</span>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import { useState, useEffect, useRef } from 'react';
import { getAllLogs, downloadLogs } from '../utils/logger';

const MOD_CLR = { SCENE:'#00d4ff', HAND:'#00ff88', VOICE:'#ffd700', APP:'#ff9966' };
const LVL_CLR = { INFO:'rgba(220,220,220,0.85)', DEBUG:'rgba(100,100,100,0.7)', WARN:'#ffd700', ERROR:'#ff5555' };

export default function LogViewer() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState({});
  const [tab,  setTab]  = useState('ALL');
  const [filter, setFilter] = useState('ALL'); // ALL | INFO | WARN | ERROR
  const bottomRef = useRef(null);

  useEffect(() => {
    const refresh = () => setLogs({ ...getAllLogs() });
    window.addEventListener('holomed-log', refresh);
    const id = setInterval(refresh, 500);
    refresh();
    return () => { window.removeEventListener('holomed-log', refresh); clearInterval(id); };
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, tab, open, filter]);

  const errCount = Object.values(logs).flat().filter(l => l.lvl === 'ERROR').length;
  const modules  = ['ALL', ...Object.keys(logs)];

  const visible = (tab === 'ALL'
    ? Object.entries(logs).flatMap(([m, es]) => es.map(e => ({ ...e, module: m })))
      .sort((a, b) => a.t.localeCompare(b.t))
    : (logs[tab] || []).map(e => ({ ...e, module: tab }))
  ).filter(l => filter === 'ALL' || l.lvl === filter);

  return (
    <>
      {/* ── Toggle button — always visible ── */}
      <div style={{
        position: 'fixed', bottom: 72, left: '50%',
        transform: 'translateX(-50%)', zIndex: 300,
      }}>
        <button onClick={() => setOpen(o => !o)} style={{
          background: errCount > 0 ? 'rgba(255,68,68,0.18)' : 'rgba(4,14,30,0.9)',
          border: `1px solid ${errCount > 0 ? '#ff5555' : 'rgba(0,212,255,0.3)'}`,
          borderRadius: 20, padding: '5px 16px',
          color: errCount > 0 ? '#ff7777' : 'rgba(0,212,255,0.65)',
          fontSize: 11, fontFamily: 'monospace', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: errCount > 0 ? '0 0 10px rgba(255,68,68,0.25)' : 'none',
        }}>
          <span>📋</span>
          <span>DEBUG LOGS</span>
          {errCount > 0 && (
            <span style={{
              background: '#ff4444', color: '#fff',
              borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 700,
            }}>{errCount} XATO</span>
          )}
          <span style={{ opacity: 0.4 }}>{open ? '▼' : '▲'}</span>
        </button>
      </div>

      {/* ── Log panel ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%',
          transform: 'translateX(-50%)',
          width: 620, maxWidth: '96vw', height: 300,
          zIndex: 299,
          background: 'rgba(2,5,14,0.97)',
          border: '1px solid rgba(0,212,255,0.18)',
          borderRadius: 12, display: 'flex', flexDirection: 'column',
          fontFamily: 'monospace',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.7)',
        }}>

          {/* Header: module tabs + level filter + download */}
          <div style={{
            padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, flexWrap: 'wrap',
          }}>
            {/* Module tabs */}
            {modules.map(m => (
              <button key={m} onClick={() => setTab(m)} style={{
                padding: '2px 9px', borderRadius: 12, fontSize: 10, cursor: 'pointer',
                border: tab === m ? `1px solid ${MOD_CLR[m] || '#00d4ff'}` : '1px solid rgba(255,255,255,0.08)',
                background: tab === m ? 'rgba(0,212,255,0.08)' : 'transparent',
                color: tab === m ? (MOD_CLR[m] || '#00d4ff') : 'rgba(255,255,255,0.3)',
              }}>
                {m}
                {m !== 'ALL' && logs[m] && ` (${logs[m].filter(l => l.lvl === 'ERROR').length > 0 ? '⚠' : ''}${logs[m].length})`}
              </button>
            ))}

            <div style={{ flex: 1 }} />

            {/* Level filter */}
            {['ALL', 'INFO', 'WARN', 'ERROR'].map(lv => (
              <button key={lv} onClick={() => setFilter(lv)} style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
                border: filter === lv ? `1px solid ${LVL_CLR[lv] || '#aaa'}` : '1px solid transparent',
                background: 'transparent',
                color: filter === lv ? (LVL_CLR[lv] || '#fff') : 'rgba(255,255,255,0.25)',
              }}>{lv}</button>
            ))}

            {/* Download */}
            <button onClick={downloadLogs} title="Log faylni yuklab oling" style={{
              padding: '2px 9px', borderRadius: 10, fontSize: 10, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
            }}>💾 Saqlash</button>
          </div>

          {/* Entries */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px', scrollbarWidth: 'thin' }}>
            {visible.length === 0
              ? <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, padding: 10 }}>Log yo'q...</div>
              : visible.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.5, marginBottom: 1 }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 86 }}>{l.t}</span>
                  {tab === 'ALL' && (
                    <span style={{ color: MOD_CLR[l.module] || '#aaa', flexShrink: 0, minWidth: 52 }}>
                      [{l.module}]
                    </span>
                  )}
                  <span style={{
                    color: LVL_CLR[l.lvl] || '#ddd',
                    fontWeight: l.lvl === 'ERROR' ? 700 : 400,
                    wordBreak: 'break-all',
                  }}>
                    {l.lvl !== 'INFO' && <span style={{ marginRight: 4 }}>
                      {l.lvl === 'ERROR' ? '❌' : l.lvl === 'WARN' ? '⚠️' : ''}
                    </span>}
                    {l.msg}
                  </span>
                </div>
              ))
            }
            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div style={{
            padding: '3px 10px', borderTop: '1px solid rgba(255,255,255,0.04)',
            fontSize: 10, color: 'rgba(255,255,255,0.18)', flexShrink: 0,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <span>Console: <code style={{ color: 'rgba(0,212,255,0.35)' }}>window.__HOLOMED_LOGS__</code></span>
            <span>{visible.length} ta yozuv</span>
          </div>
        </div>
      )}
    </>
  );
}