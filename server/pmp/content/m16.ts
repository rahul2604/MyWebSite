import type { Module } from '../types.ts';

export const M16: Module = {
  id: 'M16',
  number: '16',
  title: 'Appendices and glossary revision',
  summary: 'What changed in the Sixth Edition, tool and technique groups, Process Groups in adaptive environments, key concepts and tailoring summaries, and precise glossary terms.',
  lessons: [
    {
      id: 'm16-l1',
      title: 'Sixth Edition changes and tool-and-technique groups',
      minutes: 20,
      topics: ['x1-sixth-edition-changes', 'x6-tools-techniques-index'],
      objectives: [
        'Name the processes added, moved, removed and renamed in the Sixth Edition',
        'Classify tools and techniques into their groups',
      ],
      body: `## Why the processes changed

The Sixth Edition (2017) aligned the Guide with ISO 21500 and with other PMI standards, and drew on research into what project managers actually do. Its main changes:

| Change | Detail |
|---|---|
| **New processes** | 4.4 Manage Project Knowledge; 9.6 Control Resources; 11.6 Implement Risk Responses |
| **Moved** | Estimate Activity Resources moved from Schedule to Resource (now 9.2) |
| **Removed** | Close Procurements: its evaluation work moved into Control Procurements, and its administrative work into Close Project or Phase, because few PMs have authority to close contracts |
| **Knowledge Areas renamed** | Time → **Schedule**; Human Resource → **Resource** (team *and* physical resources) |
| **Processes renamed** | Perform Quality Assurance → **Manage Quality**; Control Communications → **Monitor Communications**; Control Risks → **Monitor Risks**; Plan Stakeholder Management → **Plan Stakeholder Engagement**; Control Stakeholder Engagement → **Monitor Stakeholder Engagement**; Acquire/Develop/Manage Project Team → **Acquire Resources / Develop Team / Manage Team** |

The thinking behind the renames: risks and stakeholders cannot be *controlled*, only monitored and engaged.

Other additions:

- Every Knowledge Area chapter now has sections on key concepts, trends and emerging practices, tailoring considerations, and considerations for **adaptive environments**.
- The **escalate** risk response was added, and there is more emphasis on overall project risk.
- *Communication* (the act) is distinguished from *communications* (the artefacts).

## Tool and technique groups

The Sixth Edition groups tools and techniques by **intent**. The members of a group are alternative ways to achieve that intent.

| Group | Examples |
|---|---|
| **Data gathering** | Benchmarking, brainstorming, check sheets, checklists, focus groups, interviews, market research, questionnaires and surveys, statistical sampling |
| **Data analysis** | Alternatives analysis, cost-benefit analysis, earned value analysis, root cause analysis, reserve analysis, SWOT, trend and variance analysis, simulation, decision tree analysis |
| **Data representation** | Affinity diagrams, cause-and-effect diagrams, control charts, flowcharts, histograms, mind mapping, probability and impact matrix, stakeholder engagement assessment matrix |
| **Decision making** | Multicriteria decision analysis, voting |
| **Communication skills** | Feedback, presentations |
| **Interpersonal and team skills** | Active listening, conflict management, emotional intelligence, facilitation, influencing, leadership, negotiation, networking, political awareness, team building |

Appendix X6 indexes **132** tools and techniques. Of these, 72 are in the six groups (9 data gathering, 27 data analysis, 15 data representation, 2 decision making, 2 communication skills and 17 interpersonal and team skills), and 60 are ungrouped (such as expert judgment, meetings, decomposition and the critical path method).

> **Source note:** A few cells in the X6 index table do not match the process figures in the chapters. This course uses the chapter figures for which tool belongs to which process, and uses X6 only for the groupings and counts.`,
      keyTerms: [
        { term: 'Data analysis (group)', def: 'Tools used to organise, assess and evaluate data, such as alternatives, root cause and variance analysis.' },
        { term: 'Interpersonal and team skills (group)', def: 'Skills used to lead and interact with team members and stakeholders, such as conflict management and facilitation.' },
      ],
    },
    {
      id: 'm16-l2',
      title: 'Adaptive environments and Knowledge Area summaries',
      minutes: 25,
      topics: ['x3-life-cycle-continuum', 'x3-process-groups-adaptive', 'x4-x5-summaries'],
      objectives: [
        'Place predictive, iterative, incremental and agile life cycles on a continuum',
        'Describe how each Process Group behaves in adaptive environments',
        'Use the key concepts and tailoring summaries for revision',
      ],
      body: `## The life cycle continuum

| Characteristic | Predictive | Iterative / incremental | Agile |
|---|---|---|---|
| Requirements | Defined **up front** | Elaborated at **periodic intervals** | Elaborated **frequently** during delivery |
| Delivery | Single final product at the end | In subsets | Frequent, customer-valued increments |
| Change | Constrained as much as possible | Built in at periodic intervals | Incorporated in **real time** |
| Stakeholder involvement | At specific **milestones** | **Regular** | **Continuous** |
| Risk and cost control | Detailed planning of mostly knowable factors | Progressive elaboration of plans | As requirements and constraints emerge |

Different phases of one project, or different projects in a program, can use different life cycles.

**Iteration-based phases** repeat all the Process Groups within each timeboxed iteration, which gives a predictable rhythm. **Continuous, overlapping phases** (inspired by lean, as in Kanban) perform all the Process Groups continuously, pulling work from a prioritised list without the overhead of starting and ending iterations.

## Process Groups in adaptive environments

| Process Group | Adaptive behaviour |
|---|---|
| **Initiating** | The charter is revisited often; a knowledgeable customer representative gives continuous feedback; there is usually a short initiating step each cycle |
| **Planning** | A high-level plan, elaborated each cycle; involve as many team members and stakeholders as possible |
| **Executing** | Short fixed iterations, each ending with a **demonstration**, then a **retrospective**. Iteration trends (speed, spend, defects) are extrapolated to forecast completion. The team self-organises its tasks |
| **Monitoring and Controlling** | One **prioritised backlog** holds the work, change requests and defects. Stakeholders manage the work, control change and validate scope through it. Trends are shown on **information radiators** |
| **Closing** | Because the highest-value items are done first, an early close has probably already delivered business value: an early benefit or proof of concept, not a sunk cost |

## Key concepts and tailoring (Appendices X4 and X5)

Appendix X4 collects the "key concepts" section of every Knowledge Area chapter, and X5 collects the "tailoring considerations". They are useful revision checklists. The main points:

- **Integration**: the PM alone is accountable for integration.
- **Scope**: all the work and only the work; the product backlog in agile.
- **Schedule**: adaptive and on-demand scheduling.
- **Cost**: influence is greatest early; life-cycle costing.
- **Quality**: prevention over inspection; the cost of quality.
- **Resource**: team and physical resources; emotional intelligence.
- **Communications**: strategy and artefacts; the 5Cs.
- **Risk**: individual and overall risk; thresholds; resilience.
- **Procurement**: legal obligations; contract types.
- **Stakeholder**: early and continuous engagement; co-creation.

> **Source note:** Appendix X4.1 refers to a "benefits realization plan" where Section 4 says "benefits management plan". They mean the same document.`,
      keyTerms: [
        { term: 'Information radiator', def: 'A visible display of trend and progress information, such as charts posted for the team and stakeholders.' },
        { term: 'Retrospective', def: 'A regularly occurring workshop in which participants explore their work and results to improve process and product.' },
      ],
    },
    {
      id: 'm16-l3',
      title: 'Glossary precision: terms the exam tests',
      minutes: 25,
      topics: ['g-glossary-scope-acronyms', 'g-glossary-a-c', 'g-glossary-c-s', 'g-glossary-s-w'],
      objectives: [
        'Distinguish commonly confused pairs of terms',
        'Expand common acronyms',
      ],
      body: `## Commonly confused pairs

| Term | versus | Term |
|---|---|---|
| **Validation**: assurance the product meets the needs of the customer and other stakeholders (Validate Scope) | | **Verification**: evaluation of compliance with a regulation, requirement, specification or imposed condition (Control Quality) |
| **Issue**: a current condition that may affect objectives | | **Risk**: an uncertain *future* event or condition |
| **Change**: a modification to a *formally controlled* item | | **Update**: a modification to something *not* under formal change control |
| **Duration**: the number of work periods | | **Effort**: the number of labour units |
| **Contingency reserve**: within the baseline, for known risks with active responses | | **Management reserve**: outside the performance measurement baseline, for unforeseen work within scope |
| **Resource leveling**: may change the critical path | | **Resource smoothing**: uses float without changing the critical path |
| **Data**: raw observations | **Information**: data processed for a purpose | **Knowledge**: experience, values, context and insight used to make sense of new experiences |
| **Tool**: something tangible, such as a template or software | | **Technique**: a defined, systematic procedure carried out by a person |
| **Control limits**: ±3 standard deviations around the mean of a stable process | | **Specification limits**: the range that meets customer requirements; can be wider or narrower than the control limits |
| **Procurement documents**: bid documents (IFB, RFI, RFQ, RFP) and seller responses | | **Procurement documentation**: all documents used to sign, carry out and close an agreement |
| **Regulation**: a requirement imposed by government | | **Standard**: established by authority, custom or general consent as a model |

## Other precise definitions

- **Assumption**: a factor considered true, real or certain, without proof.
- **Constraint**: a limiting factor that affects how a project, program, portfolio or process is carried out.
- **Authority**: the right to apply resources, spend funds, make decisions or give approvals.
- **Responsibility**: an assignment that can be delegated and creates a duty to perform.
- **Risk exposure**: an aggregate measure of the potential impact of all risks at a point in time.
- **Level of effort (LOE)**: an activity that produces no definitive end product and is measured by the passage of time. A **discrete effort** produces a specific, measurable output. *(The glossary mentions a third EVM activity type, apportioned effort, without defining it.)*
- **Threshold**: a predetermined value of a measurable variable that requires action if it is reached.
- **Tolerance**: the quantified acceptable variation for a quality requirement.
- **Voice of the customer**: translating customer requirements into technical requirements for each phase of product development.

## Acronyms to know

| Acronym | Meaning |
|---|---|
| AC, PV, EV, BAC | Actual cost, planned value, earned value, budget at completion |
| CV, SV, CPI, SPI | Cost and schedule variance; cost and schedule performance index |
| EAC, ETC, VAC, TCPI | Estimate at completion, estimate to complete, variance at completion, to-complete performance index |
| ES, EF, LS, LF | Early start, early finish, late start, late finish |
| FS, FF, SS, SF | The four precedence relationships |
| FFP, FPIF, FPEPA | Firm fixed price; fixed price incentive fee; fixed price with economic price adjustment |
| CPFF, CPIF, CPAF, T&M | Cost plus fixed, incentive and award fee; time and material |
| OBS, RBS, RAM, RACI | Organisational and risk breakdown structures; responsibility assignment matrix; responsible, accountable, consulted, informed |
| RFI, RFQ, RFP, IFB, SOW | Requests for information, quotation and proposal; invitation for bid; statement of work |
| COQ, QFD, PDM, CCB | Cost of quality; quality function deployment; precedence diagramming method; change control board |

> **Source note:** In the glossary's acronym list, **RBS** stands for *risk* breakdown structure, but the body also uses "resource breakdown structure". Always spell out which one you mean.`,
      keyTerms: [
        { term: 'Validation', def: 'The assurance that a product, service or result meets the needs of the customer and other stakeholders.' },
        { term: 'Verification', def: 'The evaluation of whether a product, service or result complies with a regulation, requirement, specification or imposed condition.' },
        { term: 'Issue', def: 'A current condition or situation that may have an impact on the project objectives.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm16-q1',
      stem: 'Which three processes were added in the PMBOK Guide Sixth Edition?',
      options: ['Manage Project Knowledge, Control Resources, Implement Risk Responses', 'Close Procurements, Control Risks, Plan Stakeholder Management', 'Collect Requirements, Validate Scope, Create WBS', 'Develop Team, Manage Team, Acquire Resources'],
      answer: 0,
      explanation: 'The Sixth Edition added 4.4 Manage Project Knowledge, 9.6 Control Resources and 11.6 Implement Risk Responses.',
      topic: 'x1-sixth-edition-changes',
      ref: 'PMBOK 6 Appendix X1',
    },
    {
      id: 'm16-q2',
      stem: 'Why was "Control Risks" renamed "Monitor Risks"?',
      options: ['To shorten the name', 'Because risks cannot be controlled, only monitored', 'Because risk moved to the Planning group', 'To align with agile terminology only'],
      answer: 1,
      explanation: 'Research showed PMs monitor rather than control risks and stakeholders; risks cannot be controlled, only monitored.',
      topic: 'x1-sixth-edition-changes',
      ref: 'PMBOK 6 Appendix X1',
    },
    {
      id: 'm16-q3',
      stem: 'Root cause analysis belongs to which tool-and-technique group?',
      options: ['Data gathering', 'Data analysis', 'Data representation', 'Interpersonal and team skills'],
      answer: 1,
      explanation: 'Root cause analysis is a data analysis technique.',
      topic: 'x6-tools-techniques-index',
      ref: 'PMBOK 6 Appendix X6',
    },
    {
      id: 'm16-q4',
      stem: 'On an adaptive project, how are change requests and defect reports typically handled?',
      options: ['Through a separate CCB for every item', 'Evaluated and prioritised into the same backlog as the planned work', 'Deferred until the final iteration', 'Ignored until the release'],
      answer: 1,
      explanation: 'Adaptive projects maintain a single prioritised backlog containing work, change requests and defects; stakeholders manage work and perform change control through it.',
      topic: 'x3-process-groups-adaptive',
      ref: 'PMBOK 6 Appendix X3.3',
    },
    {
      id: 'm16-q5',
      stem: 'An agile project is closed early. According to Appendix X3, why is this often less of a loss than in predictive projects?',
      options: ['Agile projects have no budget', 'The highest-value items were done first, so business value has likely already been delivered', 'Agile contracts forbid cancellation', 'Closure is not required in agile'],
      answer: 1,
      explanation: 'Because the most valuable work is delivered first, premature closure is more likely to represent early benefit realisation than a sunk-cost failure.',
      topic: 'x3-process-groups-adaptive',
      ref: 'PMBOK 6 Appendix X3.3',
    },
    {
      id: 'm16-q6',
      stem: 'On the life cycle continuum, which approach incorporates change in real time with continuous stakeholder involvement?',
      options: ['Predictive', 'Iterative', 'Incremental', 'Agile'],
      answer: 3,
      explanation: 'Agile life cycles elaborate requirements frequently, incorporate change in real time and involve stakeholders continuously.',
      topic: 'x3-life-cycle-continuum',
      ref: 'PMBOK 6 Appendix X3, Figure X3-1',
    },
    {
      id: 'm16-q7',
      stem: 'What is the difference between validation and verification?',
      options: ['They are synonyms', 'Validation confirms the product meets customer and stakeholder needs; verification checks compliance with requirements or specifications', 'Verification is done by the customer; validation by the team', 'Validation is only for software'],
      answer: 1,
      explanation: 'Validation (as in Validate Scope) assures the product meets customer needs; verification (as in Control Quality) evaluates compliance with specifications.',
      topic: 'g-glossary-s-w',
      ref: 'PMBOK 6 Glossary',
    },
    {
      id: 'm16-q8',
      stem: 'A key supplier has just gone bankrupt and deliveries have stopped. Is this a risk or an issue?',
      options: ['A risk, because it is uncertain', 'An issue, because it is a current condition affecting the project', 'Neither', 'A constraint'],
      answer: 1,
      explanation: 'An issue is a current condition that may affect objectives; a risk is an uncertain future event. Once it has happened, it is an issue.',
      topic: 'g-glossary-c-s',
      ref: 'PMBOK 6 Glossary',
    },
    {
      id: 'm16-q9',
      stem: 'Which statement about control limits is consistent with the glossary?',
      options: ['They are set by the customer contract', 'They are typically three standard deviations either side of the mean of a stable process', 'They are always wider than specification limits', 'They are the same as tolerances'],
      answer: 1,
      explanation: 'The glossary describes control limits as the area of three standard deviations on either side of the centreline of a normal distribution, reflecting expected variation.',
      topic: 'g-glossary-a-c',
      ref: 'PMBOK 6 Glossary',
    },
    {
      id: 'm16-q10',
      stem: 'A modification to a document that is NOT under formal change control is called:',
      options: ['A change', 'An update', 'A defect repair', 'A corrective action'],
      answer: 1,
      explanation: 'The glossary defines an update as a modification to any deliverable, plan component or document not under formal change control; a change modifies a formally controlled item.',
      topic: 'g-glossary-s-w',
      ref: 'PMBOK 6 Glossary',
    },
  ],
};
