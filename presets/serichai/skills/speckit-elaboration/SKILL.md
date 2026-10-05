---
name: "speckit-elaboration"
description: "Orchestrate the documentation half of the Spec-Kit cycle — specify, clarify, (checklist), plan, tasks, analyze — with human review gates after the spec and after the plan. Writes only Markdown under specs/<feature>/; never touches source code."
argument-hint: "Feature description (or empty to continue the active feature)"
compatibility: "Requires spec-kit project structure with .specify/ directory"
user-invocable: true
disable-model-invocation: false
---


## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Take a feature from a natural-language description to a reviewed, analyzed `tasks.md` by running
the existing spec-kit skills in order. This skill adds no logic of its own: each step is the named
skill, invoked with the `Skill` tool, and its instructions are followed in full (including its own
extension hooks and subagent dispatches). This skill only sequences them, gates them, and reports.

The code half of the cycle is `/speckit-execution`.

## Scope Rule (non-negotiable)

- Write **only** Markdown inside the active feature directory `specs/<NNN-feature>/` (plus
  `.specify/feature.json`, which the spec-kit scripts maintain).
- **Never** create or edit files in `backend/`, `frontend*/`, `scripts/`, root config, or anywhere
  else. If a step seems to need code, capture it as a decision or snippet in `plan.md` / `design.md`
  (the only artifact allowed to hold implementation code) instead.
- Do not commit. Committing spec docs is the user's call (see CLAUDE.md: `[DOCS] add <feature-name> feature spec`).

## Step 0 — Resume Detection

1. Read `.specify/feature.json` (if it exists) to find the active `feature_directory`.
2. If `$ARGUMENTS` is **non-empty** → start a new feature at Step A.
3. If `$ARGUMENTS` is **empty**:
   - No active feature, or no `spec.md` in it → stop and ask the user for a feature description.
   - Otherwise resume at the first missing artifact: no `plan.md` → GATE 1 (re-confirm the spec);
     no `tasks.md` → Step D's gate (GATE 2); `tasks.md` present → Step F.
   - Tell the user which step you are resuming from and why.

## Pipeline

### A. Specify
Invoke `Skill speckit-specify` with `$ARGUMENTS`. (It creates the feature dir and dispatches the
`business-analyst` subagent.)

### B. Clarify
Invoke `Skill speckit-clarify`. Skip it only if `spec.md` contains no `[NEEDS CLARIFICATION]`
markers **and** clarify's own scan reports no high-impact ambiguity — say so in one line.

### C. Checklist (optional)
Only if `$ARGUMENTS` explicitly asks for an extra checklist domain (e.g. "security", "ux"), invoke
`Skill speckit-checklist <domain>`. Otherwise skip silently — specify already writes the
requirements-quality checklist.

### GATE 1 — Review spec (human)
Present:
- Path to `spec.md` (and any `checklists/*.md`)
- A 5–10 line summary: user stories with priorities, count of FRs and SCs, assumptions made

Then use `AskUserQuestion` with options **Approve**, **Revise**, **Abort**:
- **Approve** → continue to D.
- **Revise** → take the user's feedback, re-run `Skill speckit-specify` (or `speckit-clarify` when the
  feedback is about specific ambiguities) with that feedback as input, then show GATE 1 again.
- **Abort** → stop; report what exists on disk.

### D. Plan
Invoke `Skill speckit-plan`. (It dispatches the `solution-architect` subagent to write `plan.md`,
`research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `design.md`.)

### GATE 2 — Review plan + design.md (human)
Present:
- Paths to `plan.md` and `design.md` (and `contracts/`)
- A short summary: approach, key decisions, risks and open questions from `design.md`, and any
  constitution-check notes from `plan.md`

Then `AskUserQuestion` with **Approve**, **Revise**, **Abort**:
- **Approve** → continue to E.
- **Revise** → re-run `Skill speckit-plan` with the feedback as input, then show GATE 2 again.
- **Abort** → stop; report what exists on disk.

### E. Tasks
Invoke `Skill speckit-tasks`.

### F. Analyze
Invoke `Skill speckit-analyze`. It is read-only. **Skip its step 8 ("offer remediation")** — this
orchestrator reports instead:
- If any **CRITICAL** findings exist: list them, recommend the concrete fix (which artifact to
  re-run or edit), and state that `/speckit-execution` should not start until they are resolved.
  Do not edit anything automatically.
- Otherwise: summarize HIGH/MEDIUM counts in one line.

## Completion Report

- Feature directory and the list of artifacts written
- Gate outcomes (approved as-is / revised N times)
- Analyze metrics (requirements, tasks, coverage %, critical count)
- Next steps:
  1. Optionally commit the spec: `[DOCS] add <feature-name> feature spec` (only `specs/<NNN-feature>/`)
  2. `/compact keep feature <NNN> dir, analyze findings` (session hygiene, CLAUDE.md)
  3. `/speckit-execution`

## Excluded on purpose

- `speckit-constitution` — project-level governance, not per-feature; run it by hand.
- `speckit-taskstoissues` — publishes to GitHub (external side effect); run it by hand if wanted.

## Done When

- [ ] `spec.md` approved at GATE 1
- [ ] `plan.md` + `design.md` approved at GATE 2
- [ ] `tasks.md` generated and analyze report shown
- [ ] No files outside `specs/<NNN-feature>/` and `.specify/feature.json` were changed
- [ ] Completion report delivered
