import type { Module } from '../types.ts';

export const M09: Module = {
  id: 'M09',
  number: '9',
  title: 'Project Resource Management',
  summary: 'Planning, estimating and acquiring team and physical resources; developing and managing the team; resolving conflict; and controlling physical resources.',
  lessons: [
    {
      id: 'm09-l1',
      title: 'Resource overview and 9.1 Plan Resource Management',
      minutes: 30,
      topics: ['r-resource-overview', 'r-9.1-plan-resource'],
      objectives: [
        'Distinguish team resources from physical resources',
        'Use the OBS, RBS, RAM and RACI chart',
        'Describe the resource management plan and the team charter',
      ],
      body: `## Two kinds of resources

- **Team resources**: the people, with different skills, full-time or part-time, who join and leave over time.
- **Physical resources**: equipment, materials, facilities and infrastructure.

| Process | Group |
|---|---|
| 9.1 Plan Resource Management | Planning |
| 9.2 Estimate Activity Resources | Planning |
| 9.3 Acquire Resources | Executing |
| 9.4 Develop Team | Executing |
| 9.5 Manage Team | Executing |
| 9.6 Control Resources | Monitoring and Controlling |

**Key ideas:** involving the team in planning and decisions adds expertise and commitment. The PM is both leader and manager, and should uphold ethical behaviour. Poor control of physical resources is a risk: critical equipment arriving late delays work, poor materials cause rework, too much inventory raises costs, and too little leaves demand unmet.

**Trends:**

- A shift from command-and-control to **collaborative, supportive** management that empowers teams.
- Resource management methods such as **lean**, **just-in-time**, **Kaizen**, total productive maintenance and the **theory of constraints**.
- **Emotional intelligence**: self-awareness and self-management (inbound), and relationship management (outbound).
- **Self-organising teams** (common in agile): no centralised control; the PM provides the environment and support and trusts the team. Teams are made up of *generalising specialists*.
- **Virtual and distributed teams**: access to expertise anywhere, but with challenges such as isolation, time zones, culture and tracking progress.

## 9.1 Plan Resource Management

This process defines how to estimate, acquire, manage and use team and physical resources.

### Showing who does what

| Tool | What it shows |
|---|---|
| **WBS** | Deliverables broken down to work packages |
| **Organisational breakdown structure (OBS)** | The project's work arranged by the organisation's **departments**, so each department can see all its responsibilities |
| **Resource breakdown structure (RBS)** | Resources arranged **by category and type** (labour, materials, equipment) |
| **Responsibility assignment matrix (RAM)** | Which resources are assigned to each work package or activity |
| **RACI chart** | A RAM showing who is **R**esponsible, **A**ccountable, **C**onsulted and **I**nformed |

> **Key rule:** In a RACI chart, each activity has **exactly one A** (accountable person). Several people can be R, C or I.

Other tools: text-oriented formats (position descriptions); **organisational theory** (how people and teams behave, for example adapting leadership style to the team's maturity); expert judgment; meetings.

### Outputs

**Resource management plan.** This may be split into team and physical resource plans. It covers:

- how resources are identified and acquired;
- **roles and responsibilities**: *role* (the function), *authority* (the right to use resources, make decisions and approve; people work best when authority matches responsibility), *responsibility* (the assigned duties) and *competence* (the skill and capacity, with gaps closed by training, hiring or changes to scope or schedule);
- project organisation charts;
- how the team is managed, trained and developed;
- how physical resources are controlled;
- the **recognition plan**: which rewards are given, and when.

**Team charter.** This records the team's **values**, communication guidelines, decision-making criteria and process, conflict resolution process, meeting guidelines and team agreements. It sets expectations of acceptable behaviour. It works best when the team writes it together, and everyone shares responsibility for following it. Review it from time to time, and use it to bring new members up to speed.`,
      keyTerms: [
        { term: 'Resource breakdown structure', def: 'A hierarchical representation of resources by category and type.' },
        { term: 'Organisational breakdown structure', def: 'A hierarchical representation of the project organisation, relating work packages to performing units.' },
        { term: 'RACI chart', def: 'A responsibility assignment matrix showing who is Responsible, Accountable, Consulted and Informed.' },
        { term: 'Team charter', def: 'A document recording team values, agreements and operating guidelines and setting expectations of behaviour.' },
      ],
    },
    {
      id: 'm09-l2',
      title: '9.2 Estimate Activity Resources and 9.3 Acquire Resources',
      minutes: 25,
      topics: ['r-9.2-estimate-resources', 'r-9.3-acquire-resources'],
      objectives: [
        'Estimate resource quantities using bottom-up, analogous and parametric techniques',
        'Explain pre-assignment, negotiation and multicriteria selection',
        'Weigh the benefits and challenges of virtual teams',
      ],
      body: `## 9.2 Estimate Activity Resources

This process estimates the **team resources** and the **type and quantity** of materials, equipment and supplies each activity needs. It is closely coordinated with Estimate Costs.

**Key inputs:** activity attributes (the main source of data), the activity list, cost estimates, the assumption log, and **resource calendars** (when each resource is available, with its skills and location).

**Techniques:**

- **Bottom-up**: estimate each activity and add up the totals.
- **Analogous**: use a similar past project, when only the upper levels of the WBS are known.
- **Parametric**: for example, 6,000 hours of testing to be finished in one year, at 1,500 productive hours per tester per year, needs **4 testers**.
- **Alternatives analysis**: skill levels, machine types, manual or automated tools, make, rent or buy.
- PMIS and meetings with functional managers.

**Outputs:** **resource requirements** (types and quantities per activity, rolled up the WBS), the basis of estimates, and the **resource breakdown structure**.

## 9.3 Acquire Resources

This process obtains the team members, facilities, equipment, materials and supplies. Internal resources come from functional or resource managers; external resources come through procurement. The PM often does not control selection directly: union agreements, subcontractor staff, a matrix structure or reporting lines may stand in the way.

If the needed resources cannot be obtained, the PM may use alternatives with different skills or costs, provided no legal, regulatory or mandatory criteria are breached. The PM documents the effects on the schedule, budget, risk and quality.

### Tools

- **Multicriteria decision analysis**: weighted selection criteria such as availability, cost, ability, experience, knowledge of the customer, skills with the project's tools, attitude to teamwork, and international factors such as time zone.
- **Negotiation**: with functional managers, with other project teams for scarce resources, and with outside suppliers. **Influence** helps, for example by pointing out how visible the project is.
- **Pre-assignment**: resources decided in advance, for example people named in a winning proposal, essential experts, or people assigned during chartering.
- **Virtual teams**: people with a shared goal who spend little or no time face to face. They give access to remote experts, allow home working and different shifts, include people with limited mobility, and save travel and office costs. They also make **communication planning more important**: set expectations, agree conflict protocols, include everyone in decisions, and share credit.

### Outputs

Physical resource assignments, **project team assignments** (with a team directory), **resource calendars**, change requests, and updates to plans and documents.`,
      keyTerms: [
        { term: 'Resource calendar', def: 'A calendar showing the working days, shifts and availability of each specific resource.' },
        { term: 'Pre-assignment', def: 'Selecting team members in advance, for example because they were promised in a proposal.' },
        { term: 'Virtual team', def: 'A group with a shared goal whose members spend little or no time meeting face to face.' },
      ],
    },
    {
      id: 'm09-l3',
      title: '9.4 Develop Team',
      minutes: 30,
      topics: ['r-9.4-develop-team'],
      objectives: [
        'Identify Tuckman\'s five stages of team development',
        'Choose team development tools: colocation, training, team building, recognition',
        'Describe team performance assessments',
      ],
      body: `## Why develop the team?

Developing an effective team is one of the PM's main responsibilities. Development improves skills (lowering cost and time and raising quality), builds **trust** (raising morale and reducing conflict), creates a collaborative culture, and **empowers** the team to make decisions and own its solutions. With diverse, global teams, the aim is to use cultural differences as a strength.

## Tuckman's ladder

| Stage | What happens |
|---|---|
| **Forming** | Members meet and learn their roles; they work independently and are not yet open |
| **Storming** | The team tackles the work, technical decisions and approach; conflict appears, and it can hurt the team if people are not open |
| **Norming** | Members adjust their habits to support the team; trust grows |
| **Performing** | The team is well organised and interdependent and resolves issues smoothly |
| **Adjourning** | The work is done and the team is released, for example at project or phase closure |

Teams usually move through the stages in order, but they can get stuck, slip back to an earlier stage, or skip stages if they have worked together before.

## Tools

- **Colocation**: placing active team members in the same location, for the whole project or part of it, often with a shared team room.
- **Virtual teams** and **communication technology**: shared portals, video and audio conferencing, chat.
- **Interpersonal skills**: conflict management, influencing, motivation, negotiation, **team building** (from a five-minute agenda item to an off-site event; valuable from the start and throughout).
- **Recognition and rewards**: these work only if they meet a need the person values, and they should take culture into account. Non-monetary rewards (growth, appreciation, challenge) can be as powerful as money. Recognise people **throughout** the project, not only at the end.
- **Training**: classroom, online, on-the-job, mentoring and coaching. It can be planned or arranged after observing a need.
- **Individual and team assessments**: attitude surveys, structured interviews, ability tests and focus groups, to understand preferences and build trust.
- **Meetings**: orientation, team building and team development.

## Outputs

**Team performance assessments** look at how effective the team is: improvements in individual skills, team competencies, lower turnover and greater cohesion. They identify the training, coaching or support needed, and they feed **Manage Team**.

> **Exam tip:** Team members are arguing about the technical approach two weeks after the team formed. That is normal **storming**. Facilitate open discussion and use the team charter's conflict resolution process. It is not a reason to escalate to management.`,
      keyTerms: [
        { term: 'Tuckman ladder', def: 'Team development stages: forming, storming, norming, performing, adjourning.' },
        { term: 'Colocation', def: 'Placing many or all of the most active team members in the same physical location.' },
        { term: 'Team performance assessment', def: 'An evaluation of team effectiveness used to plan training, coaching and improvements.' },
      ],
    },
    {
      id: 'm09-l4',
      title: '9.5 Manage Team and 9.6 Control Resources',
      minutes: 30,
      topics: ['r-9.5-manage-team', 'r-9.6-control-resources'],
      objectives: [
        'Choose among the five conflict resolution techniques',
        'Apply emotional intelligence and influencing in a matrix environment',
        'Control physical resources and solve resource problems systematically',
      ],
      body: `## 9.5 Manage Team

Manage Team tracks team members' performance, gives feedback, resolves issues and manages changes to the team. **Key inputs** include work performance reports and **team performance assessments**.

### Conflict management

Conflict is inevitable. Common sources are **scarce resources, scheduling priorities and personal work styles**. Ground rules, group norms, communication planning and clear roles all reduce it. Handled well, conflict improves creativity and decisions.

- Team members are **initially responsible** for resolving their own conflicts. If a conflict escalates, the PM helps.
- Deal with conflict **early**, usually **in private**, using a direct, collaborative approach.
- Persistent disruptive conflict may need formal procedures, including disciplinary action.

| Technique | What it involves | Typical result |
|---|---|---|
| **Withdraw / avoid** | Retreat or postpone, to prepare or let others resolve it | Temporary; the problem remains |
| **Smooth / accommodate** | Emphasise agreement and concede to keep the peace | Keeps harmony, but the issue may stay unresolved |
| **Compromise / reconcile** | Each side gives something up | Partial satisfaction; sometimes lose-lose |
| **Force / direct** | Push one view at the others' expense, usually using power | Win-lose; for emergencies |
| **Collaborate / problem solve** | Combine viewpoints through open dialogue | **Consensus and commitment; win-win** |

How to choose a technique depends on how important and intense the conflict is, the time pressure, the relative power of the people involved, how important the relationship is, and whether a long-term or short-term fix is needed.

> **Exam tip:** Collaborate / problem solve is usually the best answer when there is time and the relationship matters. Forcing fits a real emergency or a safety issue.

### Other skills

- **Emotional intelligence**: recognising and managing your own emotions and other people's, to reduce tension and increase cooperation.
- **Influencing**: essential in a matrix, where the PM has little direct authority. It relies on persuasion, clear arguments, active listening and an awareness of other people's views.
- **Decision making** and **leadership**: communicate the vision and adapt your style to the situation. A team member with little skill needs closer supervision.

**Outputs:** change requests (for example, replacing someone who has left the team), and updates to plans, the issue log, lessons learned and project team assignments. Managing the team also provides input to the organisation's performance appraisals.

## 9.6 Control Resources

Control Resources makes sure the **physical** resources (equipment, materials, facilities) are available as planned, compares planned with actual use, and takes corrective action. *Team members are handled in Manage Team.*

**Tools:**

- **Data analysis**: alternatives analysis (for example, paying for overtime or extra resources versus accepting a late or phased delivery), cost-benefit analysis, performance reviews and trend analysis.
- **Problem solving**: identify the problem, define it, investigate it, analyse the root cause, solve it, and check the solution worked.
- Negotiation, influencing and the PMIS.

Problems can come from inside the organisation (a department will not release a machine) or from outside (a supplier goes bankrupt, a storm causes damage). Changes to the schedule or cost baselines go through Perform Integrated Change Control.

**Outputs:** work performance information, change requests, and updates to physical resource assignments, the RBS, the risk register and lessons learned.`,
      keyTerms: [
        { term: 'Collaborate / problem solve', def: 'Conflict technique incorporating multiple viewpoints through open dialogue, leading to consensus and commitment.' },
        { term: 'Emotional intelligence', def: 'The ability to identify, assess and manage one\'s own emotions and those of others and groups.' },
        { term: 'Control Resources', def: 'Ensuring physical resources are available as planned and monitoring planned versus actual use.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm09-q1',
      stem: 'Which tool arranges project work by the organisation\'s existing departments so each unit can see its responsibilities?',
      options: ['Resource breakdown structure', 'Organisational breakdown structure', 'WBS dictionary', 'Team charter'],
      answer: 1,
      explanation: 'The OBS is arranged by existing departments, units or teams with their project work packages listed.',
      topic: 'r-9.1-plan-resource',
      ref: 'PMBOK 6 §9.1.2.2',
    },
    {
      id: 'm09-q2',
      stem: 'A RACI chart shows two people marked "A" for the same activity. What is the problem?',
      options: ['Nothing; accountability can be shared', 'Only one person should be accountable for each activity', 'Accountable people must also be responsible', 'A RACI chart should not include external resources'],
      answer: 1,
      explanation: 'A RAM/RACI should ensure exactly one person is accountable for any task. Responsibility can be shared.',
      topic: 'r-9.1-plan-resource',
      ref: 'PMBOK 6 §9.1.2.2, Figure 9-4',
    },
    {
      id: 'm09-q3',
      stem: 'Where are the team\'s agreed values, decision-making process and conflict resolution process recorded?',
      options: ['Resource management plan', 'Team charter', 'Project charter', 'Communications management plan'],
      answer: 1,
      explanation: 'The team charter records team values, agreements and operating guidelines, including decision-making and conflict resolution processes.',
      topic: 'r-9.1-plan-resource',
      ref: 'PMBOK 6 §9.1.3.2',
    },
    {
      id: 'm09-q4',
      stem: 'A project needs 9,000 hours of design work in one year. Each designer contributes 1,800 productive hours per year. How many designers are needed?',
      options: ['4', '5', '6', '9'],
      answer: 1,
      explanation: 'Parametric estimate: 9,000 / 1,800 = 5 designers.',
      topic: 'r-9.2-estimate-resources',
      ref: 'PMBOK 6 §9.2.2.4',
    },
    {
      id: 'm09-q5',
      stem: 'A winning proposal promised the client that a named senior architect would lead the design. How is she assigned?',
      options: ['Negotiation', 'Pre-assignment', 'Virtual team', 'Multicriteria decision analysis'],
      answer: 1,
      explanation: 'Pre-assignment applies when resources are determined in advance, for example because they were named in a competitive proposal.',
      topic: 'r-9.3-acquire-resources',
      ref: 'PMBOK 6 §9.3.2.3',
    },
    {
      id: 'm09-q6',
      stem: 'A functional manager will not release a specialist the project needs. What should the PM do first?',
      options: ['Escalate immediately to the sponsor', 'Negotiate with the functional manager, using influence such as the project\'s visibility and benefits', 'Hire an external contractor without approval', 'Remove the activity from scope'],
      answer: 1,
      explanation: 'Acquire Resources relies on negotiation and influence with functional managers. Escalation is a later step if negotiation fails.',
      topic: 'r-9.3-acquire-resources',
      ref: 'PMBOK 6 §9.3.2.2',
    },
    {
      id: 'm09-q7',
      stem: 'Team members have started adjusting their work habits to support each other, and trust is growing. Which Tuckman stage is this?',
      options: ['Forming', 'Storming', 'Norming', 'Performing'],
      answer: 2,
      explanation: 'In norming, members adjust habits and behaviours to support the team, and trust develops.',
      topic: 'r-9.4-develop-team',
      ref: 'PMBOK 6 §9.4.2.4',
    },
    {
      id: 'm09-q8',
      stem: 'When should recognition and rewards be given, according to the Guide?',
      options: ['Only at project closure', 'Throughout the project, in ways the individual values', 'Only when the sponsor approves a bonus', 'Only to the top performer'],
      answer: 1,
      explanation: 'Recognition should be given throughout the life cycle, and rewards are effective only if they satisfy a need the individual values.',
      topic: 'r-9.4-develop-team',
      ref: 'PMBOK 6 §9.4.2.6',
    },
    {
      id: 'm09-q9',
      stem: 'Which output of Develop Team is an input to Manage Team?',
      options: ['Team performance assessments', 'Resource calendars', 'Physical resource assignments', 'Resource breakdown structure'],
      answer: 0,
      explanation: 'Team performance assessments from Develop Team feed Manage Team to resolve issues and improve interaction.',
      topic: 'r-9.4-develop-team',
      ref: 'PMBOK 6 §9.4.3.1; §9.5.1.4',
    },
    {
      id: 'm09-q10',
      stem: 'Two senior engineers disagree about an architecture decision. There is time to discuss and the decision has long-term impact. Which technique is best?',
      options: ['Withdraw/avoid', 'Smooth/accommodate', 'Force/direct', 'Collaborate/problem solve'],
      answer: 3,
      explanation: 'With time available and a lasting impact, collaborating to incorporate both viewpoints leads to consensus and commitment.',
      topic: 'r-9.5-manage-team',
      ref: 'PMBOK 6 §9.5.2.1',
    },
    {
      id: 'm09-q11',
      stem: 'Each side gives up something to reach a temporary, partial solution. Which conflict technique is this?',
      options: ['Compromise/reconcile', 'Collaborate/problem solve', 'Smooth/accommodate', 'Force/direct'],
      answer: 0,
      explanation: 'Compromise searches for solutions that bring some satisfaction to all parties, often temporarily or partially.',
      topic: 'r-9.5-manage-team',
      ref: 'PMBOK 6 §9.5.2.1',
    },
    {
      id: 'm09-q12',
      stem: 'Two team members have a personal disagreement that is affecting their work. Who is initially responsible for resolving it?',
      options: ['The project manager', 'The team members themselves', 'The functional manager', 'Human resources'],
      answer: 1,
      explanation: 'Team members are initially responsible for resolving their own conflicts. The PM helps if the conflict escalates.',
      topic: 'r-9.5-manage-team',
      ref: 'PMBOK 6 §9.5.2.1',
    },
    {
      id: 'm09-q13',
      stem: 'Which process monitors whether cranes and building materials are available as planned and compares planned with actual use?',
      options: ['Manage Team', 'Control Resources', 'Acquire Resources', 'Control Procurements'],
      answer: 1,
      explanation: 'Control Resources ensures physical resources are available as planned and monitors planned versus actual utilisation.',
      topic: 'r-9.6-control-resources',
      ref: 'PMBOK 6 §9.6',
    },
    {
      id: 'm09-q14',
      stem: 'Which statement reflects the Guide\'s description of self-organising agile teams?',
      options: ['The PM assigns every task daily', 'The team works without centralised control; the PM provides the environment and support and trusts the team', 'Team members must be narrow specialists', 'Self-organising teams do not need a backlog'],
      answer: 1,
      explanation: 'Self-organising teams function without centralised control. The PM (whatever the title) provides the environment and support, and trusts the team; members are generalising specialists.',
      topic: 'r-resource-overview',
      ref: 'PMBOK 6 §9 Trends',
    },
  ],
};
