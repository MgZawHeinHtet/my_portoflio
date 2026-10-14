import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  collectWorkspaceState,
  createCompleteCandidateDiff,
  publicWorkspaceState,
} from './workspace-state.mjs';

const [, , baseline, outputDirectory, repositoryRoot] = process.argv;

if (!baseline || !outputDirectory) {
  console.error('Usage: node materialize-review-bundle.mjs <baseline-commit> <output-directory> [repository-root]');
  process.exit(2);
}

// Collect before creating the bundle so an output path inside the repository
// cannot accidentally become part of the candidate it describes.
const state = await collectWorkspaceState(baseline, repositoryRoot ?? process.cwd());
const completeDiff = await createCompleteCandidateDiff(state);
const stateAfterMaterialization = await collectWorkspaceState(baseline, repositoryRoot ?? process.cwd());
if (stateAfterMaterialization.workspaceFingerprint !== state.workspaceFingerprint) {
  throw new Error('Workspace changed while the review bundle was being materialized; discard it and retry after the candidate is stable.');
}

const absoluteOutput = path.resolve(outputDirectory);
await mkdir(absoluteOutput, { recursive: true });

const patchPath = path.join(absoluteOutput, 'candidate.patch');
const manifestPath = path.join(absoluteOutput, 'untracked-files.json');
const metadataPath = path.join(absoluteOutput, 'review-bundle.json');
const publicState = publicWorkspaceState(state);
await writeFile(patchPath, completeDiff);
await writeFile(manifestPath, `${JSON.stringify(publicState.untracked_files, null, 2)}\n`, 'utf8');
await writeFile(metadataPath, `${JSON.stringify({
  format_version: 1,
  baseline_commit: state.baselineCommit,
  workspace_fingerprint: state.workspaceFingerprint,
  candidate_patch: path.basename(patchPath),
  candidate_patch_bytes: completeDiff.length,
  untracked_manifest: path.basename(manifestPath),
  note: 'candidate.patch was generated with an isolated temporary Git index; the repository index was not changed.',
}, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  workspace_fingerprint: state.workspaceFingerprint,
  patch: patchPath,
  manifest: manifestPath,
  metadata: metadataPath,
}, null, 2));
