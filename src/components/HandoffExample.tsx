export function HandoffExample() {
  const handoff = {
    context: "Backend architect completed the user profile API endpoint with data validation and error handling.",
    assumptions: [
      "PostgreSQL is the primary datastore",
      "Authentication middleware is already in place",
      "Profile images are stored in object storage, not the database"
    ],
    constraints: [
      "Response time must be under 200ms at p95",
      "No breaking changes to existing /api/v1 endpoints"
    ],
    decision: "Implemented as a new /api/v1/profile resource with GET/PATCH operations. Used existing ORM patterns rather than raw SQL for consistency.",
    deliverable: {
      type: "code",
      description: "Profile API endpoint with validation, tests, and OpenAPI spec",
      files_changed: [
        "src/api/profile.ts",
        "src/api/profile.test.ts",
        "docs/openapi.yaml"
      ],
      validation_status: "passed"
    },
    risks: [
      {
        description: "Profile PATCH allows partial updates — concurrent writes could cause data races",
        severity: "medium",
        mitigation: "Added optimistic locking via updated_at timestamp check"
      }
    ],
    open_questions: [
      "Should profile deletion be soft-delete or hard-delete?",
      "Is rate limiting needed on the PATCH endpoint?"
    ],
    next_agent: "frontend-architect"
  }

  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
          Structured handoffs
        </h2>
        <p className="mt-4 text-zen-400 max-w-2xl leading-relaxed">
          Every agent-to-agent transfer uses the same contract. Context,
          assumptions, constraints, decisions, risks, and open questions —
          nothing is lost between stages.
        </p>

        <div className="mt-10 code-block">
          <div className="text-zen-500 text-xs mb-3 font-mono">
            handoff: backend-architect → frontend-architect
          </div>
          <pre className="text-sm leading-relaxed text-zen-300">
{JSON.stringify(handoff, null, 2)}
          </pre>
        </div>

        <p className="mt-6 text-sm text-zen-500">
          This handoff is validated against{' '}
          <code className="text-zen-400 bg-zen-800/50 px-1.5 py-0.5 rounded text-xs">
            handoff.schema.json
          </code>{' '}
          before the next agent begins work. Invalid handoffs are rejected.
        </p>
      </div>
    </section>
  )
}
