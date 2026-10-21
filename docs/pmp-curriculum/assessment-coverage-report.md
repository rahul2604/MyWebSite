# Assessment coverage report

Generated 2026-10-21 by `scripts/pmp-write-reports.ts` from the course content and `topic-coverage-matrix.json`.

## Structure

| Assessment | Count | Questions | Time | Pass mark |
|---|---|---|---|---|
| Module knowledge checks | 18 | 230 | untimed | 80% |
| Mock Test 1 | 1 | 100 | 120 min | 80% |
| Mock Test 2 | 1 | 100 | 120 min | 80% |
| Final assessment | 1 | 81 | 110 min | 80% |
| **Total** |  | 511 |  |  |

All questions are four-option multiple choice with one correct answer, an explanation and a source reference. Lesson-level quizzes are not part of this design.

**Scoring is server-side.** Answer keys are never sent to the browser before submission; options are shuffled per attempt (and question order per exam attempt), and the stored layout is used to mark the attempt. Unanswered questions score zero. Timed exams have a 2-minute grace period; later submissions are rejected and the attempt does not count.

## Knowledge checks by module

| Module | Questions | Module topics assessed in its own check |
|---|---|---|
| 0. Orientation | 8 | 1/2 |
| 1. Project management foundations | 15 | 12/22 |
| 2. The environment in which projects operate | 12 | 8/8 |
| 3. The role of the project manager | 12 | 7/8 |
| 4. Project Integration Management | 15 | 10/12 |
| 5. Project Scope Management | 14 | 8/9 |
| 6. Project Schedule Management | 15 | 8/10 |
| 7. Project Cost Management | 15 | 5/6 |
| 8. Project Quality Management | 14 | 4/4 |
| 9. Project Resource Management | 14 | 7/7 |
| 10. Project Communications Management | 12 | 5/6 |
| 11. Project Risk Management | 15 | 8/11 |
| 12. Project Procurement Management | 13 | 4/5 |
| 13. Project Stakeholder Management | 12 | 7/7 |
| 14. The Standard for Project Management | 8 | 4/4 |
| 15. The five Process Groups end to end | 11 | 6/9 |
| 16. Appendices and glossary revision | 10 | 7/9 |
| 17. Agile Practice Guide | 15 | 11/21 |

Topics not assessed in a module's own check are, where applicable, assessed in the mock tests or final (see the topic table below).

## Mock tests and final

| Exam | Questions | Minutes | Modules represented | Distinct topics |
|---|---|---|---|---|
| Mock Test 1 | 100 | 120 | 17 | 74 |
| Mock Test 2 | 100 | 120 | 17 | 79 |
| Final assessment | 81 | 110 | 16 | 75 |

Distinctness: Mock Test 2 shares 0 question stems with Mock Test 1; the final shares 0 with either mock (checked by `scripts/pmp-content-report.ts`, which fails on any duplicate stem across the whole bank).

## Topic coverage

| Measure | Value |
|---|---|
| Topics in the source catalogue | 160 |
| Topics taught by at least one lesson | 160 |
| Topics assessed by at least one question | 157 |
| Topics deliberately not assessed | `a-call-to-action`, `a-manifesto-mapping`, `src-references-part1` |

The topics not assessed carry no examinable content: the Part 1 reference list, the Agile Practice Guide's call to action, and the Annex A2 table mapping manifesto values to guide sections (the values and principles themselves are assessed under `a-manifesto-mindset`).

## Process coverage (all 49 PMBOK processes)

