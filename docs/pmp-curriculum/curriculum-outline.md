# PMP course curriculum outline

Generated 2026-10-21 by `scripts/pmp-write-reports.ts` from the course content in `server/pmp/content/` and the source artifacts in this folder. Figures are computed, not typed.

## At a glance

| Item | Value |
|---|---|
| Modules | 18 |
| Lessons | 69 |
| Estimated study time (lessons only) | 32.4 h (1945 minutes) |
| Module knowledge checks | 18 (230 questions) |
| Mock tests | Mock Test 1: 100 questions, 120 min; Mock Test 2: 100 questions, 120 min |
| Final assessment | 81 questions, 110 min |
| Pass mark (all assessments) | 80% |
| Source topics taught | 160 of 160 |
| PMBOK processes taught | 49 of 49 |

## Sequence and unlock rules

1. Module 0 is open on sign-up. Lessons open one at a time, in order.
2. A module's knowledge check opens when all of its lessons are complete.
3. Scoring at least 80% on a knowledge check opens the next module (retakes are unlimited).
4. Mock Test 1 opens when every knowledge check is passed; Mock Test 2 opens when Mock Test 1 is submitted (any score).
5. The final assessment opens when Mock Test 2 is submitted. A failed final can be retaken after 24 hours.
6. Passing the final (80%+) makes the learner eligible for the course certificate.

All of these rules are enforced by the server (`server/pmp/engine.ts` and `server/pmp/router.ts`), not only in the interface. The design has no lesson-level quizzes; each module ends with one knowledge check.

## Modules

### Module 0: Orientation

How the course works, what the source books are, and how to study for a scenario-based exam.

Study time 0.4 h · 2 lessons · knowledge check 8 questions.

**How this course works** (10 min, `m00-l1`)

- Explain how lessons, knowledge checks, mock tests and the final assessment unlock in sequence
- Describe what the course certificate does and does not represent
- Plan a realistic weekly study rhythm

Source topics: `src-publication-structure`

Sources: PMBOK Guide 6th ed. Front matter; Table of Contents, pp. 539, 637 (PDF 6-34, 36, 576, 674 …)

**The source books and how they fit together** (15 min, `m00-l2`)

- Describe the three parts of the PMBOK Guide Sixth Edition
- Distinguish the Guide (Part 1) from the Standard (Part 2)
- Explain how the Agile Practice Guide relates to the PMBOK Guide

Source topics: `src-publication-structure`, `src-references-part1`

Sources: PMBOK Guide 6th ed. Front matter; Table of Contents, pp. 539, 637 (PDF 6-34, 36, 576, 674 …); PMBOK Guide 6th ed. References, pp. 537 (PDF 574)

### Module 1: Project management foundations

What a project is, how projects relate to programs, portfolios and operations, life cycles, processes and Knowledge Areas, and how success is judged.

Study time 2.1 h · 5 lessons · knowledge check 15 questions.

**Projects, value and why project management matters** (25 min, `m01-l1`)

- Define a project and test whether a piece of work qualifies
- List the conditions under which a project ends
- Explain how projects create business value by moving an organisation to a future state
- Classify the factors that lead organisations to start projects

Source topics: `f-guide-purpose`, `f-project-definition`, `f-projects-drive-change`, `f-initiation-context`, `f-business-value`, `f-importance-of-pm`

Sources: PMBOK Guide 6th ed. 1.1, 1.1.1, pp. 1-3 (PDF 38-40); PMBOK Guide 6th ed. 1.2.1, pp. 4-5 (PDF 41-42); PMBOK Guide 6th ed. 1.2.1, pp. 6 (PDF 43); PMBOK Guide 6th ed. 1.2.1, pp. 7-9 (PDF 44-46); PMBOK Guide 6th ed. 1.2.1, pp. 7 (PDF 44); PMBOK Guide 6th ed. 1.2.2, pp. 10-11 (PDF 47-48)

**Portfolios, programs, projects and operations** (25 min, `m01-l2`)

- Distinguish projects, programs, portfolios and operations
- Explain the "doing things right" versus "doing the right things" distinction
- Describe where projects and operations intersect
- Explain organisational project management (OPM)

Source topics: `f-portfolio-program-project`, `f-program-management`, `f-portfolio-management`, `f-operations-and-projects`, `f-opm`

Sources: PMBOK Guide 6th ed. 1.2.3.1, pp. 11-13 (PDF 48-50); PMBOK Guide 6th ed. 1.2.3.2, pp. 14 (PDF 51); PMBOK Guide 6th ed. 1.2.3.3, pp. 15 (PDF 52); PMBOK Guide 6th ed. 1.2.3.4-1.2.3.5, pp. 16 (PDF 53); PMBOK Guide 6th ed. 1.2.3.6, pp. 16-17 (PDF 53-54)

**Life cycles, phases and phase gates** (20 min, `m01-l3`)

- Distinguish project life cycle, development life cycle and product life cycle
- Compare predictive, iterative, incremental, adaptive and hybrid development approaches
- Describe phase attributes and the possible decisions at a phase gate

Source topics: `f-life-cycles`, `f-phases-and-gates`

Sources: PMBOK Guide 6th ed. 1.2.4.1, pp. 19 (PDF 56); PMBOK Guide 6th ed. 1.2.4.2-1.2.4.3, pp. 20-21 (PDF 57-58)

**Processes, Process Groups and Knowledge Areas** (30 min, `m01-l4`)

- Explain inputs, tools and techniques, and outputs (ITTOs)
- Name the five Process Groups and their purposes
- Name the ten Knowledge Areas
- Trace work performance data to information to reports
- Explain why and how the PM tailors

Source topics: `f-key-components`, `f-pm-processes`, `f-process-groups`, `f-knowledge-areas`, `f-data-information-reports`, `f-tailoring`

