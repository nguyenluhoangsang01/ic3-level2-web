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
          <p>Khi làm bài, tụi con nhớ đọc kỹ đề, đọc kỹ từng chữ.</p>
          <p>
            Thời gian là thi 50 phút. Không làm ẩu 1 lần rồi đi ra. Nhớ làm xong
            45 câu rồi thì mở lại từ câu 1 tiếp tục làm lại 3 đến 4 lần nữa.
          </p>
          <p>
            Nhớ coi ca thi của mình thi giờ nào (có nhiều ca thi khác nhau, mỗi
            bạn 1 ca thi).
          </p>
          <p>
            Đi thi nhớ đến sớm 30 phút và nhớ mang theo giấy tờ (Giấy khai sinh
            + Thẻ học sinh + Căn cước) đầy đủ.
          </p>
          <p>
            CHÚC TỤI CON LÀM BÀI THẬT TỐT NHA, BẠN NÀO CŨNG PHẢI 1000 ĐIỂM ĐÓ
          </p>
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
