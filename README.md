# ZenKit

**Disciplined workflows for coding agents.**

ZenKit is a lightweight open-source protocol layer for AI-assisted software building. Commands, schemas, hooks, checkpoints, and handoffs — without framework bloat.

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
npm run dev              # Landing page at localhost:3000, playground at /playground
npm test                 # 16 schema validation tests
npm run validate:schemas # Verify all 5 JSON schemas compile
npm run benchmark        # Run acceptance-criteria benchmark
npm run benchmark:report # Generate markdown report from results
npm run benchmark:compare # Compare zenkit vs baseline results
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

### What the benchmark actually checks

The v0.2 runner verifies:
- **Feature spec validity** — name, criteria, and limitations are present
- **Schema compilation** — all JSON schemas compile without errors, consistent draft version
- **Expected files** — each file in the spec exists in the repo
- **Acceptance criteria** — each criterion runs a verification step (file_contains, schema_count, examples_valid, etc.)

### Telemetry honesty

- **Estimated** data includes a `basis` field explaining the heuristic.
- **Actual** telemetry is `null` when no API instrumentation is available. Never fabricated.
- Every result includes `uncertainty` and `limitations` arrays.

### Baseline comparison

ZenKit supports `zenkit` and `baseline` benchmark modes for structural comparison. Current comparison data is **illustrative** — both modes verify the same codebase. A meaningful comparison requires A/B workflow execution, which is documented but not yet implemented.

```bash
npm run benchmark          # zenkit mode
npm run benchmark:baseline # baseline mode
npm run benchmark:compare  # side-by-side comparison
```

### Self-audit

ZenKit uses its own benchmark system to audit itself. This is useful for testing expressiveness but is not self-certification. See [docs/self-audit.md](docs/self-audit.md) for safeguards and limitations.

## Schema Validator Playground

Interactive tool at `/playground` for validating JSON against ZenKit schemas. Client-side validation with Ajv, pre-loaded examples, detailed error paths.

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

## Documentation

- [Philosophy](docs/philosophy.md) — Design principles.
- [Architecture](docs/architecture.md) — Primitives and workflow composition.
- [Command Model](docs/command-model.md) — The 8 commands and output contract.
- [Agent Contract](docs/agent-contract.md) — Agent definitions and handoff chains.
- [Benchmarking](docs/benchmarking.md) — The benchmark system.
- [Self-Audit](docs/self-audit.md) — How ZenKit audits itself and the limits of self-verification.
- [Roadmap](docs/roadmap.md) — Future directions.

## License

MIT — see [LICENSE](LICENSE).
