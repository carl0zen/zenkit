# /audit

> Review implemented work for correctness, security, style, and architectural alignment.

**Position:** spec → plan → build → **audit** → checkpoint → ship
**Input:** Code changes (diff or file list) from `/build` or `/refactor`. Original plan/spec for comparison. Project coding standards and architectural guidelines.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- After `/build` completes and before `/ship`
- Reviewing a pull request or merge request
- Verifying a refactor preserved behavior
- Periodic health check on a module or subsystem

**Example:**
```
> /audit build:rate-limit-output.json

context: Auditing rate-limit middleware implementation...
decision: pass-with-caveats
deliverable:
  rubric: { correctness: 9/10, security: 8/10, style: 10/10, coverage: 8/10 }
  findings:
    - [medium/security] Rate limit key from X-Forwarded-For; spoofable behind some proxies.
    - [low/coverage] No test for Redis connection failure path.
risks: Medium-severity finding should be addressed before production deploy.
next_agent: /build (to address medium finding), then /ship
```
