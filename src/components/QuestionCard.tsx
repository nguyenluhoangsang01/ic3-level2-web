import type { AnswerValue } from '../types/answer';
import type { Question } from '../types/question';
import { RichText } from './RichText';
import { QuestionRenderer } from './QuestionRenderer';

interface Props {
  question: Question;
  answer: AnswerValue;
  feedback: {
    answered: boolean;
    isCorrect: boolean;
    isPartial: boolean;
  } | null;
  onAnswer: (answer: AnswerValue) => void;
}

function typeName(type: unknown) {
  const t = String(type || 'single').toLowerCase();
  if (t === 'single') return 'Chọn 1 đáp án';
  if (t === 'multi') return 'Chọn nhiều đáp án';
  if (t === 'hotspot') return 'Hotspot';
  if (t === 'matching') return 'Ghép nối';
  if (t === 'ordering') return 'Sắp xếp';
  if (t === 'matrix') return 'Bảng chọn';
  if (t === 'fill_blank') return 'Điền từ';
  return t;
}

export function QuestionCard({ question, answer, feedback, onAnswer }: Props) {
  const type = String(question.type || 'single').toLowerCase().trim();
  const qText = question.q || question.text || '';
  const media = type !== 'hotspot' ? question.image || question.video : '';

  return (
    <section className="question-card">
      <div className="question-meta">
        <span>{typeName(question.type)}</span>
        {question.global_id ? <span>{question.global_id}</span> : null}
      </div>

      {type !== 'fill_blank' ? (
        <div className="question-title">
          <RichText value={qText} />
        </div>
      ) : null}

      {media ? (
        <div className="media-box">
          {String(media).toLowerCase().endsWith('.mp4') ? (
            <video controls src={String(media)} />
          ) : (
            <img src={String(media)} alt="Minh họa câu hỏi" />
          )}
        </div>
      ) : null}

      <div className="answer-zone">
        <QuestionRenderer question={question} answer={answer} onAnswer={onAnswer} />
      </div>

      <div className="feedback-reserve">
        {feedback?.answered ? (
          <div className={`instant-feedback ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
            <strong>{feedback.isCorrect ? 'Chính xác!' : 'Chưa đúng.'}</strong>
            <span>
              {feedback.isCorrect
                ? ' Câu này đã được tính đúng.'
                : ' Em có thể chỉnh lại đáp án trước khi hoàn thành bài.'}
            </span>
          </div>
        ) : (
          <div className="instant-feedback placeholder">Hoàn thành câu này để hệ thống chấm ngay.</div>
        )}
      </div>
    </section>
  );
}
