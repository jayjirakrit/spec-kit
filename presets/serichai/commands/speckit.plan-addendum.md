## Design sketch step (added by the `serichai` preset)

In Phase 1, also write `design.md` from the `design-template` template: a 250-400 line
review aid showing the KEY implementation files as short key-path snippets (10-40 lines
each; never elide branching, error handling or state transitions), plus approach, key
decisions, flow, risks and open questions. Read real precedent code first and flag
divergences. Reference contracts/data-model instead of restating them; never edit
`spec.md`. This is the only artifact allowed to contain implementation code, and it is
guidance, not final code. Do not inventory every file or include test code.

## Delegation to solution-architect (added by the `serichai` preset)

If a `solution-architect` agent is available, Phases 0 and 1 (research, data model,
contracts, quickstart, `design.md`, `plan.md`) are delegated to it: dispatch one
subagent with FEATURE_SPEC, IMPL_PLAN, the feature directory, BRANCH and any user
guidance, and wait for it before the post-execution hooks. Its fixed report block lists
the artifacts written (`COMPLETED`) and open questions for the Completion Report.
