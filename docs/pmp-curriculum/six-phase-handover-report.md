# Six-phase handover report

Generated 2026-10-21 by `scripts/pmp-write-reports.ts`; narrative maintained in that script.

The six phases come from the original build brief for the PMP learning platform: (1) project audit and complete source processing, (2) curriculum and assessment construction, (3) learning interface, (4) backend and progression, (5) validation, (6) handover. The administrator panel, role separation and production-readiness work were added in a follow-up brief and are reported under phases 4-6.

## Phase 1: Project audit and complete source processing

**Objective.** Audit the existing site, then process every page of the supplied PMBOK Guide Sixth Edition PDF (with the bundled Standard and Agile Practice Guide) into traceable artifacts.

**Status.** Complete.

**Deliverables**

- `page-processing-manifest.json`: 976 page records
- `topic-catalogue.json` (160 topics), `process-map.json` (49 processes), `ittos.json`
- `source-index.json` (209 sections, 265 figures and tables)
- `batches/` (39 batch files) and `checkpoint.json`

**Validation evidence**

- Manifest validated: 976 expected pages, 0 missing, 0 unverified, 0 awaiting visual inspection, 0 with issues.
- 36 layout-dependent pages rendered and inspected; Standard inputs/outputs cross-checked against all 49 ITTO sets.

**Outstanding issues**

- Review is AI-assisted, not an independent human SME review (see source-review-report.md).

**Next actions**

- None.

## Phase 2: Curriculum and assessment construction

**Objective.** Write original lessons with source references covering all 49 processes, and build knowledge checks, two mock tests and a final assessment.

**Status.** Complete for authored content; human expert review outstanding.

**Deliverables**

- 18 modules, 69 lessons (32.4 h) in `server/pmp/content/`
- 511 questions: 230 in knowledge checks, 100 + 100 in mocks, 81 in the final
- `curriculum-outline.md`, `assessment-coverage-report.md`, `topic-coverage-matrix.json`, `content-stats.json`

**Validation evidence**

- `node scripts/pmp-content-report.ts` passes: unique ids and stems, 4 distinct options, valid answers and topics, 8-15 questions per check, 160/160 topics taught, 49/49 processes assessed.

**Outstanding issues**

- No difficulty tagging; no human PMP-instructor review yet.

**Next actions**

- Review lessons and questions in the admin panel; publish corrections as needed.

## Phase 3: Learning interface

**Objective.** Replace the #pmp prototype with a learner platform: entry and sign-in, dashboard, two-column layout with sidebar and mobile drawer, lessons, timed assessments, results review, certificate and public verification.

**Status.** Complete.

**Deliverables**

- `src/pmp/` (learner UI), `src/admin/` (administrator panel), mobile hero portrait fix in `src/styles.css`

**Validation evidence**

- Checked in the browser on desktop and phone widths, light and dark themes; client bundle verified to contain no questions or answer keys.

**Outstanding issues**

- Social sign-in and password reset are not implemented.

**Next actions**

- None.

## Phase 4: Backend and progression

**Objective.** Server-side accounts, sessions, progress in D1, sequential unlocking, server-side scoring, certificates; then an administrator role with full inspection access that cannot alter learner records.

**Status.** Complete.

**Deliverables**

- `server/pmp/` (auth, store, engine, router, admin, content overrides, certificate PDF) and `functions/api/pmp/[[path]].ts`
- D1 tables `pmp_users`, `pmp_sessions`, `pmp_lesson_progress`, `pmp_attempts`, `pmp_certificates`, `pmp_content_overrides`, `pmp_audit`, created and migrated additively at runtime
- Admin bootstrap through `PMP_ADMIN_BOOTSTRAP_PASSWORD` with a forced password change; role stored only in D1 and checked on every request

**Validation evidence**

- `tests/pmp.test.ts` and `tests/pmp-admin.test.ts` cover locking by URL and API, scoring, timing, certificates, bootstrap, role separation, preview without records, drafts and publishing, and schema migration.

**Outstanding issues**

- Passwords use PBKDF2-SHA-256 with 100,000 iterations (the Workers maximum) rather than Argon2id or bcrypt; see README.

**Next actions**

- None.

## Phase 5: Validation

**Objective.** Run tests, typecheck and production build; check behaviour in the browser; review for secrets.

**Status.** Complete locally; production not verified (not deployed).

**Deliverables**

- Test suite, typecheck and build results are recorded in the pull request description.

**Validation evidence**

- `npm run typecheck`, `npm test`, `npm run build`, `node scripts/pmp-content-report.ts`, and browser checks on the local Pages server.

**Outstanding issues**

- Nothing has been verified in production.

**Next actions**

- After approval: deploy a preview, repeat the browser checks there, then promote.

## Phase 6: Handover

**Objective.** Document setup, configuration and operation; propose the pull request; list what the owner must do.

**Status.** Complete pending owner approval.

**Deliverables**

- README section "PMP learning platform", `.dev.vars.example`, the five reports in this folder

**Validation evidence**

- Reports generated from the artifacts by this script.

**Outstanding issues**

- Production D1 is bound in wrangler.toml (rahul-site-db as BOOKINGS_DB); secrets (RESEND_API_KEY, PMP_ADMIN_BOOTSTRAP_PASSWORD, Google) must be set by the owner.
- The production admin account must be bootstrapped with a strong one-time secret (not the local temporary password) and the password changed on first sign-in.

**Next actions**

- Approve the pull request, configure bindings and secrets, deploy, verify, then remove `PMP_ADMIN_BOOTSTRAP_PASSWORD`.