| ID | Process | Process Group | Knowledge Area | Lessons | Questions |
|---|---|---|---|---|---|
| 4.1 | Develop Project Charter | Initiating | Integration | 1 | 6 |
| 4.2 | Develop Project Management Plan | Planning | Integration | 1 | 5 |
| 4.3 | Direct and Manage Project Work | Executing | Integration | 1 | 4 |
| 4.4 | Manage Project Knowledge | Executing | Integration | 1 | 4 |
| 4.5 | Monitor and Control Project Work | Monitoring and Controlling | Integration | 1 | 3 |
| 4.6 | Perform Integrated Change Control | Monitoring and Controlling | Integration | 1 | 9 |
| 4.7 | Close Project or Phase | Closing | Integration | 1 | 4 |
| 5.1 | Plan Scope Management | Planning | Scope | 1 | 2 |
| 5.2 | Collect Requirements | Planning | Scope | 1 | 10 |
| 5.3 | Define Scope | Planning | Scope | 1 | 4 |
| 5.4 | Create WBS | Planning | Scope | 1 | 7 |
| 5.5 | Validate Scope | Monitoring and Controlling | Scope | 1 | 5 |
| 5.6 | Control Scope | Monitoring and Controlling | Scope | 1 | 4 |
| 6.1 | Plan Schedule Management | Planning | Schedule | 1 | 1 |
| 6.2 | Define Activities | Planning | Schedule | 1 | 3 |
| 6.3 | Sequence Activities | Planning | Schedule | 1 | 7 |
| 6.4 | Estimate Activity Durations | Planning | Schedule | 1 | 8 |
| 6.5 | Develop Schedule | Planning | Schedule | 2 | 16 |
| 6.6 | Control Schedule | Monitoring and Controlling | Schedule | 1 | 4 |
| 7.1 | Plan Cost Management | Planning | Cost | 1 | 1 |
| 7.2 | Estimate Costs | Planning | Cost | 1 | 6 |
| 7.3 | Determine Budget | Planning | Cost | 1 | 7 |
| 7.4 | Control Costs | Monitoring and Controlling | Cost | 2 | 21 |
| 8.1 | Plan Quality Management | Planning | Quality | 1 | 8 |
| 8.2 | Manage Quality | Executing | Quality | 1 | 9 |
| 8.3 | Control Quality | Monitoring and Controlling | Quality | 1 | 9 |
| 9.1 | Plan Resource Management | Planning | Resource | 1 | 6 |
| 9.2 | Estimate Activity Resources | Planning | Resource | 1 | 2 |
| 9.3 | Acquire Resources | Executing | Resource | 1 | 4 |
| 9.4 | Develop Team | Executing | Resource | 1 | 7 |
| 9.5 | Manage Team | Executing | Resource | 1 | 8 |
| 9.6 | Control Resources | Monitoring and Controlling | Resource | 1 | 3 |
| 10.1 | Plan Communications Management | Planning | Communications | 1 | 12 |
| 10.2 | Manage Communications | Executing | Communications | 1 | 4 |
| 10.3 | Monitor Communications | Monitoring and Controlling | Communications | 1 | 5 |
| 11.1 | Plan Risk Management | Planning | Risk | 1 | 5 |
| 11.2 | Identify Risks | Planning | Risk | 1 | 6 |
| 11.3 | Perform Qualitative Risk Analysis | Planning | Risk | 1 | 5 |
| 11.4 | Perform Quantitative Risk Analysis | Planning | Risk | 1 | 7 |
| 11.5 | Plan Risk Responses | Planning | Risk | 1 | 10 |
| 11.6 | Implement Risk Responses | Executing | Risk | 1 | 1 |
| 11.7 | Monitor Risks | Monitoring and Controlling | Risk | 1 | 3 |
| 12.1 | Plan Procurement Management | Planning | Procurement | 1 | 16 |
| 12.2 | Conduct Procurements | Executing | Procurement | 1 | 5 |
| 12.3 | Control Procurements | Monitoring and Controlling | Procurement | 1 | 7 |
| 13.1 | Identify Stakeholders | Initiating | Stakeholder | 1 | 9 |
| 13.2 | Plan Stakeholder Engagement | Planning | Stakeholder | 1 | 6 |
| 13.3 | Manage Stakeholder Engagement | Executing | Stakeholder | 1 | 4 |
| 13.4 | Monitor Stakeholder Engagement | Monitoring and Controlling | Stakeholder | 1 | 4 |

## Known gaps and limits

- Difficulty levels are not tagged per question; the bank mixes recall, application and calculation items, but no difficulty field exists yet.
- Questions were written and checked by an AI author against the source notes. They have not yet been reviewed by a human PMP instructor or statistically calibrated against real exam performance.
- The course is based on the 2017 PMBOK Guide Sixth Edition and Agile Practice Guide. The current PMP exam content outline draws on a wider reference list; learners are told to check it.
- Retakes reuse the same questions (with shuffled options), so repeated attempts can reward memorisation.
