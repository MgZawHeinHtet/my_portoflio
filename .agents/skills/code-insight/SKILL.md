---
name: code-insight
description: Explain existing code flows from the top down for a PR, working-tree changes, a branch, or a commit range using the dev-loop CLI, and immediately open the shared global HTML view. Also start the renderer for an existing or latest report, or stop it. Use for understanding scoped behavior, without defect review or test execution.
---

# Code insight

Read `.agent-workflow/CODE_INSIGHT.md` and follow its procedure.

Infer scope from values and natural-language intent: PR URL/number, branch name, commit SHA/tag, range endpoints, current changes, or an existing report path. Users do not need exact flags. Honor explicit scope hints, use conversation context when clear, and briefly state the chosen scope; ask only when the intended scope or a required value remains ambiguous. The CLI accepts shorthand values; translate clear natural-language requests to shorthand or explicit flags.

For `start [report path]`, run `dev-loop code-insight start` with the explicit path or latest completed report path in this conversation. If neither is known, omit the path to use current-project history or its newest completed report. For `stop`, run `dev-loop code-insight stop`. Skip report generation for these commands.

For scope arguments, capture with `dev-loop code-insight`, trace the relevant existing flow from the captured sources, and write a report with an Overview and drill-down workflows. Immediately run `dev-loop code-insight start <report.json>`; opening performs the report checks once. Every start checks and reuses the same global background process, with separate URLs for multiple reports. Use `--no-browser` only when immediately opening the returned URL through an agent browser tool.

Prioritize a useful view quickly. Skip defect hunting, new findings, tests, verification probes, separate validation, and browser QA unless separately requested. Include available PR issue/comment context in the explanation. Honor an explicit JSON-only request. The renderer is installed globally.

PR scope includes imported issues and fix previews by default. Use `--pr <URL-or-number>` and the preview instructions in `CODE_INSIGHT.md`; `--no-issues` disables both. Include exact head-source patches for every actionable and held imported issue; preserve held status and its reason. Preview fix shows current and suggested code side by side without changing files.
