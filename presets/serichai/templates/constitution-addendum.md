## Simple, Surgical, Verifiable Changes (added by the `serichai` preset)

Implementation MUST do the simplest thing that satisfies the task: no speculative
abstractions, configurability, or features the spec/plan did not ask for. Changes MUST
be surgical — touch only the files and lines the current task requires; no drive-by
refactors, reformatting, or cleanup of unrelated code (mention it instead). Match
surrounding style. Open assumptions MUST be surfaced (in `spec.md` via the clarify
step, or in the implementer's report) rather than silently guessed. Every task in
`tasks.md` MUST state how it is verified (a command, test, or observable behavior) and
is done only when that check passes. A feature is done only when its
`quality-report.md` verdict (written by the quality engineer) is PASS or PASS WITH NOTES.

## Technology Standards (added by the `serichai` preset)

Spec-Kit agents read this section to learn the project's stack. List one entry per
area (e.g. backend, frontend, mobile, data). Remove areas that don't exist.

### Area: [name] — role: [backend | frontend | other]

- **Path**: [folder, e.g. `server/`]
- **Stack**: [language, framework, key libraries]
- **Hard constraints**: [layering, naming, typing, state/data-access rules, boundaries]
- **Reference code**: [existing files that show the pattern to copy]
- **Quality gates**: [lint / type-check / test commands that MUST pass]
- **Test patterns**: [where tests live, framework, naming, e.g. `tests/test_*.py`, pytest]
- **Verification**: [how to exercise it for real, e.g. run server + browser walkthrough]

### Cross-area contract

[How areas communicate, where contracts live (`contracts/*.md`), and naming/casing
rules for the wire format.]