Sources: PMBOK Guide 6th ed. 1.2.4, pp. 17-18 (PDF 54-55); PMBOK Guide 6th ed. 1.2.4.4, pp. 22 (PDF 59); PMBOK Guide 6th ed. 1.2.4.5, pp. 23 (PDF 60); PMBOK Guide 6th ed. 1.2.4.6, pp. 23-24 (PDF 60-61); PMBOK Guide 6th ed. 1.2.4.7, pp. 26-27 (PDF 63-64); PMBOK Guide 6th ed. 1.2.5, pp. 28 (PDF 65)

**Business documents, the charter and measuring success** (25 min, `m01-l5`)

- Describe the contents and owners of the business case and benefits management plan
- Place the needs assessment, business case, charter and plans on a project timeline
- Identify financial and non-financial measures of project success

Source topics: `f-business-documents`, `f-charter-and-plan-defs`, `f-success-measures`

Sources: PMBOK Guide 6th ed. 1.2.6, 1.2.6.1, 1.2.6.2, pp. 29-33 (PDF 66-70); PMBOK Guide 6th ed. 1.2.6.3, pp. 34 (PDF 71); PMBOK Guide 6th ed. 1.2.6.4, pp. 34-35 (PDF 71-72)

### Module 2: The environment in which projects operate

Enterprise environmental factors, organisational process assets, governance, organisational structures and project management offices.

Study time 1.2 h · 3 lessons · knowledge check 12 questions.

**Enterprise environmental factors and organisational process assets** (25 min, `m02-l1`)

- Distinguish enterprise environmental factors (EEFs) from organisational process assets (OPAs)
- Classify examples as internal or external EEFs
- Distinguish the two categories of OPAs and say which ones a project updates

Source topics: `e-project-influences`, `e-eefs`, `e-opas`

Sources: PMBOK Guide 6th ed. 2.1, pp. 37 (PDF 74); PMBOK Guide 6th ed. 2.2, 2.2.1, 2.2.2, pp. 38-39 (PDF 75-76); PMBOK Guide 6th ed. 2.3, 2.3.1, 2.3.2, pp. 39-41 (PDF 76-78)

**Organisational systems, governance and structures** (30 min, `m02-l2`)

- Explain why organisations behave as systems and what that implies for projects
- Define organisational and project governance
- Compare organisational structures by project manager authority, role and budget control

Source topics: `e-organizational-systems`, `e-governance`, `e-management-elements`, `e-structure-types`

Sources: PMBOK Guide 6th ed. 2.4.1, pp. 42-43 (PDF 79-80); PMBOK Guide 6th ed. 2.4.2, pp. 43-44 (PDF 80-81); PMBOK Guide 6th ed. 2.4.3, pp. 44-45 (PDF 81-82); PMBOK Guide 6th ed. 2.4.4.1, 2.4.4.2, pp. 45-47 (PDF 82-84)

**Project management offices** (15 min, `m02-l3`)

- Compare supportive, controlling and directive PMOs
- List the primary functions of a PMO

Source topics: `e-pmo`

Sources: PMBOK Guide 6th ed. 2.4.4.3, pp. 48-49 (PDF 85-86)

### Module 3: The role of the project manager

The project manager's sphere of influence, competences, leadership styles, power, ethics, and integration at process, cognitive and context levels.

Study time 1.6 h · 4 lessons · knowledge check 12 questions.

**Role, sphere of influence and professional ethics** (25 min, `m03-l1`)

- Define the project manager and distinguish the role from functional and operations managers
- Describe the PM's sphere of influence at project, organisation, industry and profession level
- Explain the four values of the PMI Code of Ethics and the difference between aspirational and mandatory standards

Source topics: `r-pm-role-overview`, `r-pm-definition-sphere`, `f-vocabulary-ethics`

Sources: PMBOK Guide 6th ed. 3.1, pp. 51-52 (PDF 88-89); PMBOK Guide 6th ed. 3.1-3.3, pp. 52-56 (PDF 89-93); PMBOK Guide 6th ed. 1.1.2, 1.1.3, pp. 3 (PDF 40)

**Competences: the PMI Talent Triangle** (20 min, `m03-l2`)

- Name the three skill sets in the PMI Talent Triangle
- Give examples of technical, leadership and strategic and business management skills

Source topics: `r-talent-triangle`

Sources: PMBOK Guide 6th ed. 3.4.1-3.4.3, pp. 56-60 (PDF 93-97)

**Leadership, management, styles and power** (30 min, `m03-l3`)

- Contrast leadership and management
- Recognise common leadership styles
- Identify forms of power a project manager can use

Source topics: `r-leadership-qualities`, `r-politics-power`, `r-leadership-vs-management`

Sources: PMBOK Guide 6th ed. 3.4.4-3.4.4.2, pp. 60-62 (PDF 97-99); PMBOK Guide 6th ed. 3.4.4.3, pp. 62-63 (PDF 99-100); PMBOK Guide 6th ed. 3.4.5, pp. 64-66 (PDF 101-103)

**Performing integration and navigating complexity** (20 min, `m03-l4`)

- Explain integration at the process, cognitive and context levels
- Identify the three dimensions of project complexity

Source topics: `r-performing-integration`

Sources: PMBOK Guide 6th ed. 3.5-3.5.4, pp. 66-68 (PDF 103-105)

### Module 4: Project Integration Management

The seven integration processes: chartering, planning, directing the work, managing knowledge, monitoring, controlling change and closing.

Study time 2.8 h · 6 lessons · knowledge check 15 questions.

**Integration overview and recurring techniques** (20 min, `m04-l1`)

- Name the seven integration processes and their Process Groups
- Explain why integration is the one responsibility the PM cannot delegate
- Describe recurring tools such as expert judgment, brainstorming, focus groups, facilitation and meeting management

Source topics: `i-integration-overview`, `i-key-concepts`, `i-common-tt`

