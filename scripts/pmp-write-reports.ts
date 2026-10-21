/*
 * Writes the five curriculum reports in docs/pmp-curriculum from the real artifacts:
 *   page-processing-manifest.json, source-index.json, topic-catalogue.json, checkpoint.json,
 *   batches/*.json, topic-coverage-matrix.json, content-stats.json and the course content.
 *
 * Run after `node scripts/pmp-content-report.ts` (which refreshes the coverage matrix and stats):
 *   node scripts/pmp-write-reports.ts
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { EXAMS, MODULES } from '../server/pmp/course.ts';
import { SOURCE_MAP } from '../server/pmp/sourceMap.ts';
import { PASS_MARK } from '../server/pmp/types.ts';

const DOCS = new URL('../docs/pmp-curriculum/', import.meta.url);
const read = (f: string) => JSON.parse(readFileSync(new URL(f, DOCS), 'utf8'));
const write = (f: string, text: string) => writeFileSync(new URL(f, DOCS), text.trimEnd() + '\n');

const manifest = read('page-processing-manifest.json');
const pages: any[] = manifest.pages;
const sourceIndex = read('source-index.json');
const checkpoint = read('checkpoint.json');
const catalogueRaw = read('topic-catalogue.json');
const catalogue: Record<string, { title: string; module: string; process?: string; section?: string }> = catalogueRaw.topics ?? catalogueRaw;
const matrix = read('topic-coverage-matrix.json');
const stats = read('content-stats.json');
const processMap = read('process-map.json');
const batches = readdirSync(new URL('batches/', DOCS)).filter((f) => /^B\d+\.json$/.test(f)).sort();
const today = new Date().toISOString().slice(0, 10);

const count = <T,>(items: T[], key: (t: T) => string) =>
  items.reduce<Record<string, number>>((acc, t) => ((acc[key(t)] = (acc[key(t)] ?? 0) + 1), acc), {});
const table = (head: string[], rows: (string | number)[][]) =>
  [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.map((c) => String(c).replace(/\|/g, '/')).join(' | ')} |`)].join('\n');
const hours = (min: number) => `${Math.round((min / 60) * 10) / 10} h`;

/* ---------- validation of the manifest (do not assume completeness) ---------- */
const expected = Number(manifest.totalPdfPages ?? 976);
const present = new Set(pages.map((p) => p.pdfPage));
const missing = Array.from({ length: expected }, (_, i) => i + 1).filter((n) => !present.has(n));
const dupes = pages.length - present.size;
const dispositionClass = (d?: string) => {
  const v = (d ?? 'content').toLowerCase();
  const classes: [string, string][] = [
    ['index', 'index'], ['blank', 'blank'], ['contributor', 'contributor list'], ['bibliograph', 'bibliography'], ['references', 'references'],
    ['navigation', 'navigation'], ['cover', 'cover'], ['title page', 'title page'], ['copyright', 'copyright'], ['legal', 'legal notice'], ['part divider', 'part divider'],
  ];
  for (const [k, label] of classes) if (v.includes(k)) return label;
  return v === 'content' ? 'content' : 'other';
};
const byDisp = count(pages, (p) => dispositionClass(p.disposition));
const contentPages = pages.filter((p) => dispositionClass(p.disposition) === 'content');
const contentNoTopic = contentPages.filter((p) => !p.topics?.length);
const notVerified = pages.filter((p) => p.verificationStatus !== 'Verified complete');
const notExtracted = pages.filter((p) => p.extractionStatus !== 'Extracted');
const notAnalysed = pages.filter((p) => p.analysisStatus !== 'Analysed');
const visualRequired = pages.filter((p) => p.visualInspection === 'Required');
const withIssues = pages.filter((p) => p.issues?.length);
const visualDone = pages.filter((p) => String(p.visualInspection ?? '').startsWith('Done'));
const rendered = pages.filter((p) => /render/i.test(String(p.visualInspection ?? '')));
const visualHeavy = pages.filter((p) => p.pageType === 'visual-heavy');
const indexPages = pages.filter((p) => dispositionClass(p.disposition) === 'index');
const mappedToCurriculum = pages.filter((p) => p.curriculumMapping === 'Mapped to curriculum');
const withTopics = pages.filter((p) => p.topics?.length);
const reprocess = pages.filter((p) => /reprocess/i.test(String(p.verificationStatus)));
const byBook = count(pages, (p) => p.book);
const validationProblems = [
  missing.length ? `${missing.length} pages missing from the manifest` : '',
  dupes ? `${dupes} duplicate page records` : '',
  notExtracted.length ? `${notExtracted.length} pages not extracted` : '',
  notAnalysed.length ? `${notAnalysed.length} pages not analysed` : '',
  notVerified.length ? `${notVerified.length} pages not verified` : '',
  visualRequired.length ? `${visualRequired.length} pages still need visual inspection` : '',
  withIssues.length ? `${withIssues.length} pages with recorded issues` : '',
  contentNoTopic.length ? `${contentNoTopic.length} content pages without a topic` : '',
].filter(Boolean);

