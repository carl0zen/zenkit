# Release Check

> Pre-release validation: tests pass, no regressions, docs updated, changelog current, deploy gates met.

## Capability
Execute a structured pre-release validation checklist to confirm that code is ready for deployment. Verify that tests pass, no regressions have been introduced, documentation reflects current behavior, the changelog is up to date, and all deployment gates (approvals, environment checks, feature flags) are satisfied.

## Trigger Conditions
- A release branch or tag is being prepared.
- A deploy to staging or production is imminent.
- A sprint or milestone is being closed out.
- A hotfix needs expedited but still validated release.
- A previously blocked release is being re-evaluated.

## Input
- Branch, tag, or commit range to validate.
- Release checklist or deployment gate requirements for the project.
- List of changes included in the release (PRs, commits, tickets).
- Target environment (staging, production, canary).

## Output
- **context**: Summary of the release scope and what is being validated.
- **assumptions**: Assumptions about environment parity, data state, and feature flag configuration.
- **constraints**: Hard deployment gates that must pass (CI green, approvals obtained, security review complete).
- **decision**: Release readiness verdict -- go, no-go, or conditional-go -- with justification.
- **deliverable**: Completed checklist with pass/fail status for each gate: test suite results, regression check, documentation review, changelog verification, dependency audit, and environment readiness.
- **risks**: Known issues shipping with the release and their mitigation plans.
- **open_questions**: Items that could not be fully validated and need post-release monitoring.
- **next_agent**: Suggested follow-up (e.g., monitoring setup, rollback plan review).

## Quality Criteria
- Every checklist item has a clear pass/fail determination, not a vague "looks good."
- Failing items include specific details about what failed and what is needed to resolve them.
- The changelog accurately reflects all user-facing changes in the release.
- No critical or high-severity known issues are shipping without an explicit risk acceptance.
- The validation covers both functional correctness and operational readiness.

## Common Pitfalls
- Treating the release check as a formality and rubber-stamping items.
- Validating only on the happy path without checking error handling and edge cases.
- Skipping documentation updates because "the code is self-documenting."
- Missing environment-specific configuration differences between staging and production.
- Forgetting to verify that feature flags are set correctly for the target environment.