Sources: PMBOK Guide 6th ed. 4 intro, pp. 69-71 (PDF 106-108); PMBOK Guide 6th ed. 4 key concepts, trends, tailoring, agile considerations, pp. 72-74 (PDF 109-111); PMBOK Guide 6th ed. 4.1.2, 4.2.2, pp. 79-80, 85-86 (PDF 116-117, 122-123)

**4.1 Develop Project Charter** (25 min, `m04-l2`)

- Explain who initiates a project and when the PM should be assigned
- List the contents of a project charter and the assumption log
- Distinguish a charter from a contract

Source topics: `i-4.1-develop-charter`

Sources: PMBOK Guide 6th ed. 4.1, pp. 75-81 (PDF 112-118)

**4.2 Develop Project Management Plan** (30 min, `m04-l3`)

- Explain baselining and why changes after baselining need formal control
- Distinguish project management plan components from project documents
- Explain the purpose and timing of the kick-off meeting

Source topics: `i-4.2-develop-pmp`, `i-pmp-components`

Sources: PMBOK Guide 6th ed. 4.2, pp. 82-86 (PDF 119-123); PMBOK Guide 6th ed. 4.2.3.1, pp. 87-89 (PDF 124-126)

**4.3 Direct and Manage Project Work and 4.4 Manage Project Knowledge** (30 min, `m04-l4`)

- Describe the outputs of Direct and Manage Project Work and where they go
- Distinguish corrective action, preventive action, defect repair and updates
- Distinguish explicit from tacit knowledge and explain how each is shared

Source topics: `i-4.3-direct-manage`, `i-4.4-manage-knowledge`, `i-change-request-types`

Sources: PMBOK Guide 6th ed. 4.3, pp. 90-97 (PDF 127-134); PMBOK Guide 6th ed. 4.4, pp. 98-105 (PDF 135-142); PMBOK Guide 6th ed. 4.3.3.3, 4.3.3.4, pp. 96 (PDF 133)

**4.5 Monitor and Control Project Work and 4.6 Perform Integrated Change Control** (35 min, `m04-l5`)

- Explain how work performance information becomes work performance reports
- Describe the steps and decision rights in integrated change control
- Distinguish configuration control from change control
- Name the three processes that receive approved change requests

Source topics: `i-4.5-monitor-control-work`, `i-4.6-integrated-change-control`

Sources: PMBOK Guide 6th ed. 4.5, pp. 105-113 (PDF 142-150); PMBOK Guide 6th ed. 4.6, pp. 113-120 (PDF 150-157)

**4.7 Close Project or Phase** (25 min, `m04-l6`)

- List the administrative and contractual closure activities
- Describe the key inputs and outputs of closing
- Explain what happens when a project is terminated early

Source topics: `i-4.7-close-project`

Sources: PMBOK Guide 6th ed. 4.7, pp. 121-128 (PDF 158-165)

### Module 5: Project Scope Management

Planning scope, collecting requirements, defining scope, building the WBS, validating deliverables and controlling scope, in predictive and adaptive settings.

Study time 2 h · 4 lessons · knowledge check 14 questions.

**Scope overview and 5.1 Plan Scope Management** (25 min, `m05-l1`)

- Distinguish product scope from project scope and how each is measured
- Contrast how scope is managed in predictive and adaptive life cycles
- Describe the scope management plan and the requirements management plan

Source topics: `s-scope-overview`, `s-5.1-plan-scope`

Sources: PMBOK Guide 6th ed. 5 intro, key concepts, trends, tailoring, agile considerations, pp. 129-133 (PDF 166-170); PMBOK Guide 6th ed. 5.1, pp. 134-137 (PDF 171-174)

**5.2 Collect Requirements** (35 min, `m05-l2`)

- Choose an appropriate elicitation technique for a situation
- Distinguish unanimity, majority, plurality and autocratic decisions
- Classify requirements (business, stakeholder, solution, transition, project, quality)
- Explain the purpose and attributes of a requirements traceability matrix

Source topics: `s-5.2-collect-requirements`, `s-5.2-requirements-techniques-outputs`

Sources: PMBOK Guide 6th ed. 5.2, pp. 138-144 (PDF 175-181); PMBOK Guide 6th ed. 5.2.2.6-5.2.3.2, pp. 145-149 (PDF 182-186)

**5.3 Define Scope and 5.4 Create WBS** (35 min, `m05-l3`)

- Contrast the project charter with the project scope statement
- Decompose deliverables to work packages and apply the 100 percent rule
- Define control account, planning package, work package and WBS dictionary

Source topics: `s-5.3-define-scope`, `s-5.4-create-wbs`

Sources: PMBOK Guide 6th ed. 5.3, pp. 150-155 (PDF 187-192); PMBOK Guide 6th ed. 5.4, pp. 156-162 (PDF 193-199)

**5.5 Validate Scope and 5.6 Control Scope** (25 min, `m05-l4`)

- Distinguish Validate Scope from Control Quality
- Describe the flow from deliverables to verified to accepted deliverables
- Define scope creep and gold plating and explain how Control Scope prevents them

Source topics: `s-5.5-validate-scope`, `s-5.6-control-scope`, `s-5.6-control-scope-detail`

Sources: PMBOK Guide 6th ed. 5.5, pp. 163-167 (PDF 200-204); PMBOK Guide 6th ed. 5.6, pp. 167-168 (PDF 204-205); PMBOK Guide 6th ed. 5.6.1-5.6.3, pp. 169-171 (PDF 206-208)

### Module 6: Project Schedule Management

Planning the schedule, defining and sequencing activities, estimating durations, building the schedule with the critical path method, compressing it and controlling it, including agile scheduling.

Study time 2.5 h · 5 lessons · knowledge check 15 questions.

**Schedule overview, 6.1 Plan Schedule Management and 6.2 Define Activities** (25 min, `m06-l1`)

- Explain the relationship between scheduling method, tool, model and schedule
- Describe iterative and on-demand (Kanban) scheduling
- List the contents of the schedule management plan
- Decompose work packages into activities and use rolling wave planning

