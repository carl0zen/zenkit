# Feature Flow: Add User Profile Page

> End-to-end feature implementation from specification through shipping, demonstrating the full ZenKit command pipeline and agent handoff contracts.

## Scenario
We are adding a user profile page to an existing web application. The page displays the user's name, email, avatar, and account settings. It requires a new API endpoint, a React component, and integration with the existing authentication module. Multiple agents collaborate through structured handoffs.

## Workflow Steps

### Step 1: /spec "Add user profile page"

The **Spec Agent** gathers requirements and produces a machine-readable specification.

**Command:** `/spec "Add user profile page with name, email, avatar, and account settings"`

**Handoff produced** (conforms to `handoff.schema.json`):
```yaml
context: >
  Users currently have no way to view or edit their profile information.
  All account data is only visible to admins. Adding a profile page improves
  self-service and reduces support tickets.
assumptions:
  - User authentication is already implemented via JWT.
  - Avatar storage uses the existing S3 bucket.
  - The design system provides a Card and Form component.
constraints:
  - Must work on mobile viewports (responsive).
  - Profile updates must validate server-side, not just client-side.
  - Avatar upload limited to 2MB, JPEG/PNG only.
decision: >
  Single-page profile with inline editing. No separate "edit mode" -- fields
  become editable on click. This reduces navigation and aligns with the
  existing UX patterns.
deliverable:
  type: document
  description: >
    Specification covering scope, acceptance criteria, and out-of-scope items
    for the user profile page feature.
  validation_status: untested
risks:
  - description: Avatar upload could fail silently on slow connections.
    severity: medium
    mitigation: Add progress indicator and retry logic.
open_questions:
  - Should users be able to change their email, or is that admin-only?
  - What is the maximum display name length?
next_agent: /plan
metadata:
  source_agent: spec-agent
  command: spec
  iteration: 0
```

**Key detail:** The `next_agent` field routes this handoff to `/plan`. The `open_questions` list signals that the Plan Agent should either resolve these or flag them as blockers.

---

### Step 2: /plan

The **Plan Agent** receives the spec handoff and produces an ordered task list with acceptance criteria per task.

**Command:** `/plan` (reads the spec handoff automatically)

**Handoff produced:**
```yaml
context: >
  Breaking down the user profile page spec into executable tasks.
  Open questions from spec resolved: email changes are admin-only;
  display name max length is 100 characters.
assumptions:
  - The existing GET /api/users/:id endpoint returns all needed fields.
  - The design system's Card component supports inline editing.
constraints:
  - No new database migrations -- profile data already exists in the users table.
  - Must not regress existing auth flows.
decision: >
  Three tasks: API endpoint, React component, integration tests.
  API first because the component depends on it.
deliverable:
  type: plan
  description: Ordered task list for user profile page implementation.
  validation_status: untested
risks:
  - description: >
      Inline editing UX may conflict with form validation patterns
      elsewhere in the app.
    severity: low
    mitigation: Reuse the existing FormField validation hook.
open_questions: []
next_agent: /build
metadata:
  source_agent: plan-agent
  command: plan
  iteration: 0
```

**Task list within the plan** (conforms to `task.schema.json`):

| Task ID | Name | Acceptance Criteria | Dependencies |
|---|---|---|---|
| `profile-api` | Add GET/PATCH /api/profile endpoint | Returns user profile; PATCH updates name and avatar; 401 for unauthenticated | None |
| `profile-ui` | Build ProfilePage React component | Renders name, email, avatar, settings; inline edit for name and avatar; responsive | `profile-api` |
| `profile-tests` | Integration tests for profile flow | Tests cover happy path, validation errors, unauthorized access, avatar upload | `profile-ui` |

---

### Step 3: /build

The **Build Agent** executes each task in order, validating against acceptance criteria. The `pre-change` hook fires before any file modification, verifying the plan exists and tests are green.

**Command:** `/build` (reads the plan handoff automatically)

**Pre-change hook fires:**
- Plan exists and approved: PASS
- Test suite green: PASS
- Working tree clean: PASS
- Branch up to date: PASS

**Handoff produced:**
```yaml
context: >
  Implemented all three tasks from the profile page plan.
  All acceptance criteria met. No scope changes.
assumptions:
  - Used existing express-validator for PATCH input validation.
decision: >
  Used React Query for data fetching instead of raw fetch to align with
  existing patterns in the codebase. Avatar upload uses presigned S3 URLs.
deliverable:
  type: code
  description: User profile API endpoint, React component, and integration tests.
  files_changed:
    - src/api/routes/profile.ts (new)
    - src/api/routes/index.ts (modified)
    - src/components/ProfilePage.tsx (new)
    - src/components/ProfilePage.test.tsx (new)
    - src/hooks/useProfile.ts (new)
    - tests/integration/profile.test.ts (new)
  validation_status: passed
risks:
  - description: Avatar presigned URLs expire after 15 minutes.
    severity: low
    mitigation: Client refreshes the URL on retry.
open_questions: []
next_agent: /audit
metadata:
  source_agent: build-agent
  command: build
  iteration: 0
```

---

### Step 4: /audit

The **Audit Agent** reviews the build output against the original spec and plan. It produces a structured report conforming to `audit.schema.json`.

**Command:** `/audit` (reads the build handoff automatically)

