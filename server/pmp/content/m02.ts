import type { Module } from '../types.ts';

export const M02: Module = {
  id: 'M02',
  number: '2',
  title: 'The environment in which projects operate',
  summary: 'Enterprise environmental factors, organisational process assets, governance, organisational structures and project management offices.',
  lessons: [
    {
      id: 'm02-l1',
      title: 'Enterprise environmental factors and organisational process assets',
      minutes: 25,
      topics: ['e-project-influences', 'e-eefs', 'e-opas'],
      objectives: [
        'Distinguish enterprise environmental factors (EEFs) from organisational process assets (OPAs)',
        'Classify examples as internal or external EEFs',
        'Distinguish the two categories of OPAs and say which ones a project updates',
      ],
      body: `## Two kinds of influence

Every project sits inside an environment that can help or hinder it. The Guide groups these influences into two categories:

| | Enterprise environmental factors (EEFs) | Organisational process assets (OPAs) |
|---|---|---|
| What they are | Conditions **not under the project team's control** that influence, constrain or direct the project | Plans, processes, policies, procedures and knowledge bases **specific to and used by** the performing organisation |
| Where they come from | Inside or outside the organisation | Inside the organisation (or a portfolio, program or other project) |
| Can the team change them? | No; the team works within them | The team uses them and may update or add to some of them |

Both are inputs to many processes, especially planning processes.

## Enterprise environmental factors

**Internal EEFs** include:

- organisational culture, structure and governance (vision, values, leadership style, code of conduct);
- geographic distribution of facilities and resources (virtual teams, shared systems);
- infrastructure (facilities, equipment, IT hardware, capacity);
- information technology software (scheduling tools, configuration management systems, work authorisation systems);
- resource availability (contracting constraints, approved providers);
- employee capability (existing skills and competencies).

**External EEFs** include:

- marketplace conditions (competitors, market share, brand recognition);
- social and cultural influences (political climate, customs, ethics);
- legal restrictions (data protection, employment and procurement law);
- commercial databases (standard cost-estimating data, benchmarks, industry risk studies);
- academic research;
- government or industry standards (product, environmental and quality regulations);
- financial considerations (exchange, interest and inflation rates, tariffs);
- physical environmental elements (weather, working conditions).

## Organisational process assets

OPAs fall into two categories.

### 1. Processes, policies and procedures

These are usually set by the PMO or another function. They are **not normally updated as part of project work**; changes go through the organisation's own policy process, although some organisations let teams tailor templates and checklists. Examples:

- *Initiating and planning*: tailoring guidelines; policies (HR, safety, security, quality, procurement); standard life cycles and methods; templates (plans, registers, contracts, risk categories, probability and impact definitions); preapproved supplier lists.
- *Executing and monitoring*: change control procedures; financial controls; issue and defect management procedures; communication requirements; work authorisation procedures; verification and validation procedures.
- *Closing*: closure guidelines (final audits, evaluations, acceptance, contract closure, resource reassignment, knowledge transfer).

### 2. Organisational knowledge repositories

These **are updated throughout the project** with project information. Examples:

- configuration management repositories (versions of standards, policies and project documents);
- financial data repositories;
- historical information and **lessons learned** repositories;
- issue and defect data;
- metrics data;
- project files from previous projects (baselines, calendars, risk registers, stakeholder registers).

> **Exam tip:** "The organisation's template for the risk register" is an OPA. "Government regulations on emissions" is an external EEF. "The organisation's culture of avoiding bad news" is an internal EEF. If the team cannot change it and it is a condition rather than an asset, it is an EEF.`,
      keyTerms: [
        { term: 'Enterprise environmental factors', def: 'Conditions not under the team\'s control that influence, constrain or direct the project; internal or external.' },
        { term: 'Organisational process assets', def: 'Plans, processes, policies, procedures and knowledge bases specific to and used by the performing organisation.' },
        { term: 'Lessons learned repository', def: 'A store of historical information about lessons learned in projects; part of the organisational knowledge repositories.' },
      ],
    },
    {
      id: 'm02-l2',
      title: 'Organisational systems, governance and structures',
      minutes: 30,
      topics: ['e-organizational-systems', 'e-governance', 'e-management-elements', 'e-structure-types'],
      objectives: [
        'Explain why organisations behave as systems and what that implies for projects',
        'Define organisational and project governance',
        'Compare organisational structures by project manager authority, role and budget control',
      ],
      body: `## Organisations as systems

A project operates within the constraints of its organisation's structure and governance. To get things done, the project manager needs to know where **responsibility, accountability and authority** sit.

A **system** is a collection of components that together produce results the components could not produce alone. Systems:

- are dynamic;
- can be optimised, as can their components;
- **cannot be optimised for the system and all its components at the same time**;
- respond in non-linear ways (a small change can have a big effect).

Three factors shape how a system works: **management elements**, **governance frameworks** and **organisational structure types**.

## Governance

**Governance** is the framework within which authority is exercised in an organisation: rules, policies, procedures, norms, relationships, systems and processes. It influences how objectives are set and achieved, how risk is monitored and how performance is optimised.

**Project governance** is the framework, functions and processes that guide project management activities so the project creates its product, service or result and meets organisational goals. There is no single framework that suits every organisation; governance is tailored to culture and project type.

## Management elements

Management elements are the general principles of managing work. Examples include: dividing work by specialised skills; giving authority to perform work; **unity of command** (each person receives orders from one person); **unity of direction** (one plan and one head for activities with the same objective); putting organisational goals ahead of individual goals; fair pay; clear communication channels; and workplace safety.

## Organisational structures

The structure determines how much authority the project manager has. Learn this progression:

| Structure | PM authority | PM role | Resource availability | Who manages the budget |
|---|---|---|---|---|
| Organic or simple | Little or none | Part-time coordinator | Little or none | Owner or operator |
| Functional (centralised) | Little or none | Part-time | Little or none | Functional manager |
| Multi-divisional | Little or none | Part-time | Little or none | Functional manager |
| Weak matrix | Low | Part-time, alongside another job | Low | Functional manager |
| Balanced matrix | Low to moderate | Part-time, embedded as a skill | Low to moderate | Mixed |
| Strong matrix | Moderate to high | Full-time | Moderate to high | Project manager |
| Project-oriented (projectised) | High to almost total | Full-time | High to almost total | Project manager |
| Virtual | Low to moderate | Full- or part-time | Low to moderate | Mixed |
| Hybrid | Mixed | Mixed | Mixed | Mixed |
| PMO | High to almost total | Full-time | High to almost total | Project manager |

Choosing a structure involves trade-offs: alignment with objectives, specialisation, span of control, clear escalation paths, clear lines of authority, delegation, adaptability, efficiency, cost, physical locations and clear communication.

> **Exam tip:** In a functional or weak matrix organisation, team members report to their functional managers, and the project manager must rely on influence and negotiation. If a scenario asks why the PM cannot direct a team member's time, the structure is often the answer.`,
      keyTerms: [
        { term: 'Governance', def: 'The framework within which authority is exercised in an organisation: rules, policies, procedures, norms, relationships, systems and processes.' },
        { term: 'Functional organisation', def: 'Staff are grouped by specialty; the PM has little or no authority and the functional manager controls the budget.' },
        { term: 'Matrix organisation', def: 'The PM shares responsibility with functional managers; weak, balanced and strong forms differ in PM authority.' },
        { term: 'Projectised organisation', def: 'Work is arranged by project; the PM has high to almost total authority and manages the budget.' },
      ],
    },
    {
      id: 'm02-l3',
      title: 'Project management offices',
      minutes: 15,
      topics: ['e-pmo'],
      objectives: [
        'Compare supportive, controlling and directive PMOs',
        'List the primary functions of a PMO',
      ],
      body: `## What a PMO does

A **project management office (PMO)** is an organisational structure that standardises project-related governance processes and makes it easier to share resources, methods, tools and techniques. Its responsibilities range from supporting project managers to managing projects directly.

## Three types

| Type | What it does | Degree of control |
|---|---|---|
| **Supportive** | Consultative: provides templates, best practices, training, access to information and lessons learned; acts as a project repository | Low |
| **Controlling** | Provides support **and requires compliance**: adoption of frameworks or methods, use of templates and tools, conformance to governance | Moderate |
| **Directive** | **Takes control of projects by directly managing them**; project managers are assigned by and report to the PMO | High |

## Typical PMO functions

- Managing shared resources across projects.
- Developing project management methodology, best practices and standards.
- Coaching, mentoring, training and oversight.
- Monitoring compliance with standards, policies, procedures and templates through project audits.
- Developing and managing policies, procedures, templates and other shared documents (the organisation's process assets).
- Coordinating communication across projects.

A PMO can also support strategic alignment by integrating data from strategic projects. It may act as a link between portfolios, programs, projects and corporate measurement systems such as a balanced scorecard. It may recommend, or even decide, to terminate projects.

> **Exam tip:** If a scenario says "the PMO requires all projects to use its risk register template and audits compliance", that is a **controlling** PMO. If "project managers report directly to the PMO", it is **directive**.`,
      keyTerms: [
        { term: 'PMO', def: 'A management structure that standardises project governance processes and facilitates sharing of resources, methodologies, tools and techniques.' },
        { term: 'Controlling PMO', def: 'Provides support and requires compliance with frameworks, templates and governance; moderate control.' },
        { term: 'Directive PMO', def: 'Directly manages projects; project managers report to the PMO; high control.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm02-q1',
      stem: 'Which of the following is an enterprise environmental factor?',
      options: ['The organisation\'s change control procedure', 'The lessons learned repository', 'Prevailing exchange rates affecting imported equipment', 'The PMO\'s project schedule template'],
      answer: 2,
      explanation: 'Exchange rates are an external financial consideration outside the team\'s control, so they are an EEF. The others are organisational process assets.',
      topic: 'e-eefs',
      ref: 'PMBOK 6 §2.2.2',
    },
    {
      id: 'm02-q2',
      stem: 'The organisation\'s culture discourages reporting bad news early. How should this be classified?',
      options: ['An internal enterprise environmental factor', 'An external enterprise environmental factor', 'An organisational process asset', 'A project constraint recorded in the charter only'],
      answer: 0,
      explanation: 'Organisational culture is an internal EEF: a condition inside the organisation that the project team does not control.',
      topic: 'e-eefs',
      ref: 'PMBOK 6 §2.2.1',
    },
    {
      id: 'm02-q3',
      stem: 'Which group of organisational process assets is normally updated throughout the project?',
      options: ['Policies and procedures', 'Organisational knowledge repositories', 'Preapproved supplier lists', 'Tailoring guidelines'],
      answer: 1,
      explanation: 'Knowledge repositories (lessons learned, historical information, metrics, project files) are updated during the project. Processes, policies and procedures are usually changed only through organisational policy.',
      topic: 'e-opas',
      ref: 'PMBOK 6 §2.3.1-2.3.2',
    },
    {
      id: 'm02-q4',
      stem: 'A project team finds a better format for the risk register and wants to change the organisation\'s standard template. What is the best approach?',
      options: ['Change the template directly because the team uses it', 'Propose the change through the organisation\'s policy process, often via the PMO', 'Record it as an enterprise environmental factor', 'Ignore the template on this project'],
      answer: 1,
      explanation: 'Processes, policies, procedures and templates are generally established by the PMO or another function and changed through organisational policy, not unilaterally by a project team.',
      topic: 'e-opas',
      ref: 'PMBOK 6 §2.3.1',
    },
    {
      id: 'm02-q5',
      stem: 'In which structure does the project manager typically have high to almost total authority and manage the budget?',
      options: ['Functional', 'Weak matrix', 'Balanced matrix', 'Project-oriented'],
      answer: 3,
      explanation: 'In a project-oriented (projectised) structure, the PM has high to almost total authority, works full-time and manages the budget.',
      topic: 'e-structure-types',
      ref: 'PMBOK 6 §2.4.4, Table 2-1',
    },
    {
      id: 'm02-q6',
      stem: 'A project manager works on the project part-time alongside their regular job, has low authority and the functional manager controls the budget. Which structure is this most likely?',
      options: ['Strong matrix', 'Weak matrix', 'Project-oriented', 'Directive PMO'],
      answer: 1,
      explanation: 'A weak matrix gives the PM low authority and a part-time role done alongside another job, with the functional manager managing the budget.',
      topic: 'e-structure-types',
      ref: 'PMBOK 6 Table 2-1',
    },
    {
      id: 'm02-q7',
      stem: 'Which statement about systems is consistent with the Guide?',
      options: ['A system and all its components can be optimised at the same time', 'Systems are static once designed', 'Systems and their components cannot be optimised at the same time', 'Systems respond in strictly linear ways'],
      answer: 2,
      explanation: 'The Guide notes systems are dynamic and nonlinear, can be optimised, but the system and its components cannot be optimised at the same time.',
      topic: 'e-organizational-systems',
      ref: 'PMBOK 6 §2.4.1',
    },
    {
      id: 'm02-q8',
      stem: 'The principle that each person should receive orders from only one person is called:',
      options: ['Unity of direction', 'Unity of command', 'Division of work', 'Span of control'],
      answer: 1,
      explanation: 'Unity of command means one person gives orders to an individual. Unity of direction means one plan and one head for activities with the same objective.',
      topic: 'e-management-elements',
      ref: 'PMBOK 6 §2.4.3',
    },
    {
      id: 'm02-q9',
      stem: 'What is project governance?',
      options: ['The PMO\'s list of templates', 'The framework, functions and processes that guide project management activities to meet organisational, strategic and operational goals', 'The sponsor\'s personal approval of each deliverable', 'The organisation\'s legal department'],
      answer: 1,
      explanation: 'Project governance is the framework, functions and processes that guide project management activities in order to create the product, service or result and meet goals.',
      topic: 'e-governance',
      ref: 'PMBOK 6 §2.4.2',
    },
    {
      id: 'm02-q10',
      stem: 'A PMO provides templates and training, and requires projects to follow its methodology and pass periodic audits. Which type of PMO is this?',
      options: ['Supportive', 'Controlling', 'Directive', 'Virtual'],
      answer: 1,
      explanation: 'A controlling PMO provides support and requires compliance (methodology, templates, governance conformance), giving moderate control.',
      topic: 'e-pmo',
      ref: 'PMBOK 6 §2.4.4.3',
    },
    {
      id: 'm02-q11',
      stem: 'In a directive PMO, to whom do project managers usually report?',
      options: ['Functional managers', 'The PMO', 'The customer', 'The change control board'],
      answer: 1,
      explanation: 'A directive PMO directly manages projects; project managers are assigned by and report to the PMO.',
      topic: 'e-pmo',
      ref: 'PMBOK 6 §2.4.4.3',
    },
    {
      id: 'm02-q12',
      stem: 'Which item is an organisational process asset rather than an enterprise environmental factor?',
      options: ['Government safety standards', 'Commercial cost-estimating databases', 'Historical project files with baselines and risk registers', 'Marketplace conditions'],
      answer: 2,
      explanation: 'Project files from previous projects are part of the organisation\'s knowledge repositories (OPAs). The others are external EEFs.',
      topic: 'e-project-influences',
      ref: 'PMBOK 6 §2.2-2.3',
    },
  ],
};
