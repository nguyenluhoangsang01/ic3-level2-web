import { EXAM_TITLE } from "../config";

interface Props {
  current: number;
  total: number;
  answered: number;
  correct: number;
  onOpenNavigator: () => void;
}

export function ExamHeader({
  current,
  total,
  answered,
  correct,
  onOpenNavigator,
}: Props) {
  const progress = total ? Math.round((answered / total) * 100) : 0;

  return (
    <header className="exam-header">
      <div className="header-row">
        <div>
          <h1>{EXAM_TITLE}</h1>
          <p>Làm tổng hợp toàn bộ câu hỏi hiện có.</p>
        </div>
        <button type="button" className="outline-btn" onClick={onOpenNavigator}>
          Danh sách câu
        </button>
      </div>

      <div className="status-row">
        <span>
          Câu {current + 1}/{total}
        </span>
        <span>
          Đã làm {answered}/{total}
        </span>
        <span>
          Đúng {correct}/{total}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="progress-track" aria-label="Tiến độ làm bài">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
