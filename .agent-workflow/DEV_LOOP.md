# Canonical coder/reviewer development loop

This document is the source of truth for both Claude and Codex adapters. One product orchestrates a session at a time. The orchestrator does not write product code during this workflow: a coder implements, the orchestrator runs objective gates, and a fresh reviewer audits each review round.

## Activation

Run this workflow only when the user explicitly invokes `$dev-loop` or `/dev-loop`, runs the managed `dev-loop` CLI, or unambiguously asks to run or use dev-loop by name. Do not activate it merely because an implementation task is non-trivial, references an issue, or would benefit from planning or review. Without an explicit invocation, do not create dev-loop artifacts or dispatch dev-loop agents.

## Pre-loop plan and approval

The plan phase is resumable session preparation, not the coder/reviewer loop. There are no separate draft and final-proposal phases. Before approval, do not run gates, spawn a coder or reviewer, modify product code, or treat silence or the initial invocation as permission to begin implementation.

1. Read task sources, `SPECIFICATION.md`, project configuration, branch, clean-tree state, baseline commit, and the smallest relevant repository surface. Except for plan-session artifacts, this phase is read-only.
2. Create the session and `plan.json` with status `awaiting_plan_approval`, then append `session_start`. Persist and show one complete, source-attributed plan containing the objective, scope, current and desired behavior, acceptance criteria with verification, constraints, non-goals, assumptions, configured gates, risks, and material questions. Append `plan_proposal`.
3. Ask the user either to approve the displayed plan or provide amendments, then stop and wait. A managed CLI invocation must print the exact resume form: `dev-loop run --provider <provider> --resume <session-id> --task "<approval or amendments>"`.
4. If the user provides amendments, incorporate all of them, resolve material questions, append `plan_revision`, remain in `awaiting_plan_approval`, display the revised complete plan once, and ask for approval or further amendments. A revision replaces the plan awaiting approval; it does not create a separate final-proposal phase.
5. If the user cancels, set status to `aborted` and append `session_end`. One explicit approval of the currently displayed plan appends `plan_confirmation` with `confirmed: true`, changes status to `planned`, and immediately permits setup and the operational loop to start. Do not ask for another confirmation.

Never infer approval from the original request, silence, a generic continuation request, or an ambiguous response.

## Constants and artifacts

- Project configuration: `.dev-loop/config.json`.
- The initial review-iteration limit, protected branches, gate commands, and test-integrity paths come from project configuration. Persist the active limit in `plan.json` so user-approved extensions survive resumption.
- Session directory: `.dev-loop/sessions/<UTC-yyyyMMdd-HHmmss>-<task-slug>/`.
- Shared plan: `<session-dir>/plan.json`, following `PLAN.template.json`.
- Frozen detailed specification: `<session-dir>/specification.json`, following `SPECIFICATION.template.json` and `SPECIFICATION.md`.
- Audit log: `<session-dir>/events.jsonl`.
- Pending event: `<session-dir>/event.json`.

Create the task slug from three to five lowercase hyphenated words. Keep `.dev-loop/` ignored and outside the reviewer diff.

Write events by first writing a valid JSON object to `event.json`, then running:

```text
node .agent-workflow/scripts/append-event.mjs <events.jsonl> <event.json>
```

The script validates, serializes, and appends the event, preventing invalid JSON escapes. Obtain every timestamp from the shell. Update `plan.json` after every state transition so another Claude or Codex session can resume from artifacts alone.

Every event contains `ts`, `event`, and `iteration`. Use `null` for the pre-loop plan/setup events and `session_end`. The first coder round is iteration `1`; every event produced while that round is active uses `1`, including gate retries and the reviewer decision. Increment exactly once, immediately before dispatching review fixes to the coder, so the next round uses `2`. Persist the same active number in `plan.json.iteration`. Add these payloads:

| Event | Required payload |
|---|---|
| `session_start` | user prompt, configuration, baseline commit, orchestrator product, and branch metadata |
| `plan_proposal` | complete displayed plan, source references, assumptions, risks, material questions, and requested user action |
| `plan_revision` | user direction, amendments applied, resolved questions, and the complete replacement plan displayed for approval |
| `plan_confirmation` | `confirmed: true`, exact user approval, and the approved plan identity |
| `plan` | exact source-attributed specification, baseline gate results, and planning notes |
| `coder_dispatch` | spawn/follow-up mode, agent ID, and whether spec, repository orientation, normalized blockers, or gate failures were sent |
| `coder_result` | changed files, advisory targeted-test results, disputes, and uncertainties |
| `gates` | authoritative gate receipt, workspace and gate-configuration fingerprints, command results, and test-integrity audit |
| `reviewer_dispatch` | fresh agent ID and the artifact names supplied |
| `reviewer_verdict` | `workspace_fingerprint` holding the reviewed workspace fingerprint, and the valid reviewer verdict object without rewriting its content |
| `decision` | reasoning, action, accepted and rejected blockers, normalized blocker instructions, evaluated disputes, user continuation choices, active iteration limit, and minor dispositions |
| `minor_fix_dispatch` | resumed coder ID, original approved fingerprint, and selected minor findings |
| `minor_fixes` | fixes applied, changed files, original approved fingerprint, and resulting workspace fingerprint |
| `minor_review_dispatch` | resumed reviewer ID, original findings, post-review delta, new fingerprint, and new gate receipt; or fresh-review escalation reason |
| `minor_review_verdict` | `workspace_fingerprint` holding the reviewed workspace fingerprint, and the resumed reviewer's valid delta verdict |
| `session_end` | outcome, iteration count, start/end timestamps, final and review-coverage fingerprints, uncommitted state, and summary |

## 1. Set up

1. Require a preceding `plan_confirmation` for the exact currently displayed plan. Revalidate `.dev-loop/config.json`, branch, clean-tree state, and baseline commit. Do not run on a configured protected branch without explicit override. If repository state or evidence materially changes the approved plan, return to `awaiting_plan_approval`, display the replacement plan once, and obtain one new approval for it.
2. Run every configured baseline gate as a separate process with its exact configured timeout. Do not batch gates or rerun a completed gate merely because another gate timed out. Abort and append `session_end` if any baseline gate fails.
3. Materialize the approved plan as `<session-dir>/specification.json`, validate it with `validate-specification.mjs`, require no material open questions, mirror criterion behavior strings into `plan.json.acceptance_criteria`, store its path in the plan, and include the complete frozen specification plus baseline results in the `plan` event. Do not add inferred implementation choices after approval.
4. Inspect the smallest task-relevant surface and compile concise, non-normative repository orientation for the initial coder. Include only verified navigation and implementation evidence that reduces rediscovery. The frozen specification remains authoritative.
5. Initialize the disputed-findings list as empty, set `iteration_limit` from configured `max_review_iterations`, and set status to `in_progress`.

If a session directory already represents unfinished work, verify its branch and baseline against Git, read the plan and log, and resume from its exact status. For `awaiting_plan_approval`, continue the single-plan approval protocol and never skip its required user decision. Agent thread IDs are product-local hints only: never send a message to an ID created by another product or top-level session.

### Reopen a legacy maxed-out session

When the user asks to resume an existing session whose plan status is `max_iterations` and whose last event is `session_end`:

1. Treat it as terminal until the user explicitly confirms reopening. If they decline, change nothing.
2. Verify the saved branch and baseline against Git, confirm the session diff is still present and attributable to that baseline, and rerun configured gates. If state has diverged or gates cannot run safely, leave the old session closed and propose a new session instead.
3. Read the unresolved blocking findings and exact specification from the saved artifacts. Do not reconstruct them from memory.
4. Reset `iteration_limit` to `iteration + config.max_review_iterations`, giving the reopened session a fresh configured block of review iterations. This also migrates legacy plans that have no `iteration_limit`.
5. Set status to `in_progress`, update `next_action`, and append a `decision` event with action `reopen`, the user's authorization, previous terminal status, prior iteration, previous limit when present, new limit, gate results, and remaining blockers. The historical `session_end` remains in the append-only log.
6. Resume with the saved blockers. Reuse the coder only when its thread is valid in the current product and top-level session; otherwise spawn a replacement coder from repository artifacts.

After reopening, use the normal cap behavior. When the reset limit is reached, pause in `awaiting_user` and ask again whether to continue or stop.

## 2. Implement

Immediately before the first coder dispatch, set and persist `plan.json.iteration` to `1`. Spawn the configured coder with the complete frozen `specification.json` and the compiled repository orientation, and write `coder_dispatch` with iteration `1`. Keep the orientation compact and label it non-normative. Store the coder's product and thread ID in `plan.json` as transient runtime metadata.

Within the same top-level session, keep the coder thread alive. For gate failures or review fixes, send a follow-up task to that same coder containing only:

