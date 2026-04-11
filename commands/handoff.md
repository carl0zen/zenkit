# /handoff

> Transfer work between agents or stages.

## Purpose
Produces a structured handoff contract that ensures no context is lost when work moves between agents, sessions, or lifecycle stages. The output conforms to handoff.schema.json and contains everything the receiving agent needs to continue without re-discovery. Eliminates the "lost context" problem in multi-agent workflows.

## When to Use
- When passing work from one agent to another (e.g., planner to builder).
- When a session ends and work must resume later.
- When crossing a stage boundary in the plan-build-audit-ship lifecycle.
- When escalating or delegating a subtask to a specialized agent.

## Input Contract
- Current workflow state (which command just ran, what it produced).
- All artifacts produced so far (plans, specs, code changes, audit reports).
- Any unresolved open questions or blockers.
- Identity of the next agent or stage.

## Output Contract
| Field | Description |
|---|---|
| `context` | Full situational summary: what happened, where we are, what's next. |
| `assumptions` | What the receiving agent can take as given. |
| `constraints` | Limits the receiving agent must respect. |
| `decision` | Decisions already made that must not be revisited. |
| `deliverable` | The handoff contract itself (conforming to handoff.schema.json). |
| `risks` | Known risks the receiving agent should be aware of. |
| `open_questions` | Items the receiving agent must resolve. |
| `next_agent` | The specific agent or command that should pick up the work. |

## Workflow Position
**handoff** can occur at any transition point in the lifecycle. It is the glue between stages.

```
spec --[handoff]--> plan --[handoff]--> build --[handoff]--> audit --[handoff]--> ship
```

## Example
```
> /handoff --from /plan --to /build

context: Rate-limit plan is complete and approved. Handing off to build agent.
assumptions:
  - Redis is available in dev and staging environments.
  - Auth middleware is stable and will not change during build.
constraints:
  - Must not exceed 5ms p99 latency impact.
  - Must use sliding-window algorithm per plan decision.
decision:
  - Sliding window chosen over token bucket (see plan rationale).
  - Fail-open on Redis failure (see plan risk mitigation).
deliverable:
  handoff_contract:
    source_agent: /plan
    target_agent: /build
    artifacts:
      - type: plan
        path: .zenkit/plans/rate-limit.json
    status: ready
    timestamp: 2026-04-11T10:00:00Z
risks:
  - Redis connection pooling config may differ between environments.
open_questions:
  - Default rate limit value still unconfirmed by product.
next_agent: /build
```
