// ═══════════════════════════════════════════════════════════════════════
// AIcenna — Yopiq Test sahifasi
// 5 ta savol, javob o'z so'zi yoki ovoz bilan, AI foizda baholaydi
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ModelScene from '../components/ModelScene';
import { MODELS } from '../config/models';
import { getRandomQuestions } from '../config/questions';
import { saveClosedScore, getClosedLeaderboard } from '../hooks/useQuiz';

const OPENAI_KEY  = import.meta.env.VITE_OPENAI_KEY;
const GEMINI_KEY  = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const QUIZ_SIZE   = 5;

// ArrayBuffer → base64 (chunk-based)
function bufToBase64(buffer) {
  const bytes  = new Uint8Array(buffer);
  let binary   = '';
  const CHUNK  = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK)
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(binary);
}

// ─── OpenAI: Javobni baholash ────────────────────────────────────────────────
async function evaluateAnswer(question, correctAnswer, userAnswer) {
  if (!OPENAI_KEY || !userAnswer.trim()) return { score: 0, comment: 'Javob kiritilmadi' };
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 150,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: "Sen anatomiya bo'yicha baholovchi AI sisan. Foydalanuvchi javobini to'g'ri javob bilan solishtir, 0-100 foizda baho ber. Faqat JSON qaytardan.",
          },
          {
            role: 'user',
            content: `Savol: "${question}"\nTo'g'ri javob: "${correctAnswer}"\nFoydalanuvchi javobi: "${userAnswer}"\n\nJSON formatda: {"score": 75, "comment": "O'zbek tilida qisqa izoh"}`,
          },
        ],
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        score:   Math.min(100, Math.max(0, Number(parsed.score) || 0)),
        comment: parsed.comment || '',
      };
    }
  } catch (e) {
    console.error('Evaluation error:', e);
  }
  return { score: 0, comment: 'Baholashda xato yuz berdi' };
}

// ─── Browser qo'llab-quvvatlaydigan MIME turini aniqlash ────────────────────
function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

// Gemini STT hallucination filtri
const STT_HALLUCINATION_MARKERS = [
  "audio yozuvni", "gapirilgan bo'lsa", "faqat gapirilgan",
  "transcribe this", "spoken words", "no explanations",
  "only the spoken", "return only", "hech qanday izoh",
];
function isSttHallucination(text) {
  if (!text || text.trim().length < 2) return true;
  const lower = text.toLowerCase();
  return STT_HALLUCINATION_MARKERS.some(p => lower.includes(p));
}