/* ---------- content figures ---------- */
const allLessons = MODULES.flatMap((m) => m.lessons);
const totalMinutes = allLessons.reduce((n, l) => n + l.minutes, 0);
const topicRows: any[] = matrix.topics;
const processRows: any[] = matrix.processes;
const unassessed = topicRows.filter((t) => t.assessed !== 'yes');
const examById = Object.fromEntries(EXAMS.map((e) => [e.id, e]));

/* Source inconsistencies recorded while reading the PDF, and how the course handles each. */
const SOURCE_NOTES: [string, string, string][] = [
  ['PMBOK 6 §6.4 / §7.2.2.5', 'The beta (PERT) formula is stated only in Estimate Costs, not in Estimate Activity Durations.', 'Lesson 6.3 presents beta for durations and cites §7.2.2.5.'],
  ['PMBOK 6 Figure 6-22', 'Control Schedule tools are numbered .1-.4 then .6-.7 (no .5).', 'Recorded; the tool list is taught from the text and Figure 6-1.'],
  ['PMBOK 6 Table 7-1', 'The "how used" text for SPI repeats cost wording.', 'Lesson 7.3 defines SPI in schedule terms and notes the slip.'],
  ['PMBOK 6 §7 Trends (earned schedule)', 'Wording says "if the amount of earned schedule is greater than 0".', 'Lesson 7.1 states the comparison as ES - AT > 0.'],
  ['PMBOK 6 Figure 11-15', 'Decision tree result labelled "EMV (before costs)" although costs are already netted.', 'Lesson 11.3 uses an original example with costs netted and flags the label.'],
  ['PMBOK 6 Figures 11-16 / 11-17', 'Plan Risk Responses lists project team assignments as an input in the ITTO figure but resource breakdown structure in the data-flow figure.', 'Course follows the ITTO figure, text and Standard §3.22.2.'],
  ['PMBOK 6 Figure 11-1', 'Process labels for 11.3 and 11.4 are displaced in the extracted text of the overview chart.', 'Blocks mapped by content and cross-checked against Figures 11-8 and 11-11.'],
  ['PMBOK 6 Figure 12-5', 'Conduct Procurements data flow omits 5.2 and 11.2 as recipients of agreements, which their own figures show.', 'Lesson 12.2 notes agreements feed both.'],
  ['PMBOK 6 §10.1', 'The communication channels formula n(n-1)/2 is not stated in this edition.', 'Taught as a supplementary calculation, clearly labelled.'],
  ['PMBOK 6 §1.2.6.4', 'Financial measures (NPV, IRR, BCR, payback) are named without formulas.', 'Lesson 1.5 gives only directional rules, labelled as general finance knowledge.'],
  ['PMBOK 6 Glossary', 'Apportioned effort is mentioned as an EVM activity type but not defined.', 'Lesson 16.3 notes the gap.'],
  ['PMBOK 6 Glossary acronyms', 'RBS is listed as risk breakdown structure while the body also uses resource breakdown structure.', 'Lessons always spell out which RBS is meant.'],
  ['PMBOK 6 Part 2 Figure 3-1', 'Plan Stakeholder Engagement is labelled "Plan Stakeholder Management".', 'Course uses the Sixth Edition process name.'],
  ['PMBOK 6 Appendix X4.1', 'Says "benefits realization plan" where Section 4 says "benefits management plan"; one bullet is truncated.', 'Lesson 16.2 notes they are the same document.'],
  ['PMBOK 6 Appendix X6', 'Several index cells do not match the per-process ITTO figures.', 'Tool-to-process mappings come from the chapter figures; X6 used only for groupings and counts.'],
  ['APG §5.2 (iteration planning)', 'Refers to a "Section 4.10" for estimation examples that does not exist.', 'Lesson 17.4 points to §5.4 instead.'],
  ['APG §5.4', 'Response time (§5.4.1) and reaction time (TIP, PDF 874) describe similar measures with different names.', 'Lesson 17.5 gives both names.'],
  ['APG Annex A3, Figure A3-3', 'Crystal Red\'s team-size axis label reads "5-100" (likely 50-100).', 'Lessons avoid quoting that figure.'],
  ['APG Glossary', 'Scrum team defined with a "process owner"; Annex A3.2 says product owner.', 'Course follows Annex A3.2.'],
  ['APG Glossary', 'Hybrid approach defined as having "a non-agile end result".', 'Lessons describe hybrid as a combination of approaches without that clause.'],
];

