// ═══════════════════════════════════════════════════════════════════════
// AIcenna — Quiz Panel (savol + variantlar + taymer)
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from 'react';
import { toStars } from '../../hooks/useQuiz';

const TIMER_SECONDS = 30;
const STAR = '★';
const EMPTY_STAR = '☆';

function Stars({ count }) {
  return (
    <span style={{ color: '#ffd700', fontSize: 18, letterSpacing: 2 }}>
      {Array.from({ length: 5 }, (_, i) => i < count ? STAR : EMPTY_STAR)}
    </span>
  );
}

function ProgressBar({ value, color = '#00d4ff' }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
      <div style={{
        width: `${value}%`, height: '100%', borderRadius: 6,
        background: color, transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

// ─── Doira taymer (SVG) ─────────────────────────────────────────────────
function TimerCircle({ timeLeft }) {
  const r       = 22;
  const circ    = 2 * Math.PI * r;
  const pct     = timeLeft / TIMER_SECONDS;
  const color   = timeLeft > 15 ? '#10b981' : timeLeft > 8 ? '#f59e0b' : '#ef4444';
  const urgent  = timeLeft <= 8;

  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        {/* Track */}
        <circle cx={28} cy={28} r={r} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={3.5} />
        {/* Progress */}
        <circle cx={28} cy={28} r={r} fill="none"
          stroke={color} strokeWidth={3.5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
        />
      </svg>
      {/* Number overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 14, fontWeight: 800, fontFamily: 'monospace',
        animation: urgent ? 'timer-pulse 0.9s ease-in-out infinite' : 'none',
      }}>
        {timeLeft}
      </div>
      <style>{`
        @keyframes timer-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

// ─── Idle ekrani ─────────────────────────────────────────────────────────
function IdleView({ onStart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, padding: 32 }}>
      <div style={{ fontSize: 60 }}>🧠</div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 900, marginBottom: 10 }}>
          AIcenna Quiz
        </h2>
        <p style={{ color: 'rgba(200,220,255,0.7)', fontSize: 14, lineHeight: 1.75, marginBottom: 4 }}>
          Anatomiya bilimingizni sinab ko'ring!
        </p>
        <p style={{ color: 'rgba(200,220,255,0.45)', fontSize: 13, lineHeight: 1.75 }}>
          52 ta savoldan tasodifiy <strong style={{ color: '#00d4ff' }}>10 tasi</strong> beriladi<br />
          Har savolga <strong style={{ color: '#f59e0b' }}>{TIMER_SECONDS} soniya</strong> vaqt
        </p>
      </div>
      <button onClick={onStart} style={btnStyleFn('#00d4ff', '#0099bb')}>
        ▶ Boshlash
      </button>
    </div>
  );
}

// ─── Savol ekrani ─────────────────────────────────────────────────────────
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function PlayingView({ quiz }) {
  const { currentQ, current, total, selected, answered, isTimeout, correct, progressPct, next, selectOption } = quiz;

  // Taymer
  const [timeLeft, setTimeLeft]  = useState(TIMER_SECONDS);
  const intervalRef              = useRef(null);
  const questionKey              = `${current}-${currentQ?.id}`;

  // Yangi savol chiqqanda taymerni reset
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
  }, [questionKey]); // eslint-disable-line

  // Countdown
  useEffect(() => {
    if (answered) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          selectOption(-1); // Vaqt tugadi → noto'g'ri
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [answered, questionKey]); // eslint-disable-line

  if (!currentQ) return null;

  const modelLabel = { eye: "Ko'z", brain: 'Miya', heart: 'Yurak', upper_body: 'Yuqori Tana' }[currentQ.modelId];
  const modelEmoji = { eye: '👁', brain: '🧠', heart: '❤️', upper_body: '🫀' }[currentQ.modelId] || '🔬';
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 8 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 20px', gap: 14 }}>
      {/* ── Progress bar ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ color: 'rgba(200,220,255,0.6)', fontSize: 12, fontFamily: 'monospace' }}>
            Savol {current + 1} / {total}
          </span>
          <span style={{ color: '#10b981', fontSize: 12, fontFamily: 'monospace' }}>
            ✓ {correct} to'g'ri
          </span>
        </div>
        <ProgressBar value={progressPct} color={progressPct >= 80 ? '#10b981' : '#00d4ff'} />
      </div>

      {/* ── Header qator: model badge + taymer ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: 20, padding: '4px 12px', fontSize: 11,
          color: 'rgba(0,212,255,0.85)', fontFamily: 'monospace', letterSpacing: '0.08em',
        }}>
          {modelEmoji} {modelLabel}
          {currentQ.highlightMesh && (
            <span style={{ color: 'rgba(255,200,0,0.7)', fontSize: 10 }}>· qism yonmoqda</span>
          )}
        </div>
        <TimerCircle timeLeft={timeLeft} />
      </div>

      {/* ── Savol matni ── */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px',
      }}>
        <p style={{ color: '#e8f0ff', fontSize: 14.5, lineHeight: 1.72, fontWeight: 600, margin: 0 }}>
          {currentQ.q}
        </p>
      </div>

      {/* ── Variantlar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {currentQ.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect  = i === currentQ.answer;
          let bg     = 'rgba(255,255,255,0.04)';
          let border = '1px solid rgba(255,255,255,0.10)';
          let color  = 'rgba(230,240,255,0.82)';
          if (answered) {
            if (isCorrect) { bg = 'rgba(16,185,129,0.18)'; border = '1px solid #10b981'; color = '#6ee7b7'; }
            else if (isSelected) { bg = 'rgba(239,68,68,0.18)'; border = '1px solid #ef4444'; color = '#fca5a5'; }
          }
          return (
            <button key={i} onClick={() => selectOption(i)} disabled={answered}
              style={{
                width: '100%', textAlign: 'left', padding: '11px 14px',
                background: bg, border, borderRadius: 10, color, fontSize: 13.5,
                cursor: answered ? 'default' : 'pointer', transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit',
              }}
              onMouseOver={e => { if (!answered) e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; }}
              onMouseOut={e  => { if (!answered) e.currentTarget.style.background = bg; }}
            >
              <span style={{
                minWidth: 26, height: 26, borderRadius: 7,
                background: answered && isCorrect
                  ? '#10b981'
                  : answered && isSelected
                  ? '#ef4444'
                  : 'rgba(255,255,255,0.09)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: answered ? '#fff' : 'inherit',
                flexShrink: 0,
              }}>
                {OPTION_LETTERS[i]}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {answered && isCorrect && <span style={{ fontSize: 14 }}>✅</span>}
              {answered && isSelected && !isCorrect && <span style={{ fontSize: 14 }}>❌</span>}
            </button>
          );
        })}
      </div>

      {/* ── Javob berganida: izoh + davom ── */}
      {answered && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isTimeout && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: 9, padding: '9px 13px', fontSize: 13, color: '#fca5a5',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⏰ Vaqt tugadi! To'g'ri javob: <strong style={{ color: '#86efac' }}>
                {OPTION_LETTERS[currentQ.answer]}
              </strong>
            </div>
          )}
          <div style={{
            background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.28)',
            borderRadius: 9, padding: '10px 13px', fontSize: 12.5, color: 'rgba(200,210,255,0.82)',
            lineHeight: 1.65,
          }}>
            💡 {currentQ.explanation}
          </div>
          <button onClick={() => next()} style={btnStyleFn('#6366f1', '#4f46e5')}>
            {current + 1 >= total ? '📊 Natijani ko\'rish' : 'Keyingisi →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Natija ekrani ────────────────────────────────────────────────────────
function FinishedView({ quiz, onRestart }) {
  const { correct, total, pct, stars, results } = quiz;
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪';
  const msg   = pct >= 90 ? 'Mukammal natija! Ustoz darajasi!' : pct >= 70 ? 'Ajoyib! Davom eting!' : pct >= 50 ? 'Yaxshi! Yana mashq qiling.' : 'Vaqt taymer bilan qiyin — davom eting!';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', gap: 18, height: '100%', overflowY: 'auto' }}>
      <div style={{ fontSize: 52 }}>{emoji}</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 46, fontWeight: 900,
          color: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444',
          fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1,
        }}>
          {pct}%
        </div>
        <div style={{ color: 'rgba(200,220,255,0.7)', fontSize: 13, marginTop: 4 }}>
          {correct} / {total} to'g'ri javob
        </div>
        <div style={{ marginTop: 8 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < stars ? '#ffd700' : 'rgba(255,255,255,0.15)', fontSize: 22, marginRight: 2 }}>
              {i < stars ? STAR : EMPTY_STAR}
            </span>
          ))}
        </div>
        <div style={{ color: '#a0c4ff', fontSize: 13, marginTop: 8, fontWeight: 600 }}>{msg}</div>
        <div style={{ color: 'rgba(200,220,255,0.4)', fontSize: 11, marginTop: 4, fontFamily: 'monospace' }}>
          Natija reytingga saqlandi ✓
        </div>
      </div>

      {/* Per-question summary */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {results.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 11px',
            background: r.isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${r.isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius: 7, fontSize: 11,
          }}>
            <span style={{ fontSize: 13 }}>{r.isCorrect ? '✅' : r.isTimeout ? '⏰' : '❌'}</span>
            <span style={{ color: 'rgba(200,220,255,0.7)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.q.q.substring(0, 48)}{r.q.q.length > 48 ? '…' : ''}
            </span>
          </div>
        ))}
      </div>

      <button onClick={onRestart} style={{ ...btnStyleFn('#00d4ff', '#0099bb'), width: '100%' }}>
        🔄 Qayta urinish
      </button>
    </div>
  );
}

// ─── Main QuizPanel ───────────────────────────────────────────────────────
export default function QuizPanel({ quiz }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'rgba(4,14,36,0.94)',
      borderLeft: '1px solid rgba(0,212,255,0.12)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>
      {quiz.phase === 'idle'     && <IdleView   onStart={quiz.start} />}
      {quiz.phase === 'playing'  && <PlayingView quiz={quiz} />}
      {quiz.phase === 'finished' && <FinishedView quiz={quiz} onRestart={() => { quiz.reset(); quiz.start(); }} />}
    </div>
  );
}

function btnStyleFn(primary) {
  return {
    padding: '11px 24px', borderRadius: 11, border: 'none',
    background: primary, color: '#fff', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', width: '100%',
    fontFamily: "'Space Grotesk', sans-serif", transition: 'opacity 0.2s',
  };
}