// ─── STT: Gemini 2.5 Flash orqali audio → matn ──────────────────────────────
async function transcribeAudio(blob) {
  if (!GEMINI_KEY) { console.error('[ClosedQuiz] VITE_GEMINI_KEY topilmadi'); return ''; }
  if (blob.size < 100) { console.warn('[ClosedQuiz] Blob juda kichik:', blob.size); return ''; }

  console.log('[ClosedQuiz] Gemini STT start, size:', blob.size, 'type:', blob.type);

  try {
    const base64 = bufToBase64(await blob.arrayBuffer());
    const mime   = blob.type || 'audio/webm';

    const res = await fetch(
      `${GEMINI_BASE}/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are a speech-to-text service. " +
                    "Transcribe exactly what is spoken in the audio file the user sends. " +
                    "Output ONLY the transcribed words — no explanations, no formatting, no extra text.",
            }],
          },
          contents: [{
            role: 'user',
            parts: [{ inline_data: { mime_type: mime, data: base64 } }],
          }],
          generationConfig: { temperature: 0, maxOutputTokens: 500 },
        }),
      }
    );

    console.log('[ClosedQuiz] Gemini STT status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      console.log('[ClosedQuiz] Gemini STT result:', JSON.stringify(text));
      if (isSttHallucination(text)) {
        console.warn('[ClosedQuiz] Hallucination filtrlandi:', text);
        return '';
      }
      return text;
    } else {
      const err = await res.json().catch(() => ({}));
      console.error('[ClosedQuiz] Gemini STT error:', err?.error?.message || res.status);
    }
  } catch (e) {
    console.error('[ClosedQuiz] Gemini STT exception:', e.message);
  }

  return '';
}

// ─── Leaderboard modali ───────────────────────────────────────────────────────
function ClosedLeaderboardModal({ onClose }) {
  const board  = getClosedLeaderboard();
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={onClose}
    >
      <div
        style={{ width:440, maxHeight:'80vh', background:'linear-gradient(135deg,#081828,#050d1a)', border:'1px solid rgba(139,92,246,0.35)', borderRadius:20, padding:'28px 28px 24px', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:28 }}>🏅</span>
            <div>
              <div style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:20 }}>Yopiq Test Reytingi</div>
              <div style={{ color:'rgba(139,92,246,0.7)', fontSize:11, fontFamily:'monospace', letterSpacing:'0.08em' }}>AIcenna — AI Baholash</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, width:32, height:32, color:'#fff', cursor:'pointer', fontSize:16 }}>✕</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {board.slice(0, 15).map((entry, i) => {
            const isMe  = entry.flag === '🧑';
            const medal = medals[i] || null;
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
                background: isMe ? 'rgba(139,92,246,0.12)' : i < 3 ? 'rgba(255,215,0,0.07)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isMe ? 'rgba(139,92,246,0.4)' : i < 3 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 10,
              }}>
                <div style={{ width:28, textAlign:'center', fontSize:medal?18:13, color:'rgba(200,220,255,0.5)', fontWeight:700 }}>
                  {medal || (i + 1)}
                </div>
                <span style={{ fontSize:18 }}>{entry.flag || '🧑'}</span>
                <div style={{ flex:1, color: isMe ? '#a78bfa' : i < 3 ? '#ffd700' : '#e8f0ff', fontWeight: isMe || i < 3 ? 700 : 500, fontSize:14 }}>
                  {entry.name}
                  {isMe && <span style={{ fontSize:11, color:'rgba(139,92,246,0.7)', marginLeft:6 }}>(siz)</span>}
                </div>
                <div style={{ color: entry.pct >= 90 ? '#10b981' : entry.pct >= 70 ? '#f59e0b' : '#94a3b8', fontWeight:800, fontSize:16, fontFamily:"'Space Grotesk',sans-serif" }}>
                  {entry.pct}%
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign:'center', color:'rgba(200,220,255,0.3)', fontSize:11, marginTop:18, fontFamily:'monospace' }}>
          AI tomonidan baholangan natijalar
        </p>
      </div>
    </div>
  );
}

// ─── Idle panel ───────────────────────────────────────────────────────────────
function IdlePanel({ onStart }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:24, padding:32 }}>
      <div style={{ fontSize:60 }}>🎙️</div>
      <div style={{ textAlign:'center' }}>
        <h2 style={{ color:'#fff', fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:900, marginBottom:10 }}>Yopiq Test</h2>
        <p style={{ color:'rgba(200,220,255,0.7)', fontSize:14, lineHeight:1.75, marginBottom:4 }}>
          O'z so'zingiz bilan javob bering
        </p>
        <p style={{ color:'rgba(200,220,255,0.45)', fontSize:13, lineHeight:1.75 }}>
          <strong style={{ color:'#a78bfa' }}>5 ta savol</strong> beriladi<br/>
          Javoblaringiz AI tomonidan <strong style={{ color:'#f59e0b' }}>foizlarda</strong> baholanadi<br/>
          Yozma yoki <strong style={{ color:'#10b981' }}>ovozli</strong> javob berish mumkin
        </p>
      </div>
      <button
        onClick={onStart}
        style={{ padding:'12px 32px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Space Grotesk',sans-serif", boxShadow:'0 8px 24px rgba(139,92,246,0.4)' }}
      >
        ▶ Boshlash
      </button>
    </div>
  );
}

// ─── Playing panel ────────────────────────────────────────────────────────────
function PlayingPanel({ question, current, total, userAnswer, setUserAnswer, onSubmit, isEvaluating, isRecording, onToggleRecord, isTranscribing }) {
  const modelLabels = { eye:"Ko'z", brain:'Miya', heart:'Yurak', upper_body:'Yuqori Tana' };
  const modelEmojis = { eye:'👁', brain:'🧠', heart:'❤️', upper_body:'🫀' };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'16px 20px', gap:14 }}>
      {/* Progress */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
          <span style={{ color:'rgba(200,220,255,0.6)', fontSize:12, fontFamily:'monospace' }}>Savol {current + 1} / {total}</span>
          <span style={{ color:'rgba(139,92,246,0.7)', fontSize:12, fontFamily:'monospace' }}>AI baholash rejimi</span>
        </div>
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:6, height:6, overflow:'hidden' }}>
          <div style={{ width:`${(current / total) * 100}%`, height:'100%', borderRadius:6, background:'#8b5cf6', transition:'width 0.4s ease' }}/>
        </div>
      </div>

      {/* Model badge */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:20, padding:'4px 12px', fontSize:11, color:'rgba(139,92,246,0.85)', fontFamily:'monospace', letterSpacing:'0.08em', alignSelf:'flex-start' }}>
        {modelEmojis[question.modelId] || '🔬'} {modelLabels[question.modelId] || ''}
      </div>

      {/* Question */}
      <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', padding:'14px 16px' }}>
        <p style={{ color:'#e8f0ff', fontSize:14.5, lineHeight:1.72, fontWeight:600, margin:0 }}>{question.q}</p>
      </div>

      {/* Answer area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <textarea
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder={isTranscribing ? 'Ovoz matnga o\'girilmoqda...' : 'Javobingizni bu yerga yozing...'}
          disabled={isEvaluating || isTranscribing}
          style={{
            flex:1, minHeight:100, resize:'none',
            background:'rgba(255,255,255,0.05)',
            border:`1px solid ${isRecording ? 'rgba(239,68,68,0.5)' : 'rgba(139,92,246,0.3)'}`,
            borderRadius:12, padding:'12px 14px',
            color:'#e8f0ff', fontSize:13.5, lineHeight:1.65,
            fontFamily:'inherit', outline:'none',
            transition:'border-color 0.2s',
          }}
        />

        {/* Mic button */}
        <button
          onClick={onToggleRecord}
          disabled={isEvaluating || isTranscribing}
          style={{
            padding:'10px', borderRadius:10,
            background: isRecording ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.1)',
            border: `1px solid ${isRecording ? '#ef4444' : 'rgba(16,185,129,0.4)'}`,
            color: isRecording ? '#ef4444' : '#10b981',
            fontSize:13, fontWeight:700, cursor: isEvaluating ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            transition:'all 0.2s',
          }}
        >
          {isTranscribing ? '⏳ Matn o\'girilmoqda...' : isRecording ? '⏹ To\'xtatish' : '🎙️ Ovozli javob'}
        </button>

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={isEvaluating || isTranscribing || !userAnswer.trim()}
          style={{
            padding:'12px', borderRadius:12, border:'none',
            background: isEvaluating || !userAnswer.trim() ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
            color:'#fff', fontSize:14, fontWeight:700,
            cursor: isEvaluating || isTranscribing || !userAnswer.trim() ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            transition:'all 0.2s',
          }}
        >
          {isEvaluating ? '⏳ AI baholayapti...' : current + 1 >= total ? "📊 Natijani ko'rish" : 'Yuborish →'}
        </button>
      </div>
    </div>
  );
}

// ─── Finished panel ───────────────────────────────────────────────────────────
function FinishedPanel({ scores, onRestart, onShowLB }) {
  const avgPct = scores.length > 0 ? Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length) : 0;
  const emoji  = avgPct >= 90 ? '🏆' : avgPct >= 70 ? '🎉' : avgPct >= 50 ? '👍' : '💪';
  const color  = avgPct >= 70 ? '#10b981' : avgPct >= 50 ? '#f59e0b' : '#ef4444';
  const msg    = avgPct >= 90 ? 'Mukammal! Siz anatomiya ustasisiz!' : avgPct >= 70 ? 'Ajoyib natija! Davom eting!' : avgPct >= 50 ? "Yaxshi! Ko'proq mashq qiling." : 'Yana urinib ko\'ring!';

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'20px', gap:16, height:'100%', overflowY:'auto' }}>
      <div style={{ fontSize:48 }}>{emoji}</div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:52, fontWeight:900, color, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>{avgPct}%</div>
        <div style={{ color:'rgba(200,220,255,0.6)', fontSize:13, marginTop:6 }}>Umumiy natija · AI baholash</div>
        <div style={{ color:'#a0c4ff', fontSize:13, marginTop:6, fontWeight:600 }}>{msg}</div>
        <div style={{ color:'rgba(200,220,255,0.35)', fontSize:11, marginTop:4, fontFamily:'monospace' }}>Natija reytingga saqlandi ✓</div>
      </div>

      {/* Per-question breakdown */}
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
        {scores.map((r, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'10px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'rgba(200,220,255,0.5)', fontSize:11, fontFamily:'monospace' }}>Savol {i + 1}</span>
              <span style={{ color: r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444', fontWeight:800, fontSize:15 }}>
                {r.score}%
              </span>
            </div>
            <div style={{ color:'rgba(200,220,255,0.65)', fontSize:11, marginBottom: r.comment ? 4 : 0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {r.q.q.substring(0, 62)}{r.q.q.length > 62 ? '…' : ''}
            </div>
            {r.comment && (
              <div style={{ color:'rgba(139,92,246,0.8)', fontSize:11, fontStyle:'italic', lineHeight:1.4 }}>💡 {r.comment}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%' }}>
        <button onClick={onShowLB} style={{ padding:'10px', borderRadius:10, border:'1px solid rgba(139,92,246,0.4)', background:'rgba(139,92,246,0.1)', color:'#a78bfa', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          🏅 Reyting ko'rish
        </button>
        <button onClick={onRestart} style={{ padding:'10px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          🔄 Qayta urinish
        </button>
      </div>
    </div>
  );
}

// ─── Main ClosedQuizPage ──────────────────────────────────────────────────────
export default function ClosedQuizPage({ onBack }) {
  const [phase,            setPhase]           = useState('idle');
  const [questions,        setQuestions]       = useState([]);
  const [current,          setCurrent]         = useState(0);
  const [userAnswer,       setUserAnswer]      = useState('');
  const [pendingTranscript,setPendingTranscript]= useState(''); // STT dan kelgan matn
  const [scores,           setScores]          = useState([]);
  const [isEvaluating,     setIsEvaluating]    = useState(false);
  const [isRecording,      setIsRecording]     = useState(false);
  const [isTranscribing,   setIsTranscribing]  = useState(false);
  const [showLB,           setShowLB]          = useState(false);
  const [rotation,         setRotation]        = useState({ x:0, y:0 });

  const isDragging = useRef(false);
  const lastPos    = useRef({ x:0, y:0 });
  const mediaRef   = useRef(null);
  const chunksRef  = useRef([]);

  // pendingTranscript kelganda userAnswer ga qo'shish — React lifecycle da ishlaydi
  useEffect(() => {
    if (!pendingTranscript) return;
    setUserAnswer(prev => prev ? prev.trimEnd() + ' ' + pendingTranscript : pendingTranscript);
    setPendingTranscript('');
  }, [pendingTranscript]);

  const currentModel = React.useMemo(() => {
    if (!questions[current]) return MODELS[0];
    return MODELS.find(m => m.id === questions[current].modelId) || MODELS[0];
  }, [questions, current]);

  useEffect(() => { setRotation({ x:0, y:0 }); }, [currentModel?.id]);

  const start = () => {
    const qs = getRandomQuestions(QUIZ_SIZE);
    setQuestions(qs);
    setCurrent(0);
    setUserAnswer('');
    setScores([]);
    setPhase('playing');
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || isEvaluating) return;
    setIsEvaluating(true);
    const q             = questions[current];
    const correctAnswer = q.options[q.answer];
    const result        = await evaluateAnswer(q.q, correctAnswer, userAnswer);
    const newScores     = [...scores, { q, userAnswer, score: result.score, comment: result.comment }];
    setScores(newScores);
    if (current + 1 >= QUIZ_SIZE) {
      const avg = Math.round(newScores.reduce((s, r) => s + r.score, 0) / newScores.length);
      saveClosedScore('Siz', avg);
      setPhase('finished');
    } else {
      setCurrent(c => c + 1);
      setUserAnswer('');
    }
    setIsEvaluating(false);
  };

  const toggleRecord = async () => {
    if (isRecording) {
      // To'xtatish: avval requestData() — barcha data yig'ilsin, keyin stop
      try { mediaRef.current?.requestData(); } catch (_) {}
      mediaRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream   = await navigator.mediaDevices.getUserMedia({
          audio: { noiseSuppression: false, channelCount: 1 },
        }).catch(() => navigator.mediaDevices.getUserMedia({ audio: true }));
        const mimeType = getSupportedMimeType();
        const mr       = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        chunksRef.current = [];

        // 250ms timeslice: har 250ms da data keladi → stop bosib bo'lganda ham to'liq yig'ilgan bo'ladi
        mr.ondataavailable = e => {
          if (e.data && e.data.size > 0) {
            chunksRef.current.push(e.data);
            console.log('[ClosedQuiz] chunk:', e.data.size, 'bytes, total chunks:', chunksRef.current.length);
          }
        };

        mr.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          console.log('[ClosedQuiz] onstop: chunks=', chunksRef.current.length,
            'totalBytes=', chunksRef.current.reduce((s, c) => s + c.size, 0));

          if (chunksRef.current.length === 0) {
            console.warn('[ClosedQuiz] Hech qanday audio ma\'lumot yig\'ilmadi');
            setIsTranscribing(false);
            return;
          }

          const actualMime = mr.mimeType || mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: actualMime });
          console.log('[ClosedQuiz] blob:', blob.size, 'bytes, type:', blob.type);

          setIsTranscribing(true);

          const text = await transcribeAudio(blob);
          console.log('[ClosedQuiz] transcription result:', JSON.stringify(text));

          if (text && text.trim()) {
            console.log('[ClosedQuiz] setPendingTranscript:', JSON.stringify(text.trim()));
            setPendingTranscript(text.trim());
          } else {
            console.warn('[ClosedQuiz] Transkripsiya bo\'sh qaytdi');
          }

          setIsTranscribing(false);
        };

        mr.start(250); // timeslice bilan — har 250ms da ondataavailable yonadi
        mediaRef.current = mr;
        setIsRecording(true);
        console.log('[ClosedQuiz] Recording started, mimeType:', mr.mimeType);
      } catch (e) {
        console.error('[ClosedQuiz] Mic error:', e);
        setIsRecording(false);
        setIsTranscribing(false);
      }
    }
  };

  const onPointerDown = useCallback(e => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = 'grabbing';
  }, []);
  const onPointerMove = useCallback(e => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(r => ({ x: r.x + dy * 0.007, y: r.y - dx * 0.007 }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onPointerUp = useCallback(e => {
    isDragging.current = false;
    if (e.currentTarget) e.currentTarget.style.cursor = 'grab';
  }, []);

  return (
    <div style={{ width:'100vw', height:'100vh', background:'radial-gradient(ellipse at 30% 40%, #081828 0%, #050d1a 100%)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ height:54, display:'flex', alignItems:'center', padding:'0 20px', gap:16, flexShrink:0, borderBottom:'1px solid rgba(139,92,246,0.15)', background:'rgba(4,14,36,0.6)', backdropFilter:'blur(10px)' }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'6px 14px', color:'rgba(200,220,255,0.8)', fontSize:13, cursor:'pointer', fontFamily:'monospace' }}>
          ← Explore
        </button>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:18, fontWeight:800, letterSpacing:'0.15em', color:'#a78bfa', fontFamily:'monospace', textShadow:'0 0 14px rgba(139,92,246,0.5)' }}>AIcenna</span>
          <span style={{ color:'rgba(139,92,246,0.35)', fontFamily:'monospace', fontSize:11 }}>/ YOPIQ TEST</span>
        </div>
        <span style={{ color:'rgba(200,220,255,0.35)', fontSize:12, fontFamily:'monospace' }}>🎙️ AI baholash</span>
        <button onClick={() => setShowLB(true)} style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:8, padding:'6px 14px', color:'#a78bfa', fontSize:13, cursor:'pointer', fontFamily:'monospace', display:'flex', alignItems:'center', gap:6 }}>
          🏅 Reyting
        </button>
      </div>

      {/* Main layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* Left: 3D model */}
        <div
          style={{ flex:'0 0 60%', position:'relative', cursor:'grab', overflow:'hidden' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <ModelScene
            modelCfg={currentModel}
            rotation={rotation}
            scale={1.0}
            highlightPart={phase === 'playing' ? (questions[current]?.highlightMesh || null) : null}
            onPartHover={() => {}}
            onPartClick={() => {}}
            hoverLabel={null}
            explodeOpen={false}
            selectedMeshKey={null}
            meshRotation={{ x:0, y:0 }}
            pinchPoint={null}
          />
          <div style={{ position:'absolute', bottom:20, left:20, background:'rgba(0,0,0,0.55)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:10, padding:'6px 14px', color:'rgba(139,92,246,0.8)', fontFamily:'monospace', fontSize:12, pointerEvents:'none' }}>
            {currentModel.icon} {currentModel.label}
          </div>
          {phase === 'idle' && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(5,13,26,0.35)', pointerEvents:'none' }}>
              <div style={{ background:'rgba(4,14,36,0.85)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:16, padding:'18px 24px', textAlign:'center' }}>
                <div style={{ color:'rgba(139,92,246,0.7)', fontSize:13, fontFamily:'monospace' }}>3D modelni mouse bilan aylantiring</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Panel */}
        <div style={{ flex:'0 0 40%', overflow:'hidden', display:'flex', flexDirection:'column', background:'rgba(4,14,36,0.94)', borderLeft:'1px solid rgba(139,92,246,0.12)' }}>
          {phase === 'idle' && <IdlePanel onStart={start} />}
          {phase === 'playing' && questions[current] && (
            <PlayingPanel
              question={questions[current]}
              current={current}
              total={QUIZ_SIZE}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onSubmit={submitAnswer}
              isEvaluating={isEvaluating}
              isRecording={isRecording}
              onToggleRecord={toggleRecord}
              isTranscribing={isTranscribing}
            />
          )}
          {phase === 'finished' && (
            <FinishedPanel
              scores={scores}
              onRestart={start}
              onShowLB={() => setShowLB(true)}
            />
          )}
        </div>
      </div>

      {showLB && <ClosedLeaderboardModal onClose={() => setShowLB(false)} />}
    </div>
  );
}
