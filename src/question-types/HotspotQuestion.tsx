import type { MouseEvent } from 'react';
import type { HotspotAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { normalizeBool } from '../core/normalize';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: HotspotAnswer) => void;
}

function getRequired(question: Question) {
  const correct = (question.hotspots || []).filter((hs) => normalizeBool(hs.isCorrect));
  return Math.max(1, correct.length || 1);
}

function pointInBox(point: [number, number], box: { x: number | string; y: number | string; w: number | string; h: number | string }) {
  const [px, py] = point;
  const x = Number(box.x || 0);
  const y = Number(box.y || 0);
  const w = Number(box.w || 0);
  const h = Number(box.h || 0);
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

export function HotspotQuestion({ question, answer, onAnswer }: Props) {
  const clicks = Array.isArray(answer) ? answer as HotspotAnswer : [];
  const hotspots = question.hotspots || [];
  const required = getRequired(question);
  const image = question.image || question.video || '';

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pctX = ((event.clientX - rect.left) / rect.width) * 100;
    const pctY = ((event.clientY - rect.top) / rect.height) * 100;

    const clickedIdx = hotspots.findIndex((hs) => pointInBox([pctX, pctY], hs));
    if (clickedIdx === -1) return;

    const hs = hotspots[clickedIdx];
    const existingIdx = clicks.findIndex((point) => pointInBox(point, hs));

    if (existingIdx !== -1) {
      const next = [...clicks];
      next.splice(existingIdx, 1);
      onAnswer(next);
      return;
    }

    if (clicks.length >= required) return;
    onAnswer([...clicks, [pctX, pctY]]);
  }

  if (!image) {
    return <div className="soft-warning">Câu hotspot này chưa có hình ảnh.</div>;
  }

  return (
    <div className="hotspot-block">
      <p className="hint-text">Nhấn vào {required} vùng đúng trên hình ảnh.</p>
      <div className="hotspot-stage" onClick={handleClick}>
        <img src={String(image)} alt="Hotspot" draggable={false} />
        {hotspots.map((hs, idx) => {
          const selected = clicks.some((point) => pointInBox(point, hs));
          return (
            <span
              key={idx}
              className={`hotspot-box ${selected ? 'selected' : ''}`}
              style={{
                left: `${Number(hs.x || 0)}%`,
                top: `${Number(hs.y || 0)}%`,
                width: `${Number(hs.w || 0)}%`,
                height: `${Number(hs.h || 0)}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
