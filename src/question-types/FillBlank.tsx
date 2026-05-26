import type { TargetAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { toArray } from '../core/normalize';
import { SelectionSlots } from './SelectionSlots';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: TargetAnswer) => void;
}

export function FillBlank({ question, answer, onAnswer }: Props) {
  const correct = toArray<string>(question.answer || question.options || []);
  const target = (typeof answer === 'object' && answer && Array.isArray((answer as TargetAnswer).target)
    ? (answer as TargetAnswer).target
    : Array(correct.length).fill('')) as string[];

  const choices = question._webChoices || toArray<string>(question.options || question.answer || []);
  const slotLabels = correct.map((_, i) => `Ô trống ${i + 1}`);

  if (!choices.length) {
    return (
      <div className="fill-inputs">
        {slotLabels.map((label, idx) => (
          <label key={label}>
            {label}
            <input
              value={target[idx] || ''}
              onChange={(e) => {
                const next = [...target];
                next[idx] = e.target.value;
                onAnswer({ target: next });
              }}
            />
          </label>
        ))}
      </div>
    );
  }

  return (
    <SelectionSlots
      choices={choices}
      target={target}
      slotLabels={slotLabels}
      hint="Chọn từ/cụm từ, sau đó bấm vào ô trống tương ứng."
      onChange={(next) => onAnswer({ target: next, source: choices.filter((x) => !next.includes(x)) })}
    />
  );
}