/* ======================= curriculum-outline.md ======================= */
{
  const lines: string[] = [];
  lines.push('# PMP course curriculum outline', '');
  lines.push(`Generated ${today} by \`scripts/pmp-write-reports.ts\` from the course content in \`server/pmp/content/\` and the source artifacts in this folder. Figures are computed, not typed.`, '');
  lines.push('## At a glance', '');
  lines.push(
    table(
      ['Item', 'Value'],
      [
        ['Modules', MODULES.length],
        ['Lessons', allLessons.length],
        ['Estimated study time (lessons only)', `${hours(totalMinutes)} (${totalMinutes} minutes)`],
        ['Module knowledge checks', `${MODULES.length} (${stats.knowledgeCheckQuestions} questions)`],
        ['Mock tests', EXAMS.filter((e) => e.id.startsWith('mock')).map((e) => `${e.title}: ${e.questions.length} questions, ${e.minutes} min`).join('; ')],
        ['Final assessment', `${examById.final.questions.length} questions, ${examById.final.minutes} min`],
        ['Pass mark (all assessments)', `${PASS_MARK * 100}%`],
        ['Source topics taught', `${stats.topicsTaught} of ${stats.topicsInCatalogue}`],
        ['PMBOK processes taught', `${stats.processesTaught} of 49`],
      ],
    ),
    '',
  );
  lines.push('## Sequence and unlock rules', '');
  lines.push(
    '1. Module 0 is open on sign-up. Lessons open one at a time, in order.',
    '2. A module\'s knowledge check opens when all of its lessons are complete.',
    `3. Scoring at least ${PASS_MARK * 100}% on a knowledge check opens the next module (retakes are unlimited).`,
    '4. Mock Test 1 opens when every knowledge check is passed; Mock Test 2 opens when Mock Test 1 is submitted (any score).',
    '5. The final assessment opens when Mock Test 2 is submitted. A failed final can be retaken after 24 hours.',
    `6. Passing the final (${PASS_MARK * 100}%+) makes the learner eligible for the course certificate.`,
    '',
    'All of these rules are enforced by the server (`server/pmp/engine.ts` and `server/pmp/router.ts`), not only in the interface. The design has no lesson-level quizzes; each module ends with one knowledge check.',
    '',
  );
  lines.push('## Modules', '');
  for (const m of MODULES) {
    const minutes = m.lessons.reduce((n, l) => n + l.minutes, 0);
    lines.push(`### Module ${m.number}: ${m.title}`, '');
    lines.push(`${m.summary}`, '');
    lines.push(`Study time ${hours(minutes)} · ${m.lessons.length} lessons · knowledge check ${m.quiz.length} questions.`, '');
    for (const l of m.lessons) {
      const refs = l.topics
        .map((t) => SOURCE_MAP[t])
        .filter(Boolean)
        .map((s) => `${s.book} ${s.section.split(' (')[0]}${s.printed ? `, pp. ${s.printed}` : ''} (PDF ${s.pdf})`);
      lines.push(`**${l.title}** (${l.minutes} min, \`${l.id}\`)`, '');
      for (const o of l.objectives) lines.push(`- ${o}`);
      lines.push('', `Source topics: ${l.topics.map((t) => `\`${t}\``).join(', ')}`, '');
      lines.push(`Sources: ${[...new Set(refs)].join('; ')}`, '');
    }
  }
  lines.push('## Exams', '');
  for (const e of EXAMS) {
    const byModule = count(e.questions, (q) => catalogue[q.topic]?.module ?? 'unknown');
    lines.push(`### ${e.title}`, '', `${e.summary} ${e.questions.length} questions, ${e.minutes} minutes, pass ${PASS_MARK * 100}%.`, '');
    lines.push(`Questions by module of the assessed topic: ${Object.entries(byModule).sort().map(([k, v]) => `${k} ${v}`).join(', ')}.`, '');
  }
  write('curriculum-outline.md', lines.join('\n'));
}

