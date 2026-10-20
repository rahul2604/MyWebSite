import type { Module } from '../types.ts';

export const M14: Module = {
  id: 'M14',
  number: '14',
  title: 'The Standard for Project Management',
  summary: 'Part 2 of the volume: the Standard\'s purpose, portfolios and programs, governance, project success, the life cycle curve, stakeholders, the PM\'s attributes and tailoring of artifacts.',
  lessons: [
    {
      id: 'm14-l1',
      title: 'What the Standard is; portfolios, programs, governance and success',
      minutes: 25,
      topics: ['std-intro-and-projects', 'std-ppp-governance-success'],
      objectives: [
        'Explain how the Standard relates to the Guide',
        'Describe organisational and project governance and the elements of a project governance framework',
        'Explain why business documents are neither project documents nor plan components',
      ],
      body: `## The Standard and the Guide

*The Standard for Project Management* (ANSI/PMI 99-001-2017) is the **foundation** on which the Guide is built. A standard is a document established by an authority, by custom or by general consent as a model or example. This one was developed through a process based on **consensus, openness, due process and balance**.

| The Standard (Part 2) | The Guide (Part 1) |
|---|---|
| Describes the processes by **Process Group** | Describes the same processes by **Knowledge Area** |
| Lists each process's inputs and outputs and its key benefit | Adds tools and techniques, key concepts, trends, tailoring and agile considerations |

The Standard repeats the core definitions:

- A **project** is a temporary endeavour to create a unique product, service or result.
- A project ends when its objectives are met, or it is **terminated** because they will not or cannot be met or the need no longer exists. Termination needs **approval by an appropriate authority**.
- Managing a project involves identifying requirements; addressing stakeholders' needs, concerns and expectations; communicating actively; managing resources; and balancing the competing constraints of **scope, schedule, cost, quality, resources and risk**.

## Portfolios, programs and OPM

The Standard echoes Part 1. Portfolios align the organisation's work with **strategy**. Programs coordinate related components to obtain **benefits**, by authorising, changing or terminating projects and managing their interdependencies. The relationships are **not always strictly hierarchical**: projects and programs share resources and stakeholders. The Standard describes **OPM** as a *strategy execution framework*.

## Governance at several levels

Governance exists at the **organisational**, OPM, portfolio, program and project levels.

- **Organisational governance**: direction and control through policies and processes, typically set by a board of directors. It enforces legal and regulatory requirements and defines ethical, social and environmental responsibilities.
- **Project governance**: the framework, functions and processes that guide project management activities.

A project governance framework typically includes:

- stage gate or phase reviews;
- how risks and issues are identified, escalated and resolved;
- roles, responsibilities and authorities;
- knowledge management and lessons learned;
- decision making, problem solving and escalation for matters beyond the PM's authority;
- how changes beyond the PM's authority are reviewed and approved.

## Business value and success

Projects are often preceded by a **business case**, which sets out the objectives, the investment, and the financial and qualitative success criteria. The **benefits management plan** describes target benefits, strategic alignment, time frame, benefits owner, metrics and risks.

> **Key point:** The business case and benefits management plan are developed **before** the project and referred to **after** it. That makes them **business documents**, not project documents or components of the project management plan, although they are inputs to processes such as Develop Project Charter.

Product success, such as market share or new-product success, may only be measurable **after** the product has been handed over. Someone else (the PMO, a portfolio steering committee or a business function) may evaluate it later.`,
      keyTerms: [
        { term: 'Standard', def: 'A document established by an authority, custom or general consent as a model or example.' },
        { term: 'Organisational governance', def: 'Structured direction and control through policies and processes, typically by a board, to meet strategic and operational goals.' },
        { term: 'Business documents', def: 'The business case and benefits management plan; developed before and referenced after the project; not project documents.' },
      ],
    },
    {
      id: 'm14-l2',
      title: 'Life cycle behaviour, stakeholders, the PM and tailoring artifacts',
      minutes: 25,
      topics: ['std-life-cycle-stakeholders-pm', 'std-eef-opa-tailoring'],
      objectives: [
        'Describe how cost, staffing, risk and stakeholder influence change over the life cycle',
        'List the knowledge, skills, abilities and attributes of a project manager',
        'Explain what "tailoring the artifacts" means in the Standard',
      ],
      body: `## How a typical project behaves over time

In a generic life cycle (starting, organising and preparing, carrying out the work, ending):

| Measure | Pattern |
|---|---|
| **Cost and staffing** | Low at the start, rising during the work, dropping quickly near the end |
| **Risk and uncertainty** | **Greatest at the start**, falling as decisions are made and deliverables accepted |
| **Stakeholders' ability to influence** the final product without major cost or schedule impact | **Highest at the start**, decreasing over time |
| **Cost of changes and correcting errors** | **Increases substantially** as the project nears completion |

> **Exam tip:** This is why early stakeholder involvement and good requirements matter. A change that costs little in design can cost a great deal after construction.

Each phase ends at a control point (a phase review or gate) where the charter and business documents are re-examined and the decision is made to change, terminate or continue.

## Stakeholders

A **stakeholder** is anyone (an individual, group or organisation) who may affect, be affected by, or **perceive** themselves to be affected by a decision, activity or outcome of the project. Stakeholders may be internal (sponsor, PMO, team members, other PMs) or external (customers, end users, suppliers, regulators, competitors). They may be actively involved, passively involved or unaware, and their involvement changes over the life cycle.

## The project manager

The Standard describes the PM's attributes as:

- **Knowledge**: of project management, the business environment and technical areas.
- **Skills**: leading, coordinating, collaborating, solving problems and making decisions.
- **Abilities**: developing and managing scope, schedules, budgets, resources, risks, plans and reports.
- **Other attributes**: personality, attitude, ethics and leadership.

**Interpersonal skills** include leadership, team building, motivating, communicating, influencing, decision making, political and cultural awareness, negotiating, facilitating, managing conflict and coaching. Success means meeting the objectives **and** satisfying stakeholders.

## EEFs, OPAs and tailoring the artifacts

- **EEFs** originate outside the project, often outside the enterprise, and are conditions the team does not control.
- **OPAs** are internal: plans, processes, policies, procedures and knowledge bases.

In the Standard, **artifact** means processes, inputs, tools, techniques, outputs, EEFs and OPAs. Selecting and adapting them for a project is **tailoring**. The **project management plan** is the most common artifact, and part of tailoring is deciding which of its components are needed. The plan components and documents the Standard lists under each process are **examples**: they are neither required nor complete. The PM is accountable for deciding which documents each process needs.`,
      keyTerms: [
        { term: 'Phase review / phase gate', def: 'A control point at the end of a phase where performance and documents are reviewed to decide whether to change, terminate or continue.' },
        { term: 'Artifact (Standard)', def: 'Processes, inputs, tools, techniques, outputs, EEFs and OPAs that are selected and adapted when tailoring.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm14-q1',
      stem: 'What does the Standard for Project Management provide that the Guide builds on?',
      options: ['Tools and techniques for every process', 'The foundation: processes by Process Group with inputs, outputs and key benefits', 'Industry-specific methodologies', 'The PMP exam content outline'],
      answer: 1,
      explanation: 'The Standard describes processes by Process Group with inputs, outputs and key benefits. The Guide adds tools, techniques, key concepts, trends and tailoring.',
      topic: 'std-intro-and-projects',
      ref: 'PMBOK 6 Part 2 Introduction',
    },
    {
      id: 'm14-q2',
      stem: 'According to the Standard, what is required to terminate a project before its objectives are met?',
      options: ['A majority vote of the team', 'Approval by an appropriate authority', 'A signed contract amendment', 'Nothing; the PM may stop work at any time'],
      answer: 1,
      explanation: 'The Standard notes that termination of a project requires approval by an appropriate authority.',
      topic: 'std-intro-and-projects',
      ref: 'PMBOK 6 Part 2 §1.1',
    },
    {
      id: 'm14-q3',
      stem: 'Which element is part of a project governance framework, as described in the Standard?',
      options: ['Stage gate or phase reviews and escalation of risks and issues beyond the PM\'s authority', 'The detailed WBS', 'Daily standup timings', 'Individual activity durations'],
      answer: 0,
      explanation: 'Project governance frameworks include phase reviews, risk and issue escalation, roles and authorities, knowledge management, decision-making and approval of changes beyond the PM\'s authority.',
      topic: 'std-ppp-governance-success',
      ref: 'PMBOK 6 Part 2 §1.3',
    },
    {
      id: 'm14-q4',
      stem: 'Why are the business case and benefits management plan called business documents rather than project documents?',
      options: ['They are written by the PM', 'They are developed before the project and referenced after it is complete', 'They are confidential', 'They are part of the project management plan'],
      answer: 1,
      explanation: 'Business documents are created before initiation and referenced after completion. They are not project documents or plan components, though they are inputs to some processes.',
      topic: 'std-ppp-governance-success',
      ref: 'PMBOK 6 Part 2 §1.4',
    },
    {
      id: 'm14-q5',
      stem: 'Over a typical project life cycle, when is risk and uncertainty greatest?',
      options: ['At the start', 'In the middle of execution', 'Just before closing', 'It is constant throughout'],
      answer: 0,
      explanation: 'Risk and uncertainty are greatest at the start and decrease as decisions are made and deliverables accepted.',
      topic: 'std-life-cycle-stakeholders-pm',
      ref: 'PMBOK 6 Part 2 §1.5, Figure 1-3',
    },
    {
      id: 'm14-q6',
      stem: 'A stakeholder wants to change a major product feature. When would such a change typically cost the least?',
      options: ['Near project completion', 'Early in the project', 'During closing', 'Cost does not depend on timing'],
      answer: 1,
      explanation: 'The cost of changes and correcting errors rises substantially as the project approaches completion; stakeholder influence at low cost is highest early.',
      topic: 'std-life-cycle-stakeholders-pm',
      ref: 'PMBOK 6 Part 2 §1.5, Figure 1-3',
    },
    {
      id: 'm14-q7',
      stem: 'Which statement about the plan components and documents listed under each process in the Standard is correct?',
      options: ['They are mandatory for every project', 'They are examples; the PM decides which are needed', 'They are only for agile projects', 'They replace the project management plan'],
      answer: 1,
      explanation: 'The Standard lists plan components and documents as examples only; they are neither required nor exhaustive. Deciding what is needed is part of tailoring.',
      topic: 'std-eef-opa-tailoring',
      ref: 'PMBOK 6 Part 2 §1.11',
    },
    {
      id: 'm14-q8',
      stem: 'Who counts as a stakeholder according to the Standard?',
      options: ['Only people who fund the project', 'Anyone who may affect, be affected by, or perceive themselves to be affected by the project', 'Only internal staff', 'Only people named in the charter'],
      answer: 1,
      explanation: 'A stakeholder may affect, be affected by, or perceive itself to be affected by a decision, activity or outcome of the project.',
      topic: 'std-life-cycle-stakeholders-pm',
      ref: 'PMBOK 6 Part 2 §1.6',
    },
  ],
};
