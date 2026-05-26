import { RichContent } from '../components/RichContent';

interface Props {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  multi?: boolean;
  onClick: () => void;
}

export function OptionButton({ value, selected = false, disabled = false, multi = false, onClick }: Props) {
  return (
    <button
      type="button"
      className={`option-btn ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`option-indicator ${multi ? 'square' : 'circle'}`}>{selected && multi ? '✓' : ''}</span>
      <RichContent value={value} className="option-content" />
      <span className="option-spacer" />
    </button>
  );
}
