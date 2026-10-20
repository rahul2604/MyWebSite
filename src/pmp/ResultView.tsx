import { useState, type ReactNode } from 'react';
import type { Result } from './api';

export function ResultView({ title, result, actions }: { title: string; result: Result; actions?: ReactNode }) {
  const [filter, setFilter] = useState<'all' | 'wrong'>(result.passed ? 'all' : 'wrong');
  const shown = filter === 'wrong' ? result.results.filter((r) => !r.isCorrect) : result.results;

  return (
    <div className="pmp-page">
      <div className={`pmp-card pmp-score ${result.passed ? 'is-pass' : 'is-fail'}`} role="status" aria-live="polite">
        <span className="eyebrow">{title.toUpperCase()}</span>
        <p className="pmp-score-num display">{result.percent}%</p>
        <p className="pmp-score-line">
          {result.score} of {result.total} correct · {result.passed ? 'Passed' : 'Not passed yet'} (pass mark 80%)
        </p>
        <div className="pmp-result-actions">{actions}</div>
      </div>

      <div className="pmp-review-head">
        <h3 className="pmp-section-title">Review your answers</h3>
        <div className="pmp-tabs pmp-tabs-small" role="tablist" aria-label="Filter questions">
          <button type="button" role="tab" aria-selected={filter === 'wrong'} className={filter === 'wrong' ? 'is-on' : ''} onClick={() => setFilter('wrong')}>
            Incorrect ({result.results.filter((r) => !r.isCorrect).length})
          </button>
          <button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'is-on' : ''} onClick={() => setFilter('all')}>
            All ({result.total})
          </button>
        </div>
      </div>

      {shown.length === 0 && <p className="pmp-muted">Every answer was correct.</p>}
      <ol className="pmp-review-list">
        {shown.map((r) => (
          <li key={r.id} className={`pmp-card pmp-review-item ${r.isCorrect ? 'is-right' : 'is-wrong'}`}>
            <p className="pmp-q-stem">
              <span className="pmp-q-num">
                Question {r.number} · {r.isCorrect ? 'Correct' : r.chosen === null ? 'Not answered' : 'Incorrect'}
              </span>
              {r.stem}
            </p>
            <ul className="pmp-review-options">
              {r.options.map((o, i) => (
                <li key={i} className={i === r.correct ? 'is-correct' : i === r.chosen ? 'is-chosen-wrong' : ''}>
                  <span className="pmp-option-letter">{'ABCD'[i]}</span>
                  <span>{o}</span>
                  {i === r.correct && <span className="pmp-tag">Correct answer</span>}
                  {i === r.chosen && i !== r.correct && <span className="pmp-tag">Your answer</span>}
                </li>
              ))}
            </ul>
            <p className="pmp-explain">{r.explanation}</p>
            <p className="pmp-muted pmp-small">Source: {r.ref}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
