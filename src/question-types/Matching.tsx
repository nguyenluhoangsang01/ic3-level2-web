import type { TargetAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { SelectionSlots } from './SelectionSlots';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: TargetAnswer) => void;
}

export function Matching({ question, answer, onAnswer }: Props) {
  const pairs = question.pairs || [];
  const target = (typeof answer === 'object' && answer && Array.isArray((answer as TargetAnswer).target)
    ? (answer as TargetAnswer).target
    : Array(pairs.length).fill('')) as string[];

  const choices = question._webChoices || pairs.map((p) => String(p.right || '')).filter(Boolean);
  const leftValues = pairs.map((p) => String(p.left || ''));
  const slotLabels = pairs.map((_, i) => `Mục ${i + 1}`);

  return (
    <SelectionSlots
      choices={choices}
      target={target}
      slotLabels={slotLabels}
      leftValues={leftValues}
      hint="Chọn đáp án ở danh sách lựa chọn, sau đó bấm vào ô ghép tương ứng."
      onChange={(next) => onAnswer({ target: next, source: choices.filter((x) => !next.includes(x)) })}
    />
  );
}
