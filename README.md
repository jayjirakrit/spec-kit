<div align="center">
    <img src="https://raw.githubusercontent.com/github/spec-kit/main/media/logo_large.webp" alt="Spec Kit Logo" width="160" height="160"/>
    <h1>Spec Kit — Serichai custom framework</h1>
    <h3><em>Spec-Driven Development with role agents, a design review gate, and verifiable, surgical changes.</em></h3>
</div>

This repository is a fork of [github/spec-kit](https://github.com/github/spec-kit).
The `serichai/custom` branch adds the **`serichai` preset** (v1.2.0, requires
Spec Kit >= 1.1.0) in [`presets/serichai/`](./presets/serichai/). Everything else
is upstream Spec Kit, unchanged.

## What this fork adds

- **Design review gate** — `/speckit-plan` also writes `design.md`: a 250–400 line
  sketch of the key implementation files, for an architect to review before tasks are
  generated.
- **Simple, Surgical, Verifiable principle** — appended to the constitution: no
  speculative features, touch only what the task needs, surface assumptions.
- **Verifiable tasks** — every task in `tasks.md` ends with a `Verify:` note (command,
  test, or observable behavior) and is done only when that check passes.
- **Technology Standards** — a constitution section with one entry per area (path,
  stack, constraints, reference code, quality gates, verification). Agents read it
  instead of hard-coding a framework, so the preset is stack-neutral.
- **Role agents** — business analyst, solution architect, backend/frontend engineers
  and a quality engineer. The Spec Kit commands delegate to them when they're installed
  and run inline otherwise.
- **Quality gate** — a feature is done only when `quality-report.md` says PASS or
  PASS WITH NOTES.

## Workflow

```text
constitution → specify → plan (+ design.md) → tasks → implement → quality review
```

| Command | Agent | Output | Serichai addition |
| --- | --- | --- | --- |
| `/speckit-constitution` | — | `constitution.md` | Simple/Surgical/Verifiable principle, Technology Standards section |
| `/speckit-specify` | `business-analyst` | `spec.md`, `checklists/requirements.md` | Spec in business language only; clarification questions returned to you |
| `/speckit-plan` | `solution-architect` | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `design.md` | `design.md` review step |
| `/speckit-tasks` | — | `tasks.md` | `Verify:` note required on every task |
| `/speckit-implement` | `backend-engineer`, `frontend-engineer` | code | Tasks routed by area; surgical-change rule |
| (end of implement) | `quality-engineer` | `quality-report.md` | Acceptance, quality and security review; one fix round on FAIL |

Review each artifact before running the next command. The plan gate (`design.md`) is
the main place to catch wrong approaches before any code is written.

## Install

```bash
# 1. Spec Kit CLI and this fork
uv tool install specify-cli
git clone -b serichai/custom https://github.com/jayjirakrit/jy-spec-kit.git

# 2. In your project
specify init --here --integration claude
specify preset add --dev /path/to/jy-spec-kit/presets/serichai
cp /path/to/jy-spec-kit/presets/serichai/agents/*.md .claude/agents/
```

Then run `/speckit-constitution` in your agent and fill in the **Technology Standards**
section for your stack. If it is missing, the engineer and architect agents stop and
report instead of guessing.

Presets can't register agents or change workflows, so copying the agents is manual. If
you use the `speckit` workflow, add a gate after `implement` to review
`quality-report.md`.

## Agents

| Agent | Stage | Does | Never |
| --- | --- | --- | --- |
| `business-analyst` | specify | Writes and validates `spec.md` in business language | Plans, technical artifacts, code |
| `solution-architect` | plan | Plan, research, data model, contracts, `design.md` | `spec.md`, production code |
| `backend-engineer` | implement | Tasks whose files are all in a *backend* area | Files outside its area |
| `frontend-engineer` | implement | Tasks whose files are all in a *frontend* area | Files outside its area |
| `quality-engineer` | after implement | Checks acceptance criteria, reviews quality and security, runs gates, writes a concise `quality-report.md` | Writing tests or code |

Tasks spanning several areas, or touching specs, root config or docs, run in the main
agent thread.

## Angular + FastAPI example

[`presets/serichai/overlays/angular-fastapi/`](./presets/serichai/overlays/angular-fastapi/)
is a worked example for an Angular SPA + FastAPI backend:

- `constitution.md` — a filled-in constitution with Angular and FastAPI Technology
  Standards.
- `templates/plan-template.md`, `templates/contracts-template.md` — plan and API
  contract templates with mandatory contracts. Copy them to
  `.specify/templates/overrides/` in your project.

Use it as a starting point and edit paths and rules for your project.

## Preset layout

```text
presets/serichai/
├── preset.yml                  # preset manifest
├── agents/                     # role agents (copy to .claude/agents/)
├── commands/                   # addenda appended to specify / plan / tasks / implement
├── templates/
│   ├── design-template.md      # design.md
│   └── constitution-addendum.md
└── overlays/angular-fastapi/   # filled-in example for one stack
```

## Original Spec Kit

[Spec Kit](https://github.com/github/spec-kit) is GitHub's open source toolkit for
**Spec-Driven Development (SDD)**: define *what and why* before *how*, then let an AI
coding agent carry a specification through planning, tasks and implementation. It
works with Claude Code, GitHub Copilot and other agents through `/speckit-*` skills.

Core flow: a constitution once per project, then per feature:

```text
/speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement → /speckit-converge
```

Optional quality steps: `/speckit-clarify`, `/speckit-checklist`, `/speckit-analyze`.
Opt-in extensions add **bug fixing** (`specify extension add bug`: assess → fix → test)
and **idea assessment** (`specify extension add assess`: intake → research → decide).

- [Documentation](https://github.github.io/spec-kit/) ·
  [SDD quickstart](https://github.github.io/spec-kit/quickstart.html) ·
  [Full methodology](./spec-driven.md)
- [Customization: extensions, presets, workflows](https://github.github.io/spec-kit/guides/customization.html)

## Syncing with upstream

```bash
git fetch upstream
git rebase upstream/main   # on serichai/custom; custom work lives only in presets/serichai/
```

## License

MIT, same as upstream Spec Kit. See [LICENSE](./LICENSE).
