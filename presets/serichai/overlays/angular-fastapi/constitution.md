<!--
Sync Impact Report
- Version change: 2.1.0 → 2.2.0 (MINOR: new principle VI)
- Added principles: VI. Simple, Surgical, Verifiable Changes — simplicity, surgical edits,
  surfaced assumptions, and a verification check per task (adapted from the Karpathy
  coding guidelines). Plan "Constitution Check" and /speckit-analyze pick it up at runtime.
- Templates requiring updates: none. .claude/agents/backend-engineer.md and
  frontend-engineer.md updated to reference it.

Sync Impact Report (previous)
- Version change: 2.0.0 → 2.1.0 (MINOR: design.md artifact added)
- Modified principles:
  - I. Spec/Plan/Task Separation — added `design.md`, the one artifact allowed to hold
    a concise set of key implementation snippets, written at /speckit-plan for architect
    review before tasks. spec.md stays business-only; plan.md stays code-free.
  - V. Anti-Bloat — design.md must stay to key paths only.
- Templates updated: design-template.md (new), plan-template.md, speckit-plan SKILL.md,
  solution-architect.md, workflow.yml (review-plan gate message).

Sync Impact Report (previous)
- Version change: 1.1.1 → 2.0.0 (MAJOR: frontend stack redefined React → Angular; feature 007)
- Modified principles:
  - II. Monorepo Boundary Discipline — rationale text only: "a Vite SPA" → "an Angular SPA".
  - III. Tech Stack Standards — frontend clause redefined: Angular + TypeScript strict
    (strictTemplates); Angular HttpClient, through the shared `apiCall` helper, is the sole
    server-state layer (replaces TanStack Query). DaisyUI-first retained. Backend clauses
    and API naming rules unchanged.
  - IV. Quality Gates — `tsc -b` / `eslint .` replaced by `ng build` (strict type-check),
    `ng lint` and `ng test`.
