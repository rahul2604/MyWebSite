import type { Module } from '../types.ts';

export const M04: Module = {
  id: 'M04',
  number: '4',
  title: 'Project Integration Management',
  summary: 'The seven integration processes: chartering, planning, directing the work, managing knowledge, monitoring, controlling change and closing.',
  lessons: [
    {
      id: 'm04-l1',
      title: 'Integration overview and recurring techniques',
      minutes: 20,
      topics: ['i-integration-overview', 'i-key-concepts', 'i-common-tt'],
      objectives: [
        'Name the seven integration processes and their Process Groups',
        'Explain why integration is the one responsibility the PM cannot delegate',
        'Describe recurring tools such as expert judgment, brainstorming, focus groups, facilitation and meeting management',
      ],
      body: `## What integration means

Project Integration Management covers the processes that **identify, define, combine, unify and coordinate** all the other processes and activities. It involves choices: where to spend resources, how to balance competing demands, which alternative approaches to take, how to tailor processes, and how to manage the interdependencies between Knowledge Areas.

> **Key idea:** Specialists can manage other Knowledge Areas, but **accountability for integration cannot be delegated or transferred**. The project manager combines the results from every area and is ultimately responsible for the project as a whole.

## The seven processes

| Process | Process Group | In one sentence |
|---|---|---|
| 4.1 Develop Project Charter | Initiating | Create the document that authorises the project and the PM |
| 4.2 Develop Project Management Plan | Planning | Define, prepare and coordinate all plan components into one integrated plan |
| 4.3 Direct and Manage Project Work | Executing | Lead and perform the work and implement approved changes |
| 4.4 Manage Project Knowledge | Executing | Use existing knowledge and create new knowledge |
| 4.5 Monitor and Control Project Work | Monitoring and Controlling | Track, review and report overall progress |
| 4.6 Perform Integrated Change Control | Monitoring and Controlling | Review, decide on and manage all change requests |
| 4.7 Close Project or Phase | Closing | Finalise all activities for the project, phase or contract |

## Trends and tailoring

The Guide lists these trends: automated tools and project management information systems (PMIS); visual management tools; knowledge management for a mobile workforce; wider PM responsibilities (business cases and benefits management); and hybrid methods. Integration is tailored to the life cycle and development approach, the management approach, governance, how knowledge and change are handled, and how benefits are reported.

**In agile settings** the PM's accountability does not change, but detailed product planning and delivery are delegated to the team. Team members act as local domain experts and decide how plans and components fit together. The PM builds a collaborative decision-making environment and makes sure the team can respond to change.

## Tools you will see again and again

- **Expert judgment**: judgment from anyone with relevant specialised education, knowledge, skill, experience or training.
- **Brainstorming**: quickly generating many ideas in a group, then analysing them.
- **Focus groups**: a moderated, conversational discussion with stakeholders and subject matter experts.
- **Interviews**: talking directly with stakeholders to gather information.
- **Checklists**: lists drawn from organisational or industry experience to guide work or check completeness.
- **Facilitation**: guiding a group to a decision with effective participation, mutual understanding, buy-in and follow-up.
- **Meeting management**: preparing an agenda, inviting the right people, and sending minutes and actions.
- **Conflict management**: bringing stakeholders into alignment.`,
      keyTerms: [
        { term: 'Project Integration Management', def: 'Processes to identify, define, combine, unify and coordinate the various processes and activities within the Process Groups.' },
        { term: 'Expert judgment', def: 'Judgment based on expertise in an application area, Knowledge Area, discipline or industry.' },
        { term: 'Facilitation', def: 'Guiding a group event to a successful decision, solution or conclusion with full participation and buy-in.' },
      ],
    },
    {
      id: 'm04-l2',
      title: '4.1 Develop Project Charter',
      minutes: 25,
      topics: ['i-4.1-develop-charter'],
      objectives: [
        'Explain who initiates a project and when the PM should be assigned',
        'List the contents of a project charter and the assumption log',
        'Distinguish a charter from a contract',
      ],
      body: `## Purpose

Develop Project Charter produces the document that **formally authorises the project** and gives the project manager authority to apply organisational resources. It links the project directly to the organisation's strategic objectives and shows the organisation's commitment. It is performed once, or at predefined points such as the start of each phase.

## Who does what

- Projects are initiated by an entity **outside** the project, at a level that can secure funding and commit resources. This might be a sponsor, a program or PMO, or a portfolio governing body.
- The charter may be **written by the sponsor or by the PM** working with the initiating entity. Either way, it is the sponsor's authority that it carries.
- Assign the project manager **as early as feasible**: ideally while the charter is being developed, and always before planning starts.
- A charter is **not a contract**: no consideration (money or other value) is exchanged. For external customers a formal contract is usually also used.

## Key inputs

- **Business documents**: the business case (the most common starting point) and the benefits management plan. The PM does **not** update these; they are not project documents, though the PM may recommend changes.
- **Agreements**: contracts, memoranda of understanding, service level agreements, letters of intent, even emails or verbal agreements.
- **EEFs and OPAs**: such as regulations, governance frameworks, the charter template and historical information.

## Tools

Expert judgment, data gathering (brainstorming, focus groups, interviews), interpersonal skills (conflict management, facilitation, meeting management) and meetings with key stakeholders.

## Outputs

### Project charter

The charter typically records:

- project purpose;
- measurable objectives and related success criteria;
- high-level requirements;
- high-level description, boundaries and key deliverables;
- overall project risk;
- summary milestone schedule;
- preapproved financial resources;
- key stakeholder list;
- approval requirements (what counts as success, who decides, who signs off);
- project exit criteria;
- the assigned project manager, their responsibility and authority level;
- the name and authority of the sponsor.

### Assumption log

The **assumption log** records assumptions and constraints throughout the life cycle. High-level ones come from the business case and the charter work; more detailed ones are added during planning.

## Where the charter goes

The charter feeds Develop Project Management Plan, Close Project or Phase, and the first planning processes of almost every Knowledge Area (Plan Scope, Collect Requirements, Define Scope, Plan Schedule, Plan Cost, Plan Quality, Plan Resource, Plan Communications, Plan Risk, Plan Procurement), as well as Identify Stakeholders and Plan Stakeholder Engagement.

> **Exam tip:** If a scenario says the PM is struggling to get resources from functional managers, ask whether there is a signed charter. The charter is what gives the PM authority to use organisational resources.`,
      keyTerms: [
        { term: 'Project charter', def: 'Issued by the project initiator or sponsor; formally authorises the project and gives the PM authority to apply resources.' },
        { term: 'Assumption log', def: 'A project document recording all assumptions and constraints throughout the life cycle.' },
        { term: 'Agreement', def: 'Any document or communication defining the initial intentions of a project, such as a contract, MOU or SLA.' },
      ],
    },
    {
      id: 'm04-l3',
      title: '4.2 Develop Project Management Plan',
      minutes: 30,
      topics: ['i-4.2-develop-pmp', 'i-pmp-components'],
      objectives: [
        'Explain baselining and why changes after baselining need formal control',
        'Distinguish project management plan components from project documents',
        'Explain the purpose and timing of the kick-off meeting',
      ],
      body: `## Purpose

This process defines, prepares and coordinates all the plan components and consolidates them into one **integrated project management plan**: the basis for all project work.

## Baselining

The plan must be **baselined**. At a minimum it needs scope, schedule and cost baselines, so performance can be measured against them.

- **Before** baselining, the plan can be updated freely.
- **After** baselining, it can change only through **Perform Integrated Change Control**.

The plan is progressively elaborated through controlled, approved updates until closing. If the project sits within a program or portfolio, its plan must also follow the program's rules; for example, a program rule that changes above a cost threshold must go to a change control board.

## What is in the plan

| Subsidiary management plans | Baselines | Additional components |
|---|---|---|
| Scope, requirements, schedule, cost, quality, resource, communications, risk, procurement, stakeholder engagement | **Scope baseline** (scope statement + WBS + WBS dictionary); **schedule baseline**; **cost baseline** | Change management plan; configuration management plan; performance measurement baseline; project life cycle description; development approach; management reviews |

The **performance measurement baseline (PMB)** is the integrated scope, schedule and cost baseline used to measure performance, for example in earned value management.

### Project documents are not the plan

Project documents (the issue log, risk register, stakeholder register, assumption log, lessons learned register, and so on) support the work but are **not** part of the project management plan.

> **Exam trap:** The project scope statement is a project document, **and** it is part of the scope baseline. The baseline is the *approved* version of the scope statement, WBS and WBS dictionary.

## Inputs and tools

The **charter** is the starting point. Outputs from the other planning processes (subsidiary plans and baselines) are integrated here, along with EEFs and OPAs such as templates, tailoring guidelines and change control procedures.

Expert judgment helps the PM decide how to tailor processes, which documents to place under formal change control, how much configuration management is needed, and how to prioritise work.

## The kick-off meeting

The kick-off meeting communicates the project's objectives, gains the team's commitment, and explains each stakeholder's roles and responsibilities. It is usually held at the **end of planning and the start of executing**.

- On a **small** project, the same team plans and executes, so the kick-off happens soon after initiation, during Planning.
- On a **large** project, a smaller management team does most of the planning and the wider team joins when development starts, so the kick-off happens during Executing.
- Multiphase projects usually hold a kick-off at the start of each phase.`,
      keyTerms: [
        { term: 'Baseline', def: 'The approved version of a work product that can be changed only through formal change control and is used for comparison.' },
        { term: 'Performance measurement baseline', def: 'Integrated scope, schedule and cost baselines used to manage, measure and control performance.' },
        { term: 'Configuration management plan', def: 'Describes how items are identified and accounted for, and how changes to them are recorded and reported, so the product stays consistent.' },
        { term: 'Change management plan', def: 'Describes how change requests are formally authorised and incorporated.' },
      ],
    },
    {
      id: 'm04-l4',
      title: '4.3 Direct and Manage Project Work and 4.4 Manage Project Knowledge',
      minutes: 30,
      topics: ['i-4.3-direct-manage', 'i-4.4-manage-knowledge', 'i-change-request-types'],
      objectives: [
        'Describe the outputs of Direct and Manage Project Work and where they go',
        'Distinguish corrective action, preventive action, defect repair and updates',
        'Distinguish explicit from tacit knowledge and explain how each is shared',
      ],
      body: `## 4.3 Direct and Manage Project Work

This is where the work in the plan is **led and performed**, and where **approved changes are implemented**. The PM and team allocate resources, manage interfaces, and carry out approved corrective actions, preventive actions and defect repairs.

**Key inputs:** the project management plan; project documents (such as the change log, risk register, project schedule and requirements traceability matrix); **approved change requests** from Perform Integrated Change Control.

**Tools:** expert judgment; the **PMIS** (scheduling software, work authorisation, configuration management and information systems); meetings (kick-off, technical, iteration planning, daily standups, steering group, retrospectives).

**Outputs and where they go:**

| Output | Goes to |
|---|---|
| **Deliverables** | Control Quality (verified), then Validate Scope (accepted) |
| **Work performance data** | Every controlling process (Validate Scope, Control Scope, Control Schedule, Control Costs, Control Quality, Control Resources, Monitor Communications, Monitor Risks, Control Procurements, Monitor Stakeholder Engagement) |
| **Issue log** | First created here; updated through monitoring and controlling |
| **Change requests** | Perform Integrated Change Control |
| Plan, document and OPA updates | As needed (plan updates via change requests) |

Once the first version of a deliverable is complete, it comes under change control, and configuration management keeps track of its versions.

## Issues and change requests

- An **issue** is a current problem, gap, inconsistency or conflict that needs action. It is recorded in the **issue log** with its owner, priority, target date and status.
- A **change request** is a formal proposal to modify a document, deliverable or baseline. Any stakeholder can raise one.

| Type of change | What it does |
|---|---|
| **Corrective action** | Realigns performance with the plan after a deviation has **already** happened |
| **Preventive action** | Ensures **future** performance stays aligned with the plan |
| **Defect repair** | Modifies a nonconforming product or component |
| **Update** | Changes a formally controlled document or plan to add or modify content |

> **Exam tip:** "The schedule has slipped two weeks, so we add a resource" is corrective. "Trends show we will slip next month, so we add a resource now" is preventive.

## 4.4 Manage Project Knowledge

This process uses existing knowledge and creates new knowledge, both to achieve the project's objectives and to contribute to organisational learning.

| Explicit knowledge | Tacit knowledge |
|---|---|
| Can be written down in words, numbers or pictures | Personal and hard to express: beliefs, insights, experience, know-how |
| Easy to store, but loses context and can be misread | Rich in context; shared through conversation and interaction |
| Handled by **information management** (lessons learned register, library services, PMIS) | Handled by **knowledge management** (networking, communities of practice, work shadowing, storytelling, workshops, knowledge fairs) |

Two common misconceptions: that knowledge management is just documenting things, and that it only happens at the end of the project.

The most important factor is a **culture of trust** in which people are motivated to share what they know. Tools do not help if people will not share. Face-to-face interaction builds trust best, and virtual interaction can then maintain it.

**Key output:** the **lessons learned register**. It is created early in this process and updated by many processes throughout the project. It records the category and description of each lesson, its impact, recommendations and proposed actions. At the end of a phase or the project, it is transferred to the organisation's lessons learned repository.`,
      keyTerms: [
        { term: 'Corrective action', def: 'An intentional activity that realigns performance of project work with the plan.' },
        { term: 'Preventive action', def: 'An intentional activity that ensures future performance aligns with the plan.' },
        { term: 'Defect repair', def: 'An intentional activity to modify a nonconforming product or component.' },
        { term: 'Tacit knowledge', def: 'Personal knowledge that is difficult to articulate and share, such as beliefs, experience and insight.' },
        { term: 'Lessons learned register', def: 'A project document recording knowledge gained during the project; created in Manage Project Knowledge and updated throughout.' },
      ],
    },
    {
      id: 'm04-l5',
      title: '4.5 Monitor and Control Project Work and 4.6 Perform Integrated Change Control',
      minutes: 35,
      topics: ['i-4.5-monitor-control-work', 'i-4.6-integrated-change-control'],
      objectives: [
        'Explain how work performance information becomes work performance reports',
        'Describe the steps and decision rights in integrated change control',
        'Distinguish configuration control from change control',
        'Name the three processes that receive approved change requests',
      ],
      body: `## 4.5 Monitor and Control Project Work

This process tracks, reviews and reports **overall** progress against the performance objectives in the plan. **Monitoring** means collecting and assessing measurements and trends. **Controlling** means deciding on corrective or preventive action, or replanning, and following up.

**Key input:** **work performance information** from every controlling process. Information means data compared with the plan; money spent, for example, only means something against the budget and the work performed.

**Data analysis techniques:**

- **Alternatives analysis**: choose which corrective action, or combination, to take.
- **Cost-benefit analysis**: find the most cost-effective corrective action.
- **Earned value analysis**: an integrated view of scope, schedule and cost.
- **Root cause analysis**: find the main reasons for a deviation.
- **Trend analysis**: forecast future performance from past results, giving early warning of problems.
- **Variance analysis**: compare planned and actual performance across cost, schedule, technical and resource dimensions.

**Key outputs:**

- **Work performance reports**: status reports, earned value graphs, trend lines and forecasts, reserve burndown charts, defect histograms, risk summaries, dashboards and stop-light charts. They go to Perform Integrated Change Control, Manage Team, Manage Communications and Monitor Risks.
- **Change requests**, plus plan and document updates.

## 4.6 Perform Integrated Change Control

This process reviews **all** change requests; approves, defers or rejects them; manages changes to deliverables, documents and the plan; and communicates the decisions. It runs from the start of the project to the end, and the PM is ultimately responsible for it.

### Rules to remember

- Once a baseline exists, **any** change that may affect it must go through this formal process.
- Any stakeholder can request a change, but a **verbal request must be recorded in writing** in the change or configuration management system.
- Each documented change request is approved, deferred or rejected by a **responsible individual or body** named in the plan. That is often the sponsor, the PM or a **change control board (CCB)**.
- A **CCB** is a formally chartered group that reviews, evaluates, approves, defers or rejects changes and records and communicates its decisions.
- Changes that do not affect a baseline are often within the PM's authority. Changes to baselines usually go to the CCB, and sometimes also need customer or sponsor approval.
- When a baseline changes, it changes **from that point forward**. Past performance is never rewritten.

### Typical flow

1. The change is identified and a change request is documented.
2. Its impact is analysed (scope, schedule, cost, quality, resources, risk), with alternatives considered.
3. The responsible authority (PM or CCB) decides: approve, defer or reject.
4. The decision is recorded in the **change log** and communicated to stakeholders.
5. Approved changes are implemented in Direct and Manage Project Work.
6. Their implementation is verified in Control Quality.

### Configuration control versus change control

| Configuration control | Change control |
|---|---|
| Focuses on the **specification** of deliverables and processes | Focuses on identifying, documenting, approving or rejecting **changes** to documents, deliverables and baselines |
| Activities: identify configuration items; record and report their status; verify and audit them | Activities: identify, document, decide on and track changes |

**Decision-making techniques:** voting (unanimity, majority or plurality), autocratic decisions, and multicriteria decision analysis (a decision matrix).

### Where approved changes go

Approved change requests go to **exactly three** processes:

- **4.3 Direct and Manage Project Work**, to implement them;
- **8.3 Control Quality**, to verify they were implemented correctly;
- **12.3 Control Procurements**, where the change affects a contract.

> **Exam tip:** A stakeholder asks a team member directly for "a small extra feature". The right answer is to have it documented as a change request and evaluated through integrated change control, not to just do it (gold plating), and not to refuse it outright.`,
      keyTerms: [
        { term: 'Change control board (CCB)', def: 'A formally constituted group responsible for reviewing, evaluating, approving, delaying or rejecting changes and recording decisions.' },
        { term: 'Change log', def: 'A comprehensive list of changes submitted and their current status.' },
        { term: 'Configuration management', def: 'Control of the specification of deliverables and processes: identifying items, recording status, verification and audit.' },
        { term: 'Work performance reports', def: 'The physical or electronic representation of work performance information intended to generate decisions, actions or awareness.' },
      ],
    },
    {
      id: 'm04-l6',
      title: '4.7 Close Project or Phase',
      minutes: 25,
      topics: ['i-4.7-close-project'],
      objectives: [
        'List the administrative and contractual closure activities',
        'Describe the key inputs and outputs of closing',
        'Explain what happens when a project is terminated early',
      ],
      body: `## Purpose

Close Project or Phase finalises all activities for the project, a phase or a contract. Its benefits: project information is archived, the planned work is completed, and team resources are released for new work.

## Activities

**Administrative closure** includes:

- confirming the exit criteria are met: deliverables accepted by the customer, issues resolved, documents up to date, all costs charged, accounts closed;
- reassigning personnel and dealing with surplus materials, facilities and equipment;
- collecting and archiving records and auditing project success or failure;
- managing knowledge sharing and transfer, and finalising lessons learned;
- **transferring the product** to the next phase or to operations;
- measuring stakeholder satisfaction;
- sending suggestions for improving organisational policies to the right unit.

**Contractual closure** includes confirming formal acceptance of the seller's work, finalising open claims, updating records and archiving the information.

If the project is **terminated early**, closing still happens. The team investigates and documents why it stopped and how finished and unfinished deliverables are handed over.

## Key inputs

- **Project charter**: the success criteria, approval requirements and who signs off.
- **Accepted deliverables** from Validate Scope. These may be partial for a cancelled or phased project.
- **Business documents**: did the business case outcomes occur, and were benefits achieved as planned?
- **Agreements** and **procurement documentation** for contract closure.
- Project documents: check the **issue log** for open issues and the **risk register and risk report** for open risks; finalise the **lessons learned register**.

## Tools

Expert judgment; data analysis (document analysis, **regression analysis** of the variables that drove outcomes, trend analysis, variance analysis); meetings (close-out reporting, customer wrap-up, lessons learned and celebration).

## Outputs

- **Final product, service or result transition** to the group that will operate, maintain and support it.
- **Final report**: a summary of performance against the scope, quality, cost and schedule objectives, with reasons for variances; a summary of validation; whether the benefits were achieved, or estimates of when they will be; and how risks and issues were handled.
- **Project document updates**, especially the final lessons learned register.
- **OPA updates**: project files, closure documents and the lessons learned repository.

> **Exam tip:** The final step of a project is administrative and organisational. Even when the customer has accepted the product, the PM is not finished until lessons learned are captured, records are archived and resources are released. In scenario questions, "archive project documents and update OPAs" is often the best final action.`,
      keyTerms: [
        { term: 'Final report', def: 'A summary of project performance (scope, quality, cost, schedule, benefits, risks and issues) produced at closure.' },
        { term: 'Administrative closure', def: 'Activities to satisfy exit criteria, archive information, transfer the product and release resources.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm04-q1',
      stem: 'Which responsibility cannot be delegated or transferred by the project manager?',
      options: ['Developing the WBS', 'Estimating activity durations', 'Accountability for project integration', 'Running quality audits'],
      answer: 2,
      explanation: 'Other Knowledge Areas can be handled by specialists, but the PM remains ultimately accountable for integrating the project as a whole.',
      topic: 'i-key-concepts',
      ref: 'PMBOK 6 §4 Key Concepts',
    },
    {
      id: 'm04-q2',
      stem: 'When should the project manager be assigned?',
      options: ['After the project management plan is approved', 'As early as feasible, preferably while the charter is developed and always before planning starts', 'At the kick-off meeting', 'Only after the business case is approved by the customer'],
      answer: 1,
      explanation: 'The Guide recommends assigning the PM as early as feasible: preferably while the charter is being developed, and always before planning begins.',
      topic: 'i-4.1-develop-charter',
      ref: 'PMBOK 6 §4.1',
    },
    {
      id: 'm04-q3',
      stem: 'Which item is typically included in a project charter?',
      options: ['The detailed WBS', 'Summary milestone schedule and preapproved financial resources', 'Activity duration estimates', 'The risk register'],
      answer: 1,
      explanation: 'The charter includes high-level information such as purpose, measurable objectives, high-level requirements, overall risk, summary milestones and preapproved financial resources. Detailed items come later in planning.',
      topic: 'i-4.1-develop-charter',
      ref: 'PMBOK 6 §4.1.3.1',
    },
    {
      id: 'm04-q5',
      stem: 'The project management plan has been baselined. A team lead wants to update the cost baseline to reflect a new supplier price. What must happen?',
      options: ['The PM updates the baseline directly', 'The change goes through Perform Integrated Change Control', 'The baseline cannot be changed once approved', 'The sponsor updates the business case instead'],
      answer: 1,
      explanation: 'After baselining, the plan and its baselines may be changed only through Perform Integrated Change Control.',
      topic: 'i-4.2-develop-pmp',
      ref: 'PMBOK 6 §4.2',
    },
    {
      id: 'm04-q6',
      stem: 'Which of the following is a project document rather than a component of the project management plan?',
      options: ['Schedule baseline', 'Risk management plan', 'Issue log', 'Configuration management plan'],
      answer: 2,
      explanation: 'The issue log is a project document. Baselines and subsidiary plans (including the configuration and change management plans) are plan components.',
      topic: 'i-pmp-components',
      ref: 'PMBOK 6 §4.2.3.1, Table 4-1',
    },
    {
      id: 'm04-q7',
      stem: 'On a large project, when is the kick-off meeting typically held?',
      options: ['Immediately after the charter is signed', 'During Executing, when the wider team joins at the start of development', 'During Closing', 'Before the business case is written'],
      answer: 1,
      explanation: 'On large projects a management team does most planning, and the kick-off is held as the rest of the team joins at the start of development, within Executing.',
      topic: 'i-4.2-develop-pmp',
      ref: 'PMBOK 6 §4.2.2.4',
    },
    {
      id: 'm04-q8',
      stem: 'Performance reports show the project is two weeks behind. The team adds overtime to recover. What type of change is this?',
      options: ['Preventive action', 'Corrective action', 'Defect repair', 'Update'],
      answer: 1,
      explanation: 'Corrective action realigns performance with the plan after a deviation has occurred. Preventive action addresses predicted future deviations.',
      topic: 'i-change-request-types',
      ref: 'PMBOK 6 §4.3.3.4',
    },
    {
      id: 'm04-q9',
      stem: 'Where are work performance data first produced?',
      options: ['Monitor and Control Project Work', 'Direct and Manage Project Work', 'Perform Integrated Change Control', 'Manage Communications'],
      answer: 1,
      explanation: 'Work performance data are raw observations collected while executing the work in Direct and Manage Project Work, then passed to the controlling processes.',
      topic: 'i-4.3-direct-manage',
      ref: 'PMBOK 6 §4.3.3.2',
    },
    {
      id: 'm04-q10',
      stem: 'An experienced engineer knows how to tune a machine but finds it hard to write down. How should the PM best transfer this knowledge to newer staff?',
      options: ['Ask the engineer to write a detailed manual only', 'Use work shadowing and conversation so the knowledge is shared through interaction', 'Add the engineer\'s name to the lessons learned register', 'Wait until project closure to capture lessons'],
      answer: 1,
      explanation: 'This is tacit knowledge, best shared through interaction (shadowing, storytelling, conversation) in an environment of trust. Codifying it alone loses context.',
      topic: 'i-4.4-manage-knowledge',
      ref: 'PMBOK 6 §4.4',
    },
    {
      id: 'm04-q11',
      stem: 'When is the lessons learned register created?',
      options: ['At project closure', 'Early in Manage Project Knowledge, then updated throughout the project', 'In Develop Project Charter', 'Only when a risk occurs'],
      answer: 1,
      explanation: 'The lessons learned register is created early in Manage Project Knowledge and updated by many processes. At closure, it is transferred to the lessons learned repository.',
      topic: 'i-4.4-manage-knowledge',
      ref: 'PMBOK 6 §4.4.3.1',
    },
    {
      id: 'm04-q12',
      stem: 'Which output of Monitor and Control Project Work goes to Perform Integrated Change Control, Manage Team, Manage Communications and Monitor Risks?',
      options: ['Work performance data', 'Work performance information', 'Work performance reports', 'Approved change requests'],
      answer: 2,
      explanation: 'Monitor and Control Project Work consolidates work performance information into work performance reports, which go to 4.6, 9.5, 10.2 and 11.7.',
      topic: 'i-4.5-monitor-control-work',
      ref: 'PMBOK 6 §4.5.3.1',
    },
    {
      id: 'm04-q13',
      stem: 'A key stakeholder calls a developer and asks for an extra report "since it\'s quick". What should happen?',
      options: ['The developer adds it to keep the stakeholder happy', 'The request is documented as a change request and evaluated through integrated change control', 'The PM rejects it because scope is baselined', 'The PM adds it to the next phase without analysis'],
      answer: 1,
      explanation: 'Verbal requests must be documented and processed through Perform Integrated Change Control so their impact can be assessed and a decision recorded and communicated.',
      topic: 'i-4.6-integrated-change-control',
      ref: 'PMBOK 6 §4.6',
    },
    {
      id: 'm04-q14',
      stem: 'Approved change requests from Perform Integrated Change Control are inputs to which processes?',
      options: ['Direct and Manage Project Work, Control Quality and Control Procurements', 'Every planning process', 'Monitor and Control Project Work only', 'Validate Scope and Control Scope'],
      answer: 0,
      explanation: 'Approved change requests go to 4.3 (implement), 8.3 (verify implementation) and 12.3 (contract changes).',
      topic: 'i-4.6-integrated-change-control',
      ref: 'PMBOK 6 §4.6, Figure 4-13',
    },
    {
      id: 'm04-q15',
      stem: 'Which activity is a focus of configuration control rather than change control?',
      options: ['Deciding whether to approve a change request', 'Recording and reporting the status of configuration items and auditing them', 'Communicating rejected changes to requesters', 'Estimating the cost impact of a change'],
      answer: 1,
      explanation: 'Configuration control focuses on the specification of deliverables and processes: identifying configuration items, recording and reporting their status, and verification and audit.',
      topic: 'i-4.6-integrated-change-control',
      ref: 'PMBOK 6 §4.6.2.2',
    },
    {
      id: 'm04-q16',
      stem: 'The customer has accepted all deliverables. What should the PM do next?',
      options: ['Release the team immediately and end the project', 'Complete closure: finalise lessons learned, archive records, transfer the product, release resources and produce the final report', 'Start a new change request for future enhancements', 'Ask the sponsor to close the project'],
      answer: 1,
      explanation: 'Acceptance is an input to Close Project or Phase. The PM still completes administrative closure, including knowledge transfer, archiving, final report and resource release.',
      topic: 'i-4.7-close-project',
      ref: 'PMBOK 6 §4.7',
    },
  ],
};
