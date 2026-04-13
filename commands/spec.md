# /spec

> Write a feature specification — capture the "what" and "why" as a single source of truth.

**Position:** spec → plan → build → audit → checkpoint → ship
**Input:** User story, feature request, bug report, or high-level description. Optional: existing code references, design docs, constraints.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- Feature or change is complex enough to need a written definition
- Multiple agents or team members will collaborate on the same work
- Before `/plan`, to ensure the plan is grounded in a clear spec

**Example:**
```
> /spec "User-facing API key rotation"

context: Users cannot rotate API keys without contacting support...
decision: Dual-key model where old and new keys overlap during grace period.
deliverable:
  scope: [POST /keys/rotate endpoint, grace period config, audit log]
  acceptance_criteria: Rotating returns new key, old key works until grace period expires.
  out_of_scope: Automatic rotation schedules.
risks: Grace period too short could lock out slow-deploying clients.
next_agent: /plan
```
