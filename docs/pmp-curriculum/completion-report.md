# Completion report: source processing and curriculum

Generated 2026-10-21 by `scripts/pmp-write-reports.ts`. Every number below is computed from the saved manifest, index, coverage matrix and course content at generation time.

## Source processing

| Measure | Value |
|---|---|
| Total PDF pages represented by the source | 976 |
| Page records in the manifest | 976 (0 missing, 0 duplicates) |
| Pages extracted | 976 |
| Pages analysed | 976 |
| Pages verified complete | 976 |
| Content pages mapped to curriculum topics | 834 of 834 content pages |
| All pages carrying at least one topic | 884 (includes navigation pages tagged with the publication-structure topic) |
| Pages with no curriculum content (by disposition) | 142 |
| Unresolved pages | 0 |
| Pages requiring reprocessing | 0 |
| Pages visually inspected | 196 (36 rendered as images) |
| Batches | 39 |

**Status: complete.** The manifest was validated record by record (see `source-review-report.md`): no missing or duplicate pages, nothing unextracted, unanalysed, unverified, flagged for reprocessing or awaiting visual inspection, and every content page maps to at least one topic.

## Topics and processes

| Measure | Value |
|---|---|
| Topics identified (catalogue) | 160 |
| Topics taught | 160 |
| Topics assessed | 157 |
| Coverage gaps (topics neither taught nor assessed) | 0 |
| Topics taught but not assessed (by design) | 3 |
| PMBOK processes in the process map | 49 |
| Processes taught / assessed | 49 / 49 |
| Source index entries | 209 sections, 265 figures and tables |

## Curriculum built

| Measure | Value |
|---|---|
| Modules | 18 |
| Lessons | 69 |
| Lesson words | 34965 |
| Estimated study time | 32.4 h |
| Knowledge-check questions | 230 |
| Mock Test 1 / Mock Test 2 / final questions | 100 / 100 / 81 |
| Total questions | 511 |

## Outstanding

- Human expert review of lessons and questions (supported by the admin panel; not yet done).
- Question difficulty tagging and item statistics from real learner attempts.
- Re-run `node scripts/pmp-content-report.ts`, `node scripts/pmp-build-source-stats.ts` and this script after any content change so these figures stay current. Published admin edits live in D1 and are not reflected here; this report describes the authored content.
