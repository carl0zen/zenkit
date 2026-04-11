import type { SchemaName } from './schemas'

export const exampleData: Record<SchemaName, object> = {
  handoff: {
    context: "Backend architect completed the user authentication module with JWT-based session management.",
    assumptions: [
      "Redis is available for session token storage",
      "Existing user table has email and password_hash columns"
    ],
    constraints: [
      "Must support OAuth2 flow in addition to email/password",
      "Session tokens must expire after 24 hours"
    ],
    decision: "Implemented JWT with refresh token rotation. Access tokens expire in 15 minutes, refresh tokens in 24 hours. Stored refresh tokens in Redis for revocation support.",
    deliverable: {
      type: "code",
      description: "Auth module with login, logout, refresh, and middleware",
      files_changed: ["src/auth/handler.ts", "src/auth/middleware.ts", "src/auth/auth.test.ts"],
      validation_status: "passed"
    },
    risks: [
      {
        description: "Refresh token rotation creates a window where old tokens are briefly valid",
        severity: "low",
        mitigation: "Added grace period of 5 seconds for old token acceptance"
      }
    ],
    open_questions: [
      "Should we implement device-specific sessions?",
      "What is the desired behavior when Redis is temporarily unavailable?"
    ],
    next_agent: "frontend-architect"
  },

  task: {
    id: "implement-profile-api",
    name: "Implement user profile API endpoint",
    description: "Create GET and PATCH endpoints for user profile management with validation and error handling.",
    command: "build",
    status: "completed",
    context: "Part of the user management feature. Profile data includes display name, bio, avatar URL, and preferences.",
    assumptions: [
      "User model already exists in the database",
      "Authentication middleware validates JWT before reaching profile endpoints"
    ],
    constraints: [
      "Response time under 200ms at p95",
      "Bio field limited to 500 characters"
    ],
    acceptance_criteria: [
      "GET /api/v1/profile returns current user profile",
      "PATCH /api/v1/profile updates allowed fields",
      "Invalid fields return 422 with descriptive errors",
      "Unauthorized requests return 401"
    ],
    files_affected: ["src/api/profile.ts", "src/api/profile.test.ts"],
    assigned_agent: "backend-architect",
    metadata: {
      created_at: "2026-04-11T09:00:00Z",
      updated_at: "2026-04-11T10:30:00Z",
      estimated_tokens: 12000
    }
  },

  audit: {
    task_id: "implement-profile-api",
    auditor: "implementation-auditor",
    timestamp: "2026-04-11T11:00:00Z",
    verdict: "conditional",
    findings: [
      {
        category: "security",
        severity: "warning",
        description: "Profile PATCH endpoint does not validate that the authenticated user owns the profile being modified",
        file: "src/api/profile.ts",
        line: 45,
        suggestion: "Add ownership check: compare req.user.id with the profile's user_id before allowing updates"
      },
      {
        category: "testing",
        severity: "info",
        description: "No test case for concurrent PATCH requests to the same profile",
        suggestion: "Add a test that verifies optimistic locking behavior under concurrent writes"
      },
      {
        category: "performance",
        severity: "info",
        description: "Profile query does not use field selection — fetches all columns including unused ones",
        file: "src/api/profile.ts",
        line: 12,
        suggestion: "Use SELECT with explicit column list to reduce data transfer"
      }
    ],
    rubric_scores: {
      execution_quality: 7,
      verbosity_score: 8,
      architectural_alignment: 9
    },
    open_questions: [
      "Is the ownership check a blocker for shipping, or can it be addressed in a follow-up?"
    ],
    recommendations: [
      "Address the ownership check before merging — this is a security issue",
      "Concurrent write test can be added in a follow-up PR"
    ]
  },

  checkpoint: {
    checkpoint_id: "chk-profile-pre-ship",
    task_id: "implement-profile-api",
    timestamp: "2026-04-11T11:30:00Z",
    status: "gate",
    stage: "ship",
    state: {
      files_changed: ["src/api/profile.ts", "src/api/profile.test.ts", "docs/openapi.yaml"],
      tests_passing: true,
      lint_passing: true,
      git_ref: "abc123f",
      notes: "All audit findings addressed. Ownership check added. Ready for merge."
    },
    gate_conditions: [
      { condition: "All tests pass", met: true },
      { condition: "No critical or error audit findings", met: true },
      { condition: "Security review complete", met: true },
      { condition: "Documentation updated", met: true }
    ],
    metadata: {
      agent: "implementation-auditor",
      command: "checkpoint",
      iteration: 2,
      tokens_used: 8500,
      cost_estimate_usd: 0.13
    }
  },

  benchmark: {
    benchmark_id: "bench-example-001",
    task_name: "Example Feature Benchmark",
    feature_spec: "benchmark/feature-specs/example.json",
    start_time: "2026-04-11T10:00:00Z",
    end_time: "2026-04-11T10:12:00Z",
    duration_ms: 720000,
    status: "pass",
    files_changed: ["src/example.ts", "src/example.test.ts"],
    stages: [
      { name: "spec", status: "pass", duration_ms: 30000, notes: "Feature spec validated" },
      { name: "plan", status: "pass", duration_ms: 45000, notes: "2 tasks identified" },
      { name: "build", status: "pass", duration_ms: 480000, notes: "Implementation complete" },
      { name: "audit", status: "pass", duration_ms: 90000, notes: "No critical findings" },
      { name: "ship", status: "pass", duration_ms: 75000, notes: "All gates passed" }
    ],
    telemetry: {
      estimated_tokens: 35000,
      estimated_cost_usd: 0.53,
      telemetry_source: "estimated"
    },
    validation: {
      tests_run: 8,
      tests_passed: 8,
      tests_failed: 0,
      schema_valid: true,
      lint_clean: true
    },
    retries: 0,
    uncertainty_notes: [
      "Token and cost figures are estimates based on typical prompt sizes"
    ]
  },
}