/* ======================= source-review-report.md ======================= */
{
  const batchRows = batches.map((f) => {
    const b = JSON.parse(readFileSync(new URL(`batches/${f}`, DOCS), 'utf8'));
    return [b.batch ?? f.replace('.json', ''), `${b.range?.[0]}-${b.range?.[1]}`, Object.keys(b.pages ?? {}).length, Object.keys(b.topics ?? {}).length];
  });
  const lines: string[] = [];
  lines.push('# Source review report', '');
  lines.push(`Generated ${today} by \`scripts/pmp-write-reports.ts\` from \`page-processing-manifest.json\`, \`checkpoint.json\` and \`batches/\`.`, '');
  lines.push('## Scope', '');
  lines.push(`Source: ${manifest.source ?? 'PMBOK Guide Sixth Edition PDF'}.`, '');
  lines.push(`The supplied PDF has **${expected} pages**: ${Object.entries(byBook).map(([k, v]) => `${v} for ${k}`).join(' and ')}. The PDF itself and the extracted text are kept outside the repository (they are copyrighted); only analysis artifacts are committed.`, '');
  lines.push('## Method', '');
  lines.push(
    '1. **Extraction.** Text was extracted page by page with PyMuPDF into one file per page, with page statistics (words, vector drawings, raster images) to flag visual-heavy pages.',
    '2. **Sequential reading.** Pages were read in order in batches. Each batch file in `batches/` records every page in its range with the topics it supports, a disposition for pages without curriculum content, and visual-inspection notes.',
    '3. **Merge with checks.** `merge_batch.py` refused any batch that skipped a page in its range, then updated the manifest, topic catalogue and checkpoint.',
    '4. **Visual inspection.** Tables and figures whose meaning depends on layout (arrows, cell positions, chart values) were rendered to images and inspected. Others were judged from extracted labels where the arrangement was unambiguous.',
    '5. **Cross-checks.** Inputs and outputs for every process in Part 2 (the Standard) were compared item by item with the Part 1 ITTO figures (`ittos.json`); all matched. The 49-process map was verified against rendered Table 1-4.',
    '',
  );
  lines.push('## Manifest validation', '');
  lines.push(
    table(
      ['Check', 'Result'],
      [
        ['Pages expected', expected],
        ['Page records in manifest', pages.length],
        ['Missing page numbers', missing.length ? missing.join(', ') : 'none'],
        ['Duplicate records', dupes],
        ['Extracted', `${pages.length - notExtracted.length}/${pages.length}`],
        ['Analysed', `${pages.length - notAnalysed.length}/${pages.length}`],
        ['Verification status "Verified complete"', `${pages.length - notVerified.length}/${pages.length}`],
        ['Pages flagged "Requires reprocessing"', reprocess.length],
        ['Pages with recorded issues', withIssues.length],
        ['Visual inspection still required', visualRequired.length],
        ['Content pages without a curriculum topic', contentNoTopic.length],
        ['Last verified PDF page (checkpoint)', checkpoint.lastVerifiedPdfPage ?? 'n/a'],
        ['Batches merged', `${(checkpoint.batches ?? []).length} (files: ${batches.length})`],
      ],
    ),
    '',
  );
  lines.push(validationProblems.length ? `**Validation problems found:** ${validationProblems.join('; ')}.` : '**Result:** every page from 1 to ' + expected + ' has exactly one record, and every record is extracted, analysed and marked verified, with no open issues or pending visual checks.', '');
  lines.push('## Page dispositions', '');
  lines.push(table(['Disposition', 'Pages'], Object.entries(byDisp).sort((a, b) => b[1] - a[1])), '');
  lines.push(
    `Pages without curriculum content (${pages.length - (byDisp.content ?? 0)}) are covers, legal and copyright pages, tables of contents and lists of figures ("navigation"), blank pages, part dividers, contributor lists, references, bibliographies and indexes.`,
    '',
  );
  lines.push('## Visual inspection', '');
  lines.push(
    table(
      ['Measure', 'Pages'],
      [
        ['Pages classified visual-heavy by page statistics', visualHeavy.length],
        ['Pages with a completed visual check', visualDone.length],
        ['... of which rendered to an image and inspected', rendered.length],
        ['... of which judged from extracted labels', visualDone.length - rendered.length],
        ['Pages where a visual check was not required', pages.filter((p) => String(p.visualInspection ?? '').startsWith('Not required')).length],
        ['Pages still requiring a visual check', visualRequired.length],
      ],
    ),
    '',
  );
  lines.push('## What "verified" means here, and its limits', '');
  lines.push(
    '- "Verified complete" means the page\'s extracted text was read, its content mapped to catalogue topics (or given a disposition), and any layout-dependent figure checked as above. It is an AI-assisted review recorded in the batch files; it is **not** an independent review by a human subject-matter expert.',
    `- The ${indexPages.length} index pages were profiled programmatically (first and last entries, page-reference counts) and spot-read, not read line by line, because they contain only page references.`,
    '- Contributor and reviewer lists were excluded as acknowledgements with no educational content.',
    '- Lesson text is original and was written from the topic notes; lessons have not yet been reviewed by a human PMP instructor. The admin panel supports that review (edit, draft, publish, audit).',
    '',
  );
  lines.push('## Source inconsistencies found and how they are handled', '');
  lines.push(table(['Location', 'Issue', 'Handling'], SOURCE_NOTES), '');
  lines.push('## Batches', '');
  lines.push(table(['Batch', 'PDF pages', 'Page records', 'Topics added'], batchRows), '');
  lines.push('## Source index', '');
  lines.push(`\`source-index.json\` lists ${sourceIndex.counts.sections} sections, ${sourceIndex.counts.figuresTables} figures and tables, ${sourceIndex.counts.topics} topics and ${sourceIndex.counts.processes} processes with their PDF page locations.`, '');
  write('source-review-report.md', lines.join('\n'));
}