Source topics: `t-schedule-overview`, `t-6.1-plan-schedule`, `t-6.2-define-activities`

Sources: PMBOK Guide 6th ed. 6 intro, key concepts, trends, tailoring, agile, pp. 173-178 (PDF 210-215); PMBOK Guide 6th ed. 6.1, pp. 179-182 (PDF 216-219); PMBOK Guide 6th ed. 6.2, pp. 183-186 (PDF 220-223)

**6.3 Sequence Activities** (25 min, `m06-l2`)

- Apply the four precedence relationships
- Classify dependencies as mandatory or discretionary, internal or external
- Use leads and lags correctly
- Recognise path convergence and divergence

Source topics: `t-6.3-sequence-activities`, `t-6.3-network-diagrams`

Sources: PMBOK Guide 6th ed. 6.3, pp. 187-192 (PDF 224-229); PMBOK Guide 6th ed. 6.3.2.3-6.3.3, pp. 193-194 (PDF 230-231)

**6.4 Estimate Activity Durations** (30 min, `m06-l3`)

- Choose between analogous, parametric, three-point and bottom-up estimating
- Calculate triangular and beta (PERT) estimates
- Distinguish contingency reserve from management reserve
- Recognise factors that distort estimates

Source topics: `t-6.4-estimate-durations`

Sources: PMBOK Guide 6th ed. 6.4, pp. 195-204 (PDF 232-241)

**6.5 Develop Schedule: critical path, optimisation and compression** (40 min, `m06-l4`)

- Perform a forward and backward pass and identify the critical path
- Calculate total float and free float
- Distinguish resource leveling from resource smoothing
- Choose between crashing and fast tracking
- Interpret a Monte Carlo result

Source topics: `t-6.5-develop-schedule`, `t-6.5-optimisation-compression`

Sources: PMBOK Guide 6th ed. 6.5, 6.5.1, 6.5.2.1-6.5.2.2, pp. 205-211 (PDF 242-248); PMBOK Guide 6th ed. 6.5.2.3-6.5.2.6, pp. 211-215 (PDF 248-252)

**Schedule outputs, agile release planning and 6.6 Control Schedule** (30 min, `m06-l5`)

- Distinguish the schedule baseline, project schedule and schedule presentations
- Explain the agile planning hierarchy from vision to tasks
- Read an iteration burndown chart
- Decide whether a delay needs action based on the critical path

Source topics: `t-6.5-outputs`, `t-6.6-control-schedule`

Sources: PMBOK Guide 6th ed. 6.5.2.7-6.5.3, pp. 216-221 (PDF 253-258); PMBOK Guide 6th ed. 6.6, pp. 222-230 (PDF 259-267)

### Module 7: Project Cost Management

Planning cost management, estimating costs, building the cost baseline and budget, and controlling costs with earned value management and forecasting.

Study time 2.2 h · 4 lessons · knowledge check 15 questions.

**Cost overview, 7.1 Plan Cost Management and 7.2 Estimate Costs** (30 min, `m07-l1`)

- Explain life-cycle costing and why early decisions matter most
- List the contents of the cost management plan
- Compare ROM and definitive estimate ranges
- Apply cost estimating techniques and the three-point formulas

Source topics: `c-cost-overview`, `c-7.1-plan-cost`, `c-7.2-estimate-costs`

Sources: PMBOK Guide 6th ed. 7 intro, key concepts, trends, tailoring, agile, pp. 231-234 (PDF 268-271); PMBOK Guide 6th ed. 7.1, pp. 235-239 (PDF 272-276); PMBOK Guide 6th ed. 7.2, pp. 240-247 (PDF 277-284)

**7.3 Determine Budget** (25 min, `m07-l2`)

- Build up a cost baseline and project budget from activity estimates
- Explain where contingency and management reserves sit
- Explain funding limit reconciliation and project funding requirements

Source topics: `c-7.3-determine-budget`

Sources: PMBOK Guide 6th ed. 7.3, pp. 248-256 (PDF 285-293)

**7.4 Control Costs: earned value management** (40 min, `m07-l3`)

- Define PV, EV, AC and BAC
- Calculate and interpret CV, SV, CPI and SPI
- Explain why SPI alone cannot tell you whether the end date is at risk

Source topics: `c-7.4-control-costs`

Sources: PMBOK Guide 6th ed. 7.4, 7.4.1, 7.4.2.1-7.4.2.2, pp. 257-263 (PDF 294-300)

**Forecasting: EAC, ETC, VAC and TCPI** (35 min, `m07-l4`)

- Choose the right EAC formula for the situation
- Calculate ETC and VAC
- Calculate and interpret TCPI against BAC and against EAC

Source topics: `c-7.4-forecasting-tcpi`

Sources: PMBOK Guide 6th ed. 7.4.2.2-7.4.3, pp. 264-270 (PDF 301-307)

### Module 8: Project Quality Management

Quality versus grade, cost of quality, planning quality, managing quality (assurance and improvement) and controlling quality with data tools.

Study time 1.6 h · 3 lessons · knowledge check 14 questions.

**Quality concepts and 8.1 Plan Quality Management** (35 min, `m08-l1`)

- Distinguish quality from grade, prevention from inspection, and tolerances from control limits
- Classify costs into the four cost-of-quality categories
- Describe the quality management plan and quality metrics
- Explain the five levels of quality management

Source topics: `q-quality-overview`, `q-8.1-plan-quality`

Sources: PMBOK Guide 6th ed. 8 intro, key concepts, trends, tailoring, agile, pp. 271-276 (PDF 308-313); PMBOK Guide 6th ed. 8.1, pp. 277-287 (PDF 314-324)

**8.2 Manage Quality** (30 min, `m08-l2`)

- Explain how Manage Quality relates to quality assurance
- Use cause-and-effect diagrams, histograms and scatter diagrams appropriately
- Describe the purpose of quality audits and Design for X

Source topics: `q-8.2-manage-quality`

