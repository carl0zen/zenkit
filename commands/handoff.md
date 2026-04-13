# /handoff

> Transfer work between agents or stages with zero context loss.

**Position:** Inserted at any transition in spec → plan → build → audit → ship
**Input:** Current workflow state and what was produced. All artifacts so far (plans, specs, code, audit reports). Unresolved open questions or blockers. Identity of the next agent or stage.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- Passing work from one agent to another (e.g., planner to builder)
- Session ends and work must resume later
- Crossing a stage boundary in the lifecycle
- Escalating or delegating a subtask to a specialized agent

**Example:**
```
> /handoff --from /plan --to /build

context: Rate-limit plan complete and approved. Handing off to build agent.
decision: Sliding window chosen over token bucket; fail-open on Redis failure.
deliverable:
  handoff_contract:
    source: /plan | target: /build
    artifacts: [.zenkit/plans/rate-limit.json]
    status: ready
risks: Redis connection pooling config may differ between environments.
next_agent: /build
```