/* ======================= assessment-coverage-report.md ======================= */
{
  const lines: string[] = [];
  const kcRows = MODULES.map((m) => {
    const topics = new Set(m.lessons.flatMap((l) => l.topics));
    const covered = new Set(m.quiz.map((q) => q.topic).filter((t) => topics.has(t)));
    return [`${m.number}. ${m.title}`, m.quiz.length, `${covered.size}/${topics.size}`];
  });
  const procRows = processRows.map((p) => [p.id, p.name, p.processGroup, p.knowledgeArea, p.lessons.length, p.questions]);
  const examTopicSpread = EXAMS.map((e) => {
    const mods = count(e.questions, (q) => catalogue[q.topic]?.module ?? '?');
    return [e.title, e.questions.length, e.minutes, Object.keys(mods).length, new Set(e.questions.map((q) => q.topic)).size];
  });
  const stemOverlap = (() => {
    const a = new Set(examById['mock-1'].questions.map((q) => q.stem));
    const b = examById['mock-2'].questions.filter((q) => a.has(q.stem)).length;
    const f = examById.final.questions.filter((q) => a.has(q.stem) || examById['mock-2'].questions.some((x) => x.stem === q.stem)).length;
    return { b, f };
  })();
  lines.push('# Assessment coverage report', '');
  lines.push(`Generated ${today} by \`scripts/pmp-write-reports.ts\` from the course content and \`topic-coverage-matrix.json\`.`, '');
  lines.push('## Structure', '');
  lines.push(
    table(
      ['Assessment', 'Count', 'Questions', 'Time', 'Pass mark'],
      [
        ['Module knowledge checks', MODULES.length, stats.knowledgeCheckQuestions, 'untimed', `${PASS_MARK * 100}%`],
        ...EXAMS.map((e) => [e.title, 1, e.questions.length, `${e.minutes} min`, `${PASS_MARK * 100}%`]),
        ['**Total**', '', stats.totalQuestions, '', ''],
      ],
    ),
    '',
  );
  lines.push(
    'All questions are four-option multiple choice with one correct answer, an explanation and a source reference. Lesson-level quizzes are not part of this design.',
    '',
    '**Scoring is server-side.** Answer keys are never sent to the browser before submission; options are shuffled per attempt (and question order per exam attempt), and the stored layout is used to mark the attempt. Unanswered questions score zero. Timed exams have a 2-minute grace period; later submissions are rejected and the attempt does not count.',
    '',
  );
  lines.push('## Knowledge checks by module', '');
  lines.push(table(['Module', 'Questions', 'Module topics assessed in its own check'], kcRows), '');
  lines.push('Topics not assessed in a module\'s own check are, where applicable, assessed in the mock tests or final (see the topic table below).', '');
  lines.push('## Mock tests and final', '');
  lines.push(table(['Exam', 'Questions', 'Minutes', 'Modules represented', 'Distinct topics'], examTopicSpread), '');
  lines.push(`Distinctness: Mock Test 2 shares ${stemOverlap.b} question stems with Mock Test 1; the final shares ${stemOverlap.f} with either mock (checked by \`scripts/pmp-content-report.ts\`, which fails on any duplicate stem across the whole bank).`, '');
  lines.push('## Topic coverage', '');
  lines.push(
    table(
      ['Measure', 'Value'],
      [
        ['Topics in the source catalogue', stats.topicsInCatalogue],
        ['Topics taught by at least one lesson', stats.topicsTaught],
        ['Topics assessed by at least one question', stats.topicsAssessed],
        ['Topics deliberately not assessed', unassessed.map((t) => `\`${t.topic}\``).join(', ') || 'none'],
      ],
    ),
    '',
  );
  lines.push(
    'The topics not assessed carry no examinable content: the Part 1 reference list, the Agile Practice Guide\'s call to action, and the Annex A2 table mapping manifesto values to guide sections (the values and principles themselves are assessed under `a-manifesto-mindset`).',
    '',
  );
  lines.push('## Process coverage (all 49 PMBOK processes)', '');
  lines.push(table(['ID', 'Process', 'Process Group', 'Knowledge Area', 'Lessons', 'Questions'], procRows), '');
  lines.push('## Known gaps and limits', '');
  lines.push(
    '- Difficulty levels are not tagged per question; the bank mixes recall, application and calculation items, but no difficulty field exists yet.',
    '- Questions were written and checked by an AI author against the source notes. They have not yet been reviewed by a human PMP instructor or statistically calibrated against real exam performance.',
    '- The course is based on the 2017 PMBOK Guide Sixth Edition and Agile Practice Guide. The current PMP exam content outline draws on a wider reference list; learners are told to check it.',
    '- Retakes reuse the same questions (with shuffled options), so repeated attempts can reward memorisation.',
    '',
  );
  write('assessment-coverage-report.md', lines.join('\n'));
}

