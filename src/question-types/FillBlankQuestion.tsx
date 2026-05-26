import { useEffect, useState } from 'react';
import type { ListAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { shuffleArray } from '../core/shuffle';
import { RichText } from '../components/RichText';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: ListAnswer) => void;
}

function getCorrectAnswers(question: Question) {
  if (Array.isArray(question.answer)) return question.answer.map(String);
  if (typeof question.answer === 'string') return [question.answer];
  return question.options || [];
}

function getBlanks(question: Question) {
  const answers = getCorrectAnswers(question);
  return question.blanks || answers.map((_, idx) => `(${idx + 1})`);
}

function getInitialState(question: Question, answer: unknown): ListAnswer {
  const blanks = getBlanks(question);
  const options = question.options || getCorrectAnswers(question);

  if (answer && typeof answer === 'object' && !Array.isArray(answer) && 'target' in answer) {
    const state = answer as ListAnswer;
    return {
      target: Array.isArray(state.target) ? state.target : Array(blanks.length).fill(''),
      source: Array.isArray(state.source) ? state.source : [],
    };
  }

  return {
    target: Array(blanks.length).fill(''),
    source: shuffleArray(options),
  };
}

export function FillBlankQuestion({ question, answer, onAnswer }: Props) {
  const blanks = getBlanks(question);
  const state = getInitialState(question, answer);
  const target = state.target || Array(blanks.length).fill('');
  const source = state.source || [];
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  useEffect(() => {
    if (!answer || typeof answer !== 'object' || Array.isArray(answer) || !('target' in answer)) {
      onAnswer(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.global_id]);

  function place(idx: number) {
    if (!selectedSource) return;
    const nextTarget = [...target];
    const nextSource = source.filter((item) => item !== selectedSource);
    const replaced = nextTarget[idx];
    nextTarget[idx] = selectedSource;
    if (replaced) nextSource.push(replaced);
    setSelectedSource(null);
    onAnswer({ target: nextTarget, source: nextSource });
  }

  function remove(idx: number) {
    const value = target[idx];
    if (!value) return;
    const nextTarget = [...target];
    nextTarget[idx] = '';
    onAnswer({ target: nextTarget, source: [...source, value] });
  }

  const qText = String(question.q || question.text || '');

  return (
    <div className="fill-blank-block">
      <p className="hint-text">Chọn đáp án bên dưới rồi nhấn vào ô trống tương ứng.</p>
      <div className="blank-text-card">
        <RichText value={qText || 'Điền các đáp án vào vị trí trống.'} />
      </div>

      <div className="blank-grid">
        {blanks.map((blank, idx) => (
          <button
            key={`${blank}-${idx}`}
            type="button"
            className={`drop-slot ${target[idx] ? 'filled' : ''}`}
            onClick={() => target[idx] ? remove(idx) : place(idx)}
          >
            <strong>{blank}</strong>
            <span>{target[idx] ? <RichText value={target[idx]} /> : selectedSource ? 'Nhấn để đặt' : 'Chưa chọn'}</span>
          </button>
        ))}
      </div>

      <div className="source-bank">
        {source.map((item, idx) => (
          <button
            key={`${item}-${idx}`}
            type="button"
            className={`source-pill ${selectedSource === item ? 'selected' : ''}`}
            onClick={() => setSelectedSource(item)}
          >
            <RichText value={item} />
          </button>
        ))}
      </div>
    </div>
  );
}
