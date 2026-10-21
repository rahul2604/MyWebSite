import type { Module } from '../types.ts';

export const M08: Module = {
  id: 'M08',
  number: '8',
  title: 'Project Quality Management',
  summary: 'Quality versus grade, cost of quality, planning quality, managing quality (assurance and improvement) and controlling quality with data tools.',
  lessons: [
    {
      id: 'm08-l1',
      title: 'Quality concepts and 8.1 Plan Quality Management',
      minutes: 35,
      topics: ['q-quality-overview', 'q-8.1-plan-quality'],
      objectives: [
        'Distinguish quality from grade, prevention from inspection, and tolerances from control limits',
        'Classify costs into the four cost-of-quality categories',
        'Describe the quality management plan and quality metrics',
        'Explain the five levels of quality management',
      ],
      body: `## Three processes

| Process | Group | In one sentence |
|---|---|---|
| 8.1 Plan Quality Management | Planning | Identify quality requirements and standards and document how compliance will be shown |
| 8.2 Manage Quality | Executing | Turn the quality plan into executable quality activities and improve processes |
| 8.3 Control Quality | Monitoring and Controlling | Measure results to verify outputs are complete, correct and meet expectations |

Two outputs of these processes are used widely elsewhere: **verified deliverables** (from 8.3, which go to Validate Scope) and **quality reports** (from 8.2).

## Key concepts

**Quality** is the degree to which a set of inherent characteristics fulfils requirements. **Grade** is a category for deliverables with the same functional use but different technical characteristics.

> **Remember:** Low quality is always a problem. Low grade may not be: a basic but reliable product can be exactly right. A high-grade product full of defects is a problem.

| Pair | Distinction |
|---|---|
| **Prevention vs inspection** | Prevention keeps errors *out of the process*; inspection keeps errors *out of the customer's hands*. Prevention is preferred because quality should be designed in. |
| **Attribute vs variable sampling** | Attribute: the result conforms or it does not. Variable: the result is measured on a continuous scale. |
| **Tolerances vs control limits** | Tolerances are the acceptable range of results set by requirements. Control limits are statistically calculated boundaries of the normal variation of a stable process. |

### Five levels of quality management (from least to most effective)

1. Let the customer find the defects. This is the most expensive: warranty claims, recalls, reputation damage.
2. Detect and correct defects before delivery (quality control).
3. Use quality assurance to examine and correct the **process**.
4. Build quality into the planning and design of the project and product.
5. Create an organisation-wide **culture** committed to quality.

### Trends

- **Customer satisfaction**: conformance to requirements *and* fitness for use.
- **Continual improvement**: the Plan-Do-Check-Act cycle (Shewhart, as modified by Deming), Total Quality Management, Six Sigma and Lean Six Sigma.
- **Management responsibility**: everyone on the team plays a part, and management provides the resources.
- **Mutually beneficial partnerships with suppliers**: long-term cooperation rather than short-term gain.

**Agile:** quality and review steps happen throughout, not at the end. Recurring retrospectives check whether quality processes are working, and small batches surface problems early, when change is cheap.

## 8.1 Plan Quality Management

This process identifies the quality requirements and standards and decides how compliance will be demonstrated. It runs alongside other planning, because quality decisions affect cost, schedule and risk.

### Cost of quality (COQ)

| Cost of conformance (money spent to avoid failures) | Cost of nonconformance (money spent because of failures) |
|---|---|
| **Prevention costs**: training, documenting processes, the right equipment, time to do it right | **Internal failure costs** (found by the project): rework, scrap |
| **Appraisal costs**: testing, inspections, destructive test losses | **External failure costs** (found by the customer): liabilities, warranty work, lost business |

The optimal COQ balances investment in prevention and appraisal against failure costs. Beyond a certain point, extra prevention is no longer cost-effective.

### Other tools

- **Benchmarking**, brainstorming and interviews.
- **Cost-benefit analysis**: is each quality activity worth its cost?
- **Multicriteria decision analysis**: for example, to prioritise quality metrics.
- **Flowcharts**, including **SIPOC** (suppliers, inputs, process, outputs, customers).
- Logical data models, matrix diagrams and mind mapping.
- **Test and inspection planning**: deciding how to test, such as alpha and beta tests for software or strength tests in construction.

### Outputs

- **Quality management plan**: the quality standards, objectives, roles and responsibilities; which deliverables and processes are reviewed; the quality control and management activities and tools; and the procedures for nonconformance, corrective action and continuous improvement.
- **Quality metrics**: a specific attribute and how it will be measured. Examples: percentage of tasks finished on time, CPI, failure rate, defects per day, downtime per month, errors per thousand lines of code, customer satisfaction scores.`,
      keyTerms: [
        { term: 'Quality', def: 'The degree to which a set of inherent characteristics fulfils requirements.' },
        { term: 'Grade', def: 'A category assigned to deliverables having the same functional use but different technical characteristics.' },
        { term: 'Cost of quality', def: 'All costs over the product life of preventing nonconformance, appraising conformance and failing to meet requirements.' },
        { term: 'Quality metric', def: 'A description of a project or product attribute and how to measure it.' },
      ],
    },
    {
      id: 'm08-l2',
      title: '8.2 Manage Quality',
      minutes: 30,
      topics: ['q-8.2-manage-quality'],
      objectives: [
        'Explain how Manage Quality relates to quality assurance',
        'Use cause-and-effect diagrams, histograms and scatter diagrams appropriately',
        'Describe the purpose of quality audits and Design for X',
      ],
      body: `## What Manage Quality does

Manage Quality turns the quality management plan into **executable quality activities**. It is sometimes called *quality assurance*, but it is broader. QA focuses on making sure the right processes are used effectively; Manage Quality also covers **product design** and **process improvement**. In COQ terms, it is conformance work.

Its purposes are to:

- design an optimal, mature product;
- build confidence that future outputs will meet requirements;
- confirm that quality processes are being used and are working;
- improve the efficiency and effectiveness of processes.

Manage Quality is **everyone's job**: the PM, the team, the sponsor, management, even the customer. In agile, all team members do it throughout; in traditional projects, specific people often have the role.

## Tools

- **Checklists**: structured lists for checking that steps were done or requirements met.
- **Document, process and alternatives analysis**: process analysis looks for improvement opportunities and non-value-added activities.
- **Root cause analysis**: finding the underlying cause of a variance, defect or risk. Remove the root cause and the problem stops recurring.
- **Data representation:**
  - *Affinity diagrams*: group potential causes of defects.
  - *Cause-and-effect diagrams* (fishbone, Ishikawa, why-why): break a problem down into branches (such as people, process, materials, equipment, environment, management) to trace it to its root cause.
  - *Flowcharts*: show the steps that lead to a defect.
  - *Histograms*: show numerical data, such as defects by deliverable.
  - *Matrix diagrams*.
  - *Scatter diagrams*: show the relationship between two variables, such as experience and error rate.
- **Audits**: a structured, **independent** review (often by internal audit, the PMO or an outside party) to check compliance with organisational and project policies, processes and procedures. Audits identify good practices to share, nonconformities, gaps and shortcomings. They can also confirm that approved changes were implemented.
- **Design for X (DfX)**: design guidelines that optimise one aspect of the product, such as reliability, assembly, manufacturing, cost, service, usability or safety.
- **Problem solving**: define the problem, find the root cause, generate solutions, choose the best, implement it, and verify it worked.
- **Quality improvement methods**: PDCA and Six Sigma are the most common.

## Outputs

- **Quality reports**: quality issues escalated by the team, recommendations for process, project and product improvements, corrective action recommendations, and a summary of Control Quality findings.
- **Test and evaluation documents**, used as inputs to Control Quality.
- Change requests, plan updates and document updates (issue log, lessons learned, risk register).

> **Exam tip:** "An independent team reviews whether the project is following the organisation's quality processes" describes a **quality audit**, in Manage Quality. "Inspecting the product against its specification" is **Control Quality**.`,
      keyTerms: [
        { term: 'Manage Quality', def: 'Translating the quality management plan into executable quality activities that incorporate organisational quality policies.' },
        { term: 'Quality audit', def: 'A structured, independent process to determine whether project activities comply with policies, processes and procedures.' },
        { term: 'Cause-and-effect diagram', def: 'A diagram (fishbone/Ishikawa) that traces a problem to its possible root causes.' },
        { term: 'Design for X', def: 'Technical guidelines applied during design to optimise a specific aspect such as reliability or cost.' },
      ],
    },
    {
      id: 'm08-l3',
      title: '8.3 Control Quality',
      minutes: 30,
      topics: ['q-8.3-control-quality'],
      objectives: [
        'Explain how Control Quality produces verified deliverables',
        'Choose between inspection, testing, statistical sampling and check sheets',
        'Interpret a control chart, distinguishing control limits from specification limits',
      ],
      body: `## Purpose

Control Quality monitors and records the results of quality activities, to make sure outputs are **complete, correct and meet customer expectations** before user acceptance and final delivery. It verifies that deliverables do what they were intended to do and comply with the applicable standards, requirements and regulations.

**Key inputs:**

- **Deliverables** and work performance data, from Direct and Manage Project Work.
- **Approved change requests**: Control Quality verifies that each change was fully implemented, tested and certified.
- The quality management plan, quality metrics, and test and evaluation documents.

## Tools

- **Checklists** and **check sheets** (tally sheets). Check sheets record how often each kind of defect occurs, for example scratches, dents or wrong labels by day.
- **Statistical sampling**: inspect a sample instead of the whole population, for example 12 of 120 drawings at random.
- **Questionnaires and surveys**: for customer satisfaction after delivery. Defects found this way count as external failure costs.
- **Performance reviews** and **root cause analysis**.
- **Inspection**: examining a work product to see whether it conforms to documented standards. Also called a review, peer review, audit or walkthrough. Inspection also verifies defect repairs.
- **Testing and product evaluations**: finding errors and defects. Testing early is cheaper. Examples are unit, integration and regression tests in software, and concrete strength tests in construction.
- **Cause-and-effect diagrams, histograms and scatter diagrams.**
- **Control charts**: show whether a process is **stable**, with predictable performance.
- **Meetings**: reviews of approved change requests, and retrospectives or lessons learned sessions.

## Reading a control chart

| Line | Where it comes from |
|---|---|
| **Upper and lower specification limits** | The customer's or contract's requirements: the maximum and minimum allowed |
| **Upper and lower control limits** | Calculated statistically from the process itself (commonly ±3 standard deviations): the natural range of a stable process |
| **Mean** | The process average |

A point outside the control limits means the process is **out of control** and needs investigation. Common exam heuristics, not stated in the Guide, also treat certain patterns as signs of an out-of-control process, such as a run of seven or more points on one side of the mean. Control charts can also track cost and schedule variances or the frequency of scope changes.

## Outputs

- **Quality control measurements**: the documented results.
- **Verified deliverables**, which go to **Validate Scope**. A changed deliverable is inspected and verified again.
- **Work performance information**: requirements fulfilled, causes of rejection, rework needed, and process adjustments needed.
- Change requests, quality management plan updates, and document updates. A nonconforming deliverable is often logged in the **issue log**.

> **Exam tip:** Control Quality is mostly done by the project team and checks *correctness*. Validate Scope is done with the customer and is about *acceptance*. In waterfall projects, Control Quality usually happens at set points; in agile, the whole team does it continuously.`,
      keyTerms: [
        { term: 'Control Quality', def: 'Monitoring and recording results of quality activities to assess performance and ensure outputs are complete, correct and meet expectations.' },
        { term: 'Control chart', def: 'A chart showing whether a process is stable, with a mean, control limits and (often) specification limits.' },
        { term: 'Statistical sampling', def: 'Choosing part of a population for inspection.' },
        { term: 'Check sheet', def: 'A tally sheet used to organise facts and collect data about potential quality problems.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm08-q1',
      stem: 'A basic mobile phone has few features but never fails. A premium phone has many features but crashes often. Which statement is correct?',
      options: ['Both are low quality', 'The basic phone is low grade but high quality; the premium phone is high grade but low quality', 'The basic phone is low quality because it has few features', 'Grade and quality mean the same thing'],
      answer: 1,
      explanation: 'Grade is a category of technical characteristics; quality is how well characteristics fulfil requirements. Low grade may be fine; low quality is always a problem.',
      topic: 'q-quality-overview',
      ref: 'PMBOK 6 §8 Key Concepts',
    },
    {
      id: 'm08-q2',
      stem: 'Which approach does the Guide prefer for quality?',
      options: ['Inspection before delivery', 'Prevention: designing quality into the process and product', 'Letting the customer report defects', 'Sampling only the final product'],
      answer: 1,
      explanation: 'Prevention is preferred over inspection: it keeps errors out of the process and costs less than correcting mistakes later.',
      topic: 'q-quality-overview',
      ref: 'PMBOK 6 §8 Key Concepts',
    },
    {
      id: 'm08-q3',
      stem: 'Warranty repairs after the product has been delivered are which type of cost?',
      options: ['Prevention cost', 'Appraisal cost', 'Internal failure cost', 'External failure cost'],
      answer: 3,
      explanation: 'Failures found by the customer (warranty work, liabilities, lost business) are external failure costs, part of the cost of nonconformance.',
      topic: 'q-8.1-plan-quality',
      ref: 'PMBOK 6 §8.1.2.3, Figure 8-5',
    },
    {
      id: 'm08-q4',
      stem: 'Training the team on a new coding standard is an example of:',
      options: ['Prevention cost', 'Appraisal cost', 'Internal failure cost', 'External failure cost'],
      answer: 0,
      explanation: 'Training is a prevention cost: money spent during the project to avoid failures (cost of conformance).',
      topic: 'q-8.1-plan-quality',
      ref: 'PMBOK 6 §8.1.2.3',
    },
    {
      id: 'm08-q5',
      stem: 'Which output of Plan Quality Management describes a specific attribute and how Control Quality will measure it?',
      options: ['Quality report', 'Quality metrics', 'Quality control measurements', 'Test and evaluation documents'],
      answer: 1,
      explanation: 'Quality metrics define a project or product attribute and how it will be measured, such as defect density or on-time task percentage.',
      topic: 'q-8.1-plan-quality',
      ref: 'PMBOK 6 §8.1.3.2',
    },
    {
      id: 'm08-q6',
      stem: 'An independent team reviews whether the project is following the organisation\'s quality policies and procedures, and identifies good practices to share. What is this?',
      options: ['Inspection', 'Quality audit', 'Statistical sampling', 'Validate Scope'],
      answer: 1,
      explanation: 'A quality audit is a structured, independent process to determine compliance with policies, processes and procedures. It is a tool of Manage Quality.',
      topic: 'q-8.2-manage-quality',
      ref: 'PMBOK 6 §8.2.2.5',
    },
    {
      id: 'm08-q7',
      stem: 'The team wants to find the underlying reasons for frequent installation failures by grouping causes under people, process, equipment and materials. Which tool fits best?',
      options: ['Control chart', 'Cause-and-effect (fishbone) diagram', 'Check sheet', 'Scatter diagram'],
      answer: 1,
      explanation: 'Cause-and-effect diagrams break a problem into branches of potential causes to trace it to its root cause.',
      topic: 'q-8.2-manage-quality',
      ref: 'PMBOK 6 §8.2.2.4',
    },
    {
      id: 'm08-q8',
      stem: 'A designer applies guidelines to make a product easier to assemble and service. Which technique is this?',
      options: ['Design for X', 'Benchmarking', 'Root cause analysis', 'Statistical sampling'],
      answer: 0,
      explanation: 'Design for X applies technical guidelines during design to optimise a specific aspect, such as assembly, service, cost or reliability.',
      topic: 'q-8.2-manage-quality',
      ref: 'PMBOK 6 §8.2.2.6',
    },
    {
      id: 'm08-q9',
      stem: 'Which process is the main source of quality reports that recommend process improvements?',
      options: ['Plan Quality Management', 'Manage Quality', 'Control Quality', 'Validate Scope'],
      answer: 1,
      explanation: 'Quality reports, including recommendations for improvement and summaries of Control Quality findings, are outputs of Manage Quality.',
      topic: 'q-8.2-manage-quality',
      ref: 'PMBOK 6 §8.2.3.1',
    },
    {
      id: 'm08-q10',
      stem: 'Which output of Control Quality becomes an input to Validate Scope?',
      options: ['Accepted deliverables', 'Verified deliverables', 'Quality reports', 'Approved change requests'],
      answer: 1,
      explanation: 'Control Quality produces verified deliverables, which go to Validate Scope for formal acceptance.',
      topic: 'q-8.3-control-quality',
      ref: 'PMBOK 6 §8.3.3.2',
    },
    {
      id: 'm08-q11',
      stem: 'On a control chart, where do the upper and lower control limits come from?',
      options: ['The customer contract', 'Statistical calculation from the process data', 'The sponsor\'s risk appetite', 'The PMO\'s quality policy'],
      answer: 1,
      explanation: 'Control limits are calculated statistically to show the natural capability of a stable process. Specification limits come from requirements.',
      topic: 'q-8.3-control-quality',
      ref: 'PMBOK 6 §8.3.2.5',
    },
    {
      id: 'm08-q12',
      stem: 'Inspecting every one of 50,000 manufactured bolts would destroy them. What should the team use?',
      options: ['100% inspection', 'Statistical sampling', 'A quality audit', 'Benchmarking'],
      answer: 1,
      explanation: 'Statistical sampling selects part of the population for inspection, which is essential when testing is destructive or the population is large.',
      topic: 'q-8.3-control-quality',
      ref: 'PMBOK 6 §8.3.2.1',
    },
    {
      id: 'm08-q13',
      stem: 'A defect repair was approved last week. Which process verifies that it was implemented correctly?',
      options: ['Direct and Manage Project Work', 'Control Quality', 'Perform Integrated Change Control', 'Plan Quality Management'],
      answer: 1,
      explanation: 'Approved change requests are inputs to Control Quality, which verifies that changes such as defect repairs were implemented as approved.',
      topic: 'q-8.3-control-quality',
      ref: 'PMBOK 6 §8.3.1.3',
    },
    {
      id: 'm08-q14',
      stem: 'Which is the most effective of the five levels of quality management described in the Guide?',
      options: ['Detect and correct defects before delivery', 'Use quality assurance to examine the process', 'Build quality into planning and design', 'Create an organisation-wide culture aware of and committed to quality'],
      answer: 3,
      explanation: 'The levels rise in effectiveness from letting customers find defects up to an organisation-wide culture committed to quality.',
      topic: 'q-quality-overview',
      ref: 'PMBOK 6 §8 Key Concepts',
    },
  ],
};
