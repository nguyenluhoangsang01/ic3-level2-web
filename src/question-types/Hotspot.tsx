import { useRef, type MouseEvent } from 'react';
import type { HotspotAnswer } from '../types/answer';
import type { HotspotBox, Question } from '../types/question';
import { normalizeBool } from '../core/normalize';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: HotspotAnswer) => void;
}

function toNum(value: unknown): number {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function findHotspotIndex(hotspots: HotspotBox[], x: number, y: number) {
  return hotspots.findIndex((hs) => {
    const hx = toNum(hs.x);
    const hy = toNum(hs.y);
    const hw = toNum(hs.w);
    const hh = toNum(hs.h);
    return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
  });
}

function pointInsideBox(point: [number, number], hs: HotspotBox) {
  const [x, y] = point;
  const hx = toNum(hs.x);
  const hy = toNum(hs.y);
  const hw = toNum(hs.w);
  const hh = toNum(hs.h);
  return x >= hx && x <= hx + hw && y >= hy && y <= hy + hh;
}

export function Hotspot({ question, answer, onAnswer }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const hotspots = question.hotspots || [];
  const selected = Array.isArray(answer) ? (answer as HotspotAnswer) : [];
  const maxClicks = Math.max(1, hotspots.filter((hs) => normalizeBool(hs.isCorrect)).length || 1);
  const media = String(question.image || question.video || '').trim();

  function handleClick(event: MouseEvent<HTMLImageElement>) {
    const img = imgRef.current;
    if (!img || !hotspots.length) return;

    const rect = img.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const idx = findHotspotIndex(hotspots, x, y);
    if (idx === -1) return;

    const hs = hotspots[idx];
    const selectedIdx = selected.findIndex((point) => pointInsideBox(point, hs));
    if (selectedIdx !== -1) {
      onAnswer(selected.filter((_, i) => i !== selectedIdx));
      return;
    }

    if (selected.length >= maxClicks) return;
    onAnswer([...selected, [x, y]]);
  }

  if (!media) {
    return <div className="empty-note">Câu hotspot này chưa có hình ảnh.</div>;
  }

  return (
    <div>
      <div className="hint">Nhấp/chạm đúng {maxClicks} vị trí trên hình ảnh.</div>
      <div className="hotspot-wrap">
        <img ref={imgRef} src={media} alt="Hotspot" className="hotspot-img" onClick={handleClick} draggable={false} />
        {hotspots.map((hs, idx) => (
          <div
            key={idx}
            className="hotspot-box"
            style={{
              left: `${toNum(hs.x)}%`,
              top: `${toNum(hs.y)}%`,
              width: `${toNum(hs.w)}%`,
              height: `${toNum(hs.h)}%`,
            }}
          />
        ))}
        {selected.map(([x, y], idx) => (
          <div key={`${x}-${y}-${idx}`} className="hotspot-dot" style={{ left: `${x}%`, top: `${y}%` }}>
            {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
