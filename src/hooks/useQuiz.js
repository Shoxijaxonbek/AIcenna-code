// ═══════════════════════════════════════════════════════════════════════
// AIcenna — Quiz hook
// ═══════════════════════════════════════════════════════════════════════
import { useState, useCallback } from 'react';
import { getRandomQuestions } from '../config/questions';

const LS_KEY    = 'aicenna_scores';
const QUIZ_SIZE = 10;

export function toStars(pct) {
  if (pct >= 90) return 5;
  if (pct >= 75) return 4;
  if (pct >= 55) return 3;
  if (pct >= 35) return 2;
  return 1;
}

export function getScores() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}

function saveScore(name, correct, total) {
  const pct   = Math.round((correct / total) * 100);
  const stars = toStars(pct);
  const entry = { name, correct, total, pct, stars, date: new Date().toLocaleDateString('uz-UZ') };
  const existing = getScores();
  localStorage.setItem(LS_KEY, JSON.stringify([...existing, entry]));
  return entry;
}

// ─── Leaderboard: O'zbek futbolchilar birinchi! ──────────────────────
export const FAMOUS_SCORES = [
  { name: 'Abbosbek Fayzullayev', pct: 100, stars: 5, flag: '🇺🇿', correct: 10, total: 10 },
  { name: 'Eldor Shomurodov',     pct:  90, stars: 5, flag: '🇺🇿', correct:  9, total: 10 },
  { name: 'Abduqodir Husanov',    pct:  80, stars: 4, flag: '🇺🇿', correct:  8, total: 10 },
  { name: 'Lionel Messi',         pct:  70, stars: 4, flag: '🇦🇷', correct:  7, total: 10 },
  { name: 'Cristiano Ronaldo',    pct:  60, stars: 3, flag: '🇵🇹', correct:  6, total: 10 },
];

export function getLeaderboard() {
  // Har bir foydalanuvchi uchun faqat eng yuqori natijani saqlash
  const scores = getScores();
  const bestByName = {};
  for (const s of scores) {
    if (!bestByName[s.name] || s.pct > bestByName[s.name].pct) {
      bestByName[s.name] = s;
    }
  }
  const user = Object.values(bestByName).map(s => ({ ...s, flag: '🧑' }));
  const all  = [...FAMOUS_SCORES, ...user];
  all.sort((a, b) => b.pct - a.pct || b.stars - a.stars);
  return all;
}

// ─── Yopiq test (Closed Quiz) yordamchi funksiyalar ─────────────────
const LS_CLOSED_KEY = 'aicenna_closed_scores';

export function getClosedScores() {
  try { return JSON.parse(localStorage.getItem(LS_CLOSED_KEY) || '[]'); }
  catch { return []; }
}

export function saveClosedScore(name, avgPct) {
  const pct = Math.round(avgPct);
  const entry = { name, pct, date: new Date().toLocaleDateString('uz-UZ') };
  const existing = getClosedScores();
  const prev = existing.find(s => s.name === name);
  if (!prev || pct > prev.pct) {
    const updated = existing.filter(s => s.name !== name);
    localStorage.setItem(LS_CLOSED_KEY, JSON.stringify([...updated, entry]));
  }
  return entry;
}

export const CLOSED_FAMOUS_SCORES = [
  { name: 'Abbosbek Fayzullayev', pct: 95, flag: '🇺🇿' },
  { name: 'Eldor Shomurodov',     pct: 82, flag: '🇺🇿' },
  { name: 'Abduqodir Husanov',    pct: 74, flag: '🇺🇿' },
  { name: 'Lionel Messi',         pct: 65, flag: '🇦🇷' },
  { name: 'Cristiano Ronaldo',    pct: 55, flag: '🇵🇹' },
];

export function getClosedLeaderboard() {
  const scores = getClosedScores();
  const bestByName = {};
  for (const s of scores) {
    if (!bestByName[s.name] || s.pct > bestByName[s.name].pct) bestByName[s.name] = s;
  }
  const user = Object.values(bestByName).map(s => ({ ...s, flag: '🧑' }));
  const all  = [...CLOSED_FAMOUS_SCORES, ...user];
  all.sort((a, b) => b.pct - a.pct);
  return all;
}

// ─── Hook ───────────────────────────────────────────────────────────────
export default function useQuiz() {
  const [phase,    setPhase]    = useState('idle');   // idle | playing | finished
  const [questions,setQuestions]= useState([]);
  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState(null);     // tanlangan variant indeksi (null = timeout)
  const [answered, setAnswered] = useState(false);
  const [isTimeout,setIsTimeout]= useState(false);
  const [correct,  setCorrect]  = useState(0);
  const [results,  setResults]  = useState([]);
  const [lastEntry,setLastEntry]= useState(null);

  const start = useCallback(() => {
    const qs = getRandomQuestions(QUIZ_SIZE);
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsTimeout(false);
    setCorrect(0);
    setResults([]);
    setLastEntry(null);
    setPhase('playing');
  }, []);

  // optIdx === -1 → vaqt tugadi
  const selectOption = useCallback((optIdx) => {
    if (answered) return;
    const timeout   = optIdx === -1;
    const isCorrect = !timeout && (optIdx === questions[current]?.answer);
    setSelected(timeout ? null : optIdx);
    setIsTimeout(timeout);
    setAnswered(true);
    if (isCorrect) setCorrect(c => c + 1);
    setResults(r => [...r, {
      q: questions[current],
      selected: optIdx,
      isCorrect,
      isTimeout: timeout,
    }]);
  }, [answered, questions, current]);

  const next = useCallback((finalCorrect) => {
    const scoreToSave = finalCorrect !== undefined ? finalCorrect : correct;
    const isLast = current + 1 >= questions.length;
    if (isLast) {
      const entry = saveScore('Siz', scoreToSave, questions.length);
      setLastEntry(entry);
      setPhase('finished');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setIsTimeout(false);
    }
  }, [current, questions.length, correct]);

  const reset = useCallback(() => {
    setPhase('idle');
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsTimeout(false);
    setCorrect(0);
    setResults([]);
  }, []);

  const currentQ    = questions[current] || null;
  const total       = questions.length;
  const pct         = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars       = toStars(pct);
  const progressPct = total > 0 ? Math.round(((current + (answered ? 1 : 0)) / total) * 100) : 0;

  return {
    phase, questions, current, currentQ, total,
    selected, answered, isTimeout, correct, pct, stars, progressPct,
    results, lastEntry,
    start, selectOption, next, reset,
  };
}