Sources: PMBOK Guide 6th ed. 8.2, pp. 288-297 (PDF 325-334)

**8.3 Control Quality** (30 min, `m08-l3`)

- Explain how Control Quality produces verified deliverables
- Choose between inspection, testing, statistical sampling and check sheets
- Interpret a control chart, distinguishing control limits from specification limits

Source topics: `q-8.3-control-quality`

Sources: PMBOK Guide 6th ed. 8.3, pp. 298-306 (PDF 335-343)

### Module 9: Project Resource Management

Planning, estimating and acquiring team and physical resources; developing and managing the team; resolving conflict; and controlling physical resources.

Study time 1.9 h · 4 lessons · knowledge check 14 questions.

**Resource overview and 9.1 Plan Resource Management** (30 min, `m09-l1`)

- Distinguish team resources from physical resources
- Use the OBS, RBS, RAM and RACI chart
- Describe the resource management plan and the team charter

Source topics: `r-resource-overview`, `r-9.1-plan-resource`

Sources: PMBOK Guide 6th ed. 9 intro, key concepts, trends, tailoring, agile, pp. 307-312 (PDF 344-349); PMBOK Guide 6th ed. 9.1, pp. 312-320 (PDF 349-357)

**9.2 Estimate Activity Resources and 9.3 Acquire Resources** (25 min, `m09-l2`)

- Estimate resource quantities using bottom-up, analogous and parametric techniques
- Explain pre-assignment, negotiation and multicriteria selection
- Weigh the benefits and challenges of virtual teams

Source topics: `r-9.2-estimate-resources`, `r-9.3-acquire-resources`

Sources: PMBOK Guide 6th ed. 9.2, pp. 320-327 (PDF 357-364); PMBOK Guide 6th ed. 9.3, pp. 328-335 (PDF 365-372)

**9.4 Develop Team** (30 min, `m09-l3`)

- Identify Tuckman's five stages of team development
- Choose team development tools: colocation, training, team building, recognition
- Describe team performance assessments

Source topics: `r-9.4-develop-team`

Sources: PMBOK Guide 6th ed. 9.4, pp. 336-344 (PDF 373-381)

**9.5 Manage Team and 9.6 Control Resources** (30 min, `m09-l4`)

- Choose among the five conflict resolution techniques
- Apply emotional intelligence and influencing in a matrix environment
- Control physical resources and solve resource problems systematically

Source topics: `r-9.5-manage-team`, `r-9.6-control-resources`

Sources: PMBOK Guide 6th ed. 9.5, pp. 345-351 (PDF 382-388); PMBOK Guide 6th ed. 9.6, pp. 352-358 (PDF 389-395)

### Module 10: Project Communications Management

Communication dimensions, models and methods; planning communications; managing information flow; and monitoring whether stakeholders' information needs are met.

Study time 1.1 h · 2 lessons · knowledge check 12 questions.

**Communication concepts and 10.1 Plan Communications Management** (35 min, `m10-l1`)

- Describe the dimensions of project communication and the 5Cs of written communication
- Compare push, pull and interactive communication methods
- Explain the sender-receiver and cross-cultural communication models
- List the contents of the communications management plan

Source topics: `m-communications-intro`, `m-communications-overview`, `m-10.1-plan-communications`

Sources: PMBOK Guide 6th ed. 10 intro, pp. 359 (PDF 396); PMBOK Guide 6th ed. 10 key concepts, trends, tailoring, agile, pp. 360-365 (PDF 397-402); PMBOK Guide 6th ed. 10.1, pp. 366-378 (PDF 403-415)

**10.2 Manage Communications and 10.3 Monitor Communications** (30 min, `m10-l2`)

- Describe what Manage Communications produces beyond distribution
- Apply active listening, meeting management and presentation skills
- Explain how Monitor Communications checks effectiveness and triggers changes

Source topics: `m-10.2-manage-communications`, `m-10.2-manage-communications-tools`, `m-10.3-monitor-communications`

Sources: PMBOK Guide 6th ed. 10.2, 10.2.1, 10.2.2.1-10.2.2.2, pp. 379-383 (PDF 416-420); PMBOK Guide 6th ed. 10.2.2.3-10.2.3, pp. 384-388 (PDF 421-425); PMBOK Guide 6th ed. 10.3, pp. 388-393 (PDF 425-430)

### Module 11: Project Risk Management

Individual and overall project risk; planning, identifying, analysing (qualitatively and quantitatively), responding to and monitoring risk, including EMV and decision trees.

Study time 2.7 h · 5 lessons · knowledge check 15 questions.

**Risk concepts and 11.1 Plan Risk Management** (35 min, `m11-l1`)

- Distinguish individual project risk from overall project risk
- Explain risk appetite and risk thresholds
- Describe variability risk, ambiguity risk and project resilience
- List the contents of the risk management plan, including the RBS and probability and impact definitions

Source topics: `k-risk-overview`, `k-11.1-plan-risk`, `k-11.1-plan-contents-pim`

Sources: PMBOK Guide 6th ed. 11 intro, key concepts, trends, tailoring, agile, pp. 395-400 (PDF 432-437); PMBOK Guide 6th ed. 11.1, pp. 401-407 (PDF 438-444); PMBOK Guide 6th ed. 11.1.3.1, pp. 408 (PDF 445)

**11.2 Identify Risks and 11.3 Perform Qualitative Risk Analysis** (35 min, `m11-l2`)

- Write a cause-risk-effect risk statement
- Use checklists, SWOT, assumption analysis and prompt lists to identify risks
- Prioritise risks using probability, impact and other parameters
- Explain the contents of the risk register and risk report

Source topics: `k-11.2-identify-risks`, `k-11.3-qualitative`

Sources: PMBOK Guide 6th ed. 11.2, pp. 409-418 (PDF 446-455); PMBOK Guide 6th ed. 11.3, pp. 419-427 (PDF 456-464)

