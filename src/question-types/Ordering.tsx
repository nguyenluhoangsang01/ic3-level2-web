import type { TargetAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { toArray } from '../core/normalize';
import { SelectionSlots } from './SelectionSlots';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: TargetAnswer) => void;
}

export function Ordering({ question, answer, onAnswer }: Props) {
  const correct = toArray<string>(question.steps || question.options || []);
  const target = (typeof answer === 'object' && answer && Array.isArray((answer as TargetAnswer).target)
    ? (answer as TargetAnswer).target
    : Array(correct.length).fill('')) as string[];

  const choices = question._webChoices || correct;
  const slotLabels = correct.map((_, i) => `Bước ${i + 1}`);

  return (
    <SelectionSlots
      choices={choices}
      target={target}
      slotLabels={slotLabels}
      hint="Chọn một mục ở danh sách lựa chọn, sau đó bấm vào vị trí cần đặt."
      onChange={(next) => onAnswer({ target: next, source: choices.filter((x) => !next.includes(x)) })}
    />
  );
}
