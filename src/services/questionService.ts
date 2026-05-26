import { LEVEL2_PREFIX } from '../config';
import { deepShuffleData } from '../core/shuffle';
import { naturalSort } from '../core/normalize';
import type { Question } from '../types/question';
import { firebaseGet } from './firebase';

function iterFirebaseQuestions(raw: unknown): Array<[string | number, Question]> {
  if (Array.isArray(raw)) {
    return raw
      .map((item, idx) => [idx, item] as [number, unknown])
      .filter(([, item]) => item && typeof item === 'object') as Array<[number, Question]>;
  }

  if (raw && typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).filter(([, item]) => item && typeof item === 'object') as Array<[
      string,
      Question,
    ]>;
  }

  return [];
}

export async function loadLevel2Questions(): Promise<Question[]> {
  const shallowExams = await firebaseGet<Record<string, boolean>>('exams', { shallow: 'true' });
  const examKeys = Object.keys(shallowExams || {})
    .filter((key) => key.startsWith(LEVEL2_PREFIX))
    .sort(naturalSort);

  if (!examKeys.length) {
    throw new Error(`Không tìm thấy exam nào bắt đầu bằng prefix: ${LEVEL2_PREFIX}`);
  }

  const banks = await Promise.all(
    examKeys.map(async (examKey) => {
      const rawQuestions = await firebaseGet<unknown>(`exams/${examKey}/questions`);
      return iterFirebaseQuestions(rawQuestions).map(([idx, q]) => ({
        ...q,
        global_id: q.global_id || `${examKey}_${idx}`,
      }));
    }),
  );

  const allQuestions = banks.flat().filter((q) => q && typeof q === 'object');

  if (!allQuestions.length) {
    throw new Error('Tải được danh sách exam nhưng không tìm thấy câu hỏi hợp lệ.');
  }

  return deepShuffleData(allQuestions, true);
}
