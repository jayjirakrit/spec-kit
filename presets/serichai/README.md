# serichai preset

Stack-neutral workflow additions on top of Spec Kit, adapted from the Karpathy coding
guidelines:

- `design.md` step in plan (review aid before tasks)
- Simple / Surgical / Verifiable principle appended to the constitution
- `Verify:` note required on every task; surgical-change rule during implement

## Install

```bash
specify init --here --integration claude
specify preset add --dev /path/to/jy-spec-kit/presets/serichai
cp /path/to/jy-spec-kit/presets/serichai/agents/*.md .claude/agents/   # generic agents
```

Presets don't register agents, so the copy step is manual.

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
