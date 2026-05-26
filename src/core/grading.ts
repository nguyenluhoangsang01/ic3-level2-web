import type { AnswerValue, ListAnswer, MatrixAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { normalizeAnswerValue, normalizeBool } from './normalize';

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (value === null || value === undefined || value === '') return [];
  return [String(value)];
}

function asListAnswer(value: AnswerValue): ListAnswer | null {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'target' in value) {
    const answer = value as ListAnswer;
    return {
      target: Array.isArray(answer.target) ? answer.target : [],
      source: Array.isArray(answer.source) ? answer.source : [],
    };
  }
  return null;
}

function isEmptyAnswer(answer: unknown): boolean {
  if (answer === null || answer === undefined) return true;
  if (typeof answer === 'string') return answer.trim() === '';
  if (Array.isArray(answer)) return answer.length === 0;
  if (typeof answer === 'object') return Object.keys(answer as Record<string, unknown>).length === 0;
  return false;
}

function getCorrectHotspots(q: Question) {
  return (q.hotspots || []).filter((hs) => normalizeBool(hs.isCorrect));
}

function requiredMultiCount(q: Question): number {
  const ans = asArray(q.answer);
  const limit = Number(q.limit || 0);
  if (ans.length > 0) return ans.length;
  if (limit > 0) return limit;
  return 1;
}

function requiredOrderingCount(q: Question): number {
  const items = q.steps || q.options || [];
  return items.length;
}

function requiredFillBlankCount(q: Question): number {
  const ans = asArray(q.answer);
  const blanks = Array.isArray(q.blanks) ? q.blanks : [];
  if (blanks.length > 0) return blanks.length;
  if (ans.length > 0) return ans.length;
  return q.options?.length || 0;
}

export function isQuestionAnswered(q: Question, answer: AnswerValue): boolean {
  const qType = String(q.type || 'single').toLowerCase().trim();

  if (qType === 'single') {
    return typeof answer === 'string' && answer.trim() !== '';
  }

  if (qType === 'multi') {
    return Array.isArray(answer) && answer.length >= requiredMultiCount(q);
  }

  if (qType === 'hotspot') {
    const required = Math.max(1, getCorrectHotspots(q).length || 1);
    return Array.isArray(answer) && answer.length >= required;
  }

  if (qType === 'matching') {
    const state = asListAnswer(answer);
    const required = q.pairs?.length || 0;
    return Boolean(state && required > 0 && state.target.filter((item) => normalizeAnswerValue(item)).length >= required);
  }

  if (qType === 'ordering') {
    const state = asListAnswer(answer);
    const required = requiredOrderingCount(q);
    return Boolean(state && required > 0 && state.target.filter((item) => normalizeAnswerValue(item)).length >= required);
  }

  if (qType === 'fill_blank') {
    const state = asListAnswer(answer);
    const required = requiredFillBlankCount(q);
    return Boolean(state && required > 0 && state.target.filter((item) => normalizeAnswerValue(item)).length >= required);
  }

  if (qType === 'matrix') {
    const rows = q.rows || [];
    if (!rows.length || !answer || typeof answer !== 'object' || Array.isArray(answer)) return false;
    const user = answer as MatrixAnswer;
    return rows.every((_, idx) => normalizeAnswerValue(user[`row_${idx}`] ?? user[String(idx)]) !== '');
  }

  return !isEmptyAnswer(answer);
}

