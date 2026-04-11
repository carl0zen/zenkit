# Audit Flow: Security Audit of Authentication Module

> Standalone audit of existing code, producing findings that drive a targeted refactor, followed by a re-audit to confirm the fixes.

## Scenario
The authentication module has grown organically over 18 months. No formal security review has been conducted since the initial implementation. This workflow uses `/audit` as the entry point rather than `/spec` or `/plan`, demonstrating that audits can stand alone. Findings from the audit are handed off to a refactor cycle, and a second audit confirms the remediation.

## Workflow Steps

### Step 1: /audit (standalone entry)

The **Audit Agent** is invoked directly against the authentication module. No prior spec or plan is required -- the audit operates on the existing codebase.

**Command:** `/audit src/auth/ --scope security`

The audit agent reads all files in `src/auth/`, cross-references them with the `architecture-review` skill for structural concerns, and produces a report conforming to `audit.schema.json`.

**Audit report produced:**
```yaml
task_id: auth-security-audit
auditor: audit-agent
timestamp: "2026-04-11T10:00:00Z"
verdict: fail
findings:
  - category: security
    severity: critical
    description: >
      JWT secret is loaded from process.env.JWT_SECRET with no fallback
      validation. If the environment variable is unset, the secret defaults
      to an empty string, which signs tokens with no secret.
    file: src/auth/jwt.ts
    line: 12
    suggestion: >
      Throw a startup error if JWT_SECRET is missing or shorter than
      32 characters. Never fall back to a default value.
  - category: security
    severity: critical
    description: >
      Password reset tokens are generated using Math.random(), which is
      not cryptographically secure. Tokens are predictable.
    file: src/auth/reset.ts
    line: 45
    suggestion: >
      Replace Math.random() with crypto.randomBytes(32).toString('hex').
  - category: security
    severity: error
    description: >
      Rate limiting on POST /api/auth/login is set to 100 attempts per
      minute per IP. This is too high and does not prevent credential
      stuffing attacks.
    file: src/auth/routes.ts
    line: 28
    suggestion: >
      Reduce to 10 attempts per minute per IP. Add progressive delay
      (exponential backoff) after 5 failed attempts per account.
  - category: security
    severity: error
    description: >
      Session tokens are stored in localStorage, making them vulnerable
      to XSS attacks. Tokens should be in httpOnly cookies.
    file: src/auth/session.ts
    line: 67
    suggestion: >
      Move token storage to httpOnly, Secure, SameSite=Strict cookies.
      Remove all localStorage token access.
  - category: security
    severity: warning
    description: >
      Password hashing uses bcrypt with cost factor 8. Current
      recommendations are cost factor 12 or higher.
    file: src/auth/password.ts
    line: 19
    suggestion: Increase bcrypt cost factor to 12.
  - category: architecture
    severity: warning
    description: >
      Authentication logic is split across 8 files with circular
      dependencies between jwt.ts, session.ts, and middleware.ts.
    suggestion: >
      Consolidate into a clear layered structure: config, crypto,
      session, middleware. Break circular deps.
  - category: testing
    severity: warning
    description: >
      No tests cover the token expiry path. Expired tokens may be
      accepted silently.
    file: src/auth/jwt.ts
    suggestion: >
      Add tests that verify expired tokens return 401 and refresh
      tokens are rotated correctly.
rubric_scores:
  execution_quality: 4
  verbosity_score: 6
  architectural_alignment: 5
recommendations:
  - Fix both critical findings immediately -- they represent active vulnerabilities.
  - Address error-severity findings before the next release.
  - Schedule warning-severity findings for the current sprint.
  - Consider a follow-up architecture-review skill invocation to restructure the module.
open_questions:
  - Is there a WAF or reverse proxy that provides additional rate limiting upstream?
  - Are there any compliance requirements (SOC2, HIPAA) that affect token storage?
```

**Verdict: `fail`** -- two critical findings make this module unsafe to leave as-is.

---

### Step 2: Handoff to /plan

The audit findings are packaged into a handoff contract targeting `/plan`. This is the bridge between a standalone audit and the fix cycle.

**Handoff produced:**
```yaml
context: >
  Security audit of src/auth/ found 2 critical, 2 error, and 3 warning
  findings. The critical findings (JWT secret fallback and predictable
  reset tokens) represent active vulnerabilities that must be fixed before
  any other work proceeds.
assumptions:
  - The application is in production and serving real users.
  - Fixes must be backward-compatible with existing valid sessions.
constraints:
  - Critical fixes must ship within 24 hours.
  - Session migration (localStorage to cookies) requires a client update.
decision: >
  Prioritize fixes by severity. Critical findings first in an emergency
  patch, then error findings in a follow-up, then warnings.
deliverable:
  type: review
  description: Security audit report with 7 findings across 3 severity levels.
  validation_status: failed
risks:
  - description: >
      Migrating from localStorage to httpOnly cookies will invalidate
      all existing sessions, forcing users to re-login.
    severity: high
    mitigation: >
      Implement a 7-day migration window where both storage mechanisms
      are checked. After 7 days, remove localStorage support.
next_agent: /plan
metadata:
  source_agent: audit-agent
  command: audit
  iteration: 0
```

