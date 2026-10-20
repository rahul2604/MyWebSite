import type { Module } from '../types.ts';

export const M15: Module = {
  id: 'M15',
  number: '15',
  title: 'The five Process Groups end to end',
  summary: 'All 49 processes mapped to Process Groups and Knowledge Areas, and the flow of a project through Initiating, Planning, Executing, Monitoring and Controlling, and Closing.',
  lessons: [
    {
      id: 'm15-l1',
      title: 'The 49-process map',
      minutes: 30,
      topics: ['f-process-map', 'std-process-groups'],
      objectives: [
        'Place every process in its Process Group and Knowledge Area',
        'Explain process frequency and how outputs flow between processes',
        'Explain why Process Groups are not phases',
      ],
      body: `## Counting the processes

| Process Group | Number of processes |
|---|---|
| Initiating | **2** |
| Planning | **24** |
| Executing | **10** |
| Monitoring and Controlling | **12** |
| Closing | **1** |
| **Total** | **49** |

## The full map

| Knowledge Area | Initiating | Planning | Executing | Monitoring and Controlling | Closing |
|---|---|---|---|---|---|
| 4 Integration | 4.1 Develop Project Charter | 4.2 Develop Project Management Plan | 4.3 Direct and Manage Project Work; 4.4 Manage Project Knowledge | 4.5 Monitor and Control Project Work; 4.6 Perform Integrated Change Control | 4.7 Close Project or Phase |
| 5 Scope | | 5.1 Plan Scope Mgmt; 5.2 Collect Requirements; 5.3 Define Scope; 5.4 Create WBS | | 5.5 Validate Scope; 5.6 Control Scope | |
| 6 Schedule | | 6.1 Plan Schedule Mgmt; 6.2 Define Activities; 6.3 Sequence Activities; 6.4 Estimate Activity Durations; 6.5 Develop Schedule | | 6.6 Control Schedule | |
| 7 Cost | | 7.1 Plan Cost Mgmt; 7.2 Estimate Costs; 7.3 Determine Budget | | 7.4 Control Costs | |
| 8 Quality | | 8.1 Plan Quality Mgmt | 8.2 Manage Quality | 8.3 Control Quality | |
| 9 Resource | | 9.1 Plan Resource Mgmt; 9.2 Estimate Activity Resources | 9.3 Acquire Resources; 9.4 Develop Team; 9.5 Manage Team | 9.6 Control Resources | |
| 10 Communications | | 10.1 Plan Communications Mgmt | 10.2 Manage Communications | 10.3 Monitor Communications | |
| 11 Risk | | 11.1 Plan Risk Mgmt; 11.2 Identify Risks; 11.3 Perform Qualitative Risk Analysis; 11.4 Perform Quantitative Risk Analysis; 11.5 Plan Risk Responses | 11.6 Implement Risk Responses | 11.7 Monitor Risks | |
| 12 Procurement | | 12.1 Plan Procurement Mgmt | 12.2 Conduct Procurements | 12.3 Control Procurements | |
| 13 Stakeholder | 13.1 Identify Stakeholders | 13.2 Plan Stakeholder Engagement | 13.3 Manage Stakeholder Engagement | 13.4 Monitor Stakeholder Engagement | |

### Memory aids

- Only **Integration** has a process in all five groups.
- The only two **Initiating** processes are the charter and identifying stakeholders.
- **Close Project or Phase** is the only Closing process. Procurement closure happens inside Control Procurements.
- **Executing** processes are the "manage", "acquire", "develop", "conduct" and "implement" processes.
- Monitoring and controlling processes are named "control", "monitor" or "validate", plus Perform Integrated Change Control.

## Frequency and flow

- **Once or at set points:** Develop Project Charter; Close Project or Phase.
- **Periodically, as needed:** Acquire Resources; Conduct Procurements.
- **Continuously:** Define Activities (under rolling wave or adaptive approaches); most monitoring and controlling processes.

Outputs from one process usually become inputs to another, or they are deliverables. Process Groups **overlap** over time. Initiating comes first and Closing last; Planning and Executing peak in the middle; Monitoring and Controlling runs for the whole project.

> **Remember:** Process Groups are **not** phases. In a phased project, all the groups can repeat within each phase (feasibility, design, build, test) until that phase's completion criteria are met.`,
      keyTerms: [
        { term: 'Process Group', def: 'A logical grouping of project management processes to achieve specific objectives; independent of application area and phases.' },
      ],
    },
    {
      id: 'm15-l2',
      title: 'Initiating and Planning Process Groups',
      minutes: 25,
      topics: ['std-initiating-group', 'std-planning-group', 'std-planning-group-2'],
      objectives: [
        'Describe the purpose and boundaries of Initiating',
        'Explain why Initiating is revisited at each phase',
        'Describe progressive elaboration and baselining in Planning',
      ],
      body: `## Initiating

The Initiating Process Group defines a new project or phase and obtains authorisation to start it. Its purpose is to **align stakeholders' expectations** with the project's purpose, tell them about the scope and objectives, and discuss how their participation helps meet their expectations.

During Initiating:

- the initial scope is defined and initial financial resources are committed;
- stakeholders are identified;
- the PM is appointed, if not already;
- all this is captured in the **charter** and the **stakeholder register**.

Approving the charter officially authorises the project.

**Project boundaries:** the sponsor and the business documents sit **outside** the project boundary and feed into Initiating. Inside the boundary, all five Process Groups interact. Deliverables flow out to the end users, and project records flow out to the organisation's process assets.

**In phased projects**, Initiating is revisited at the start of every phase. The charter, business documents and success criteria are checked again, and stakeholders' influence and expectations are reviewed. This keeps the project focused on the business need. Involving sponsors and customers in initiation creates a shared understanding of success.

## Planning

Planning establishes the **total scope** of the effort, defines and refines the objectives, and develops the course of action. It produces the plan components and project documents.

- Planning is **iterative**. Repeated feedback loops refine the plan, which is **progressive elaboration**.
- Significant changes during the project may send the team back to planning, or even to initiating.
- The team seeks input from relevant stakeholders.
- Once initial planning is complete, the approved plan is **baselined**. Monitoring and controlling then compare performance against the baselines.

The 24 Planning processes cover all ten Knowledge Areas. Communications, Quality, Procurement and Stakeholder each have exactly one; Risk has five; Scope has four; Schedule has five.

> **Exam tip:** "How much planning?" depends on the life cycle. Predictive projects with stable scope benefit from detailed upfront planning. Adaptive projects plan at a high level and then elaborate each iteration. The difference is *how much* is planned and *when*, not whether planning happens.`,
      keyTerms: [
        { term: 'Progressive elaboration', def: 'The iterative process of increasing the level of detail in a plan as more information becomes available.' },
        { term: 'Initiating Process Group', def: 'Processes performed to define a new project or phase by obtaining authorisation.' },
      ],
    },
    {
      id: 'm15-l3',
      title: 'Executing, Monitoring and Controlling, and Closing',
      minutes: 30,
      topics: ['std-executing-group', 'std-executing-group-2', 'std-monitoring-controlling-group', 'std-closing-group'],
      objectives: [
        'Explain why most budget and time is spent in Executing',
        'Distinguish monitoring from controlling',
        'Trace a typical change from Executing through Monitoring and Controlling and back',
        'Describe the purpose of the single Closing process',
      ],
      body: `## Executing

Executing completes the work defined in the project management plan. It coordinates resources, manages stakeholder engagement, and integrates and performs the activities. **A large share of the budget, resources and time is spent here.**

The ten Executing processes are:

- Direct and Manage Project Work;
- Manage Project Knowledge;
- Manage Quality;
- Acquire Resources;
- Develop Team;
- Manage Team;
- Manage Communications;
- Implement Risk Responses;
- Conduct Procurements;
- Manage Stakeholder Engagement.

Executing can produce change requests. If they are approved, they may trigger planning processes that update the plan and documents, and possibly set new baselines.

## Monitoring and Controlling

- **Monitoring**: collecting performance data, producing measures, and reporting and sharing performance information.
- **Controlling**: comparing actual with planned performance, analysing variances, assessing trends, evaluating alternatives and recommending corrective action.

Monitoring and controlling also involves evaluating change requests, recommending preventive actions, and **influencing anything that could get around change control**, so that only approved changes are implemented. It covers every Knowledge Area, every Process Group, every phase and the project as a whole.

### A change from start to finish

1. **Direct and Manage Project Work** produces work performance data.
2. **Control Costs** (or another controlling process) analyses it into work performance information and finds a variance beyond the threshold.
3. **Monitor and Control Project Work** consolidates it into a work performance report, and a **change request** is raised.
4. **Perform Integrated Change Control** evaluates the request; the CCB approves it, and the change log is updated.
5. The approved change goes to **Direct and Manage Project Work** to be implemented (and to Control Quality to verify it, and to Control Procurements if a contract is affected).
6. The plan and baselines are updated, and stakeholders are informed through **Manage Communications**.

## Closing

There is only one Closing process, **Close Project or Phase**. It is still called a Process Group because organisations may add their own closure processes. It checks that the defined processes in every group are complete, and it formally establishes that the project, phase or contract is complete. It also covers **early closure**: projects that are aborted or cancelled.`,
      keyTerms: [
        { term: 'Monitoring', def: 'Collecting performance data, producing measures, and reporting and disseminating performance information.' },
        { term: 'Controlling', def: 'Comparing actual with planned performance, analysing variances, assessing trends and recommending corrective action.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm15-q1',
      stem: 'How many processes are in the Planning Process Group?',
      options: ['10', '12', '24', '49'],
      answer: 2,
      explanation: 'Planning has 24 processes; Executing 10; Monitoring and Controlling 12; Initiating 2; Closing 1 (total 49).',
      topic: 'f-process-map',
      ref: 'PMBOK 6 Table 1-4',
    },
    {
      id: 'm15-q2',
      stem: 'Which pair contains only Initiating processes?',
      options: ['Develop Project Charter and Identify Stakeholders', 'Develop Project Charter and Develop Project Management Plan', 'Identify Stakeholders and Plan Stakeholder Engagement', 'Identify Risks and Identify Stakeholders'],
      answer: 0,
      explanation: 'The two Initiating processes are 4.1 Develop Project Charter and 13.1 Identify Stakeholders.',
      topic: 'f-process-map',
      ref: 'PMBOK 6 Table 1-4',
    },
    {
      id: 'm15-q3',
      stem: 'In which Process Group is Implement Risk Responses?',
      options: ['Planning', 'Executing', 'Monitoring and Controlling', 'Closing'],
      answer: 1,
      explanation: 'Implement Risk Responses (11.6) is an Executing process.',
      topic: 'f-process-map',
      ref: 'PMBOK 6 Table 1-4',
    },
    {
      id: 'm15-q4',
      stem: 'Which Knowledge Area has processes in all five Process Groups?',
      options: ['Scope', 'Stakeholder', 'Integration', 'Risk'],
      answer: 2,
      explanation: 'Only Integration has a process in every Process Group, from Develop Project Charter to Close Project or Phase.',
      topic: 'f-process-map',
      ref: 'PMBOK 6 Table 1-4',
    },
    {
      id: 'm15-q5',
      stem: 'Validate Scope belongs to which Process Group?',
      options: ['Planning', 'Executing', 'Monitoring and Controlling', 'Closing'],
      answer: 2,
      explanation: 'Validate Scope (5.5) is a Monitoring and Controlling process.',
      topic: 'f-process-map',
      ref: 'PMBOK 6 Table 1-4',
    },
    {
      id: 'm15-q6',
      stem: 'A project has phases for feasibility, design and build. Which statement is correct?',
      options: ['Initiating occurs only in feasibility', 'Processes from all Process Groups may be repeated within each phase', 'Each Process Group equals one phase', 'Closing occurs only in build'],
      answer: 1,
      explanation: 'Process Groups are not phases. In phased projects, processes of all groups may repeat in each phase until completion criteria are met.',
      topic: 'std-process-groups',
      ref: 'PMBOK 6 Part 2 §1.9',
    },
    {
      id: 'm15-q7',
      stem: 'Why is Initiating revisited at the start of each phase?',
      options: ['To issue a new contract', 'To re-check the charter, business documents and success criteria and keep the project focused on the business need', 'To restart the WBS', 'Because each phase needs a new PM'],
      answer: 1,
      explanation: 'At each phase start, initiating information is re-examined: charter, business documents, success criteria and stakeholder expectations are verified.',
      topic: 'std-initiating-group',
      ref: 'PMBOK 6 Part 2 §2',
    },
    {
      id: 'm15-q8',
      stem: 'In which Process Group is a large portion of the project budget, resources and time expended?',
      options: ['Initiating', 'Planning', 'Executing', 'Closing'],
      answer: 2,
      explanation: 'The Standard notes that a large portion of the budget, resources and time is expended in performing the Executing processes.',
      topic: 'std-executing-group',
      ref: 'PMBOK 6 Part 2 §4',
    },
    {
      id: 'm15-q9',
      stem: 'Comparing actual performance with planned, analysing variances and recommending corrective action is:',
      options: ['Monitoring', 'Controlling', 'Executing', 'Initiating'],
      answer: 1,
      explanation: 'Controlling compares actual with planned performance, analyses variances, assesses trends, evaluates alternatives and recommends corrective action. Monitoring collects and reports data.',
      topic: 'std-monitoring-controlling-group',
      ref: 'PMBOK 6 Part 2 §5',
    },
    {
      id: 'm15-q10',
      stem: 'A project is cancelled halfway through. Which Process Group still applies?',
      options: ['None; cancelled projects are simply stopped', 'Closing, which also addresses early closure of aborted or cancelled projects', 'Initiating', 'Planning only'],
      answer: 1,
      explanation: 'The Closing Process Group addresses early closure, such as aborted or cancelled projects.',
      topic: 'std-closing-group',
      ref: 'PMBOK 6 Part 2 §6',
    },
    {
      id: 'm15-q11',
      stem: 'Which Process Group continues throughout the project and involves influencing factors that could circumvent change control?',
      options: ['Planning', 'Executing', 'Monitoring and Controlling', 'Closing'],
      answer: 2,
      explanation: 'Monitoring and Controlling includes influencing factors that could circumvent integrated change control so only approved changes are implemented.',
      topic: 'std-monitoring-controlling-group',
      ref: 'PMBOK 6 Part 2 §5',
    },
  ],
};
