import type { Question } from '../types/question';

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function safeExtractNumber(value: unknown): number {
  const text = String(value ?? '0');
  const token = text.includes('_') ? text.split('_').pop() || text : text;
  const match = token.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function deepShuffleData(input: Question[], shuffleQuestions = true): Question[] {
  const questions = input.map((q) => ({ ...q }));

  if (shuffleQuestions) {
    for (let i = questions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  } else {
    questions.sort((a, b) => safeExtractNumber(a.id ?? a.global_id) - safeExtractNumber(b.id ?? b.global_id));
  }

  return questions.map((q) => {
    const qType = String(q.type || 'single').toLowerCase().trim();
    const next: Question = { ...q };

    if ((qType === 'single' || qType === 'multi') && Array.isArray(q.options)) {
      next.options = shuffleArray(q.options);
    } else if (qType === 'matching' && Array.isArray(q.pairs)) {
      next.pairs = shuffleArray(q.pairs).map((pair) => ({ ...pair }));
    } else if (qType === 'matrix' && Array.isArray(q.rows)) {
      next.rows = shuffleArray(q.rows).map((row) => ({ ...row }));
    }

    return next;
  });
}
