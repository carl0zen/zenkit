# Backend Change

> Implement backend changes (API endpoints, data models, business logic) following existing patterns.

**When to use:**
- New API endpoint/route needs to be created or an existing one modified
- Data model or schema needs to be added or altered
- Business logic or third-party integration needs implementation

**Input:** Description of the desired change and motivation, affected files/modules, API contract or data model specs if applicable, and acceptance criteria.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is the code changes -- new/modified files, migrations, and tests.

**Watch for:**
- Introducing new patterns when established ones already exist in the codebase
- Writing migrations unsafe for zero-downtime deployments
- Handling only the success case and leaving error paths incomplete