- normalized accepted blocker instructions;
- raw gate failures; and
- the unchanged specification when needed for clarity.

Each normalized blocker instruction contains only the finding location and summary, concrete failure scenario, violated frozen requirement, required observable outcome, and objective verification. Do not forward the reviewer's `suggested_approach`, reasoning, prior verdict prose, logs, or unrelated history. Spawn a replacement coder only if the existing coder is unavailable, belongs to another session/product, or repeatedly drifts from scope. Before dispatching a replacement, recompile the repository orientation from the current tree and send it with the unchanged specification plus current normalized blockers and raw gate failures. Log every dispatch and result.

The coder must follow `CODER.md` and return its structured report.

The coder uses targeted tests only for implementation feedback. It must not run the complete configured gate suite before returning. Targeted results are advisory and never replace or satisfy the orchestrator's authoritative gate execution.

## 3. Run gates

The orchestrator is the single authoritative gate runner. After each coder handoff, run every configured gate exactly once against the stable candidate workspace. Never ask or allow the reviewer to rerun configured gates, and never treat the coder's advisory targeted-test results as gate evidence.

Immediately before running gates, create a workspace fingerprint covering the baseline commit, the tracked binary diff from that baseline, and the sorted paths, kinds, sizes, and content hashes of untracked files included in the candidate. Use:

```text
node .agent-workflow/scripts/fingerprint-workspace.mjs <baseline_commit> [repository-root]
```

The fingerprint operation must not change the repository index. Never run `git add -N` against the real index to expose untracked files. Also fingerprint the configured gate names, commands, timeouts, and working directory. Record one gate receipt containing the iteration, both fingerprints, each command, start and end timestamps, exit code, status, and compact output summary. Store the receipt in the `gates` event and supply it to the reviewer as the gate output.

Do not retry a completed gate against an unchanged workspace merely because it failed, timed out, or another gate produced a different result. Forward the raw failure to the coder. After any coder change, create a new fingerprint and run the configured gates once for that new candidate.

Run `git diff <baseline_commit> -- <configured test-integrity paths>` and audit whether an existing test or assertion was deleted or weakened. Treat an unauthorized weakening as blocking unless project configuration explicitly allows existing test changes.

If a gate fails, log a `gate_retry` decision and send the raw failure to the same coder. Gate retries do not consume a review iteration.

## 4. Review

After green gates, recompute both fingerprints and require them to match the authoritative gate receipt. A mismatch makes the receipt stale: do not dispatch a reviewer until the orchestrator has run the configured gates once against the current candidate.

Materialize a read-only review bundle before dispatch, including a complete binary candidate patch and an untracked-file manifest:

```text
node .agent-workflow/scripts/materialize-review-bundle.mjs <baseline_commit> <session-dir>/review-<iteration> [repository-root]
```

The script uses an isolated temporary Git index to include untracked files in the patch without changing the repository index. Require the bundle fingerprint to match the authoritative gate receipt. This bundle is mandatory for a reviewer without shell access and is the preferred input for every reviewer.

Then spawn a new configured reviewer. Never reuse a reviewer from an earlier round. Give it exactly:

1. the complete frozen `specification.json` verbatim;
2. the materialized candidate patch and untracked-file manifest;
3. the authoritative gate receipt and its compact output; and
4. accepted disputed findings with their justifications.

Do not give the reviewer coder messages, orchestrator reasoning, previous verdicts, or the audit log. The reviewer follows `REVIEWER.md` and returns only the specified JSON verdict. Every blocking finding must identify its violated frozen requirement, required observable outcome, objective verification, and a non-binding `suggested_approach` or `null`. Save the verdict to a temporary JSON file and run `node .agent-workflow/scripts/validate-verdict.mjs <verdict.json>`. If validation fails, ask that same reviewer once to correct its JSON before proceeding.

The reviewer audits receipt completeness, the recorded passing commands, and the orchestrator's freshness attestation. Fingerprint recomputation remains the orchestrator's responsibility, especially when the reviewer has no shell. The reviewer audits tests statically and must not execute configured gates or other test, lint, typecheck, or build suites. When dynamic confirmation would help a suspected defect, the reviewer reports a concrete failure scenario and leaves reproduction to the orchestrator's decision process.

## 5. Decide and iterate

Write a `decision` event every round with real reasoning and one of: `iterate`, `approve`, `gate_retry`, `await_user`, `continue`, `reopen`, `stop`, `escalate`, or `abort`.