**11.4 Perform Quantitative Risk Analysis** (35 min, `m11-l3`)

- Decide when quantitative risk analysis is warranted
- Interpret Monte Carlo S-curves, criticality and tornado diagrams
- Calculate expected monetary value (EMV) and solve a decision tree

Source topics: `k-11.4-quantitative-intro`, `k-11.4-quantitative-tools`

Sources: PMBOK Guide 6th ed. 11.4, 11.4.1, 11.4.2.1, pp. 428-431 (PDF 465-468); PMBOK Guide 6th ed. 11.4.2.2-11.4.3, pp. 432-436 (PDF 469-473)

**11.5 Plan Risk Responses and 11.6 Implement Risk Responses** (35 min, `m11-l4`)

- Choose among the five strategies for threats and the five for opportunities
- Distinguish contingency plans, fallback plans, residual risks and secondary risks
- Explain why implementing responses is a separate process

Source topics: `k-11.5-plan-responses`, `k-11.6-implement-responses`

Sources: PMBOK Guide 6th ed. 11.5, pp. 437-448 (PDF 474-485); PMBOK Guide 6th ed. 11.6, pp. 449-452 (PDF 486-489)

**11.7 Monitor Risks** (20 min, `m11-l5`)

- Describe what risk monitoring determines
- Use technical performance analysis, reserve analysis and risk audits
- Distinguish risk reviews from risk audits

Source topics: `k-11.7-monitor-risks`, `k-11.7-monitor-risks-tools`

Sources: PMBOK Guide 6th ed. 11.7, 11.7.1, pp. 453-455 (PDF 490-492); PMBOK Guide 6th ed. 11.7.1.3-11.7.3, pp. 456-458 (PDF 493-495)

### Module 12: Project Procurement Management

Contracts and their types, make-or-buy, procurement documents and source selection, conducting procurements, and administering and closing contracts.

Study time 1.6 h · 3 lessons · knowledge check 13 questions.

**Procurement concepts and 12.1 Plan Procurement Management** (40 min, `m12-l1`)

- Explain the legal nature of contracts and the PM's role in procurement
- Choose an appropriate contract type for a situation
- Distinguish RFI, RFQ and RFP, and the procurement SOW from terms of reference
- Select a source selection method

Source topics: `p-procurement-overview`, `p-12.1-plan-procurement`, `p-12.1-outputs-table`

Sources: PMBOK Guide 6th ed. 12 intro, key concepts, trends, tailoring, agile, pp. 459-465 (PDF 496-502); PMBOK Guide 6th ed. 12.1, pp. 466-479 (PDF 503-516); PMBOK Guide 6th ed. 12.1.3.9-12.1.3.10, pp. 480-481 (PDF 517-518)

**12.2 Conduct Procurements** (25 min, `m12-l2`)

- Explain the purpose of bidder conferences and advertising
- Describe proposal evaluation and negotiation
- List typical contract components

Source topics: `p-12.2-conduct-procurements`

Sources: PMBOK Guide 6th ed. 12.2, pp. 482-491 (PDF 519-528)

**12.3 Control Procurements** (30 min, `m12-l3`)

- Describe contract administration activities and why payments should follow progress
- Explain claims administration and alternative dispute resolution
- Describe how a procurement is closed

Source topics: `p-12.3-control-procurements`

Sources: PMBOK Guide 6th ed. 12.3, pp. 492-501 (PDF 529-538)

### Module 13: Project Stakeholder Management

Identifying and analysing stakeholders, planning engagement with the engagement assessment matrix, managing engagement, and monitoring relationships.

Study time 1.4 h · 3 lessons · knowledge check 12 questions.

**Stakeholder concepts and 13.1 Identify Stakeholders** (35 min, `m13-l1`)

- Explain why stakeholder identification starts early and repeats
- Analyse stakeholders' stakes: interest, rights, ownership, knowledge and contribution
- Use power/interest grids, the salience model and directions of influence
- Describe the contents of the stakeholder register

Source topics: `h-stakeholder-intro`, `h-stakeholder-overview`, `h-13.1-identify-stakeholders`

Sources: PMBOK Guide 6th ed. 13 intro, pp. 503 (PDF 540); PMBOK Guide 6th ed. 13 key concepts, trends, tailoring, agile, pp. 504-506 (PDF 541-543); PMBOK Guide 6th ed. 13.1, pp. 507-515 (PDF 544-552)

**13.2 Plan Stakeholder Engagement and 13.3 Manage Stakeholder Engagement** (30 min, `m13-l2`)

- Use the stakeholder engagement assessment matrix with its five levels
- Describe the stakeholder engagement plan and when it is updated
- Apply communication and interpersonal skills to manage engagement

Source topics: `h-13.2-plan-engagement`, `h-13.3-manage-engagement`, `h-13.3-manage-outputs`

Sources: PMBOK Guide 6th ed. 13.2, pp. 516-522 (PDF 553-559); PMBOK Guide 6th ed. 13.3, 13.3.1, 13.3.2.1-13.3.2.3, pp. 523-527 (PDF 560-564); PMBOK Guide 6th ed. 13.3.2.4-13.3.3, pp. 528-529 (PDF 565-566)

**13.4 Monitor Stakeholder Engagement** (20 min, `m13-l3`)

- Explain how engagement is monitored and strategies adjusted
- Select analysis and decision techniques for engagement variances

Source topics: `h-13.4-monitor-engagement`

Sources: PMBOK Guide 6th ed. 13.4, pp. 530-536 (PDF 567-573)

### Module 14: The Standard for Project Management

Part 2 of the volume: the Standard's purpose, portfolios and programs, governance, project success, the life cycle curve, stakeholders, the PM's attributes and tailoring of artifacts.

Study time 0.8 h · 2 lessons · knowledge check 8 questions.

**What the Standard is; portfolios, programs, governance and success** (25 min, `m14-l1`)

