# /checkpoint

> Save a snapshot of workflow state for rollback or resumption.

**Position:** Inserted between any two stages — does not advance the workflow
**Input:** Current workflow state and stage identifier. All artifacts produced so far. Git state (branch, commit SHA, dirty files). Optional: label or tag.
**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions, next_agent).

**When to use:**
- Between major lifecycle stages (e.g., after `/plan` before `/build`)
- Before a risky or irreversible operation
- Pausing work that will be resumed later
- After a successful `/audit` to lock in a known-good state

**Example:**
```
> /checkpoint --label "post-plan-approved"

context: Plan for rate-limit feature approved. Checkpointing before build.
decision: Routine pre-build checkpoint.
deliverable:
  snapshot:
    label: post-plan-approved | git_sha: a1b2c3d | branch: feature/rate-limit
    artifacts: [specs/rate-limit.json, plans/rate-limit.json]
    completed: [spec, plan] | next: build
risks: If main branch diverges significantly, plan may need revision.
next_agent: /build
```
