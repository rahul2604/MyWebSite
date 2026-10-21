import type { Module } from '../types.ts';

export const M00: Module = {
  id: 'M00',
  number: '0',
  title: 'Orientation',
  summary: 'How the course works, what the source books are, and how to study for a scenario-based exam.',
  lessons: [
    {
      id: 'm00-l1',
      title: 'How this course works',
      minutes: 10,
      topics: ['src-publication-structure'],
      objectives: [
        'Explain how lessons, knowledge checks, mock tests and the final assessment unlock in sequence',
        'Describe what the course certificate does and does not represent',
        'Plan a realistic weekly study rhythm',
      ],
      body: `## The learning path

The course has eighteen modules. Module 0 (this one) orients you; Modules 1-3 build the foundations; Modules 4-13 cover the ten Knowledge Areas and their 49 processes; Module 14 covers *The Standard for Project Management*; Module 15 revisits all five Process Groups; Module 16 covers the appendices and glossary; and Module 17 covers the *Agile Practice Guide*.

Everything unlocks in order:

1. Each lesson unlocks when you complete the one before it.
2. A module's knowledge check unlocks when you have completed all of that module's lessons.
3. The next module unlocks when you score at least **80%** on the knowledge check. You can retake a check as often as you need to.
4. Mock Test 1 unlocks after every module is passed. Mock Test 2 unlocks after you submit Mock Test 1.
5. The final assessment unlocks after you submit Mock Test 2. Passing it (80% or more) issues your course certificate.

Your progress is saved to your account on the server, so you can continue on any device. Scores are always calculated on the server; the answer key is never sent to your browser.

## How the lessons are written

The lessons are **original explanations**, written for this course. They follow the structure of the *PMBOK Guide* Sixth Edition and the *Agile Practice Guide*, and each lesson lists the sections it draws on so you can read the source alongside it. The lessons do not reproduce the books. Where the source is ambiguous or inconsistent, the lesson says so.

Each lesson has:

- **Objectives**: what you should be able to do afterwards.
- **Explanations and examples**: the ideas in plain language, with small worked examples.
- **Exam tips**: common traps in scenario questions.
- **Key terms**: short definitions you can revise from.

## About the certificate

The course certificate confirms that you completed this course and passed its final assessment. It has a verification page that anyone can check.

> **Important:** This course is independent. It is not affiliated with, endorsed by, or authorised by the Project Management Institute (PMI). The course certificate is **not** a PMI credential, does not make you a PMP, and is not a substitute for PMI's own application and examination process. "PMI", "PMP" and "PMBOK" are marks of the Project Management Institute, Inc.

## Studying effectively

- **Little and often.** Forty-five minutes a day, five days a week, beats one long weekend session.
- **Read the question first.** Scenario questions usually ask for the *best* or *next* action. Several options may be reasonable; one fits the situation and the process better than the others.
- **Learn the flow, not lists.** Know why a process exists, what it needs and what it produces, and where its outputs go. That is more useful than memorising every input.
- **Review your mistakes.** After each knowledge check, read the explanation for every question you missed and reread that part of the lesson.`,
      keyTerms: [
        { term: 'Knowledge check', def: 'A short multiple-choice quiz at the end of each module; 80% unlocks the next module.' },
        { term: 'Mock test', def: 'A longer practice exam covering the whole course, used to find weak areas before the final assessment.' },
        { term: 'Course certificate', def: 'Evidence of completing this course; not a PMI credential.' },
      ],
    },
    {
      id: 'm00-l2',
      title: 'The source books and how they fit together',
      minutes: 15,
      topics: ['src-publication-structure', 'src-references-part1'],
      objectives: [
        'Describe the three parts of the PMBOK Guide Sixth Edition',
        'Distinguish the Guide (Part 1) from the Standard (Part 2)',
        'Explain how the Agile Practice Guide relates to the PMBOK Guide',
      ],
      body: `## Three parts in one book

The *PMBOK Guide* Sixth Edition (published 2017) is really three things bound together:

| Part | What it contains | How it is organised |
|---|---|---|
| Part 1: *A Guide to the Project Management Body of Knowledge* | Chapters 1-3 on the environment and the project manager's role; Chapters 4-13 on the ten Knowledge Areas | By Knowledge Area |
| Part 2: *The Standard for Project Management* | The 49 processes described by their inputs and outputs | By Process Group |
| Part 3: Appendices, glossary and index | Edition changes, adaptive environments, summaries of key concepts, tailoring considerations, tools and techniques by group, and definitions | Reference material |

**Part 2 is the formal standard.** It is approved as an American National Standard (ANSI/PMI 99-001-2017), developed through a consensus process. Part 1 is a guide built on that standard and is explicitly *not* an American National Standard. Both are **descriptive, not prescriptive**: they describe generally recognised good practice, and nothing in them must be done on every project.

## Why there are two views of the same processes

Part 1 groups processes by Knowledge Area (for example, all six Schedule Management processes appear together). Part 2 groups the same processes by Process Group (for example, all Planning processes together). The processes are the same; only the grouping differs. You will study them first by Knowledge Area (Modules 4-13), then revisit them by Process Group (Module 15). Seeing both views helps with questions that ask "what happens next?"

## The Agile Practice Guide

The same volume includes the *Agile Practice Guide* (2017), written jointly by PMI and the Agile Alliance. It is a practical guide, not a standard. It covers the agile mindset, choosing a life cycle, servant leadership, team composition, common agile practices, measurement and organisational considerations, plus annexes that map agile to the PMBOK Knowledge Areas and summarise popular frameworks.

## A note on exam currency

These books were published in 2017. PMI periodically revises its exam content outline, and the current PMP exam draws on a wider reference list and puts more weight on agile and hybrid approaches. Use this course to build a solid foundation in the PMBOK 6 processes and agile practice. Check PMI's current exam content outline before you book an exam.

> **Exam tip:** When a question describes predictive work, think in terms of processes, plans and baselines. When it describes an agile team, think in terms of the agile mindset, servant leadership and short feedback cycles. Many questions describe hybrid situations, so be ready to use both.`,
      keyTerms: [
        { term: 'The Standard for Project Management', def: 'Part 2 of the volume; the ANSI-approved standard describing the processes by Process Group.' },
        { term: 'Descriptive (not prescriptive)', def: 'Describes good practice without requiring any element to be used on every project.' },
        { term: 'Agile Practice Guide', def: 'A joint PMI and Agile Alliance practice guide on agile and hybrid approaches, bundled with the PMBOK Guide Sixth Edition.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm00-q1',
      stem: 'Which part of the PMBOK Guide Sixth Edition volume is the ANSI-approved American National Standard?',
      options: ['Part 1, the Guide to the body of knowledge', 'Part 2, The Standard for Project Management', 'Part 3, the appendices and glossary', 'The Agile Practice Guide bundled with it'],
      answer: 1,
      explanation: 'Part 2 is The Standard for Project Management (ANSI/PMI 99-001-2017). Part 1 is a guide based on that standard and is explicitly not an American National Standard.',
      topic: 'src-publication-structure',
      ref: 'PMBOK 6 Part 1 and Part 2 dividers',
    },
    {
      id: 'm00-q2',
      stem: 'A colleague says the PMBOK Guide requires every project to perform all 49 processes. What is the best response?',
      options: ['That is correct for projects above a certain budget', 'That is correct, because Part 2 is a standard', 'The Guide is descriptive; the team selects and tailors the processes the project needs', 'Only the Planning processes are mandatory'],
      answer: 2,
      explanation: 'Both the Guide and the Standard describe generally recognised good practice. They are descriptive, not prescriptive: the team tailors which processes, inputs, tools and outputs to use.',
      topic: 'src-publication-structure',
      ref: 'PMBOK 6 §1.1; Part 2 §1',
    },
    {
      id: 'm00-q3',
      stem: 'How does Part 1 of the PMBOK Guide group the 49 processes?',
      options: ['By Process Group', 'By project phase', 'By Knowledge Area', 'Alphabetically'],
      answer: 2,
      explanation: 'Part 1 presents processes by Knowledge Area (Chapters 4-13). Part 2, the Standard, presents the same processes by Process Group.',
      topic: 'src-publication-structure',
      ref: 'PMBOK 6 Part 1 and Part 2 structure',
    },
    {
      id: 'm00-q4',
      stem: 'Which organisations jointly produced the Agile Practice Guide?',
      options: ['PMI and the Agile Alliance', 'PMI and the Scrum Alliance', 'PMI and ISO', 'The Agile Alliance alone'],
      answer: 0,
      explanation: 'The Agile Practice Guide was developed jointly by PMI and the Agile Alliance.',
      topic: 'src-publication-structure',
      ref: 'APG Preface',
    },
    {
      id: 'm00-q5',
      stem: 'In this course, what unlocks the next module?',
      options: ['Opening every lesson in the current module', 'Completing the lessons and scoring at least 80% on the module knowledge check', 'Waiting seven days after starting the module', 'Passing Mock Test 1'],
      answer: 1,
      explanation: 'Modules unlock in sequence. You must complete all lessons in a module and score at least 80% on its knowledge check before the next module opens.',
      topic: 'src-publication-structure',
      ref: 'Course rules (Lesson 0.1)',
    },
    {
      id: 'm00-q6',
      stem: 'What does this course certificate represent?',
      options: ['A PMI credential equivalent to the PMP', 'Completion of this course and its final assessment; it is not a PMI credential', 'Eligibility to sit the PMP exam without an application', '35 PMI-approved contact hours'],
      answer: 1,
      explanation: 'The course certificate confirms completion of this independent course. It is not a PMI credential and is not endorsed by PMI.',
      topic: 'src-publication-structure',
      ref: 'Course rules (Lesson 0.1)',
    },
    {
      id: 'm00-q7',
      stem: 'Which content is found in Part 3 of the PMBOK Guide Sixth Edition?',
      options: ['The ten Knowledge Area chapters', 'The Process Group descriptions of the Standard', 'Appendices such as tailoring considerations and tools grouped by purpose, plus the glossary', 'The Agile Manifesto principles mapped to sections'],
      answer: 2,
      explanation: 'Part 3 holds Appendices X1-X6, the glossary and the index. The Knowledge Areas are in Part 1, the Process Groups in Part 2, and the manifesto mapping is in the Agile Practice Guide.',
      topic: 'src-publication-structure',
      ref: 'PMBOK 6 Part 3',
    },
    {
      id: 'm00-q8',
      stem: 'A scenario question offers four reasonable actions. Which approach gives the best chance of choosing correctly?',
      options: ['Pick the longest option because it contains the most detail', 'Pick the option that escalates to the sponsor', 'Identify what the question asks (best, first or next) and the situation, then choose the option that fits the process and context', 'Pick the option that mentions a formal document'],
      answer: 2,
      explanation: 'Scenario questions reward reading precisely. Identify whether the question asks for the best, first or next action, recognise the process or mindset involved, and choose the option that fits.',
      topic: 'src-publication-structure',
      ref: 'Course guidance (Lesson 0.1)',
    },
  ],
};
