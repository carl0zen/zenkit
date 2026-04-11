# /audit

> Review implemented work for correctness, security, style, and architectural alignment.

## Purpose
Examines code changes produced by `/build` against the original plan and spec. Evaluates correctness, security posture, code style, test coverage, and architectural fit. Produces an audit report with findings, severity levels, and rubric scores so the team can decide whether to ship or iterate.

## When to Use
- After `/build` completes and before `/ship`.
- When reviewing a pull request or merge request.
- When verifying that a refactor preserved behavior.
- As a periodic health check on a module or subsystem.

## Input Contract
- Code changes (diff or file list) from `/build` or `/refactor`.
- The original plan and/or spec for comparison.
- Project coding standards, linting rules, and architectural guidelines.

## Output Contract
| Field | Description |
|---|---|
| `context` | What was audited and the scope of review. |
| `assumptions` | What the audit takes as given (e.g., test suite is trustworthy). |
| `constraints` | Limits of the audit (time-boxed, no pen-test, etc.). |
| `decision` | Overall verdict: pass, pass-with-caveats, or fail. |
| `deliverable` | Audit report with categorized findings and rubric scores. |
| `risks` | Issues found, ranked by severity (critical/high/medium/low). |
| `open_questions` | Items that need deeper investigation or stakeholder input. |
| `next_agent` | `/ship` if pass; `/build` or `/refactor` if issues found. |

## Workflow Position
**audit** follows `/build` and gates the path to `/ship`.

```
spec --> plan --> build --> [audit] --> ship
                              |
                              +--> build/refactor (if issues found)
```

## Example
```
> /audit build:rate-limit-output.json

context: Auditing rate-limit middleware implementation...
assumptions:
  - Existing test suite covers core gateway behavior.
constraints:
  - Time-boxed to code review; no load testing performed.
decision: pass-with-caveats
deliverable:
  rubric:
    correctness: 9/10
    security: 8/10
    style: 10/10
    test_coverage: 8/10
    architecture: 9/10
  findings:
    - severity: medium
      category: security
      description: Rate limit key derived from X-Forwarded-For; spoofable behind some proxies.
      recommendation: Use verified client ID from auth middleware instead.
    - severity: low
      category: test_coverage
      description: No test for Redis connection failure path.
      recommendation: Add test verifying fail-open behavior.
risks:
  - Medium-severity finding should be addressed before production deploy.
open_questions:
  - Is the proxy configuration trusted end-to-end?
next_agent: /build (to address medium finding), then /ship
```
