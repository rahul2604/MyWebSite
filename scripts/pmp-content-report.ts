/*
 * Validates the PMP course content and writes the coverage artefacts:
 *   docs/pmp-curriculum/topic-coverage-matrix.json
 *   docs/pmp-curriculum/content-stats.json
 *
 * Run: node scripts/pmp-content-report.ts            (exits 1 if any check fails)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { EXAMS, MODULES } from '../server/pmp/course.ts';
import { SOURCE_MAP } from '../server/pmp/sourceMap.ts';
import type { Question } from '../server/pmp/types.ts';

const DOCS = new URL('../docs/pmp-curriculum/', import.meta.url);
const catalogueRaw = JSON.parse(readFileSync(new URL('topic-catalogue.json', DOCS), 'utf8'));
const catalogue: Record<string, { title: string; module: string; process?: string }> = catalogueRaw.topics ?? catalogueRaw;
const processMap: { processes: { id: string; name: string; ka: string; pg: string }[] } = JSON.parse(readFileSync(new URL('process-map.json', DOCS), 'utf8'));

const errors: string[] = [];
const warn: string[] = [];
const fail = (m: string) => errors.push(m);

/* ---------- structural checks ---------- */
const ids = new Set<string>();
const seen = (id: string) => {
  if (ids.has(id)) fail(`duplicate id ${id}`);
  ids.add(id);
};
const stems = new Map<string, string>();
function checkQuestion(qn: Question, where: string) {
  seen(qn.id);
  if (qn.options.length !== 4) fail(`${qn.id}: needs 4 options`);
  if (new Set(qn.options.map((o) => o.trim().toLowerCase())).size !== 4) fail(`${qn.id}: duplicate options`);
  if (![0, 1, 2, 3].includes(qn.answer)) fail(`${qn.id}: bad answer index`);
  if (!catalogue[qn.topic]) fail(`${qn.id}: unknown topic ${qn.topic}`);
  if (!qn.explanation || qn.explanation.length < 20) fail(`${qn.id}: explanation too short`);
  if (!qn.ref) fail(`${qn.id}: missing ref`);
  if (/all of the above|none of the above/i.test(qn.options.join('|'))) fail(`${qn.id}: "all/none of the above" breaks option shuffling`);
  const key = qn.stem.trim().toLowerCase();
  if (stems.has(key)) fail(`${qn.id}: same stem as ${stems.get(key)} (${where})`);
  stems.set(key, qn.id);
}

const lessonTopics = new Map<string, string[]>(); // topic -> lesson ids
let lessonCount = 0;
let lessonMinutes = 0;
let lessonWords = 0;
for (const mod of MODULES) {
  seen(mod.id);
  if (mod.lessons.length === 0) fail(`${mod.id}: no lessons`);
  if (mod.quiz.length < 8 || mod.quiz.length > 15) fail(`${mod.id}: knowledge check has ${mod.quiz.length} questions (need 8-15)`);
  for (const l of mod.lessons) {
    seen(l.id);
    lessonCount++;
    lessonMinutes += l.minutes;
    lessonWords += l.body.split(/\s+/).length;
    if (l.objectives.length === 0) fail(`${l.id}: no objectives`);
    for (const t of l.topics) {
      if (!catalogue[t]) fail(`${l.id}: unknown topic ${t}`);
      if (!SOURCE_MAP[t]) fail(`${l.id}: topic ${t} has no source reference`);
      lessonTopics.set(t, [...(lessonTopics.get(t) ?? []), l.id]);
    }
  }
  for (const qn of mod.quiz) checkQuestion(qn, mod.id);
}
for (const ex of EXAMS) {
  seen(ex.id);
  for (const qn of ex.questions) checkQuestion(qn, ex.id);
}
const mock1 = EXAMS.find((e) => e.id === 'mock-1')!;
const mock2 = EXAMS.find((e) => e.id === 'mock-2')!;
const final = EXAMS.find((e) => e.id === 'final')!;
if (mock1.questions.length < 90) fail(`mock-1 has ${mock1.questions.length} questions`);
if (mock2.questions.length < 90) fail(`mock-2 has ${mock2.questions.length} questions`);
if (final.questions.length < 50) fail(`final has ${final.questions.length} questions`);

/* ---------- coverage ---------- */
const qTopics = new Map<string, { kc: string[]; mock1: string[]; mock2: string[]; final: string[] }>();
const add = (t: string, k: 'kc' | 'mock1' | 'mock2' | 'final', id: string) => {
  const row = qTopics.get(t) ?? { kc: [], mock1: [], mock2: [], final: [] };
  row[k].push(id);
  qTopics.set(t, row);
};
for (const mod of MODULES) for (const qn of mod.quiz) add(qn.topic, 'kc', qn.id);
for (const qn of mock1.questions) add(qn.topic, 'mock1', qn.id);
for (const qn of mock2.questions) add(qn.topic, 'mock2', qn.id);
for (const qn of final.questions) add(qn.topic, 'final', qn.id);

