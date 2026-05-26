import type { MatrixAnswer } from '../types/answer';
import type { Question } from '../types/question';
import { RichText } from '../components/RichText';

interface Props {
  question: Question;
  answer: unknown;
  onAnswer: (answer: MatrixAnswer) => void;
}

export function MatrixQuestion({ question, answer, onAnswer }: Props) {
  const headers = question.headers || [];
  const rows = question.rows || [];
  const current = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer as MatrixAnswer : {};

  function setRow(rowIndex: number, header: string) {
    onAnswer({ ...current, [`row_${rowIndex}`]: header });
  }

  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th aria-label="Nội dung" />
            {headers.map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.text}-${rowIndex}`}>
              <td className="matrix-row-text"><RichText value={row.text} /></td>
              {headers.map((header) => (
                <td key={`${rowIndex}-${header}`}>
                  <label className="matrix-radio">
                    <input
                      type="radio"
                      name={`row-${rowIndex}`}
                      checked={current[`row_${rowIndex}`] === header}
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
