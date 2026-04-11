# ZenKit

**Disciplined workflows for coding agents.**

ZenKit is a lightweight open-source protocol layer for AI-assisted software building. It provides commands, schemas, hooks, checkpoints, and handoffs without framework bloat.

## What problem does ZenKit solve?

Most AI-assisted development workflows share structural failures that have nothing to do with model capability:

- **Drift** — Agents wander from the plan. Each step compounds divergence.
- **Verbosity** — Workflows burn tokens on narration instead of producing artifacts.
- **Hidden uncertainty** — Agents report success without distinguishing validated from assumed.
- **Lost context** — Handoffs between agents lose assumptions, constraints, and decisions.

ZenKit adds structure around your agent runtime — not a replacement for it. A shared vocabulary of commands, schemas, and contracts that make agent workflows predictable, auditable, and repeatable.

## Core Architecture

ZenKit is built from six categories of plain-file artifacts:

| Primitive | Purpose | Format |
|-----------|---------|--------|
| **Commands** | 8 workflow verbs: spec, plan, build, audit, refactor, handoff, checkpoint, ship | Markdown |
| **Schemas** | Machine-validatable contracts for handoffs, tasks, audits, checkpoints, benchmarks | JSON Schema |
| **Skills** | Reusable capabilities: architecture review, security audit, bug triage, prompt pruning | Markdown |
| **Hooks** | Automatic validation at workflow boundaries (pre-change, post-change, pre-ship) | Markdown |
| **Checkpoints** | State snapshots with gate conditions — validated facts vs. assumptions | JSON Schema |
| **Rubrics** | Evaluation criteria for execution quality, verbosity, and architectural alignment | Markdown |

### Standard Output Contract

Every command and agent produces output aligned to this shape:

```
context          — What is the current situation?
assumptions      — What was assumed? (explicit, not hidden)
constraints      — What bounds this work?
decision         — What was decided and why?
deliverable      — What was produced?
risks            — What could go wrong?
open_questions   — What remains unresolved?
next_agent       — Who receives this handoff?
```

## Project Structure

```
zenkit/
├── commands/        8 workflow commands (spec, plan, build, audit, refactor, handoff, checkpoint, ship)
├── schemas/         JSON Schema definitions (handoff, task, audit, checkpoint, benchmark)
├── skills/          7 reusable capabilities
├── hooks/           3 workflow boundary validators
├── agents/          9 specialist agent contracts
├── rubrics/         3 evaluation rubrics
├── templates/       Templates for new commands, skills, agents, tasks
├── examples/        3 complete workflow walkthroughs
├── benchmark/       Benchmark harness, feature specs, results, and scripts
├── docs/            Architecture, philosophy, command model, agent contracts, benchmarking, roadmap
└── src/             Next.js application (landing page + schema validator playground)
```

## Quickstart

```bash
# Install dependencies
npm install

# Run the dev server (landing page + playground)
npm run dev

# Validate all schemas
npm run validate:schemas

# Run tests
npm test

# Run benchmark
npm run benchmark

# Generate benchmark report
npm run benchmark:report
```

## Workflow: How Commands Chain Together

```
/spec → /plan → /build → /audit → /checkpoint → /ship
                  ↑         |
                  └─────────┘  (audit loop: fix and re-audit)
```

1. **`/spec`** — Define what to build. Acceptance criteria, constraints, scope boundaries.
2. **`/plan`** — Break into tasks. Identify dependencies, assign agents.
3. **`/build`** — Implement the plan. Produce code with validation status.
4. **`/audit`** — Review for correctness, security, style. Score with rubrics.
5. **`/checkpoint`** — Save state. Record what's validated vs. assumed.
6. **`/ship`** — Final gates. Pre-ship hooks. Release.

Lateral commands available at any stage:
- **`/refactor`** — Improve without behavior change (requires green tests).
- **`/handoff`** — Transfer context between agents with full contract.

## Agents and Handoffs

ZenKit defines 9 specialist agent contracts with bounded responsibility:

```
product-manager → system-architect → backend-architect → qa-test-engineer
                                   → frontend-architect → ux-engineer → qa-test-engineer
                                                                         → security-specialist
                                                                         → implementation-auditor
                                                                         → technical-writer
```

Each agent has:
- **Responsibility** — What it owns.
- **Boundaries** — What it must NOT do.
- **Input/Output Contract** — Aligned to the standard handoff schema.
- **Handoff Targets** — Who receives its work.

Handoffs are validated against `handoff.schema.json` before the next agent begins. Invalid handoffs are rejected.

## Benchmarking

ZenKit proves certainty through explicit artifacts, not claims.

### What the benchmark measures

| Metric | Description |
|--------|-------------|
| Task name | Feature being benchmarked |
| Start/end time | Execution window |
| Files changed | Concrete deliverables |
| Stage results | Pass/fail per workflow stage |
| Token estimate | Estimated token consumption |
| Cost estimate | Estimated API cost |
| Test results | Tests run, passed, failed |
| Schema validation | Whether schemas validate |
| Uncertainty notes | What remains inferred |

### Telemetry honesty

ZenKit distinguishes **actual** from **estimated** telemetry:

- `telemetry_source: "actual"` — Real instrumentation data.
- `telemetry_source: "estimated"` — Calculated from feature complexity.

Estimated telemetry is never presented as actual. The benchmark result schema enforces this distinction.

### Running a benchmark

```bash
# Run with default feature spec
npm run benchmark

# Run with specific spec
npx tsx benchmark/scripts/run.ts benchmark/feature-specs/schema-validator-playground.json

# Generate markdown report from result
npm run benchmark:report
```

## Schema Validator Playground

ZenKit includes an interactive web-based tool for validating JSON data against ZenKit schemas. Available at `/playground` when running the dev server.

Features:
- Select from all 5 ZenKit schemas
- Pre-loaded example data for each schema
- Client-side validation with Ajv
- Detailed error messages with JSON paths
- Collapsible schema definition viewer

## Extending ZenKit

### Add a new command

1. Copy `templates/command.template.md`
2. Fill in the template fields
3. Place in `commands/`

### Add a new skill

1. Copy `templates/skill.template.md`
2. Define trigger conditions, input/output, quality criteria
3. Place in `skills/`

### Add a new agent

1. Copy `templates/agent.template.md`
2. Define responsibility, boundaries, handoff targets
3. Place in `agents/`

### Add a custom schema

1. Write a JSON Schema in `schemas/`
2. Register it in `src/lib/schemas.ts`
3. Add example data in `src/lib/playground-examples.ts`

## Design Principles

1. **Thin over grand** — Smallest architecture that clearly expresses the idea.
2. **Protocol over persona** — Schemas and contracts, not theatrical agent identities.
3. **Bounded autonomy over fake certainty** — Assumptions are explicit. Uncertainty is recorded.
4. **Validation over narration** — Tests, schemas, and artifacts over prose claims.
5. **Low drift** — Commands, hooks, and handoffs force consistency.
6. **Real benchmarkability** — Token/cost/result reporting is part of the architecture.

## Public Core, Private Overlays

ZenKit's protocol layer is fully open source. Everything in this repo is MIT-licensed.

For team-specific workflows:
- Add private skills in a separate overlay directory
- Add proprietary agent configurations
- Add custom benchmark specs for your features
- Keep the public core unchanged

## Documentation

- [Philosophy](docs/philosophy.md) — Why ZenKit exists and what it values.
- [Architecture](docs/architecture.md) — System design and primitive categories.
- [Command Model](docs/command-model.md) — How commands work and chain together.
- [Agent Contract](docs/agent-contract.md) — Agent definitions and handoff discipline.
- [Benchmarking](docs/benchmarking.md) — The benchmark system and certainty model.
- [Roadmap](docs/roadmap.md) — Future directions.

## License

MIT — see [LICENSE](LICENSE).
