# Pre-Change Hook

> When: Before any code change begins

## Purpose
Validates that all preconditions are met before modifying code, ensuring changes are planned, the environment is stable, and no work is lost.

## Trigger
Fires automatically before any code modification is applied to the working tree. This includes new feature work, bug fixes, refactors, and any file edits initiated by an agent.

## Checks
- A plan exists and has been approved for the current task.
- All existing tests pass (green test suite).
- The working tree is clean (no uncommitted or unstaged changes that could be overwritten).
- The current branch is up to date with its upstream tracking branch.
- No conflicting changes are in progress from another agent or task.

## On Failure
- The code change is blocked and does not proceed.
- The failing check is reported with a clear reason and remediation hint.
- The agent is prompted to resolve the issue (e.g., commit or stash uncommitted work, fix failing tests, create a plan) before retrying.

## Configuration
- `require_plan`: (boolean, default `true`) Whether an approved plan must exist.
- `require_green_tests`: (boolean, default `true`) Whether the full test suite must pass.
- `require_clean_tree`: (boolean, default `true`) Whether the working tree must have no uncommitted changes.
- `allowed_dirty_paths`: (list, default `[]`) Paths excluded from the clean-tree check.
