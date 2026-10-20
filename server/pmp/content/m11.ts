import type { Module } from '../types.ts';

export const M11: Module = {
  id: 'M11',
  number: '11',
  title: 'Project Risk Management',
  summary: 'Individual and overall project risk; planning, identifying, analysing (qualitatively and quantitatively), responding to and monitoring risk, including EMV and decision trees.',
  lessons: [
    {
      id: 'm11-l1',
      title: 'Risk concepts and 11.1 Plan Risk Management',
      minutes: 35,
      topics: ['k-risk-overview', 'k-11.1-plan-risk', 'k-11.1-plan-contents-pim'],
      objectives: [
        'Distinguish individual project risk from overall project risk',
        'Explain risk appetite and risk thresholds',
        'Describe variability risk, ambiguity risk and project resilience',
        'List the contents of the risk management plan, including the RBS and probability and impact definitions',
      ],
      body: `## Two levels of risk

- **Individual project risk**: an uncertain event or condition that, *if* it occurs, has a positive or negative effect on one or more project objectives.
- **Overall project risk**: the effect of uncertainty on the project **as a whole**, from all sources including individual risks. It represents stakeholders' exposure to the variation in outcomes, both positive and negative.

Risks can be **threats** (negative) or **opportunities** (positive). Risk management aims to exploit or enhance opportunities and avoid or mitigate threats, while keeping overall exposure within an acceptable range.

| Process | Group |
|---|---|
| 11.1 Plan Risk Management | Planning |
| 11.2 Identify Risks | Planning |
| 11.3 Perform Qualitative Risk Analysis | Planning |
| 11.4 Perform Quantitative Risk Analysis | Planning |
| 11.5 Plan Risk Responses | Planning |
| 11.6 Implement Risk Responses | Executing |
| 11.7 Monitor Risks | Monitoring and Controlling |

**Risk appetite** is how much uncertainty an organisation or person is willing to accept in return for reward. It is expressed as measurable **risk thresholds**: the acceptable variation around each objective, such as "no more than a 5% cost overrun".

## Trends

- **Non-event risks:**
  - *Variability risk*: uncertainty about the characteristics of a planned event, such as productivity or the number of test errors. It is handled with Monte Carlo analysis and actions to narrow the range.
  - *Ambiguity risk*: uncertainty about what *might* happen, such as unclear requirements or a changing regulatory environment. It is handled by filling knowledge gaps, prototyping and incremental development.
- **Project resilience** against *unknowable-unknowns*, which can only be recognised after they occur. It relies on contingency for emergent risks, flexible processes with strong change management, an empowered team, frequent review of early warning signs, and clear input from stakeholders on where scope or strategy can change.
- **Integrated risk management**: risks are owned at the right level (project, program, portfolio or enterprise), with some escalated and some delegated.

**Agile:** risk is considered when the team chooses the content of each iteration, and it is identified, analysed and managed during every iteration.

## 11.1 Plan Risk Management

This process decides how risk management will be carried out, so the effort is proportionate to the project's risk and importance. It starts when the project is conceived and is revisited at major phase changes or when scope changes significantly.

**Tools:** expert judgment, **stakeholder analysis** (to understand risk appetite) and planning meetings.

### The risk management plan includes

- **Risk strategy**: the general approach.
- **Methodology**: approaches, tools and data sources.
- **Roles and responsibilities.**
- **Funding**, including the protocols for using contingency and management reserves.
- **Timing**: when and how often risk activities happen.
- **Risk categories**, often as a **risk breakdown structure (RBS)**: a hierarchy of potential *sources* of risk. For example, level 1 might be technical, management, commercial and external, with more detailed categories below each.
- **Stakeholder risk appetite**, expressed as measurable thresholds.
- **Definitions of risk probability and impact**: usually five levels (very low to very high), with an impact scale for each objective (time, cost, quality).
- **Probability and impact matrix**: rules for ranking risks. Multiplying a numeric probability by a numeric impact gives a score. For example, probability 0.7 × impact 0.4 = **0.28**. Threats and opportunities use mirror-image matrices.
- **Reporting formats** (the content of the risk register and risk report) and **tracking** (how risk activities are recorded and audited).`,
      keyTerms: [
        { term: 'Individual project risk', def: 'An uncertain event or condition that, if it occurs, has a positive or negative effect on one or more project objectives.' },
        { term: 'Overall project risk', def: 'The effect of uncertainty on the project as a whole, from all sources.' },
        { term: 'Risk threshold', def: 'The level of risk exposure above which risks are addressed and below which they may be accepted.' },
        { term: 'Risk breakdown structure', def: 'A hierarchical representation of potential sources of risk.' },
        { term: 'Probability and impact matrix', def: 'A grid mapping probability against impact to rate and prioritise risks.' },
      ],
    },
    {
      id: 'm11-l2',
      title: '11.2 Identify Risks and 11.3 Perform Qualitative Risk Analysis',
      minutes: 35,
      topics: ['k-11.2-identify-risks', 'k-11.3-qualitative'],
      objectives: [
        'Write a cause-risk-effect risk statement',
        'Use checklists, SWOT, assumption analysis and prompt lists to identify risks',
        'Prioritise risks using probability, impact and other parameters',
        'Explain the contents of the risk register and risk report',
      ],
      body: `## 11.2 Identify Risks

Identify Risks finds individual risks and sources of overall project risk and records their characteristics. It is repeated throughout the project. **Everyone** should be encouraged to identify risks, and involving the team builds ownership.

### Write clear risk statements

Use a format that separates **cause**, **risk** and **effect**: "*Because* the vendor uses a new process (cause), *there is a risk that* parts fail inspection (risk), *which would* delay assembly by up to three weeks (effect)."

### Tools

- **Brainstorming**, often structured around the RBS categories.
- **Checklists** built from past projects. They are quick but **never exhaustive**, so they must not replace proper identification. Review and prune them regularly.
- **Interviews**, conducted in an atmosphere of trust and confidentiality.
- **Root cause analysis**: start from a problem statement to find threats, or from a benefit statement to find opportunities.
- **Assumption and constraint analysis**: inaccurate or unstable assumptions create threats; removing or relaxing a constraint may create opportunities.
- **SWOT analysis** (strengths, weaknesses, opportunities, threats). Opportunities often grow from strengths, and threats from weaknesses.
- **Document analysis**: uncertainty or inconsistency in documents points to risk.
- **Prompt lists** of categories to stimulate ideas: the lowest level of the RBS, **PESTLE** (political, economic, social, technological, legal, environmental), **TECOP** (technical, environmental, commercial, operational, political) and **VUCA** (volatility, uncertainty, complexity, ambiguity).
- **Facilitation** and **risk workshops**.

### Outputs

- **Risk register**: each risk's ID, statement, potential owner and potential responses, plus optional details such as category, status, causes, effects, **triggers** (signs a risk is about to occur), the WBS reference and timing. Later risk processes keep adding to it.
- **Risk report**: the sources of overall project risk and a summary of the individual risks (numbers, categories, trends). It is built up progressively.

## 11.3 Perform Qualitative Risk Analysis

This process **prioritises** individual risks by assessing probability, impact and other characteristics, so the team can focus on the most important ones. Because judgments are subjective, the facilitator identifies and **corrects for bias**. Each risk is assigned a **risk owner**. Agile teams often do this before each iteration.

### Tools

- **Risk data quality assessment**: how accurate, complete, objective and timely is the risk data?
- **Probability and impact assessment**, using the definitions in the risk management plan. Low-probability, low-impact risks go on a **watch list**.
- **Other parameters:**
  - *Urgency*: how soon a response must be in place.
  - *Proximity*: how soon the risk could affect objectives.
  - *Dormancy*: how long after the risk occurs before its impact is noticed.
  - Manageability, controllability, **detectability**, connectivity, strategic impact and propinquity (how much stakeholders feel it matters).
- **Risk categorisation**: by source (RBS), by the area affected (WBS) or by root cause, so responses can target the most exposed areas.
- **Probability and impact matrix**, and hierarchical charts such as **bubble charts** for three parameters (for example, detectability, proximity and impact).

### Outputs

These are **document updates only**: the risk register gains probability and impact ratings, priority, owner, urgency, category and the watch list; the risk report and the assumption and issue logs are updated too.

> **Exam tip:** Qualitative analysis is fast and subjective, and it is done for **every** identified risk. Quantitative analysis is numerical and is done only when it is warranted.`,
      keyTerms: [
        { term: 'Risk register', def: 'A repository recording identified risks, their analysis results and planned responses.' },
        { term: 'Risk report', def: 'A document summarising sources of overall risk and individual risks, updated throughout the risk processes.' },
        { term: 'Trigger condition', def: 'An event or situation indicating that a risk is about to occur.' },
        { term: 'Watch list', def: 'Low-priority risks recorded for monitoring rather than active response.' },
        { term: 'Risk owner', def: 'The person responsible for monitoring a risk and for selecting and implementing its response.' },
      ],
    },
    {
      id: 'm11-l3',
      title: '11.4 Perform Quantitative Risk Analysis',
      minutes: 35,
      topics: ['k-11.4-quantitative-intro', 'k-11.4-quantitative-tools'],
      objectives: [
        'Decide when quantitative risk analysis is warranted',
        'Interpret Monte Carlo S-curves, criticality and tornado diagrams',
        'Calculate expected monetary value (EMV) and solve a decision tree',
      ],
      body: `## When to use it

Quantitative risk analysis numerically analyses the **combined effect** of individual risks and other uncertainty on the project's overall objectives. It is **not required on every project**. It needs good-quality risk data, sound baselines, specialist software and expertise, which all add time and cost. It is most appropriate for large, complex, strategically important or contractually required projects. It is the only reliable way to assess **overall** project risk. It can be repeated after response planning to check the responses will work.

## Representing uncertainty

Uncertain durations and costs are modelled as **probability distributions**: triangular, normal, lognormal, beta, uniform or discrete. Individual risks can also be modelled as **probabilistic branches** (activities that occur in a simulation run with the risk's probability). Related risks are modelled with **correlation**.

## Techniques

- **Monte Carlo simulation**: runs the model thousands of times with random inputs. The output is a histogram or **cumulative probability S-curve**. For example, the model might show only a 25% chance of meeting a $3.0M budget, but an 80% chance of finishing within $3.3M. The gap is the contingency needed for 80% confidence.
- **Criticality analysis**: how often each activity appears on the critical path across all the runs (its criticality index).
- **Sensitivity analysis**: which risks or uncertainties drive the most variation in outcomes, shown in a **tornado diagram** with the strongest drivers at the top.
- **Decision tree analysis**: choosing between alternatives by calculating the **expected monetary value (EMV)** of each branch.
- **Influence diagrams**: show the entities, outcomes and influences, and are evaluated by simulation.

## Expected monetary value

EMV = probability × impact. Use positive values for opportunities and negative values for threats, then add them up.

*Example:* a 30% chance of a $50,000 penalty (−$15,000) and a 20% chance of a $20,000 early-completion bonus (+$4,000) give an EMV of **−$11,000**.

### Decision tree example

A company must choose between **launching a new product line** (investment $40M) and **extending an existing one** (investment $15M). Demand is uncertain: 70% high, 30% low.

| Option | Demand | Probability | Revenue | Net value | Weighted |
|---|---|---|---|---|---|
| New line | High | 0.7 | $90M | +$50M | +$35M |
| New line | Low | 0.3 | $20M | −$20M | −$6M |
| **EMV new line** | | | | | **+$29M** |
| Extend line | High | 0.7 | $45M | +$30M | +$21M |
| Extend line | Low | 0.3 | $25M | +$10M | +$3M |
| **EMV extend line** | | | | | **+$24M** |

By EMV, **launch the new line** (+$29M). A risk-averse organisation might still prefer to extend the line, because it avoids a possible $20M loss. EMV is a guide to the decision, not the whole answer.

> **Source note:** The Guide's decision tree example (Figure 11-15) labels its result "EMV (before costs)", even though the investment cost is already subtracted in each branch. The method shown here, subtracting the investment first and then weighting by probability, is the standard one.

## Outputs

Updates to the **risk report**: the overall risk exposure (the chance of meeting objectives and the range of outcomes); detailed probabilistic analysis (S-curves, tornado diagrams, criticality, the contingency needed for a chosen confidence level); a prioritised list of individual risks; trends; and recommended responses.`,
      keyTerms: [
        { term: 'Monte Carlo simulation', def: 'An analysis technique that iterates a model many times with random inputs drawn from probability distributions.' },
        { term: 'Expected monetary value (EMV)', def: 'Probability multiplied by impact, summed across outcomes; used to compare options under uncertainty.' },
        { term: 'Tornado diagram', def: 'A bar chart of sensitivity analysis showing which variables have the greatest effect, ranked in descending order.' },
        { term: 'Decision tree analysis', def: 'A diagram and calculation technique for evaluating a chain of options in the presence of uncertainty.' },
      ],
    },
    {
      id: 'm11-l4',
      title: '11.5 Plan Risk Responses and 11.6 Implement Risk Responses',
      minutes: 35,
      topics: ['k-11.5-plan-responses', 'k-11.6-implement-responses'],
      objectives: [
        'Choose among the five strategies for threats and the five for opportunities',
        'Distinguish contingency plans, fallback plans, residual risks and secondary risks',
        'Explain why implementing responses is a separate process',
      ],
      body: `## Principles

Responses should be **appropriate** to the risk's significance, **cost-effective**, **realistic**, **agreed** by everyone involved, and **owned** by a responsible person. High-priority risks need proactive responses; low-priority risks may only go on the watch list.

## Strategies for threats

| Strategy | What it does | Example |
|---|---|---|
| **Escalate** | The threat is outside the project's scope, or the response is beyond the PM's authority; it is passed to the program, portfolio or organisation, which must **accept** ownership | A regulatory change affecting all company products |
| **Avoid** | Eliminates the threat or protects the project from it entirely | Removing a risky feature, extending the schedule, choosing proven technology |
| **Transfer** | Shifts the ownership and impact to a third party, usually for a premium | Insurance, performance bonds, warranties, fixed-price contracts |
| **Mitigate** | Reduces the probability and/or impact | Extra testing, prototypes, a more stable supplier, redundancy |
| **Accept** | Acknowledges the threat without proactive action | **Active**: a contingency reserve. **Passive**: periodic review only |

## Strategies for opportunities

| Strategy | What it does | Example |
|---|---|---|
| **Escalate** | As for threats | An opportunity that benefits the wider organisation |
| **Exploit** | Makes sure the opportunity **definitely** happens (probability 100%) | Assign the most talented people to finish early |
| **Share** | Gives ownership to a third party best able to capture the benefit | Joint venture, partnership |
| **Enhance** | Increases the probability and/or impact | Add resources to an activity to finish it early |
| **Accept** | Takes advantage if it happens, without pursuing it | Active or passive |

**Contingent response strategies** are used only if a **trigger** occurs, for example "if milestone 3 is missed by more than a week, bring in the backup contractor".

**For overall project risk** the strategies are avoid (including cancelling the project, as the most extreme step), exploit, transfer or share, mitigate or enhance, and accept.

### Choosing

Use **alternatives analysis**, **cost-benefit analysis** (cost-effectiveness = reduction in impact ÷ cost of the response), and **multicriteria decision analysis** (cost, effectiveness, timing, secondary risks).

## Vocabulary to know

| Term | Meaning |
|---|---|
| **Contingency plan** | The planned response to carry out if a trigger occurs |
| **Fallback plan** | The backup if the primary response proves inadequate |
| **Residual risk** | Risk that remains **after** responses are implemented (or that was deliberately accepted) |
| **Secondary risk** | A **new** risk that arises directly **from implementing** a response |
| **Contingency reserve** | Time or money set aside within the baseline to respond to identified risks |

**Outputs:** change requests, updates to plans and baselines, and updates to the risk register (agreed strategies, actions, triggers, budgets, contingency and fallback plans, and residual and secondary risks).

## 11.6 Implement Risk Responses

A common failure is that teams identify, analyse and plan responses, document them, and then **never act**. This process makes sure the agreed responses are actually carried out by their owners.

**Tools:** expert judgment, **influencing** (risk owners outside the team may need encouragement), and the PMIS. **Outputs:** change requests and updates to the issue log, lessons learned, team assignments, risk register and risk report.

> **Exam tip:** "A risk that was identified has occurred. What should the PM do?" The best answer is usually to **implement the planned response** (the contingency plan) from the risk register. If no response was planned, the event is now an **issue**: record it in the issue log and deal with it.`,
      keyTerms: [
        { term: 'Mitigate', def: 'A threat response that reduces the probability of occurrence or impact of a threat.' },
        { term: 'Transfer', def: 'A threat response that shifts ownership of a threat to a third party.' },
        { term: 'Exploit', def: 'An opportunity response that ensures the opportunity is realised.' },
        { term: 'Residual risk', def: 'The risk that remains after risk responses have been implemented.' },
        { term: 'Secondary risk', def: 'A risk that arises as a direct result of implementing a risk response.' },
        { term: 'Fallback plan', def: 'An alternative set of actions used if the primary response proves ineffective.' },
      ],
    },
    {
      id: 'm11-l5',
      title: '11.7 Monitor Risks',
      minutes: 20,
      topics: ['k-11.7-monitor-risks', 'k-11.7-monitor-risks-tools'],
      objectives: [
        'Describe what risk monitoring determines',
        'Use technical performance analysis, reserve analysis and risk audits',
        'Distinguish risk reviews from risk audits',
      ],
      body: `## What monitoring determines

Monitor Risks tracks whether the agreed responses were implemented, tracks identified risks, identifies and analyses **new** risks, and evaluates how effective the risk process is. It uses performance information to check whether:

- the responses are working;
- the level of overall project risk has changed;
- the status of individual risks has changed;
- new risks have appeared;
- the risk management approach is still appropriate;
- the assumptions are still valid;
- risk policies and procedures are being followed;
- the contingency reserves need changing;
- the project strategy is still valid.

## Inputs

The risk management plan; the issue log, lessons learned, risk register and risk report; **work performance data** (which responses were implemented, which risks occurred, which are active or closed); and **work performance reports** (variances, earned value and forecasts).

## Tools

- **Technical performance analysis**: comparing actual technical achievements with the plan using objective measures, such as weight, transaction time, defects delivered or storage capacity. A deviation may signal a threat or an opportunity.
- **Reserve analysis**: comparing the **remaining contingency reserve** with the **remaining risk**, to check the reserve is still adequate. This is often shown as a reserve burndown chart.
- **Risk audits**: assess the **effectiveness of the risk management process**. The PM makes sure they happen as often as the plan requires.
- **Risk reviews (meetings)**: regular meetings to check how well the responses are working, identify new risks (including secondary risks), reassess risks, **close outdated risks**, and capture lessons.

| Risk review | Risk audit |
|---|---|
| Examines **risks** and how well their **responses** are working | Examines the **risk management process** |
| Often part of regular status meetings | Has a defined format and objectives; may be separate |

## Outputs

Work performance information; change requests (including corrective and preventive actions); updates to plans; updates to documents (the risk register gains new, closed and occurred risks; the risk report gains the status of major risks and audit conclusions); and OPA updates (templates and the RBS).

> **Exam tip:** Contingency reserve is running out faster than the risks are being retired. Reserve analysis has found the problem. The PM should reassess the remaining risk and, if needed, request more reserve through change control.`,
      keyTerms: [
        { term: 'Risk audit', def: 'A review of the effectiveness of the risk management process.' },
        { term: 'Risk review', def: 'A meeting to examine and document the effectiveness of risk responses and identify new risks.' },
        { term: 'Technical performance analysis', def: 'Comparing technical accomplishments during execution with the schedule of technical achievement.' },
        { term: 'Reserve analysis', def: 'Comparing remaining contingency reserve with remaining risk to determine whether it is adequate.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm11-q1',
      stem: 'Which statement best describes overall project risk?',
      options: ['The single highest-scoring risk in the register', 'The effect of uncertainty on the project as a whole, from all sources', 'The sum of all contingency reserves', 'Risks escalated to the portfolio'],
      answer: 1,
      explanation: 'Overall project risk is the effect of uncertainty on the project as a whole, arising from all sources including individual risks.',
      topic: 'k-risk-overview',
      ref: 'PMBOK 6 §11 Key Concepts',
    },
    {
      id: 'm11-q2',
      stem: 'The sponsor states that any forecast overrun above 5% must be escalated. What is this an example of?',
      options: ['Risk appetite expressed as a risk threshold', 'A risk trigger', 'A contingency plan', 'A secondary risk'],
      answer: 0,
      explanation: 'Risk thresholds are measurable expressions of risk appetite: the acceptable variation around an objective.',
      topic: 'k-11.1-plan-risk',
      ref: 'PMBOK 6 §11 Key Concepts; §11.1.3.1',
    },
    {
      id: 'm11-q3',
      stem: 'A hierarchical representation of potential sources of risk, such as technical, management, commercial and external, is called:',
      options: ['Risk register', 'Risk breakdown structure', 'Resource breakdown structure', 'Probability and impact matrix'],
      answer: 1,
      explanation: 'The risk breakdown structure (RBS) groups potential sources of risk hierarchically and is part of the risk management plan.',
      topic: 'k-11.1-plan-risk',
      ref: 'PMBOK 6 §11.1.3.1, Figure 11-4',
    },
    {
      id: 'm11-q4',
      stem: 'The team uses a list of risks from previous similar projects. What caution does the Guide give about checklists?',
      options: ['Checklists are the most complete identification technique', 'Checklists are quick but never exhaustive and must not replace proper identification', 'Checklists should only be used by the sponsor', 'Checklists apply only to opportunities'],
      answer: 1,
      explanation: 'Checklists are useful and quick but cannot be exhaustive. The team should also explore items not on the list, and prune and update checklists.',
      topic: 'k-11.2-identify-risks',
      ref: 'PMBOK 6 §11.2.2.2',
    },
    {
      id: 'm11-q5',
      stem: 'Which prompt list covers political, economic, social, technological, legal and environmental factors?',
      options: ['TECOP', 'VUCA', 'PESTLE', 'SWOT'],
      answer: 2,
      explanation: 'PESTLE is a prompt list of political, economic, social, technological, legal and environmental categories.',
      topic: 'k-11.2-identify-risks',
      ref: 'PMBOK 6 §11.2.2.5',
    },
    {
      id: 'm11-q6',
      stem: 'A risk could affect the project next week, so a response must be in place within days. Which parameter describes "how soon the risk could affect objectives"?',
      options: ['Dormancy', 'Proximity', 'Detectability', 'Propinquity'],
      answer: 1,
      explanation: 'Proximity is the time before the risk could affect objectives. Urgency is the time within which a response must be implemented; dormancy is the time between occurrence and discovery of impact.',
      topic: 'k-11.3-qualitative',
      ref: 'PMBOK 6 §11.3.2.4',
    },
    {
      id: 'm11-q7',
      stem: 'Where are low-probability, low-impact risks recorded after qualitative analysis?',
      options: ['In the issue log', 'On a watch list within the risk register', 'In the change log', 'They are deleted'],
      answer: 1,
      explanation: 'Low-priority risks are placed on a watch list within the risk register for future monitoring.',
      topic: 'k-11.3-qualitative',
      ref: 'PMBOK 6 §11.3.2.3; §11.3.3.1',
    },
    {
      id: 'm11-q8',
      stem: 'A small internal project with a modest budget has identified 20 risks. Is quantitative risk analysis required?',
      options: ['Yes, it is required for every project', 'Not necessarily; it is used where warranted by size, complexity, importance or requirements', 'Only if the sponsor requests a decision tree', 'Only after the project closes'],
      answer: 1,
      explanation: 'Quantitative analysis is not required on all projects. It needs good data, software and expertise, and is most appropriate for large, complex or strategically important projects.',
      topic: 'k-11.4-quantitative-intro',
      ref: 'PMBOK 6 §11.4',
    },
    {
      id: 'm11-q9',
      stem: 'Which output shows which individual risks have the greatest effect on project outcomes, ranked from strongest to weakest?',
      options: ['Bubble chart', 'Tornado diagram', 'Histogram', 'RACI chart'],
      answer: 1,
      explanation: 'Sensitivity analysis is commonly displayed as a tornado diagram ranking drivers by strength of correlation with outcomes.',
      topic: 'k-11.4-quantitative-tools',
      ref: 'PMBOK 6 §11.4.2.5',
    },
    {
      id: 'm11-q10',
      stem: 'There is a 40% chance of a $25,000 cost increase and a 10% chance of saving $10,000. What is the combined EMV?',
      options: ['−$9,000', '−$10,000', '−$11,000', '+$1,000'],
      answer: 0,
      explanation: 'EMV = 0.4 × (−25,000) + 0.1 × (+10,000) = −10,000 + 1,000 = −$9,000.',
      topic: 'k-11.4-quantitative-tools',
      ref: 'PMBOK 6 §11.4.2.5',
    },
    {
      id: 'm11-q11',
      stem: 'The team buys insurance against fire damage to equipment on site. Which response strategy is this?',
      options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      answer: 2,
      explanation: 'Transfer shifts ownership and financial impact of a threat to a third party, usually for a premium, as with insurance.',
      topic: 'k-11.5-plan-responses',
      ref: 'PMBOK 6 §11.5.2.4',
    },
    {
      id: 'm11-q12',
      stem: 'To guarantee an early-completion bonus, the PM assigns the organisation\'s most experienced engineers to the critical activities. Which strategy is this?',
      options: ['Enhance', 'Exploit', 'Share', 'Accept'],
      answer: 1,
      explanation: 'Exploit aims to ensure an opportunity definitely happens (probability to 100%), for example by assigning the most talented resources.',
      topic: 'k-11.5-plan-responses',
      ref: 'PMBOK 6 §11.5.2.5',
    },
    {
      id: 'm11-q13',
      stem: 'The team identifies a threat caused by a new national regulation that affects all of the organisation\'s products, not just this project. What should the PM do?',
      options: ['Mitigate it within the project budget', 'Escalate it to the appropriate level in the organisation, which must accept ownership', 'Accept it passively', 'Transfer it to a vendor'],
      answer: 1,
      explanation: 'Escalate when a threat is outside project scope or the response exceeds the PM\'s authority. The appropriate owner (program, portfolio or organisation) must accept it.',
      topic: 'k-11.5-plan-responses',
      ref: 'PMBOK 6 §11.5.2.4',
    },
    {
      id: 'm11-q14',
      stem: 'Hiring a second supplier to reduce supply risk introduces the risk of inconsistent parts between suppliers. What is the new risk called?',
      options: ['Residual risk', 'Secondary risk', 'Overall project risk', 'Variability risk'],
      answer: 1,
      explanation: 'A secondary risk arises directly from implementing a risk response. Residual risk is what remains after responses are implemented.',
      topic: 'k-11.5-plan-responses',
      ref: 'PMBOK 6 §11.5.3.3',
    },
    {
      id: 'm11-q15',
      stem: 'Responses were documented weeks ago, but none of the risk owners has acted. Which process addresses this gap?',
      options: ['Plan Risk Responses', 'Implement Risk Responses', 'Perform Qualitative Risk Analysis', 'Identify Risks'],
      answer: 1,
      explanation: 'Implement Risk Responses ensures agreed responses are actually executed; the Guide notes a common problem is planning responses but never acting on them.',
      topic: 'k-11.6-implement-responses',
      ref: 'PMBOK 6 §11.6',
    },
  ],
};
