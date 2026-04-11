# /build

> Implement the planned work.

## Purpose
Takes a plan as input and produces code changes with validation status. This is the core execution command that translates tasks and acceptance criteria into working code. Each task is implemented, tested, and validated against its criteria before moving on.

## When to Use
- After `/plan` has produced an approved task list.
- When implementing a feature, bug fix, or infrastructure change.
- When the scope and acceptance criteria are already defined.

## Input Contract
- A plan (from `/plan`) with ordered tasks and acceptance criteria.
- Access to the relevant codebase and development environment.
- Any configuration or environment details needed for implementation.

## Output Contract
| Field | Description |
|---|---|
| `context` | Summary of what was built and why. |
| `assumptions` | Runtime or environment assumptions made during implementation. |
| `constraints` | Any constraints encountered or respected during build. |
| `decision` | Implementation choices made (libraries, patterns, trade-offs). |
| `deliverable` | Code changes with per-task validation status (pass/fail/skip). |
| `risks` | Known issues, tech debt introduced, or edge cases not covered. |
| `open_questions` | Items discovered during build that need resolution. |
| `next_agent` | Typically `/audit`; may be `/plan` if scope changed significantly. |

## Workflow Position
**build** is the core execution step. It follows `/plan` and feeds into `/audit`.

```
spec --> plan --> [build] --> audit --> ship
```

## Example
```
> /build plan:rate-limit-plan.json

context: Implementing rate limiting per the approved plan...
assumptions:
  - Redis connection pool is configured in env.
decision: Used sliding-window counter instead of token bucket (simpler, meets latency target).
deliverable:
  - task: Add rate-limit middleware
    status: pass
    files_changed:
      - src/middleware/rate-limit.ts (new)
      - src/middleware/index.ts (modified)
    validation: All 12 new tests pass; p99 latency +2ms.
  - task: Add configuration endpoint
    status: pass
    files_changed:
      - src/routes/config.ts (modified)
    validation: Integration test confirms limit updates take effect.
risks:
  - Sliding window is approximate; may allow brief bursts above limit.
open_questions: []
next_agent: /audit
```
