import type { Module } from '../types.ts';

export const M01: Module = {
  id: 'M01',
  number: '1',
  title: 'Project management foundations',
  summary: 'What a project is, how projects relate to programs, portfolios and operations, life cycles, processes and Knowledge Areas, and how success is judged.',
  lessons: [
    {
      id: 'm01-l1',
      title: 'Projects, value and why project management matters',
      minutes: 25,
      topics: ['f-guide-purpose', 'f-project-definition', 'f-projects-drive-change', 'f-initiation-context', 'f-business-value', 'f-importance-of-pm'],
      objectives: [
        'Define a project and test whether a piece of work qualifies',
        'List the conditions under which a project ends',
        'Explain how projects create business value by moving an organisation to a future state',
        'Classify the factors that lead organisations to start projects',
      ],
      body: `## What the Guide is (and is not)

The project management body of knowledge is everything the profession knows, written down or not. The *PMBOK Guide* captures only the part that is **generally recognised good practice**: it applies to most projects most of the time, and there is broad agreement that using it improves the chance of success.

The Guide is **not a methodology**. A methodology is a specific system of practices, techniques, procedures and rules. Organisations build methodologies on top of the Guide and then tailor them for each project.

## What a project is

A project is a **temporary** endeavour undertaken to create a **unique** product, service or result.

- **Temporary** means it has a definite start and end. It does not mean short: a project can run for years. The *outputs* may last far longer than the project, as a bridge or a monument does.
- **Unique** means the result is not identical to anything produced before. Repetitive elements do not remove uniqueness. Two office buildings built from the same design still differ in site, team and conditions.

A project produces **deliverables**: unique, verifiable products, results or capabilities, tangible or intangible. A deliverable might be a new product or a component of one, a service capability, a result such as a research report, or a combination.

### When does a project end?

A project ends when any of these happens:

- its objectives have been achieved;
- the objectives will not or cannot be met;
- funding is exhausted or no longer available;
- the need for the project no longer exists;
- the people or physical resources are no longer available;
- it is terminated for legal cause or for convenience.

> **Exam tip:** "The customer no longer needs the product" is a valid reason to end a project, and the project manager should still close it formally (Module 4, Close Project or Phase).

## Projects drive change

From a business point of view, a project moves an organisation from a **current state** to a desired **future state**. Some projects pass through a **transition state** of intermediate steps. Business value rises as the organisation moves towards the future state.

**Business value** is the net quantifiable benefit an endeavour delivers. It may be:

| Tangible | Intangible |
|---|---|
| Money and other monetary assets | Goodwill |
| Shareholder equity | Brand recognition |
| Utility, fixtures and tools | Public benefit |
| Market share | Trademarks, reputation, strategic alignment |

## Why organisations start projects

Leaders start projects in response to factors acting on the organisation. The Guide groups these into four categories:

1. **Meet regulatory, legal or social requirements** (for example, a new data-protection law).
2. **Satisfy stakeholder requests or needs** (for example, a customer request).
3. **Implement or change business or technological strategies** (for example, a competitive threat).
4. **Create, improve or fix products, processes or services** (for example, fixing a material defect).

One factor can fall into several categories. Market demand, for example, can reflect stakeholder needs, a strategic opportunity and a need to create a new product.

## Why project management matters

**Project management** is the application of knowledge, skills, tools and techniques to project activities to meet project requirements. Done well, it helps organisations:

- meet business objectives and satisfy stakeholders;
- become more predictable and deliver the right product at the right time;
- resolve problems and respond to risks in time;
- balance the competing constraints of scope, quality, schedule, cost and resources;
- spot failing projects early and recover or terminate them.

Done poorly, it shows up as missed deadlines, cost overruns, poor quality, rework, uncontrolled scope growth and unhappy stakeholders. For these reasons the Guide treats project management as a **strategic competency**.`,
      keyTerms: [
        { term: 'Project', def: 'A temporary endeavour undertaken to create a unique product, service or result.' },
        { term: 'Deliverable', def: 'Any unique and verifiable product, result or capability to perform a service, required to complete a process, phase or project.' },
        { term: 'Business value', def: 'The net quantifiable benefit derived from a business endeavour; may be tangible, intangible or both.' },
        { term: 'Project management', def: 'Applying knowledge, skills, tools and techniques to project activities to meet project requirements.' },
      ],
    },
    {
      id: 'm01-l2',
      title: 'Portfolios, programs, projects and operations',
      minutes: 25,
      topics: ['f-portfolio-program-project', 'f-program-management', 'f-portfolio-management', 'f-operations-and-projects', 'f-opm'],
      objectives: [
        'Distinguish projects, programs, portfolios and operations',
        'Explain the "doing things right" versus "doing the right things" distinction',
        'Describe where projects and operations intersect',
        'Explain organisational project management (OPM)',
      ],
      body: `## Three levels of managed work

| | Project | Program | Portfolio |
|---|---|---|---|
| What it is | Temporary endeavour creating a unique result | Related projects, subsidiary programs and program activities managed together | Projects, programs, subsidiary portfolios and operations managed as a group |
| Why | Deliver defined objectives | Obtain **benefits** not available by managing the parts separately | Achieve **strategic objectives** |
| Scope | Defined objectives, progressively elaborated | Includes the scopes of its components | Changes with the organisation's strategy |
| Change | Expected; controlled through processes | Adapted to optimise benefits | Monitored across the wider environment |
| Success measured by | Product and project quality, timeliness, budget, customer satisfaction | Delivery of intended benefits | Aggregate investment performance and benefit realisation |

A program is **not just a large project**. A very large project is still a project; the Guide calls one a *megaproject* (guideline: a cost of US$1 billion or more, affecting a million or more people, running for years). What makes a program is the need to coordinate *related* components to get benefits that none of them could deliver alone.

Components of a portfolio do **not** have to be related or interdependent. A portfolio groups work so the organisation can choose the best mix of investments.

> **Remember:** Program and project management focus on doing programs and projects *the right way*. Portfolio management focuses on doing *the right* programs and projects.

### Program management

Program management looks at the **interdependencies between** components: aligning them with strategy, allocating scope across projects, sharing risks and constraints, resolving issues between components, and allocating budget so that benefits are realised. Example: a satellite communications program might coordinate separate projects to build the satellite, build the ground stations, launch the satellite and integrate the system.

### Portfolio management

Portfolio management centrally manages one or more portfolios. Its aims are to:

- guide investment decisions and select the best mix of programs and projects;
- make decision-making transparent;
- prioritise people and physical resources;
- raise the likelihood of achieving the desired return on investment;
- manage the aggregate risk profile of all components together.

## Projects and operations

**Operations** are the ongoing production of goods or services. They are outside a project's scope, but the two meet at several points:

- when products are developed, upgraded or expanded;
- when operations or product development processes are improved;
- at the end of a product's life;
- at each project closeout, when deliverables and knowledge are handed over.

At those points, deliverables and knowledge move between project and operations. Either project people move into operations, or operations people join the project.

## Organisational project management (OPM)

OPM is a framework that integrates portfolio, program and project management with **organisational enablers**, such as structure, culture, technology and HR practices, to deliver strategy. Its purpose is to make sure the organisation:

- undertakes the **right** projects;
- allocates critical resources appropriately;
- keeps every level aligned with the strategic vision.

The flow runs like this. Strategy drives portfolio decisions. Programs and projects deliver results. Operations turn those results into realised business value. Performance and impact analyses then feed back into portfolio review and adjustment.`,
      keyTerms: [
        { term: 'Program', def: 'Related projects, subsidiary programs and program activities managed in a coordinated way to obtain benefits not available from managing them individually.' },
        { term: 'Portfolio', def: 'Projects, programs, subsidiary portfolios and operations managed as a group to achieve strategic objectives.' },
        { term: 'Operations management', def: 'Oversight of the ongoing production of goods and/or services.' },
        { term: 'OPM', def: 'Organisational project management: a framework integrating portfolio, program and project management with organisational enablers to achieve strategic objectives.' },
      ],
    },
    {
      id: 'm01-l3',
      title: 'Life cycles, phases and phase gates',
      minutes: 20,
      topics: ['f-life-cycles', 'f-phases-and-gates'],
      objectives: [
        'Distinguish project life cycle, development life cycle and product life cycle',
        'Compare predictive, iterative, incremental, adaptive and hybrid development approaches',
        'Describe phase attributes and the possible decisions at a phase gate',
      ],
      body: `## Three different "life cycles"

- **Project life cycle**: the series of phases a project passes through from start to finish. Every project fits the generic pattern: *starting the project, organising and preparing, carrying out the work, ending the project*.
- **Development life cycle**: the phases within the project that create the product, service or result.
- **Product life cycle**: the life of the product itself, from concept through growth, maturity and retirement. It usually outlasts the project, and one product may spawn many projects.

## Development approaches

| Approach | How scope, time and cost are handled | Typical fit |
|---|---|---|
| **Predictive** (waterfall) | Scope, time and cost are set early; changes are carefully controlled | Well-understood work |
| **Iterative** | Scope is set early, but time and cost estimates are revised as the team learns; cycles repeat | Complex work where feedback improves the product |
| **Incremental** | Each iteration adds functionality within a set time frame; the deliverable is complete only after the final increment | Work that can be delivered in usable pieces |
| **Adaptive** (agile, change-driven) | Detailed scope is defined and approved before each iteration | High uncertainty and frequent change |
| **Hybrid** | Well-understood parts predictive; evolving parts adaptive | Mixed projects |

The project team chooses the most suitable life cycle. There is no single correct one.

## Phases

A **phase** is a set of logically related activities that ends with one or more deliverables. Each phase has attributes: a name (such as feasibility, design, build, test or transition), a number, a duration, resource requirements, and **entrance and exit criteria**.

Splitting work into phases gives management better insight and more chances to take corrective or preventive action. Phases are shaped by management needs, the nature of the project, the industry and technology, and key decision points such as funding approvals.

## Phase gates

A **phase gate** (also called a phase review, stage gate or kill point) is held at the end of a phase. Performance and progress are compared against the business documents (business case and benefits management plan), the project charter and the project management plan. The decision can be to:

- continue to the next phase;
- continue with modification;
- end the project;
- remain in the phase;
- repeat the phase or parts of it.

> **Exam tip:** A gate is a **decision** point, not a status meeting. If a scenario says the business case no longer holds at a phase review, ending the project is a legitimate, even good, outcome.`,
      keyTerms: [
        { term: 'Project life cycle', def: 'The series of phases a project passes through from its start to its completion.' },
        { term: 'Development life cycle', def: 'The phases within a project life cycle that relate to developing the product, service or result.' },
        { term: 'Phase gate', def: 'A review at the end of a phase where a decision is made to continue, continue with modification, end the project, remain in the phase or repeat it.' },
      ],
    },
    {
      id: 'm01-l4',
      title: 'Processes, Process Groups and Knowledge Areas',
      minutes: 30,
      topics: ['f-key-components', 'f-pm-processes', 'f-process-groups', 'f-knowledge-areas', 'f-data-information-reports', 'f-tailoring'],
      objectives: [
        'Explain inputs, tools and techniques, and outputs (ITTOs)',
        'Name the five Process Groups and their purposes',
        'Name the ten Knowledge Areas',
        'Trace work performance data to information to reports',
        'Explain why and how the PM tailors',
      ],
      body: `## Processes

Each project management process turns **inputs** into **outputs** using **tools and techniques**. Outputs connect the processes: the output of one process becomes the input of another, or it is a project deliverable.

Processes run at different frequencies:

- **Once or at set points:** Develop Project Charter; Close Project or Phase.
- **Periodically, as needed:** Acquire Resources (when people or materials are needed); Conduct Procurements (before an item is needed).
- **Continuously:** Define Activities on rolling-wave or adaptive projects; most monitoring and controlling processes.

## The five Process Groups

| Process Group | Purpose |
|---|---|
| **Initiating** | Define a new project or phase and obtain authorisation to start it |
| **Planning** | Establish the scope, refine objectives and define the course of action |
| **Executing** | Complete the work defined in the project management plan |
| **Monitoring and Controlling** | Track, review and regulate progress and performance; identify and start needed changes |
| **Closing** | Formally complete or close the project, phase or contract |

> **Exam tip:** Process Groups are **not phases**. A design phase can include initiating, planning, executing, monitoring and closing work. All five groups can occur within one phase.

## The ten Knowledge Areas

1. **Integration**: unify and coordinate the processes and activities.
2. **Scope**: include all the work required, and only the work required.
3. **Schedule**: complete the project on time.
4. **Cost**: plan, estimate, budget, finance, fund, manage and control costs.
5. **Quality**: apply the organisation's quality policy to project and product requirements.
6. **Resource**: identify, acquire and manage people and physical resources.
7. **Communications**: plan, collect, distribute, store, retrieve, manage, monitor and dispose of project information.
8. **Risk**: plan, identify, analyse, plan responses to, implement responses to and monitor risk.
9. **Procurement**: acquire products, services or results from outside the project team.
10. **Stakeholder**: identify the people affected, analyse their expectations and engage them.

Some industries add their own areas; construction, for example, often adds safety and health management.

## Data, information and reports

This flow comes up often in exam questions:

1. **Work performance data** (WPD) are raw observations from the work: actual start dates, percent complete, defect counts, actual costs. They are produced by **Executing** processes.
2. **Work performance information** (WPI) is that data analysed in context by the **controlling** processes. Examples: whether a deliverable is on track, the status of change requests, a forecast estimate to complete.
3. **Work performance reports** (WPR) present the information so people can make decisions: dashboards, status reports, memos. They are produced by **Monitor and Control Project Work** and distributed through communications processes.

> **Remember:** Executing produces data; controlling processes produce information; Monitor and Control Project Work produces reports.

## Tailoring

Because every project is unique, not every process, input, tool or output is needed every time. **Tailoring** is selecting the right combination of processes, inputs, tools, techniques, outputs and life-cycle phases for the project. The project manager tailors together with the team, the sponsor and the organisation, weighing the competing constraints (scope, schedule, cost, resources, quality and risk) along with the environment, the culture, stakeholder needs and governance requirements. Even an organisation's standard methodology usually needs further tailoring for each project.`,
      keyTerms: [
        { term: 'ITTO', def: 'Inputs, tools and techniques, and outputs: the way each process is described.' },
        { term: 'Process Group', def: 'A logical grouping of project management processes to achieve specific objectives; independent of phases.' },
        { term: 'Knowledge Area', def: 'An area of project management defined by its knowledge requirements and described by its processes, practices, ITTOs.' },
        { term: 'Work performance data / information / reports', def: 'Raw observations from executing; data analysed in context by controlling processes; information presented to drive decisions.' },
        { term: 'Tailoring', def: 'Selecting the appropriate processes, inputs, tools, techniques, outputs and life-cycle phases for a project.' },
      ],
    },
    {
      id: 'm01-l5',
      title: 'Business documents, the charter and measuring success',
      minutes: 25,
      topics: ['f-business-documents', 'f-charter-and-plan-defs', 'f-success-measures'],
      objectives: [
        'Describe the contents and owners of the business case and benefits management plan',
        'Place the needs assessment, business case, charter and plans on a project timeline',
        'Identify financial and non-financial measures of project success',
      ],
      body: `## The two project business documents

### Business case

A **business case** is a documented economic feasibility study. It establishes whether the benefits of a proposed initiative justify it, and it is the basis for authorising project work. A **needs assessment** often comes first, to understand the business goals, issues and opportunities.

A business case typically covers:

- **Business need**: what is prompting action (the problem or opportunity), the stakeholders affected, and the scope.
- **Analysis of the situation**: goals and objectives, root causes, a gap analysis of needed versus existing capabilities, known risks, critical success factors, and decision criteria (classed as required, desired or optional).
- **Options considered**: usually including "do nothing" (business as usual), "do the minimum" and "do more than the minimum".
- **Recommendation**: the preferred option, with its constraints, assumptions, risks, success measures and an implementation approach with milestones.
- **Evaluation**: how the benefits will be measured, including after the project ends.

The **sponsor** is generally accountable for the business case. The project manager does not own it but makes sure the business case, charter, project management plan and benefits management plan stay aligned with each other and with organisational goals.

### Benefits management plan

The **benefits management plan** describes how and when the project's benefits will be delivered and measured. It includes the target benefits (often expressed as net present value), strategic alignment, the time frame, the **benefits owner** who monitors and reports realised benefits, metrics, assumptions and risks.

### Timeline

| When | Document |
|---|---|
| Before the project | Needs assessment, business case |
| Starting the project | Project charter |
| Organising and preparing, then carrying out the work | Project management plan |
| Throughout the life cycle and beyond | Benefits management plan |

## Charter and plan

- The **project charter** is issued by the sponsor. It formally authorises the project and gives the project manager authority to apply organisational resources to project activities.
- The **project management plan** describes how the project will be executed, monitored, controlled and closed.

Both are covered in detail in Module 4.

## How success is measured

Traditionally, success meant delivering scope on time, on budget and to the required quality. Today it also means achieving the project's **objectives** and the business benefits behind them. Stakeholders can disagree about success, so agree and document early:

- what success looks like;
- how it will be measured;
- what could affect it.

Common measures include completing the benefits management plan; meeting financial measures from the business case; meeting non-financial objectives; reaching the future state; meeting contract terms; stakeholder satisfaction; customer or end-user adoption; and integrating deliverables into operations.

The financial measures the Guide names are **net present value (NPV)**, **return on investment (ROI)**, **internal rate of return (IRR)**, **payback period (PBP)** and **benefit-cost ratio (BCR)**. The Guide names them without giving formulas. As general finance knowledge (not from the Guide):

- A higher NPV, IRR, ROI or BCR is better.
- A shorter payback period is better.
- A BCR above 1 means benefits exceed costs.

> **Exam tip:** A project can meet its scope, schedule and budget and still fail from a business point of view, for example if the market changes before it finishes. Keeping the project aligned with the business throughout raises the chance of real success.`,
      keyTerms: [
        { term: 'Business case', def: 'A documented economic feasibility study establishing the validity of the benefits of a selected component; basis for authorising further work.' },
        { term: 'Benefits management plan', def: 'Describes how and when the benefits of the project will be delivered and measured.' },
        { term: 'Project charter', def: 'Document issued by the sponsor that formally authorises the project and gives the PM authority to use organisational resources.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm01-q1',
      stem: 'A team will spend two years building a hospital wing. The hospital has built similar wings before. Is this a project?',
      options: ['No, because similar wings have been built before', 'Yes, because it is temporary and the result is unique despite repetitive elements', 'No, because it lasts more than one year', 'Only if it is part of a program'],
      answer: 1,
      explanation: 'A project is temporary and creates a unique result. Repetitive elements do not remove uniqueness (different site, design and conditions), and "temporary" does not mean short.',
      topic: 'f-project-definition',
      ref: 'PMBOK 6 §1.2.1',
    },
    {
      id: 'm01-q2',
      stem: 'Halfway through a project, the customer announces the product is no longer needed. What is true?',
      options: ['The project must continue because the charter was signed', 'The project can end because the need no longer exists, and it should be closed formally', 'The project manager should seek a new customer for the product', 'The project automatically becomes an operation'],
      answer: 1,
      explanation: 'The need no longer existing is one of the recognised reasons a project ends. The project should still go through Close Project or Phase.',
      topic: 'f-project-definition',
      ref: 'PMBOK 6 §1.2.1',
    },
    {
      id: 'm01-q3',
      stem: 'A new data-protection law forces a bank to change how it stores customer records. Which category of project initiation factor is this primarily?',
      options: ['Satisfy stakeholder requests or needs', 'Meet regulatory, legal or social requirements', 'Create, improve or fix products', 'Implement or change technological strategy only'],
      answer: 1,
      explanation: 'A legal requirement falls under "meet regulatory, legal or social requirements". It may touch other categories too, but this is its primary category.',
      topic: 'f-initiation-context',
      ref: 'PMBOK 6 §1.2.1, Table 1-1',
    },
    {
      id: 'm01-q4',
      stem: 'Which statement best distinguishes a program from a large project?',
      options: ['A program costs more than US$1 billion', 'A program coordinates related components to obtain benefits not available from managing them individually', 'A program has no defined end date', 'A program is managed by the PMO'],
      answer: 1,
      explanation: 'A program exists to achieve benefits through coordinated management of related components. Size alone does not make a program; a very large project is a megaproject.',
      topic: 'f-portfolio-program-project',
      ref: 'PMBOK 6 §1.2.3.1-1.2.3.2',
    },
    {
      id: 'm01-q5',
      stem: 'Which statement about portfolios is correct?',
      options: ['All portfolio components must be interdependent', 'Portfolio success is measured by the quality of individual deliverables', 'Portfolio management focuses on doing the right programs and projects to meet strategic objectives', 'Portfolios cannot contain operations'],
      answer: 2,
      explanation: 'Portfolio management selects and prioritises the right work for strategy. Components need not be related, portfolios can include operations, and success is measured by aggregate investment performance and benefit realisation.',
      topic: 'f-portfolio-management',
      ref: 'PMBOK 6 §1.2.3.3, Table 1-2',
    },
    {
      id: 'm01-q6',
      stem: 'At the end of the design phase, the review finds the business case is no longer valid. Which decision is legitimate at this gate?',
      options: ['Only "continue" is allowed once a phase is finished', 'End the project', 'Postpone the decision until closing', 'Ask the team to vote'],
      answer: 1,
      explanation: 'Phase gate decisions include continue, continue with modification, end the project, remain in the phase, or repeat the phase. Ending the project is appropriate when the business case fails.',
      topic: 'f-phases-and-gates',
      ref: 'PMBOK 6 §1.2.4.3',
    },
    {
      id: 'm01-q7',
      stem: 'A team defines detailed scope and gets it approved before the start of each two-week cycle. Which development approach is this?',
      options: ['Predictive', 'Iterative', 'Adaptive', 'Incremental with fixed scope'],
      answer: 2,
      explanation: 'In adaptive (agile) life cycles, detailed scope is defined and approved before each iteration begins.',
      topic: 'f-life-cycles',
      ref: 'PMBOK 6 §1.2.4.1',
    },
    {
      id: 'm01-q8',
      stem: 'A new project manager plans to finish all Planning processes before starting any Executing processes, because "Process Groups are phases." What is the best correction?',
      options: ['Process Groups are phases, so the plan is correct', 'Process Groups are independent of phases and interact; planning continues as the work progresses', 'Only Initiating and Closing are phases', 'Executing must always start before Planning ends'],
      answer: 1,
      explanation: 'Process Groups are logical groupings of processes, not phases. They overlap and repeat, and several groups can occur within a single phase.',
      topic: 'f-process-groups',
      ref: 'PMBOK 6 §1.2.4.5',
    },
    {
      id: 'm01-q9',
      stem: 'Actual start and finish dates and the number of defects found are examples of what?',
      options: ['Work performance reports', 'Work performance information', 'Work performance data', 'Organisational process assets'],
      answer: 2,
      explanation: 'Raw observations and measurements from executing the work are work performance data. They become information once analysed in controlling processes.',
      topic: 'f-data-information-reports',
      ref: 'PMBOK 6 §1.2.4.7',
    },
    {
      id: 'm01-q10',
      stem: 'Which process produces work performance reports?',
      options: ['Direct and Manage Project Work', 'Monitor and Control Project Work', 'Manage Communications', 'Control Quality'],
      answer: 1,
      explanation: 'Work performance information from the controlling processes is consolidated into work performance reports by Monitor and Control Project Work (4.5).',
      topic: 'f-data-information-reports',
      ref: 'PMBOK 6 §1.2.4.7, Figure 1-7',
    },
    {
      id: 'm01-q11',
      stem: 'Who is generally accountable for the business case?',
      options: ['The project manager', 'The sponsor', 'The PMO director', 'The benefits owner'],
      answer: 1,
      explanation: 'The sponsor is generally accountable for developing and maintaining the business case. The project manager provides recommendations and oversight to keep it aligned with the project documents.',
      topic: 'f-business-documents',
      ref: 'PMBOK 6 §1.2.6.1',
    },
    {
      id: 'm01-q12',
      stem: 'Which document describes how and when the benefits of a project will be delivered and how they will be measured?',
      options: ['Project charter', 'Benefits management plan', 'Scope management plan', 'Business requirements document'],
      answer: 1,
      explanation: 'The benefits management plan describes how and when benefits will be delivered and measured, with target benefits, time frame, benefits owner, metrics, assumptions and risks.',
      topic: 'f-business-documents',
      ref: 'PMBOK 6 §1.2.6.2',
    },
    {
      id: 'm01-q13',
      stem: 'A project met its scope, schedule and budget, but a competitor launched first and few customers adopted the product. Which statement is most accurate?',
      options: ['The project was a complete success', 'The project may be judged unsuccessful from a business perspective', 'Success is measured only by the triple constraint', 'The PMO is responsible for the failure'],
      answer: 1,
      explanation: 'Success now includes achieving objectives and business value. A project can meet time, cost and scope targets but still fail if the business need or market changes.',
      topic: 'f-success-measures',
      ref: 'PMBOK 6 §1.2.6.4',
    },
    {
      id: 'm01-q14',
      stem: 'Why does the project manager tailor the organisation\'s methodology for each project?',
      options: ['Because the PMBOK Guide requires every process to be modified', 'Because every project is unique and not every process, input, tool or output is needed every time', 'To avoid following organisational policies', 'Because tailoring is only allowed on agile projects'],
      answer: 1,
      explanation: 'Tailoring selects the appropriate combination of processes, ITTOs and life-cycle phases for the project, considering its constraints, environment, culture and governance.',
      topic: 'f-tailoring',
      ref: 'PMBOK 6 §1.2.5',
    },
    {
      id: 'm01-q15',
      stem: 'Where do projects and operations typically intersect?',
      options: ['Only when a project is cancelled', 'At points such as product upgrades, process improvements, end of product life and project closeout', 'Never; operations are outside project scope', 'Only in the Initiating Process Group'],
      answer: 1,
      explanation: 'Operations are outside project scope, but they intersect during product development or upgrades, process improvement, end of product life and each closeout, when deliverables and knowledge are transferred.',
      topic: 'f-operations-and-projects',
      ref: 'PMBOK 6 §1.2.3.4-1.2.3.5',
    },
  ],
};
