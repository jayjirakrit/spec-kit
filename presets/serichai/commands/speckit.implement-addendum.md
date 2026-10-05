## Simple and surgical (added by the `serichai` preset)

Do the simplest thing that meets each task. Touch only files the task requires; report
unrelated problems instead of fixing them. Report any deviation from `design.md` and any
assumption you made. Run the task's `Verify:` check before marking it done.

## Delegation to engineer agents (added by the `serichai` preset)

If engineer agents are available, step 6's per-task execution is delegated by area. The
areas and their paths come from the constitution's **Technology Standards** section:

- All of a task's target files inside the area with role *backend* -> `backend-engineer`;
  role *frontend* -> `frontend-engineer`.
- Mixed areas, or files outside every area (specs, root config, docs) -> execute here.
- Keep dependency order and `[P]` rules across dispatches; independent `[P]` tasks may be
  dispatched concurrently, even across the two engineers.
- Each subagent ends with the fixed report block from its agent file (`STATUS`,
  `COMPLETED`, `FAILED`, `FILES CHANGED`, `VERIFICATION`, `ASSUMPTIONS / DEVIATIONS`,
  `OPEN QUESTIONS`). This thread applies the `[X]` edits in `tasks.md` from `COMPLETED`,
  treats `FAILED` entries as failed tasks, carries `ASSUMPTIONS / DEVIATIONS` into the
  Completion Report, and treats a report without the block as `STATUS: partial` (check
  the files yourself).

## Quality verification (added by the `serichai` preset)

**Deferred mode**: if the caller says to defer quality verification (`/speckit-execution`
does this on build-loop iterations that converge may follow), skip this section and say
so in the Completion Report.

After step 9, before the post-execution hooks, if a `quality-engineer` agent is
available, verification is pipelined per area so one area's review overlaps the other's
work:

1. **Area lanes, started early**: once every task in this run whose files lie in an area
   has reported `STATUS: done`, dispatch `quality-engineer` for that area
   (`run_in_background: true`) with FEATURE_DIR, `SCOPE: <area>`, `MODE: fresh` and that
   engineer's `VERIFICATION` lines. Skip an area with no tasks in this run.
2. **Per-lane fix pass**: on a FAIL verdict, route each production-code finding once to
   that area's engineer, then re-dispatch the lane once with `MODE: delta`, the changed
   files and the findings they address. If it still fails, keep its findings; don't loop.
3. **Integration**: after all tasks and lanes finish, dispatch `quality-engineer` once
   with `SCOPE: integration` (foreground, unless the caller runs `/code-review`
   alongside). It checks the contract across areas and files outside every area, then
   merges the area reports into `FEATURE_DIR/quality-report.md`; its `COMPLETED` field
   carries the final verdict. On an integration FAIL, route findings once (to the owning
   engineer, or fix here if outside every area), then re-dispatch
   `SCOPE: integration`, `MODE: delta` once.
4. If it still fails, stop and report the remaining findings; do not loop further.
5. Include the verdict and a link to `quality-report.md` in the Completion Report. The
   feature is done only when the verdict is PASS or PASS WITH NOTES.

If every task in the run is in one area, or none are, dispatch a single `SCOPE: full`
review instead of lanes plus integration.
