## Delegation to business-analyst (added by the `serichai` preset)

If a `business-analyst` agent is available, writing the spec is delegated to it:

1. Do steps 1-3 here (short name, feature directory, `spec.md` from the template,
   `.specify/feature.json`).
2. Dispatch one `business-analyst` subagent with SPEC_FILE, FEATURE_DIR, the resolved
   spec-template path and the full feature description. It performs steps 4-8 (fill the
   spec, write and validate `checklists/requirements.md`).
3. Read its fixed report block. If `OPEN QUESTIONS` is not `none`, ask the user all of
   them together (at most 3, with its suggested answers as options), then re-dispatch `business-analyst` with the
   answers so it updates the spec and checklist.
4. Continue here with the Mandatory Post-Execution Hooks and Completion Report.

If no `business-analyst` agent exists, run steps 4-8 inline as written above.
