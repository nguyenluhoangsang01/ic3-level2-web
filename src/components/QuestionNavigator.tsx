import type { AnswerMap } from '../types/answer';
import type { Question } from '../types/question';
import { isQuestionAnswered } from '../core/grading';

interface InstantResult {
  answered: boolean;
  points: number;
  isCorrect: boolean;
  isPartial: boolean;
}

interface Props {
  open: boolean;
  questions: Question[];
  answers: AnswerMap;
  gradedMap: Record<number, InstantResult>;
  currentIndex: number;
  onJump: (index: number) => void;
  onClose: () => void;
}

function typeLabel(type: unknown) {
  const t = String(type || 'single').toLowerCase();
  if (t === 'single') return 'Chọn 1';
  if (t === 'multi') return 'Chọn nhiều';
  if (t === 'hotspot') return 'Hotspot';
  if (t === 'matching') return 'Ghép nối';
  if (t === 'ordering') return 'Sắp xếp';
  if (t === 'matrix') return 'Bảng chọn';
  if (t === 'fill_blank') return 'Điền từ';
  return t;
}

export function QuestionNavigator({ open, questions, answers, gradedMap, currentIndex, onJump, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="navigator-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <strong>Danh sách câu hỏi</strong>
            <p>Xanh lá là đúng, đỏ là sai, xám là chưa làm.</p>
          </div>
          <button type="button" className="mini-btn" onClick={onClose}>Đóng</button>
        </div>

        <div className="question-grid">
          {questions.map((q, idx) => {
            const done = isQuestionAnswered(q, answers[idx]);
            const graded = gradedMap[idx];

            return (
              <button
                key={q.global_id || idx}
                type="button"
                className={[
                  'question-chip',
                  idx === currentIndex ? 'current' : '',
                  done ? 'done' : '',
                  graded?.answered ? (graded.isCorrect ? 'correct' : 'wrong') : '',
                ].filter(Boolean).join(' ')}
                title={typeLabel(q.type)}
                onClick={() => onJump(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
