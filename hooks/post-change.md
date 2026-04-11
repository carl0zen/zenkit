# Post-Change Hook

> When: After code changes are made

## Purpose
Validates that the codebase remains healthy after modifications and that changes stay within the planned scope.

## Trigger
Fires automatically after any code modification is applied to the working tree. This runs once all file edits for a given step are complete, before the agent reports success.

## Checks
- All tests pass (no regressions introduced by the change).
- No lint errors exist in modified files.
- Schema validation passes for any modified configuration or data files.
- Changes match the approved plan scope (no unplanned files modified, no scope creep).
- No new security warnings introduced (basic static analysis).

## On Failure
- The change is flagged as incomplete or non-conforming.
- The agent receives a detailed report of which checks failed and why.
- The agent must fix the issues before the change is considered done.
- If scope drift is detected, the agent must either revert out-of-scope changes or request a plan amendment.

## Configuration
- `require_tests_pass`: (boolean, default `true`) Whether all tests must remain green.
- `require_lint_clean`: (boolean, default `true`) Whether lint must pass on changed files.
- `require_schema_valid`: (boolean, default `true`) Whether schema validation is enforced.
- `require_scope_match`: (boolean, default `true`) Whether changes must stay within plan scope.
- `lint_command`: (string, default `"npm run lint"`) Command used for linting.
- `test_command`: (string, default `"npm test"`) Command used for running tests.
