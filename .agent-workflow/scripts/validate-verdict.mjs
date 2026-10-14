import { readFile } from 'node:fs/promises';
import process from 'node:process';

const [, , verdictPath] = process.argv;

if (!verdictPath) {
  console.error('Usage: node validate-verdict.mjs <verdict.json>');
  process.exit(2);
}

const verdict = JSON.parse(await readFile(verdictPath, 'utf8'));
assertKeys(Object.keys(verdict).sort(), ['findings', 'test_audit', 'verdict'], 'verdict');
if (!['approved', 'changes_required'].includes(verdict.verdict)) {
  throw new TypeError('verdict must be approved or changes_required.');
}
if (!Array.isArray(verdict.findings)) throw new TypeError('findings must be an array.');
if (typeof verdict.test_audit !== 'string' || !verdict.test_audit.trim()) {
  throw new TypeError('test_audit must be a non-empty string.');
}

for (const [index, finding] of verdict.findings.entries()) {
  const label = `finding ${index + 1}`;
  const baseKeys = ['failure_scenario', 'file', 'line', 'severity', 'summary'];
  const guidanceKeys = ['requirement', 'required_outcome', 'suggested_approach', 'verification'];
  assertAllowedKeys(Object.keys(finding), [...baseKeys, ...guidanceKeys], label);
  assertRequiredKeys(Object.keys(finding), baseKeys, label);
  if (!['blocking', 'minor'].includes(finding.severity)) {
    throw new TypeError(`${label} has an invalid severity.`);
  }
  if (typeof finding.file !== 'string' || typeof finding.summary !== 'string' || typeof finding.failure_scenario !== 'string') {
    throw new TypeError(`${label} must contain string file, summary, and failure_scenario fields.`);
  }
  if (finding.line !== null && (!Number.isInteger(finding.line) || finding.line < 1)) {
    throw new TypeError(`${label} line must be null or a positive integer.`);
  }

  for (const key of ['requirement', 'required_outcome', 'verification']) {
    if (Object.hasOwn(finding, key) && finding[key] !== null && (typeof finding[key] !== 'string' || !finding[key].trim())) {
      throw new TypeError(`${label} ${key} must be null or a non-empty string.`);
    }
  }
  if (Object.hasOwn(finding, 'suggested_approach') && finding.suggested_approach !== null && (typeof finding.suggested_approach !== 'string' || !finding.suggested_approach.trim())) {
    throw new TypeError(`${label} suggested_approach must be null or a non-empty string.`);
  }
  if (finding.severity === 'blocking') {
    assertRequiredKeys(Object.keys(finding), guidanceKeys, `blocking ${label}`);
    for (const key of ['requirement', 'required_outcome', 'verification']) {
      if (typeof finding[key] !== 'string' || !finding[key].trim()) {
        throw new TypeError(`blocking ${label} ${key} must be a non-empty string.`);
      }
    }
  }
}

const hasBlocking = verdict.findings.some((finding) => finding.severity === 'blocking');
if ((verdict.verdict === 'approved') === hasBlocking) {
  throw new TypeError('approved requires zero blocking findings; changes_required requires at least one.');
}

console.log(`Validated ${verdict.verdict} verdict with ${verdict.findings.length} finding(s).`);

function assertKeys(actual, expected, label) {
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new TypeError(`${label} has unexpected or missing fields.`);
  }
}

function assertAllowedKeys(actual, allowed, label) {
  const unexpected = actual.filter((key) => !allowed.includes(key));
  if (unexpected.length) throw new TypeError(`${label} has unexpected fields: ${unexpected.join(', ')}.`);
}

function assertRequiredKeys(actual, required, label) {
  const missing = required.filter((key) => !actual.includes(key));
  if (missing.length) throw new TypeError(`${label} is missing required fields: ${missing.join(', ')}.`);
}
