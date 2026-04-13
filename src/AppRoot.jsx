// ═══════════════════════════════════════════════════════════════════════
// AIcenna — Sahifa boshqaruvchi (Explore ↔ Quiz)
// ═══════════════════════════════════════════════════════════════════════
import { useState } from 'react';
import App           from './App';
import QuizPage      from './pages/QuizPage';
import ClosedQuizPage from './pages/ClosedQuizPage';

export default function AppRoot() {
  const [page, setPage] = useState('explore'); // 'explore' | 'quiz-open' | 'quiz-closed'

  if (page === 'quiz-open')   return <QuizPage      onBack={() => setPage('explore')} />;
  if (page === 'quiz-closed') return <ClosedQuizPage onBack={() => setPage('explore')} />;
  return <App onOpenQuiz={(mode) => setPage(mode === 'closed' ? 'quiz-closed' : 'quiz-open')} />;
}
