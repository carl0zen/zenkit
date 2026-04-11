# /ship

> Final validation and release preparation.

## Purpose
Performs terminal validation before release. Runs pre-ship hooks, checks that all gates are green (tests, audit, lint, type-check), and produces a ship-readiness report. This is the final command in the lifecycle and acts as the last line of defense before code reaches production.

## When to Use
- After `/audit` returns a passing verdict.
- When preparing a pull request for merge.
- When deploying to staging or production.
- As a final checklist before tagging a release.

## Input Contract
- Passing `/audit` report.
- All code changes in a merge-ready state.
- Pre-ship hook configuration (if any).
- Release metadata: version, changelog, target environment.

## Output Contract
| Field | Description |
|---|---|
| `context` | What is being shipped and to where. |
| `assumptions` | That the audit verdict is still current and no new changes were introduced. |
| `constraints` | Release gates that must all pass (tests, lint, type-check, audit). |
| `decision` | Ship / no-ship verdict with rationale. |
| `deliverable` | Ship-readiness report: gate results, artifact manifest, release metadata. |
| `risks` | Residual risks accepted for this release. |
| `open_questions` | Items deferred to post-release follow-up. |
| `next_agent` | None (terminal command). Post-ship monitoring or next feature cycle. |

## Workflow Position
**ship** is the terminal command in the plan-build-audit-ship lifecycle.

```
spec --> plan --> build --> audit --> [ship]
```

## Example
```
> /ship --version 1.4.0

context: Shipping rate-limit feature to production.
assumptions:
  - Audit passed with no critical or high findings.
  - No changes since last audit.
constraints:
  gates:
    - tests: pass (247/247)
    - lint: pass (0 errors)
    - type_check: pass
    - audit: pass-with-caveats (0 critical, 0 high, 1 medium accepted)
decision: ship
deliverable:
  readiness: green
  version: 1.4.0
  artifacts:
    - src/middleware/rate-limit.ts
    - src/config/rate-limit-config.ts
    - src/routes/config.ts
  changelog_entry: "Add per-client rate limiting to API gateway."
  pre_ship_hooks:
    - build: pass
    - integration_tests: pass
    - security_scan: pass
risks:
  - Medium audit finding (X-Forwarded-For spoofing) accepted with monitoring.
open_questions:
  - Post-release: finalize default rate limit based on production traffic data.
next_agent: null
```
