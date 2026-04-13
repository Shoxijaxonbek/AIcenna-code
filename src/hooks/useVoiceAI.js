import { useState, useRef, useCallback } from 'react';
import { createLogger } from '../utils/logger';

const log = createLogger('VOICE');

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_TTS_URL  = 'https://api.openai.com/v1/audio/speech';
const OPENAI_STT_URL  = 'https://api.openai.com/v1/audio/transcriptions';

// ── Gemini ────────────────────────────────────────────────────────────────────
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// ArrayBuffer → base64 (yirik fayllar uchun stack overflow bo'lmasligi uchun chunk-based)
function bufToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary  = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK)
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(binary);
}

// Gemini STT hallucination filtri — model instructions textini qaytarsa bekor qilish
const STT_HALLUCINATION = [
  "audio yozuvni", "gapirilgan bo'lsa", "faqat gapirilgan",
  "transcribe this", "spoken words", "no explanations",
  "only the spoken", "return only",
];
function isSttHallucination(text) {
  if (!text || text.trim().length < 2) return true;
  const lower = text.toLowerCase();
  return STT_HALLUCINATION.some(p => lower.includes(p));
}

// STT — Gemini 2.5 Flash multimodal orqali audio → matn
// system_instruction orqali prompt hallucination yo'q qilinadi
async function geminiSTT(audioBlob, geminiKey) {
  const base64 = bufToBase64(await audioBlob.arrayBuffer());
  const mime   = audioBlob.type || 'audio/webm';
  const res = await fetch(
    `${GEMINI_BASE}/gemini-2.5-flash:generateContent?key=${geminiKey}`,
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gemini STT HTTP ' + res.status);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  if (isSttHallucination(text)) {
    log.warn('Gemini STT: hallucination filtrlandi:', JSON.stringify(text));
    return '';
  }
  return text;
}

// TTS — Gemini 2.5 Flash Preview TTS orqali matn → audio
// currentAudio ref orqali to'xtatish imkoni bo'ladi
let _currentGeminiAudio = null;