- Evaluate every blocking finding directly against the frozen specification, code, and tests. Record whether it was accepted or rejected and why. Treat `suggested_approach` only as non-binding decision input; never let it add behavior or constraints absent from the specification.
- If no accepted blocking findings remain, record the rejections and continue to approval; a reviewer's `changes_required` label does not override the orchestrator's evidence-based judgment.
- If accepted blocking findings remain below the active `iteration_limit`, normalize each one into its location and summary, failure scenario, violated requirement, required outcome, and verification. Write the `iterate` decision with the current iteration and normalized instructions, increment and persist `plan.json.iteration` exactly once, then send only those instructions to the same coder. The follow-up `coder_dispatch` and all subsequent round events use the incremented iteration.
- Evaluate coder disputes directly against the code. Record whether each justification was accepted.
- Minor findings never trigger another blocking-review iteration by themselves. If none will be fixed now, record them as deferred and finish against the already reviewed fingerprint.
- When applying unambiguous, tightly scoped minor fixes, treat the current approval as covering only the pre-fix fingerprint. Append `minor_fix_dispatch`, resume the same coder without incrementing the iteration, and send only the selected minor findings. After its result, recompute the workspace fingerprint, append `minor_fixes`, and rerun every configured gate exactly once for the changed candidate.
- Compare the post-review change against the approved fingerprint. A fix is eligible for focused delta verification only when it remains confined to the selected findings and does not change public behavior or APIs, add dependencies, broaden scope, or substantially change shared infrastructure. For an eligible delta, append `minor_review_dispatch` and resume the same reviewer that reported the findings. Give it only the original minor findings, the complete post-review delta and changed files, the pre-fix and post-fix fingerprints, and the new authoritative gate receipt. Do not give it coder messages, orchestrator reasoning, or the audit log.
- The resumed reviewer performs the `REVIEWER.md` post-minor-fix delta procedure and returns the normal verdict JSON. Validate it with `validate-verdict.mjs`, append `minor_review_verdict`, and record the post-fix fingerprint as review-covered. It does not rerun gates and does not repeat the full review.
- If the delta crosses the focused-review boundary, the original reviewer is unavailable, or the delta reviewer reports that a full review is required, spawn a fresh reviewer and use the normal complete review procedure against the post-fix fingerprint. A new blocking concern returns to the normal decision loop; reject or normalize it exactly like any other blocking finding.
- When blocking findings remain and `iteration` reaches the active `iteration_limit`, do not finish automatically. Set plan status to `awaiting_user`, set `next_action` to ask whether to continue or stop, and append an `await_user` decision containing the remaining blockers, gate state, current iteration, and active limit. Do not append `session_end` while waiting.
- Ask the user whether to continue or stop the loop. If the user continues without specifying a count, authorize one additional review iteration; if they specify a positive count, extend by that count. Record a `continue` decision with the current iteration, increase and persist `iteration_limit`, restore status to `in_progress`, increment and persist `plan.json.iteration` exactly once, then forward the current blockers to the coder using that new iteration. Ask again whenever the extended limit is reached.
- If the user stops, record a `stop` decision, set status to `max_iterations`, append `session_end`, and report the unresolved blockers. If the user has not answered, leave the session resumable in `awaiting_user`.
- Stop early for oscillation when the same finding returns in two non-consecutive rounds.
- Reject unrelated diff growth as scope creep.
- Treat a first-round approval of a non-trivial diff skeptically unless the test audit is substantive.

## 6. Finish

For an `approved` terminal outcome, recompute the final workspace fingerprint and require a reviewer verdict or minor-review verdict covering that exact fingerprint. The earlier review continues to cover unchanged code; the focused delta verdict covers only the post-review change. Record both `final_workspace_fingerprint` and the identical `review_coverage_fingerprint` in `session_end`. Never describe a gate-only post-review candidate as reviewer-approved.

For a terminal outcome, set the plan status to `approved`, `max_iterations`, `escalated`, or `aborted`. `awaiting_user` is non-terminal and must not have `session_end`. For a terminal status, append `session_end`, then run:

```text
node .agent-workflow/scripts/validate-session.mjs <plan.json> <events.jsonl>
```

Report acceptance-criterion coverage, actual gate results, iterations and findings, accepted disputes, deferred minor suggestions, and the session directory. Work remains uncommitted unless the user asks for a commit.
