import process from 'node:process';
import { collectWorkspaceState, publicWorkspaceState } from './workspace-state.mjs';

const [, , baseline, repositoryRoot] = process.argv;

if (!baseline) {
  console.error('Usage: node fingerprint-workspace.mjs <baseline-commit> [repository-root]');
  process.exit(2);
}

const state = await collectWorkspaceState(baseline, repositoryRoot ?? process.cwd());
console.log(JSON.stringify(publicWorkspaceState(state), null, 2));
