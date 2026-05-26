import { useEffect } from 'react';
import type { ListAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { shuffleArray } from '../core/shuffle';
import { RichText } from '../components/RichText';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: ListAnswer) => void;
}

function getItems(question: Question) {
  return question.steps || question.options || [];
}

function getInitialState(question: Question, answer: unknown): ListAnswer {
  const items = getItems(question);
  if (answer && typeof answer === 'object' && !Array.isArray(answer) && 'target' in answer) {
    const state = answer as ListAnswer;
    return {
      target: Array.isArray(state.target) ? state.target : [],
      source: Array.isArray(state.source) ? state.source : [],
    };
  }

  return {
    target: [],
    source: shuffleArray(items),
  };
}

export function OrderingQuestion({ question, answer, onAnswer }: Props) {
  const state = getInitialState(question, answer);
  const target = state.target || [];
  const source = state.source || [];

  useEffect(() => {
    if (!answer || typeof answer !== 'object' || Array.isArray(answer) || !('target' in answer)) {
      onAnswer(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.global_id]);

  function moveToTarget(item: string) {
    onAnswer({ target: [...target, item], source: source.filter((x) => x !== item) });
  }

  function removeFromTarget(index: number) {
    const item = target[index];
    const nextTarget = [...target];
    nextTarget.splice(index, 1);
    onAnswer({ target: nextTarget, source: [...source, item] });
  }

  function moveTarget(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= target.length) return;
    const next = [...target];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    onAnswer({ target: next, source });
  }

  return (
    <div className="ordering-layout">
      <div className="ordering-panel">
        <h3>Thứ tự trả lời</h3>
        {target.length === 0 ? <div className="empty-state">Chọn các mục bên phải để đưa vào đây.</div> : null}
        {target.map((item, idx) => (
          <div className="ordered-item" key={`${item}-${idx}`}>
            <span className="order-number">{idx + 1}</span>
            <span className="ordered-content"><RichText value={item} /></span>
            <div className="item-actions">
              <button type="button" onClick={() => moveTarget(idx, -1)}>↑</button>
              <button type="button" onClick={() => moveTarget(idx, 1)}>↓</button>
              <button type="button" onClick={() => removeFromTarget(idx)}>Bỏ</button>
            </div>
          </div>
        ))}
      </div>

      <div className="ordering-panel">
        <h3>Danh sách đáp án</h3>
        {source.map((item, idx) => (
          <button key={`${item}-${idx}`} type="button" className="source-pill" onClick={() => moveToTarget(item)}>
            <RichText value={item} />
          </button>
        ))}
      </div>
    </div>
  );
}
