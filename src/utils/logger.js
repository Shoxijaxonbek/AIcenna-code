/**
 * HoloMed Logger
 * - window.__HOLOMED_LOGS__  — in-memory, modul bo'yicha
 * - LogViewer panel orqali ko'rish
 * - Download: LogViewer pastidagi "💾 Saqlash" tugmasi
 */

const MAX = 500;

function ts() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`;
}

function serialize(a) {
  if (typeof a === 'string') return a;
  if (a instanceof Error) return `${a.name}: ${a.message}`;
  try { return JSON.stringify(a); } catch { return String(a); }
}

function write(module, level, args) {
  if (!window.__HOLOMED_LOGS__) window.__HOLOMED_LOGS__ = {};
  if (!window.__HOLOMED_LOGS__[module]) window.__HOLOMED_LOGS__[module] = [];

  const msg = args.map(serialize).join(' ');
  const entry = { t: ts(), lvl: level, msg };

  const list = window.__HOLOMED_LOGS__[module];
  list.push(entry);
  if (list.length > MAX) list.shift();

  // Browser console
  const pre = `[${module}]`;
  if (level === 'ERROR')      console.error(pre, ...args);
  else if (level === 'WARN')  console.warn(pre, ...args);
  else if (level === 'DEBUG') console.debug(pre, ...args);
  else                        console.log(pre, ...args);

  // Notify LogViewer
  try {
    window.dispatchEvent(new CustomEvent('holomed-log', { detail: { module, entry } }));
  } catch (_) {}
}

export function createLogger(module) {
  return {
    info:  (...a) => write(module, 'INFO',  a),
    warn:  (...a) => write(module, 'WARN',  a),
    error: (...a) => write(module, 'ERROR', a),
    debug: (...a) => write(module, 'DEBUG', a),
  };
}

export function getLogs(module) { return window.__HOLOMED_LOGS__?.[module] || []; }
export function getAllLogs()     { return window.__HOLOMED_LOGS__ || {}; }

// Download all logs as text file
export function downloadLogs() {
  const all = getAllLogs();
  const lines = [];
  Object.entries(all).forEach(([mod, entries]) => {
    entries.forEach(e => lines.push(`${e.t} [${mod}] [${e.lvl}] ${e.msg}`));
  });
  lines.sort(); // sort by timestamp

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `holomed_log_${new Date().toISOString().slice(0,19).replace(/[:.]/g,'-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
