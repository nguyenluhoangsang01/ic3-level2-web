import { useMemo, useState } from 'react';
import { RichContent } from '../components/RichContent';

interface Props {
  choices: string[];
  target: string[];
  slotLabels: string[];
  leftValues?: string[];
  hint?: string;
  onChange: (target: string[]) => void;
}

export function SelectionSlots({ choices, target, slotLabels, leftValues, hint, onChange }: Props) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const used = useMemo(() => new Set(target.filter(Boolean)), [target]);

  function setSlot(index: number) {
    if (!selectedChoice) return;
    const next = [...target];
    for (let i = 0; i < next.length; i += 1) {
      if (next[i] === selectedChoice) next[i] = '';
    }
    next[index] = selectedChoice;
    onChange(next);
    setSelectedChoice(null);
  }

  function clearSlot(index: number) {
    const next = [...target];
    next[index] = '';
    onChange(next);
  }

  return (
    <div className="selection-layout">
      {hint ? <div className="hint">{hint}</div> : null}

      <div className="slot-board">
        {slotLabels.map((label, index) => (
          <div className="slot-row" key={`${label}-${index}`}>
            <div className="slot-label">
              <strong>{label}</strong>
              {leftValues?.[index] ? <RichContent value={leftValues[index]} /> : null}
            </div>
            <button type="button" className={`slot-box ${target[index] ? 'filled' : ''}`} onClick={() => setSlot(index)}>
              {target[index] ? <RichContent value={target[index]} /> : <span>Chọn đáp án rồi bấm vào đây</span>}
            </button>
            {target[index] ? (
              <button type="button" className="mini-btn" onClick={() => clearSlot(index)}>
                Xóa
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="palette-title">Danh sách lựa chọn</div>
      <div className="choice-palette">
        {choices.map((choice, idx) => {
          const disabled = used.has(choice);
          return (
            <button
              type="button"
              key={`${choice}-${idx}`}
              className={`choice-chip ${selectedChoice === choice ? 'active' : ''}`}
              disabled={disabled}
              onClick={() => setSelectedChoice(choice)}
            >
              <RichContent value={choice} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