**Audit report produced:**
```yaml
task_id: profile-page
auditor: audit-agent
verdict: conditional
findings:
  - category: security
    severity: warning
    description: >
      PATCH /api/profile does not rate-limit avatar uploads.
      A malicious user could exhaust S3 storage.
    file: src/api/routes/profile.ts
    line: 47
    suggestion: Add rate limiting of 10 uploads per hour per user.
  - category: testing
    severity: info
    description: >
      No test covers the 2MB file size limit for avatar uploads.
    file: tests/integration/profile.test.ts
    suggestion: Add a test that uploads a 3MB file and expects 413.
  - category: style
    severity: info
    description: >
      ProfilePage.tsx is 280 lines. Consider extracting the avatar
      upload section into a separate component.
    file: src/components/ProfilePage.tsx
    suggestion: Extract AvatarUpload component.
rubric_scores:
  execution_quality: 8
  verbosity_score: 7
  architectural_alignment: 9
recommendations:
  - Add upload rate limiting before shipping.
  - Add file-size-limit test.
open_questions: []
```

**Verdict: `conditional`** -- the Build Agent must address the `warning`-severity finding before the workflow can proceed.

---

### Step 5: /build (iteration 2)

The Build Agent addresses the audit findings: adds rate limiting and the missing test.

**Handoff produced (iteration 2):**
```yaml
context: >
  Addressed conditional audit findings: added upload rate limiting
  and file-size-limit test.
deliverable:
  type: code
  description: Rate limiting for avatar uploads and additional test coverage.
  files_changed:
    - src/api/routes/profile.ts (modified)
    - src/api/middleware/upload-rate-limit.ts (new)
    - tests/integration/profile.test.ts (modified)
  validation_status: passed
next_agent: /audit
metadata:
  source_agent: build-agent
  command: build
  iteration: 1
```

---

### Step 6: /audit (iteration 2)

Re-audit passes cleanly.

```yaml
verdict: pass
findings:
  - category: style
    severity: info
    description: ProfilePage.tsx is still 280 lines. Non-blocking.
    suggestion: Extract AvatarUpload component in a future refactor.
rubric_scores:
  execution_quality: 9
  verbosity_score: 7
  architectural_alignment: 9
```

---

### Step 7: /checkpoint

A checkpoint is created after the audit passes, capturing a rollback point.

**Checkpoint produced** (conforms to `checkpoint.schema.json`):
```yaml
checkpoint_id: chk-profile-page-audit-pass
task_id: profile-page
status: gate
stage: audit
state:
  files_changed:
    - src/api/routes/profile.ts
    - src/api/routes/index.ts
    - src/api/middleware/upload-rate-limit.ts
    - src/components/ProfilePage.tsx
    - src/components/ProfilePage.test.tsx
    - src/hooks/useProfile.ts
    - tests/integration/profile.test.ts
  tests_passing: true
  lint_passing: true
  git_ref: abc1234
  notes: Audit passed on second iteration after adding rate limiting.
gate_conditions:
  - condition: All acceptance criteria met
    met: true
  - condition: Audit verdict is pass
    met: true
  - condition: No critical or error findings
    met: true
metadata:
  agent: checkpoint-agent
  command: checkpoint
  iteration: 2
```

---

### Step 8: /ship

The **Ship Agent** opens a pull request, writes the PR description from the accumulated handoffs, and tags reviewers.

**Actions taken:**
- Creates branch `feature/user-profile-page` (if not already on it).
- Pushes to remote.
- Opens PR with title "Add user profile page" and body summarizing the spec, plan, build, and audit trail.
- Links the checkpoint as the merge-readiness gate.

## Artifacts Produced

| Artifact | Schema | Created By |
|---|---|---|
| Spec handoff | `handoff.schema.json` | `/spec` |
| Plan handoff + task list | `handoff.schema.json`, `task.schema.json` | `/plan` |
| Build handoff (iteration 0) | `handoff.schema.json` | `/build` |
| Audit report (conditional) | `audit.schema.json` | `/audit` |
| Build handoff (iteration 1) | `handoff.schema.json` | `/build` |
| Audit report (pass) | `audit.schema.json` | `/audit` |
| Checkpoint | `checkpoint.schema.json` | `/checkpoint` |
| Pull request | GitHub | `/ship` |

## Key Observations

1. **Handoff contracts are the glue.** Every agent reads and writes the same `handoff.schema.json` structure. No agent needs to know the internals of another -- it only needs to parse the handoff.

2. **The audit loop is self-correcting.** The first audit returned `conditional`, which sent the workflow back to `/build`. The second audit returned `pass`. This loop can repeat as many times as needed without manual intervention.

3. **Checkpoints create rollback safety.** The `gate` checkpoint records the exact git ref and file state at the point where the audit passed. If shipping fails or a regression appears later, the workflow can revert to `chk-profile-page-audit-pass`.

4. **The pre-change hook prevents dirty starts.** Before the Build Agent touched any files, the hook verified the plan existed, tests were green, and the working tree was clean. This eliminates an entire class of "built on top of broken state" failures.

5. **Open questions flow downstream.** The spec surfaced two open questions. The plan resolved them and recorded the answers in its `context` field, so the build agent had no ambiguity to resolve.

6. **Iteration metadata tracks cost and effort.** Each handoff's `metadata.iteration` field makes it clear how many cycles the workflow took, enabling retrospectives on estimation accuracy.
