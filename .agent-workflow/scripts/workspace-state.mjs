import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { copyFile, lstat, mkdtemp, readFile, readlink, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function collectWorkspaceState(baseline, requestedRoot = process.cwd()) {
  const repoRoot = (await runGit(['rev-parse', '--show-toplevel'], { cwd: requestedRoot })).toString('utf8').trim();
  const baselineCommit = (await runGit(['rev-parse', '--verify', `${baseline}^{commit}`], { cwd: repoRoot })).toString('utf8').trim();
  const trackedDiff = await runGit(['diff', '--binary', '--no-ext-diff', baselineCommit, '--'], { cwd: repoRoot });
  const rawUntracked = await runGit(['ls-files', '--others', '--exclude-standard', '-z'], { cwd: repoRoot });
  const untrackedPaths = splitNullTerminated(rawUntracked).sort(compareUtf8);
  const untrackedFiles = [];

  for (const relativePath of untrackedPaths) {
    const absolutePath = resolveCandidatePath(repoRoot, relativePath);
    const stat = await lstat(absolutePath);
    let kind;
    let content;
    if (stat.isSymbolicLink()) {
      kind = 'symlink';
      content = Buffer.from(await readlink(absolutePath), 'utf8');
    } else if (stat.isFile()) {
      kind = 'file';
      content = await readFile(absolutePath);
    } else {
      throw new TypeError(`Unsupported untracked candidate path: ${relativePath}`);
    }
    untrackedFiles.push({
      path: normalizeSeparators(relativePath),
      absolutePath,
      kind,
      bytes: content.length,
      sha256: sha256(content),
    });
  }

  const trackedDiffSha256 = sha256(trackedDiff);
  const fingerprintInput = {
    format_version: 1,
    baseline_commit: baselineCommit,
    tracked_diff_sha256: trackedDiffSha256,
    untracked_files: untrackedFiles.map(({ path: filePath, kind, bytes, sha256: contentHash }) => ({
      path: filePath,
      kind,
      bytes,
      sha256: contentHash,
    })),
  };

  return {
    repoRoot,
    baselineCommit,
    trackedDiff,
    trackedDiffSha256,
    trackedDiffBytes: trackedDiff.length,
    untrackedFiles,
    workspaceFingerprint: sha256(Buffer.from(JSON.stringify(fingerprintInput), 'utf8')),
  };
}

export async function createCompleteCandidateDiff(state) {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'dev-loop-index-'));
  const temporaryIndex = path.join(temporaryDirectory, 'index');
  const env = { ...process.env, GIT_INDEX_FILE: temporaryIndex };

  try {
    // Seed the temporary index from the real index rather than from the baseline
    // tree. A path that is staged, or committed after the baseline, is absent
    // from the baseline tree and is also skipped by `ls-files --others` because
    // it is already in the real index; a baseline-seeded index therefore drops
    // it from the patch while the fingerprint still covers it. GIT_INDEX_FILE
    // keeps every write below off the real index.
    await copyFile(await resolveIndexPath(state.repoRoot), temporaryIndex);
    if (state.untrackedFiles.length > 0) {
      const pathspec = Buffer.concat(state.untrackedFiles.flatMap((file) => [
        Buffer.from(file.path, 'utf8'),
        Buffer.from([0]),
      ]));
      await runGit(
        ['add', '-N', '--pathspec-from-file=-', '--pathspec-file-nul'],
        { cwd: state.repoRoot, env, input: pathspec },
      );
    }
    const candidateDiff = await runGit(
      ['diff', '--binary', '--no-ext-diff', state.baselineCommit, '--'],
      { cwd: state.repoRoot, env },
    );
    await assertCandidateDiffIsComplete(state, env);
    return candidateDiff;
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

export function publicWorkspaceState(state) {
  return {
    format_version: 1,
    repository_root: state.repoRoot,
    baseline_commit: state.baselineCommit,
    workspace_fingerprint: state.workspaceFingerprint,
    tracked_diff_sha256: state.trackedDiffSha256,
    tracked_diff_bytes: state.trackedDiffBytes,
    untracked_files: state.untrackedFiles.map(({ path: filePath, kind, bytes, sha256: contentHash }) => ({
      path: filePath,
      kind,
      bytes,
      sha256: contentHash,
    })),
  };
}

// `--git-path index` honours GIT_INDEX_FILE and resolves the per-worktree index
// of a linked worktree, both of which a literal `.git/index` would get wrong.
async function resolveIndexPath(repoRoot) {
  const indexPath = (await runGit(['rev-parse', '--git-path', 'index'], { cwd: repoRoot })).toString('utf8').trim();
  return path.resolve(repoRoot, indexPath);
}

// The patch and the fingerprint must describe the same candidate. Compare the
// paths each one covers and fail loudly rather than shipping a bundle that is
// silently short of files, even if the index handling above regresses again.
async function assertCandidateDiffIsComplete(state, env) {
  const patchedPaths = new Set(await changedPaths(state, env));
  const expectedPaths = new Set([
    ...await changedPaths(state),
    ...state.untrackedFiles.map((file) => file.path),
  ]);
  const missing = [...expectedPaths].filter((candidate) => !patchedPaths.has(candidate)).sort(compareUtf8);
  if (missing.length > 0) {
    throw new Error(`Candidate patch omits ${missing.length} path(s) covered by the workspace fingerprint: ${missing.join(', ')}.`);
  }
}

async function changedPaths(state, env) {
  const raw = await runGit(
    ['diff', '--name-only', '-z', '--no-ext-diff', state.baselineCommit, '--'],
    { cwd: state.repoRoot, env },
  );
  return splitNullTerminated(raw).map(normalizeSeparators);
}

function runGit(args, { cwd, env = process.env, input } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env, windowsHide: true });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) return resolve(Buffer.concat(stdout));
      reject(new Error(`git ${args.join(' ')} failed (${code}): ${Buffer.concat(stderr).toString('utf8').trim()}`));
    });
    if (input) child.stdin.end(input);
    else child.stdin.end();
  });
}

function splitNullTerminated(buffer) {
  if (buffer.length === 0) return [];
  return buffer.toString('utf8').split('\0').filter(Boolean);
}

function normalizeSeparators(candidate) {
  return candidate.split('\\').join('/');
}

function compareUtf8(left, right) {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}

function resolveCandidatePath(repoRoot, relativePath) {
  const absolutePath = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, absolutePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new TypeError(`Untracked path escapes the repository: ${relativePath}`);
  }
  return absolutePath;
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}
