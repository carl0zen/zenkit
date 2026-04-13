# /ship

> Final validation and release preparation — last line of defense before production.

**Position:** spec → plan → build → audit → checkpoint → **ship** (terminal)
**Input:** Passing `/audit` report. All code changes in merge-ready state. Pre-ship hook configuration (if any). Release metadata: version, changelog, target environment.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- After `/audit` returns a passing verdict
- Preparing a pull request for merge
- Deploying to staging or production
- Final checklist before tagging a release

**Example:**
```
> /ship --version 1.4.0

context: Shipping rate-limit feature to production.
decision: ship
deliverable:
  readiness: green | version: 1.4.0
  gates: { tests: 247/247, lint: pass, type_check: pass, audit: pass-with-caveats }
  pre_ship_hooks: [build: pass, integration_tests: pass, security_scan: pass]
  changelog: "Add per-client rate limiting to API gateway."
risks: Medium audit finding (X-Forwarded-For spoofing) accepted with monitoring.
next_agent: null
```
