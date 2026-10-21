import type { Module } from '../types.ts';

export const M10: Module = {
  id: 'M10',
  number: '10',
  title: 'Project Communications Management',
  summary: 'Communication dimensions, models and methods; planning communications; managing information flow; and monitoring whether stakeholders\' information needs are met.',
  lessons: [
    {
      id: 'm10-l1',
      title: 'Communication concepts and 10.1 Plan Communications Management',
      minutes: 35,
      topics: ['m-communications-intro', 'm-communications-overview', 'm-10.1-plan-communications'],
      objectives: [
        'Describe the dimensions of project communication and the 5Cs of written communication',
        'Compare push, pull and interactive communication methods',
        'Explain the sender-receiver and cross-cultural communication models',
        'List the contents of the communications management plan',
      ],
      body: `## What communications management covers

Communications management has **two parts**: developing a communication **strategy** that works for stakeholders, and carrying out the **activities** that implement it.

| Process | Group | In one sentence |
|---|---|---|
| 10.1 Plan Communications Management | Planning | Plan communication around each stakeholder's information needs |
| 10.2 Manage Communications | Executing | Collect, create, distribute, store, retrieve, manage and dispose of project information |
| 10.3 Monitor Communications | Monitoring and Controlling | Check that the information needs of the project and its stakeholders are met |

## Dimensions of communication

- **Internal** (inside the project or organisation) or **external** (customers, vendors, the public, regulators).
- **Formal** (reports, formal meetings, briefings) or **informal** (emails, social media, ad hoc conversations).
- **Hierarchical focus**: **upward** to senior management, **downward** to the team, **horizontal** to peers.
- **Official** (annual reports, reports to regulators) or **unofficial** (building relationships and the project's profile).
- **Written** or **oral**; **verbal** (words and tone) or **non-verbal** (body language).

### The 5Cs of written communication

1. **Correct** grammar and spelling.
2. **Concise** expression, without excess words.
3. **Clear** purpose, aimed at the reader's needs.
4. **Coherent**, logical flow of ideas.
5. **Controlling** the flow of words and ideas, for example with graphics and summaries.

**Trends:** including stakeholders in project reviews and meetings (such as short daily standups); social computing; multifaceted approaches that respect cultural, generational and personal preferences. **Agile** needs more frequent, faster communication: easy access to information, frequent checkpoints, colocation, and artefacts posted openly.

## 10.1 Plan Communications Management

This process develops the communication approach early, alongside stakeholder identification and planning. It is reviewed whenever the stakeholder community changes, and at the start of each phase.

### Communication requirements analysis

This works out each stakeholder's information needs: what type and format of information, and how valuable it is. The number of people involved matters, because every person you add multiplies the number of possible communication channels.

> **Supplementary formula:** Exam preparation commonly uses **channels = n(n − 1) / 2**, where n is the number of people. Ten people have 45 channels; adding one more person makes 55. The *PMBOK Guide* Sixth Edition does not state this formula, but it does list the number of channels among the factors to analyse.

### Communication technology

Choosing the technology depends on how **urgent** the need for information is, how **available and reliable** the technology is, how **easy** it is to use, the project **environment** (face-to-face or virtual, time zones, languages), and how **sensitive or confidential** the information is.

### Communication models

- **Basic sender-receiver**: the sender **encodes** a message and transmits it through a **medium**, where **noise** can interfere, and the receiver **decodes** it. This model ensures delivery, not understanding.
- **Interactive**: adds **acknowledgement** (confirming receipt, which does *not* mean agreement or understanding) and **feedback** (a response). The sender is responsible for making the message clear and complete; the receiver for receiving it fully, interpreting it correctly and acknowledging it.
- **Cross-cultural**: the sender's and receiver's culture, emotional state, personality and biases affect encoding and decoding. This model is most useful for person-to-person or small-group communication.

### Communication methods

| Method | How it works | Examples |
|---|---|---|
| **Interactive** | Real-time, two-way or multi-way | Meetings, phone calls, instant messaging, video conferences |
| **Push** | Sent to specific recipients; ensures distribution, **not** that it was received or understood | Emails, memos, reports, letters, voicemail, press releases |
| **Pull** | Placed somewhere for people to access when they choose; good for large audiences or large volumes | Intranet sites, web portals, e-learning, knowledge repositories |

**Interpersonal skills:** communication styles assessment, **political awareness** (formal and informal power relationships) and **cultural awareness**. A **stakeholder engagement assessment matrix** shows where extra communication is needed.

### Output: communications management plan

The plan covers:

- stakeholder communication requirements;
- what information is communicated (language, format, content, level of detail), and why;
- the time frame and frequency, and whether acknowledgement is needed;
- who is responsible for communicating, and **who authorises the release of confidential information**;
- the recipients;
- the methods and technologies;
- the resources allocated, including time and budget;
- **escalation processes**;
- how the plan will be updated;
- a glossary of terms;
- information flow charts, workflows and meeting plans;
- constraints from law, technology or policy.`,
      keyTerms: [
        { term: 'Push communication', def: 'Information sent to specific recipients; ensures distribution but not understanding.' },
        { term: 'Pull communication', def: 'Information placed for recipients to access at their discretion; suited to large audiences or volumes.' },
        { term: 'Noise', def: 'Anything that interferes with the transmission and understanding of a message.' },
        { term: 'Communications management plan', def: 'Describes how, when and by whom information about the project will be administered and disseminated.' },
      ],
    },
    {
      id: 'm10-l2',
      title: '10.2 Manage Communications and 10.3 Monitor Communications',
      minutes: 30,
      topics: ['m-10.2-manage-communications', 'm-10.2-manage-communications-tools', 'm-10.3-monitor-communications'],
      objectives: [
        'Describe what Manage Communications produces beyond distribution',
        'Apply active listening, meeting management and presentation skills',
        'Explain how Monitor Communications checks effectiveness and triggers changes',
      ],
      body: `## 10.2 Manage Communications

Manage Communications makes sure project information is collected, created, distributed, stored, retrieved, managed, monitored and finally disposed of in a timely and appropriate way. It goes **beyond distribution**: information must be properly generated and formatted, actually received, and open to questions, clarification and discussion.

**Key inputs:**

- The communications, resource and stakeholder engagement plans.
- **Work performance reports** from Monitor and Control Project Work. They are distributed through this process.
- The change log (so changes that were approved, deferred or rejected are communicated), the issue log, quality reports, the risk report and the stakeholder register.

### Techniques and skills

- **Communication competence**: clear key messages, effective relationships and leadership behaviour.
- **Feedback**, **non-verbal communication** and **presentations** tailored to the audience.
- **Active listening**: acknowledge, clarify and confirm, understand, and remove barriers.
- **Writing style**: active voice, clear sentence structure, careful word choice.
- **Meeting management**: prepare and send an agenda with objectives; start and finish on time; invite the right people; stay on topic; record actions and owners.
- **Facilitation**, **conflict management**, **networking** and **political and cultural awareness**.
- **PMIS**: project management software, portals and dashboards, email and conferencing, social media.
- **Project reporting**: giving each stakeholder group the right level of detail, regularly or by exception. This process produces ad hoc reports, presentations and blogs; the regular work performance reports come from 4.5.

**Outputs:** **project communications** (performance reports, deliverable status, schedule progress, costs, presentations), plan updates, document updates, and OPA updates (project records such as correspondence and minutes).

## 10.3 Monitor Communications

Monitor Communications checks that the information needs of the project and its stakeholders are being met: the **right message**, with the right content, to the **right audience**, through the **right channel**, at the **right time**.

**Ways to assess effectiveness:** customer satisfaction surveys, lessons learned, observation of the team, issue log data, and changes in the stakeholder engagement assessment matrix.

**Inputs:** the plans, the issue log, lessons learned, **project communications** (what was actually distributed) and work performance data (the types and quantities of communication sent).

**Tools:** expert judgment, PMIS, the **stakeholder engagement assessment matrix**, observation and conversation, and meetings.

**Outputs:** work performance information (communications performed compared with planned, plus feedback such as survey results); **change requests** (for example, changing the content, format or method for a stakeholder, or removing a bottleneck); and updates.

Monitoring often sends the team back to Plan Communications Management or Manage Communications. The processes repeat continuously, so an issue, a KPI, a risk or a conflict may trigger an immediate revision.

> **Exam tip:** A stakeholder complains they "never hear anything", yet the reports are being emailed weekly. The push method ensures distribution, not understanding or use. Check the stakeholder's needs, adjust the method or format (for example, a short briefing or a dashboard), and update the communications management plan.`,
      keyTerms: [
        { term: 'Active listening', def: 'Acknowledging, clarifying and confirming, understanding, and removing barriers that reduce comprehension.' },
        { term: 'Project communications', def: 'Artefacts produced and distributed in Manage Communications, such as performance reports and presentations.' },
        { term: 'Monitor Communications', def: 'Ensuring the information needs of the project and its stakeholders are met.' },
      ],
    },
  ],
  quiz: [
    {
      id: 'm10-q1',
      stem: 'A project manager prepares a briefing for the steering committee. What hierarchical direction of communication is this?',
      options: ['Downward', 'Horizontal', 'Upward', 'External'],
      answer: 2,
      explanation: 'Communication with senior management is upward. Downward is to the team; horizontal is to peers.',
      topic: 'm-communications-overview',
      ref: 'PMBOK 6 §10 Key Concepts',
    },
    {
      id: 'm10-q2',
      stem: 'Which item is one of the 5Cs of written communication described in the Guide?',
      options: ['Confidential', 'Concise', 'Compelling', 'Comprehensive'],
      answer: 1,
      explanation: 'The 5Cs are correct grammar and spelling, concise expression, clear purpose, coherent logical flow, and controlling the flow of words and ideas.',
      topic: 'm-communications-overview',
      ref: 'PMBOK 6 §10 Key Concepts',
    },
    {
      id: 'm10-q3',
      stem: 'A team grows from 6 to 9 people. Using the common n(n−1)/2 formula, how many communication channels are added?',
      options: ['3', '15', '21', '36'],
      answer: 2,
      explanation: '6 people: 6×5/2 = 15 channels. 9 people: 9×8/2 = 36 channels. Increase = 21. (The formula is a common supplementary calculation, not stated in the Sixth Edition.)',
      topic: 'm-10.1-plan-communications',
      ref: 'PMBOK 6 §10.1.2.2 (channels as a factor)',
    },
    {
      id: 'm10-q4',
      stem: 'The company publishes lessons learned on an intranet portal where staff can read them when they choose. Which method is this?',
      options: ['Push', 'Pull', 'Interactive', 'Formal verbal'],
      answer: 1,
      explanation: 'Pull communication places information where recipients access it at their discretion; it suits large volumes or audiences.',
      topic: 'm-10.1-plan-communications',
      ref: 'PMBOK 6 §10.1.2.5',
    },
    {
      id: 'm10-q5',
      stem: 'In the interactive communication model, what does acknowledgement mean?',
      options: ['The receiver agrees with the message', 'The receiver understood the message fully', 'The receiver confirms receipt, not necessarily agreement or understanding', 'The sender re-sends the message'],
      answer: 2,
      explanation: 'Acknowledgement signals receipt of the message. It does not necessarily mean agreement with or comprehension of it.',
      topic: 'm-10.1-plan-communications',
      ref: 'PMBOK 6 §10.1.2.4',
    },
    {
      id: 'm10-q6',
      stem: 'Which item is typically in the communications management plan?',
      options: ['The person responsible for authorising release of confidential information', 'The detailed WBS', 'The risk register', 'The procurement statement of work'],
      answer: 0,
      explanation: 'The plan includes who communicates, who authorises release of confidential information, recipients, methods, frequency, escalation processes and more.',
      topic: 'm-10.1-plan-communications',
      ref: 'PMBOK 6 §10.1.3.1',
    },
    {
      id: 'm10-q7',
      stem: 'A message is misunderstood because the sender and receiver come from different professional backgrounds and generations. Which model best explains this?',
      options: ['Basic sender-receiver model', 'Cross-cultural communication model', 'Push communication model', 'RACI model'],
      answer: 1,
      explanation: 'The cross-cultural model highlights how culture (including generation and professional discipline), emotional state, personality and biases affect encoding and decoding.',
      topic: 'm-10.1-plan-communications',
      ref: 'PMBOK 6 §10.1.2.4, Figure 10-4',
    },
    {
      id: 'm10-q8',
      stem: 'Where are work performance reports distributed to stakeholders?',
      options: ['Monitor and Control Project Work', 'Manage Communications', 'Monitor Communications', 'Plan Communications Management'],
      answer: 1,
      explanation: 'Work performance reports are produced in Monitor and Control Project Work and circulated to stakeholders through Manage Communications.',
      topic: 'm-10.2-manage-communications',
      ref: 'PMBOK 6 §10.2.1.3',
    },
    {
      id: 'm10-q9',
      stem: 'During a tense meeting, the PM restates a stakeholder\'s concern and asks a question to confirm understanding. Which skill is this?',
      options: ['Political awareness', 'Active listening', 'Networking', 'Push communication'],
      answer: 1,
      explanation: 'Active listening involves acknowledging, clarifying and confirming, understanding, and removing barriers to comprehension.',
      topic: 'm-10.2-manage-communications-tools',
      ref: 'PMBOK 6 §10.2.2.6',
    },
    {
      id: 'm10-q10',
      stem: 'Which is the main purpose of Monitor Communications?',
      options: ['Distribute reports on schedule', 'Ensure the information needs of the project and its stakeholders are met', 'Approve changes to the communications plan', 'Create the stakeholder register'],
      answer: 1,
      explanation: 'Monitor Communications ensures information needs are met, with optimal information flow as defined in the communications and stakeholder engagement plans.',
      topic: 'm-10.3-monitor-communications',
      ref: 'PMBOK 6 §10.3',
    },
    {
      id: 'm10-q11',
      stem: 'Weekly status emails are sent to a key stakeholder, who says they are never informed. What should the PM do?',
      options: ['Continue sending emails because distribution is documented', 'Assess the stakeholder\'s needs and adjust the method or format, updating the communications plan', 'Escalate the complaint to the sponsor', 'Copy more people on the emails'],
      answer: 1,
      explanation: 'Push communication ensures distribution, not understanding. Monitoring shows the need is not met, so the method or format should be adjusted through the plan.',
      topic: 'm-10.3-monitor-communications',
      ref: 'PMBOK 6 §10.3',
    },
    {
      id: 'm10-q12',
      stem: 'Which tool in Monitor Communications shows whether stakeholders have moved from their current to their desired engagement levels?',
      options: ['Stakeholder engagement assessment matrix', 'Responsibility assignment matrix', 'Probability and impact matrix', 'Requirements traceability matrix'],
      answer: 0,
      explanation: 'Changes in the stakeholder engagement assessment matrix (current versus desired engagement) indicate how effective communications have been.',
      topic: 'm-10.3-monitor-communications',
      ref: 'PMBOK 6 §10.3.2.3',
    },
  ],
};
