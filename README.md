# ZenKit

[![CI](https://github.com/carl0zen/zenkit/actions/workflows/ci.yml/badge.svg)](https://github.com/carl0zen/zenkit/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/zenkit)](https://www.npmjs.com/package/zenkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Disciplined workflows for Claude Code.**

Add structured specs, plans, audits, checkpoints, and handoffs to any project. Native slash commands and skills. No daemon, no framework, no lock-in.

**[Landing Page](https://zenkit.systems)** | **[Playground](https://zenkit.systems/playground)** | **[npm](https://www.npmjs.com/package/zenkit)**

## Quick start

```bash
npx zenkit init claude
```

That's it. This creates:

```
.claude/commands/zenkit-spec.md
.claude/commands/zenkit-plan.md
.claude/commands/zenkit-build.md
.claude/commands/zenkit-audit.md
.claude/commands/zenkit-checkpoint.md
.claude/commands/zenkit-handoff.md
.claude/skills/zenkit-audit/SKILL.md
.claude/skills/zenkit-handoff/SKILL.md
.claude/skills/zenkit-checkpoint/SKILL.md
CLAUDE.md
```

Then in Claude Code, use the slash commands:

```
/zenkit-spec "add user profile page"
/zenkit-plan
/zenkit-build
/zenkit-audit
/zenkit-checkpoint
```

## What it does

| Command | Purpose |
|---------|---------|
| `/zenkit-spec` | Define what to build — acceptance criteria, constraints, scope |
| `/zenkit-plan` | Break a spec into tasks with explicit assumptions and risks |
| `/zenkit-build` | Implement from a plan with documented decisions |
| `/zenkit-audit` | Review for correctness, security, and architectural alignment |
| `/zenkit-checkpoint` | Capture state — distinguish validated facts from assumptions |
| `/zenkit-handoff` | Transfer context without losing decisions or open questions |

Every command produces structured output with: **context, assumptions, constraints, decision, deliverable, risks, open questions, next handoff.**

## Why

Most AI-assisted development drifts. Agents wander from the plan, burn tokens on narration, hide uncertainty behind confident prose, and lose context between sessions. ZenKit adds discipline through file-based conventions that Claude Code already supports — slash commands, skills, and project memory.

## Three layers

| Layer | What | How |
|-------|------|-----|
| **Claude Code pack** | Slash commands + skills + CLAUDE.md | `npx zenkit init claude` |
| **Protocol + CLI** | Schemas, benchmarks, validation engine | `npm install zenkit` |
| **MCP server** | Dynamic tool calls for validate, benchmark, checkpoint | Planned |

Start with layer 1. Add layer 2 when you want machine-verifiable workflows.

## Programmatic API

```bash
npm install zenkit
```

```typescript
import { validate, createHandoff, loadFeatureSpec } from 'zenkit'

const result = validate('handoff', myData)
if (!result.valid) console.error(result.errors)

const handoff = createHandoff({
  context: 'Completed auth module',
  assumptions: ['Redis available'],
  decision: 'JWT with refresh tokens',
  deliverable: { type: 'code', description: 'Auth module' },
  next_agent: 'frontend-architect',
})
```

## CLI

```bash
npx zenkit init claude              # Install Claude Code commands + skills
npx zenkit init                     # Scaffold full protocol structure
npx zenkit validate handoff data.json   # Validate JSON against schema
npx zenkit benchmark:all            # Run all benchmark specs
npx zenkit audit                    # Full audit with structured report
npx zenkit status                   # Project health check
```

## Benchmark system

ZenKit includes a benchmark harness that verifies acceptance criteria against the actual implementation.

- **5 feature specs**, 44 acceptance criteria, 131+ checks
- 7 verification types: `file_exists`, `file_contains`, `schema_count`, `examples_valid`, `schemas_consistent`, `test_passes`, `json_path_equals`
- Telemetry is always labeled as estimated or actual — never fabricated
- Every result includes `uncertainty` and `limitations` arrays

```bash
npx zenkit benchmark:all     # Run all specs
npx zenkit audit             # Run benchmarks + produce audit report
```

## Test coverage

| Layer | Count | What |
|-------|-------|------|
| Unit (Vitest) | 54 | Schemas, API, CLI, benchmarks, handoffs, feature specs |
| E2E (Playwright) | 13 | Playground UI, validation flows, landing page |
| Benchmarks | 131+ | Code structure, schema compilation, test execution, self-audit |

## Design principles

1. **Thin over grand** — Files, not frameworks.
2. **Protocol over persona** — Contracts, not theatrical agent identities.
3. **Bounded autonomy** — Assumptions explicit, uncertainty recorded.
4. **Validation over narration** — Artifacts over prose.
5. **Claude-native** — Slash commands and skills, not a parallel universe.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Documentation

- [Philosophy](docs/philosophy.md) | [Architecture](docs/architecture.md) | [Commands](docs/command-model.md)
- [Agents](docs/agent-contract.md) | [Benchmarking](docs/benchmarking.md) | [Self-Audit](docs/self-audit.md)
- [Roadmap](docs/roadmap.md)

## License

MIT — see [LICENSE](LICENSE).
