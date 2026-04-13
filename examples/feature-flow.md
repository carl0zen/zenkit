# Feature Flow: Add User Profile Page

> End-to-end feature implementation demonstrating the full ZenKit command pipeline and agent handoffs.

## Scenario

Adding a user profile page (name, email, avatar, account settings) to a web app. Requires a new API endpoint, a React component, and auth module integration. All handoffs conform to `handoff.schema.json`.

## Step 1: /spec

Captures requirements: users lack self-service profile access. Decides on single-page inline editing (no separate edit mode). Key constraints: responsive, server-side validation, avatar upload max 2MB JPEG/PNG. Assumes JWT auth and existing S3 bucket. Surfaces open questions (email editability, display name length). Routes to `/plan`.

## Step 2: /plan

Resolves open questions from spec (email admin-only, name max 100 chars). Produces three ordered tasks:

| Task | Description | Depends on |
|---|---|---|
| `profile-api` | GET/PATCH /api/profile endpoint with auth | None |
| `profile-ui` | ProfilePage React component, inline edit, responsive | `profile-api` |
| `profile-tests` | Integration tests: happy path, validation, unauthorized, avatar upload | `profile-ui` |

## Step 3: /build

Pre-change hook validates plan exists, tests green, tree clean. Implements all tasks using existing patterns (React Query, express-validator, presigned S3 URLs). Produces 6 new/modified files. Routes to `/audit`.

## Step 4: /audit (verdict: conditional)

Finds: (1) no rate limit on avatar uploads (warning), (2) no test for 2MB size limit (info), (3) ProfilePage.tsx at 280 lines could be split (info). Warning must be fixed before proceeding.

## Step 5: /build (iteration 2)

Adds upload rate limiting middleware and file-size-limit test. Routes back to `/audit`.

## Step 6: /audit (verdict: pass)

All findings resolved. Style note about component size deferred to future refactor.

## Step 7: /checkpoint

Creates `chk-profile-page-audit-pass` (gate checkpoint) recording git ref, files changed, and all gate conditions met.

## Step 8: /ship

Creates branch `feature/user-profile-page`, pushes, opens PR with spec/plan/build/audit summary, links checkpoint as merge gate.

## Key Observations

1. **Handoff contracts are the glue.** Every agent reads/writes `handoff.schema.json`. No agent needs to know another's internals.
2. **The audit loop is self-correcting.** Conditional verdict sends work back to `/build`; pass lets it proceed.
3. **Checkpoints create rollback safety.** Gate checkpoint records exact state when audit passed.
4. **Pre-change hooks prevent dirty starts.** Plan, tests, and tree verified before any file modification.
5. **Open questions flow downstream.** Spec surfaces them; plan resolves and records answers in context.
