# Architecture Review

> Review system architecture for coherence, scalability, and alignment with project constraints.

**When to use:**
- New service/module/feature is being designed or a PR introduces major structural changes
- Scaling, reliability, or maintainability issues in an existing system
- Tech-debt audit or migration planning underway

**Input:** System description or codebase reference, requirements/constraints, ADRs if available, and specific concerns from the requester.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is a ranked list of findings with severity, affected components, and concrete recommendations.

**Watch for:**
- Reviewing in a vacuum without understanding the team's actual constraints and timeline
- Recommending full rewrites when incremental improvements suffice
- Ignoring failure modes and operational concerns (observability, deployment, rollback)
