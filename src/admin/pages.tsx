import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, adminApi, type Lesson } from '../pmp/api';
import { Markdown } from '../pmp/Markdown';
import { ahref } from './AdminApp';

/* Admin pages. All data comes from /api/pmp/admin/*, which checks the administrator role on every request. */

function useLoad<T>(path: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setError('');
    adminApi
      .get<T>(path)
      .then((d) => live && setData(d))
      .catch((e) => live && setError(e instanceof ApiError ? e.message : 'Could not load.'));
    return () => {
      live = false;
    };
  }, [path, tick, ...deps]);
  return { data, error, reload: () => setTick((t) => t + 1) };
}

function Loading({ error }: { error: string }) {
  return error ? (
    <p className="field-error" role="alert">
      {error}
    </p>
  ) : (
    <p className="pmp-status">Loading…</p>
  );
}

function Head({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="pmp-page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display">{title}</h2>
      {children}
    </header>
  );
}

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const learnerHref = (kind: 'lesson' | 'quiz' | 'exam', id: string) => (kind === 'lesson' ? `#pmp/lesson/${id}` : kind === 'quiz' ? `#pmp/check/${id}` : `#pmp/exam/${id}`);

function Stat({ n, label, note }: { n: ReactNode; label: string; note?: string }) {
  return (
    <div className="pmp-card pmp-stat">
      <span className="pmp-stat-num display">{n}</span>
      <span className="pmp-muted">{label}</span>
      {note && <span className="pmp-small pmp-muted">{note}</span>}
    </div>
  );
}

/* ================= Overview ================= */
export function Overview() {
  const { data, error } = useLoad<any>('overview');
  if (!data) return <Loading error={error} />;
  const c = data.curriculum;
  const s = data.source;
  const verified = s.verification['Verified complete'] ?? 0;
  return (
    <div className="pmp-page">
      <Head eyebrow="DASHBOARD" title="Course administration" />
      <h3 className="pmp-section-title">Curriculum</h3>
      <div className="pmp-stats">
        <Stat n={c.modules} label="modules" />
        <Stat n={c.lessons} label="lessons" note={`${Math.round(c.lessonMinutes / 60)} hours of study`} />
        <Stat n={c.knowledgeChecks} label="knowledge checks" note={`${c.knowledgeCheckQuestions} questions`} />
        <Stat n={c.mockTests.length} label="mock tests" note={c.mockTests.map((m: any) => `${m.questions} q`).join(' + ')} />
      </div>
      <div className="pmp-stats">
        <Stat n={c.final ? c.final.questions : '—'} label="final exam questions" note={c.final ? `${c.final.minutes} min, pass ${c.passMarkPercent}%` : 'Not configured'} />
        <Stat n={`${data.coverage.taught}/${data.coverage.topics}`} label="source topics taught" />
        <Stat n={`${data.coverage.assessed}/${data.coverage.topics}`} label="source topics assessed" note={data.coverage.unassessed.length ? `${data.coverage.unassessed.length} not assessed` : undefined} />
        <Stat n={data.learners.total} label="registered learners" note={`${data.learners.withCertificate} certificates issued`} />
      </div>
      <p className="pmp-muted pmp-small">{c.lessonsLabelledAs}</p>

      <h3 className="pmp-section-title">Source processing</h3>
      <div className="pmp-stats">
        <Stat n={`${s.manifestRecords}/${s.expectedPages}`} label="PDF pages in the manifest" note={s.missingPages.length ? `${s.missingPages.length} missing` : 'none missing'} />
        <Stat n={verified} label="pages verified complete" />
        <Stat n={s.visualInspection.done} label="pages visually inspected" note={`${s.visualInspection.renderedAndInspected} rendered and checked`} />
        <Stat n={s.unresolved.length} label="unresolved pages" note={`${s.pagesWithIssues} with recorded issues`} />
      </div>
      <div className="pmp-card">
        <p className="adm-kv">
          <strong>By book:</strong> {Object.entries(s.byBook).map(([k, v]) => `${k} ${v}`).join(' · ')}
        </p>
        <p className="adm-kv">
          <strong>Page dispositions:</strong> {Object.entries(s.byDisposition).map(([k, v]) => `${k} ${v}`).join(' · ')}
        </p>
        <p className="adm-kv">
          <strong>Source index:</strong> {Object.entries(s.index).map(([k, v]) => `${v} ${k === 'figuresTables' ? 'figures and tables' : k}`).join(' · ')}
        </p>
        <p className="adm-kv">
          <strong>Content pages without a topic:</strong> {s.contentPagesWithoutTopics.length || 'none'}
        </p>
      </div>

      <h3 className="pmp-section-title">Content needing attention</h3>
      <div className="pmp-card">
        {data.edits.drafts.length === 0 && data.coverage.unassessed.length === 0 && s.unresolved.length === 0 ? (
          <p>No unpublished drafts, no unresolved source pages, and every topic is assessed.</p>
        ) : (
          <ul className="adm-list">
            {data.edits.drafts.map((d: any) => (
              <li key={`${d.kind}-${d.id}`}>
                Unpublished {d.kind} draft: <a href={d.kind === 'lesson' ? ahref(`lesson/${d.id}`) : ahref('assessments')}>{d.id}</a> ({fmt(d.updated)})
              </li>
            ))}
            {data.coverage.unassessed.map((t: string) => (
              <li key={t}>
                Topic taught but not assessed: <a href={ahref('topics')}>{t}</a>
              </li>
            ))}
            {s.unresolved.map((p: any) => (
              <li key={p.pdfPage}>
                Unresolved PDF page {p.pdfPage}: {p.status}
              </li>
            ))}
          </ul>
        )}
        <p className="pmp-muted pmp-small">
          Published edits in effect: {data.edits.publishedLessonEdits} lessons, {data.edits.publishedQuestionEdits} questions.
        </p>
      </div>
    </div>
  );
}

