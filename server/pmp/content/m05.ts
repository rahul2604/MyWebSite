import type { Module } from '../types.ts';

export const M05: Module = {
  id: 'M05',
  number: '5',
  title: 'Project Scope Management',
  summary: 'Planning scope, collecting requirements, defining scope, building the WBS, validating deliverables and controlling scope, in predictive and adaptive settings.',
  lessons: [
    {
      id: 'm05-l1',
      title: 'Scope overview and 5.1 Plan Scope Management',
      minutes: 25,
      topics: ['s-scope-overview', 's-5.1-plan-scope'],
      objectives: [
        'Distinguish product scope from project scope and how each is measured',
        'Contrast how scope is managed in predictive and adaptive life cycles',
        'Describe the scope management plan and the requirements management plan',
      ],
      body: `## What scope management is for

Project Scope Management makes sure the project includes **all the work required, and only the work required**, to finish successfully.

| Product scope | Project scope |
|---|---|
| The features and functions that characterise the product, service or result | The work performed to deliver that product, service or result |
| Completion measured against the **product requirements** | Completion measured against the **project management plan** |

A **requirement** is a condition or capability that must be present in a product, service or result to satisfy a business need, an agreement or a formally imposed specification.

## The six processes

| Process | Group | Key output |
|---|---|---|
| 5.1 Plan Scope Management | Planning | Scope management plan; requirements management plan |
| 5.2 Collect Requirements | Planning | Requirements documentation; requirements traceability matrix |
| 5.3 Define Scope | Planning | Project scope statement |
| 5.4 Create WBS | Planning | Scope baseline |
| 5.5 Validate Scope | Monitoring and Controlling | Accepted deliverables |
| 5.6 Control Scope | Monitoring and Controlling | Work performance information; change requests |

## Predictive versus adaptive

- **Predictive**: deliverables are defined at the start. Collect Requirements, Define Scope and Create WBS happen early, and later changes go through integrated change control. The **scope baseline** is the approved scope statement, WBS and WBS dictionary.
- **Adaptive (agile)**: the overall scope is broken down into a **product backlog**. Detailed scope is defined and approved for each iteration, so requirements, scope definition, validation and control repeat every iteration. Customer representatives stay continuously involved. Agile methods spend less time defining all scope up front and more time on the process of discovering and refining it, using prototypes and frequent releases to close the gap between the requirements people state and what the business actually needs.

## Trend: working with business analysis

Requirements management starts with a needs assessment and ends with requirements closure (handing them over to whoever will realise the benefits). If the project has a **business analyst**, requirements activities are that person's responsibility. The PM makes sure the requirements work is in the plan and delivers value on time and within budget. The relationship is a partnership.

## 5.1 Plan Scope Management

This process creates the **scope management plan**: how scope will be defined, developed, monitored, controlled and validated.

**Inputs:** the charter; the quality management plan, project life cycle description and development approach; EEFs; OPAs. **Tools:** expert judgment, alternatives analysis and meetings.

The scope management plan describes how to:

- prepare the project scope statement;
- create the WBS from the detailed scope statement;
- approve and maintain the scope baseline;
- obtain formal acceptance of completed deliverables.

The **requirements management plan** (sometimes called a business analysis plan) describes how requirements will be analysed, documented and managed. It covers how requirements activities are planned, tracked and reported; configuration management for requirements (how changes are started, analysed, traced and authorised); how requirements are prioritised; which metrics are used; and the traceability structure.`,
      keyTerms: [
        { term: 'Product scope', def: 'The features and functions that characterise a product, service or result.' },
        { term: 'Project scope', def: 'The work performed to deliver a product, service or result with the specified features and functions.' },
        { term: 'Scope management plan', def: 'Describes how the scope will be defined, developed, monitored, controlled and validated.' },
        { term: 'Requirements management plan', def: 'Describes how project and product requirements will be analysed, documented and managed.' },
      ],
    },
    {
      id: 'm05-l2',
      title: '5.2 Collect Requirements',
      minutes: 35,
      topics: ['s-5.2-collect-requirements', 's-5.2-requirements-techniques-outputs'],
      objectives: [
        'Choose an appropriate elicitation technique for a situation',
        'Distinguish unanimity, majority, plurality and autocratic decisions',
        'Classify requirements (business, stakeholder, solution, transition, project, quality)',
        'Explain the purpose and attributes of a requirements traceability matrix',
      ],
      body: `## Purpose

Collect Requirements determines, documents and manages stakeholder needs so they can become the basis for product and project scope. Requirements are the foundation of the WBS, and cost, schedule, quality and procurement planning all build on them. Success depends on **active stakeholder involvement**.

**Key inputs:** charter, scope and requirements management plans, the stakeholder engagement plan, the stakeholder register (who can provide requirements), the assumption log, lessons learned, the business case, and agreements.

## Elicitation techniques

| Technique | Best when |
|---|---|
| **Brainstorming** | You need many ideas quickly |
| **Interviews** | You need depth, or confidential information |
| **Focus groups** | Prequalified stakeholders and SMEs can discuss with a trained moderator |
| **Questionnaires and surveys** | The audience is large, varied or dispersed, and you need quick turnaround or statistics |
| **Benchmarking** | You want to compare with other organisations' products, processes or practices |
| **Document analysis** | Existing material (contracts, business rules, process flows, regulations, issue logs, use cases) holds requirements |
| **Nominal group technique** | You want brainstorming plus ranking. Steps: silent idea writing, record all ideas, discuss to understand, private voting |
| **Observation (job shadowing)** | Users struggle or are reluctant to describe what they do |
| **Facilitation workshops** | You need cross-functional agreement quickly. Examples: JAD in software, QFD (starting from the voice of the customer) in manufacturing, user-story workshops |
| **Context diagram** | You need to show how people and systems interact with the business system |
| **Prototypes and storyboards** | Stakeholders need to see a model before they can react |

**Organising ideas:** *affinity diagrams* sort many ideas into groups; *mind maps* combine individual brainstorming into one picture of shared and differing ideas.

## Group decision-making

| Method | How the decision is made |
|---|---|
| **Unanimity** | Everyone agrees on one course of action |
| **Majority** | More than 50% support. An odd-sized group avoids ties |
| **Plurality** | The largest block decides, even without a majority (useful with three or more options) |
| **Autocratic** | One person decides for the group |
| **Multicriteria decision analysis** | A decision matrix scores options against weighted criteria |

## Outputs

### Requirements documentation

Before a requirement is baselined it must be **unambiguous** (measurable and testable), **traceable**, **complete**, **consistent** and **acceptable** to key stakeholders. Requirement classes:

- **Business**: the organisation's high-level needs and its reasons for doing the project.
- **Stakeholder**: the needs of a stakeholder or group.
- **Solution**: **functional** requirements (behaviours, such as processes, data and interactions) and **non-functional** requirements (qualities such as reliability, security, performance and safety).
- **Transition and readiness**: temporary capabilities to move from the current to the future state, such as data conversion and training.
- **Project**: actions, processes or conditions the project must meet, such as milestone dates and contractual obligations.
- **Quality**: conditions that confirm a deliverable is complete, such as tests and certifications.

### Requirements traceability matrix (RTM)

The **RTM** is a grid that links each requirement from its origin to the deliverables that satisfy it. It helps make sure every requirement adds business value and is delivered, and it gives a structure for managing changes to product scope. Requirements are traced to business needs, project objectives, WBS deliverables, design, development, test strategy and test scenarios. Typical attributes include an ID, description, rationale, owner, source, priority, version, status and acceptance criteria.

> **Exam tip:** "A stakeholder asks why a feature exists and whether removing it affects any business objective." The tool that answers that is the requirements traceability matrix.`,
      keyTerms: [
        { term: 'Requirements traceability matrix', def: 'A grid linking product requirements from their origin to the deliverables that satisfy them.' },
        { term: 'Nominal group technique', def: 'Brainstorming followed by a voting process to rank the most useful ideas.' },
        { term: 'Plurality', def: 'A decision made by the largest block in a group, even if it is not a majority.' },
        { term: 'Non-functional requirement', def: 'A requirement describing conditions or qualities, such as reliability, security or performance.' },
      ],
    },
    {
      id: 'm05-l3',
      title: '5.3 Define Scope and 5.4 Create WBS',
      minutes: 35,
      topics: ['s-5.3-define-scope', 's-5.4-create-wbs'],
      objectives: [
        'Contrast the project charter with the project scope statement',
        'Decompose deliverables to work packages and apply the 100 percent rule',
        'Define control account, planning package, work package and WBS dictionary',
      ],
      body: `## 5.3 Define Scope

Define Scope develops a **detailed description** of the project and the product. Not every requirement collected is included; this process selects the final requirements. In iterative life cycles, the whole project has a high-level vision, and detailed scope is set one iteration at a time.

**Tools:** expert judgment; alternatives analysis; multicriteria decision analysis; facilitation workshops; and **product analysis**, which asks questions about a product to turn high-level descriptions into tangible deliverables (product breakdown, systems analysis, value engineering and similar).

### The project scope statement

The scope statement includes:

- **Product scope description**, progressively elaborated.
- **Deliverables**, including ancillary results such as reports and documentation.
- **Acceptance criteria**: the conditions that must be met before deliverables are accepted.
- **Project exclusions**: what is explicitly out of scope. Exclusions manage expectations and reduce scope creep.

| Project charter | Project scope statement |
|---|---|
| High-level: purpose, measurable objectives, high-level requirements, summary milestones, preapproved budget, overall risk, key stakeholders, approval requirements, exit criteria, PM and sponsor authority | Detailed: product scope description, deliverables, acceptance criteria, exclusions |

## 5.4 Create WBS

The **work breakdown structure (WBS)** is a hierarchical decomposition of the **total scope of work** the team must carry out to meet the objectives and produce the deliverables. In a WBS, "work" means **work products or deliverables**, not activities; activities are defined later, in Schedule Management.

### Decomposition

1. Identify and analyse the deliverables and related work.
2. Structure and organise the WBS.
3. Decompose the upper levels into lower, more detailed components.
4. Develop and assign identification codes.
5. Verify that the level of decomposition is appropriate.

Decompose down to **work packages**: the level at which cost and duration can be estimated and managed. Too little decomposition makes control hard; too much wastes effort. Work far in the future may not be decomposable yet, so it is detailed later (rolling wave planning). Level 2 can be organised by phase or by major deliverable, and subcontracted parts can have a separate contract WBS. In agile, **epics** decompose into **user stories**.

> **Key rule:** **The 100 percent rule.** The WBS includes all of the product and project work, including project management. The lower levels add up exactly to their parent, so nothing is left out and nothing extra is done.

### The scope baseline

**Scope baseline = approved project scope statement + WBS + WBS dictionary.** It can be changed only through formal change control.

| Term | Meaning |
|---|---|
| **Work package** | The lowest level of the WBS, with a unique identifier; cost and duration are estimated and managed here |
| **Control account** | A management control point where scope, budget and schedule are integrated and compared with earned value. Each contains one or more work packages, and each work package belongs to exactly one control account |
| **Planning package** | Below a control account and above work packages; the work content is known but detailed activities are not yet defined |
| **Code of accounts** | The numbering system for WBS components, used to roll up cost, schedule and resource information |
| **WBS dictionary** | Detail for each WBS component: description of work, assumptions and constraints, responsible organisation, milestones, activities, resources, cost estimates, quality requirements, acceptance criteria and technical references |`,
      keyTerms: [
        { term: 'Project scope statement', def: 'Description of the project scope, major deliverables, acceptance criteria, assumptions, constraints and exclusions.' },
        { term: 'WBS', def: 'A hierarchical decomposition of the total scope of work to be carried out by the project team.' },
        { term: 'Work package', def: 'The work defined at the lowest level of the WBS, for which cost and duration are estimated and managed.' },
        { term: 'Control account', def: 'A management control point where scope, budget, actual cost and schedule are integrated and compared to earned value.' },
        { term: 'Scope baseline', def: 'The approved version of the scope statement, WBS and WBS dictionary.' },
      ],
    },
    {
      id: 'm05-l4',
      title: '5.5 Validate Scope and 5.6 Control Scope',
      minutes: 25,
      topics: ['s-5.5-validate-scope', 's-5.6-control-scope', 's-5.6-control-scope-detail'],
      objectives: [
        'Distinguish Validate Scope from Control Quality',
        'Describe the flow from deliverables to verified to accepted deliverables',
        'Define scope creep and gold plating and explain how Control Scope prevents them',
      ],
      body: `## 5.5 Validate Scope

Validate Scope **formalises acceptance** of completed deliverables by the customer or sponsor. Validating each deliverable as it is finished makes acceptance more objective and makes final acceptance more likely.

### The deliverable flow

1. **Direct and Manage Project Work** produces *deliverables*.
2. **Control Quality** checks they are correct and meet quality requirements: *verified deliverables*.
3. **Validate Scope** reviews them with the customer or sponsor for formal sign-off: *accepted deliverables*.
4. **Close Project or Phase** receives the accepted deliverables.

| Control Quality | Validate Scope |
|---|---|
| Concerned with **correctness** and meeting quality requirements | Concerned with **acceptance** of the deliverables |
| Usually performed by the project team or quality staff | Performed with the customer or sponsor |
| Usually performed **first** | Usually follows Control Quality, though they can run in parallel |

**Tools:** **inspection** (measuring, examining and validating against requirements and acceptance criteria; also called reviews, product reviews or walkthroughs) and group decision-making such as voting.

**Outputs:** accepted deliverables; work performance information (what was accepted, what was not, and why); **change requests** for deliverables that were not accepted (often defect repair); and updates to the lessons learned register, requirements documentation and RTM.

## 5.6 Control Scope

Control Scope monitors the status of project and product scope and manages changes to the **scope baseline**. It makes sure all requested changes and recommended actions go through Perform Integrated Change Control.

- **Scope creep** is the *uncontrolled* expansion of product or project scope without adjusting time, cost and resources.
- **Gold plating** (a common exam term, not used in the Guide) is the team adding extras the customer did not ask for. It is also unapproved scope and should be avoided.

**Tools:** **variance analysis** (comparing the baseline with actual results, and deciding whether a variance is within thresholds or needs action) and **trend analysis** (whether performance is improving or getting worse over time).

**Outputs:** work performance information, change requests, and updates to the plan (scope, schedule, cost and performance measurement baselines) and to project documents. A baseline can also be revised when variances are so severe that the current one no longer gives a realistic basis for measuring performance; that revision still goes through change control.

> **Exam tip:** A team member quietly adds a "nice" feature the customer did not request. That is gold plating. The PM should stop unapproved work and, if the feature has value, raise a change request.`,
      keyTerms: [
        { term: 'Validate Scope', def: 'The process of formalising acceptance of the completed project deliverables.' },
        { term: 'Verified deliverables', def: 'Completed deliverables checked and confirmed for correctness through Control Quality.' },
        { term: 'Scope creep', def: 'The uncontrolled expansion of product or project scope without adjustments to time, cost and resources.' },
        { term: 'Inspection', def: 'Examining a work product to determine whether it conforms to documented standards and requirements.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm05-q1',
      stem: 'Completion of product scope is measured against:',
      options: ['The project management plan', 'The product requirements', 'The schedule baseline', 'The business case'],
      answer: 1,
      explanation: 'Product scope completion is measured against the product requirements; project scope completion against the project management plan.',
      topic: 's-scope-overview',
      ref: 'PMBOK 6 §5 Key Concepts',
    },
    {
      id: 'm05-q2',
      stem: 'On an agile project, how is detailed scope typically handled?',
      options: ['Fully defined and baselined during initiation', 'Defined and approved before each iteration from a prioritised backlog', 'Defined by the PMO for each release', 'Not defined until the final iteration'],
      answer: 1,
      explanation: 'In adaptive life cycles, overall scope is held in a product backlog and detailed scope is defined and approved per iteration.',
      topic: 's-scope-overview',
      ref: 'PMBOK 6 §5 Key Concepts',
    },
    {
      id: 'm05-q3',
      stem: 'Which plan describes how requirements will be analysed, documented, prioritised and traced?',
      options: ['Scope management plan', 'Requirements management plan', 'Configuration management plan', 'Quality management plan'],
      answer: 1,
      explanation: 'The requirements management plan covers how requirements activities are planned, tracked and reported, prioritisation, metrics and the traceability structure.',
      topic: 's-5.1-plan-scope',
      ref: 'PMBOK 6 §5.1.3.2',
    },
    {
      id: 'm05-q4',
      stem: 'Users of a legacy system find it hard to explain how they do their work. Which elicitation technique is most suitable?',
      options: ['Questionnaires', 'Observation (job shadowing)', 'Benchmarking', 'Multicriteria decision analysis'],
      answer: 1,
      explanation: 'Observation is useful when users find it difficult or are reluctant to articulate requirements; watching them work uncovers hidden requirements.',
      topic: 's-5.2-requirements-techniques-outputs',
      ref: 'PMBOK 6 §5.2.2.6',
    },
    {
      id: 'm05-q5',
      stem: 'Five options are voted on. Option C gets 35% of the votes, more than any other, and is selected. Which decision method was used?',
      options: ['Unanimity', 'Majority', 'Plurality', 'Autocratic'],
      answer: 2,
      explanation: 'Plurality selects the option supported by the largest block, even without a majority (over 50%).',
      topic: 's-5.2-collect-requirements',
      ref: 'PMBOK 6 §5.2.2.4',
    },
    {
      id: 'm05-q6',
      stem: 'A requirement states "the system must respond within 2 seconds for 95% of searches." What class of requirement is this?',
      options: ['Business requirement', 'Functional requirement', 'Non-functional requirement', 'Transition requirement'],
      answer: 2,
      explanation: 'Performance is a quality or condition of the solution, making it a non-functional requirement.',
      topic: 's-5.2-requirements-techniques-outputs',
      ref: 'PMBOK 6 §5.2.3.1',
    },
    {
      id: 'm05-q7',
      stem: 'Which tool links each requirement to its business objective and to the deliverables and tests that satisfy it?',
      options: ['WBS dictionary', 'Requirements traceability matrix', 'Responsibility assignment matrix', 'Issue log'],
      answer: 1,
      explanation: 'The requirements traceability matrix links requirements from their origin to the deliverables that satisfy them across the life cycle.',
      topic: 's-5.2-requirements-techniques-outputs',
      ref: 'PMBOK 6 §5.2.3.2',
    },
    {
      id: 'm05-q8',
      stem: 'Which item appears in the project scope statement but typically not in the project charter?',
      options: ['Summary milestone schedule', 'Project exclusions and detailed acceptance criteria', 'Name and authority of the sponsor', 'Preapproved financial resources'],
      answer: 1,
      explanation: 'The scope statement adds detail: product scope description, deliverables, acceptance criteria and exclusions. Milestones, sponsor authority and preapproved funds are charter items.',
      topic: 's-5.3-define-scope',
      ref: 'PMBOK 6 §5.3.3.1, Table 5-1',
    },
    {
      id: 'm05-q9',
      stem: 'The scope baseline consists of:',
      options: ['Scope statement, WBS and WBS dictionary', 'Requirements documentation and RTM', 'Scope management plan and WBS', 'WBS and schedule baseline'],
      answer: 0,
      explanation: 'The scope baseline is the approved version of the project scope statement, WBS and WBS dictionary.',
      topic: 's-5.4-create-wbs',
      ref: 'PMBOK 6 §5.4.3.1',
    },
    {
      id: 'm05-q10',
      stem: 'The sum of the work at the lowest levels of the WBS rolls up exactly to the higher levels so that nothing is left out and no extra work is done. This is called:',
      options: ['Rolling wave planning', 'Progressive elaboration', 'The 100 percent rule', 'Decomposition'],
      answer: 2,
      explanation: 'The 100 percent rule means the WBS represents all product and project work, including project management, with no omissions and no extra work.',
      topic: 's-5.4-create-wbs',
      ref: 'PMBOK 6 §5.4.2.2',
    },
    {
      id: 'm05-q11',
      stem: 'Where are scope, budget and schedule integrated and compared with earned value for performance measurement?',
      options: ['Work package', 'Planning package', 'Control account', 'Activity'],
      answer: 2,
      explanation: 'A control account is a management control point where scope, budget, actual cost and schedule are integrated and compared to earned value.',
      topic: 's-5.4-create-wbs',
      ref: 'PMBOK 6 §5.4.3.1',
    },
    {
      id: 'm05-q12',
      stem: 'What is the main difference between Validate Scope and Control Quality?',
      options: ['Validate Scope checks correctness; Control Quality obtains acceptance', 'Validate Scope is concerned with acceptance of deliverables; Control Quality with their correctness against quality requirements', 'They are the same process in different Knowledge Areas', 'Control Quality is done only at project closure'],
      answer: 1,
      explanation: 'Control Quality verifies correctness; Validate Scope obtains formal acceptance from the customer or sponsor. Control Quality is generally performed first.',
      topic: 's-5.5-validate-scope',
      ref: 'PMBOK 6 §5.5',
    },
    {
      id: 'm05-q13',
      stem: 'During Validate Scope the customer rejects a deliverable. What is the most likely output?',
      options: ['Accepted deliverables', 'A change request, possibly for defect repair', 'An updated project charter', 'A closed issue log'],
      answer: 1,
      explanation: 'Deliverables not accepted are documented with reasons and may require a change request for defect repair, processed through integrated change control.',
      topic: 's-5.5-validate-scope',
      ref: 'PMBOK 6 §5.5.3.3',
    },
    {
      id: 'm05-q14',
      stem: 'Features keep being added at stakeholders\' informal request without any change to budget or schedule. What is this called, and what process should prevent it?',
      options: ['Progressive elaboration; Define Scope', 'Scope creep; Control Scope with integrated change control', 'Rolling wave planning; Create WBS', 'Gold plating; Validate Scope'],
      answer: 1,
      explanation: 'Uncontrolled expansion of scope without adjusting time, cost and resources is scope creep. Control Scope ensures requested changes go through Perform Integrated Change Control.',
      topic: 's-5.6-control-scope',
      ref: 'PMBOK 6 §5.6',
    },
  ],
};
