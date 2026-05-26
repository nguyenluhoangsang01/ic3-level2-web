import type { Question } from '../types/question';
import { RichText } from '../components/RichText';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: string[]) => void;
}

function requiredCount(question: Question): number {
  if (Array.isArray(question.answer) && question.answer.length > 0) return question.answer.length;
  if (question.limit && Number(question.limit) > 0) return Number(question.limit);
  return 1;
}

export function MultiChoice({ question, answer, onAnswer }: Props) {
  const options = question.options || [];
  const selected = Array.isArray(answer) ? answer.map(String) : [];
  const limit = requiredCount(question);

  function toggle(option: string) {
    const exists = selected.includes(option);
    if (exists) {
      onAnswer(selected.filter((item) => item !== option));
      return;
    }

    if (selected.length >= limit) return;
    onAnswer([...selected, option]);
  }

  return (
    <div>
      <p className="hint-text">Vui lòng chọn {limit} đáp án.</p>
      <div className="option-list">
        {options.map((option, idx) => {
          const checked = selected.includes(option);
          const locked = selected.length >= limit && !checked;
          return (
            <button
              key={`${option}-${idx}`}
              type="button"
              className={`option-card multi ${checked ? 'selected' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => toggle(option)}
            >
              <span className="check-box">{checked ? '✓' : ''}</span>
              <span className="option-content"><RichText value={option} /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
