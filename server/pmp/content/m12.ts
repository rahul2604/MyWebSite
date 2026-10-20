import type { Module } from '../types.ts';

export const M12: Module = {
  id: 'M12',
  number: '12',
  title: 'Project Procurement Management',
  summary: 'Contracts and their types, make-or-buy, procurement documents and source selection, conducting procurements, and administering and closing contracts.',
  lessons: [
    {
      id: 'm12-l1',
      title: 'Procurement concepts and 12.1 Plan Procurement Management',
      minutes: 40,
      topics: ['p-procurement-overview', 'p-12.1-plan-procurement', 'p-12.1-outputs-table'],
      objectives: [
        'Explain the legal nature of contracts and the PM\'s role in procurement',
        'Choose an appropriate contract type for a situation',
        'Distinguish RFI, RFQ and RFP, and the procurement SOW from terms of reference',
        'Select a source selection method',
      ],
      body: `## Procurement basics

Procurement covers buying or acquiring products, services or results from **outside the project team**. The Guide is written from the **buyer's** point of view. Agreements can be contracts, purchase orders, memoranda of agreement or internal service level agreements.

- A contract is a **legal** relationship. Anything not written in it **cannot be legally enforced**.
- The PM does not need to be a procurement lawyer but must know enough to make good decisions. The PM is usually **not authorised to sign** contracts that bind the organisation; that is often the procurement or legal department.
- The PM team makes sure procurements meet the project's needs; the procurement office makes sure organisational policy is followed.
- The **seller** may be called a contractor, vendor or supplier. It is first a bidder, then the selected source, then the contracted supplier. To the seller, the work is its own project, with the buyer as its key customer.

**Trends:** online procurement tools and building information modelling (BIM); allocating each risk to the party best able to manage it; standard international contract forms; long-lead items and supply chain management; site webcams on public projects; **trial engagements** (paid initial work with several candidate sellers). **Agile:** sellers can extend the team under a shared-risk model. A **master services agreement (MSA)** can govern the overall relationship, with the adaptive work placed in an appendix that can change without renegotiating the whole contract.

## 12.1 Plan Procurement Management

This process decides **whether** to buy, **what**, **how** and **when**, and identifies potential sellers.

### Typical procurement steps

1. Prepare the procurement statement of work (SOW) or terms of reference (TOR).
2. Prepare a high-level cost estimate.
3. Advertise the opportunity.
4. Short-list qualified sellers.
5. Issue the bid documents.
6. Sellers prepare and submit proposals.
7. Evaluate the proposals technically, including quality.
8. Evaluate them on cost.
9. Make the final combined evaluation and select the winner.
10. Finalise negotiations and sign the contract.

### Contract types

| Family | Type | When and how |
|---|---|---|
| **Fixed-price** (well-defined scope) | **Firm fixed price (FFP)** | The most common; the price is fixed and changes only if scope changes. The seller carries the most cost risk |
| | **Fixed price incentive fee (FPIF)** | Fixed price plus incentives for cost, schedule or technical performance; a **price ceiling** caps it, and the seller pays all costs above the ceiling |
| | **Fixed price with economic price adjustment (FPEPA)** | For multi-year contracts or foreign currency; adjusts for inflation or commodity prices |
| **Cost-reimbursable** (scope likely to change) | **Cost plus fixed fee (CPFF)** | The seller is paid its costs plus a fixed fee (a percentage of the *initial estimated* costs) |
| | **Cost plus incentive fee (CPIF)** | The seller is paid its costs plus an incentive fee; overruns and underruns are **shared** by an agreed formula, such as 80/20 |
| | **Cost plus award fee (CPAF)** | The seller is paid its costs plus an award fee judged **subjectively by the buyer**, usually not open to appeal. The buyer carries the most cost risk |
| **Hybrid** | **Time and material (T&M)** | A rate per hour plus materials; used for staff augmentation, experts, or when a precise SOW cannot be written quickly |

> **Remember:** As you move from FFP towards cost-plus, cost risk moves from the **seller** to the **buyer**.

### Tools

- **Market research**: conferences, online reviews and other sources on industry and seller capabilities.
- **Make-or-buy analysis**: considers in-house skills and capacity, the need for specialist or independent expertise, risk, and financial measures (payback, ROI, IRR, NPV).
- **Source selection analysis**: the method is published in the bid documents.

| Method | Use when |
|---|---|
| Least cost | The work is standard, routine and well defined |
| Qualifications only | The procurement is small; choose from a short list on credentials and references |
| Quality-based (highest technical score) | Negotiate with the best technical proposal, if its price is acceptable |
| Quality and cost-based | Both count, with quality weighted more heavily when risk is high |
| Sole source | Only one seller is asked; acceptable only when justified |
| Fixed budget | The budget is disclosed; choose the best technical proposal within it. Use only when the SOW is precise and no changes are expected |

### Outputs

- **Procurement management plan**: the timetable, metrics, roles and authority, constraints, legal jurisdiction and currency, independent estimates, risk issues (bonds, insurance) and prequalified sellers.
- **Procurement strategy**: the delivery method (such as turnkey, design-build or BOOT), the contract payment type, and the procurement phases.
- **Bid documents**: an **RFI** asks sellers for information about their capabilities; an **RFQ** asks how they would meet the requirements and/or what it would cost (price-focused); an **RFP** is the most formal and is used when the solution is not easy to define.
- **Procurement statement of work**: describes **only the part of the scope** in that contract, clearly, completely and concisely, including collateral services such as reporting or post-project support. For services, **terms of reference (TOR)** are often used instead.
- **Source selection criteria**: capability, cost, delivery dates, technical approach, experience, key staff, financial stability and so on, usually weighted.
- **Make-or-buy decisions**.
- **Independent cost estimates**: a benchmark. If the proposals differ greatly from it, the SOW may be ambiguous or the sellers may have misunderstood it.
- Change requests, plus updates to documents (such as the risk register) and to OPAs (information on qualified sellers).`,
      keyTerms: [
        { term: 'Firm fixed price', def: 'A contract where the price is set at the outset and not subject to change unless scope changes.' },
        { term: 'Cost plus incentive fee', def: 'A cost-reimbursable contract where the seller earns an incentive fee, with overruns and underruns shared by formula.' },
        { term: 'Time and material contract', def: 'A hybrid contract type paying a rate for time plus materials; often for staff augmentation.' },
        { term: 'Procurement statement of work', def: 'Describes the procurement item in enough detail for prospective sellers to determine whether they can provide it.' },
        { term: 'Make-or-buy analysis', def: 'Gathering and organising data on requirements and evaluating whether to produce in-house or purchase.' },
      ],
    },
    {
      id: 'm12-l2',
      title: '12.2 Conduct Procurements',
      minutes: 25,
      topics: ['p-12.2-conduct-procurements'],
      objectives: [
        'Explain the purpose of bidder conferences and advertising',
        'Describe proposal evaluation and negotiation',
        'List typical contract components',
      ],
      body: `## Purpose

Conduct Procurements **obtains seller responses, selects a seller and awards a contract**. The result is signed agreements.

**Key inputs:**

- the procurement management plan and other plans;
- the cost baseline;
- **procurement documentation**: bid documents, the SOW, independent cost estimates and source selection criteria;
- **seller proposals**. Good practice is to keep the price proposal separate from the technical proposal.

## Tools

- **Advertising**: widens the pool of sellers. Many government bodies must advertise publicly.
- **Bidder conferences** (also called contractor, vendor or pre-bid conferences): the buyer meets all prospective sellers **before** proposals are submitted, so everyone has the same clear understanding and **no one gets preferential treatment**.
- **Proposal evaluation**: checks each proposal is complete and responsive to the bid documents, SOW and criteria.
- **Negotiation**: clarifies the structure, rights, obligations and terms before signing. It is led by someone with signing authority, usually from procurement. The PM and team may help.

## Outputs

- **Selected sellers**: high-value or high-risk awards often need senior management approval.
- **Agreements**: a contract is a mutually binding agreement that obliges the seller to deliver and the buyer to pay, and it can be enforced in court. Typical components:
  - the SOW or main deliverables;
  - the schedule and milestones;
  - performance reporting;
  - pricing and payment terms;
  - inspection, quality and acceptance criteria;
  - warranty and future support;
  - incentives and penalties;
  - insurance and performance bonds;
  - approval of subcontractors;
  - general terms and conditions;
  - how change requests are handled;
  - termination and **alternative dispute resolution**.
- Change requests, plan updates, and document and OPA updates (seller lists, experience with sellers).

**Where agreements go:** to Develop Project Charter, Monitor and Control Project Work, Close Project or Phase, Develop Schedule, Determine Budget, Control Resources, **Control Procurements**, Identify Stakeholders and Plan Stakeholder Engagement.

> **Source note:** The data flow diagram for Conduct Procurements (Figure 12-5) does not list Collect Requirements or Identify Risks as receiving agreements, but those processes' own diagrams show agreements arriving from 12.2. Treat agreements as an input to both.

> **Exam tip:** A prospective bidder phones the PM privately with a question during the bid period. To keep the process fair, the answer should be shared with **all** bidders, for example as an addendum or at the bidder conference.`,
      keyTerms: [
        { term: 'Bidder conference', def: 'A meeting with prospective sellers before proposal submission to ensure a common understanding of the procurement.' },
        { term: 'Agreement / contract', def: 'A mutually binding agreement obligating the seller to provide specified products or services and the buyer to pay for them.' },
        { term: 'Seller proposal', def: 'A formal response to a request for proposal or other procurement document.' },
      ],
    },
    {
      id: 'm12-l3',
      title: '12.3 Control Procurements',
      minutes: 30,
      topics: ['p-12.3-control-procurements'],
      objectives: [
        'Describe contract administration activities and why payments should follow progress',
        'Explain claims administration and alternative dispute resolution',
        'Describe how a procurement is closed',
      ],
      body: `## Purpose

Control Procurements manages procurement relationships, monitors contract performance, makes changes and corrections, and **closes out contracts**. Both buyer and seller administer the contract to meet their obligations and protect their rights. Many organisations treat contract administration as a separate function; the procurement administrator may work with the team but report elsewhere.

### Key activities

- Keep detailed records of physical and financial performance, using measurable indicators.
- Monitor **payments** so they match the **work actually accomplished**. Contracts that tie payment to outputs and deliverables control spending better than those that pay for inputs such as labour hours.
- Manage communication between multiple sellers.
- Amend the contract when needed, **by mutual consent and in writing**, under its change control terms.

**Key inputs:** agreements, procurement documentation, **approved change requests** (procurement changes must be documented in writing and approved before they are implemented), work performance data (seller progress, costs and invoices), and quality reports (seller non-compliance).

## Tools

- **Claims administration**: a **claim** is a contested change, or a potential **constructive change**, where buyer and seller cannot agree whether a change happened or what it should cost. Unresolved claims become disputes and then appeals. Claims are handled under the contract's terms. **Negotiation is the preferred method of settlement**; if that fails, use **alternative dispute resolution (ADR)**, such as mediation or arbitration.
- **Performance reviews**, **earned value analysis** (SV, CV, SPI, CPI) and **trend analysis** (forecasting the EAC).
- **Inspection**: a structured review of the contractor's work, such as reviews of deliverables or physical walkthroughs of the site.
- **Audits**: a structured review of the procurement process, as allowed by the contract.

## Outputs

- **Closed procurements**: the buyer, usually through its authorised procurement administrator, gives the seller **formal written notice** that the contract is complete. Typical conditions: all deliverables delivered on time and accepted, no outstanding claims or invoices, and final payments made.
- **Work performance information**, **procurement documentation updates**, **change requests** (including unresolved requested changes, which could become claims), and plan updates (including cascading effects when one seller's delay affects others).
- **OPA updates**: payment records, **seller performance evaluations** (which affect eligibility for future work), updates to the prequalified seller list, lessons learned, and the complete indexed **procurement file**.

> **Exam tip:** A seller says the buyer's site engineer verbally told them to do extra work and they want to be paid. That is a potential **constructive change** and a claim. Document it and handle it through the contract's change and claims procedures. Do not pay without approval, and do not refuse without assessment.`,
      keyTerms: [
        { term: 'Claim', def: 'A request, demand or assertion of rights by a seller against a buyer, or vice versa, under a contract.' },
        { term: 'Constructive change', def: 'A change one party considers to have been directed or caused by the other, though not formally agreed.' },
        { term: 'Alternative dispute resolution', def: 'Methods such as mediation or arbitration used when claims cannot be settled by negotiation.' },
        { term: 'Closed procurement', def: 'Formal written notice from the buyer that the contract has been completed.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm12-q1',
      stem: 'Which statement about contracts is correct according to the Guide?',
      options: ['Verbal promises are enforceable if the PM remembers them', 'Anything not included in the contract cannot be legally enforced', 'The PM always signs contracts', 'Contracts are internal documents without legal effect'],
      answer: 1,
      explanation: 'A contract creates a legal relationship. Requirements not included in it cannot be legally enforced, and the PM is typically not authorised to sign.',
      topic: 'p-procurement-overview',
      ref: 'PMBOK 6 §12 Key Concepts',
    },
    {
      id: 'm12-q2',
      stem: 'The scope is precisely defined and unlikely to change. Which contract type places the most cost risk on the seller?',
      options: ['Cost plus award fee', 'Time and material', 'Firm fixed price', 'Cost plus fixed fee'],
      answer: 2,
      explanation: 'Under firm fixed price the price is set at the outset; the seller bears cost overruns. It suits well-defined scope.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.1.6',
    },
    {
      id: 'm12-q3',
      stem: 'Research work has unclear scope expected to change significantly. Which contract family is most appropriate?',
      options: ['Fixed-price', 'Cost-reimbursable', 'Fixed budget', 'Sole source'],
      answer: 1,
      explanation: 'Cost-reimbursable contracts suit work where scope is expected to change significantly; the seller is reimbursed actual costs plus a fee.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.1.6',
    },
    {
      id: 'm12-q4',
      stem: 'A contract reimburses the seller\'s costs, and the fee depends largely on the buyer\'s subjective evaluation of performance, which cannot normally be appealed. What type is it?',
      options: ['CPFF', 'CPIF', 'CPAF', 'FPIF'],
      answer: 2,
      explanation: 'In cost plus award fee, most of the fee is earned against broad subjective criteria judged solely by the buyer, and the decision is generally not subject to appeal.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.1.6',
    },
    {
      id: 'm12-q5',
      stem: 'The project needs two specialist consultants immediately, but there is no time to write a detailed SOW. Which contract type fits best?',
      options: ['Firm fixed price', 'Time and material', 'Fixed price with economic price adjustment', 'Cost plus incentive fee'],
      answer: 1,
      explanation: 'T&M contracts are used for staff augmentation, experts or outside support when a precise statement of work cannot be quickly prescribed.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.1.6',
    },
    {
      id: 'm12-q6',
      stem: 'The buyer needs more information about what the market can offer before deciding how to proceed. Which document should it issue first?',
      options: ['Request for proposal', 'Request for information', 'Purchase order', 'Notice of award'],
      answer: 1,
      explanation: 'An RFI gathers information about goods and services from sellers, typically followed by an RFQ or RFP.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.3.3',
    },
    {
      id: 'm12-q7',
      stem: 'All proposals come in 40% above the buyer\'s independent cost estimate. What is the most likely explanation to investigate?',
      options: ['The sellers are colluding', 'The statement of work may be deficient or ambiguous, or sellers misunderstood it', 'The independent estimate should be discarded', 'The contract type is wrong'],
      answer: 1,
      explanation: 'Significant differences between independent estimates and proposals can indicate a deficient or ambiguous SOW, or that sellers misunderstood or failed to respond fully.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.3.8',
    },
    {
      id: 'm12-q8',
      stem: 'Which source selection method is appropriate only when the SOW is precise, no changes are expected and the budget cannot be exceeded?',
      options: ['Least cost', 'Qualifications only', 'Fixed budget', 'Sole source'],
      answer: 2,
      explanation: 'The fixed budget method discloses the budget in the RFP and selects the best technical proposal within it; it requires a precise SOW and no anticipated changes.',
      topic: 'p-12.1-plan-procurement',
      ref: 'PMBOK 6 §12.1.2.4',
    },
    {
      id: 'm12-q9',
      stem: 'What is the main purpose of a bidder conference?',
      options: ['To negotiate the final price with the preferred seller', 'To ensure all prospective sellers have a clear, common understanding and none receives preferential treatment', 'To select the winning seller', 'To close the contract'],
      answer: 1,
      explanation: 'Bidder conferences are held before proposals are submitted so all prospective sellers share the same understanding and no bidder is favoured.',
      topic: 'p-12.2-conduct-procurements',
      ref: 'PMBOK 6 §12.2.2.3',
    },
    {
      id: 'm12-q10',
      stem: 'Which is a key output of Conduct Procurements?',
      options: ['Procurement statement of work', 'Agreements', 'Closed procurements', 'Make-or-buy decisions'],
      answer: 1,
      explanation: 'Conduct Procurements produces selected sellers and agreements. SOW and make-or-buy decisions come from planning; closed procurements from Control Procurements.',
      topic: 'p-12.2-conduct-procurements',
      ref: 'PMBOK 6 §12.2.3',
    },
    {
      id: 'm12-q11',
      stem: 'Why should seller payments be linked to deliverables rather than hours worked?',
      options: ['It is required by law', 'Payments that closely match work accomplished give better control', 'It eliminates the need for inspection', 'It makes the contract cost-reimbursable'],
      answer: 1,
      explanation: 'The Guide notes payments should be closely related to work accomplished; tying them to outputs rather than inputs such as labour hours gives better controls.',
      topic: 'p-12.3-control-procurements',
      ref: 'PMBOK 6 §12.3',
    },
    {
      id: 'm12-q12',
      stem: 'Buyer and seller cannot agree whether additional work was a change to the contract. What is the preferred way to resolve this?',
      options: ['Immediate litigation', 'Negotiation, followed by alternative dispute resolution if needed', 'Terminate the contract', 'The PM decides unilaterally'],
      answer: 1,
      explanation: 'Contested changes are claims, handled through claims administration. Negotiation is preferred, then ADR as defined in the contract.',
      topic: 'p-12.3-control-procurements',
      ref: 'PMBOK 6 §12.3.2.2',
    },
    {
      id: 'm12-q13',
      stem: 'How is a procurement formally closed?',
      options: ['The seller sends a final invoice', 'The buyer, usually through its authorised procurement administrator, provides formal written notice that the contract is complete', 'The PM sends an email to the team', 'The contract expires automatically'],
      answer: 1,
      explanation: 'The buyer gives the seller formal written notice of completion, typically after deliverables are accepted, claims settled and final payments made.',
      topic: 'p-12.3-control-procurements',
      ref: 'PMBOK 6 §12.3.3.1',
    },
  ],
};