---

### Step 3: /plan (refactor plan)

The **Plan Agent** receives the audit handoff and produces a prioritized task list split into two phases: emergency patch and hardening.

**Command:** `/plan` (reads the audit handoff)

**Task list produced:**

**Phase 1: Emergency patch (critical + error)**

| Task ID | Name | Acceptance Criteria | Dependencies |
|---|---|---|---|
| `auth-jwt-secret` | Validate JWT_SECRET at startup | App throws and refuses to start if JWT_SECRET is missing or < 32 chars | None |
| `auth-reset-token` | Use crypto.randomBytes for reset tokens | Reset tokens generated with crypto.randomBytes(32); Math.random removed | None |
| `auth-rate-limit` | Tighten login rate limiting | 10 attempts/min/IP; exponential backoff after 5 failed attempts per account | None |
| `auth-cookie-session` | Migrate session tokens to httpOnly cookies | Tokens stored in httpOnly, Secure, SameSite=Strict cookies; localStorage support remains for 7-day migration | `auth-jwt-secret` |

**Phase 2: Hardening (warnings)**

| Task ID | Name | Acceptance Criteria | Dependencies |
|---|---|---|---|
| `auth-bcrypt-cost` | Increase bcrypt cost factor to 12 | New passwords hashed with cost 12; existing hashes upgraded on next login | Phase 1 complete |
| `auth-restructure` | Resolve circular dependencies in auth module | No circular imports; layered structure: config -> crypto -> session -> middleware | Phase 1 complete |
| `auth-expiry-tests` | Add token expiry test coverage | Tests verify expired tokens return 401; refresh rotation tested | Phase 1 complete |

---

### Step 4: /build (Phase 1)

The **Build Agent** implements the emergency patch tasks.

**Pre-change hook fires:**
- Plan exists: PASS
- Test suite green: PASS (existing tests still pass despite the vulnerabilities)
- Working tree clean: PASS

**Handoff produced:**
```yaml
context: >
  Implemented all Phase 1 tasks. JWT secret validation, crypto-secure
  reset tokens, tightened rate limiting, and session cookie migration
  with backward-compatible localStorage fallback.
deliverable:
  type: code
  description: Emergency security patch for authentication module.
  files_changed:
    - src/auth/config.ts (new -- centralized auth config with validation)
    - src/auth/jwt.ts (modified)
    - src/auth/reset.ts (modified)
    - src/auth/routes.ts (modified)
    - src/auth/session.ts (modified)
    - src/auth/middleware.ts (modified)
    - tests/unit/jwt-secret-validation.test.ts (new)
    - tests/unit/reset-token-security.test.ts (new)
    - tests/integration/rate-limiting.test.ts (new)
    - tests/integration/session-cookie.test.ts (new)
  validation_status: passed
risks:
  - description: >
      Users with very old sessions (stored only in localStorage) will
      be forced to re-login after the 7-day migration window.
    severity: low
    mitigation: Acceptable trade-off for security improvement.
next_agent: /audit
metadata:
  source_agent: build-agent
  command: build
  iteration: 0
```

---

### Step 5: /audit (re-audit Phase 1)

The Audit Agent re-audits the authentication module, scoped to the findings from the original audit.

**Audit report produced:**
```yaml
task_id: auth-security-audit-remediation
auditor: audit-agent
timestamp: "2026-04-11T14:30:00Z"
verdict: pass
findings:
  - category: security
    severity: info
    description: >
      JWT_SECRET validation now throws at startup. Verified by test.
      Original critical finding resolved.
    file: src/auth/config.ts
  - category: security
    severity: info
    description: >
      Reset tokens now use crypto.randomBytes. Math.random is no longer
      present anywhere in src/auth/. Original critical finding resolved.
    file: src/auth/reset.ts
  - category: security
    severity: info
    description: >
      Rate limiting reduced to 10/min/IP with exponential backoff.
      Original error finding resolved.
    file: src/auth/routes.ts
  - category: security
    severity: info
    description: >
      Session tokens moved to httpOnly cookies. localStorage fallback
      present for migration window. Original error finding resolved.
    file: src/auth/session.ts
rubric_scores:
  execution_quality: 9
  verbosity_score: 7
  architectural_alignment: 7
recommendations:
  - Proceed with Phase 2 hardening tasks.
  - Set a calendar reminder to remove localStorage fallback after the 7-day migration window.
open_questions: []
```

**Verdict: `pass`** -- all critical and error findings resolved.

---

### Step 6: /checkpoint

A checkpoint captures the state after the emergency patch passes audit, creating a rollback point before Phase 2 begins.

