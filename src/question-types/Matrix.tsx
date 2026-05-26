import type { MatrixAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { RichContent } from '../components/RichContent';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: MatrixAnswer) => void;
}

export function Matrix({ question, answer, onAnswer }: Props) {
  const headers = question.headers || [];
  const rows = question.rows || [];
  const current = typeof answer === 'object' && answer ? (answer as MatrixAnswer) : {};

  function setRow(rowIndex: number, header: string) {
    onAnswer({ ...current, [`row_${rowIndex}`]: header });
  }

  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Nội dung</th>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.text}-${rowIndex}`}>
              <td className="matrix-row-text"><RichContent value={row.text || ''} /></td>
              {headers.map((header) => (
                <td key={header}>
                  <label className="radio-cell">
                    <input
                      type="radio"
                      name={`row-${rowIndex}`}
                      checked={(current[`row_${rowIndex}`] || current[String(rowIndex)]) === header}
                      onChange={() => setRow(rowIndex, header)}
                    />
                    <span />
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