/* ======================= completion-report.md ======================= */
{
  const lines: string[] = [];
  lines.push('# Completion report: source processing and curriculum', '');
  lines.push(`Generated ${today} by \`scripts/pmp-write-reports.ts\`. Every number below is computed from the saved manifest, index, coverage matrix and course content at generation time.`, '');
  lines.push('## Source processing', '');
  lines.push(
    table(
      ['Measure', 'Value'],
      [
        ['Total PDF pages represented by the source', expected],
        ['Page records in the manifest', `${pages.length} (${missing.length} missing, ${dupes} duplicates)`],
        ['Pages extracted', pages.length - notExtracted.length],
        ['Pages analysed', pages.length - notAnalysed.length],
        ['Pages verified complete', pages.length - notVerified.length],
        ['Content pages mapped to curriculum topics', `${mappedToCurriculum.length} of ${contentPages.length} content pages`],
        ['All pages carrying at least one topic', `${withTopics.length} (includes navigation pages tagged with the publication-structure topic)`],
        ['Pages with no curriculum content (by disposition)', pages.length - contentPages.length],
        ['Unresolved pages', notVerified.length + visualRequired.length + withIssues.length],
        ['Pages requiring reprocessing', reprocess.length],
        ['Pages visually inspected', `${visualDone.length} (${rendered.length} rendered as images)`],
        ['Batches', batches.length],
      ],
    ),
    '',
  );
  lines.push(validationProblems.length ? `**Not complete:** ${validationProblems.join('; ')}.` : '**Status: complete.** The manifest was validated record by record (see `source-review-report.md`): no missing or duplicate pages, nothing unextracted, unanalysed, unverified, flagged for reprocessing or awaiting visual inspection, and every content page maps to at least one topic.', '');
  lines.push('## Topics and processes', '');
  lines.push(
    table(
      ['Measure', 'Value'],
      [
        ['Topics identified (catalogue)', Object.keys(catalogue).length],
        ['Topics taught', stats.topicsTaught],
        ['Topics assessed', stats.topicsAssessed],
        ['Coverage gaps (topics neither taught nor assessed)', topicRows.filter((t) => !t.lessons.length && t.assessed !== 'yes').length],
        ['Topics taught but not assessed (by design)', unassessed.length],
        ['PMBOK processes in the process map', processMap.processes.length],
        ['Processes taught / assessed', `${stats.processesTaught} / ${stats.processesAssessed}`],
        ['Source index entries', `${sourceIndex.counts.sections} sections, ${sourceIndex.counts.figuresTables} figures and tables`],
      ],
    ),
    '',
  );
  lines.push('## Curriculum built', '');
  lines.push(
    table(
      ['Measure', 'Value'],
      [
        ['Modules', stats.modules],
        ['Lessons', stats.lessons],
        ['Lesson words', stats.lessonWords],
        ['Estimated study time', hours(stats.lessonMinutes)],
        ['Knowledge-check questions', stats.knowledgeCheckQuestions],
        ['Mock Test 1 / Mock Test 2 / final questions', `${stats.mock1Questions} / ${stats.mock2Questions} / ${stats.finalQuestions}`],
        ['Total questions', stats.totalQuestions],
      ],
    ),
    '',
  );
  lines.push('## Outstanding', '');
  lines.push(
    '- Human expert review of lessons and questions (supported by the admin panel; not yet done).',
    '- Question difficulty tagging and item statistics from real learner attempts.',
    '- Re-run `node scripts/pmp-content-report.ts`, `node scripts/pmp-build-source-stats.ts` and this script after any content change so these figures stay current. Published admin edits live in D1 and are not reflected here; this report describes the authored content.',
    '',
  );
  write('completion-report.md', lines.join('\n'));
}

