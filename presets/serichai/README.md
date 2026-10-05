# serichai preset

Stack-neutral workflow additions on top of Spec Kit, adapted from the Karpathy coding
guidelines:

- `design.md` step in plan (review aid before tasks)
- Simple / Surgical / Verifiable principle appended to the constitution
- `Verify:` note required on every task; surgical-change rule during implement

## Install

```bash
specify init --here --integration claude
specify preset add --dev /path/to/spec-kit/presets/serichai
cp /path/to/spec-kit/presets/serichai/agents/*.md .claude/agents/   # generic agents
```

Presets don't register agents, skills, hooks or workflows, so those copy steps are manual:

```bash
P=/path/to/spec-kit
cp -r $P/presets/serichai/skills/*  .claude/skills/        # /speckit-elaboration, /speckit-execution
mkdir -p .claude/hooks .specify/workflows/serichai-sdd
cp $P/presets/serichai/hooks/*.mjs  .claude/hooks/         # compact-context (+ _lib)
cp -r $P/workflows/serichai-sdd/*   .specify/workflows/serichai-sdd/
```

The `/speckit-elaboration` and `/speckit-execution` skills are orchestrators (specify ->
plan -> tasks with review gates; implement <-> converge with quality verification and a
human gate). Their commit-convention and path wording follows the Serichai portal, so
adjust it for another project.

## Agents

| Agent | Stage | Role |
|-------|-------|------|
| `business-analyst` | `/speckit-specify` | Writes `spec.md` in business language only, validates it, returns clarification questions |
| `solution-architect` | `/speckit-plan` | plan, research, data model, contracts, `design.md` |
| `backend-engineer` / `frontend-engineer` | `/speckit-implement` | Implement tasks in their area |
| `quality-engineer` | end of `/speckit-implement` | Reviews acceptance criteria, quality and security, runs gates, writes a concise `quality-report.md` (never writes tests or code) |

The specify and implement addenda delegate to these agents when they exist and fall back
to inline execution otherwise. If you use the `speckit` workflow, add a gate after
`implement` to review `quality-report.md` (presets cannot change workflows).

## Agents are stack-neutral

`backend-engineer`, `frontend-engineer` and `solution-architect` hold no framework
knowledge. They read the constitution's **Technology Standards** section (one entry per
area: path, stack, hard constraints, reference code, quality gates, verification) and
obey it. Run `/speckit-constitution` after installing and fill that section in for your
stack; if it is missing the agents stop and report instead of guessing.

## Angular + FastAPI example

`overlays/angular-fastapi/` shows a filled-in constitution (its Technology Standards
section holds the Angular and FastAPI rules) plus the mandatory-contracts
`plan-template` and `contracts-template` (copy to `.specify/templates/overrides/`).
Use it as a reference or starting point; edit paths and rules for your project.

The overlay also has `claude/` (`settings.json` plus the project-specific `guard-paths`
and `lint-frontend` hooks, which expect the portal's `frontend-ng/` and `backend/data/`
layout). Copy `claude/settings.json` to `.claude/settings.json` and `claude/hooks/*` to
`.claude/hooks/` if you want the same guardrails.

## Quality verification

`/speckit-implement` pipelines `quality-engineer` per area (`SCOPE: backend|frontend`),
then runs one `SCOPE: integration` pass that merges the area reports into
`quality-report.md`. Re-checks use `MODE: delta`. The agent is read-only
(`disallowedTools: Edit, NotebookEdit`).
