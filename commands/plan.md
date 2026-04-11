# /plan

> Define the approach before building.

## Purpose
Produces a structured plan with tasks, constraints, and acceptance criteria. Translates a spec or user intent into an actionable sequence of work that downstream agents can execute without ambiguity. Ensures alignment on scope and priorities before any code is written.

## When to Use
- After a `/spec` has been written and you need to break it into executable tasks.
- When starting a new feature, fix, or refactoring effort.
- When the scope is large enough that jumping straight to `/build` would risk wasted work.

## Input Contract
- A spec (from `/spec`) or a clear problem statement.
- Any existing constraints, deadlines, or architectural decisions.
- Current codebase context (file paths, relevant modules).

## Output Contract
| Field | Description |
|---|---|
| `context` | Summary of the problem and relevant background. |
| `assumptions` | What the plan takes as given. |
| `constraints` | Technical, time, or scope limits. |
| `decision` | The chosen approach and why alternatives were rejected. |
| `deliverable` | Ordered task list with acceptance criteria per task. |
| `risks` | What could go wrong and mitigations. |
| `open_questions` | Unresolved items that need answers before or during build. |
| `next_agent` | Typically `/build`; may be `/spec` if gaps are found. |

## Workflow Position
**plan** sits after `/spec` and before `/build`. It is the first command in the plan-build-audit-ship lifecycle when no spec is needed.

```
spec? --> [plan] --> build --> audit --> ship
```

## Example
```
> /plan "Add rate limiting to the API gateway"

context: API gateway currently has no per-client rate limiting...
assumptions:
  - Redis is available as a backing store.
  - Existing auth middleware extracts client ID.
constraints:
  - Must not add >5ms p99 latency.
decision: Token-bucket algorithm via Redis, enforced in middleware.
deliverable:
  - task: Add rate-limit middleware
    acceptance: Returns 429 when limit exceeded; passes existing tests.
  - task: Add configuration endpoint
    acceptance: Operators can set per-client limits via config.
risks:
  - Redis downtime could block all requests (mitigation: fail-open flag).
open_questions:
  - Default rate limit value?
next_agent: /build
```