/* ======================= six-phase-handover-report.md ======================= */
{
  const lines: string[] = [];
  lines.push('# Six-phase handover report', '');
  lines.push(`Generated ${today} by \`scripts/pmp-write-reports.ts\`; narrative maintained in that script.`, '');
  lines.push(
    'The six phases come from the original build brief for the PMP learning platform: (1) project audit and complete source processing, (2) curriculum and assessment construction, (3) learning interface, (4) backend and progression, (5) validation, (6) handover. The administrator panel, role separation and production-readiness work were added in a follow-up brief and are reported under phases 4-6.',
    '',
  );
  const phase = (n: number, title: string, objective: string, status: string, deliverables: string[], evidence: string[], outstanding: string[], next: string[]) => {
    lines.push(`## Phase ${n}: ${title}`, '', `**Objective.** ${objective}`, '', `**Status.** ${status}`, '', '**Deliverables**', '', ...deliverables.map((d) => `- ${d}`), '', '**Validation evidence**', '', ...evidence.map((d) => `- ${d}`), '');
    lines.push('**Outstanding issues**', '', ...(outstanding.length ? outstanding.map((d) => `- ${d}`) : ['- None known.']), '', '**Next actions**', '', ...(next.length ? next.map((d) => `- ${d}`) : ['- None.']), '');
  };
  phase(
    1,
    'Project audit and complete source processing',
    'Audit the existing site, then process every page of the supplied PMBOK Guide Sixth Edition PDF (with the bundled Standard and Agile Practice Guide) into traceable artifacts.',
    validationProblems.length ? 'Incomplete.' : 'Complete.',
    [
      `\`page-processing-manifest.json\`: ${pages.length} page records`,
      `\`topic-catalogue.json\` (${Object.keys(catalogue).length} topics), \`process-map.json\` (49 processes), \`ittos.json\``,
      `\`source-index.json\` (${sourceIndex.counts.sections} sections, ${sourceIndex.counts.figuresTables} figures and tables)`,
      `\`batches/\` (${batches.length} batch files) and \`checkpoint.json\``,
    ],
    [
      `Manifest validated: ${expected} expected pages, ${missing.length} missing, ${notVerified.length} unverified, ${visualRequired.length} awaiting visual inspection, ${withIssues.length} with issues.`,
      `${rendered.length} layout-dependent pages rendered and inspected; Standard inputs/outputs cross-checked against all 49 ITTO sets.`,
    ],
    ['Review is AI-assisted, not an independent human SME review (see source-review-report.md).'],
    [],
  );
  phase(
    2,
    'Curriculum and assessment construction',
    'Write original lessons with source references covering all 49 processes, and build knowledge checks, two mock tests and a final assessment.',
    'Complete for authored content; human expert review outstanding.',
    [
      `${stats.modules} modules, ${stats.lessons} lessons (${hours(stats.lessonMinutes)}) in \`server/pmp/content/\``,
      `${stats.totalQuestions} questions: ${stats.knowledgeCheckQuestions} in knowledge checks, ${stats.mock1Questions} + ${stats.mock2Questions} in mocks, ${stats.finalQuestions} in the final`,
      '`curriculum-outline.md`, `assessment-coverage-report.md`, `topic-coverage-matrix.json`, `content-stats.json`',
    ],
    [`\`node scripts/pmp-content-report.ts\` passes: unique ids and stems, 4 distinct options, valid answers and topics, 8-15 questions per check, ${stats.topicsTaught}/${stats.topicsInCatalogue} topics taught, ${stats.processesAssessed}/49 processes assessed.`],
    ['No difficulty tagging; no human PMP-instructor review yet.'],
    ['Review lessons and questions in the admin panel; publish corrections as needed.'],
  );
  phase(
    3,
    'Learning interface',
    'Replace the #pmp prototype with a learner platform: entry and sign-in, dashboard, two-column layout with sidebar and mobile drawer, lessons, timed assessments, results review, certificate and public verification.',
    'Complete.',
    ['`src/pmp/` (learner UI), `src/admin/` (administrator panel), mobile hero portrait fix in `src/styles.css`'],
    ['Checked in the browser on desktop and phone widths, light and dark themes; client bundle verified to contain no questions or answer keys.'],
    ['Social sign-in and password reset are not implemented.'],
    [],
  );
  phase(
    4,
    'Backend and progression',
    'Server-side accounts, sessions, progress in D1, sequential unlocking, server-side scoring, certificates; then an administrator role with full inspection access that cannot alter learner records.',
    'Complete.',
    [
      '`server/pmp/` (auth, store, engine, router, admin, content overrides, certificate PDF) and `functions/api/pmp/[[path]].ts`',
      'D1 tables `pmp_users`, `pmp_sessions`, `pmp_lesson_progress`, `pmp_attempts`, `pmp_certificates`, `pmp_content_overrides`, `pmp_audit`, created and migrated additively at runtime',
      'Admin bootstrap through `PMP_ADMIN_BOOTSTRAP_PASSWORD` with a forced password change; role stored only in D1 and checked on every request',
    ],
    ['`tests/pmp.test.ts` and `tests/pmp-admin.test.ts` cover locking by URL and API, scoring, timing, certificates, bootstrap, role separation, preview without records, drafts and publishing, and schema migration.'],
    ['Passwords use PBKDF2-SHA-256 with 100,000 iterations (the Workers maximum) rather than Argon2id or bcrypt; see README.'],
    [],
  );
  phase(
    5,
    'Validation',
    'Run tests, typecheck and production build; check behaviour in the browser; review for secrets.',
    'Complete locally; production not verified (not deployed).',
    ['Test suite, typecheck and build results are recorded in the pull request description.'],
    ['`npm run typecheck`, `npm test`, `npm run build`, `node scripts/pmp-content-report.ts`, and browser checks on the local Pages server.'],
    ['Nothing has been verified in production.'],
    ['After approval: deploy a preview, repeat the browser checks there, then promote.'],
  );
  phase(
    6,
    'Handover',
    'Document setup, configuration and operation; propose the pull request; list what the owner must do.',
    'Complete pending owner approval.',
    ['README section "PMP learning platform", `.dev.vars.example`, the five reports in this folder'],
    ['Reports generated from the artifacts by this script.'],
    [
      'Production D1 binding and secrets must be set in the Cloudflare dashboard by the owner.',
      'The production admin account must be bootstrapped with a strong one-time secret (not the local temporary password) and the password changed on first sign-in.',
    ],
    ['Approve the pull request, configure bindings and secrets, deploy, verify, then remove `PMP_ADMIN_BOOTSTRAP_PASSWORD`.'],
  );
  write('six-phase-handover-report.md', lines.join('\n'));
}

console.log('wrote 5 reports');
