import type { Module } from '../types.ts';

export const M03: Module = {
  id: 'M03',
  number: '3',
  title: 'The role of the project manager',
  summary: 'The project manager\'s sphere of influence, competences, leadership styles, power, ethics, and integration at process, cognitive and context levels.',
  lessons: [
    {
      id: 'm03-l1',
      title: 'Role, sphere of influence and professional ethics',
      minutes: 25,
      topics: ['r-pm-role-overview', 'r-pm-definition-sphere', 'f-vocabulary-ethics'],
      objectives: [
        'Define the project manager and distinguish the role from functional and operations managers',
        'Describe the PM\'s sphere of influence at project, organisation, industry and profession level',
        'Explain the four values of the PMI Code of Ethics and the difference between aspirational and mandatory standards',
      ],
      body: `## The conductor analogy

The Guide compares a project manager to an orchestra conductor. A conductor does not play every instrument but needs enough musical knowledge to lead. The conductor is responsible for what the whole orchestra produces, and communicates both in writing (the score, like a plan) and in real time (the baton, like meetings and conversations). A project manager likewise:

- leads a team that may be large and drawn from many departments;
- takes a holistic view of the product, aligned with the organisation's vision and objectives;
- communicates constantly, verbally and non-verbally.

## Who the project manager is

The **project manager** is the person assigned by the performing organisation to lead the team responsible for achieving the project objectives. This is different from:

- a **functional manager**, who oversees a functional or business unit;
- an **operations manager**, who makes sure business operations run efficiently.

The PM often leads from initiation to closing. On some projects the PM is also involved earlier, advising on the business case, or later, supporting benefits realisation.

## Sphere of influence

| Level | What the PM does there |
|---|---|
| **The project** | Leads the team; balances competing constraints; communicates between sponsor, team and stakeholders; uses soft skills to reach consensus |
| **The organisation** | Works with other PMs on shared resources and priorities; works with the sponsor on political and strategic issues; builds PM capability; demonstrates the value of project management |
| **The industry** | Stays informed about trends, standards, technologies and market forces that may affect the project |
| **The profession** | Shares knowledge (for example in communities of practice) and keeps learning |
| **Across disciplines** | Acts as an informal ambassador for the value of project management |

Research cited in the Guide found that the most effective project managers show superior relationship and communication skills and a positive attitude. Good communication is predictable and consistent; it is tailored to the audience; it includes bad news as well as good; and it provides feedback channels. Informal networks often matter more than formal reporting lines.

## Common vocabulary and ethics

A shared vocabulary marks a profession. PMI's *Lexicon of Project Management Terms* supplies one, and the Guide's glossary includes it.

The **PMI Code of Ethics and Professional Conduct** rests on four values:

1. **Responsibility**: owning decisions and their consequences.
2. **Respect**: valuing yourself, others and the resources entrusted to you.
3. **Fairness**: making decisions impartially and objectively.
4. **Honesty**: understanding and telling the truth.

For each value, the code has **aspirational standards** (conduct practitioners strive for; hard to measure but expected) and **mandatory standards** (firm requirements; breaches can lead to disciplinary action by PMI's ethics review process).

> **Exam tip:** In ethics scenarios, the right answer is usually to act transparently and within the rules. Disclose conflicts of interest, report accurately, respect confidentiality and laws, and raise concerns through the proper channels rather than hide them.`,
      keyTerms: [
        { term: 'Project manager', def: 'The person assigned by the performing organisation to lead the team responsible for achieving the project objectives.' },
        { term: 'Sphere of influence', def: 'The people and levels a PM interacts with and influences: project, organisation, industry and profession.' },
        { term: 'Code of Ethics values', def: 'Responsibility, respect, fairness and honesty.' },
      ],
    },
    {
      id: 'm03-l2',
      title: 'Competences: the PMI Talent Triangle',
      minutes: 20,
      topics: ['r-talent-triangle'],
      objectives: [
        'Name the three skill sets in the PMI Talent Triangle',
        'Give examples of technical, leadership and strategic and business management skills',
      ],
      body: `## Three skill sets

The **PMI Talent Triangle** describes the balance of skills organisations look for:

| Skill set | What it covers | Examples |
|---|---|---|
| **Technical project management** | Knowledge, skills and behaviours for project, program and portfolio management | Planning, scheduling, managing cost, resources and risk; tailoring predictive and agile tools; knowing where to find expertise |
| **Leadership** | Guiding, motivating and directing a team to achieve business goals | Negotiation, resilience, communication, problem solving, critical thinking, interpersonal skills |
| **Strategic and business management** | Seeing the organisation's big picture and acting to deliver business outcomes | Understanding finance, marketing and operations; aligning the project with strategy; weighing costs, benefits and risks |

Technical skill on its own is not enough. Organisations increasingly want project managers who also have leadership ability and business sense.

## What effective project managers do

**Technically**, they focus on the critical elements of each project and keep key information at hand: critical success factors, the schedule, selected financial reports and the issue log. They plan and prioritise carefully, and tailor both traditional and agile tools to the situation.

**Strategically**, they can explain the organisation's strategy, mission, goals, products, operations, market and competition. They apply that knowledge to the project and judge risks, financial effects (such as cost against benefit, NPV and ROI), business value, benefits realisation and the balance of scope, budget, schedule and quality. They also work with the sponsor to keep the business strategy and project strategy aligned as conditions change.

> **Exam tip:** When a scenario shows the market or the organisation's strategy changing, the strategic and business management skill set is in play. The PM should check that the project still delivers business value, usually together with the sponsor.`,
      keyTerms: [
        { term: 'PMI Talent Triangle', def: 'Technical project management, leadership, and strategic and business management skill sets.' },
      ],
    },
    {
      id: 'm03-l3',
      title: 'Leadership, management, styles and power',
      minutes: 30,
      topics: ['r-leadership-qualities', 'r-politics-power', 'r-leadership-vs-management'],
      objectives: [
        'Contrast leadership and management',
        'Recognise common leadership styles',
        'Identify forms of power a project manager can use',
      ],
      body: `## Leadership qualities

People are the common factor in every project. The Guide notes that people can be counted, but they are not numbers. Effective leaders are visionary, optimistic and collaborative. They manage relationships and conflict, build trust, and communicate well; the best project managers are said to spend about **90% of their time communicating**. They are respectful, honest, ethical and culturally aware, and they focus on what matters most by continually re-prioritising.

## Leadership versus management

| Management | Leadership |
|---|---|
| Directs using **positional** power | Guides, influences and collaborates using **relational** power |
| Maintains and administers | Develops and innovates |
| Focuses on systems and structure | Focuses on relationships with people |
| Relies on control | Inspires trust |
| Near-term goals | Long-range vision |
| Asks *how* and *when* | Asks *what* and *why* |
| Accepts the status quo | Challenges the status quo |
| Does things **right** | Does the **right things** |

A project manager needs both. The skill is knowing which to use in each situation.

## Leadership styles

- **Laissez-faire**: hands-off; the team makes its own decisions.
- **Transactional**: sets goals, gives feedback and rewards accomplishment; management by exception.
- **Servant leader**: serves first; focuses on others' growth, learning, autonomy and well-being. Leadership follows from service.
- **Transformational**: empowers people through idealised attributes, inspirational motivation, encouragement of innovation and individual consideration.
- **Charismatic**: inspires through energy, enthusiasm and self-confidence.
- **Interactional**: combines transactional, transformational and charismatic styles.

The right style depends on the leader, the team members, and the organisational and environmental context.

## Politics and power

Politics involves influence, negotiation, autonomy and power. In itself it is neither good nor bad. The PM reads the situation and chooses the right kind of power, while respecting other people's autonomy.

| Form of power | Basis |
|---|---|
| Positional (formal, legitimate) | The role in the organisation |
| Informational | Control of gathering or sharing information |
| Referent | Respect, admiration and credibility |
| Situational | A particular situation, such as a crisis |
| Personal or charismatic | Personality and appeal |
| Relational | Networks, connections and alliances |
| Expert | Skill, knowledge and experience |
| Reward-oriented | Ability to give praise, money or other rewards |
| Punitive or coercive | Ability to impose negative consequences |
| Ingratiating | Flattery and finding common ground |
| Pressure-based | Limiting freedom of choice to secure compliance |
| Guilt-based | Imposing a sense of obligation or duty |
| Persuasive | Arguments that move people towards a desired result |
| Avoiding | Refusing to participate |

The most effective project managers are **proactive**. They build the power and authority they need, within organisational policy, rather than waiting for it to be granted.

> **Exam tip:** Expert and referent power are generally the most effective and durable. Coercive power is usually the least effective and the option to avoid in scenario answers.`,
      keyTerms: [
        { term: 'Servant leadership', def: 'Leading by serving the team first: focusing on their growth, autonomy and well-being.' },
        { term: 'Transactional leadership', def: 'Leadership through goals, feedback and rewards; management by exception.' },
        { term: 'Referent power', def: 'Power based on respect, admiration or credibility.' },
      ],
    },
    {
      id: 'm03-l4',
      title: 'Performing integration and navigating complexity',
      minutes: 20,
      topics: ['r-performing-integration'],
      objectives: [
        'Explain integration at the process, cognitive and context levels',
        'Identify the three dimensions of project complexity',
      ],
      body: `## The project manager as integrator

Integration is the project manager's most important role, and it works in two directions:

- **Upwards**, with the sponsor, to keep the project's objectives aligned with the strategy of the portfolio, program and organisation.
- **Within the project**, guiding the team to focus on what is essential by integrating processes, knowledge and people.

### Process level

Processes overlap and interact. A change to one requirement can affect scope, schedule, budget and quality. It is raised as a change request, analysed, and decided through Perform Integrated Change Control. If the PM fails to integrate processes that interact, the project has little chance of meeting its objectives.

### Cognitive level

How a PM integrates depends on the project's size, complexity and organisational culture. To integrate well, the PM must be proficient across all the Knowledge Areas and draw on experience, insight, leadership, and technical and business skills.

### Context level

Projects now operate in a changing context: new technologies, social networks, multicultural and virtual teams, and new values. The PM must consider these when planning communications and managing knowledge.

## Complexity

**Complexity** describes behaviour that is hard to manage because of three dimensions:

1. **System behaviour**: interdependencies between components and systems.
2. **Human behaviour**: interactions between individuals and groups.
3. **Ambiguity**: uncertainty about emerging issues and lack of understanding.

Complexity is a *perception*, shaped by each person's experience. Complex systems share some properties: many parts, many connections between them, dynamic interactions, and emergent behaviour that the parts alone cannot explain.

> **Exam tip:** When a scenario shows many interdependent stakeholders, unclear information and changing conditions, look for answers that use frequent feedback, shorter cycles and an adaptive approach, rather than a single detailed upfront plan.`,
      keyTerms: [
        { term: 'Integration (PM role)', def: 'Aligning the project with strategy and guiding the team by combining processes, knowledge and people.' },
        { term: 'Complexity', def: 'A characteristic arising from system behaviour, human behaviour and ambiguity that makes outcomes hard to manage or predict.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm03-q1',
      stem: 'How does a project manager differ from a functional manager?',
      options: ['The PM supervises a business unit permanently', 'The PM is assigned to lead a team to achieve project objectives; a functional manager oversees a functional or business unit', 'There is no difference in a matrix organisation', 'The functional manager approves the project charter'],
      answer: 1,
      explanation: 'The PM leads the team responsible for achieving project objectives. Functional managers oversee functional units, and operations managers keep operations efficient.',
      topic: 'r-pm-definition-sphere',
      ref: 'PMBOK 6 §3.2',
    },
    {
      id: 'm03-q2',
      stem: 'Which values form the basis of the PMI Code of Ethics and Professional Conduct?',
      options: ['Integrity, loyalty, trust and diligence', 'Responsibility, respect, fairness and honesty', 'Transparency, inspection, adaptation and courage', 'Quality, safety, value and service'],
      answer: 1,
      explanation: 'The code rests on four values: responsibility, respect, fairness and honesty.',
      topic: 'f-vocabulary-ethics',
      ref: 'PMBOK 6 §1.1.3',
    },
    {
      id: 'm03-q3',
      stem: 'A vendor offers the project manager an expensive gift while a contract is being evaluated. What should the project manager do?',
      options: ['Accept it, as long as the evaluation is not affected', 'Decline it and follow the organisation\'s policy for disclosing the offer', 'Accept it and share it with the team', 'Delay the decision until the contract is signed'],
      answer: 1,
      explanation: 'Accepting would create a conflict of interest and undermine fairness. Declining and disclosing through proper channels is consistent with the ethical values of fairness and honesty.',
      topic: 'f-vocabulary-ethics',
      ref: 'PMBOK 6 §1.1.3',
    },
    {
      id: 'm03-q4',
      stem: 'Which three skill sets make up the PMI Talent Triangle?',
      options: ['Planning, executing and controlling', 'Technical project management, leadership, and strategic and business management', 'Communication, negotiation and conflict management', 'Scope, schedule and cost'],
      answer: 1,
      explanation: 'The Talent Triangle comprises technical project management, leadership, and strategic and business management.',
      topic: 'r-talent-triangle',
      ref: 'PMBOK 6 §3.4.1',
    },
    {
      id: 'm03-q5',
      stem: 'A market shift means the project\'s product may no longer give the expected return. Which Talent Triangle skill set is most relevant?',
      options: ['Technical project management', 'Leadership', 'Strategic and business management', 'None; this is the sponsor\'s problem only'],
      answer: 2,
      explanation: 'Strategic and business management skills let the PM weigh business value and, with the sponsor, keep the project aligned with business strategy as conditions change.',
      topic: 'r-talent-triangle',
      ref: 'PMBOK 6 §3.4.3',
    },
    {
      id: 'm03-q6',
      stem: 'Which statement describes leadership rather than management?',
      options: ['Relies on control', 'Focuses on near-term goals', 'Asks what and why', 'Accepts the status quo'],
      answer: 2,
      explanation: 'Leadership asks what and why, focuses on long-range vision and challenges the status quo. Management relies on control, near-term goals and asks how and when.',
      topic: 'r-leadership-vs-management',
      ref: 'PMBOK 6 §3.4.5, Table 3-1',
    },
    {
      id: 'm03-q7',
      stem: 'A leader focuses on removing obstacles, developing team members and supporting their autonomy, putting the team\'s needs first. Which style is this?',
      options: ['Transactional', 'Laissez-faire', 'Servant leadership', 'Charismatic'],
      answer: 2,
      explanation: 'Servant leadership demonstrates a commitment to serve and put others first, focusing on their growth, learning, autonomy and well-being.',
      topic: 'r-leadership-vs-management',
      ref: 'PMBOK 6 §3.4.5.1',
    },
    {
      id: 'm03-q8',
      stem: 'Team members follow a project manager\'s advice because they respect her track record and credibility. Which form of power is this?',
      options: ['Positional', 'Coercive', 'Referent', 'Situational'],
      answer: 2,
      explanation: 'Referent power is based on respect, admiration or credibility gained.',
      topic: 'r-politics-power',
      ref: 'PMBOK 6 §3.4.4.3',
    },
    {
      id: 'm03-q9',
      stem: 'According to the Guide, how do the most effective project managers obtain the power they need?',
      options: ['They wait for authority to be granted by the sponsor', 'They proactively acquire the power and authority they need within organisational policies', 'They rely only on positional power', 'They use coercive power to secure compliance quickly'],
      answer: 1,
      explanation: 'Top project managers are proactive and intentional about power, acquiring what they need within policy rather than waiting for it.',
      topic: 'r-politics-power',
      ref: 'PMBOK 6 §3.4.4.3',
    },
    {
      id: 'm03-q10',
      stem: 'A requirement change affects scope, schedule and cost. Which level of integration does handling this through change control illustrate?',
      options: ['Process level', 'Cognitive level', 'Context level', 'Portfolio level'],
      answer: 0,
      explanation: 'At the process level, the PM integrates interacting processes. A change affecting several areas is handled through change requests and Perform Integrated Change Control.',
      topic: 'r-performing-integration',
      ref: 'PMBOK 6 §3.5.1',
    },
    {
      id: 'm03-q11',
      stem: 'Which three dimensions does the Guide associate with project complexity?',
      options: ['Scope, schedule and cost', 'System behaviour, human behaviour and ambiguity', 'Size, duration and budget', 'Technology, market and regulation'],
      answer: 1,
      explanation: 'Complexity arises from system behaviour (interdependencies), human behaviour (interplay of individuals and groups) and ambiguity (uncertainty and confusion).',
      topic: 'r-performing-integration',
      ref: 'PMBOK 6 §3.5.4',
    },
    {
      id: 'm03-q12',
      stem: 'About how much of their time do the best project managers spend communicating, according to the Guide?',
      options: ['About 25%', 'About 50%', 'About 75%', 'About 90%'],
      answer: 3,
      explanation: 'The Guide states that top project managers spend about 90% of their time communicating.',
      topic: 'r-leadership-qualities',
      ref: 'PMBOK 6 §3.4.4.2',
    },
  ],
};
