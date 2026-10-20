import type { Module } from '../types.ts';

export const M06: Module = {
  id: 'M06',
  number: '6',
  title: 'Project Schedule Management',
  summary: 'Planning the schedule, defining and sequencing activities, estimating durations, building the schedule with the critical path method, compressing it and controlling it, including agile scheduling.',
  lessons: [
    {
      id: 'm06-l1',
      title: 'Schedule overview, 6.1 Plan Schedule Management and 6.2 Define Activities',
      minutes: 25,
      topics: ['t-schedule-overview', 't-6.1-plan-schedule', 't-6.2-define-activities'],
      objectives: [
        'Explain the relationship between scheduling method, tool, model and schedule',
        'Describe iterative and on-demand (Kanban) scheduling',
        'List the contents of the schedule management plan',
        'Decompose work packages into activities and use rolling wave planning',
      ],
      body: `## Scheduling in a nutshell

The project schedule is a detailed plan of **how and when** the project will deliver its scope. It is also a communication tool, a way to manage expectations, and the basis for reporting performance.

The team chooses a **scheduling method** (such as the critical path method or an agile approach), enters the project data (activities, durations, resources, dependencies, constraints, calendars, milestones) into a **scheduling tool**, and so creates a **schedule model**. The model produces the **project schedule** and its presentations: network diagrams, bar charts and activity lists.

| Process | Group | Key output |
|---|---|---|
| 6.1 Plan Schedule Management | Planning | Schedule management plan |
| 6.2 Define Activities | Planning | Activity list, attributes, milestone list |
| 6.3 Sequence Activities | Planning | Project schedule network diagrams |
| 6.4 Estimate Activity Durations | Planning | Duration estimates, basis of estimates |
| 6.5 Develop Schedule | Planning | Schedule baseline, project schedule |
| 6.6 Control Schedule | Monitoring and Controlling | Work performance information, schedule forecasts |

On small projects, processes 6.2 to 6.5 are so closely linked that one person may do them together in one sitting.

### Trends

- **Iterative scheduling with a backlog**: rolling wave planning applied to adaptive life cycles. User stories are prioritised and refined just before they are built, and work is done in timeboxes, delivering value in increments.
- **On-demand scheduling (Kanban)**: based on the theory of constraints and lean "pull" concepts. Work in progress is limited to balance demand with the team's throughput, and work is pulled from a queue as capacity frees up. This suits operational or sustainment work with tasks of similar size.

## 6.1 Plan Schedule Management

This process creates the **schedule management plan**, which sets out:

- **Schedule model development**: the method and tool to use.
- **Release and iteration length** (adaptive projects). Timeboxing limits scope creep because the essential features must come first.
- **Level of accuracy**: the acceptable range for duration estimates, possibly including contingency.
- **Units of measure**: such as staff hours, days or metres.
- **Organisational procedures links**: the WBS is the framework that keeps estimates and schedules consistent.
- **Schedule model maintenance**: how status and progress are recorded.
- **Control thresholds**: how much variation (often a percentage) is allowed before action is needed.
- **Rules of performance measurement**: for example, how percent complete is credited, which earned value techniques are used, and how SV and SPI are measured.
- **Reporting formats and frequency.**

## 6.2 Define Activities

Define Activities **decomposes work packages into activities**: the actions needed to produce the deliverables.

> **Remember:** Create WBS produces **deliverables** (nouns). Define Activities produces **activities** (verbs).

**Tools:** decomposition (with team members involved, for accuracy) and **rolling wave planning**: near-term work is planned in detail and later work at a higher level, then refined as it gets closer. Rolling wave planning is a form of progressive elaboration.

**Outputs:**

- **Activity list**: every schedule activity with an identifier and a description of its scope of work.
- **Activity attributes**: these grow over time, from ID and name to predecessors, successors, relationships, leads and lags, resources, constraints and assumptions.
- **Milestone list**: significant points or events. A milestone has **zero duration**. Milestones can be mandatory (for example, set by contract) or optional.
- **Change requests**, if defining activities reveals work outside the baselines.`,
      keyTerms: [
        { term: 'Schedule model', def: 'A representation of the plan for executing activities, including durations, dependencies and other planning information, used to produce the schedule.' },
        { term: 'Rolling wave planning', def: 'Planning near-term work in detail and future work at a higher level.' },
        { term: 'Milestone', def: 'A significant point or event in a project, with zero duration.' },
        { term: 'Activity', def: 'A distinct, scheduled portion of work performed during a project.' },
      ],
    },
    {
      id: 'm06-l2',
      title: '6.3 Sequence Activities',
      minutes: 25,
      topics: ['t-6.3-sequence-activities', 't-6.3-network-diagrams'],
      objectives: [
        'Apply the four precedence relationships',
        'Classify dependencies as mandatory or discretionary, internal or external',
        'Use leads and lags correctly',
        'Recognise path convergence and divergence',
      ],
      body: `## Precedence diagramming method (PDM)

In PDM, activities are shown as **nodes** connected by arrows that represent logical relationships. Every activity except the first and last should have at least one predecessor and one successor.

| Relationship | Rule | Example |
|---|---|---|
| **Finish-to-start (FS)** | B cannot start until A finishes | Lay the floor tiles after the floor is levelled (most common) |
| **Finish-to-finish (FF)** | B cannot finish until A finishes | Testing cannot finish until coding finishes |
| **Start-to-start (SS)** | B cannot start until A starts | Proofreading can start once writing has started |
| **Start-to-finish (SF)** | B cannot finish until A starts | The old security guard shift cannot end until the new shift starts (rare) |

Two relationships between the same pair of activities are possible but not recommended, and closed loops are not recommended either.

## Types of dependency

Dependencies have two independent attributes, which combine:

| | Inside the team's control | Outside the team's control |
|---|---|---|
| **Mandatory** (hard logic: required by law, contract or the nature of the work) | Mandatory internal | Mandatory external |
| **Discretionary** (preferred or soft logic, based on best practice) | Discretionary internal | Discretionary external |

- **Mandatory** dependencies are inherent in the work. You cannot test code that has not been written.
- **Discretionary** dependencies reflect a preferred order. Document them fully, because they limit later options. They are the first to revisit when **fast tracking**.
- **External** dependencies link project activities to things outside the project, such as a permit hearing or a vendor delivery.
- **Internal** dependencies are between project activities.

## Leads and lags

- **Lead**: the successor can start **earlier** than the relationship would normally allow. *FS with a 3-day lead*: B starts 3 days before A finishes. Scheduling tools often show this as a negative lag.
- **Lag**: the successor is **delayed**. *FS + 7 days*: B starts 7 days after A finishes, for example while concrete cures.

> **Exam tip:** Leads and lags must not replace schedule logic, and **duration estimates never include leads or lags**.

## Network diagram

The output is the **project schedule network diagram**, a graphical view of the logical relationships. Watch for:

- **Path convergence**: an activity with several predecessors. It is a risk point, because a delay on any incoming path delays it.
- **Path divergence**: an activity with several successors. A delay there spreads to many paths.`,
      keyTerms: [
        { term: 'Precedence diagramming method', def: 'A technique where activities are nodes linked by logical relationships (FS, FF, SS, SF).' },
        { term: 'Discretionary dependency', def: 'A relationship based on best practice or preference rather than necessity; also called preferred or soft logic.' },
        { term: 'Lead', def: 'The amount of time a successor activity can be advanced relative to a predecessor.' },
        { term: 'Lag', def: 'The amount of time a successor activity is delayed relative to a predecessor.' },
      ],
    },
    {
      id: 'm06-l3',
      title: '6.4 Estimate Activity Durations',
      minutes: 30,
      topics: ['t-6.4-estimate-durations'],
      objectives: [
        'Choose between analogous, parametric, three-point and bottom-up estimating',
        'Calculate triangular and beta (PERT) estimates',
        'Distinguish contingency reserve from management reserve',
        'Recognise factors that distort estimates',
      ],
      body: `## Effort versus duration

**Effort** is the number of labour units needed (for example, 40 person-hours). **Duration** is the number of work periods the activity takes (for example, 5 days). Duration depends on the effort, on the resources assigned and on the calendars.

Adding people does **not** cut duration in proportion:

- **Law of diminishing returns**: beyond a point, each extra unit of input adds less output.
- **More resources** bring more coordination, communication, learning and risk. Doubling the team rarely halves the time.
- **Technology** can change productivity.
- **Motivation effects**: *Student Syndrome* (starting at the last moment) and *Parkinson's Law* (work expands to fill the time available).

Some work has a fixed duration whatever the resources, such as a 24-hour soak test.

## Estimating techniques

| Technique | How it works | Strengths and limits |
|---|---|---|
| **Analogous** | Use the actual duration of a similar past activity, adjusted for known differences | Quick and cheap but less accurate; good early, when detail is limited; reliable only if the past work really is similar |
| **Parametric** | Multiply quantity by a rate from historical data. For example, 1,200 m² of tiling at 30 m² per day = **40 days** | Accuracy depends on the quality of the model and data |
| **Three-point** | Use optimistic (tO), most likely (tM) and pessimistic (tP) estimates | Accounts for uncertainty and gives a range |
| **Bottom-up** | Decompose the activity and add up the detailed estimates | Most detailed and accurate, but slow |

### Three-point formulas

- **Triangular:** tE = (tO + tM + tP) / 3
- **Beta (PERT):** tE = (tO + 4tM + tP) / 6

*Worked example:* tO = 4 days, tM = 6 days, tP = 14 days.
- Triangular: (4 + 6 + 14) / 3 = **8 days**.
- Beta: (4 + 24 + 14) / 6 = 42 / 6 = **7 days**.

> **Source note:** In Section 6.4 the Guide states only the triangular formula. It gives the beta formula in Section 7.2 (Estimate Costs), and the same weighting applies to durations. The standard deviation shortcut (tP - tO) / 6, here 10 / 6 ≈ 1.7 days, is common exam knowledge but is **not** given in the Guide.

## Reserves

| Contingency reserve | Management reserve |
|---|---|
| For **identified** risks that have been accepted ("known-unknowns") | For **unforeseen** work within scope ("unknown-unknowns") |
| Included **in** the schedule baseline | **Not** in the schedule baseline, but part of the overall duration requirements |
| Controlled by the PM, as set out in the plan | Using it may require a change to the baseline |

Reserve analysis sets these amounts and adjusts them as information improves.

## Group techniques

- **Fist of five**: each person shows 0 to 5 fingers to show their support. Anyone showing fewer than three explains their objection, and the group discusses and votes again.
- **Iteration planning** (agile): the product owner and team discuss the prioritised backlog items, commit to what fits the team's capacity, and break stories into tasks estimated in hours.

## Outputs

- **Duration estimates**: these exclude lags. They may be ranges ("10 days ± 2") or probabilities ("85% chance of finishing within 3 weeks").
- **Basis of estimates**: how each estimate was derived, its assumptions, constraints, range and confidence level.`,
      keyTerms: [
        { term: 'Analogous estimating', def: 'Estimating from historical data of a similar activity or project.' },
        { term: 'Parametric estimating', def: 'An algorithm using historical data and project parameters, such as quantity multiplied by productivity rate.' },
        { term: 'Three-point estimating', def: 'Using optimistic, most likely and pessimistic estimates to account for uncertainty.' },
        { term: 'Contingency reserve', def: 'Time or money within the baseline for identified risks that are accepted.' },
        { term: 'Management reserve', def: 'Time or money withheld for management control, for unforeseen work within scope; not in the baseline.' },
      ],
    },
    {
      id: 'm06-l4',
      title: '6.5 Develop Schedule: critical path, optimisation and compression',
      minutes: 40,
      topics: ['t-6.5-develop-schedule', 't-6.5-optimisation-compression'],
      objectives: [
        'Perform a forward and backward pass and identify the critical path',
        'Calculate total float and free float',
        'Distinguish resource leveling from resource smoothing',
        'Choose between crashing and fast tracking',
        'Interpret a Monte Carlo result',
      ],
      body: `## Schedule network analysis

Develop Schedule analyses the activity sequences, durations, resource requirements and constraints to build the **schedule model**. Before it is approved, assigned staff check their dates against their other commitments, and logic conflicts and resource over-allocations are resolved. The approved schedule becomes the **schedule baseline**.

## Critical path method (CPM)

The **critical path** is the **longest path** through the network. It sets the **shortest possible project duration**, and it usually has zero total float.

- **Forward pass** gives early start (ES) and early finish (EF).
- **Backward pass** gives late finish (LF) and late start (LS).
- **Total float** = LS − ES (or LF − EF): how long an activity can slip without delaying the project end date.
- **Free float**: how long an activity can slip without delaying the **early start of any successor**.

### Worked example

| Activity | Duration | Predecessor |
|---|---|---|
| A | 3 | Start |
| B | 4 | A |
| C | 6 | A |
| D | 2 | B and C |

Using the convention that the first activity starts at time 0 and EF = ES + duration:

| Activity | ES | EF | LS | LF | Total float |
|---|---|---|---|---|---|
| A | 0 | 3 | 0 | 3 | 0 |
| B | 3 | 7 | 5 | 9 | **2** |
| C | 3 | 9 | 3 | 9 | 0 |
| D | 9 | 11 | 9 | 11 | 0 |

- Path A-B-D = 3 + 4 + 2 = 9. Path A-C-D = 3 + 6 + 2 = **11**, so **A-C-D is the critical path**, and the project takes 11 days.
- B has a total float of 2. Its free float is also 2: D cannot start until day 9, and B finishes at day 7.

> **Source note:** The Guide's own example (Figure 6-16) counts from "day 1", so EF = ES + duration − 1. The float and the critical path come out the same with either convention; just apply one consistently.

Float can be **negative** when an imposed date is earlier than the logic allows. Negative float analysis looks for ways to bring the schedule back. **Near-critical paths** (paths with little float) are risky too.

## Resource optimisation

| Resource leveling | Resource smoothing |
|---|---|
| Adjusts dates to match resource **availability** (for example, to fix an over-allocated person) | Keeps resource use within limits **without changing the critical path or end date** |
| Can **change the critical path**, often lengthening the project | Activities move only within their free and total float |
| Used when resources are limited, shared or over-allocated | May not optimise every resource |

## Modelling uncertainty

- **What-if scenario analysis**: "What happens if the permit is two weeks late?" It tests whether the schedule is feasible and helps size reserves and responses.
- **Simulation (Monte Carlo)**: runs the model thousands of times with durations drawn from probability distributions. Results are read as probabilities, for example "there is a 10% chance of finishing by 1 March and a 90% chance by 20 March". A target with only 10% confidence is optimistic.

## Schedule compression

Schedule compression shortens the schedule **without reducing scope**.

| Crashing | Fast tracking |
|---|---|
| Adds resources (overtime, extra people, paying to expedite) to critical path activities, at the **lowest extra cost** | Performs activities in **parallel** that would normally be done in sequence |
| Increases **cost**, and may increase risk | Increases **risk** and the chance of **rework**, and may increase cost |
| Works only where more resources really shorten the activity | Works only where activities can overlap; often relaxes **discretionary** dependencies |

> **Exam tip:** Compression helps only on the **critical path**. Shortening a non-critical activity does not move the end date. After compressing, recheck the network, because a different path may become critical.`,
      keyTerms: [
        { term: 'Critical path', def: 'The sequence of activities representing the longest path through the project, which determines the shortest possible duration.' },
        { term: 'Total float', def: 'The amount of time an activity can be delayed from its early start without delaying the project finish date.' },
        { term: 'Free float', def: 'The amount of time an activity can be delayed without delaying the early start of any successor.' },
        { term: 'Crashing', def: 'Shortening duration by adding resources, at the least incremental cost.' },
        { term: 'Fast tracking', def: 'Performing activities normally done in sequence in parallel for at least part of their duration.' },
        { term: 'Resource leveling', def: 'Adjusting start and finish dates to balance resource demand with supply; can change the critical path.' },
      ],
    },
    {
      id: 'm06-l5',
      title: 'Schedule outputs, agile release planning and 6.6 Control Schedule',
      minutes: 30,
      topics: ['t-6.5-outputs', 't-6.6-control-schedule'],
      objectives: [
        'Distinguish the schedule baseline, project schedule and schedule presentations',
        'Explain the agile planning hierarchy from vision to tasks',
        'Read an iteration burndown chart',
        'Decide whether a delay needs action based on the critical path',
      ],
      body: `## Outputs of Develop Schedule

- **Schedule baseline**: the approved version of the schedule model, with baseline start and finish dates. It can change only through formal change control.
- **Project schedule**: the output of the model. At a minimum it shows each activity's planned start and finish dates. It stays preliminary until resource assignments are confirmed.
- **Schedule data** (milestones, activities, attributes, assumptions, resource histograms, alternative schedules) and **project calendars** (working days and shifts).

### Presentations

| Format | Shows | Best for |
|---|---|---|
| **Bar (Gantt) chart** | Activities against dates, with bars for durations | Day-to-day status; easy to read |
| **Milestone chart** | Only major milestones and key interfaces | Executives and sponsors |
| **Network diagram** | Logic and the critical path (pure logic, or time-scaled) | Analysing dependencies |

## Agile release planning

Agile release planning gives a high-level timeline for a release, typically **3 to 6 months**, based on the product roadmap. It sets the number of iterations and shows which features should be available at the end of each.

The planning hierarchy is:

1. **Product vision** drives the **product roadmap**.
2. The roadmap drives **release plans**.
3. Each release plan establishes its **iterations**.
4. **Iteration plans** schedule the development of features.
5. Features are delivered through **user stories**, estimated in **story points**.
6. Stories break into **tasks**, estimated in **hours**.

## 6.6 Control Schedule

Control Schedule monitors status, updates the schedule and manages changes to the **schedule baseline**. Any change to the baseline goes through Perform Integrated Change Control.

### Agile control

In agile, control means:

- comparing the work actually delivered and accepted with the estimate for the cycle;
- holding **retrospectives** to correct and improve processes;
- reprioritising the backlog;
- tracking **velocity**: the rate at which deliverables are produced, validated and accepted per iteration.

### Tools

- **Earned value analysis**: schedule variance (SV) and schedule performance index (SPI). See Module 7.
- **Iteration burndown chart**: the work remaining in the iteration backlog, plotted each day against an ideal diagonal line. A trend line forecasts whether the work will be finished by the end of the iteration.
- **Performance reviews, trend analysis and variance analysis.**
- **Critical path method**: progress on the critical path shows whether the end date is at risk.
- **Resource optimisation, leads and lags, and schedule compression**, to bring remaining work back in line.

> **Exam tip:** A one-week delay on an activity with three weeks of float may need no action. A two-day delay on a **critical** activity directly threatens the end date and needs attention. Always check float before reacting.

### Outputs

Work performance information (SV, SPI, variances at work package and control account level); **schedule forecasts**; change requests; updates to the plan (schedule baseline and performance measurement baseline) and to documents. If delays are severe, the team may produce a new **target schedule**.`,
      keyTerms: [
        { term: 'Schedule baseline', def: 'The approved version of a schedule model, changed only through formal change control.' },
        { term: 'Iteration burndown chart', def: 'A chart tracking work remaining in the iteration backlog against an ideal burndown line.' },
        { term: 'Velocity', def: 'The rate at which an agile team produces, validates and accepts deliverables per iteration.' },
        { term: 'Milestone chart', def: 'A schedule presentation showing only major milestones; useful for sponsors.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm06-q1',
      stem: 'Which process produces the activity list?',
      options: ['Create WBS', 'Define Activities', 'Sequence Activities', 'Develop Schedule'],
      answer: 1,
      explanation: 'Define Activities decomposes work packages into schedule activities, producing the activity list, activity attributes and milestone list.',
      topic: 't-6.2-define-activities',
      ref: 'PMBOK 6 §6.2',
    },
    {
      id: 'm06-q2',
      stem: 'The team plans the next three months in detail and later work only as high-level work packages. Which technique is this?',
      options: ['Fast tracking', 'Rolling wave planning', 'Resource smoothing', 'Analogous estimating'],
      answer: 1,
      explanation: 'Rolling wave planning details near-term work and plans future work at a higher level; it is a form of progressive elaboration.',
      topic: 't-6.2-define-activities',
      ref: 'PMBOK 6 §6.2.2.3',
    },
    {
      id: 'm06-q3',
      stem: 'Testing cannot finish until development finishes. Which relationship is this?',
      options: ['Finish-to-start', 'Start-to-start', 'Finish-to-finish', 'Start-to-finish'],
      answer: 2,
      explanation: 'Finish-to-finish: the successor cannot finish until the predecessor has finished.',
      topic: 't-6.3-sequence-activities',
      ref: 'PMBOK 6 §6.3.2.1',
    },
    {
      id: 'm06-q4',
      stem: 'The team prefers to paint before installing carpet based on past experience, although the reverse is physically possible. What kind of dependency is this?',
      options: ['Mandatory', 'Discretionary', 'External', 'Lag'],
      answer: 1,
      explanation: 'A preferred sequence based on best practice is a discretionary (soft logic) dependency. Discretionary dependencies are reviewed when fast tracking.',
      topic: 't-6.3-sequence-activities',
      ref: 'PMBOK 6 §6.3.2.2',
    },
    {
      id: 'm06-q5',
      stem: 'Concrete must cure for 5 days after it is poured before formwork is removed. How is this best modelled?',
      options: ['A finish-to-start relationship with a 5-day lag', 'A finish-to-start relationship with a 5-day lead', 'Add 5 days to the pouring duration estimate', 'A start-to-start relationship with no lag'],
      answer: 0,
      explanation: 'A lag delays the successor. Duration estimates should not include lags, so the waiting time is modelled as FS + 5 days.',
      topic: 't-6.3-network-diagrams',
      ref: 'PMBOK 6 §6.3.2.3',
    },
    {
      id: 'm06-q6',
      stem: 'Using past data of 25 metres of cable per hour, the team estimates 2,000 metres will take 80 hours. Which technique is this?',
      options: ['Analogous estimating', 'Parametric estimating', 'Three-point estimating', 'Bottom-up estimating'],
      answer: 1,
      explanation: 'Parametric estimating multiplies a quantity by a rate derived from historical data.',
      topic: 't-6.4-estimate-durations',
      ref: 'PMBOK 6 §6.4.2.3',
    },
    {
      id: 'm06-q7',
      stem: 'An activity has optimistic 3 days, most likely 6 days and pessimistic 15 days. What is the beta (PERT) expected duration?',
      options: ['6 days', '7 days', '8 days', '9 days'],
      answer: 1,
      explanation: 'Beta = (tO + 4tM + tP) / 6 = (3 + 24 + 15) / 6 = 42 / 6 = 7 days. The triangular estimate would be (3 + 6 + 15) / 3 = 8 days.',
      topic: 't-6.4-estimate-durations',
      ref: 'PMBOK 6 §6.4.2.4; §7.2.2.5 (beta formula)',
    },
    {
      id: 'm06-q8',
      stem: 'Schedule time set aside for identified risks that the team has accepted is called:',
      options: ['Management reserve', 'Contingency reserve', 'Free float', 'Lag'],
      answer: 1,
      explanation: 'Contingency reserve is held within the schedule baseline for identified, accepted risks (known-unknowns). Management reserve covers unforeseen work and is outside the baseline.',
      topic: 't-6.4-estimate-durations',
      ref: 'PMBOK 6 §6.4.2.6',
    },
    {
      id: 'm06-q9',
      stem: 'A network has paths A-B-E (14 days), A-C-E (17 days) and A-D-E (12 days). What is the minimum project duration, and what is the total float on path A-D-E?',
      options: ['17 days; 5 days', '14 days; 2 days', '17 days; 3 days', '12 days; 5 days'],
      answer: 0,
      explanation: 'The critical path is the longest path, A-C-E at 17 days. Path A-D-E has 17 − 12 = 5 days of float (assuming the activities unique to that path carry it).',
      topic: 't-6.5-develop-schedule',
      ref: 'PMBOK 6 §6.5.2.2',
    },
    {
      id: 'm06-q10',
      stem: 'Activity X has ES = 4 and LS = 9. Its only successor has ES = 12, and X has EF = 10. What are X\'s total float and free float?',
      options: ['Total 5, free 2', 'Total 2, free 5', 'Total 5, free 5', 'Total 0, free 2'],
      answer: 0,
      explanation: 'Total float = LS − ES = 9 − 4 = 5. Free float = successor ES − X EF = 12 − 10 = 2 (using the time-0 convention).',
      topic: 't-6.5-develop-schedule',
      ref: 'PMBOK 6 §6.5.2.2',
    },
    {
      id: 'm06-q11',
      stem: 'A key engineer is scheduled for 14 hours on several days. The PM moves some activities so she works at most 8 hours a day, and the end date moves out by a week. Which technique was used?',
      options: ['Resource smoothing', 'Resource leveling', 'Crashing', 'Fast tracking'],
      answer: 1,
      explanation: 'Resource leveling adjusts dates to balance demand with available supply and can change the critical path. Smoothing would stay within float and not move the end date.',
      topic: 't-6.5-optimisation-compression',
      ref: 'PMBOK 6 §6.5.2.3',
    },
    {
      id: 'm06-q12',
      stem: 'The sponsor asks to finish four weeks earlier without reducing scope. The budget is very tight but the team can tolerate some risk. Which approach should be considered first?',
      options: ['Crashing critical path activities', 'Fast tracking critical path activities', 'Reducing scope', 'Resource smoothing'],
      answer: 1,
      explanation: 'Fast tracking overlaps activities and usually adds risk rather than direct cost, so it suits a tight budget. Crashing adds cost. Reducing scope is not compression.',
      topic: 't-6.5-optimisation-compression',
      ref: 'PMBOK 6 §6.5.2.6',
    },
    {
      id: 'm06-q13',
      stem: 'A Monte Carlo analysis shows a 15% probability of meeting the target date and 85% probability of finishing four weeks later. What does this tell the PM?',
      options: ['The target date is very likely to be met', 'The target date is optimistic; consider reserves, responses or resetting expectations', 'The critical path has no risk', 'The simulation should be repeated until it shows 100%'],
      answer: 1,
      explanation: 'Monte Carlo results express confidence levels. A 15% chance means the target is unlikely, so the PM should plan reserves or responses or discuss the date.',
      topic: 't-6.5-optimisation-compression',
      ref: 'PMBOK 6 §6.5.2.4',
    },
    {
      id: 'm06-q14',
      stem: 'In agile planning, what are user stories typically estimated in, and what are their tasks estimated in?',
      options: ['Hours; story points', 'Story points; hours', 'Days; weeks', 'Function points; days'],
      answer: 1,
      explanation: 'In the agile planning hierarchy, user stories are estimated in story points and the tasks to deliver them in hours.',
      topic: 't-6.5-outputs',
      ref: 'PMBOK 6 §6.5.2.8, Figure 6-20',
    },
    {
      id: 'm06-q15',
      stem: 'An activity with 10 days of total float is 4 days late. Another activity on the critical path is 1 day late. What should the PM focus on?',
      options: ['The 4-day delay, because it is larger', 'The critical path delay, because it directly affects the end date', 'Neither; both are within tolerance', 'Re-baselining the schedule immediately'],
      answer: 1,
      explanation: 'A delay on a non-critical activity that stays within its float does not affect the finish date. Any delay on the critical path does, so it needs attention.',
      topic: 't-6.6-control-schedule',
      ref: 'PMBOK 6 §6.6.2.1',
    },
  ],
};
