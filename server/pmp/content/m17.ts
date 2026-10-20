import type { Module } from '../types.ts';

export const M17: Module = {
  id: 'M17',
  number: '17',
  title: 'Agile Practice Guide',
  summary: 'The agile mindset, life cycle selection and hybrids, servant leadership and team composition, common agile practices, agile measurement, organisational considerations, frameworks, tailoring and suitability.',
  lessons: [
    {
      id: 'm17-l1',
      title: 'The agile mindset, lean and uncertainty',
      minutes: 30,
      topics: ['a-apg-purpose-scope', 'a-definable-vs-uncertain', 'a-manifesto-mindset', 'a-lean-kanban-uncertainty'],
      objectives: [
        'State the four values of the Agile Manifesto and paraphrase its principles',
        'Explain agile as a mindset expressed through values, principles and practices',
        'Relate agile and Kanban to lean thinking',
        'Use requirements and technical uncertainty to judge where agile fits',
      ],
      body: `## About the Agile Practice Guide

The *Agile Practice Guide* was produced jointly by PMI and the Agile Alliance. It is aimed at teams in the "messy middle", somewhere between predictive and agile working. It is practical rather than prescriptive, and it does not recommend any single approach. Agile is used well beyond software, for example in manufacturing, education and healthcare.

## Definable work versus high-uncertainty work

- **Definable work** follows clear, proven procedures, such as manufacturing a product once its design is complete. Uncertainty and risk are low.
- **High-uncertainty work** is new or exploratory: problem solving and design that has not been done before. Change, complexity and risk are high. Agile approaches were created to explore feasibility in short cycles and adapt quickly based on feedback.

## The Agile Manifesto (2001)

The four values. The items on the right have value, but the items on the left are valued more:

| Valued more | over | Still valued |
|---|---|---|
| **Individuals and interactions** | over | processes and tools |
| **Working software** | over | comprehensive documentation |
| **Customer collaboration** | over | contract negotiation |
| **Responding to change** | over | following a plan |

The twelve principles, paraphrased:

1. Satisfy the customer through early and continuous delivery of valuable work.
2. Welcome changing requirements, even late, for the customer's advantage.
3. Deliver working product frequently, preferring shorter timescales.
4. Business people and developers work together daily.
5. Build projects around motivated people; support them and trust them.
6. Face-to-face conversation is the most effective way to share information.
7. Working product is the primary measure of progress.
8. Keep a sustainable pace that can continue indefinitely.
9. Continuous attention to technical excellence and good design enhances agility.
10. Simplicity, the art of maximising the work *not* done, is essential.
11. The best architectures, requirements and designs come from self-organising teams.
12. At regular intervals the team reflects and adjusts how it works.

**Agile is a mindset**: it is defined by the 4 values, guided by the 12 principles, and shown through many practices. "Agile" is an umbrella term for approaches such as Scrum, XP, FDD, DSDM, Crystal and Scrumban.

Two ways to start: adopt a proven formal approach and learn it well before tailoring it (**premature tailoring limits the benefits**), or change specific practices to make progress on one value or principle. The goal is **not agile for its own sake** but a continuous flow of value and better business outcomes.

## Lean and Kanban

Agile and the **Kanban Method** both descend from **lean thinking**. They share a focus on value, respect for people, minimising waste, transparency, adapting to change and continuous improvement. The Kanban Method is less prescriptive than most agile approaches: it is the original "**start where you are**" method.

## Uncertainty and the complexity model

A model inspired by the Stacey complexity model plots **requirements uncertainty** against **technical uncertainty**:

- **Simple** (both low): linear, predictive approaches work well.
- **Complicated, then complex** (rising uncertainty): adaptive approaches work well.
- **Chaos** (both very high): fundamentally risky. Contain one of the two variables first.

High uncertainty raises the risk of **rework**. Small, verifiable increments with short feedback loops help the team learn what customers really need faster than a static written specification would.

> **Exam tip:** If a project has clear, stable requirements and proven technology but few chances for interim deliverables, a predictive life cycle is likely to fit. Assess **both** the requirements **and** the way the work will be delivered.`,
      keyTerms: [
        { term: 'Agile mindset', def: 'A way of thinking and behaving underpinned by the four values and twelve principles of the Agile Manifesto.' },
        { term: 'Lean thinking', def: 'A philosophy focused on value, flow, eliminating waste and respect for people; the superset of agile and Kanban.' },
        { term: 'High-uncertainty work', def: 'Exploratory work with high rates of change, complexity and risk, suited to short feedback cycles.' },
      ],
    },
    {
      id: 'm17-l2',
      title: 'Choosing a life cycle and building hybrids',
      minutes: 30,
      topics: ['a-life-cycle-types', 'a-hybrid-tailoring'],
      objectives: [
        'Compare predictive, iterative, incremental and agile life cycles',
        'Distinguish iteration-based and flow-based agile',
        'Recognise common hybrid patterns and when to use them',
      ],
      body: `## Four life cycles

| | Predictive | Iterative | Incremental | Agile |
|---|---|---|---|---|
| Requirements | **Fixed** | Dynamic | Dynamic | Dynamic |
| Activities | Done once for the whole project | Repeated until correct | Done once per increment | Repeated until correct |
| Delivery | Single delivery | Single delivery | Frequent smaller deliveries | Frequent small deliveries |
| Goal | **Manage cost** | **Correctness of the solution** | **Speed** | **Customer value** through frequent delivery and feedback |

- **Predictive** makes the most of what is known and proven, plans in detail up front and restricts change. Business value usually arrives at the end.
- **Iterative** improves unfinished work through feedback from prototypes. It is optimised for **learning**, not speed.
- **Incremental** delivers finished, usable subsets, such as a minimum viable product (MVP). It is optimised for **speed**.
- **Agile** is both iterative and incremental, and delivers the highest-value work first.

> **Remember:** Every life cycle includes planning. The difference is **how much** planning is done and **when**.

### Iteration-based versus flow-based agile

- **Iteration-based**: equal-length timeboxes, each delivering working, tested features. The team **swarms** on the most important feature, finishes it, then moves to the next.
- **Flow-based**: features are pulled from the backlog as capacity allows, through task-board columns with **work-in-progress (WIP) limits**. Each feature takes as long as it takes, and the team chooses its own rhythm for planning, reviews and retrospectives.

## Hybrid patterns

| Pattern | Example |
|---|---|
| **Agile development, then predictive rollout** | Build a new product in an agile way, then roll it out and train thousands of users through a defined, repeatable process |
| **Agile and predictive at the same time** | A team transitioning to agile: short iterations and retrospectives, but still upfront estimates and assigned tasks |
| **Largely predictive with agile components** | A routine building project trials a new roofing material in small experiments first |
| **Largely agile with a predictive component** | A vendor's component that is delivered only once, or a 200-page calculation specification built by a separate predictive team |
| **Fit-for-purpose, risk-based** | A campus delivered building by building (incremental), with each building built predictively |

Hybrid can also be a **transition strategy**: add iterative techniques first, then incremental ones, starting with a lower-risk project.

### Mixing agile approaches

A common blend is **Scrum** (roles, events and artefacts), plus a **kanban board** (to visualise flow and limit WIP), plus **XP-inspired engineering practices** (continuous integration, refactoring, test-driven development, automated testing).

### Tailoring options

| If... | Consider... |
|---|---|
| Demand is steady or sporadic | A regular cadence, or flow-based agile with a cadence for reviews |
| The team needs to improve quickly | More frequent retrospectives |
| Flow is often blocked | Kanban boards and experiments with WIP limits |
| Increments have quality problems | Test-driven practices |
| More than one team is involved | Agile program management or a scaling framework |
| The team is new to agile | Training in the mindset and principles, then a workshop on the chosen approach |

> **Exam tip:** "How can we be most successful?" is the question to ask. If no intermediate value can be delivered, agile may not help.`,
      keyTerms: [
        { term: 'Incremental life cycle', def: 'An approach that provides finished deliverables the customer may be able to use immediately.' },
        { term: 'Iterative life cycle', def: 'An approach that allows feedback on unfinished work to improve and modify it.' },
        { term: 'Hybrid approach', def: 'A combination of predictive, iterative, incremental and/or agile elements.' },
        { term: 'Minimum viable product (MVP)', def: 'The smallest subset of a product that delivers value and allows learning from real customer feedback.' },
      ],
    },
    {
      id: 'm17-l3',
      title: 'Servant leadership and agile team composition',
      minutes: 30,
      topics: ['a-servant-leadership', 'a-team-composition'],
      objectives: [
        'Describe the servant leader\'s order of focus and responsibilities',
        'Explain the role of the project manager on an agile team',
        'Describe effective agile team characteristics and the three common roles',
        'Explain the cost of multitasking and the value of T-shaped people',
      ],
      body: `## Servant leadership

**Servant leadership** is leading through service to the team: understanding and meeting team members' needs and supporting their development so the team can perform at its best. Approach things in this order:

1. **Purpose**: work with the team to define *why*.
2. **People**: create an environment where everyone can succeed.
3. **Process**: do not chase the "perfect" agile process. Look for results.

**Characteristics:** promoting self-awareness, listening, serving, helping people grow, **coaching rather than controlling**, and promoting safety, respect and trust.

**Responsibilities:**

- **Facilitate**, not manage coordination: help everyone do their best thinking, and act as an impartial bridge-builder.
- **Remove organisational impediments**: for example, there is little point delivering every two weeks if releasing takes six. Challenge slow documentation, finance or approval processes.
- **Pave the way** for others' contributions: team space, a commitment to one project at a time, incremental budgeting with finance.
- Educate stakeholders; mentor and develop people; help with technical PM work such as quantitative risk analysis; celebrate successes.

### The PM on an agile team

Many frameworks do not mention a project manager, but PMs add a great deal of value by changing *how* they contribute. The value of a project manager lies in making everyone else better, not in the position itself. On high-change projects the PM moves **from the centre to serving** the team: coaching, encouraging collaboration, aligning stakeholder needs, and giving responsibility to the people who have the knowledge.

## Team composition

| Characteristic | Why it helps |
|---|---|
| **Dedicated**, small team (about **3 to 9** people) | Focus and productivity |
| **Cross-functional** | Delivers finished value without depending on others |
| **Colocated**, or able to manage distance well | Communication, trust, knowledge sharing |
| A mix of generalists and specialists | Expertise plus flexibility |
| **Stable** work environment | People can rely on each other; costs are predictable |

### Roles

- **Cross-functional team member**: together the team has every skill needed to deliver working product on a regular cadence.
- **Product owner**: sets the product direction, **ranks the work by business value**, works with the team every day, and creates the backlog with the team. Strong product ownership is a critical success factor.
- **Team facilitator**: a servant leader. The title may be project manager, scrum master, team lead or coach.

### T-shaped people and flow

**T-shaped** (generalising specialist) people have deep expertise in one area plus broad skills across others. **I-shaped** people have depth only. Agile teams aim for **flow efficiency**, the throughput of the whole team, rather than **resource efficiency**, keeping each person busy. Avoid "**mini-waterfalls**" (all requirements, then all design, then all build) by pairing, swarming and mobbing.

### The cost of multitasking

Switching between tasks costs **20% to 40%** of productivity, and the loss grows quickly with each extra task. Someone split across two projects does not give 50% to each; they give less, and they make more mistakes. Part-time assignments create risk.

**Team structures:** colocated; **distributed** (cross-functional teams in different places); **dispersed** (each member in a different place). Useful techniques are a **fishbowl window** (an always-on video link) and **remote pairing**.`,
      keyTerms: [
        { term: 'Servant leadership', def: 'Leading through service to the team, focusing on members\' needs and development to enable high performance.' },
        { term: 'Product owner', def: 'The person responsible for maximising product value by ranking work and guiding product direction.' },
        { term: 'T-shaped person', def: 'Someone with one deep specialism and broad ability across the other skills the team needs.' },
        { term: 'Flow efficiency', def: 'Optimising the throughput of the whole team rather than the utilisation of individuals.' },
      ],
    },
    {
      id: 'm17-l4',
      title: 'Delivering in agile: chartering and common practices',
      minutes: 35,
      topics: ['a-charter-practices'],
      objectives: [
        'Describe an agile project charter and team charter',
        'Run effective retrospectives, backlog refinement, standups and demonstrations',
        'Name the key execution practices and troubleshooting responses',
      ],
      body: `## Chartering

Every project needs a charter. An agile charter answers four questions:

- **Why** are we doing this? (the vision)
- **Who** benefits, and how?
- What does **done** mean for the project? (the release criteria)
- **How** will we work together?

A **team charter**, or social contract, records the team's **values** (such as a sustainable pace and core hours), its **working agreements** (the definition of *ready*, the definition of *done*, respecting the timebox, WIP limits), its **ground rules** (one person speaks at a time) and its **group norms** (how meeting times are treated).

## Retrospectives: the single most important practice

Retrospectives are how the team learns, improves and adapts (principle 12). Hold one at the end of each iteration, and also when a release ships, when several weeks have passed, when the team seems stuck, or at any milestone.

- Allow enough time to gather data, make sense of it and decide on experiments.
- Use both qualitative and quantitative data to find root causes.
- Retrospectives are **not about blame**.
- **Limit the action items to the team's capacity.** Finishing a few improvements beats starting many. Decide how each improvement will be measured.

## Backlog preparation and refinement

- The **backlog** is the ordered list of all the team's work, in story form. Write only enough stories to understand the first release broadly and the next iteration in detail. A **product roadmap** shows the expected sequence of deliverables.
- **Refinement**: the product owner and team prepare stories for the next iteration so everyone understands them and their relative size. **Spikes** explore risky items. **Triads** (developer, tester and business analyst or product owner) write stories together. Aim for stories small enough to finish **at least one a day**, and spend no more than about **an hour a week** on refinement; more than that suggests over-preparation.

## Daily standups

Timebox standups to **15 minutes**. Anyone can facilitate, preferably not the PM.

| Iteration-based (round robin) | Flow-based (walk the board right to left) |
|---|---|
| What did I complete since the last standup? | What do we need to do to advance this work? |
| What do I plan to complete before the next one? | Is anyone working on anything not on the board? |
| What are my impediments? | What do we need to finish as a team? Are there bottlenecks? |

**Antipatterns:** the standup becomes a **status meeting**, or the team starts **solving problems** in it. Record problems in a "parking lot" and deal with them afterwards.

## Demonstrations and planning

- **Demos and reviews**: the team shows working product, and the product owner accepts or rejects stories. As a guideline, demonstrate working product **at least every two weeks**. Invite the PMO and portfolio decision-makers.
- **Iteration planning**: do not commit beyond the team's capacity, and plan less when people are away. Plan a little, deliver, learn, replan.

> **Source note:** The Agile Practice Guide refers to a "Section 4.10" for estimation examples, but that section does not exist. Agile measurement is covered in Section 5.4, which is the next lesson.

## Execution practices (largely from XP)

- **Continuous integration**: integrate work frequently and retest everything.
- **Test at all levels**, with a strong preference for automation.
- **ATDD**: agree the acceptance criteria and tests first, then build just enough to pass them.
- **TDD and BDD**: write automated tests before the product, to design it and prevent mistakes.
- **Spikes**: timeboxed research or experiments.

## Troubleshooting examples

| Pain point | Possible response |
|---|---|
| Unclear purpose | Charter for purpose (vision, mission) |
| Inaccurate estimates | Split stories smaller; relative estimation by the whole team; spikes |
| Team struggles with obstacles | The servant leader clears them, or escalates those they cannot remove |
| Defects | Pairing, collective ownership, pervasive automated testing, a robust definition of done |
| Work not complete | A team-defined **definition of done** plus project release criteria |
| Technical debt | Refactoring, automated code quality analysis |
| Badly ordered backlog | Rank by value, for example **cost of delay divided by duration (CD3)** |
| Siloed teams | Ask people to self-organise into cross-functional teams |`,
      keyTerms: [
        { term: 'Definition of done', def: 'A team\'s checklist of all criteria a deliverable must meet to be ready for customer use.' },
        { term: 'Definition of ready', def: 'A team\'s checklist for a user story to have all information needed to start work.' },
        { term: 'Spike', def: 'A short, timeboxed piece of research or prototyping to reduce uncertainty.' },
        { term: 'Backlog refinement', def: 'Ongoing collaborative work to review, update and write requirements so they are ready for upcoming iterations.' },
      ],
    },
    {
      id: 'm17-l5',
      title: 'Measuring agile projects',
      minutes: 30,
      topics: ['a-agile-measurements'],
      objectives: [
        'Explain why agile prefers empirical measures over predictive ones',
        'Read burndown, burnup, feature and cumulative flow charts',
        'Forecast with velocity or cycle time',
        'Calculate agile SPI and CPI',
      ],
      body: `## Measure results, not predictions

Traditional status reporting can mislead. A "watermelon project" looks green on the outside and is red on the inside: it reports "90% done" until integration exposes the problems. Agile measures **what the team has delivered**, not what it predicts. **Finished features** are better evidence than surrogate measures such as percent complete. Qualitative measures, such as business satisfaction and team morale, add context.

## Forecasting

- **Velocity** is the sum of the story points of the features **actually completed** in an iteration. It usually takes **four to eight iterations** to become stable.
- *Example:* 400 points remain and the team averages 40 points per iteration, so about **10 iterations** remain.
- *Example with cycle time:* 24 stories remain at an average of 2 days each, so about **48 business days** remain.
- Show the uncertainty, for example with "hurricane-style" ranges.

Story points are **relative and specific to each team**, so velocities cannot be compared or added across teams.

## Charts

| Chart | Shows |
|---|---|
| **Burndown** | Story points **remaining** against an ideal line, within an iteration |
| **Burnup** | Story points **completed**; makes scope changes visible |
| **Feature chart** | Features complete, remaining and total over time; shows the requirements growing |
| **Product backlog burnup** | Completed work against total expected work, by iteration |
| **Kanban board** | Work states in columns, with WIP limits |
| **Cumulative flow diagram** | Bands for each work state over time. A **widening band** shows a bottleneck. The vertical width is work in progress; the horizontal distance shows lead time and cycle time |

## Flow measures

- **Lead time**: from when an item is **added to the board** until it is **delivered**.
- **Cycle time**: from when **work starts** on an item until it is **complete**.
- **Response time**: how long an item **waits** before work starts. The guide also calls a similar measure *reaction time*: the time from "ready" to the first working column.

When the team depends on outside groups, cycle time shows the team's own speed, and lead time exposes the external delays. When a column reaches its **WIP limit**, the team stops pulling new work and helps move the work already in that column.

Burnups and burndowns measure **capacity**. Lead time and cycle time measure **predictability**. Measuring story points without finishing features measures capacity, not finished work.

## Earned value in agile

- **SPI = completed features (or points) ÷ planned features (or points)**. For example, 24 points completed out of 30 planned gives SPI = **0.80**.
- **CPI = earned value (the value of completed features) ÷ actual cost**. For example, $1.8M ÷ $2.0M gives CPI = **0.90**.

> **Exam tip:** On an agile project, the best evidence of progress is **working, accepted product**, not hours spent or story points started.`,
      keyTerms: [
        { term: 'Velocity', def: 'The sum of story point sizes for features actually completed in an iteration.' },
        { term: 'Lead time', def: 'Total time from an item being added to the board until it is delivered.' },
        { term: 'Cycle time', def: 'Time from starting work on an item until it is completed.' },
        { term: 'Cumulative flow diagram', def: 'A chart of work in each state over time, revealing bottlenecks and WIP.' },
      ],
    },
    {
      id: 'm17-l6',
      title: 'Organisational considerations for agility',
      minutes: 30,
      topics: ['a-org-change-culture', 'a-agile-contracts', 'a-org-business-pmo-structure', 'a-call-to-action'],
      objectives: [
        'Identify drivers of change and signs of organisational readiness',
        'Assess culture with sliding scales and explain why psychological safety matters',
        'Choose agile contracting techniques',
        'Describe the agile PMO and how to evolve an organisation incrementally',
      ],
      body: `## Change management

Two factors make change management especially important with agile:

- **Accelerated delivery**: the receiving organisation may not be able to absorb outputs at the faster pace, which delays the return on investment.
- **The agile approach itself**: more collaboration, more hand-offs, and iterative rework that people may see as waste.

| Change-friendly characteristics | Roadblocks |
|---|---|
| Executives willing to change | Work split into departmental silos |
| Willingness to change how people are assessed | Procurement driven by short-term price |
| How PPM functions are organised | Leaders rewarded for local efficiency, not end-to-end flow |
| Short-term budgeting and metrics | Specialists with no incentive to broaden their skills (I-shaped) |
| Talent management maturity | People spread across too many projects |

**Responses:** visible executive sponsorship; change management including communication and coaching; adopting agile project by project, and introducing practices incrementally; leading by example.

## Culture

Culture is an organisation's DNA. It ranges from highly predictive to lean startup, where everything is an experiment. The most important cultural norm is a **safe, honest and transparent environment**, so people can reflect on what happened and learn from failure.

**Assess culture** with sliding scales: speed versus stability, quantity versus quality, exploration versus execution, flexibility versus predictability. Then choose techniques that fit. Culture and structure must change **together**.

## Agile contracting

The aim is collaboration and shared risk and reward, not winners and losers.

| Technique | Idea |
|---|---|
| **Multi-tiered structure** | Fixed items in a master agreement; changeable rates in a schedule of services; scope, schedule and budget in a lightweight SOW |
| **Emphasise value delivered** | Tie milestones and payments to value-driven deliverables |
| **Fixed-price increments** | Price small pieces, such as user stories |
| **Not-to-exceed T&M** | A capped budget; new work replaces old within capacity |
| **Graduated T&M** | A higher rate for early delivery, a lower rate for late delivery |
| **Early cancellation option** | The customer can stop once it has enough value, paying a cancellation fee |
| **Dynamic scope option** | A fixed budget; scope can vary at agreed points |
| **Team augmentation** | Embed the supplier's people; fund teams, not scope |
| **Favour full-service suppliers** | Avoid splitting work so that every supplier depends on every other |

## Business practices, scaling and the PMO

- Finance, HR and procurement may need to change. Examples: how products are capitalised, individual incentives, appraisals of self-organising staff, and contracts that support frequent delivery.
- **Scaling**: start small. A **healthy single team** is the key success factor. If one team cannot work in an agile way, fix the impediments before scaling up.
- **The agile PMO** is:
  - **value-driven**: it works like an in-house consultancy;
  - **invitation-oriented**: it offers services rather than mandating them, so its practices "stick";
  - **multidisciplinary**: it covers change management, organisational design and more.

  It may become an agile centre of excellence: standards, training and coaching, coordination across projects, organisational learning, stakeholder support, and recruiting team leaders.
- **Organisational structure**: geography, functional silos, deliverable size, dedicated allocation, and dependence on vendors (knowledge leaves when they do) all matter.
- **Evolve the organisation incrementally**: treat the change itself as an agile project, with a prioritised backlog of changes, each one a short experiment, tracked on a kanban board.

The guide ends with a **call to action**: inspection, adaptation and transparency are the constants, and inspection without adaptation is wasted effort.`,
      keyTerms: [
        { term: 'Psychological safety', def: 'A safe, honest, transparent environment where people can reflect and learn from failure without blame.' },
        { term: 'Team augmentation', def: 'An agile contracting approach embedding the supplier\'s people into the customer organisation and funding teams rather than scope.' },
        { term: 'Agile PMO', def: 'A value-driven, invitation-oriented, multidisciplinary PMO supporting agile delivery.' },
      ],
    },
    {
      id: 'm17-l7',
      title: 'Agile and lean frameworks',
      minutes: 30,
      topics: ['a-frameworks-team', 'a-frameworks-scaled'],
      objectives: [
        'Describe Scrum roles, events and artefacts',
        'Recognise XP practices, the Kanban Method\'s principles, Crystal, Scrumban, FDD, DSDM and Agile UP',
        'Describe Scrum of Scrums, SAFe, LeSS, Enterprise Scrum and Disciplined Agile',
      ],
      body: `## No framework is mandatory

An approach built from scratch is fine, as long as it follows the Manifesto's values and principles. The guide describes frameworks that are holistic, formalised for common use and popular.

## Team-level frameworks

**Scrum:** a single-team framework. **Sprints** are timeboxes of **one month or less** that produce a potentially releasable increment.

| Roles | Events | Artefacts |
|---|---|---|
| **Product owner**: maximises product value | Sprint; sprint planning; daily scrum; sprint review; sprint retrospective | Product backlog; sprint backlog; increments |
| **Development team**: cross-functional and self-organising | | |
| **Scrum master**: upholds the process, coaches, removes impediments | | |

**eXtreme Programming (XP):** values are communication, simplicity, feedback, courage and respect. Practices are grouped by area:

- *organisational*: sit together, whole team, informative workspace;
- *technical*: **pair programming**, test-first programming, incremental design;
- *planning*: user stories, weekly and quarterly cycles, slack;
- *integration*: 10-minute build, **continuous integration**, test-first.

Secondary practices include collective code ownership and refactoring.

**Kanban Method:** from lean manufacturing (Toyota). "Kanban" means visual sign or card. It does not prescribe timeboxes: work is **pulled**, and WIP is **limited**. Finishing work matters more than starting it.

| Defining principles | Core properties |
|---|---|
| Start with the current state | Visualise the workflow |
| Agree to pursue incremental, evolutionary change | Limit work in progress |
| Respect current process, roles and titles | Manage flow |
| Encourage leadership at all levels | Make process policies explicit; implement feedback loops; improve collaboratively |

**Crystal:** a family of methods chosen by **team size** and **criticality** (what a defect could cost: comfort, discretionary money, essential money, or life). Crystal Clear suits about 1 to 4 people; Yellow, Orange and Red suit progressively larger and more critical projects. Its common properties include frequent delivery, reflective improvement, close ("osmotic") communication and personal safety.

**Scrumban:** began as a transition from Scrum to Kanban. It uses Scrum as the framework with kanban boards and WIP limits; a **planning trigger** starts planning when WIP falls below a limit. There are no predefined roles.

**Feature-Driven Development (FDD):** six roles (project manager, chief architect, development manager, chief programmer, class owner, domain expert). Five activities: develop an overall model, build a features list, plan by feature, design by feature, build by feature.

**DSDM:** **constraint-driven**. Cost, quality and time are **fixed** at the start, and **functionality varies** through formal prioritisation. Its eight principles include "never compromise quality" and "deliver on time".

**Agile Unified Process (AgileUP):** a lighter, faster version of the Unified Process. Disciplines run in iterations, guided by principles such as simplicity and tailoring to fit.

## Scaling frameworks

- **Scrum of Scrums (SoS):** a representative from each Scrum team (teams of 3 to 9) meets, typically **two or three times a week** or even daily, to report completed work, next work, current impediments and impediments that may affect other teams. For larger efforts there can be a Scrum of Scrum of Scrums.
- **SAFe:** a knowledge base of patterns for scaling across the enterprise (portfolio, program and team), organised around **value streams**.
- **LeSS (Large-Scale Scrum):** keeps as much of single-team Scrum as possible: **one product backlog, one definition of done, one product owner, one sprint**, and one potentially shippable increment. It adds two-part sprint planning, cross-team refinement and an overall retrospective.
- **Enterprise Scrum:** applies Scrum to the whole organisation, not just product development.
- **Disciplined Agile (DA):** a process decision framework that is people-first, learning-oriented, covers the full delivery life cycle, and is goal-driven, enterprise-aware and scalable.

> **Exam tip:** "Fix time, cost and quality, and flex the features" is DSDM. "One product owner and one backlog for several teams" is LeSS.`,
      keyTerms: [
        { term: 'Sprint', def: 'A timeboxed Scrum iteration of one month or less producing a potentially releasable increment.' },
        { term: 'Scrum master', def: 'Coach and process owner in Scrum who removes impediments and facilitates events.' },
        { term: 'Scrum of Scrums', def: 'A technique where representatives of multiple Scrum teams meet to coordinate dependencies and impediments.' },
        { term: 'DSDM', def: 'Dynamic Systems Development Method: a constraint-driven agile framework that fixes cost, time and quality and varies features.' },
      ],
    },
    {
      id: 'm17-l8',
      title: 'Annexes: Knowledge Area mapping, tailoring and suitability filters',
      minutes: 30,
      topics: ['a-pmbok-ka-mapping', 'a-manifesto-mapping', 'a-tailoring-agile', 'a-suitability-filter', 'g-apg-glossary'],
      objectives: [
        'Explain how each PMBOK Knowledge Area applies in agile work',
        'Apply the cautions and guidelines for tailoring agile',
        'Use the agile suitability filter to discuss predictive, hybrid or agile fit',
        'Use key agile glossary terms precisely',
      ],
      body: `## Agile across the Knowledge Areas (Annex A1)

| Knowledge Area | In agile work |
|---|---|
| Integration | Team members act as local domain experts; the PM's accountability stays, but detailed planning and delivery are delegated to the team |
| Scope | Less upfront definition, more ongoing discovery; the requirements form the **backlog** |
| Schedule | Short cycles; iterative or pull-based scheduling; roadmaps for scale |
| Cost | Lightweight estimates; detailed estimates just in time; with a strict budget, scope and schedule flex |
| Quality | Frequent reviews throughout; retrospectives improve the process; small batches |
| Resource | Self-organising teams of generalising specialists; fast-supply agreements and lean methods |
| Communications | More frequent, faster communication; colocation; open artefacts; stakeholder reviews |
| Risk | Frequent reviews of increments; risk considered when choosing iteration content |
| Procurement | Sellers extend the team; shared risk and reward; a master services agreement with adaptive work in an appendix |
| Stakeholder | Direct engagement and co-creation; aggressive transparency |

Annex A2 maps the Manifesto's values and principles to sections of the guide.

## Tailoring agile (Appendix X2)

- **Gain experience first.** Tailoring is advanced. Succeed with an approach as designed before you tailor it. "We dropped retrospectives because they were unpopular" points to a deeper problem.
- **Shu-Ha-Ri**: **Shu** means follow the rules; **Ha** means consciously depart from them; **Ri** means find your own path.
- **Tailor collaboratively** with the people affected.
- **Beware of taking things away.** Many practices support each other: colocation makes lightweight requirements workable, and rigorous testing makes bold refactoring safe.
- **Trial changes** for an iteration or two, then review them in a retrospective.

| Situation | Recommendation |
|---|---|
| Very large team | Split into smaller teams or projects; use program management or a scaling framework |
| Dispersed team | Use collaboration tools; meet face to face early; use round-robin check-ins |
| Safety-critical work | Add conformance and documentation to the definition of done, or use a hybrid |
| Stable requirements | Question whether full agile is needed |
| Functional silos | Let people form cross-functional teams; fix compensation that rewards silos |
| Transparency causes fear | Lead by example, with visible decision-making |
| Inexperienced team | Give more direction until skills grow |
| No executive buy-in | Find common ground; explain agile in lean terms; run experiments |
| Terms clash with the culture | Rename them (for example, "planning workshop" instead of "planning game") |

## Agile suitability filter (Appendix X3)

The filter assesses three categories on a **radar chart**:

- **Culture**: buy-in to the approach, trust in the team, the team's decision-making powers.
- **Team**: team size, experience levels, access to the customer or business.
- **Project**: likelihood of change, criticality, incremental delivery.

**Low scores (near the centre) suggest agile**, middle scores suggest hybrid, and high scores (at the edge) suggest predictive. For example, if 50% of requirements change each month, score 1; if 5% change, score 10. Criticality runs from loss of comfort (1) to loss of many lives (10).

- Complete the filter **as a group**. The conversation is where the value lies.
- Follow the **stakeholders' consensus**, even if it differs from the result.
- Treat mismatches as **inputs to risk management**.
- It is a diagnostic tool, not a gate.

## Key agile terms (APG glossary)

- **Swarming**: several team members working together to resolve one impediment.
- **Mobbing**: several team members working together on one work item.
- **Pairing**: two people working on the same item.
- **Technical debt**: the deferred cost of work not done earlier.
- **Information radiator**: a visible display of status.
- **Value stream mapping**: a lean technique to analyse and improve flow.
- **Double-loop learning**: questioning underlying assumptions, not just fixing symptoms.

> **Source note:** The APG glossary defines the Scrum team as including a "process owner", while Annex A3 names the **product owner**. This course follows Annex A3.`,
      keyTerms: [
        { term: 'Shu-Ha-Ri', def: 'A model of skill acquisition: obey the rules, consciously depart from them, then find an individual path.' },
        { term: 'Agile suitability filter', def: 'A group assessment of culture, team and project attributes plotted on a radar chart to discuss agile, hybrid or predictive fit.' },
        { term: 'Swarming', def: 'Multiple team members focusing collectively on resolving a specific impediment.' },
        { term: 'Technical debt', def: 'The deferred cost of work not done at an earlier point in the product life cycle.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm17-q1',
      stem: 'Which statement reflects the Agile Manifesto value about plans?',
      options: ['Following a plan over responding to change', 'Responding to change over following a plan', 'Plans are not valued in agile', 'Plans replace customer collaboration'],
      answer: 1,
      explanation: 'The Manifesto values responding to change over following a plan; plans still have value, but responding to change is valued more.',
      topic: 'a-manifesto-mindset',
      ref: 'APG §2.2',
    },
    {
      id: 'm17-q2',
      stem: 'Per the uncertainty model in the Agile Practice Guide, which situation calls for containing one variable before proceeding?',
      options: ['Low requirements and low technical uncertainty', 'High requirements uncertainty but proven technology', 'Very high requirements and very high technical uncertainty (chaos)', 'Stable requirements with a new tool'],
      answer: 2,
      explanation: 'When both technical and requirements uncertainty are very high the project becomes chaotic; one variable must be contained to make it reliably possible.',
      topic: 'a-lean-kanban-uncertainty',
      ref: 'APG §2.4, Figure 2-5',
    },
    {
      id: 'm17-q3',
      stem: 'Which life cycle is optimised for speed of delivery by providing finished subsets the customer can use immediately?',
      options: ['Predictive', 'Iterative', 'Incremental', 'Waterfall'],
      answer: 2,
      explanation: 'Incremental life cycles optimise for speed, delivering finished deliverables the customer may use immediately. Iterative cycles optimise for learning and correctness.',
      topic: 'a-life-cycle-types',
      ref: 'APG §3.1, Table 3-1',
    },
    {
      id: 'm17-q4',
      stem: 'A new product is developed with agile iterations, then rolled out to 5,000 users through a defined, repeatable process. Which pattern is this?',
      options: ['Largely predictive with agile components', 'Agile development followed by a predictive rollout', 'Flow-based agile', 'Pure incremental'],
      answer: 1,
      explanation: 'Agile development for the uncertain part, followed by a predictive rollout of a defined, repeatable process, is a common hybrid pattern.',
      topic: 'a-hybrid-tailoring',
      ref: 'APG §3.1.6, Figure 3-6',
    },
    {
      id: 'm17-q5',
      stem: 'According to the Agile Practice Guide, in what order should a servant leader focus?',
      options: ['Process, people, purpose', 'People, process, purpose', 'Purpose, people, process', 'Purpose, process, people'],
      answer: 2,
      explanation: 'Servant leaders start with purpose (why), then people (an environment where everyone succeeds), then process (results over a "perfect" process).',
      topic: 'a-servant-leadership',
      ref: 'APG §4.2',
    },
    {
      id: 'm17-q6',
      stem: 'A team delivers every two weeks, but releasing to production takes six weeks because of a slow approval process. What should the servant leader do?',
      options: ['Ask the team to work faster', 'Work to remove or streamline the organisational impediment', 'Lengthen iterations to six weeks', 'Stop doing demos'],
      answer: 1,
      explanation: 'Removing organisational impediments, such as lengthy approval or release processes, is a key servant leader responsibility.',
      topic: 'a-servant-leadership',
      ref: 'APG §4.2.1',
    },
    {
      id: 'm17-q7',
      stem: 'A developer is assigned 50% to each of two projects. What does the Agile Practice Guide suggest about their effective contribution?',
      options: ['Exactly 50% to each', 'Less than 50% to each, because task switching costs 20%–40% of productivity', 'More than 50% due to variety', 'It depends only on the PM'],
      answer: 1,
      explanation: 'Task switching costs 20%–40% of productivity, so a person split across two projects contributes noticeably less than half to each and makes more mistakes.',
      topic: 'a-team-composition',
      ref: 'APG §4.3.5',
    },
    {
      id: 'm17-q8',
      stem: 'Who ranks the backlog by business value and works with the team daily on product direction?',
      options: ['Team facilitator', 'Product owner', 'Functional manager', 'PMO'],
      answer: 1,
      explanation: 'The product owner guides product direction, ranks work by business value and works with the team daily.',
      topic: 'a-team-composition',
      ref: 'APG §4.3.2, Table 4-2',
    },
    {
      id: 'm17-q9',
      stem: 'Which practice does the Agile Practice Guide call the single most important practice?',
      options: ['Daily standups', 'Retrospectives', 'Backlog refinement', 'Velocity tracking'],
      answer: 1,
      explanation: 'Retrospectives are called the single most important practice because they let the team learn, improve and adapt its process.',
      topic: 'a-charter-practices',
      ref: 'APG §5.2.1',
    },
    {
      id: 'm17-q10',
      stem: 'Daily standups have turned into 45-minute problem-solving sessions run by the PM. What is the best correction?',
      options: ['Cancel standups', 'Timebox to 15 minutes, park problems for follow-up, and let any team member facilitate', 'Make them weekly', 'Have the PM collect status by email instead'],
      answer: 1,
      explanation: 'Standups are timeboxed to 15 minutes; solving problems in them and turning them into status meetings are antipatterns. Issues go to a parking lot.',
      topic: 'a-charter-practices',
      ref: 'APG §5.2.4',
    },
    {
      id: 'm17-q11',
      stem: 'A team has 360 story points remaining and an average velocity of 45. About how many iterations remain?',
      options: ['6', '8', '10', '12'],
      answer: 1,
      explanation: '360 ÷ 45 = 8 iterations. The estimate will change as stories and velocity are refined.',
      topic: 'a-agile-measurements',
      ref: 'APG §5.4.1',
    },
    {
      id: 'm17-q12',
      stem: 'On a cumulative flow diagram, the "test" band keeps getting wider. What does this indicate?',
      options: ['Testing is ahead of schedule', 'Work is accumulating in test: a bottleneck', 'Scope has decreased', 'Velocity has increased'],
      answer: 1,
      explanation: 'A swelling band means work is accumulating in that state, indicating a bottleneck and growing WIP.',
      topic: 'a-agile-measurements',
      ref: 'APG §5.4, Figure 5-7',
    },
    {
      id: 'm17-q13',
      stem: 'A customer wants the option to stop the contract once enough value has been delivered, paying a fee for the remainder. Which agile contracting technique is this?',
      options: ['Graduated time and materials', 'Early cancellation option', 'Team augmentation', 'Multi-tiered structure'],
      answer: 1,
      explanation: 'The early cancellation option lets the customer stop when it has sufficient value, paying a cancellation fee, limiting budget exposure.',
      topic: 'a-agile-contracts',
      ref: 'APG §6.3',
    },
    {
      id: 'm17-q14',
      stem: 'Which framework fixes cost, time and quality at the outset and varies functionality through formal prioritisation?',
      options: ['Scrum', 'XP', 'DSDM', 'Crystal'],
      answer: 2,
      explanation: 'DSDM is known for constraint-driven delivery: cost, quality and time are fixed, and scope is prioritised to fit.',
      topic: 'a-frameworks-team',
      ref: 'APG Annex A3.8',
    },
    {
      id: 'm17-q15',
      stem: 'A group completing the agile suitability filter disagrees with the tool\'s result. What does the guide recommend?',
      options: ['Always follow the tool\'s result', 'Follow the stakeholders\' consensus and use mismatches as inputs to risk management', 'Repeat the assessment until it matches', 'Let the PMO decide alone'],
      answer: 1,
      explanation: 'The filter is a discussion tool, not a gate. Follow stakeholder consensus, and treat mismatches as risks to manage.',
      topic: 'a-suitability-filter',
      ref: 'APG Appendix X3.3',
    },
  ],
};