async function geminiTTS(text, geminiKey) {
  const res = await fetch(
    `${GEMINI_BASE}/gemini-2.5-flash-preview-tts:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gemini TTS HTTP ' + res.status);
  }
  const data  = await res.json();
  const part  = data.candidates?.[0]?.content?.parts?.[0];
  const b64   = part?.inlineData?.data;
  if (!b64) throw new Error('Gemini TTS: audio data topilmadi');

  const audioMime = part.inlineData.mimeType || 'audio/wav';
  const bytes     = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const blob      = new Blob([bytes], { type: audioMime });
  const url       = URL.createObjectURL(blob);
  const audio     = new Audio(url);
  _currentGeminiAudio = audio;

  return new Promise((resolve, reject) => {
    audio.onended  = () => { URL.revokeObjectURL(url); _currentGeminiAudio = null; resolve(); };
    audio.onerror  = e  => { URL.revokeObjectURL(url); _currentGeminiAudio = null; reject(e); };
    audio.play().catch(reject);
  });
}

// Minimum yozish vaqti va hajmi
const MIN_RECORD_MS  = 1500;  // kamida 1.5 sekund gapirish kerak
const MIN_BLOB_BYTES = 500;   // Gemini multimodal uchun kichik threshold yetarli

const SYSTEM_PROMPT = `Sen anatomiya bo'yicha qisqa javob beradigan AI yordamchisisisan.
Qoidalar:
1. FAQAT O'ZBEK TILIDA javob ber
2. Javob 1-2 ta aniq gap bo'lsin — qismning nomi/vazifasi/ahamiyati
3. Agar tanlangan qism ko'rsatilgan bo'lsa — aynan shu qism haqida javob ber
4. Savol bo'lmasa ham, tanlangan qism haqida qisqa ma'lumot ber

Agar biror qism tilga olinsa, oxirida yoz:
HIGHLIGHT: qism_nomi
(faqat: eye, skull, brain, frontal, parietal, temporal, occipital, cerebellum, brainstem, corpus, heart, lungs, spine, ribs, muscle, vessel, nerve, skin)`;

function extractHL(t) {
  const m = t.match(/HIGHLIGHT:\s*([a-zA-Z_]+)/i);
  return m ? m[1].toLowerCase().trim() : null;
}
function cleanAns(t) {
  return t.replace(/HIGHLIGHT:\s*[a-zA-Z_]+/gi, '').trim();
}

// ── Whisper hallucination filtri ─────────────────────────────────────────────
// Whisper jimlik yoki shovqin uchun bu kabi soxta matnlar chiqaradi
const HALLUCINATION_PATTERNS = [
  /^(thank you|thanks|you|okay|ok|bye|goodbye|see you|um+|uh+|hmm+|ah+|oh+)[\.\!\?]?$/i,
  /^(subtitles by|transcribed by|captions by)/i,
  /^\[.*\]$/,             // [Music], [Applause] kabi
  /^[\s\.\,\!\?]+$/,      // faqat tinish belgilari
  /subs by/i,
  /www\./i,
  /translation/i,
];

function isHallucination(text) {
  if (!text || text.trim().length < 3) return true;
  const t = text.trim();
  // Juda qisqa (2 ta so'zdan kam, 8 harfdan kam)
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 2 && t.length < 8) return true;
  // Pattern tekshirish
  return HALLUCINATION_PATTERNS.some(p => p.test(t));
}

// ── TTS ───────────────────────────────────────────────────────────────────────
function browserSpeak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.pitch = 1;
  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith('uz'))
           || voices.find(v => v.lang.startsWith('ru'))
           || voices.find(v => v.lang.startsWith('en'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };
  if (window.speechSynthesis.getVoices().length > 0) doSpeak();
  else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
    setTimeout(doSpeak, 1000);
  }
}

async function openaiSpeak(text, apiKey) {
  try {
    const res = await fetch(OPENAI_TTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'tts-1', input: text, voice: 'nova', speed: 0.95 }),
    });
    if (!res.ok) throw new Error('TTS HTTP ' + res.status);
    const blob  = await res.blob();
    const url   = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
  } catch (e) {
    log.error('TTS failed:', e.message, '→ browser');
    browserSpeak(text);
  }
}

// ── STT ───────────────────────────────────────────────────────────────────────
async function transcribeAudio(audioBlob, apiKey) {
  log.info('STT: size=' + audioBlob.size + ' type=' + audioBlob.type);
  const ext = audioBlob.type.includes('ogg') ? 'ogg'
            : audioBlob.type.includes('mp4') ? 'mp4'
            : audioBlob.type.includes('wav') ? 'wav' : 'webm';

  // 1. gpt-4o-transcribe
  try {
    const fd = new FormData();
    fd.append('file', audioBlob, 'audio.' + ext);
    fd.append('model', 'gpt-4o-transcribe');

    fd.append('response_format', 'json');
    const res = await fetch(OPENAI_STT_URL, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey },
      body: fd,
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data.text || '').trim();
      if (text) { log.info('gpt-4o-transcribe OK:', text); return text; }
    }
    log.warn('gpt-4o-transcribe failed → whisper-1');
  } catch (e) {
    log.warn('gpt-4o-transcribe error:', e.message, '→ whisper-1');
  }

  // 2. whisper-1
  const fd2 = new FormData();
  fd2.append('file', audioBlob, 'audio.' + ext);
  fd2.append('model', 'whisper-1');
  fd2.append('response_format', 'text');
  const res2 = await fetch(OPENAI_STT_URL, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey },
    body: fd2,
  });
  if (!res2.ok) {
    const e = await res2.json().catch(() => ({}));
    throw new Error(e?.error?.message || 'whisper-1 HTTP ' + res2.status);
  }
  const text = (await res2.text()).trim();
  log.info('whisper-1 OK:', text);
  return text;
}

function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/ogg','audio/mp4'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export default function useVoiceAI() {
  const ctxRef         = useRef('');
  const abortCtrlRef   = useRef(null);
  const mediaRecRef    = useRef(null);
  const streamRef      = useRef(null);
  const chunksRef      = useRef([]);
  const fullStopRef    = useRef(false);
  const listeningRef   = useRef(false);
  const recordStartRef = useRef(null); // yozish boshlangan vaqt

  const [state, setState] = useState({
    isListening:      false,
    isTranscribing:   false,
    isWaitingConfirm: false,
    isLoading:        false,
    isSpeaking:       false,
    pendingTranscript:'',
    transcript:       '',
    answer:           '',
    highlightPart:    null,
    history:          [],
    error:            null,
  });

  // ── speak ─────────────────────────────────────────────────────────────────
  const speak = useCallback(async (text) => {
    if (!text?.trim() || fullStopRef.current) return;
    setState(s => ({ ...s, isSpeaking: true }));
    const geminiKey = import.meta.env.VITE_GEMINI_KEY;
    try {
      if (geminiKey) {
        await geminiTTS(text, geminiKey);
      } else {
        // Gemini key yo'q → OpenAI TTS → browser fallback
        const openaiKey = import.meta.env.VITE_OPENAI_KEY;
        if (openaiKey) await openaiSpeak(text, openaiKey);
        else browserSpeak(text);
      }
    } catch (e) {
      log.error('Gemini TTS xato:', e.message, '→ browser fallback');
      browserSpeak(text);
    }
    if (!fullStopRef.current) setState(s => ({ ...s, isSpeaking: false }));
  }, []);

  // ── history ref (closure uchun) ─────────────────────────────────────────
  const historyRef = useRef([]);

  // ── askAI ─────────────────────────────────────────────────────────────────
  const askAI = useCallback(async (question, ctx) => {
    if (fullStopRef.current) return;
    const modelCtx = ctx !== undefined ? ctx : ctxRef.current;
    log.info('askAI:', question);
    if (!question?.trim()) return;

    setState(s => ({ ...s, isLoading: true, isWaitingConfirm: false, error: null }));

    const apiKey = import.meta.env.VITE_OPENAI_KEY;
    if (!apiKey) {
      const msg = '.env.local da VITE_OPENAI_KEY topilmadi!';
      setState(s => ({ ...s, isLoading:false, answer:msg, error:msg, history:[...s.history,{role:'ai',text:msg}] }));
      return;
    }

    abortCtrlRef.current = new AbortController();
    // modelCtx: tanlangan qism + model konteksti
    // Formatni aniq qilamiz
    const sysContent = modelCtx
      ? SYSTEM_PROMPT + '\n\nHozirgi holat: ' + modelCtx
      : SYSTEM_PROMPT;

    try {
      const res = await fetch(OPENAI_CHAT_URL, {
        method: 'POST',
        signal: abortCtrlRef.current.signal,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-4o', max_tokens: 120, temperature: 0.4,
          messages: [
            { role: 'system', content: sysContent },
            // So'nggi 4 ta chat tarixi (context uchun)
            ...historyRef.current.slice(-4).map(h => ({
              role: h.role === 'ai' ? 'assistant' : 'user',
              content: h.text,
            })),
            { role: 'user', content: question },
          ],
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(()=>({}));
        throw new Error(e?.error?.message || 'HTTP ' + res.status);
      }
      const data = await res.json();
      const raw  = data?.choices?.[0]?.message?.content;
      if (!raw) throw new Error("Bo'sh javob keldi");
      if (fullStopRef.current) return;

      const hl  = extractHL(raw);
      const ans = cleanAns(raw);
      log.info('Answer:', ans, '| hl:', hl);

      historyRef.current = [...historyRef.current.slice(-8), { role:'ai', text:ans }];
      setState(s => ({
        ...s, isLoading:false, answer:ans, highlightPart:hl,
        history:[...s.history, { role:'ai', text:ans }],
      }));

      await speak(ans);
      if (hl) setTimeout(() => setState(s => ({ ...s, highlightPart:null })), 8000);

    } catch (err) {
      if (err.name === 'AbortError') { setState(s => ({ ...s, isLoading:false })); return; }
      log.error('askAI error:', err.message);
      const msg = 'Xato: ' + err.message;
      setState(s => ({ ...s, isLoading:false, answer:msg, error:err.message, history:[...s.history,{role:'ai',text:msg}] }));
    }
  }, [speak]);

  // ── confirmAndSend ────────────────────────────────────────────────────────
  const confirmAndSend = useCallback((text) => {
    const q = (text || '').trim();
    if (!q) return;
    log.info('confirmAndSend:', q);
    historyRef.current = [...historyRef.current, { role:'user', text:q }];
    setState(s => ({
      ...s,
      transcript: q,
      pendingTranscript: '',
      isWaitingConfirm: false,
      history: [...s.history, { role:'user', text:q }],
    }));
    askAI(q, ctxRef.current);
  }, [askAI]);

  // ── discardTranscript ─────────────────────────────────────────────────────
  const discardTranscript = useCallback(() => {
    log.info('discard');
    setState(s => ({ ...s, pendingTranscript:'', isWaitingConfirm:false, error:null }));
  }, []);

  // ── stopAll ───────────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    log.info('=== STOP ALL ===');
    fullStopRef.current  = true;
    listeningRef.current = false;
    recordStartRef.current = null;
    try { if (mediaRecRef.current?.state !== 'inactive') mediaRecRef.current?.stop(); } catch(_) {}
    mediaRecRef.current = null;
    try { streamRef.current?.getTracks().forEach(t=>t.stop()); } catch(_) {}
    streamRef.current = null;
    chunksRef.current = [];
    historyRef.current = [];
    try { abortCtrlRef.current?.abort(); } catch(_) {}
    window.speechSynthesis?.cancel();
    setState({
      isListening:false, isTranscribing:false, isWaitingConfirm:false,
      isLoading:false, isSpeaking:false,
      pendingTranscript:'', transcript:'', answer:'',
      highlightPart:null, history:[], error:null,
    });
    setTimeout(() => { fullStopRef.current = false; }, 400);
  }, []);

  // ── startListening ────────────────────────────────────────────────────────
  const startListening = useCallback(async (ctx) => {
    if (listeningRef.current) { log.warn('Already listening'); return; }
    const geminiKey = import.meta.env.VITE_GEMINI_KEY;
    if (!geminiKey) { setState(s => ({ ...s, error:'VITE_GEMINI_KEY topilmadi!' })); return; }

    fullStopRef.current    = false;
    ctxRef.current         = ctx || '';
    listeningRef.current   = true;
    chunksRef.current      = [];
    recordStartRef.current = null;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation:  true,
          noiseSuppression:  false, // aggressiv suppression audio ni yo'q qilmasin
          autoGainControl:   true,
          channelCount:      1,
        },
        video: false,
      });
      streamRef.current = stream;
    } catch (e) {
      // Oddiy audio bilan qayta urinish
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;
      } catch (e2) {
        log.error('Mikrofon:', e2.message);
        setState(s => ({ ...s, error:'Mikrofon ruxsati berilmadi!', isListening:false }));
        listeningRef.current = false;
        return;
      }
    }

    if (fullStopRef.current) { stream.getTracks().forEach(t=>t.stop()); listeningRef.current=false; return; }

    const mimeType = getSupportedMimeType();
    let recorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch (e) {
      stream.getTracks().forEach(t=>t.stop());
      listeningRef.current = false;
      setState(s => ({ ...s, error:'MediaRecorder ishlamadi: '+e.message }));
      return;
    }

    mediaRecRef.current    = recorder;
    recordStartRef.current = Date.now(); // yozish boshlanish vaqti

    recorder.ondataavailable = e => {
      if (e.data?.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      stream.getTracks().forEach(t=>t.stop());
      streamRef.current    = null;
      listeningRef.current = false;

      if (fullStopRef.current) { chunksRef.current=[]; return; }

      // ── Yozish davomiyligi tekshirish ──────────────────────────────────────
      const recordDuration = recordStartRef.current
        ? Date.now() - recordStartRef.current
        : 0;
      recordStartRef.current = null;

      if (recordDuration < MIN_RECORD_MS) {
        log.warn(`Audio juda qisqa: ${recordDuration}ms < ${MIN_RECORD_MS}ms — skip`);
        setState(s => ({ ...s, isListening:false,
          error:`Kamida ${(MIN_RECORD_MS/1000).toFixed(1)} sekund gapirishingiz kerak` }));
        chunksRef.current = [];
        // Xato xabarni 2 sekunddan keyin o'chirish
        setTimeout(() => setState(s => ({ ...s, error:null })), 2000);
        return;
      }

      const chunks = chunksRef.current;
      chunksRef.current = [];

      if (!chunks.length) {
        setState(s => ({ ...s, isListening:false }));
        return;
      }

      const audioBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      log.info('Audio recorded:', audioBlob.size, 'bytes, duration:', recordDuration, 'ms');

      // ── Audio hajmi tekshirish ─────────────────────────────────────────────
      if (audioBlob.size < MIN_BLOB_BYTES) {
        log.warn(`Audio juda kichik: ${audioBlob.size} bytes < ${MIN_BLOB_BYTES} — jimlik yoki shovqin`);
        setState(s => ({ ...s, isListening:false,
          error:"Ovoz aniqlanmadi — mikrofonni tekshiring yoki balandroq gapiring" }));
        setTimeout(() => setState(s => ({ ...s, error:null })), 2500);
        return;
      }

      // STT boshlandi — Gemini 2.5 Flash orqali
      setState(s => ({ ...s, isListening:false, isTranscribing:true, error:null }));

      try {
        const raw = await geminiSTT(audioBlob, geminiKey);
        if (fullStopRef.current) return;

        // ── Hallucination filtri ───────────────────────────────────────────────
        if (!raw?.trim() || isHallucination(raw)) {
          log.warn('Hallucination yoki bo\'sh natija filtrlandi:', JSON.stringify(raw));
          setState(s => ({ ...s, isTranscribing:false,
            error:"Ovoz aniqlanmadi — gapirgansiz? Qayta urinib ko'ring" }));
          setTimeout(() => setState(s => ({ ...s, error:null })), 2500);
          return;
        }

        // Muvaffaqiyatli — tasdiqlashni kutish
        log.info('Transcript ready:', raw.trim());
        setState(s => ({
          ...s,
          isTranscribing: false,
          isWaitingConfirm: true,
          pendingTranscript: raw.trim(),
        }));

      } catch (e) {
        log.error('STT xato:', e.message);
        if (!fullStopRef.current) {
          setState(s => ({ ...s, isTranscribing:false, error:'STT xato: '+e.message }));
        }
      }
    };

    recorder.start(500); // 500ms timeslice — data tez-tez yig'iladi, stop da ham to'liq keladi
    setState(s => ({ ...s, isListening:true, pendingTranscript:'', error:null, isWaitingConfirm:false }));
    log.info('Recording started (min', MIN_RECORD_MS, 'ms required)');
  }, []);

  // ── stopListening ─────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    log.info('stopListening');
    if (mediaRecRef.current?.state === 'recording') {
      mediaRecRef.current.stop();
    } else {
      listeningRef.current   = false;
      recordStartRef.current = null;
      setState(s => ({ ...s, isListening:false }));
    }
  }, []);

  // ── stopSpeaking ──────────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    // Gemini TTS audio ni to'xtatish
    if (_currentGeminiAudio) {
      try { _currentGeminiAudio.pause(); _currentGeminiAudio.src = ''; } catch(_) {}
      _currentGeminiAudio = null;
    }
    window.speechSynthesis?.cancel();
    setState(s => ({ ...s, isSpeaking:false }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    stopSpeaking,
    stopAll,
    askAI,
    confirmAndSend,
    discardTranscript,
  };
}