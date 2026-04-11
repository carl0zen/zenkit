# Bug Fix Flow: Fix Race Condition in Form Submission

> Triaging, diagnosing, fixing, and verifying a concurrency bug using the ZenKit command pipeline.

## Scenario
Users report that submitting a form multiple times in quick succession creates duplicate records. The root cause is a race condition: the submit handler does not disable the button or debounce requests, and the API endpoint lacks idempotency protection. This workflow uses `/spec` to capture the bug report, `/plan` for root cause analysis, `/build` for the fix, `/audit` for regression checking, and `/ship` to deploy.

## Workflow Steps

### Step 1: /spec "Fix race condition in form submission"

The **Spec Agent** captures the bug report as a structured specification. For bug fixes, the spec focuses on reproduction steps, expected vs. actual behavior, and impact.

**Command:** `/spec "Fix race condition in form submission -- duplicate records created on rapid clicks"`

**Handoff produced:**
```yaml
context: >
  Users report duplicate records when clicking the Submit button multiple
  times quickly on the order creation form. Support has received 23 tickets
  in the past week. The issue is reproducible on slow network connections
  where the round-trip exceeds 500ms.
assumptions:
  - The form uses a standard React controlled component with an onSubmit handler.
  - The API endpoint POST /api/orders does not enforce idempotency.
  - No client-side debouncing or optimistic locking is in place.
constraints:
  - Fix must not change the public API contract (request/response shape).
  - Must preserve existing form validation behavior.
  - Must work without JavaScript disabled (server-side guard required).
decision: >
  Classify as a correctness bug with medium severity. Both client-side and
  server-side fixes are needed -- client-side alone is insufficient because
  the API is also called by mobile clients.
deliverable:
  type: document
  description: >
    Bug specification covering reproduction steps, root cause hypothesis,
    acceptance criteria for the fix, and scope boundaries.
  validation_status: untested
risks:
  - description: >
      Idempotency key implementation could conflict with legitimate
      retry scenarios (e.g., user intentionally resubmits after an error).
    severity: medium
    mitigation: >
      Idempotency key has a short TTL (60s) and only applies to
      successful responses.
open_questions:
  - What idempotency key strategy? Client-generated UUID vs. server-generated hash?
next_agent: /plan
metadata:
  source_agent: spec-agent
  command: spec
  iteration: 0
```

---

### Step 2: /plan

The **Plan Agent** performs root cause analysis and produces a task list targeting both client and server layers.

**Command:** `/plan` (reads the spec handoff)

**Handoff produced:**
```yaml
context: >
  Root cause confirmed: no idempotency guard on POST /api/orders, and the
  React form does not disable the submit button during in-flight requests.
  Both layers must be fixed. Resolved open question: using client-generated
  UUID as the idempotency key (simpler, no server roundtrip to generate).
assumptions:
  - The orders table can accommodate a unique idempotency_key column.
  - Adding a database index on idempotency_key is acceptable.
constraints:
  - Database migration must be backward-compatible (nullable column, no breaking changes).
  - Client fix must handle the case where the idempotency key header is stripped by a proxy.
decision: >
  Two-layer fix: (1) client-side submit button disabling + idempotency key
  header, (2) server-side unique constraint on idempotency_key with a 409
  Conflict response for duplicates.
deliverable:
  type: plan
  description: >
    Three tasks covering client fix, server fix, and regression tests.
  validation_status: untested
risks:
  - description: Migration on the orders table could lock it briefly under high write load.
    severity: medium
    mitigation: Run migration during low-traffic window; use CREATE INDEX CONCURRENTLY.
open_questions: []
next_agent: /build
metadata:
  source_agent: plan-agent
  command: plan
  iteration: 0
```

**Task list:**

| Task ID | Name | Acceptance Criteria | Dependencies |
|---|---|---|---|
| `race-server` | Add idempotency guard to POST /api/orders | Duplicate requests within 60s return 409; unique constraint on idempotency_key | None |
| `race-client` | Disable submit button during in-flight request | Button is disabled after first click; re-enabled on success or error; idempotency key sent as header | `race-server` |
| `race-tests` | Regression tests for duplicate submission | Tests cover rapid double-submit, concurrent requests, retry after error, missing idempotency header | `race-client` |

---

### Step 3: /build

The **Build Agent** implements the fix across both layers.

**Pre-change hook fires:**
- Plan exists: PASS
- Test suite green: PASS
- Working tree clean: PASS

**Handoff produced:**
```yaml
context: >
  Implemented idempotency guard on POST /api/orders and client-side submit
  disabling. All three tasks completed and validated.
assumptions:
  - Used uuid v4 for client-side idempotency key generation.
decision: >
  Server returns 409 Conflict with the original response body when a
  duplicate idempotency key is detected. This allows the client to treat
  409 as a success (the order was already created).
deliverable:
  type: code
  description: >
    Race condition fix: server-side idempotency + client-side submit guard.
  files_changed:
    - migrations/20260411_add_idempotency_key.sql (new)
    - src/api/routes/orders.ts (modified)
    - src/api/middleware/idempotency.ts (new)
    - src/components/OrderForm.tsx (modified)
    - src/hooks/useSubmitGuard.ts (new)
    - tests/integration/order-submission.test.ts (new)
    - tests/unit/idempotency-middleware.test.ts (new)
  validation_status: passed
risks:
  - description: >
      The 60-second idempotency TTL means a user who waits longer than
      60 seconds and resubmits will create a new order.
    severity: low
    mitigation: Acceptable behavior -- 60s covers all realistic double-click scenarios.
open_questions: []
next_agent: /audit
metadata:
  source_agent: build-agent
  command: build
  iteration: 0
```

