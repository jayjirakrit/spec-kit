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
