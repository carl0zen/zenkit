# ZenKit — Claude Code Integration

## What this repo is

ZenKit is a lightweight protocol layer for AI-assisted software building. It provides commands, schemas, hooks, checkpoints, and handoffs as plain files — no runtime, no daemon.

## Project structure

```
commands/    8 workflow commands (spec, plan, build, audit, refactor, handoff, checkpoint, ship)
schemas/     5 JSON Schemas (handoff, task, audit, checkpoint, benchmark)
skills/      7 reusable capabilities
hooks/       3 workflow boundary validators
agents/      9 specialist agent contracts
rubrics/     3 evaluation rubrics (0-10 scale)
templates/   Templates for extending the protocol
benchmark/   Feature specs, runner scripts, and result artifacts
src/         Next.js app (landing page + schema validator playground)
e2e/         Playwright E2E tests
docs/        Architecture, philosophy, benchmarking, self-audit
```

## Key commands

```bash
npm run zenkit status        # Show project health
npm run zenkit validate handoff <file>  # Validate JSON against schema
npm run zenkit benchmark:all # Run all 4 benchmark specs (101 checks)
npm test                     # 32 unit tests
npm run test:e2e             # 12 Playwright E2E tests
npm run lint                 # ESLint
npm run build                # Next.js production build
```

## Standard output contract

When producing structured output for ZenKit workflows, use this shape:

- **context** — Current situation
- **assumptions** — What was assumed (explicit, not hidden)
- **constraints** — Hard limits
- **decision** — What was decided and why
- **deliverable** — What was produced
- **risks** — What could go wrong
- **open_questions** — What remains unresolved
- **next_agent** — Who receives this handoff

## When editing this repo

- Schemas are in `schemas/*.schema.json` — validate with `npm run validate:schemas`
- Example data is in `src/lib/playground-examples.ts` — must match current schema shapes
- Benchmark specs are in `benchmark/feature-specs/` — run after changes with `npm run zenkit benchmark:all`
- Landing page components are in `src/components/` — build with `npm run build` to verify
- Landing page imports committed snapshots from `benchmark/results/*-snapshot.json` — regenerate live results with `npm run benchmark:all`, then copy to snapshots if updating the landing page

## Design principles to follow

1. Thin over grand — smallest architecture that works
2. Protocol over persona — schemas and contracts, not theatrical identities
3. Bounded autonomy — assumptions explicit, uncertainty recorded
4. Validation over narration — tests and artifacts over prose
5. Never fabricate telemetry — estimated data labeled, actual is null when unavailable
