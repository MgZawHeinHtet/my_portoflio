<!-- dev-loop-kit:start -->
## Development loop

Use the `dev-loop` repository skill only when the user explicitly invokes `$dev-loop`, uses the managed `dev-loop` CLI, or asks to run or use dev-loop by name. Never auto-activate it for an ordinary implementation request. Read `.agent-workflow/DEV_LOOP.md` as the canonical procedure and `.dev-loop/config.json` for project-specific gates and paths.

Within one Codex task, spawn the coder once and send follow-up tasks to that same coder for gate failures and review fixes. Spawn a fresh reviewer for every review round. When resuming work started by Claude or another Codex task, create a new coder from the shared plan and repository state.

## Issues

Use `$format-issue` to guide issue titles and descriptions when creating or updating issues. Read `.agent-workflow/ISSUE_FORMAT.md`. Keep descriptions in Problem, Specification, and Acceptance sections with concise bullets. This skill formats content only; the surrounding create/update workflow owns provider access, approval, and saving.

## Code insight

Use `$code-insight` to understand existing code flows in PRs, working-tree changes, branches, or commit ranges from the top down. Follow `.agent-workflow/CODE_INSIGHT.md`, capture the scope with the global CLI, explain the relevant sources, and immediately run `dev-loop code-insight --open <report.json> --detach`. Include available PR issue/comment context. Skip defect review, tests, probes, separate validation, and browser QA unless separately requested. Honor explicit JSON-only requests; the renderer is installed globally.
<!-- dev-loop-kit:end -->