- Explain how the Standard relates to the Guide
- Describe organisational and project governance and the elements of a project governance framework
- Explain why business documents are neither project documents nor plan components

Source topics: `std-intro-and-projects`, `std-ppp-governance-success`

Sources: PMBOK Guide 6th ed. Part 2 introduction, 1.1, pp. 541-542 (PDF 578-579); PMBOK Guide 6th ed. Part 2, 1.2-1.4, pp. 543-547 (PDF 580-584)

**Life cycle behaviour, stakeholders, the PM and tailoring artifacts** (25 min, `m14-l2`)

- Describe how cost, staffing, risk and stakeholder influence change over the life cycle
- List the knowledge, skills, abilities and attributes of a project manager
- Explain what "tailoring the artifacts" means in the Standard

Source topics: `std-life-cycle-stakeholders-pm`, `std-eef-opa-tailoring`

Sources: PMBOK Guide 6th ed. Part 2, 1.5-1.8, pp. 547-553 (PDF 584-590); PMBOK Guide 6th ed. Part 2, 1.10-1.11, pp. 557-559 (PDF 594-596)

### Module 15: The five Process Groups end to end

All 49 processes mapped to Process Groups and Knowledge Areas, and the flow of a project through Initiating, Planning, Executing, Monitoring and Controlling, and Closing.

Study time 1.4 h · 3 lessons · knowledge check 11 questions.

**The 49-process map** (30 min, `m15-l1`)

- Place every process in its Process Group and Knowledge Area
- Explain process frequency and how outputs flow between processes
- Explain why Process Groups are not phases

Source topics: `f-process-map`, `std-process-groups`

Sources: PMBOK Guide 6th ed. Table 1-4, pp. 25, 556 (PDF 62, 593); PMBOK Guide 6th ed. Part 2, 1.9, pp. 554-556 (PDF 591-593)

**Initiating and Planning Process Groups** (25 min, `m15-l2`)

- Describe the purpose and boundaries of Initiating
- Explain why Initiating is revisited at each phase
- Describe progressive elaboration and baselining in Planning

Source topics: `std-initiating-group`, `std-planning-group`, `std-planning-group-2`

Sources: PMBOK Guide 6th ed. Part 2, Section 2, pp. 561-564 (PDF 598-601); PMBOK Guide 6th ed. Part 2, Section 3, 3.1-3.13, pp. 565-579 (PDF 602-616); PMBOK Guide 6th ed. Part 2, 3.14-3.24, pp. 580-594 (PDF 617-631)

**Executing, Monitoring and Controlling, and Closing** (30 min, `m15-l3`)

- Explain why most budget and time is spent in Executing
- Distinguish monitoring from controlling
- Trace a typical change from Executing through Monitoring and Controlling and back
- Describe the purpose of the single Closing process

Source topics: `std-executing-group`, `std-executing-group-2`, `std-monitoring-controlling-group`, `std-closing-group`

Sources: PMBOK Guide 6th ed. Part 2, Section 4, 4.1-4.9, pp. 595-608 (PDF 632-645); PMBOK Guide 6th ed. Part 2, 4.9.2-4.10, pp. 609-611 (PDF 646-648); PMBOK Guide 6th ed. Part 2, Section 5, 5.1-5.12, pp. 613-632 (PDF 650-669); PMBOK Guide 6th ed. Part 2, Section 6, pp. 633-635 (PDF 670-672)

### Module 16: Appendices and glossary revision

What changed in the Sixth Edition, tool and technique groups, Process Groups in adaptive environments, key concepts and tailoring summaries, and precise glossary terms.

Study time 1.2 h · 3 lessons · knowledge check 10 questions.

**Sixth Edition changes and tool-and-technique groups** (20 min, `m16-l1`)

- Name the processes added, moved, removed and renamed in the Sixth Edition
- Classify tools and techniques into their groups

Source topics: `x1-sixth-edition-changes`, `x6-tools-techniques-index`

Sources: PMBOK Guide 6th ed. X1.1-X1.22, pp. 639-650 (PDF 676-687); PMBOK Guide 6th ed. X6.1-X6.2, pp. 685-694 (PDF 722-731)

**Adaptive environments and Knowledge Area summaries** (25 min, `m16-l2`)

- Place predictive, iterative, incremental and agile life cycles on a continuum
- Describe how each Process Group behaves in adaptive environments
- Use the key concepts and tailoring summaries for revision

Source topics: `x3-life-cycle-continuum`, `x3-process-groups-adaptive`, `x4-x5-summaries`

Sources: PMBOK Guide 6th ed. X3.1-X3.2, pp. 665-668 (PDF 702-705); PMBOK Guide 6th ed. X3.3, pp. 669-671 (PDF 706-708); PMBOK Guide 6th ed. X4.1-X4.10, X5.1-X5.10, pp. 673-684 (PDF 710-721)

**Glossary precision: terms the exam tests** (25 min, `m16-l3`)

- Distinguish commonly confused pairs of terms
- Expand common acronyms

Source topics: `g-glossary-scope-acronyms`, `g-glossary-a-c`, `g-glossary-c-s`, `g-glossary-s-w`

Sources: PMBOK Guide 6th ed. Glossary 1-2, pp. 695-697 (PDF 732-734); PMBOK Guide 6th ed. Glossary 3, pp. 698-703 (PDF 735-740); PMBOK Guide 6th ed. Glossary 3, pp. 704-723 (PDF 741-760); PMBOK Guide 6th ed. Glossary 3, pp. 724-726 (PDF 761-763)

### Module 17: Agile Practice Guide

The agile mindset, life cycle selection and hybrids, servant leadership and team composition, common agile practices, agile measurement, organisational considerations, frameworks, tailoring and suitability.

Study time 4.1 h · 8 lessons · knowledge check 15 questions.

**The agile mindset, lean and uncertainty** (30 min, `m17-l1`)

