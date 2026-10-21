# Source review report

Generated 2026-10-21 by `scripts/pmp-write-reports.ts` from `page-processing-manifest.json`, `checkpoint.json` and `batches/`.

## Scope

Source: A Guide to the Project Management Body of Knowledge (PMBOK Guide), Sixth Edition, with The Standard for Project Management (ANSI/PMI 99-001-2017), bundled with the Agile Practice Guide (PMI, 2017).

The supplied PDF has **976 pages**: 793 for PMBOK and 183 for Agile Practice Guide. The PDF itself and the extracted text are kept outside the repository (they are copyrighted); only analysis artifacts are committed.

## Method

1. **Extraction.** Text was extracted page by page with PyMuPDF into one file per page, with page statistics (words, vector drawings, raster images) to flag visual-heavy pages.
2. **Sequential reading.** Pages were read in order in batches. Each batch file in `batches/` records every page in its range with the topics it supports, a disposition for pages without curriculum content, and visual-inspection notes.
3. **Merge with checks.** `merge_batch.py` refused any batch that skipped a page in its range, then updated the manifest, topic catalogue and checkpoint.
4. **Visual inspection.** Tables and figures whose meaning depends on layout (arrows, cell positions, chart values) were rendered to images and inspected. Others were judged from extracted labels where the arrangement was unambiguous.
5. **Cross-checks.** Inputs and outputs for every process in Part 2 (the Standard) were compared item by item with the Part 1 ITTO figures (`ittos.json`); all matched. The 49-process map was verified against rendered Table 1-4.

## Manifest validation

| Check | Result |
|---|---|
| Pages expected | 976 |
| Page records in manifest | 976 |
| Missing page numbers | none |
| Duplicate records | 0 |
| Extracted | 976/976 |
| Analysed | 976/976 |
| Verification status "Verified complete" | 976/976 |
| Pages flagged "Requires reprocessing" | 0 |
| Pages with recorded issues | 0 |
| Visual inspection still required | 0 |
| Content pages without a curriculum topic | 0 |
| Last verified PDF page (checkpoint) | 976 |
| Batches merged | 39 (files: 39) |

**Result:** every page from 1 to 976 has exactly one record, and every record is extracted, analysed and marked verified, with no open issues or pending visual checks.

## Page dispositions

| Disposition | Pages |
|---|---|
| content | 834 |
| index | 41 |
| navigation | 36 |
| blank | 26 |
| contributor list | 18 |
| bibliography | 8 |
| part divider | 3 |
| cover | 2 |
| title page | 2 |
| copyright | 2 |
| legal notice | 2 |
| references | 2 |

Pages without curriculum content (142) are covers, legal and copyright pages, tables of contents and lists of figures ("navigation"), blank pages, part dividers, contributor lists, references, bibliographies and indexes.

## Visual inspection

| Measure | Pages |
|---|---|
| Pages classified visual-heavy by page statistics | 55 |
| Pages with a completed visual check | 196 |
| ... of which rendered to an image and inspected | 36 |
| ... of which judged from extracted labels | 160 |
| Pages where a visual check was not required | 780 |
| Pages still requiring a visual check | 0 |

## What "verified" means here, and its limits

- "Verified complete" means the page's extracted text was read, its content mapped to catalogue topics (or given a disposition), and any layout-dependent figure checked as above. It is an AI-assisted review recorded in the batch files; it is **not** an independent review by a human subject-matter expert.
- The 41 index pages were profiled programmatically (first and last entries, page-reference counts) and spot-read, not read line by line, because they contain only page references.
- Contributor and reviewer lists were excluded as acknowledgements with no educational content.
- Lesson text is original and was written from the topic notes; lessons have not yet been reviewed by a human PMP instructor. The admin panel supports that review (edit, draft, publish, audit).

## Source inconsistencies found and how they are handled

