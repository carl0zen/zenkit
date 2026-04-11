# /refactor

> Improve existing code without changing behavior.

## Purpose
Restructures, simplifies, or optimizes code while preserving its external behavior. Requires that tests pass both before and after the change. Produces a diff with clear rationale for each modification so reviewers can verify behavioral equivalence.

## When to Use
- When code works but is hard to read, maintain, or extend.
- When `/audit` flags style or architecture issues that do not require new features.
- When preparing a module for new feature work (clean up before building on top).
- When reducing tech debt identified in a previous cycle.

## Input Contract
- Target files or modules to refactor.
- Passing test suite (baseline proof of current behavior).
- Specific goals: readability, performance, decoupling, naming, etc.
- Optional: `/audit` findings that motivate the refactor.

## Output Contract
| Field | Description |
|---|---|
| `context` | What was refactored and why. |
| `assumptions` | That existing tests adequately cover current behavior. |
| `constraints` | No behavioral changes; tests must pass before and after. |
| `decision` | Refactoring strategy chosen and alternatives considered. |
| `deliverable` | Diff with per-change rationale and before/after test results. |
| `risks` | Areas where test coverage may not fully guard behavior. |
| `open_questions` | Potential follow-up refactors or newly exposed issues. |
| `next_agent` | `/audit` to verify; or `/build` if refactor enables new work. |

## Workflow Position
**refactor** is a side-loop that can be entered from `/audit` or initiated independently. It always flows back through `/audit` before `/ship`.

```
audit --> [refactor] --> audit --> ship
```

## Example
```
> /refactor src/middleware/rate-limit.ts --goal "extract config into separate module"

context: Rate-limit middleware mixes configuration parsing with enforcement logic...
assumptions:
  - 14 existing tests cover all rate-limit behavior.
constraints:
  - No behavioral changes; all 14 tests must continue to pass.
decision: Extract config parsing into src/config/rate-limit-config.ts; middleware imports config.
deliverable:
  files_changed:
    - src/middleware/rate-limit.ts (simplified, config removed)
    - src/config/rate-limit-config.ts (new, extracted config logic)
    - src/config/index.ts (re-export added)
  rationale:
    - Single-responsibility: middleware only enforces, config only parses.
    - Enables reuse of config in future admin dashboard.
  tests_before: 14 pass, 0 fail
  tests_after: 14 pass, 0 fail
risks:
  - Config module is now importable independently; ensure no circular deps.
open_questions: []
next_agent: /audit
```
