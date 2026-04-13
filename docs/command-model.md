# Command Model

ZenKit defines eight commands. Each takes structured input and produces structured output per the standard contract.

## The eight commands

| Command | Purpose | Position |
|---------|---------|----------|
| `/spec` | Convert requirement into structured specification | Entry point |
| `/plan` | Break spec into tasks, dependencies, risks | After spec |
| `/build` | Execute plan, produce deliverables | After plan |
| `/audit` | Validate build against spec and rubrics | After build |
| `/refactor` | Improve code without behavior change | Any stage (requires green tests) |
| `/handoff` | Transfer context between agents | Any stage |
| `/checkpoint` | Snapshot workflow state for resumption | Any stage |
| `/ship` | Package and release validated output | Terminal (after audit passes) |

See `commands/*.md` for per-command details and examples.

## Chaining

```
spec --> plan --> build --> audit --+--> ship
                   ^               |
                   +-- refactor <--+  (on failure)
```

At any point: `checkpoint` snapshots state, `handoff` transfers between agents.

## Standard output contract

Every command output includes:

- **context** — What the agent knew when deciding.
- **assumptions** — What was assumed but not verified. Each is an explicit risk.
- **constraints** — Hard limits the agent operated within.
- **decision** — What was decided and why, including rejected alternatives.
- **deliverable** — The actual output: code, plan, report, or artifact.
- **risks** — Specific risks in this output, not general concerns.
- **open_questions** — What could not be resolved. Must be answered before downstream work proceeds.
- **next_agent** — Who receives this output next.

This contract makes agents interchangeable at the interface level. Swap the implementation, keep the contract.