export function getQuestionPoints(q: Question, userAnswer: AnswerValue): number {
  const qType = String(q.type || 'single').toLowerCase().trim();

  if (isEmptyAnswer(userAnswer)) return 0;

  if (qType === 'single') {
    const correct = asArray(q.answer);
    if (correct.length > 0) {
      return correct.some((ans) => normalizeAnswerValue(ans) === normalizeAnswerValue(userAnswer)) ? 1 : 0;
    }
    return normalizeAnswerValue(userAnswer) === normalizeAnswerValue(q.answer) ? 1 : 0;
  }

  if (qType === 'multi') {
    const correct = new Set(asArray(q.answer).map((ans) => normalizeAnswerValue(ans)));
    if (!correct.size || !Array.isArray(userAnswer)) return 0;

    const userClean = Array.from(new Set(userAnswer.map((ans) => normalizeAnswerValue(ans))));
    const wrongChoices = userClean.filter((ans) => !correct.has(ans));
    if (wrongChoices.length > 0) return 0;

    const correctCount = userClean.filter((ans) => correct.has(ans)).length;
    return correctCount / correct.size;
  }

  if (qType === 'ordering' || qType === 'fill_blank') {
    const correctAnswers = qType === 'ordering' ? (q.steps || q.options || []) : asArray(q.answer || q.options || []);
    const state = asListAnswer(userAnswer);
    if (!correctAnswers.length || !state) return 0;

    let correctCount = 0;
    correctAnswers.forEach((correctVal, idx) => {
      const userVal = state.target[idx] || '';
      const userNorm = normalizeAnswerValue(userVal);
      const correctNorm = normalizeAnswerValue(correctVal);
      if (userNorm && userNorm === correctNorm) correctCount += 1;
    });

    return correctCount / correctAnswers.length;
  }

  if (qType === 'matching') {
    const pairs = q.pairs || [];
    const state = asListAnswer(userAnswer);
    if (!pairs.length || !state) return 0;

    let correctCount = 0;
    pairs.forEach((pair, idx) => {
      const userNorm = normalizeAnswerValue(state.target[idx] || '');
      const correctNorm = normalizeAnswerValue(pair.right || '');
      if (userNorm && userNorm === correctNorm) correctCount += 1;
    });

    return correctCount / pairs.length;
  }

  if (qType === 'matrix') {
    const rows = q.rows || [];
    if (!rows.length || !userAnswer || typeof userAnswer !== 'object' || Array.isArray(userAnswer)) return 0;
    const user = userAnswer as MatrixAnswer;

    let correctCount = 0;
    rows.forEach((row, idx) => {
      const userVal = user[`row_${idx}`] ?? user[String(idx)] ?? '';
      const userNorm = normalizeAnswerValue(userVal);
      const correctNorm = normalizeAnswerValue(row.answer || '');
      if (correctNorm && userNorm === correctNorm) correctCount += 1;
    });

    return correctCount / rows.length;
  }

  if (qType === 'hotspot') {
    const correctHotspots = getCorrectHotspots(q);
    if (!correctHotspots.length || !Array.isArray(userAnswer)) return 0;

    const unmatchedBoxes = correctHotspots.map((hs) => ({
      x: Number(hs.x || 0),
      y: Number(hs.y || 0),
      w: Number(hs.w || 0),
      h: Number(hs.h || 0),
    }));

    let hitCount = 0;

    for (const point of userAnswer) {
      if (!Array.isArray(point) || point.length < 2) continue;
      const ux = Number(point[0]);
      const uy = Number(point[1]);
      if (!Number.isFinite(ux) || !Number.isFinite(uy)) continue;

      const hitIndex = unmatchedBoxes.findIndex(
        (box) => ux >= box.x && ux <= box.x + box.w && uy >= box.y && uy <= box.y + box.h,
      );

      if (hitIndex !== -1) {
        hitCount += 1;
        unmatchedBoxes.splice(hitIndex, 1);
      }
    }

    return hitCount / correctHotspots.length;
  }

  return 0;
}

export function getQuestionInstantResult(q: Question, answer: AnswerValue) {
  const answered = isQuestionAnswered(q, answer);
  const points = answered ? getQuestionPoints(q, answer) : 0;

  return {
    answered,
    points,
    isCorrect: answered && points >= 0.99,
    isPartial: answered && points > 0 && points < 0.99,
  };
}

export function calculateScore(questions: Question[], answers: Record<number, AnswerValue>) {
  let absoluteCorrectCount = 0;
  let completedCount = 0;

  questions.forEach((q, idx) => {
    const answer = answers[idx];
    if (isQuestionAnswered(q, answer)) completedCount += 1;
    if (getQuestionPoints(q, answer) >= 0.99) absoluteCorrectCount += 1;
  });

  const totalQuestions = questions.length;
  const percent = totalQuestions ? Math.round((absoluteCorrectCount / totalQuestions) * 1000) / 10 : 0;

  return {
    absoluteCorrectCount,
    totalQuestions,
    completedCount,
    percent,
  };
}
