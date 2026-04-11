# /checkpoint

> Save workflow state at a specific point.

## Purpose
Creates a snapshot of the current workflow state for potential rollback or resumption. Captures all artifacts, decisions, and progress so that work can be restored to this exact point if a later stage fails or needs to be re-run. Acts as a safety net between major stages.

## When to Use
- Between major lifecycle stages (e.g., after `/plan` before `/build`).
- Before a risky or irreversible operation.
- When pausing work that will be resumed later.
- After a successful `/audit` to lock in a known-good state.

## Input Contract
- Current workflow state and stage identifier.
- All artifacts produced up to this point.
- Git state (branch, commit SHA, dirty files).
- Optional: a label or tag for the checkpoint.

## Output Contract
| Field | Description |
|---|---|
| `context` | What stage was reached and why a checkpoint is being taken. |
| `assumptions` | What must remain true for this checkpoint to be valid for rollback. |
| `constraints` | Conditions under which this checkpoint expires or becomes invalid. |
| `decision` | Whether this is a routine checkpoint or a pre-risk safeguard. |
| `deliverable` | Snapshot manifest: artifacts, git SHA, workflow state, timestamp. |
| `risks` | What could invalidate this checkpoint (e.g., external state changes). |
| `open_questions` | Items that were open at the time of the checkpoint. |
| `next_agent` | The command that should run next (resumes from here on rollback). |

## Workflow Position
**checkpoint** is inserted between any two stages. It does not advance the workflow; it preserves state.

```
plan --> [checkpoint] --> build --> [checkpoint] --> audit --> [checkpoint] --> ship
```

## Example
```
> /checkpoint --label "post-plan-approved"

context: Plan for rate-limit feature approved. Checkpointing before build begins.
assumptions:
  - No external dependency changes between now and build start.
constraints:
  - Checkpoint invalid if base branch receives breaking changes.
decision: Routine pre-build checkpoint.
deliverable:
  snapshot:
    label: post-plan-approved
    timestamp: 2026-04-11T10:30:00Z
    git_sha: a1b2c3d
    branch: feature/rate-limit
    artifacts:
      - .zenkit/specs/rate-limit.json
      - .zenkit/plans/rate-limit.json
    workflow_state:
      completed: [spec, plan]
      next: build
risks:
  - If main branch diverges significantly, plan may need revision.
open_questions:
  - Default rate limit value still pending.
next_agent: /build
```
