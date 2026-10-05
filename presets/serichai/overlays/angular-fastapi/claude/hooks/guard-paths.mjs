// PreToolUse (Edit|Write|NotebookEdit): block edits to paths CLAUDE.md marks as off-limits.
// Exit 2 blocks the tool call and shows stderr to Claude.
import fs from 'node:fs';
import path from 'node:path';
import { readInput, projectDir, relTarget } from './_lib.mjs';

const input = readInput();
const rel = relTarget(input);
if (!rel) process.exit(0);
const lower = rel.toLowerCase();

// Legacy React app is frozen only while the Angular app still lives in frontend-ng/.
// After the spec 007 cutover renames frontend-ng/ -> frontend/, this rule switches off by itself.
const angularNotYetRenamed = fs.existsSync(path.join(projectDir(input), 'frontend-ng'));
if (angularNotYetRenamed && lower.startsWith('frontend/')) {
  console.error(
    `Blocked: ${rel} is in the legacy React app (frontend/), which is frozen until the ` +
      'spec 007 cutover. Make the change in frontend-ng/ instead.',
  );
  process.exit(2);
}

if (lower.startsWith('backend/data/') && /\.xls[xm]?$/.test(lower)) {
  console.error(
    `Blocked: ${rel} is an Excel template bind-mounted into deployments (HOST_DATA_DIR). ` +
      'Ask the user to change it by hand.',
  );
  process.exit(2);
}
