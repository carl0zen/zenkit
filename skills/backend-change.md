# Backend Change

> Implement backend changes (API endpoints, data models, business logic) following existing patterns.

## Capability
Make targeted changes to server-side code -- adding or modifying API endpoints, updating data models, adjusting business logic, or wiring new integrations. Changes follow the conventions, patterns, and style already established in the codebase. Includes writing or updating tests to cover the change.

## Trigger Conditions
- A new API endpoint or route needs to be created.
- An existing endpoint requires modification (new fields, changed behavior, bug fix).
- A data model or schema needs to be added or altered.
- Business logic needs to be implemented, refactored, or corrected.
- A third-party service integration needs to be added or updated.

## Input
- Clear description of the desired change and its motivation.
- Relevant codebase context (affected files, modules, services).
- Data model or API contract specifications if applicable.
- Acceptance criteria or expected behavior.

## Output
- **context**: Summary of what was changed and why.
- **assumptions**: Assumptions about existing data, backwards compatibility, and deployment order.
- **constraints**: Limits respected during implementation (API versioning, DB migration strategy, performance budgets).
- **decision**: Key implementation choices made and their rationale.
- **deliverable**: The code changes themselves -- new/modified files, migrations, tests.
- **risks**: Potential issues with the change (data migration edge cases, breaking consumers, performance regression).
- **open_questions**: Uncertainties that need product or team input before merging.
- **next_agent**: Suggested follow-up skill (e.g., `security-review`, `release-check`).

## Quality Criteria
- Code follows existing project conventions (naming, structure, error handling).
- All new and modified code paths have test coverage.
- Database migrations are reversible or have a documented rollback plan.
- API changes are backwards-compatible or versioned appropriately.
- Error responses are consistent with the existing API contract.

## Common Pitfalls
- Introducing a new pattern when an established one already exists in the codebase.
- Writing migrations that are unsafe for zero-downtime deployments.
- Forgetting to update API documentation or OpenAPI specs alongside code changes.
- Handling only the success case and leaving error paths incomplete.
- Coupling business logic tightly to framework-specific constructs.
