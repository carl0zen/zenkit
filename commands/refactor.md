# /refactor

> Improve existing code without changing behavior — tests must pass before and after.

**Position:** Side-loop from audit → **refactor** → audit → ship
**Input:** Target files or modules. Passing test suite as behavioral baseline. Specific goals (readability, performance, decoupling). Optional: `/audit` findings motivating the refactor.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- Code works but is hard to read, maintain, or extend
- `/audit` flags style or architecture issues that don't require new features
- Preparing a module for new feature work (clean up before building on top)
- Reducing tech debt from a previous cycle

**Example:**
```
> /refactor src/middleware/rate-limit.ts --goal "extract config into separate module"

context: Rate-limit middleware mixes config parsing with enforcement logic...
decision: Extract config into src/config/rate-limit-config.ts; middleware imports config.
deliverable:
  files_changed: [rate-limit.ts (simplified), rate-limit-config.ts (new), config/index.ts]
  rationale: Single-responsibility; enables config reuse in admin dashboard.
  tests_before: 14 pass | tests_after: 14 pass
risks: Config module now importable independently; ensure no circular deps.
next_agent: /audit
```
