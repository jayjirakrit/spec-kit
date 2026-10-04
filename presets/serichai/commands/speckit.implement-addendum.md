## Simple and surgical (added by the `serichai` preset)

Do the simplest thing that meets each task. Touch only files the task requires; report
unrelated problems instead of fixing them. Report any deviation from `design.md` and any
assumption you made. Run the task's `Verify:` check before marking it done.

## Delegation to engineer agents (added by the `serichai` preset)

If engineer agents are available, step 6's per-task execution is delegated by area. The
areas and their paths come from the constitution's **Technology Standards** section:

- All of a task's target files inside the area with role *backend* → `backend-engineer`;
  role *frontend* → `frontend-engineer`.
- Mixed areas, or files outside every area (specs, root config, docs) → execute here.
- Keep dependency order and `[P]` rules across dispatches. Subagents report task IDs
  done/failed; this thread applies the `[X]` edits in `tasks.md`.

## Quality verification (added by the `serichai` preset)

After step 9, before the post-execution hooks, if a `quality-engineer` agent is
available:

1. Dispatch `quality-engineer` with FEATURE_DIR. It reviews the implementation against
   the acceptance criteria and for quality and security, runs the quality gates and
   writes `FEATURE_DIR/quality-report.md`. It never writes tests or code.
2. If the verdict is FAIL, route each finding (including missing-test findings) once to
   the engineer agent that owns its area (or fix it here if it is outside every area), then re-dispatch
   `quality-engineer` once.
3. If it still fails, stop and report the remaining findings to the user — do not loop
   further.
4. Include the verdict and a link to `quality-report.md` in the Completion Report. The
   feature is done only when the verdict is PASS or PASS WITH NOTES.