- Added sections: none. Removed sections: none.
- Templates requiring updates: none (plan/spec/tasks/checklist/contracts templates are
  stack-neutral). CLAUDE.md and .claude/agents/* are updated by specs/007 task T018.
- Follow-up TODOs: none.

Sync Impact Report (previous)
- Version change: 1.1.0 → 1.1.1
- Modified principles:
  - III. Tech Stack Standards — clarified (wording only, no semantic change) how the
    existing "API contracts MUST be documented in plan.md" requirement is satisfied in
    practice: via an explicit link + one-line summary per endpoint in plan.md's "API
    Contracts" section, with the full schema living in contracts/*.md. Resolves an
    ambiguity between the literal text and established practice (specs/001, specs/002).
- Added sections: none
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ updated: added mandatory "API Contracts"
    pointer section, marked contracts/ as mandatory (not optional) for this repo.
  - .specify/templates/contracts-template.md — ✅ added: governs contracts/*.md structure.
  - .claude/skills/speckit-plan/SKILL.md — ✅ updated: contracts/ generation is no longer
    conditional on "external interfaces"; always required for this repo.
  - .specify/templates/spec-template.md — ✅ compatible; unaffected (business-language-only).
  - .specify/templates/tasks-template.md — ✅ compatible; unaffected.
  - .specify/templates/checklist-template.md — ✅ no changes required.
- Follow-up TODOs: none.

Sync Impact Report (previous)
- Version change: 1.0.0 → 1.1.0
- Modified principles:
  - III. Tech Stack Standards — added a normative API-naming rule: endpoint paths are
    resource-named/kebab-case (verb implied by HTTP method, no verb-suffixed paths), and
    all JSON request/response bodies + multipart field names use camelCase, bridged from
    Python's snake_case via a Pydantic alias_generator. Mirrors the same rule newly added
    to CLAUDE.md's "API conventions" section.
- Added sections: none (existing principle expanded, no new principle/section)
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no changes required; Constitution Check gate
    reads this file at runtime.
  - .specify/templates/spec-template.md — ✅ compatible; unaffected (business-language-only).
  - .specify/templates/tasks-template.md — ✅ compatible; unaffected.
  - .specify/templates/checklist-template.md — ✅ no changes required.
- Follow-up TODOs: none.
-->

# Serichai Web Portal Constitution

## Core Principles

### I. Spec/Plan/Task Separation of Concerns

`spec.md` MUST be written entirely in business/product language. It MUST NOT name
frameworks, libraries, endpoints, schemas, component names, or any other technical
implementation detail. It describes user needs, behavior, and acceptance criteria only,
written so a non-technical stakeholder can read and validate it without assistance.

`plan.md` translates the spec into a technical approach: architecture decisions, API
contracts, data model, and key trade-offs. It MUST stay concise — no filler, no
restating the spec in different words, no speculative future-proofing beyond what the
spec requires.

`design.md` (built from `.specify/templates/design-template.md`) is the only artifact
that may contain implementation code: a review aid (roughly 250-400 lines) showing the
key implementation files as short key-path snippets — feature services/models/components,
backend routers/services, shared blocks, algorithms, and config only where it carries a
decision — plus approach, decisions, flow and risks. It is guidance, not final code:
engineers may deviate but MUST note the deviation. It MUST NOT inventory every file,
cover scaffolding or docs-only edits, restate contracts or the data model, or include
whole-file dumps or test code.

`tasks.md` MUST contain the minimum number of tasks needed to implement the plan. Each
task is a meaningful, independently completable unit of work. Do not split a single
unit of work into separate "write test" / "write code" / "refactor" tasks unless
genuine parallelization or review requires the split — when in doubt, combine.

Rationale: Keeping business intent, technical design, and execution units in distinct
layers, each in its own artifact, lets a non-technical stakeholder validate the "what"
without wading through the "how," and keeps implementation work traceable back to an
approved plan and spec.

### II. Monorepo Boundary Discipline

`/frontend` and `/backend` are independently run projects sharing one repository — not
a workspace-tooled monorepo. There is no shared build and no shared package. Code in
one MUST NOT import implementation code from the other; the two communicate only
through the documented HTTP API contract.

Shared conventions (naming, commit style, branching) apply repo-wide. Stack-specific
conventions (linting, formatting, testing tools) live inside each workspace and MUST
NOT be forced onto the other side.

Rationale: The two apps are deployed and versioned independently ([email protected] http
server vs. an Angular SPA); enforcing the boundary at the import level is what keeps that
independence real instead of aspirational.

### III. Tech Stack Standards

Frontend: Angular + TypeScript in strict mode (`strict` and `strictTemplates`). Angular
`HttpClient`, used through the shared `apiCall` helper in `core/http`, is the sole
server-state layer — no ad-hoc HTTP calls in components. DaisyUI components are the
default UI building block; reach for custom CSS only when DaisyUI has no equivalent.

Backend: FastAPI with Pydantic models for all request/response validation. Type hints
are required throughout — no untyped function signatures. Dependencies (DB sessions,
auth, config) are provided via FastAPI's `Depends` pattern, not module-level globals or
manual wiring.

API contracts are the source of truth between frontend and backend. They MUST be
documented in `plan.md` for each feature, and both sides MUST be kept in sync with what
is documented — a contract change on one side without a corresponding plan update and
matching change on the other side is a defect. In practice, `plan.md` satisfies this by
including an "API Contracts" section listing an explicit link and one-line summary per
endpoint; the full request/response schema lives in `contracts/*.md` (one file per
endpoint, built from `.specify/templates/contracts-template.md`) rather than being
restated inline, per Principle V.

API endpoint paths MUST be resource-named and kebab-case for multi-word resources,
relying on the HTTP verb rather than a verb suffix (e.g. `POST /accounts/employee-benefits`,
not `.../employee_benefits/calculate`). All JSON request/response bodies and multipart
form field names MUST use camelCase keys; backend Python internals stay `snake_case`
per PEP 8, bridged on each Pydantic model via a camelCase `alias_generator` rather than
hand-written per-field aliases or a `snake_case` wire format.

Rationale: A single, explicit server-state layer and a single validation layer remove
an entire class of "where does this bug live" ambiguity; typed contracts on both ends
make drift between frontend expectations and backend behavior visible at review time
instead of at runtime.

### IV. Quality Gates

Tests are required for backend business logic and for critical frontend user flows.
Exhaustive coverage is not required and MUST NOT be used to justify inflating a task
list — test what breaks the feature if it's wrong, not every line.

Type-checking (`ng build` on the frontend; type hints honored on the backend), linting
(`ng lint`) and unit tests (`ng test`) on the frontend MUST pass before a task is
considered complete.

Existing project conventions in `CLAUDE.md` take precedence for anything not covered
here (how to run each app locally, layering conventions, styling tokens, state-
management decision order, etc.) — read it before starting implementation work, and
keep it current if those conventions change.

Rationale: Type-checking and linting are cheap, automatable correctness signals that
catch entire bug classes before review; gating completion on them (plus targeted tests)
keeps quality checks proportionate instead of becoming their own project.

### V. Anti-Bloat Principle

Every artifact — spec, plan, tasks, and this constitution — MUST be as short as
possible while remaining complete. When in doubt, cut rather than add. Prefer
referencing an existing doc or convention (e.g. `CLAUDE.md`, an existing API contract)
over restating it in a new artifact.

Rationale: Duplicated documentation rots — the copy nobody updates becomes the one
someone trusts. A single source of truth per fact, referenced rather than repeated,
is what keeps Spec-Kit artifacts trustworthy as the project grows.

### VI. Simple, Surgical, Verifiable Changes

Implementation MUST do the simplest thing that satisfies the task: no speculative
abstractions, configurability, or features the spec/plan did not ask for. Changes MUST
be surgical — touch only the files and lines the current task requires; no drive-by
refactors, reformatting, or cleanup of unrelated code (mention it instead). Match
surrounding style. Open assumptions MUST be surfaced (in `spec.md` via
`/speckit-clarify`, or in the implementer's report) rather than silently guessed.
Every task in `tasks.md` MUST state how it is verified (a command, test, or observable
behavior) in a few words, and is done only when that check passes. A feature is done only when its
`quality-report.md` verdict (written by the quality engineer) is PASS or PASS WITH NOTES.

Rationale: Most LLM-assisted coding failures are overbuilding, collateral edits, and
unstated guesses; naming a concrete check per task makes "done" falsifiable.

## Technology Standards

Read by the `backend-engineer`, `frontend-engineer` and `solution-architect` agents.

### Area: backend — role: backend

- **Path**: `backend/`
- **Stack**: FastAPI + Pydantic, Python 3.13.
- **Hard constraints**: thin router in `backend/routers/<name>.py`, logic in
  `backend/services/<name>_service.py`; every request/response model uses a camelCase
  `alias_generator` (`to_camel`) + `populate_by_name=True`; type hints on every
  signature; dependencies via `Depends`; kebab-case resource-named endpoint paths (verb
  implied by HTTP method); never import `frontend/` code. Employee-benefit data uses
  Thai headers and Buddhist Era years (BE = Gregorian + 543) — preserve in
  `accounts_service.py` and related date logic.
- **Reference code**: `backend/routers/accounts.py`,
  `backend/services/accounts_service.py`,
  `backend/services/payroll_reconcile_service.py`; tests in `backend/tests/`.
- **Quality gates**: type hints honored; `pytest` (from `backend/`) passes.
- **Test patterns**: `backend/tests/test_<topic>.py`, pytest, shared fixtures in
  `backend/tests/conftest.py` and `backend/tests/fixtures/`.
- **Verification**: run `uvicorn main:app --reload` and call the endpoint.

### Area: frontend — role: frontend

- **Path**: `frontend-ng/` (renamed `frontend/` at the spec 007 cutover); the legacy
  React app in `frontend/` is frozen.
- **Stack**: Angular + TypeScript `strict`/`strictTemplates`, standalone zoneless
  components, signals, Tailwind v4 + DaisyUI.
- **Hard constraints**: Angular `HttpClient` is the sole server-state layer — HTTP calls
  live in `features/<name>/<name>.service.ts`, components consume them through
  `apiCall` (`@core/http/api-call`); structure `core/` · `shared/` · `features/` (features
  never import features; `shared` never imports `core`/`features`); use `@/`, `@core/`,
  `@shared/`, `@features/` aliases; models camelCase matching the wire format; DaisyUI
  first, colors/type via `var(--...)` tokens in `src/styles.css`; Tailwind class order
  Layout → Sizing → Typography → Colors & Effects → States; never import `backend/`.
- **Reference code**: `src/app/core/http/api-call.ts`,
  `src/app/features/employee-benefits/`, `src/styles.css`.
- **Quality gates**: `ng build`, `ng lint`, `ng test --watch=false` must pass.
- **Test patterns**: `*.spec.ts` next to the file under test, Vitest via `ng test`;
  services use `HttpTestingController` asserting URL and exact field names; components
  get smoke specs.
- **Verification**: `npm start` with uvicorn running; exercise golden path and edge
  cases in a browser.

### Cross-area contract

HTTP only. One `contracts/<resource>-api.md` per endpoint touched (built from
`.specify/templates/contracts-template.md`), summarized in `plan.md`'s "API Contracts"
section. JSON bodies and multipart field names are camelCase.

## Development Workflow

Commit messages, naming conventions, and branching strategy are shared repo-wide;
stack-specific tooling conventions (formatter config, import ordering, etc.) are
defined and enforced inside each workspace, not at the repo root.

A feature's implementation is not complete until its `tasks.md` items are done, its
Quality Gates (Principle IV) pass, and — if the plan's API contract changed — both
`/frontend` and `/backend` reflect that change. Reviews should check the diff against
`plan.md`'s documented contract, not just against the spec's acceptance criteria.

## Documentation & Context Continuity

`CLAUDE.md` at the repo root is the durable reference for how to run, build, and work
within `/frontend` and `/backend`, and for each stack's coding conventions. Spec-Kit
artifacts (`spec.md`, `plan.md`, `tasks.md`) MUST reference `CLAUDE.md` for standing
conventions rather than re-describing them — this constitution governs process and
non-negotiable principles; `CLAUDE.md` governs day-to-day mechanics and stays current
as tooling evolves.

## Governance

This constitution supersedes ad-hoc practice for all Spec-Kit-driven feature work in
this repository. Where a `plan.md` or `tasks.md` would conflict with a principle here,
the principle wins and the artifact must be revised.

**Amendment procedure**: Amendments are made via `/speckit-constitution`, editing this
file directly with a Sync Impact Report describing what changed and why. Anyone can
propose an amendment; it takes effect once the updated file is committed.

**Versioning policy**: This constitution follows semantic versioning:
- MAJOR — a principle is removed or redefined in a backward-incompatible way.
- MINOR — a new principle or section is added, or existing guidance materially expands.
- PATCH — wording, clarification, or typo fixes with no semantic change.

**Compliance review**: Every `plan.md` MUST pass its "Constitution Check" gate against
the current version of this file before implementation tasks are generated. A plan that
cannot satisfy a principle must either be revised or document the deviation with an
explicit rationale in its Complexity Tracking section.

**Version**: 2.2.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-10-04
