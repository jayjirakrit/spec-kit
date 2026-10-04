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
```

## Angular + FastAPI overlay (optional)

`overlays/angular-fastapi/` holds the stack-specific pieces from the Serichai Web Portal:
`backend-engineer`, `frontend-engineer`, `solution-architect` agents (copy to
`.claude/agents/`), a mandatory-contracts `plan-template`/`contracts-template` (copy to
`.specify/templates/overrides/`), and the full project constitution (a starting point
for `/speckit-constitution`). Edit paths and rules for your project after copying.
