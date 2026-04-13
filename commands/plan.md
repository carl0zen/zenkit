# /plan

> Translate a spec or intent into an actionable, ordered task list with acceptance criteria.

**Position:** spec → **plan** → build → audit → checkpoint → ship
**Input:** A spec (from `/spec`) or clear problem statement. Any existing constraints, deadlines, or architectural decisions. Relevant codebase context.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- After `/spec` to break it into executable tasks
- Starting a new feature, fix, or refactoring effort
- Scope is large enough that jumping straight to `/build` would risk wasted work

**Example:**
```
> /plan "Add rate limiting to the API gateway"

context: API gateway currently has no per-client rate limiting...
decision: Token-bucket algorithm via Redis, enforced in middleware.
deliverable:
  - task: Add rate-limit middleware
    acceptance: Returns 429 when limit exceeded; passes existing tests.
  - task: Add configuration endpoint
    acceptance: Operators can set per-client limits via config.
risks: Redis downtime could block all requests (mitigation: fail-open flag).
next_agent: /build
```
