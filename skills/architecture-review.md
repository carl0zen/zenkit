# Architecture Review

> Review system architecture for coherence, scalability, and alignment with project constraints.

## Capability
Evaluate the structural design of a system or module against stated requirements, known constraints, and established architectural principles. Identify misalignments between components, flag scalability bottlenecks, and surface coupling issues. Produce actionable recommendations that improve coherence without unnecessary redesign.

## Trigger Conditions
- A new service, module, or major feature is being designed or proposed.
- An existing system is experiencing scaling, reliability, or maintainability issues.
- A tech-debt audit or migration planning session is underway.
- A pull request introduces significant structural changes.

## Input
- System description, diagrams, or codebase reference.
- Stated requirements and constraints (performance targets, compliance, budget, team size).
- Existing architectural decision records (ADRs) if available.
- Specific concerns or questions from the requester.

## Output
- **context**: Summary of the system's current architecture and the review scope.
- **assumptions**: What was assumed about traffic, team capability, deployment environment, etc.
- **constraints**: Hard limits that shaped the evaluation (regulatory, infrastructure, timeline).
- **decision**: Overall architectural verdict -- sound, needs adjustment, or needs redesign -- with rationale.
- **deliverable**: Ranked list of findings, each with severity, affected components, and a concrete recommendation.
- **risks**: Architectural risks that remain even after applying recommendations.
- **open_questions**: Unknowns that could change the assessment if answered.
- **next_agent**: Suggested follow-up skill (e.g., `security-review`, `backend-change`).

## Quality Criteria
- Every finding references a specific component or interaction, not vague generalities.
- Recommendations are proportional to the severity of the issue.
- Trade-offs are stated explicitly rather than hidden behind a single "best practice" label.
- The review distinguishes between what must change now and what can be deferred.

## Common Pitfalls
- Reviewing in a vacuum without understanding the team's actual constraints and timeline.
- Recommending a full rewrite when incremental improvements would suffice.
- Focusing exclusively on the "happy path" and ignoring failure modes.
- Treating architecture patterns as universal rules instead of context-dependent tools.
- Overlooking operational concerns (observability, deployment, rollback) in favor of pure design elegance.