---

### Step 4: /audit

The **Audit Agent** performs a regression check, focusing on correctness and edge cases.

**Audit report produced** (conforms to `audit.schema.json`):
```yaml
task_id: race-condition-fix
auditor: audit-agent
verdict: conditional
findings:
  - category: correctness
    severity: error
    description: >
      The idempotency middleware does not handle the case where the
      database insert succeeds but the response fails to send (e.g.,
      client disconnects). On retry, the middleware returns 409 but the
      client never received the original response body.
    file: src/api/middleware/idempotency.ts
    line: 32
    suggestion: >
      Store the response body alongside the idempotency key so that
      409 responses include the original payload.
  - category: correctness
    severity: warning
    description: >
      useSubmitGuard does not reset the disabled state if the component
      unmounts during the request (memory leak warning in React).
    file: src/hooks/useSubmitGuard.ts
    line: 18
    suggestion: Use an AbortController or cleanup ref to prevent state updates after unmount.
  - category: testing
    severity: info
    description: No test covers the client-disconnect scenario described above.
    suggestion: Add a test that simulates a dropped connection mid-response.
rubric_scores:
  execution_quality: 7
  verbosity_score: 8
  architectural_alignment: 9
recommendations:
  - Fix the response-body storage issue before shipping (error severity).
  - Fix the unmount cleanup (warning severity).
open_questions: []
```

**Verdict: `conditional`** -- the `error`-severity finding on response body storage must be resolved.

---

### Step 5: /build (iteration 2)

The Build Agent addresses both findings from the audit.

**Handoff produced (iteration 1):**
```yaml
context: >
  Fixed two audit findings: idempotency middleware now stores and replays
  response bodies on 409, and useSubmitGuard cleans up on unmount via
  AbortController.
deliverable:
  type: code
  description: Audit remediation for race condition fix.
  files_changed:
    - src/api/middleware/idempotency.ts (modified)
    - src/hooks/useSubmitGuard.ts (modified)
    - tests/integration/order-submission.test.ts (modified)
  validation_status: passed
next_agent: /audit
metadata:
  source_agent: build-agent
  command: build
  iteration: 1
```

---

### Step 6: /audit (iteration 2)

Re-audit passes.

```yaml
task_id: race-condition-fix
auditor: audit-agent
verdict: pass
findings:
  - category: correctness
    severity: info
    description: >
      Response body is now stored with a 60s TTL matching the idempotency
      key TTL. Consistent and correct.
rubric_scores:
  execution_quality: 9
  verbosity_score: 8
  architectural_alignment: 9
recommendations: []
open_questions: []
```

---

### Step 7: /ship

The **Ship Agent** prepares the fix for deployment.

**Actions taken:**
- Creates branch `fix/form-submission-race-condition`.
- Pushes to remote.
- Opens PR with title "Fix race condition in form submission" linking the bug report.
- PR body includes: root cause summary, what changed (client + server), test coverage summary, and the audit trail showing the conditional-then-pass cycle.
- Tags the PR with `bug`, `correctness`.

## Artifacts Produced

| Artifact | Schema | Created By |
|---|---|---|
| Bug spec handoff | `handoff.schema.json` | `/spec` |
| Root cause plan + task list | `handoff.schema.json`, `task.schema.json` | `/plan` |
| Build handoff (iteration 0) | `handoff.schema.json` | `/build` |
| Audit report (conditional) | `audit.schema.json` | `/audit` |
| Build handoff (iteration 1) | `handoff.schema.json` | `/build` |
| Audit report (pass) | `audit.schema.json` | `/audit` |
| Pull request | GitHub | `/ship` |

## Key Observations

1. **Specs work for bugs too.** The `/spec` command captures bug reports just as effectively as feature requests. The structure surfaces reproduction steps, assumptions, and constraints that a casual bug ticket would omit.

2. **Root cause analysis lives in /plan.** The Plan Agent's `context` and `decision` fields document the root cause and chosen fix strategy. This creates a permanent record of why the fix was designed the way it was.

3. **Two-layer fixes are naturally represented.** The task list made it explicit that both client and server needed changes and that the server fix had to come first. This dependency ordering prevented the Build Agent from implementing the client fix against a server that could not handle idempotency keys.

4. **Audit caught a subtle edge case.** The client-disconnect scenario (successful insert, failed response) is exactly the kind of bug that manual code review often misses. The structured audit process with category-specific checks surfaced it before shipping.

5. **The conditional/pass cycle keeps quality high without blocking.** Rather than failing the entire workflow, the `conditional` verdict sent specific, actionable findings back to `/build`. The second audit was scoped to the changes made, not a full re-review.

6. **Iteration tracking enables post-mortems.** The `metadata.iteration` field on each handoff shows this bug fix required two build-audit cycles. Over time, this data reveals which types of bugs tend to need more iterations, informing estimation.
