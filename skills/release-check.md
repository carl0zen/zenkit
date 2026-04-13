# Release Check

> Pre-release validation: tests pass, no regressions, docs updated, changelog current, deploy gates met.

**When to use:**
- Release branch or tag is being prepared, or deploy to staging/production is imminent
- Sprint or milestone is being closed out
- Hotfix or previously blocked release needs validated release

**Input:** Branch/tag/commit range to validate, deployment gate requirements, list of changes included (PRs, commits, tickets), and target environment.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is a completed checklist with pass/fail per gate: test results, regression check, docs review, changelog verification, dependency audit, and environment readiness. Verdict: go, no-go, or conditional-go.

**Watch for:**
- Treating the release check as a formality and rubber-stamping items
- Validating only the happy path without checking error handling and edge cases
- Missing environment-specific config differences between staging and production
