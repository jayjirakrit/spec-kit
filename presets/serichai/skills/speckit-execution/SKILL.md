---
name: "speckit-execution"
description: "Orchestrate the code half of the Spec-Kit cycle — implement ⇄ converge loop with quality-engineer verification, a /code-review pass, a human review gate, then an optional convention-following commit. Requires tasks.md from /speckit-elaboration."
argument-hint: "Optional implementation guidance or task filter"
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

Turn an approved `tasks.md` into working, verified, reviewed code by running the existing skills in
order. This skill adds no implementation logic of its own: each step is the named skill, invoked
with the `Skill` tool, and its instructions are followed in full (extension hooks, subagent
delegation, checkbox marking, quality verification). This skill sequences, loops, gates, and reports.

The documentation half of the cycle is `/speckit-elaboration`.

## Step 1 — Preconditions

1. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks` from
   the repo root and parse `FEATURE_DIR`.
2. If it fails because `tasks.md` (or `plan.md`) is missing → stop and tell the user to run
   `/speckit-elaboration` first.
3. Record the starting point for the review: `git status --short` and `git rev-parse HEAD`.

## Step 2 — Build Loop (max 3 iterations)

Mirrors the `build` do-while in `.specify/workflows/speckit/workflow.yml`:

```
iteration = 1
loop:
  Skill speckit-implement $ARGUMENTS + "defer quality verification"
                                       # checklist gate, engineer subagents, [X] marking
  Skill speckit-converge               # appends any unbuilt work as new "- [ ]" tasks
  open = count of lines matching ^- \[ \] in FEATURE_DIR/tasks.md
  if open == 0 or iteration == 3: exit loop
  iteration += 1
then: run speckit-implement's "Quality verification (this repo)" once for the whole
      feature (area lanes → integration, with its single fix pass)
```

- Quality verification runs once, after the loop, not every iteration: converge already
  catches unbuilt work, so a full review of code that will change in the next iteration
  is wasted. The lanes cover every area changed since the HEAD recorded in Step 1.
- Report a one-line status after each iteration (`iteration N: X tasks done, Y open`).
- If `speckit-implement` halts (failed sequential task, or user declined the checklist gate) →
  stop the loop, run the quality verification on what exists, and go straight to the GATE with
  that state. The same applies if the verdict is still FAIL after its single fix pass. Do not
  keep looping on a failure.
- If the cap is hit with tasks still open, list them for the GATE.

## Step 3 — Code Review

Invoke `Skill code-review` on the working-tree diff (the changes since the HEAD recorded in Step 1).
Both reviews are read-only, so you may start it while the integration `quality-engineer`
from Step 2 runs in the background. `quality-engineer` covers spec, contract and
constitution conformance plus security; `/code-review` covers general correctness.

- Show its findings.
- If any are correctness bugs, ask the user (`AskUserQuestion`: **Fix all**, **Pick which**,
  **Skip**) whether to fix them. Route each approved fix by area exactly like speckit-implement's
  "Delegation (this repo)" section: backend files → `backend-engineer`, frontend files →
  `frontend-engineer`, anything else → fix in this thread.
- After fixes, re-dispatch `quality-engineer` **once** with FEATURE_DIR,
  `SCOPE: integration`, `MODE: delta` and the files changed by the fixes, so
  `quality-report.md` reflects the final code without a full re-review.

## Step 4 — GATE: Human Review

Present a compact review packet:

- **Quality verdict** from `FEATURE_DIR/quality-report.md` (PASS / PASS WITH NOTES / FAIL) + path
- **Code-review findings**: fixed / skipped / remaining
- **Open tasks** in `tasks.md` (count + IDs), and iterations used
- **Deviations from `design.md`** and assumptions reported by the engineer subagents
- **Files changed** (`git status --short` vs. Step 1)

Then `AskUserQuestion` with **Approve**, **Request changes**, **Abort**:
- **Approve** → Step 5.
- **Request changes** → append the user's feedback to `tasks.md` as new `- [ ]` tasks (next free
  T-IDs, in a "Review follow-ups" phase), then run Step 2 (one iteration) and Step 4 again. Allow
  this at most twice; after that, report and stop.
- **Abort** → stop. Leave the working tree as is; summarize what was changed.

## Step 5 — Offer Commit (only after Approve)

Propose — do not run yet — commits that follow the repo's CLAUDE.md conventions:

- Split by area: `[ADD][BE] …` for `backend/`, `[ADD][FE] …` for `frontend-ng/` (use `[IMP]` when
  the change modifies existing behavior rather than adding a capability). Imperative mood,
  lowercase after the tag.
- If `specs/<NNN-feature>/` is uncommitted, propose it as its **own first** commit:
  `[DOCS] add <feature-name> feature spec`, with a body listing the artifacts included.
- **No `Co-Authored-By: Claude` or any Anthropic/Claude trailer** (CLAUDE.md overrides the default).
- Show each proposed commit's subject and file list, then `AskUserQuestion`: **Commit as proposed**,
  **Edit messages**, **Don't commit**. Commit only on explicit confirmation.
- Never push (`git push` is denied in `.claude/settings.json` anyway).

## Completion Report

- Feature directory, iterations used, final open-task count
- Quality verdict with a link to `quality-report.md`
- Code-review summary
- Commits created (hashes + subjects), or "not committed"
- Suggested next step: `/clear` before the next feature (session hygiene, CLAUDE.md)

## Done When

- [ ] Build loop finished (0 open tasks, or cap/failure reported)
- [ ] `quality-report.md` reflects the final code
- [ ] `/code-review` ran and its findings were handled or explicitly skipped
- [ ] Human gate answered
- [ ] Commit offered after approval (and made only on confirmation)
- [ ] Completion report delivered
