import type { Module } from '../types.ts';

export const M13: Module = {
  id: 'M13',
  number: '13',
  title: 'Project Stakeholder Management',
  summary: 'Identifying and analysing stakeholders, planning engagement with the engagement assessment matrix, managing engagement, and monitoring relationships.',
  lessons: [
    {
      id: 'm13-l1',
      title: 'Stakeholder concepts and 13.1 Identify Stakeholders',
      minutes: 35,
      topics: ['h-stakeholder-intro', 'h-stakeholder-overview', 'h-13.1-identify-stakeholders'],
      objectives: [
        'Explain why stakeholder identification starts early and repeats',
        'Analyse stakeholders\' stakes: interest, rights, ownership, knowledge and contribution',
        'Use power/interest grids, the salience model and directions of influence',
        'Describe the contents of the stakeholder register',
      ],
      body: `## Why stakeholders matter

Every project has stakeholders who affect it, or are affected by it, positively or negatively. Correctly identifying and engaging them can decide whether the project succeeds or fails. Stakeholder **satisfaction** should be managed as a project objective.

| Process | Group |
|---|---|
| 13.1 Identify Stakeholders | **Initiating** |
| 13.2 Plan Stakeholder Engagement | Planning |
| 13.3 Manage Stakeholder Engagement | Executing |
| 13.4 Monitor Stakeholder Engagement | Monitoring and Controlling |

Start **as soon as possible**, once the charter is approved and the PM assigned. Then review regularly, and at least when the project moves to a new phase, when stakeholders join or leave, or when the organisation or wider community changes significantly.

**Trends:**

- **Broader definitions** of stakeholders: regulators, lobby groups, the media, and people who simply *believe* they are stakeholders.
- Involving **all team members** in engagement.
- Reviewing the stakeholder community regularly, often alongside risk reviews.
- **Co-creation**: bringing the most affected stakeholders into the team as partners.
- Capturing both the value of good engagement and the true cost of poor engagement.

**Agile:** teams engage stakeholders **directly**, not through layers of management. They practise **aggressive transparency**: inviting stakeholders to reviews and posting artefacts openly.

## 13.1 Identify Stakeholders

This process identifies stakeholders regularly and documents their interests, involvement, interdependencies, influence and potential impact. It is often done for the first time before or alongside writing the charter.

**Key inputs:** the charter, business documents (the business case and benefits management plan), agreements, and later the change log, issue log and requirements documentation.

### Stakeholder analysis: what is at stake?

- **Interest**: they are affected by project decisions or outcomes.
- **Rights**: legal rights (such as health and safety) or moral rights (such as protecting heritage sites or the environment).
- **Ownership**: legal title to an asset or property.
- **Knowledge**: specialist expertise, or knowledge of how power works in the organisation.
- **Contribution**: funds, resources, advocacy, or protecting the project from politics.

### Mapping stakeholders

| Model | Best for |
|---|---|
| **Power/interest, power/influence, impact/influence grids** | Small projects or simple relationships |
| **Stakeholder cube** | A three-dimensional refinement of the grids |
| **Salience model**: **power**, **urgency** (the need for immediate attention) and **legitimacy** (how appropriate their involvement is) | Large, complex stakeholder communities |
| **Directions of influence**: **upward** (senior management, sponsor), **downward** (the team), **outward** (suppliers, regulators, the public, end users), **sideward** (peers, other PMs) | Understanding relationships |
| **Prioritisation** | Many stakeholders, or frequent change |

On a power/interest grid, the usual approach is: high power and high interest, **manage closely**; high power and low interest, **keep satisfied**; low power and high interest, **keep informed**; low power and low interest, **monitor**. This guidance is common exam knowledge rather than a quotation from the Guide.

Other tools: questionnaires and surveys, brainstorming and **brain writing** (people think on their own first), document analysis, and meetings.

### Output: stakeholder register

- **Identification**: name, position, location, contact details and role on the project.
- **Assessment**: major requirements, expectations, potential influence, and the phase in which they matter most.
- **Classification**: internal or external, impact, influence, power, interest, direction of influence.

Information about stakeholders' power, interest and engagement is largely **assumption**, so it is also recorded in the **assumption log**.`,
      keyTerms: [
        { term: 'Stakeholder', def: 'An individual, group or organisation that may affect, be affected by, or perceive itself to be affected by the project.' },
        { term: 'Stakeholder register', def: 'A project document with identification, assessment and classification information about stakeholders.' },
        { term: 'Salience model', def: 'Classifies stakeholders by power, urgency and legitimacy.' },
        { term: 'Directions of influence', def: 'Classifying stakeholders as upward, downward, outward or sideward relative to the project.' },
      ],
    },
    {
      id: 'm13-l2',
      title: '13.2 Plan Stakeholder Engagement and 13.3 Manage Stakeholder Engagement',
      minutes: 30,
      topics: ['h-13.2-plan-engagement', 'h-13.3-manage-engagement', 'h-13.3-manage-outputs'],
      objectives: [
        'Use the stakeholder engagement assessment matrix with its five levels',
        'Describe the stakeholder engagement plan and when it is updated',
        'Apply communication and interpersonal skills to manage engagement',
      ],
      body: `## 13.2 Plan Stakeholder Engagement

This process develops ways to involve stakeholders based on their needs, expectations, interests and potential impact. Update the plan when a new phase starts, when the organisation or industry changes, when stakeholders join or leave or their importance changes, or when change, risk or issue management calls for a review.

### Stakeholder engagement assessment matrix

This matrix compares each stakeholder's **current (C)** engagement with the **desired (D)** engagement:

| Level | Description |
|---|---|
| **Unaware** | Does not know about the project or its potential impact |
| **Resistant** | Aware, but resists change and does not support the project |
| **Neutral** | Aware, but neither supportive nor resistant |
| **Supportive** | Aware and supports the change |
| **Leading** | Aware and **actively engaged** in making the project succeed |

*Example:* the finance director is **C = resistant** and **D = supportive**. The gap tells the PM what communication and engagement actions are needed. A stakeholder already at their desired level needs maintaining, not changing.

**Other tools:**

- **Root cause analysis**: why a stakeholder is resistant.
- **Assumption and constraint analysis.**
- **Prioritisation and ranking**: stakeholders with the most interest and highest influence are often at the top.
- **Benchmarking** and **mind mapping**.

**Output:** the **stakeholder engagement plan**, a component of the project management plan. It sets out strategies and actions for individuals or groups. It can be formal or informal, detailed or broad.

## 13.3 Manage Stakeholder Engagement

This process communicates and works with stakeholders to meet their needs and expectations, address issues, and encourage the right level of involvement, so as to **increase support and minimise resistance**.

**Activities:**

- engage stakeholders at the right stages to obtain or confirm their commitment;
- **manage expectations** through negotiation and communication;
- deal with risks and concerns, and anticipate future issues;
- clarify and resolve issues.

**Inputs:** the communications, risk, stakeholder engagement and **change management** plans; the change log, issue log, lessons learned and stakeholder register.

**Tools:**

- **Communication skills**: using feedback to understand how stakeholders are reacting.
- **Interpersonal skills**: conflict management, cultural awareness, **negotiation**, observation and conversation, political awareness.
- **Ground rules**: set out in the **team charter**, covering expected behaviour towards stakeholders.
- **Meetings**: kick-off, decision-making, issue resolution, status updates, sprint planning and retrospectives.

**Outputs:** change requests (engagement can surface changes to scope); updates to the communications and stakeholder engagement plans; updates to the change log, issue log, lessons learned and stakeholder register.

> **Exam tip:** A powerful stakeholder is resistant. The best first step is usually to **understand why** (root cause analysis, a one-to-one conversation) and then plan engagement actions. Escalation, or ignoring the stakeholder, is rarely right.`,
      keyTerms: [
        { term: 'Stakeholder engagement assessment matrix', def: 'Compares current and desired stakeholder engagement levels: unaware, resistant, neutral, supportive, leading.' },
        { term: 'Stakeholder engagement plan', def: 'Identifies strategies and actions to promote productive stakeholder involvement.' },
        { term: 'Manage Stakeholder Engagement', def: 'Communicating and working with stakeholders to meet needs, address issues and foster appropriate engagement.' },
      ],
    },
    {
      id: 'm13-l3',
      title: '13.4 Monitor Stakeholder Engagement',
      minutes: 20,
      topics: ['h-13.4-monitor-engagement'],
      objectives: [
        'Explain how engagement is monitored and strategies adjusted',
        'Select analysis and decision techniques for engagement variances',
      ],
      body: `## Purpose

Monitor Stakeholder Engagement tracks stakeholder relationships and **adjusts engagement strategies and plans**, so engagement stays efficient and effective as the project and its environment change.

**Inputs:**

- the resource management, communications and stakeholder engagement plans;
- the issue log, lessons learned, project communications, **risk register** (including risks related to stakeholders) and stakeholder register;
- **work performance data**: which stakeholders are supportive, and their level and type of engagement.

## Tools

- **Alternatives analysis**: options for responding when engagement differs from what was intended.
- **Root cause analysis**: why the engagement is not having the planned effect.
- **Stakeholder analysis**: where people and groups stand now.
- **Multicriteria decision analysis** and **voting**: to choose the best response.
- **Stakeholder engagement assessment matrix**: to track movement from current towards desired levels.
- **Communication skills**: feedback and presentations.
- **Interpersonal skills**: active listening, cultural awareness, **leadership** (communicating the vision and inspiring support), **networking** and political awareness.
- **Meetings**: status meetings, standups, retrospectives. Face-to-face is best but costly; technology can bridge the gap.

## Outputs

- **Work performance information**: the current state of engagement compared with the desired levels.
- **Change requests**: corrective and preventive actions to improve engagement.
- Updates to plans (resource, communications, stakeholder engagement) and documents (issue log, lessons learned, risk register, stakeholder register).

> **Remember:** The stakeholder processes repeat. When monitoring shows a gap, go back to planning and managing engagement, and update the stakeholder register as people and their positions change.`,
      keyTerms: [
        { term: 'Monitor Stakeholder Engagement', def: 'Monitoring stakeholder relationships and tailoring engagement strategies by modifying strategies and plans.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm13-q1',
      stem: 'In which Process Group is Identify Stakeholders?',
      options: ['Initiating', 'Planning', 'Executing', 'Monitoring and Controlling'],
      answer: 0,
      explanation: 'Identify Stakeholders is one of the two Initiating processes, alongside Develop Project Charter.',
      topic: 'h-stakeholder-intro',
      ref: 'PMBOK 6 §13; Table 1-4',
    },
    {
      id: 'm13-q2',
      stem: 'When should stakeholder identification first begin?',
      options: ['After the WBS is complete', 'As soon as possible, often before or alongside the project charter', 'At the first status meeting', 'During closing'],
      answer: 1,
      explanation: 'Stakeholder identification should start as early as possible, often before or alongside chartering, and repeat throughout the project.',
      topic: 'h-stakeholder-overview',
      ref: 'PMBOK 6 §13 Key Concepts; §13.1',
    },
    {
      id: 'm13-q3',
      stem: 'A community group claims a moral right to protect a historic building near the site. What type of stake is this?',
      options: ['Ownership', 'Rights', 'Contribution', 'Knowledge'],
      answer: 1,
      explanation: 'Rights may be legal or moral; protecting historical sites is an example of a moral right.',
      topic: 'h-13.1-identify-stakeholders',
      ref: 'PMBOK 6 §13.1.2.3',
    },
    {
      id: 'm13-q4',
      stem: 'A large infrastructure project has hundreds of stakeholders with complex relationships. Which model classifies them by power, urgency and legitimacy?',
      options: ['Power/interest grid', 'Salience model', 'RACI chart', 'Stakeholder engagement assessment matrix'],
      answer: 1,
      explanation: 'The salience model uses power, urgency and legitimacy and is useful for large, complex stakeholder communities.',
      topic: 'h-13.1-identify-stakeholders',
      ref: 'PMBOK 6 §13.1.2.4',
    },
    {
      id: 'm13-q5',
      stem: 'Other project managers competing for the same shared resources are which direction of influence?',
      options: ['Upward', 'Downward', 'Outward', 'Sideward'],
      answer: 3,
      explanation: 'Sideward stakeholders are peers, such as other project managers or middle managers who compete or collaborate with the PM.',
      topic: 'h-13.1-identify-stakeholders',
      ref: 'PMBOK 6 §13.1.2.4',
    },
    {
      id: 'm13-q6',
      stem: 'Why is stakeholder power, interest and engagement information also recorded in the assumption log?',
      options: ['It is legally required', 'Much of it is based on assumptions that may change', 'The assumption log replaces the stakeholder register', 'Only sponsors can view the stakeholder register'],
      answer: 1,
      explanation: 'Information on relative power, interest and engagement is largely assumption-based, so it is captured in the assumption log as well.',
      topic: 'h-13.1-identify-stakeholders',
      ref: 'PMBOK 6 §13.1.3.4',
    },
    {
      id: 'm13-q7',
      stem: 'A stakeholder is aware of the project and actively working to ensure it succeeds. Which engagement level is this?',
      options: ['Supportive', 'Leading', 'Neutral', 'Resistant'],
      answer: 1,
      explanation: 'Leading means aware of the project and potential impacts and actively engaged in ensuring success. Supportive means aware and supportive of change.',
      topic: 'h-13.2-plan-engagement',
      ref: 'PMBOK 6 §13.2.2.5',
    },
    {
      id: 'm13-q8',
      stem: 'In the stakeholder engagement assessment matrix, the operations manager is marked C = Resistant, D = Supportive. What does this indicate?',
      options: ['No action is needed', 'An engagement gap that requires planned actions and communication to close', 'The stakeholder should be removed from the register', 'The project should be cancelled'],
      answer: 1,
      explanation: 'The gap between current and desired engagement directs the actions and communications needed; closing it is central to monitoring engagement.',
      topic: 'h-13.2-plan-engagement',
      ref: 'PMBOK 6 §13.2.2.5, Figure 13-6',
    },
    {
      id: 'm13-q9',
      stem: 'Which document is a component of the project management plan?',
      options: ['Stakeholder register', 'Stakeholder engagement plan', 'Issue log', 'Change log'],
      answer: 1,
      explanation: 'The stakeholder engagement plan is a plan component. The register and logs are project documents.',
      topic: 'h-13.2-plan-engagement',
      ref: 'PMBOK 6 §13.2.3.1',
    },
    {
      id: 'm13-q10',
      stem: 'An influential manager opposes the project. What should the PM do first?',
      options: ['Escalate to the sponsor to override the manager', 'Seek to understand the reasons for resistance and plan engagement actions', 'Exclude the manager from communications', 'Change the project scope to satisfy the manager'],
      answer: 1,
      explanation: 'Root cause analysis and direct engagement help identify why a stakeholder resists, so the right strategy can improve engagement.',
      topic: 'h-13.3-manage-engagement',
      ref: 'PMBOK 6 §13.2.2.3; §13.3',
    },
    {
      id: 'm13-q11',
      stem: 'Where are ground rules for team members\' behaviour with stakeholders usually defined?',
      options: ['Stakeholder register', 'Team charter', 'Procurement SOW', 'Risk register'],
      answer: 1,
      explanation: 'Ground rules are defined in the team charter and set expected behaviour for engaging stakeholders.',
      topic: 'h-13.3-manage-outputs',
      ref: 'PMBOK 6 §13.3.2.4',
    },
    {
      id: 'm13-q12',
      stem: 'Monitoring shows that several key stakeholders remain neutral despite planned engagement actions. Which output is most likely?',
      options: ['Closed procurements', 'Change requests with corrective or preventive actions to improve engagement', 'A revised project charter', 'Verified deliverables'],
      answer: 1,
      explanation: 'Monitor Stakeholder Engagement produces change requests, including corrective and preventive actions, when engagement is not at the desired level.',
      topic: 'h-13.4-monitor-engagement',
      ref: 'PMBOK 6 §13.4.3.2',
    },
  ],
};