| Location | Issue | Handling |
|---|---|---|
| PMBOK 6 §6.4 / §7.2.2.5 | The beta (PERT) formula is stated only in Estimate Costs, not in Estimate Activity Durations. | Lesson 6.3 presents beta for durations and cites §7.2.2.5. |
| PMBOK 6 Figure 6-22 | Control Schedule tools are numbered .1-.4 then .6-.7 (no .5). | Recorded; the tool list is taught from the text and Figure 6-1. |
| PMBOK 6 Table 7-1 | The "how used" text for SPI repeats cost wording. | Lesson 7.3 defines SPI in schedule terms and notes the slip. |
| PMBOK 6 §7 Trends (earned schedule) | Wording says "if the amount of earned schedule is greater than 0". | Lesson 7.1 states the comparison as ES - AT > 0. |
| PMBOK 6 Figure 11-15 | Decision tree result labelled "EMV (before costs)" although costs are already netted. | Lesson 11.3 uses an original example with costs netted and flags the label. |
| PMBOK 6 Figures 11-16 / 11-17 | Plan Risk Responses lists project team assignments as an input in the ITTO figure but resource breakdown structure in the data-flow figure. | Course follows the ITTO figure, text and Standard §3.22.2. |
| PMBOK 6 Figure 11-1 | Process labels for 11.3 and 11.4 are displaced in the extracted text of the overview chart. | Blocks mapped by content and cross-checked against Figures 11-8 and 11-11. |
| PMBOK 6 Figure 12-5 | Conduct Procurements data flow omits 5.2 and 11.2 as recipients of agreements, which their own figures show. | Lesson 12.2 notes agreements feed both. |
| PMBOK 6 §10.1 | The communication channels formula n(n-1)/2 is not stated in this edition. | Taught as a supplementary calculation, clearly labelled. |
| PMBOK 6 §1.2.6.4 | Financial measures (NPV, IRR, BCR, payback) are named without formulas. | Lesson 1.5 gives only directional rules, labelled as general finance knowledge. |
| PMBOK 6 Glossary | Apportioned effort is mentioned as an EVM activity type but not defined. | Lesson 16.3 notes the gap. |
| PMBOK 6 Glossary acronyms | RBS is listed as risk breakdown structure while the body also uses resource breakdown structure. | Lessons always spell out which RBS is meant. |
| PMBOK 6 Part 2 Figure 3-1 | Plan Stakeholder Engagement is labelled "Plan Stakeholder Management". | Course uses the Sixth Edition process name. |
| PMBOK 6 Appendix X4.1 | Says "benefits realization plan" where Section 4 says "benefits management plan"; one bullet is truncated. | Lesson 16.2 notes they are the same document. |
| PMBOK 6 Appendix X6 | Several index cells do not match the per-process ITTO figures. | Tool-to-process mappings come from the chapter figures; X6 used only for groupings and counts. |
| APG §5.2 (iteration planning) | Refers to a "Section 4.10" for estimation examples that does not exist. | Lesson 17.4 points to §5.4 instead. |
| APG §5.4 | Response time (§5.4.1) and reaction time (TIP, PDF 874) describe similar measures with different names. | Lesson 17.5 gives both names. |
| APG Annex A3, Figure A3-3 | Crystal Red's team-size axis label reads "5-100" (likely 50-100). | Lessons avoid quoting that figure. |
| APG Glossary | Scrum team defined with a "process owner"; Annex A3.2 says product owner. | Course follows Annex A3.2. |
| APG Glossary | Hybrid approach defined as having "a non-agile end result". | Lessons describe hybrid as a combination of approaches without that clause. |

## Batches

| Batch | PDF pages | Page records | Topics added |
|---|---|---|---|
| B01 | 1-37 | 37 | 1 |
| B02 | 38-62 | 25 | 19 |
| B03 | 63-88 | 26 | 14 |
| B04 | 89-111 | 23 | 8 |
| B05 | 112-134 | 23 | 6 |
| B06 | 135-157 | 23 | 3 |
| B07 | 158-181 | 24 | 4 |
| B08 | 182-205 | 24 | 5 |
| B09 | 206-229 | 24 | 5 |
| B10 | 230-252 | 23 | 4 |
| B11 | 253-276 | 24 | 4 |
| B12 | 277-300 | 24 | 3 |
| B13 | 301-324 | 24 | 3 |
| B14 | 325-348 | 24 | 3 |
| B15 | 349-372 | 24 | 3 |
| B16 | 373-396 | 24 | 4 |
| B17 | 397-420 | 24 | 3 |
| B18 | 421-444 | 24 | 4 |
| B19 | 445-468 | 24 | 4 |
| B20 | 469-492 | 24 | 4 |
| B21 | 493-516 | 24 | 3 |
| B22 | 517-540 | 24 | 4 |
| B23 | 541-564 | 24 | 4 |
| B24 | 565-590 | 26 | 6 |
| B25 | 591-616 | 26 | 4 |
| B26 | 617-645 | 29 | 2 |
| B27 | 646-675 | 30 | 3 |
| B28 | 676-700 | 25 | 1 |
| B29 | 701-724 | 24 | 4 |
| B30 | 725-740 | 16 | 3 |
| B31 | 741-760 | 20 | 1 |
| B32 | 761-794 | 34 | 1 |
| B33 | 795-815 | 21 | 2 |
| B34 | 816-840 | 25 | 4 |
| B35 | 841-866 | 26 | 3 |
| B36 | 867-892 | 26 | 4 |
| B37 | 893-920 | 28 | 5 |
| B38 | 921-950 | 30 | 2 |
| B39 | 951-976 | 26 | 1 |

## Source index

`source-index.json` lists 209 sections, 265 figures and tables, 160 topics and 49 processes with their PDF page locations.
