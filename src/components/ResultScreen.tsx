interface Props {
  correct: number;
  total: number;
  percent: number;
  onRestart: () => void;
  onReview: () => void;
}

export function ResultScreen({ correct, total, percent, onRestart, onReview }: Props) {
  return (
    <main className="result-screen">
      <section className="result-card">
        <div className="result-badge">Hoàn thành</div>
        <h1>Kết quả bài tổng hợp</h1>
        <p className="result-score">Bạn làm đúng <strong>{correct}</strong> / {total} câu</p>
        <p className="result-percent">Tỷ lệ đúng: {percent}%</p>
        <div className="result-actions">
          <button type="button" className="primary-btn" onClick={onReview}>Xem lại bài làm</button>
          <button type="button" className="outline-btn" onClick={onRestart}>Làm lại từ đầu</button>
        </div>
      </section>
    </main>
  );
}
