# ZenKit

[![CI](https://github.com/carl0zen/zenkit/actions/workflows/ci.yml/badge.svg)](https://github.com/carl0zen/zenkit/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/zenkit)](https://www.npmjs.com/package/zenkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Disciplined workflows for coding agents.**

ZenKit is a lightweight open-source protocol layer for AI-assisted software building. Commands, schemas, hooks, checkpoints, and handoffs — without framework bloat.

**[Landing Page](https://carl0zen.github.io/zenkit)** | **[Playground](https://carl0zen.github.io/zenkit/playground)** | **[npm](https://www.npmjs.com/package/zenkit)**

## Install

```bash
npm install zenkit
```

### As a library

```typescript
import { validate, getSchemaNames, createHandoff, loadFeatureSpec } from 'zenkit'

// Validate data against any ZenKit schema
const result = validate('handoff', myHandoffData)
if (!result.valid) {
  console.error(result.errors) // [{ path: '/deliverable', message: '...', keyword: '...' }]
}

// Create a validated handoff
const handoff = createHandoff({
  context: 'Completed auth module',
  assumptions: ['Redis available'],
  decision: 'JWT with refresh tokens',
  deliverable: { type: 'code', description: 'Auth module' },
  next_agent: 'frontend-architect',
})

// Load and validate a feature spec
const spec = loadFeatureSpec('benchmark/feature-specs/my-feature.json')
```

### As a CLI

```bash
npx zenkit validate handoff data.json    # Validate JSON against schema
npx zenkit benchmark:all                 # Run all benchmark specs
npx zenkit audit                         # Full audit with report
npx zenkit status                        # Project health check
npx zenkit init                          # Scaffold ZenKit into a project
```

## Problem

Most AI-assisted development workflows share structural failures unrelated to model capability:

- **Drift** — Agents wander from the plan. Each step compounds divergence.
- **Verbosity** — Workflows burn tokens on narration instead of producing artifacts.
- **Hidden uncertainty** — Agents report success without distinguishing validated from assumed.
- **Lost context** — Handoffs between agents lose assumptions, constraints, and decisions.

ZenKit adds structure around your agent runtime. It does not replace it.

## Architecture

Six categories of plain-file artifacts:

| Primitive | Purpose | Format |
|-----------|---------|--------|
| **Commands** | 8 workflow verbs: spec, plan, build, audit, refactor, handoff, checkpoint, ship | Markdown |
| **Schemas** | Machine-validatable contracts for handoffs, tasks, audits, checkpoints, benchmarks | JSON Schema |
| **Skills** | Reusable capabilities: architecture review, security audit, bug triage, prompt pruning | Markdown |
| **Hooks** | Automatic validation at workflow boundaries | Markdown |
| **Checkpoints** | State snapshots with gate conditions — validated facts vs. assumptions | JSON Schema |
| **Rubrics** | Evaluation criteria scored 0-10 | Markdown |

### Standard output contract

Every command produces output aligned to:

```
context, assumptions, constraints, decision,
deliverable, risks, open_questions, next_agent
```

## Quickstart

```bash
npm install

# CLI
npm run zenkit status           # Project health check
npm run zenkit validate handoff data.json  # Validate against schema
npm run zenkit benchmark:all    # Run all 5 benchmark specs

# Development
npm run dev              # Landing page at localhost:3000, playground at /playground
npm test                 # 54 unit tests
npm run test:e2e         # 13 Playwright E2E browser tests
npm run lint             # ESLint
npm run build            # Production build

# Benchmarking
npm run benchmark        # Single spec (schema validator playground)
npm run benchmark:all    # All 5 specs (131 checks, 44 criteria)
npm run benchmark:report # Markdown report from latest result
npm run benchmark:compare # ZenKit vs baseline comparison
npm run benchmark:visualize -- --summary  # Mermaid workflow diagram
```

## Workflow

```
/spec → /plan → /build → /audit → /checkpoint → /ship
                  ↑         |
                  └─────────┘  (audit loop)
```

Lateral: `/refactor` (behavior-preserving improvement), `/handoff` (agent-to-agent context transfer).

## Benchmarking

ZenKit benchmarks verify acceptance criteria against the actual implementation — not file existence, not narrative claims.

### Current coverage

5 feature specs with 44 acceptance criteria and 131 total checks:

| Spec | Criteria | Checks |
|------|----------|--------|
| Schema Validator Playground | 8 | 25 |
| Handoff Contract System | 9 | 24 |
| Protocol Completeness | 10 | 37 |
| Self-Audit | 10 | 25 |
| CLI Tool | 7 | 20 |

### Verification types

- `file_exists` — File is present
- `file_contains` — File contains a specific string pattern
- `schema_count` — Expected number of schemas compile
- `examples_valid` — Fixture data validates against schemas
- `schemas_consistent` — All schemas use the same JSON Schema draft

### Telemetry honesty

- **Estimated** data includes a `basis` field explaining the heuristic.
- **Actual** telemetry is `null` when no API instrumentation is available. Never fabricated.
- Every result includes `uncertainty` and `limitations` arrays.

### Baseline comparison

ZenKit supports `zenkit` and `baseline` modes. Current comparison data is **illustrative** — both modes verify the same codebase. A meaningful comparison requires A/B workflow execution.

### Self-audit

ZenKit uses its own benchmark system to audit itself. This is structured introspection, not self-certification. See [docs/self-audit.md](docs/self-audit.md).

### Workflow visualization

```bash
npm run benchmark:visualize -- --summary  # Mermaid diagram of all specs
npm run benchmark:visualize               # Mermaid diagram of single result
```

## API Reference

### `validate(schemaName, data)`

Validate data against a ZenKit schema. Returns `{ valid, errors, schemaName }`.

### `getSchemaNames()`

Returns array of all schema names: `handoff`, `task`, `audit`, `checkpoint`, `benchmark`, `feature-spec`.

### `getSchema(name)`

Returns the raw JSON Schema object for a named schema.

### `createHandoff(data)`

Create and validate a handoff object. Returns the handoff if valid, throws if invalid.

### `loadFeatureSpec(path)`

Load a feature spec from a JSON file. Validates against `feature-spec.schema.json`. Returns the spec if valid, throws if invalid.

## Schema Validator Playground

Interactive tool at `/playground` for validating JSON against ZenKit schemas. Client-side validation with Ajv, pre-loaded examples, detailed error paths.

## CLI

```bash
npm run zenkit help                         # All commands
npm run zenkit status                       # Project health
npm run zenkit validate <schema> <file>     # Validate JSON
npm run zenkit validate:all                 # Check all schemas compile
npm run zenkit benchmark [spec]             # Run single benchmark
npm run zenkit benchmark:all                # Run all benchmarks
npm run zenkit audit                        # Run all benchmarks + produce audit report
npm run zenkit init [dir]                   # Scaffold ZenKit into a project
```

## Test coverage

| Layer | Tests | What it covers |
|-------|-------|----------------|
| Unit (Vitest) | 54 | Schema validation, example data, edge cases, benchmark results, CLI commands, public API, handoff creation, feature spec loading |
| E2E (Playwright) | 13 | Playground UI, schema selection, validation flows, format button, landing page sections, navigation |
| Benchmarks | 131 checks | Code structure, schema compilation, test execution, JSON values, documentation, self-audit, CLI |

## Extending

```
templates/command.template.md  → commands/
templates/skill.template.md   → skills/
templates/agent.template.md   → agents/
```

Custom schemas: add to `schemas/`, register in `src/lib/schemas.ts`, add example data in `src/lib/playground-examples.ts`.

## Design Principles

1. **Thin over grand** — Smallest architecture that works.
2. **Protocol over persona** — Schemas and contracts, not theatrical agent identities.
3. **Bounded autonomy** — Assumptions explicit. Uncertainty recorded. Claims bounded.
4. **Validation over narration** — Tests, schemas, and artifacts over prose.
5. **Low drift** — Commands and handoffs force consistency.
6. **Benchmarkable** — Acceptance criteria, not file existence.

## CI

GitHub Actions runs on push/PR to main: lint, unit tests, schema validation, all benchmarks, build, E2E tests. Benchmark results uploaded as artifacts.

## Documentation

- [Philosophy](docs/philosophy.md) — Design principles.
- [Architecture](docs/architecture.md) — Primitives and workflow composition.
- [Command Model](docs/command-model.md) — The 8 commands and output contract.
- [Agent Contract](docs/agent-contract.md) — Agent definitions and handoff chains.
- [Benchmarking](docs/benchmarking.md) — The benchmark system.
- [Self-Audit](docs/self-audit.md) — Self-verification and its limits.
- [Roadmap](docs/roadmap.md) — What's done and what's next.

## License

MIT — see [LICENSE](LICENSE).
