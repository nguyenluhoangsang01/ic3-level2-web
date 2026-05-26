import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY } from '../config';
import { calculateScore, getQuestionInstantResult, isQuestionAnswered } from '../core/grading';
import { loadLevel2Questions } from '../services/questionService';
import type { AnswerMap, AnswerValue } from '../types/answer';
import type { Question } from '../types/question';
import { ExamHeader } from './ExamHeader';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigator } from './QuestionNavigator';
import { ResultScreen } from './ResultScreen';

interface StoredState {
  answers: AnswerMap;
  currentIndex: number;
}

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: {}, currentIndex: 0 };
    const parsed = JSON.parse(raw) as StoredState;
    return {
      answers: parsed.answers || {},
      currentIndex: Number(parsed.currentIndex || 0),
    };
  } catch {
    return { answers: {}, currentIndex: 0 };
  }
}

export function ExamApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>(() => readStoredState().answers);
  const [currentIndex, setCurrentIndex] = useState(() => readStoredState().currentIndex);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { correct: number; total: number; percent: number }>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    loadLevel2Questions()
      .then((data) => {
        if (!mounted) return;
        setQuestions(data);
        setCurrentIndex((idx) => Math.max(0, Math.min(idx, data.length - 1)));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }));
  }, [answers, currentIndex]);

  const answeredCount = useMemo(
    () => questions.filter((q, idx) => isQuestionAnswered(q, answers[idx])).length,
    [questions, answers],
  );

  const gradedMap = useMemo(() => {
    const map: Record<number, ReturnType<typeof getQuestionInstantResult>> = {};

    questions.forEach((q, idx) => {
      const status = getQuestionInstantResult(q, answers[idx]);
      if (status.answered) {
        map[idx] = status;
      }
    });

    return map;
  }, [questions, answers]);

  const liveCorrectCount = useMemo(
    () => Object.values(gradedMap).filter((item) => item.isCorrect).length,
    [gradedMap],
  );

  const currentQuestion = questions[currentIndex];
  const currentFeedback = currentQuestion ? getQuestionInstantResult(currentQuestion, answers[currentIndex]) : null;

  function setAnswer(answer: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  }

  function resetCurrentQuestion() {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  }

  function finishExam() {
    const score = calculateScore(questions, answers);
    setResult({
      correct: score.absoluteCorrectCount,
      total: score.totalQuestions,
      percent: score.percent,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restartExam() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    window.location.reload();
  }

  if (loading) {
    return (
      <main className="center-screen">
        <section className="status-card">
          <div className="loader" />
          <h1>Đang tải câu hỏi</h1>
          <p>Hệ thống đang đọc toàn bộ ngân hàng câu hỏi IC3 GS6 Level 2 từ Firebase.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="center-screen">
        <section className="status-card error-card">
          <h1>Không tải được câu hỏi</h1>
          <pre>{error}</pre>
          <button type="button" className="primary-btn" onClick={() => window.location.reload()}>Tải lại</button>
        </section>
      </main>
    );
  }

  if (!questions.length || !currentQuestion) {
    return (
      <main className="center-screen">
        <section className="status-card error-card">
          <h1>Không có câu hỏi</h1>
          <p>Firebase không trả về câu hỏi hợp lệ.</p>
        </section>
      </main>
    );
  }

  if (result) {
    return <ResultScreen correct={result.correct} total={result.total} percent={result.percent} onRestart={restartExam} onReview={() => setResult(null)} />;
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="app-shell">
      <ExamHeader
        current={currentIndex}
        total={questions.length}
        answered={answeredCount}
        correct={liveCorrectCount}
        onOpenNavigator={() => setNavigatorOpen(true)}
      />

      <QuestionCard
        question={currentQuestion}
        answer={answers[currentIndex]}
        feedback={currentFeedback}
        onAnswer={setAnswer}
      />

      <footer className="bottom-actions">
        <button
          type="button"
          className="outline-btn"
          disabled={isFirst}
          onClick={() => {
            setCurrentIndex((idx) => Math.max(0, idx - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Trước
        </button>

        <button type="button" className="ghost-btn" onClick={resetCurrentQuestion}>Đặt lại câu này</button>

        {isLast ? (
          <button type="button" className="success-btn" onClick={finishExam}>Hoàn thành</button>
        ) : (
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Tiếp
          </button>
        )}
      </footer>

      <QuestionNavigator
        open={navigatorOpen}
        questions={questions}
        answers={answers}
        gradedMap={gradedMap}
        currentIndex={currentIndex}
        onClose={() => setNavigatorOpen(false)}
        onJump={(idx) => {
          setCurrentIndex(idx);
          setNavigatorOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