// Topics that carry no examinable content (publication structure, citations, call to action) are taught but not assessed.
const NOT_ASSESSED = new Set(['src-references-part1', 'a-call-to-action', 'a-manifesto-mapping']);

const matrix = Object.entries(catalogue).map(([id, t]) => {
  const row = qTopics.get(id) ?? { kc: [], mock1: [], mock2: [], final: [] };
  const lessons = lessonTopics.get(id) ?? [];
  if (lessons.length === 0) fail(`topic ${id} is not covered by any lesson`);
  const assessed = row.kc.length + row.mock1.length + row.mock2.length + row.final.length;
  if (assessed === 0 && !NOT_ASSESSED.has(id)) warn.push(`topic ${id} has no questions`);
  return {
    topic: id,
    title: t.title,
    module: t.module,
    process: t.process ?? null,
    source: SOURCE_MAP[id] ?? null,
    lessons,
    knowledgeCheck: row.kc,
    mock1: row.mock1,
    mock2: row.mock2,
    final: row.final,
    assessed: assessed > 0 ? 'yes' : NOT_ASSESSED.has(id) ? 'not assessed (no examinable content)' : 'no',
  };
});

const processCoverage = processMap.processes.map((p) => {
  const topics = Object.entries(catalogue).filter(([, t]) => t.process === p.id).map(([id]) => id);
  const lessons = [...new Set(topics.flatMap((t) => lessonTopics.get(t) ?? []))];
  const questions = topics.reduce((n, t) => {
    const r = qTopics.get(t);
    return n + (r ? r.kc.length + r.mock1.length + r.mock2.length + r.final.length : 0);
  }, 0);
  if (lessons.length === 0) fail(`process ${p.id} ${p.name} has no lesson`);
  if (questions === 0) fail(`process ${p.id} ${p.name} has no questions`);
  return { id: p.id, name: p.name, processGroup: p.pg, knowledgeArea: p.ka, topics, lessons, questions };
});

/* ---------- stats ---------- */
const allQuestions = [...MODULES.flatMap((m) => m.quiz), ...EXAMS.flatMap((e) => e.questions)];
const answerDist = [0, 0, 0, 0];
for (const qn of allQuestions) answerDist[qn.answer]++;
const byModule = MODULES.map((m) => ({
  id: m.id,
  title: m.title,
  lessons: m.lessons.length,
  minutes: m.lessons.reduce((n, l) => n + l.minutes, 0),
  knowledgeCheckQuestions: m.quiz.length,
}));
const stats = {
  generated: new Date().toISOString().slice(0, 10),
  modules: MODULES.length,
  lessons: lessonCount,
  lessonMinutes,
  lessonWords,
  knowledgeCheckQuestions: MODULES.reduce((n, m) => n + m.quiz.length, 0),
  mock1Questions: mock1.questions.length,
  mock2Questions: mock2.questions.length,
  finalQuestions: final.questions.length,
  totalQuestions: allQuestions.length,
  answerKeyDistribution: { A: answerDist[0], B: answerDist[1], C: answerDist[2], D: answerDist[3], note: 'Option order is shuffled per attempt on the server, so authored positions are not what learners see.' },
  topicsInCatalogue: Object.keys(catalogue).length,
  topicsTaught: matrix.filter((r) => r.lessons.length > 0).length,
  topicsAssessed: matrix.filter((r) => r.assessed === 'yes').length,
  topicsNotAssessedByDesign: [...NOT_ASSESSED],
  processesTaught: processCoverage.filter((p) => p.lessons.length > 0).length,
  processesAssessed: processCoverage.filter((p) => p.questions > 0).length,
  byModule,
  warnings: warn,
};

writeFileSync(new URL('topic-coverage-matrix.json', DOCS), JSON.stringify({ note: 'Generated by scripts/pmp-content-report.ts. Each topic row lists the lessons that teach it and the questions that assess it.', topics: matrix, processes: processCoverage }, null, 1) + '\n');
writeFileSync(new URL('content-stats.json', DOCS), JSON.stringify(stats, null, 1) + '\n');

console.log(`modules ${stats.modules}, lessons ${stats.lessons} (${stats.lessonMinutes} min, ${stats.lessonWords} words)`);
console.log(`questions: KC ${stats.knowledgeCheckQuestions}, mock1 ${stats.mock1Questions}, mock2 ${stats.mock2Questions}, final ${stats.finalQuestions}, total ${stats.totalQuestions}`);
console.log(`topics taught ${stats.topicsTaught}/${stats.topicsInCatalogue}, assessed ${stats.topicsAssessed}; processes taught ${stats.processesTaught}/49, assessed ${stats.processesAssessed}/49`);
for (const w of warn) console.log('warning:', w);
if (errors.length) {
  for (const e of errors) console.error('ERROR:', e);
  process.exit(1);
}
console.log('content checks passed');
