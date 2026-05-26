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

function getInitialState(question: Question, answer: unknown): ListAnswer {
  const pairs = question.pairs || [];
  if (answer && typeof answer === 'object' && !Array.isArray(answer) && 'target' in answer) {
    const state = answer as ListAnswer;
    return {
      target: Array.isArray(state.target) ? state.target : Array(pairs.length).fill(''),
      source: Array.isArray(state.source) ? state.source : [],
    };
  }

  return {
    target: Array(pairs.length).fill(''),
    source: shuffleArray(pairs.map((pair) => pair.right)),
  };
}

export function MatchingQuestion({ question, answer, onAnswer }: Props) {
  const pairs = question.pairs || [];
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const state = getInitialState(question, answer);
  const source = state.source || [];
  const target = state.target || Array(pairs.length).fill('');

  useEffect(() => {
    if (!answer || typeof answer !== 'object' || Array.isArray(answer) || !('target' in answer)) {
      onAnswer(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.global_id]);

  function place(rowIndex: number) {
    if (!selectedSource) return;
    const nextTarget = [...target];
    const nextSource = source.filter((item) => item !== selectedSource);
    const replaced = nextTarget[rowIndex];
    nextTarget[rowIndex] = selectedSource;
    if (replaced) nextSource.push(replaced);
    setSelectedSource(null);
    onAnswer({ target: nextTarget, source: nextSource });
  }

  function remove(rowIndex: number) {
    const value = target[rowIndex];
    if (!value) return;
    const nextTarget = [...target];
    nextTarget[rowIndex] = '';
    onAnswer({ target: nextTarget, source: [...source, value] });
  }

  return (
    <div className="matching-layout">
      <div className="matching-panel">
        <h3>Cột trái</h3>
        {pairs.map((pair, idx) => (
          <div className="match-left-item" key={`${pair.left}-${idx}`}>
            <RichText value={pair.left} />
          </div>
        ))}
      </div>

      <div className="matching-panel">
        <h3>Ô trả lời</h3>
        {pairs.map((pair, idx) => (
          <button
            key={`${pair.left}-target-${idx}`}
            type="button"
            className={`drop-slot ${target[idx] ? 'filled' : ''}`}
            onClick={() => target[idx] ? remove(idx) : place(idx)}
          >
            {target[idx] ? <RichText value={target[idx]} /> : selectedSource ? 'Nhấn để đặt đáp án' : 'Chọn đáp án bên phải'}
          </button>
        ))}
      </div>

      <div className="matching-panel">
        <h3>Đáp án</h3>
        <p className="mini-hint">Chọn đáp án rồi nhấn vào ô cần đặt.</p>
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