**Checkpoint produced:**
```yaml
checkpoint_id: chk-auth-emergency-patch
task_id: auth-security-audit
status: rollback_point
stage: audit
state:
  files_changed:
    - src/auth/config.ts
    - src/auth/jwt.ts
    - src/auth/reset.ts
    - src/auth/routes.ts
    - src/auth/session.ts
    - src/auth/middleware.ts
    - tests/unit/jwt-secret-validation.test.ts
    - tests/unit/reset-token-security.test.ts
    - tests/integration/rate-limiting.test.ts
    - tests/integration/session-cookie.test.ts
  tests_passing: true
  lint_passing: true
  git_ref: def5678
  notes: >
    Emergency security patch. Phase 1 of auth hardening. Two critical
    and two error findings resolved. Phase 2 (bcrypt, restructure, tests)
    still pending.
gate_conditions:
  - condition: All critical findings resolved
    met: true
  - condition: All error findings resolved
    met: true
  - condition: Audit verdict is pass
    met: true
metadata:
  agent: checkpoint-agent
  command: checkpoint
  iteration: 1
```

**Why `rollback_point` instead of `gate`:** Phase 2 involves structural refactoring (resolving circular dependencies). If that refactoring introduces regressions, the team can roll back to this checkpoint without losing the critical security fixes.

---

### Step 7: /build (Phase 2) and /audit (Phase 2)

Phase 2 follows the same build-audit cycle for the remaining warning-severity findings: bcrypt cost factor increase, circular dependency resolution, and token expiry tests. This cycle runs independently and produces its own checkpoint upon completion.

*(Phase 2 follows the same pattern as Steps 4-6 and is omitted for brevity.)*

---

### Step 8: /checkpoint (final)

A final gate checkpoint records the fully hardened state.

```yaml
checkpoint_id: chk-auth-hardening-complete
task_id: auth-security-audit
status: gate
stage: audit
state:
  tests_passing: true
  lint_passing: true
  git_ref: ghi9012
  notes: >
    Full auth hardening complete. All 7 original audit findings resolved.
    Module restructured with no circular dependencies.
gate_conditions:
  - condition: All original audit findings resolved
    met: true
  - condition: Phase 1 audit passed
    met: true
  - condition: Phase 2 audit passed
    met: true
  - condition: No circular dependencies in src/auth/
    met: true
metadata:
  agent: checkpoint-agent
  command: checkpoint
  iteration: 3
```

## Artifacts Produced

| Artifact | Schema | Created By |
|---|---|---|
| Initial security audit report | `audit.schema.json` | `/audit` |
| Audit-to-plan handoff | `handoff.schema.json` | `/audit` |
| Phased refactor plan + task list | `handoff.schema.json`, `task.schema.json` | `/plan` |
| Phase 1 build handoff | `handoff.schema.json` | `/build` |
| Phase 1 re-audit report (pass) | `audit.schema.json` | `/audit` |
| Phase 1 checkpoint (rollback_point) | `checkpoint.schema.json` | `/checkpoint` |
| Phase 2 build handoff | `handoff.schema.json` | `/build` |
| Phase 2 re-audit report (pass) | `audit.schema.json` | `/audit` |
| Final checkpoint (gate) | `checkpoint.schema.json` | `/checkpoint` |

## Key Observations

1. **Audits can be entry points.** Unlike the feature and bug-fix flows that start with `/spec`, this workflow starts with `/audit`. ZenKit commands are composable -- any command can be the starting point if the context supports it.

2. **Severity drives phasing.** The plan split work into two phases based on audit severity levels. Critical and error findings went into an emergency patch; warnings went into a follow-up. This pattern ensures the most dangerous issues are fixed first without blocking on lower-priority improvements.

3. **Rollback points protect incremental progress.** The Phase 1 checkpoint used `rollback_point` status rather than `gate`. This communicates that the checkpoint exists specifically so Phase 2 refactoring can be reverted without losing the security fixes.

4. **Skills complement commands.** The `architecture-review` skill was invoked by the Audit Agent to assess the structural issues (circular dependencies) in the auth module. Skills provide domain-specific depth; commands provide workflow structure.

5. **The audit-handoff-plan bridge is explicit.** Going from audit findings to a fix plan required a handoff contract. This forces the audit output to be actionable rather than just a list of complaints. Each finding has a suggestion, and the handoff's `decision` field records the prioritization strategy.

6. **Re-audits are scoped, not full repeats.** The Phase 1 re-audit checked only the findings from the original audit rather than performing a full security review from scratch. This keeps the feedback loop tight and avoids discovering new issues mid-remediation (those go into a separate audit cycle).

7. **Two checkpoints tell a story.** The pair of checkpoints (`chk-auth-emergency-patch` and `chk-auth-hardening-complete`) creates a clear narrative: "We fixed the urgent issues first, then improved the rest." This is useful for compliance documentation and incident post-mortems.
