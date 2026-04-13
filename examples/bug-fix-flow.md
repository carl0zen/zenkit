# Bug Fix Flow: Fix Race Condition in Form Submission

> Triaging, diagnosing, fixing, and verifying a concurrency bug using the ZenKit command pipeline.

## Scenario

Users report duplicate records on rapid form submission. Root cause: no client-side debounce and no server-side idempotency on POST /api/orders. All handoffs conform to `handoff.schema.json`.

## Step 1: /spec

Captures bug as structured spec: 23 support tickets, reproducible on slow connections (>500ms RTT). Classifies as medium-severity correctness bug. Decides both client and server fixes needed (API also used by mobile clients). Surfaces open question: idempotency key strategy. Routes to `/plan`.

## Step 2: /plan

Confirms root cause. Resolves open question: client-generated UUID as idempotency key. Produces three tasks:

| Task | Description | Depends on |
|---|---|---|
| `race-server` | Idempotency guard on POST /api/orders, unique constraint, 409 on duplicates | None |
| `race-client` | Disable submit button during in-flight, send idempotency key header | `race-server` |
| `race-tests` | Regression tests: double-submit, concurrent requests, retry after error | `race-client` |

Constraint: DB migration must be backward-compatible (nullable column). Risk: migration may briefly lock orders table under high write load.

## Step 3: /build

Implements both layers. Server returns 409 with original response body on duplicate key. Client uses uuid v4. Produces 7 new/modified files including migration, middleware, component, hook, and tests. Routes to `/audit`.

## Step 4: /audit (verdict: conditional)

Finds: (1) **error** -- idempotency middleware does not store response body, so 409 on client-disconnect retries returns empty payload; (2) **warning** -- useSubmitGuard leaks on unmount; (3) **info** -- no test for client-disconnect scenario.

## Step 5: /build (iteration 2)

Fixes both: middleware now stores and replays response bodies on 409; useSubmitGuard uses AbortController for cleanup. Routes to `/audit`.

## Step 6: /audit (verdict: pass)

Response body stored with matching 60s TTL. All findings resolved.

## Step 7: /ship

Creates branch `fix/form-submission-race-condition`, opens PR linking bug report with root cause summary, change description (client + server), test coverage, and audit trail.

## Key Observations

1. **Specs work for bugs too.** Structured spec surfaces reproduction steps and constraints a casual ticket would omit.
2. **Root cause analysis lives in /plan.** The decision field permanently records why the fix was designed this way.
3. **Two-layer fixes are naturally represented.** Task dependencies ensure server fix lands before client fix.
4. **Audit caught a subtle edge case.** The client-disconnect scenario (successful insert, failed response) is easily missed in manual review.
5. **Iteration tracking enables post-mortems.** Metadata shows this fix needed two build-audit cycles.