/* ================= Modules ================= */
export function Modules() {
  const { data, error } = useLoad<any>('modules');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const modules = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data.modules;
    return data.modules.filter((m: any) => `${m.number} ${m.title} ${m.lessons.map((l: any) => l.title).join(' ')}`.toLowerCase().includes(needle));
  }, [data, q]);
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <Head eyebrow="MODULES" title="Modules and lessons">
        <p className="pmp-muted">Open any module, lesson or assessment regardless of progress. Editing creates a draft that learners do not see until you publish it.</p>
      </Head>
      <label className="sr-only" htmlFor="mod-search">
        Search modules and lessons
      </label>
      <input id="mod-search" className="field adm-search" placeholder="Search modules and lessons…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ol className="adm-mods">
        {modules.map((m: any) => {
          const isOpen = open === m.id || !!q;
          return (
            <li key={m.id} className="pmp-card adm-mod">
              <button type="button" className="adm-mod-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.id)}>
                <span className="pmp-module-num display">{m.number}</span>
                <span className="adm-mod-title">
                  <strong>{m.title}</strong>
                  <span className="pmp-muted pmp-small">
                    {m.lessons.length} lessons · {Math.round((m.minutes / 60) * 10) / 10} h · knowledge check {m.quiz.questions} q · {m.prerequisite ?? 'No prerequisite'}
                  </span>
                </span>
                <span className="pmp-pill is-completed">Published</span>
              </button>
              {isOpen && (
                <div className="adm-mod-body">
                  <p className="pmp-muted">{m.summary}</p>
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Lesson</th>
                        <th>Time</th>
                        <th>Edits</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.lessons.map((l: any) => (
                        <tr key={l.id}>
                          <td>
                            <strong>{l.title}</strong>
                            <ul className="adm-objectives">
                              {l.objectives.map((o: string) => (
                                <li key={o}>{o}</li>
                              ))}
                            </ul>
                          </td>
                          <td>{l.minutes} min</td>
                          <td>{l.edit.draft ? 'Draft pending' : l.edit.published ? 'Edited' : 'Original'}</td>
                          <td className="adm-actions">
                            <a href={ahref(`lesson/${l.id}`)}>Inspect / edit</a>
                            <a href={learnerHref('lesson', l.id)}>Learner view</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="btn-row">
                    <a className="btn btn-ghost btn-small" href={ahref(`assessment/${m.id}`)}>
                      Knowledge check questions and answers
                    </a>
                    <a className="btn btn-ghost btn-small" href={learnerHref('quiz', m.id)}>
                      Preview knowledge check as learner
                    </a>
                  </div>
                  <Sources sources={m.sources} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Sources({ sources }: { sources: { topic: string; title: string; book: string; section: string; printed: string; pdf: string }[] }) {
  return (
    <details className="adm-sources">
      <summary>Source topics and page references ({sources.length})</summary>
      <ul>
        {sources.map((s) => (
          <li key={s.topic}>
            <strong>{s.title}</strong> <span className="pmp-muted">({s.topic})</span>
            <br />
            {s.book}, {s.section}
            {s.printed ? ` · pp. ${s.printed}` : ''} · PDF {s.pdf}
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ================= Lesson editor ================= */
export function LessonEditor({ id }: { id: string }) {
  const { data, error, reload } = useLoad<any>(`lessons/${encodeURIComponent(id)}`);
  const [tab, setTab] = useState<'view' | 'edit' | 'draft'>('view');
  const [form, setForm] = useState<{ title: string; minutes: string; objectives: string; topics: string; keyTerms: string; body: string } | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    const src = { ...data.current, ...(data.draft ?? {}) };
    setForm({
      title: src.title,
      minutes: String(src.minutes),
      objectives: src.objectives.join('\n'),
      topics: src.topics.join(', '),
      keyTerms: (src.keyTerms ?? []).map((t: { term: string; def: string }) => `${t.term} :: ${t.def}`).join('\n'),
      body: src.body,
    });
  }, [data]);

  if (!data || !form) return <Loading error={error} />;

  const act = async (fn: () => Promise<unknown>, ok: string, after?: () => void) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: 'ok', text: ok });
      reload();
      after?.();
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof ApiError ? e.message : 'Something went wrong.' });
    } finally {
      setBusy(false);
    }
  };

  const saveDraft = () =>
    act(
      () =>
        adminApi.put(`lessons/${encodeURIComponent(id)}/draft`, {
          patch: {
            title: form.title,
            minutes: Number(form.minutes),
            objectives: form.objectives.split('\n').map((s) => s.trim()).filter(Boolean),
            topics: form.topics.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean),
            keyTerms: form.keyTerms
              .split('\n')
              .map((line) => line.split('::'))
              .filter((p) => p.length >= 2)
              .map(([term, ...def]) => ({ term: term.trim(), def: def.join('::').trim() })),
            body: form.body,
          },
        }),
      'Draft saved. Learners still see the published version.',
      () => setTab('draft'),
    );

  const lessonView = (l: Lesson) => (
    <div className="pmp-page pmp-lesson adm-preview">
      <h3 className="display adm-preview-title">{l.title}</h3>
      <p className="pmp-muted pmp-small">{l.minutes} min</p>
      <div className="pmp-card pmp-objectives">
        <h3>By the end of this lesson you can</h3>
        <ul>
          {l.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
      <div className="pmp-prose">
        <Markdown source={l.body} />
      </div>
      {l.keyTerms.length > 0 && (
        <div className="pmp-card pmp-terms">
          <h3>Key terms</h3>
          <dl>
            {l.keyTerms.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );

  return (
    <div className="pmp-page">
      <nav className="pmp-crumbs" aria-label="Breadcrumb">
        <a href={ahref('modules')}>Modules</a>
        <span aria-hidden="true">/</span>
        <span>
          Module {data.module.number}: {data.module.title}
        </span>
      </nav>
      <Head eyebrow={`LESSON ${id}`} title={data.current.title}>
        <p className="pmp-muted pmp-small">
          {data.edit.published ? `Published edit since ${fmt(data.edit.publishedAt)}` : 'Original authored content'}
          {data.edit.draft ? ` · draft saved ${fmt(data.edit.draftAt)}` : ''}
        </p>
      </Head>
      <div className="btn-row">
        <a className="btn btn-ghost btn-small" href={learnerHref('lesson', id)}>
          Open in learner view
        </a>
      </div>
      <div className="pmp-tabs pmp-tabs-small adm-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'view'} className={tab === 'view' ? 'is-on' : ''} onClick={() => setTab('view')}>
          Published
        </button>
        <button type="button" role="tab" aria-selected={tab === 'edit'} className={tab === 'edit' ? 'is-on' : ''} onClick={() => setTab('edit')}>
          Edit
        </button>
        <button type="button" role="tab" aria-selected={tab === 'draft'} className={tab === 'draft' ? 'is-on' : ''} onClick={() => setTab('draft')} disabled={!data.draftView}>
          Draft preview
        </button>
      </div>
      {msg && (
        <p className={msg.kind === 'ok' ? 'adm-ok' : 'field-error'} role="status">
          {msg.text}
        </p>
      )}

      {tab === 'view' && lessonView(data.learnerView)}
      {tab === 'draft' && data.draftView && (
        <>
          <p className="adm-banner">Draft preview: learners do not see this until you publish it.</p>
          {lessonView(data.draftView)}
        </>
      )}
      {tab === 'edit' && (
        <form
          className="form pmp-card"
          onSubmit={(e) => {
            e.preventDefault();
            void saveDraft();
          }}
        >
          <div className="field-group">
            <label htmlFor="le-title">Title</label>
            <input id="le-title" className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={160} />
          </div>
          <div className="field-group">
            <label htmlFor="le-min">Estimated minutes</label>
            <input id="le-min" className="field adm-short" type="number" min={1} max={240} value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} />
          </div>
          <div className="field-group">
            <label htmlFor="le-obj">Learning objectives (one per line)</label>
            <textarea id="le-obj" className="field adm-area" rows={5} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} />
          </div>
          <div className="field-group">
            <label htmlFor="le-topics">Source topic IDs (comma separated)</label>
            <input id="le-topics" className="field" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
            <span className="pmp-hint">Page references are derived from these topics in the verified source index; they cannot be typed by hand. See Source coverage for topic IDs.</span>
          </div>
          <div className="field-group">
            <label htmlFor="le-terms">Key terms (one per line: term :: definition)</label>
            <textarea id="le-terms" className="field adm-area" rows={5} value={form.keyTerms} onChange={(e) => setForm({ ...form, keyTerms: e.target.value })} />
          </div>
          <div className="field-group">
            <label htmlFor="le-body">Lesson content</label>
            <textarea id="le-body" className="field adm-area adm-body" rows={22} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <span className="pmp-hint">Supported formatting: ## and ### headings, - bullets, 1. numbered lists, | tables |, &gt; callouts, **bold**, *italic*. HTML is shown as text.</span>
          </div>
          <div className="btn-row">
            <button className="btn btn-blue btn-small" type="submit" disabled={busy}>
              Save draft
            </button>
          </div>
        </form>
      )}

      <div className="pmp-card adm-publish">
        <h3 className="adm-sub">Publication</h3>
        <div className="btn-row">
          <button className="btn btn-blue btn-small" type="button" disabled={busy || !data.edit.draft} onClick={() => void act(() => adminApi.post(`lessons/${encodeURIComponent(id)}/publish`), 'Published. Learners now see this version.')}>
            Publish draft
          </button>
          <button className="btn btn-ghost btn-small" type="button" disabled={busy || !data.edit.draft} onClick={() => void act(() => adminApi.post(`lessons/${encodeURIComponent(id)}/discard`), 'Draft discarded.')}>
            Discard draft
          </button>
          <button
            className="btn btn-ghost btn-small"
            type="button"
            disabled={busy || !data.edit.published}
            onClick={() => {
              if (window.confirm('Restore the original authored lesson? The published edit will be removed (it stays in the audit log).'))
                void act(() => adminApi.post(`lessons/${encodeURIComponent(id)}/revert`, { confirm: true }), 'Original content restored.');
            }}
          >
            Restore original
          </button>
        </div>
      </div>

      <Sources sources={data.sources} />
      <div className="pmp-card">
        <h3 className="adm-sub">Related knowledge-check questions</h3>
        {data.relatedQuestions.length ? (
          <ul className="adm-list">
            {data.relatedQuestions.map((q: any) => (
              <li key={q.id}>
                <a href={ahref(`assessment/${data.module.id}`)}>{q.id}</a>: {q.stem}
              </li>
            ))}
          </ul>
        ) : (
          <p className="pmp-muted">No questions in this module's knowledge check cite this lesson's topics (they may be assessed in the mock tests or final).</p>
        )}
      </div>
    </div>
  );
}

/* ================= Assessments ================= */
export function Assessments() {
  const { data, error } = useLoad<any>('assessments');
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <Head eyebrow="ASSESSMENTS" title="Knowledge checks, mock tests and final">
        <p className="pmp-muted">Pass mark {data.passMarkPercent}% everywhere. Lesson-level quizzes are not part of this course; each module ends with one knowledge check.</p>
      </Head>
      <div className="pmp-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Questions</th>
              <th>Time</th>
              <th>Unlock rule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assessments.map((a: any) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.title}</strong>
                  {a.module && <div className="pmp-muted pmp-small">{a.module}</div>}
                </td>
                <td>{a.questions}</td>
                <td>{a.minutes ? `${a.minutes} min` : 'Untimed'}</td>
                <td className="pmp-small">
                  {a.unlockRule} {a.consequence}
                </td>
                <td className="adm-actions">
                  <a href={ahref(`assessment/${a.id}`)}>Questions and answers</a>
                  <a href={learnerHref(a.kind === 'quiz' ? 'quiz' : 'exam', a.id)}>Preview as learner</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AssessmentDetail({ id }: { id: string }) {
  const { data, error, reload } = useLoad<any>(`assessments/${encodeURIComponent(id)}`);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const shown = useMemo(() => {
    if (!data) return [];
    const n = q.trim().toLowerCase();
    return n ? data.questions.filter((x: any) => `${x.id} ${x.stem} ${x.topic} ${x.topicTitle}`.toLowerCase().includes(n)) : data.questions;
  }, [data, q]);
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <nav className="pmp-crumbs" aria-label="Breadcrumb">
        <a href={ahref('assessments')}>Assessments</a>
      </nav>
      <Head eyebrow="ASSESSMENT" title={data.title}>
        <p className="pmp-muted">
          {data.questions.length} questions · {data.minutes ? `${data.minutes} minutes` : 'untimed'} · pass {data.passMarkPercent}%. {data.scoring}
        </p>
      </Head>
      <div className="btn-row">
        <a className="btn btn-ghost btn-small" href={learnerHref(data.kind === 'quiz' ? 'quiz' : 'exam', id)}>
          Preview as learner (not recorded)
        </a>
      </div>
      <input className="field adm-search" placeholder="Filter questions by text or topic…" aria-label="Filter questions" value={q} onChange={(e) => setQ(e.target.value)} />
      <ol className="pmp-review-list">
        {shown.map((x: any, i: number) =>
          editing === x.id ? (
            <QuestionEditor key={x.id} question={x} onClose={() => setEditing(null)} onSaved={reload} />
          ) : (
            <li key={x.id} className="pmp-card pmp-review-item">
              <p className="pmp-q-stem">
                <span className="pmp-q-num">
                  {i + 1}. {x.id} · {x.topicTitle} {x.edit.published ? '· edited' : ''} {x.edit.draft ? '· draft pending' : ''}
                </span>
                {x.stem}
              </p>
              <ul className="pmp-review-options">
                {x.options.map((o: string, k: number) => (
                  <li key={k} className={k === x.answer ? 'is-correct' : ''}>
                    <span className="pmp-option-letter">{'ABCD'[k]}</span>
                    <span>{o}</span>
                    {k === x.answer && <span className="pmp-tag">Correct answer</span>}
                  </li>
                ))}
              </ul>
              <p className="pmp-explain">{x.explanation}</p>
              <p className="pmp-muted pmp-small">
                Source: {x.ref} · topic {x.topic}
              </p>
              <div className="btn-row">
                <button className="btn btn-ghost btn-small" type="button" onClick={() => setEditing(x.id)}>
                  Edit
                </button>
              </div>
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

function QuestionEditor({ question, onClose, onSaved }: { question: any; onClose: () => void; onSaved: () => void }) {
  const src = { ...question, ...(question.draft ?? {}) };
  const [stem, setStem] = useState<string>(src.stem);
  const [options, setOptions] = useState<string[]>([...src.options]);
  const [answer, setAnswer] = useState<number>(src.answer);
  const [explanation, setExplanation] = useState<string>(src.explanation);
  const [ref, setRef] = useState<string>(src.ref);
  const [topic, setTopic] = useState<string>(src.topic);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ kind: 'ok', text: ok });
      onSaved();
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof ApiError ? e.message : 'Something went wrong.' });
    } finally {
      setBusy(false);
    }
  };
  const path = `questions/${encodeURIComponent(question.id)}`;
  return (
    <li className="pmp-card adm-qedit">
      <p className="pmp-q-num">Editing {question.id}</p>
      <div className="form">
        <div className="field-group">
          <label htmlFor={`qs-${question.id}`}>Question</label>
          <textarea id={`qs-${question.id}`} className="field adm-area" rows={3} value={stem} onChange={(e) => setStem(e.target.value)} />
        </div>
        <fieldset className="adm-opts">
          <legend>Options (select the correct answer)</legend>
          {options.map((o, k) => (
            <div key={k} className="adm-opt">
              <input type="radio" name={`ans-${question.id}`} checked={answer === k} onChange={() => setAnswer(k)} aria-label={`Option ${'ABCD'[k]} is correct`} />
              <span className="pmp-option-letter">{'ABCD'[k]}</span>
              <input className="field" value={o} aria-label={`Option ${'ABCD'[k]}`} onChange={(e) => setOptions(options.map((x, j) => (j === k ? e.target.value : x)))} />
            </div>
          ))}
        </fieldset>
        <div className="field-group">
          <label htmlFor={`qe-${question.id}`}>Explanation</label>
          <textarea id={`qe-${question.id}`} className="field adm-area" rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </div>
        <div className="adm-two">
          <div className="field-group">
            <label htmlFor={`qr-${question.id}`}>Source reference</label>
            <input id={`qr-${question.id}`} className="field" value={ref} onChange={(e) => setRef(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor={`qt-${question.id}`}>Topic ID</label>
            <input id={`qt-${question.id}`} className="field" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
        </div>
        {msg && (
          <p className={msg.kind === 'ok' ? 'adm-ok' : 'field-error'} role="status">
            {msg.text}
          </p>
        )}
        <div className="btn-row">
          <button className="btn btn-blue btn-small" type="button" disabled={busy} onClick={() => void run(() => adminApi.put(`${path}/draft`, { patch: { stem, options, answer, explanation, ref, topic } }), 'Draft saved. Learners still see the published version.')}>
            Save draft
          </button>
          <button className="btn btn-ghost btn-small" type="button" disabled={busy || (!question.edit.draft && msg?.kind !== 'ok')} onClick={() => void run(() => adminApi.post(`${path}/publish`), 'Published. New attempts are scored with this version.')}>
            Publish draft
          </button>
          <button className="btn btn-ghost btn-small" type="button" disabled={busy} onClick={() => void run(() => adminApi.post(`${path}/discard`), 'Draft discarded.')}>
            Discard draft
          </button>
          <button
            className="btn btn-ghost btn-small"
            type="button"
            disabled={busy || !question.edit.published}
            onClick={() => {
              if (window.confirm('Restore the original authored question?')) void run(() => adminApi.post(`${path}/revert`, { confirm: true }), 'Original question restored.');
            }}
          >
            Restore original
          </button>
          <button className="btn btn-ghost btn-small" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="pmp-muted pmp-small">Changing the correct answer affects how future submissions are scored; submitted attempts keep the score they were given.</p>
      </div>
    </li>
  );
}

/* ================= Topics / coverage ================= */
export function Topics() {
  const { data, error } = useLoad<any>('topics');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const rows = useMemo(() => {
    if (!data) return [];
    const n = q.trim().toLowerCase();
    return data.topics.filter((t: any) => (status === 'all' || t.status === status) && (!n || `${t.id} ${t.title} ${t.module}`.toLowerCase().includes(n)));
  }, [data, q, status]);
  if (!data) return <Loading error={error} />;
  const counts = data.topics.reduce((acc: Record<string, number>, t: any) => ((acc[t.status] = (acc[t.status] ?? 0) + 1), acc), {});
  return (
    <div className="pmp-page">
      <Head eyebrow="SOURCE COVERAGE" title="From source topic to lesson and question">
        <p className="pmp-muted">
          {data.topics.length} topics from the verified source catalogue. {Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · ')}. Unresolved pages: {data.unresolvedPages.length}.
        </p>
      </Head>
      <div className="adm-filters">
        <input className="field adm-search" placeholder="Search topics…" aria-label="Search topics" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field" aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="taught and assessed">Taught and assessed</option>
          <option value="taught, not assessed">Taught, not assessed</option>
          <option value="not taught">Not taught</option>
        </select>
      </div>
      <div className="pmp-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Source</th>
              <th>Lessons</th>
              <th>Questions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t: any) => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                  <div className="pmp-muted pmp-small">
                    {t.id} · {t.module}
                    {t.process ? ` · process ${t.process}` : ''}
                  </div>
                </td>
                <td className="pmp-small">{t.source ? `${t.source.section}${t.source.printed ? `, pp. ${t.source.printed}` : ''} (PDF ${t.source.pdf})` : '—'}</td>
                <td className="pmp-small">
                  {t.lessons.map((l: any) => (
                    <div key={l.id}>
                      <a href={ahref(`lesson/${l.id}`)}>
                        {l.module}: {l.title}
                      </a>
                    </div>
                  ))}
                </td>
                <td className="pmp-small">
                  {t.questions.total}
                  {t.questions.total > 0 && (
                    <div className="pmp-muted">
                      {Object.entries(t.questions.byAssessment)
                        .map(([a, v]) => `${a} ${v}`)
                        .join(', ')}
                    </div>
                  )}
                </td>
                <td className="pmp-small">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= Learners ================= */
export function Learners() {
  const { data, error } = useLoad<any>('learners');
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <Head eyebrow="LEARNERS" title="Registered learners">
        <p className="pmp-muted">Name, email and course progress only. Passwords are never stored in readable form and are not shown here.</p>
      </Head>
      {data.learners.length === 0 ? (
        <p className="pmp-muted">No learners have registered yet.</p>
      ) : (
        <div className="pmp-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Lessons</th>
                <th>Checks passed</th>
                <th>Mocks</th>
                <th>Final</th>
                <th>Certificate</th>
                <th>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {data.learners.map((l: any) => (
                <tr key={l.id}>
                  <td>
                    <a href={ahref(`learner/${l.id}`)}>{l.name}</a>
                    <div className="pmp-muted pmp-small">{l.email}</div>
                  </td>
                  <td>
                    {l.lessonsDone}/{data.lessonsTotal}
                  </td>
                  <td>
                    {l.checksPassed}/{data.modulesTotal}
                  </td>
                  <td>{[l.mock1 ? 'M1 passed' : '', l.mock2 ? 'M2 passed' : ''].filter(Boolean).join(', ') || '—'}</td>
                  <td>{l.finalPassed ? 'Passed' : '—'}</td>
                  <td>{l.certificate ?? '—'}</td>
                  <td className="pmp-small">{fmt(l.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LearnerDetail({ id }: { id: string }) {
  const { data, error } = useLoad<any>(`learners/${encodeURIComponent(id)}`);
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <nav className="pmp-crumbs" aria-label="Breadcrumb">
        <a href={ahref('learners')}>Learners</a>
      </nav>
      <Head eyebrow="LEARNER" title={data.learner.name}>
        <p className="pmp-muted">
          {data.learner.email} · joined {fmt(data.learner.joined)} · {data.progress.percent}% complete
        </p>
      </Head>
      <div className="pmp-card">
        <p className="adm-kv">
          <strong>Certificate:</strong> {data.certificate ? `${data.certificate.code}, issued ${fmt(data.certificate.issued)}` : data.certificateEligible ? 'Eligible, not yet claimed' : 'Not eligible yet'}
        </p>
      </div>
      <div className="pmp-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Status</th>
              <th>Lessons</th>
              <th>Check best</th>
            </tr>
          </thead>
          <tbody>
            {data.modules.map((m: any) => (
              <tr key={m.id}>
                <td>
                  {m.number}. {m.title}
                </td>
                <td>{m.status}</td>
                <td>
                  {m.lessonsDone}/{m.lessons}
                </td>
                <td>{m.quizBest !== null ? `${m.quizBest}%${m.quizPassed ? ' (passed)' : ''}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="pmp-section-title">Attempts</h3>
      {data.attempts.length === 0 ? (
        <p className="pmp-muted">No assessment attempts yet.</p>
      ) : (
        <div className="pmp-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Status</th>
                <th>Started</th>
                <th>Submitted</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.attempts.map((a: any) => (
                <tr key={a.id}>
                  <td>{a.assessmentId}</td>
                  <td>{a.status}</td>
                  <td className="pmp-small">{fmt(a.started)}</td>
                  <td className="pmp-small">{fmt(a.submitted)}</td>
                  <td>{a.score !== null ? `${a.score}/${a.total}${a.passed ? ' passed' : ''}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= Audit ================= */
export function Audit() {
  const { data, error } = useLoad<any>('audit');
  if (!data) return <Loading error={error} />;
  return (
    <div className="pmp-page">
      <Head eyebrow="AUDIT LOG" title="Administrative actions">
        <p className="pmp-muted">Most recent 200 entries. Passwords and tokens are never recorded.</p>
      </Head>
      <div className="pmp-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Action</th>
              <th>Target</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((e: any) => (
              <tr key={e.id}>
                <td className="pmp-small">{fmt(e.at)}</td>
                <td className="pmp-small">{e.actor_email ?? '—'}</td>
                <td>{e.action}</td>
                <td className="pmp-small">{e.target ?? ''}</td>
                <td className="pmp-small">{e.detail ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= Certificate ================= */
export function CertificatePage() {
  return (
    <div className="pmp-page">
      <Head eyebrow="CERTIFICATE" title="Certificate template and verification" />
      <div className="pmp-card">
        <ul className="adm-list">
          <li>Issued only by the server, only to a learner whose final assessment attempt passed (80% or more). Admin accounts cannot issue certificates.</li>
          <li>One certificate per learner, with an unguessable ID such as PMP-7K2Q-9XMD-4TBA.</li>
          <li>The PDF shows the learner's registered name, course, issue date, final score, ID, verification link, and a statement that it is not a PMI credential.</li>
          <li>The public verification page (#pmp/verify/ID) shows name, course and issue date. It never shows the learner's email.</li>
          <li>Names outside the Latin-1 character set are transliterated on the PDF; the verification page shows the exact name.</li>
        </ul>
        <div className="btn-row">
          <a className="btn btn-blue btn-small" href={adminApi.sampleCertificateUrl} download>
            Download sample PDF
          </a>
          <a className="btn btn-ghost btn-small" href="#pmp/verify">
            Open verification page
          </a>
        </div>
        <p className="pmp-muted pmp-small">The sample uses placeholder data and is not stored or verifiable.</p>
      </div>
    </div>
  );
}
