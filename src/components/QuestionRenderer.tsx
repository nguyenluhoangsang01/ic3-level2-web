import type { AnswerValue } from '../types/answer';
import type { Question } from '../types/question';
import { SingleChoice } from '../question-types/SingleChoice';
import { MultiChoice } from '../question-types/MultiChoice';
import { HotspotQuestion } from '../question-types/HotspotQuestion';
import { MatchingQuestion } from '../question-types/MatchingQuestion';
import { OrderingQuestion } from '../question-types/OrderingQuestion';
import { MatrixQuestion } from '../question-types/MatrixQuestion';
import { FillBlankQuestion } from '../question-types/FillBlankQuestion';

interface Props {
  question: Question;
  answer: AnswerValue;
  onAnswer: (answer: AnswerValue) => void;
}

export function QuestionRenderer({ question, answer, onAnswer }: Props) {
  const type = String(question.type || 'single').toLowerCase().trim();

  if (type === 'single') {
    return <SingleChoice question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'multi') {
    return <MultiChoice question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'hotspot') {
    return <HotspotQuestion question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'matching') {
    return <MatchingQuestion question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'ordering') {
    return <OrderingQuestion question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'matrix') {
    return <MatrixQuestion question={question} answer={answer} onAnswer={onAnswer} />;
  }

  if (type === 'fill_blank') {
    return <FillBlankQuestion question={question} answer={answer} onAnswer={onAnswer} />;
  }

  return <div className="soft-warning">Dạng câu hỏi “{type}” chưa được hỗ trợ.</div>;
}
