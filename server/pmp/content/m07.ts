import type { Module } from '../types.ts';

export const M07: Module = {
  id: 'M07',
  number: '7',
  title: 'Project Cost Management',
  summary: 'Planning cost management, estimating costs, building the cost baseline and budget, and controlling costs with earned value management and forecasting.',
  lessons: [
    {
      id: 'm07-l1',
      title: 'Cost overview, 7.1 Plan Cost Management and 7.2 Estimate Costs',
      minutes: 30,
      topics: ['c-cost-overview', 'c-7.1-plan-cost', 'c-7.2-estimate-costs'],
      objectives: [
        'Explain life-cycle costing and why early decisions matter most',
        'List the contents of the cost management plan',
        'Compare ROM and definitive estimate ranges',
        'Apply cost estimating techniques and the three-point formulas',
      ],
      body: `## Cost management in brief

Project Cost Management covers planning, estimating, budgeting, financing, funding, managing and controlling costs, so the project can finish within its approved budget.

| Process | Group | Key output |
|---|---|---|
| 7.1 Plan Cost Management | Planning | Cost management plan |
| 7.2 Estimate Costs | Planning | Cost estimates, basis of estimates |
| 7.3 Determine Budget | Planning | Cost baseline, project funding requirements |
| 7.4 Control Costs | Monitoring and Controlling | Work performance information, cost forecasts |

**Key ideas:**

- The **ability to influence cost is greatest early** in the project, so clear early scope definition matters.
- **Life-cycle costing**: consider what the project's decisions do to the cost of *using, maintaining and supporting* the product. Cutting design reviews may save project money but raise operating costs.
- Stakeholders measure cost at different times: when it is committed, ordered, delivered or recorded.
- **Earned schedule** (a trend): it measures schedule performance in time units instead of money. SV(t) = ES − AT, where AT is actual time, and SPI(t) = ES / AT. If ES − AT is greater than zero, the project is ahead of schedule.
- **Agile:** when scope is uncertain, use lightweight, high-level estimates of labour cost and make detailed estimates just in time. When the budget is fixed, scope and schedule flex to stay within cost.

## 7.1 Plan Cost Management

The **cost management plan** sets out:

- **Units of measure**: such as staff hours or cubic metres, or a lump sum in currency.
- **Level of precision**: rounding rules, for example to the nearest $100.
- **Level of accuracy**: the acceptable range, such as ±10%.
- **Organisational procedures links**: the **control account** is the WBS component used for project cost accounting, and its code links to the organisation's accounting system.
- **Control thresholds**: how much variance is allowed before action is needed.
- **Rules of performance measurement**: for earned value management (EVM), where control accounts are measured, how earned value is credited (weighted milestones, fixed-formula, percent complete), and which EAC equations are used.
- **Reporting formats**, plus other details such as funding choices and how currency fluctuations are handled.

## 7.2 Estimate Costs

A cost estimate is a quantitative assessment of the likely costs of the resources needed, based on what is known at the time. Estimates are refined as the project progresses:

| Estimate | Typical range |
|---|---|
| **Rough order of magnitude (ROM)**, in initiation | **−25% to +75%** |
| **Definitive**, later in the project | **−5% to +10%** |

Estimates should cover every resource charged to the project: labour, materials, equipment, services and facilities, plus allowances such as inflation, financing costs and **contingency**.

### Techniques

- **Analogous**: based on a similar past project. Quick, less accurate.
- **Parametric**: a statistical relationship, such as $250 per square metre × 400 m² = $100,000.
- **Bottom-up**: estimate each work package or activity in detail, then roll up. The most accurate, but slow.
- **Three-point**: **triangular** cE = (cO + cM + cP) / 3; **beta** cE = (cO + 4cM + cP) / 6.
- **Reserve analysis**: **contingency reserves** for identified risks (known-unknowns), held within the cost baseline.
- **Cost of quality**: weighing investment in conformance against the cost of nonconformance.
- **Alternatives analysis** (make, buy, rent or lease), PMIS tools, and **voting** to build team commitment.

*Worked example:* cO = $8,000, cM = $10,000, cP = $18,000. Triangular = $36,000 / 3 = **$12,000**. Beta = (8 + 40 + 18) / 6 = $66,000 / 6 = **$11,000**.

### Outputs

- **Cost estimates**, including contingency.
- **Basis of estimates**: how each was derived, its assumptions and constraints, its range (for example, $10,000 ± 10%) and its confidence level.`,
      keyTerms: [
        { term: 'Rough order of magnitude estimate', def: 'An early, low-accuracy estimate, typically −25% to +75%.' },
        { term: 'Definitive estimate', def: 'A detailed, higher-accuracy estimate, typically −5% to +10%.' },
        { term: 'Life-cycle costing', def: 'Considering the total cost of ownership of the product, including operation and support, when making project decisions.' },
        { term: 'Cost management plan', def: 'Describes how project costs will be planned, structured and controlled.' },
      ],
    },
    {
      id: 'm07-l2',
      title: '7.3 Determine Budget',
      minutes: 25,
      topics: ['c-7.3-determine-budget'],
      objectives: [
        'Build up a cost baseline and project budget from activity estimates',
        'Explain where contingency and management reserves sit',
        'Explain funding limit reconciliation and project funding requirements',
      ],
      body: `## From estimates to budget

Determine Budget aggregates the cost estimates of activities or work packages into an authorised **cost baseline**, which is what cost performance is measured against.

### Building it up

1. Activity cost estimates + activity contingency reserves = **work package cost estimates**.
2. Work package estimates + work package contingency reserves roll up into **control accounts**.
3. Control accounts sum to the **cost baseline**. This is the **budget at completion (BAC)** and includes contingency reserves.
4. Cost baseline + **management reserve** = **project budget**.

| | In the cost baseline? | In the project budget? | For |
|---|---|---|---|
| **Contingency reserve** | Yes | Yes | Identified risks (known-unknowns) |
| **Management reserve** | **No** | Yes | Unforeseen work within scope (unknown-unknowns) |

When management reserve is used, the amount is added to the cost baseline through an **approved change**.

*Worked example:* work packages total $480,000; contingency reserves total $40,000; management reserve is $30,000.
- Cost baseline (BAC) = 480,000 + 40,000 = **$520,000**.
- Project budget = 520,000 + 30,000 = **$550,000**.

### Tools

- **Cost aggregation** following the WBS.
- **Reserve analysis** to set management reserves.
- **Historical information review**: parametric or analogous models, which are reliable when the historical data is accurate, the parameters are easy to quantify and the model scales.
- **Funding limit reconciliation**: comparing planned spending with funding limits. If spending would exceed the funds available in a period, work may be rescheduled to smooth the rate of spending.
- **Financing**: obtaining funds, often from outside for large infrastructure or public projects.

## Outputs

- **Cost baseline**: time-phased, so cumulative cost over time usually forms an **S-curve**. When EVM is used, it is the cost part of the performance measurement baseline.
- **Project funding requirements**: total and periodic funding needs. Funding usually arrives in **steps** (for example, quarterly), while spending follows a smooth curve. Total funding = cost baseline + management reserve.

> **Exam tip:** "The cost baseline includes management reserve" is **false**. The baseline includes contingency reserve; the project budget adds management reserve on top.`,
      keyTerms: [
        { term: 'Cost baseline', def: 'The approved time-phased project budget, including contingency reserves but excluding management reserves.' },
        { term: 'Budget at completion (BAC)', def: 'The sum of all budgets established for the work to be performed; equals the cost baseline.' },
        { term: 'Project budget', def: 'All funds authorised to execute the project: cost baseline plus management reserve.' },
        { term: 'Funding limit reconciliation', def: 'Comparing planned spending against funding limits and adjusting the schedule to level spending if needed.' },
      ],
    },
    {
      id: 'm07-l3',
      title: '7.4 Control Costs: earned value management',
      minutes: 40,
      topics: ['c-7.4-control-costs'],
      objectives: [
        'Define PV, EV, AC and BAC',
        'Calculate and interpret CV, SV, CPI and SPI',
        'Explain why SPI alone cannot tell you whether the end date is at risk',
      ],
      body: `## Why earned value?

Tracking spending without looking at what the spending achieved tells you little. **Control Costs** compares the money spent with the **value of the work done**, and manages changes to the cost baseline. Any increase to the authorised budget must go through Perform Integrated Change Control.

## The three key measures

| Measure | Meaning | Example question it answers |
|---|---|---|
| **Planned value (PV)** | The authorised budget for the work **scheduled** to be done by now | "How much work should we have done?" |
| **Earned value (EV)** | The authorised budget for the work **actually completed** | "How much work have we done, in budget terms?" |
| **Actual cost (AC)** | What the completed work **actually cost** | "What have we spent?" |

**BAC** (budget at completion) is the total planned value for the project. EV can never exceed the PV budget for a component, but AC has no upper limit. AC must be defined the same way as PV and EV (for example, all count direct costs only).

## Variances and indices

| Formula | Result | Interpretation |
|---|---|---|
| **CV = EV − AC** | Positive / negative | Under / **over** budget |
| **SV = EV − PV** | Positive / negative | Ahead of / **behind** schedule |
| **CPI = EV / AC** | Greater than / less than 1.0 | Under / **over** budget (cost efficiency) |
| **SPI = EV / PV** | Greater than / less than 1.0 | Ahead of / **behind** schedule (schedule efficiency) |

> **Memory aid:** EV comes first in every formula. In variances you subtract (EV −); in indices you divide (EV /). C pairs with AC, and S pairs with PV.

### Worked example

A project has a BAC of **$100,000**. At the end of month 4: PV = $40,000, EV = $35,000, AC = $42,000.

- CV = 35,000 − 42,000 = **−$7,000** (over budget)
- SV = 35,000 − 40,000 = **−$5,000** (behind schedule)
- CPI = 35,000 / 42,000 = **0.83**: about 83 cents of value for every dollar spent
- SPI = 35,000 / 40,000 = **0.875**: work is progressing at 87.5% of the planned rate

### Points to remember

- **CPI is the most critical EVM metric.** Cost overruns are hard to recover, and cumulative CPI tends to stabilise.
- **SV ends at zero** when the project finishes, because all the planned value has been earned, even if the project is late. Earned schedule is one way around this.
- SPI covers **all** work, so a good SPI can hide a delayed critical path. Check the critical path as well.
- **Trend analysis** plots PV, EV and AC cumulatively as S-curves to show the direction of performance.

> **Source note:** In Table 7-1 of the Guide, the "how used" description for SPI repeats cost wording. Read SPI as a measure of **schedule** efficiency, as defined in Section 7.4.`,
      keyTerms: [
        { term: 'Planned value (PV)', def: 'The authorised budget assigned to scheduled work.' },
        { term: 'Earned value (EV)', def: 'The measure of work performed expressed in terms of the budget authorised for that work.' },
        { term: 'Actual cost (AC)', def: 'The realised cost incurred for the work performed during a specific period.' },
        { term: 'Cost performance index (CPI)', def: 'EV / AC; a measure of cost efficiency.' },
        { term: 'Schedule performance index (SPI)', def: 'EV / PV; a measure of schedule efficiency.' },
      ],
    },
    {
      id: 'm07-l4',
      title: 'Forecasting: EAC, ETC, VAC and TCPI',
      minutes: 35,
      topics: ['c-7.4-forecasting-tcpi'],
      objectives: [
        'Choose the right EAC formula for the situation',
        'Calculate ETC and VAC',
        'Calculate and interpret TCPI against BAC and against EAC',
      ],
      body: `## Estimate at completion (EAC)

When the BAC no longer looks achievable, the team forecasts an **EAC**: the expected total cost when the project finishes. The most common approach is a **manual bottom-up** forecast by the PM and team, cross-checked against calculated EACs.

| Situation | Formula |
|---|---|
| The original plan is no longer valid: re-estimate the remaining work | **EAC = AC + bottom-up ETC** |
| Current cost performance (CPI) is expected to continue | **EAC = BAC / CPI** |
| The variance was a one-off; future work will be at the budgeted rate | **EAC = AC + (BAC − EV)** |
| Both cost and schedule performance will affect the remaining work (for example, a firm deadline) | **EAC = AC + [(BAC − EV) / (CPI × SPI)]** |

Related measures:

- **ETC (estimate to complete) = EAC − AC**, or a fresh bottom-up estimate.
- **VAC (variance at completion) = BAC − EAC**. A negative VAC is a forecast overrun.

### Continuing the example

BAC = $100,000, EV = $35,000, AC = $42,000, CPI = 0.833, SPI = 0.875.

- EAC with CPI continuing = 100,000 / 0.833 = **$120,000**
- EAC at the budgeted rate = 42,000 + (100,000 − 35,000) = **$107,000**
- EAC with CPI × SPI = 42,000 + 65,000 / 0.729 ≈ 42,000 + 89,100 = **≈ $131,100**
- ETC (using $120,000) = 120,000 − 42,000 = **$78,000**
- VAC = 100,000 − 120,000 = **−$20,000**

## To-complete performance index (TCPI)

TCPI is the cost efficiency the team must achieve on the **remaining** work to hit a target:

TCPI = remaining work / remaining funds

- **Against BAC:** TCPI = (BAC − EV) / (BAC − AC) = (100,000 − 35,000) / (100,000 − 42,000) = 65,000 / 58,000 = **1.12**
- **Against an approved EAC of $120,000:** TCPI = (BAC − EV) / (EAC − AC) = 65,000 / 78,000 = **0.83**

| TCPI | Meaning |
|---|---|
| Greater than 1.0 | Harder: the team must be more efficient than planned |
| Equal to 1.0 | Same efficiency as planned |
| Less than 1.0 | Easier |

Here, finishing within the original $100,000 would need a CPI of 1.12 on the remaining work, while the team has achieved only 0.83 so far. That is very unlikely, so the PM should forecast realistically and raise the overrun with the sponsor through change control.

## Reserves during control

Reserve analysis continues during Control Costs:

- release contingency for risks that did not occur;
- add savings from opportunities, or take them as margin;
- request more reserve if new risks require it.

## Outputs

Work performance information (CV, CPI, EAC, VAC, TCPI); **cost forecasts**; change requests; updates to the cost baseline and performance measurement baseline. A baseline is re-planned only through change control, and only when variances are so severe it no longer gives a realistic basis for measuring performance.`,
      keyTerms: [
        { term: 'Estimate at completion (EAC)', def: 'The expected total cost of completing all work: AC plus the estimate to complete.' },
        { term: 'Estimate to complete (ETC)', def: 'The expected cost to finish all remaining project work.' },
        { term: 'Variance at completion (VAC)', def: 'BAC − EAC; a projection of the budget deficit or surplus at completion.' },
        { term: 'To-complete performance index (TCPI)', def: 'The cost performance that must be achieved on the remaining work to meet BAC or EAC.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm07-q1',
      stem: 'When is the ability to influence project cost greatest?',
      options: ['During execution', 'Early in the project', 'During closing', 'When the cost baseline is revised'],
      answer: 1,
      explanation: 'The ability to influence cost is greatest at the early stages, which is why early scope definition is critical.',
      topic: 'c-cost-overview',
      ref: 'PMBOK 6 §7 Key Concepts',
    },
    {
      id: 'm07-q2',
      stem: 'A team cuts design reviews to save project money, but the product later costs much more to maintain. Which concept was ignored?',
      options: ['Funding limit reconciliation', 'Life-cycle costing', 'Parametric estimating', 'Earned schedule'],
      answer: 1,
      explanation: 'Life-cycle costing considers the effect of project decisions on the recurring costs of using, maintaining and supporting the product.',
      topic: 'c-cost-overview',
      ref: 'PMBOK 6 §7 Key Concepts',
    },
    {
      id: 'm07-q3',
      stem: 'Early in initiation, the sponsor asks for a cost figure. What accuracy range would a rough order of magnitude estimate typically have?',
      options: ['−5% to +10%', '−10% to +10%', '−25% to +75%', '−50% to +200%'],
      answer: 2,
      explanation: 'The Guide cites a ROM estimate range of −25% to +75%; definitive estimates later may narrow to −5% to +10%.',
      topic: 'c-7.2-estimate-costs',
      ref: 'PMBOK 6 §7.2',
    },
    {
      id: 'm07-q4',
      stem: 'Optimistic cost $20,000, most likely $26,000, pessimistic $50,000. What is the beta (PERT) estimate?',
      options: ['$26,000', '$29,000', '$32,000', '$35,000'],
      answer: 1,
      explanation: 'Beta = (20 + 4 × 26 + 50) / 6 = (20 + 104 + 50) / 6 = 174 / 6 = $29,000.',
      topic: 'c-7.2-estimate-costs',
      ref: 'PMBOK 6 §7.2.2.5',
    },
    {
      id: 'm07-q5',
      stem: 'Which element is included in the cost baseline?',
      options: ['Management reserve', 'Contingency reserve', 'Both reserves', 'Neither reserve'],
      answer: 1,
      explanation: 'The cost baseline includes contingency reserves for identified risks. Management reserve sits outside the baseline but inside the project budget.',
      topic: 'c-7.3-determine-budget',
      ref: 'PMBOK 6 §7.3.3.1',
    },
    {
      id: 'm07-q6',
      stem: 'Work package estimates total $300,000, contingency reserves $25,000 and management reserve $15,000. What are the cost baseline and project budget?',
      options: ['$300,000 and $340,000', '$325,000 and $340,000', '$315,000 and $340,000', '$340,000 and $340,000'],
      answer: 1,
      explanation: 'Cost baseline = estimates + contingency = $325,000. Project budget = baseline + management reserve = $340,000.',
      topic: 'c-7.3-determine-budget',
      ref: 'PMBOK 6 §7.3.3.1, Figure 7-8',
    },
    {
      id: 'm07-q7',
      stem: 'Planned spending in Q2 exceeds the funds the client will release that quarter. What should the PM do?',
      options: ['Increase the management reserve', 'Perform funding limit reconciliation and reschedule work to level spending', 'Ignore it because the total budget is sufficient', 'Crash the schedule'],
      answer: 1,
      explanation: 'Funding limit reconciliation compares planned spending to funding limits; variances may require rescheduling work to level the rate of expenditure.',
      topic: 'c-7.3-determine-budget',
      ref: 'PMBOK 6 §7.3.2.5',
    },
    {
      id: 'm07-q8',
      stem: 'PV = $50,000, EV = $45,000, AC = $40,000. What is the project status?',
      options: ['Over budget and behind schedule', 'Under budget and behind schedule', 'Over budget and ahead of schedule', 'Under budget and ahead of schedule'],
      answer: 1,
      explanation: 'CV = EV − AC = +$5,000 (under budget). SV = EV − PV = −$5,000 (behind schedule).',
      topic: 'c-7.4-control-costs',
      ref: 'PMBOK 6 §7.4.2.2',
    },
    {
      id: 'm07-q9',
      stem: 'EV = $72,000 and AC = $80,000. What is the CPI, and what does it mean?',
      options: ['1.11; under budget', '0.90; getting 90 cents of value per dollar spent', '0.90; ahead of schedule', '−8,000; over budget'],
      answer: 1,
      explanation: 'CPI = EV / AC = 72 / 80 = 0.90, a cost overrun: 90 cents of value earned per dollar spent.',
      topic: 'c-7.4-control-costs',
      ref: 'PMBOK 6 §7.4.2.2',
    },
    {
      id: 'm07-q10',
      stem: 'A project shows SPI = 1.05, yet the planned finish date is at risk. How is this possible?',
      options: ['SPI cannot be above 1 if the date is at risk', 'SPI measures all work; critical path activities may still be behind', 'SPI includes management reserve', 'SPI ignores earned value'],
      answer: 1,
      explanation: 'SPI aggregates all work. Non-critical work ahead of plan can mask critical path delays, so the critical path must also be analysed.',
      topic: 'c-7.4-control-costs',
      ref: 'PMBOK 6 §7.4.2.2',
    },
    {
      id: 'm07-q11',
      stem: 'BAC = $200,000, CPI = 0.80. If current cost performance is expected to continue, what is the EAC?',
      options: ['$160,000', '$200,000', '$240,000', '$250,000'],
      answer: 3,
      explanation: 'EAC = BAC / CPI = 200,000 / 0.80 = $250,000.',
      topic: 'c-7.4-forecasting-tcpi',
      ref: 'PMBOK 6 §7.4.2.2, Table 7-1',
    },
    {
      id: 'm07-q12',
      stem: 'A one-off supplier error caused an overrun; the team expects remaining work to proceed at the budgeted rate. BAC = $500,000, EV = $200,000, AC = $230,000. What is the EAC?',
      options: ['$500,000', '$530,000', '$575,000', '$625,000'],
      answer: 1,
      explanation: 'For an atypical variance, EAC = AC + (BAC − EV) = 230,000 + 300,000 = $530,000.',
      topic: 'c-7.4-forecasting-tcpi',
      ref: 'PMBOK 6 §7.4.2.2, Table 7-1',
    },
    {
      id: 'm07-q13',
      stem: 'BAC = $400,000, EV = $160,000, AC = $200,000. What TCPI is needed to finish within BAC?',
      options: ['0.80', '1.00', '1.20', '1.25'],
      answer: 2,
      explanation: 'TCPI = (BAC − EV) / (BAC − AC) = 240,000 / 200,000 = 1.20. The team must be 20% more efficient than planned on the remaining work.',
      topic: 'c-7.4-forecasting-tcpi',
      ref: 'PMBOK 6 §7.4.2.3',
    },
    {
      id: 'm07-q14',
      stem: 'EAC = $260,000 and BAC = $240,000. What is VAC and what does it indicate?',
      options: ['+$20,000; under budget at completion', '−$20,000; forecast overrun at completion', '1.08; on budget', '$20,000 of management reserve required automatically'],
      answer: 1,
      explanation: 'VAC = BAC − EAC = 240,000 − 260,000 = −$20,000, a forecast overrun.',
      topic: 'c-7.4-forecasting-tcpi',
      ref: 'PMBOK 6 §7.4.2.2, Table 7-1',
    },
    {
      id: 'm07-q15',
      stem: 'The team concludes the original estimating assumptions were fundamentally wrong. Which EAC approach is most appropriate?',
      options: ['EAC = BAC / CPI', 'EAC = AC + (BAC − EV)', 'EAC = AC + bottom-up ETC', 'EAC = BAC'],
      answer: 2,
      explanation: 'When the initial plan is no longer valid, re-estimate the remaining work from the bottom up and add it to actual cost.',
      topic: 'c-7.4-forecasting-tcpi',
      ref: 'PMBOK 6 §7.4.2.2, Table 7-1',
    },
  ],
};
