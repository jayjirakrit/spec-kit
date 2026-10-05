// PostToolUse (Edit|Write): run ESLint --fix on an edited frontend-ng/ .ts/.html file so the
// import-boundary rules are enforced on every edit. Remaining errors go back to Claude (exit 2).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readInput, projectDir, relTarget } from './_lib.mjs';

const input = readInput();
const rel = relTarget(input);
if (!rel || !/^frontend-ng\/src\/.+\.(ts|html)$/i.test(rel)) process.exit(0);

const cwd = path.join(projectDir(input), 'frontend-ng');
const file = rel.slice('frontend-ng/'.length);
// Call the local ESLint entry directly: `npx eslint` costs ~40s of resolution per edit on Windows.
const eslint = path.join(cwd, 'node_modules', 'eslint', 'bin', 'eslint.js');
if (!fs.existsSync(eslint)) process.exit(0); // deps not installed yet (run npm ci)
const res = spawnSync(
  process.execPath,
  [eslint, '--fix', '--cache', '--cache-location', 'node_modules/.cache/eslint/', file],
  { cwd, encoding: 'utf8' },
);

if (res.status !== 0) {
  console.error(`ESLint errors remain in ${rel} after --fix:\n${res.stdout}${res.stderr}`.trim());
  process.exit(2);
}
