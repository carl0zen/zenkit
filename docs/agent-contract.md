# Agent Contracts

Agents in ZenKit are bounded workers, not autonomous assistants. Each has explicit responsibility, defined inputs, and required outputs.

## Definition format

Each agent specifies: name, responsibility (one sentence), input/output schemas, allowed skills, and constraints. See `agents/*.md` for all 9 definitions.

## Bounded responsibility

Each agent owns one stage. It does not redo earlier work or pre-empt later work. Schemas enforce this — an agent cannot produce output shaped for a different stage without violating its contract.

## Default handoff chain

```
product-manager → system-architect → backend / frontend (parallel)
  → qa → security → auditor → writer → ship
```

This is a default, not a requirement. Teams can remove, reorder, or add agents.

## What agents must NOT do

- Assume context not in the input.
- Skip open questions — silence is a contract violation.
- Modify upstream artifacts — flag problems and hand off.
- Claim certainty without evidence.
- Invoke skills outside their allowed list.

## Adding custom agents

1. Define in `agents/` with name, responsibility, boundaries, handoff targets.
2. Place in the handoff chain at the appropriate position.
3. Ensure schema compatibility with upstream output and downstream input.

Custom agents follow the same contracts as built-in agents.
