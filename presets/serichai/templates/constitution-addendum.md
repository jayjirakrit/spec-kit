## Simple, Surgical, Verifiable Changes (added by the `serichai` preset)

Implementation MUST do the simplest thing that satisfies the task: no speculative
abstractions, configurability, or features the spec/plan did not ask for. Changes MUST
be surgical — touch only the files and lines the current task requires; no drive-by
refactors, reformatting, or cleanup of unrelated code (mention it instead). Match
surrounding style. Open assumptions MUST be surfaced (in `spec.md` via the clarify
step, or in the implementer's report) rather than silently guessed. Every task in
`tasks.md` MUST state how it is verified (a command, test, or observable behavior) and
is done only when that check passes.
