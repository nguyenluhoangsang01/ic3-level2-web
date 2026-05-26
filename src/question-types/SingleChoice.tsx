import type { Question } from '../types/question';
import { RichText } from '../components/RichText';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: string) => void;
}

export function SingleChoice({ question, answer, onAnswer }: Props) {
  const options = question.options || [];

  return (
    <div className="option-list">
      {options.map((option, idx) => {
        const checked = answer === option;
        return (
          <button
            key={`${option}-${idx}`}
            type="button"
            className={`option-card ${checked ? 'selected' : ''}`}
            onClick={() => onAnswer(option)}
          >
            <span className="radio-dot" />
            <span className="option-content"><RichText value={option} /></span>
          </button>
        );
      })}
    </div>
  );
}
