# Audit Flow: Security Audit of Authentication Module

> Standalone audit of existing code, producing findings that drive a targeted refactor, then re-audit to confirm fixes.

## Scenario

The auth module (src/auth/) has had no formal security review in 18 months. This flow starts with `/audit` as the entry point (no prior spec/plan needed), demonstrating composable command ordering. All handoffs conform to `handoff.schema.json`; audit reports conform to `audit.schema.json`.

## Step 1: /audit (standalone entry)

Audits all files in src/auth/. Verdict: **fail** (2 critical, 2 error, 3 warning findings):

- **Critical:** JWT_SECRET falls back to empty string if env var unset -- tokens signed with no secret
- **Critical:** Password reset tokens use Math.random() instead of crypto.randomBytes
- **Error:** Login rate limit too high (100/min/IP) -- enables credential stuffing
- **Error:** Session tokens in localStorage -- vulnerable to XSS
- **Warning:** bcrypt cost factor 8 (should be 12+)
- **Warning:** Circular dependencies across jwt.ts, session.ts, middleware.ts
- **Warning:** No tests for token expiry path

## Step 2: Handoff to /plan

Audit findings packaged as handoff. Decision: prioritize by severity -- critical/error in emergency patch, warnings in follow-up. Risk: session migration (localStorage to cookies) invalidates existing sessions; mitigated with 7-day dual-support window.

## Step 3: /plan (phased refactor)

**Phase 1 -- Emergency patch (critical + error):**

| Task | Fix |
|---|---|
| `auth-jwt-secret` | Throw at startup if JWT_SECRET missing or < 32 chars |
| `auth-reset-token` | Replace Math.random() with crypto.randomBytes(32) |
| `auth-rate-limit` | 10 attempts/min/IP + exponential backoff after 5 failures |
| `auth-cookie-session` | httpOnly/Secure/SameSite=Strict cookies, 7-day localStorage fallback |

**Phase 2 -- Hardening (warnings):** bcrypt cost 12, resolve circular deps, add expiry tests.

## Step 4: /build (Phase 1)

Implements all Phase 1 tasks. Produces 10 new/modified files (source + tests). Routes to `/audit`.

## Step 5: /audit (re-audit Phase 1, verdict: pass)

All critical and error findings confirmed resolved. Recommends proceeding to Phase 2.

## Step 6: /checkpoint (rollback_point)

Creates `chk-auth-emergency-patch` as a **rollback_point** (not gate) -- so Phase 2 refactoring can be reverted without losing security fixes.

## Step 7: Phase 2

Same build-audit cycle for warnings (bcrypt, circular deps, expiry tests). Produces its own checkpoint on completion.

## Step 8: /checkpoint (final gate)

Creates `chk-auth-hardening-complete` (gate). All 7 original findings resolved, no circular deps.

## Key Observations

1. **Audits can be entry points.** No prior spec/plan required -- any command can start a workflow.
2. **Severity drives phasing.** Critical/error first in emergency patch; warnings in follow-up.
3. **Rollback points protect incremental progress.** Phase 1 checkpoint lets Phase 2 be reverted safely.
4. **Skills complement commands.** architecture-review skill provided structural analysis within the audit.
5. **Re-audits are scoped.** Phase 1 re-audit checks only original findings, not a full re-review.
6. **Two checkpoints tell a story.** Emergency patch then full hardening -- useful for compliance docs.