- State the four values of the Agile Manifesto and paraphrase its principles
- Explain agile as a mindset expressed through values, principles and practices
- Relate agile and Kanban to lean thinking
- Use requirements and technical uncertainty to judge where agile fits

Source topics: `a-apg-purpose-scope`, `a-definable-vs-uncertain`, `a-manifesto-mindset`, `a-lean-kanban-uncertainty`

Sources: Agile Practice Guide APG Preface, Section 1, pp. 1-5 (PDF 799, 809-813); Agile Practice Guide APG 2.1, pp. 7 (PDF 815); Agile Practice Guide APG 2.2, pp. 8-12 (PDF 816-820); Agile Practice Guide APG 2.3-2.4, pp. 12-16 (PDF 820-824)

**Choosing a life cycle and building hybrids** (30 min, `m17-l2`)

- Compare predictive, iterative, incremental and agile life cycles
- Distinguish iteration-based and flow-based agile
- Recognise common hybrid patterns and when to use them

Source topics: `a-life-cycle-types`, `a-hybrid-tailoring`

Sources: Agile Practice Guide APG 3, 3.1-3.1.5, pp. 17-25 (PDF 825-833); Agile Practice Guide APG 3.1.6-3.3, pp. 26-32 (PDF 834-840)

**Servant leadership and agile team composition** (30 min, `m17-l3`)

- Describe the servant leader's order of focus and responsibilities
- Explain the role of the project manager on an agile team
- Describe effective agile team characteristics and the three common roles
- Explain the cost of multitasking and the value of T-shaped people

Source topics: `a-servant-leadership`, `a-team-composition`

Sources: Agile Practice Guide APG 4.1-4.2.3, pp. 33-38 (PDF 841-846); Agile Practice Guide APG 4.3, pp. 38-47 (PDF 846-855)

**Delivering in agile: chartering and common practices** (35 min, `m17-l4`)

- Describe an agile project charter and team charter
- Run effective retrospectives, backlog refinement, standups and demonstrations
- Name the key execution practices and troubleshooting responses

Source topics: `a-charter-practices`

Sources: Agile Practice Guide APG 5.1-5.3, pp. 49-59 (PDF 857-867)

**Measuring agile projects** (30 min, `m17-l5`)

- Explain why agile prefers empirical measures over predictive ones
- Read burndown, burnup, feature and cumulative flow charts
- Forecast with velocity or cycle time
- Calculate agile SPI and CPI

Source topics: `a-agile-measurements`

Sources: Agile Practice Guide APG 5.4, pp. 60-70 (PDF 868-878)

**Organisational considerations for agility** (30 min, `m17-l6`)

- Identify drivers of change and signs of organisational readiness
- Assess culture with sliding scales and explain why psychological safety matters
- Choose agile contracting techniques
- Describe the agile PMO and how to evolve an organisation incrementally

Source topics: `a-org-change-culture`, `a-agile-contracts`, `a-org-business-pmo-structure`, `a-call-to-action`

Sources: Agile Practice Guide APG 6.1-6.2, pp. 71-77 (PDF 879-885); Agile Practice Guide APG 6.3, pp. 77-79 (PDF 885-887); Agile Practice Guide APG 6.4-6.8, pp. 79-86 (PDF 887-894); Agile Practice Guide APG Section 7, pp. 87 (PDF 895)

**Agile and lean frameworks** (30 min, `m17-l7`)

- Describe Scrum roles, events and artefacts
- Recognise XP practices, the Kanban Method's principles, Crystal, Scrumban, FDD, DSDM and Agile UP
- Describe Scrum of Scrums, SAFe, LeSS, Enterprise Scrum and Disciplined Agile

Source topics: `a-frameworks-team`, `a-frameworks-scaled`

Sources: Agile Practice Guide APG Annex A3.1-A3.9, pp. 99-111 (PDF 907-919); Agile Practice Guide APG Annex A3.10-A3.14, pp. 111-114 (PDF 919-922)

**Annexes: Knowledge Area mapping, tailoring and suitability filters** (30 min, `m17-l8`)

- Explain how each PMBOK Knowledge Area applies in agile work
- Apply the cautions and guidelines for tailoring agile
- Use the agile suitability filter to discuss predictive, hybrid or agile fit
- Use key agile glossary terms precisely

Source topics: `a-pmbok-ka-mapping`, `a-manifesto-mapping`, `a-tailoring-agile`, `a-suitability-filter`, `g-apg-glossary`

Sources: Agile Practice Guide APG Annex A1, pp. 89-95 (PDF 897-903); Agile Practice Guide APG Annex A2, pp. 97-98 (PDF 905-906); Agile Practice Guide APG Appendix X2, pp. 119-123 (PDF 927-931); Agile Practice Guide APG Appendix X3, pp. 125-138 (PDF 933-946); Agile Practice Guide APG Glossary, pp. 149-155 (PDF 957-963)

## Exams

### Mock Test 1

100 scenario-based questions across the whole course. Use it to find weak areas. 100 questions, 120 minutes, pass 80%.

Questions by module of the assessed topic: M01 4, M02 3, M03 3, M04 10, M05 8, M06 9, M07 9, M08 7, M09 7, M10 5, M11 9, M12 6, M13 6, M14 1, M15 1, M16 2, M17 10.

### Mock Test 2

A second set of 100 scenario-based questions, all different from Mock Test 1. 100 questions, 120 minutes, pass 80%.

Questions by module of the assessed topic: M01 5, M02 2, M03 3, M04 10, M05 8, M06 9, M07 9, M08 7, M09 7, M10 5, M11 9, M12 6, M13 6, M14 1, M15 1, M16 2, M17 10.

### Final assessment

81 new questions covering the whole course. Score 80% or more to earn the course certificate. 81 questions, 110 minutes, pass 80%.

Questions by module of the assessed topic: M01 9, M02 2, M03 3, M04 8, M05 5, M06 7, M07 6, M08 4, M09 4, M10 4, M11 6, M12 5, M13 3, M15 4, M16 2, M17 9.
