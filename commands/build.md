# /build

> Implement the planned work — translate tasks and acceptance criteria into working code.

**Position:** spec → plan → **build** → audit → checkpoint → ship
**Input:** A plan (from `/plan`) with ordered tasks and acceptance criteria. Access to relevant codebase and environment. Configuration or environment details needed for implementation.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- After `/plan` has produced an approved task list
- Implementing a feature, bug fix, or infrastructure change
- Scope and acceptance criteria are already defined

**Example:**
```
> /build plan:rate-limit-plan.json

context: Implementing rate limiting per the approved plan...
decision: Used sliding-window counter instead of token bucket (simpler, meets latency target).
deliverable:
  - task: Add rate-limit middleware | status: pass
    files_changed: [src/middleware/rate-limit.ts (new), src/middleware/index.ts]
    validation: All 12 new tests pass; p99 latency +2ms.
risks: Sliding window is approximate; may allow brief bursts above limit.
next_agent: /audit
```
