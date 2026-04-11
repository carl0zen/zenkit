# ZenKit Agent Contracts

Agents in ZenKit are not autonomous assistants. They are bounded workers with explicit responsibilities, defined inputs, and required outputs. An agent's value comes from what it reliably produces, not from what it can theoretically do.

## Agent Definition Format

Each agent is defined by:

- **name**: A unique identifier (e.g., `system-architect`, `qa`).
- **responsibility**: A single sentence describing what this agent does. If you need more than one sentence, the agent does too much.
- **input_schema**: The JSON schema of what the agent receives.
- **output_schema**: The JSON schema of what the agent must produce.
- **skills**: The list of skills this agent may invoke.
- **constraints**: What the agent must not do.

The definition is a contract. If an agent produces output that does not match its output schema, the output is rejected regardless of quality.

## Bounded Responsibility

Each agent owns one stage of the workflow. It does not reach backward to redo earlier work or forward to pre-empt later work. Boundaries are enforced by schemas -- an agent literally cannot produce output shaped for a different stage without violating its contract.

This prevents the common failure mode where a "helpful" agent rewrites the spec during the build phase or skips the audit during shipping.

## The Standard Handoff Chain

ZenKit defines a default agent chain for full-lifecycle feature delivery:

```
product-manager --> system-architect --> backend / frontend (parallel)
    --> qa --> security --> auditor --> writer --> ship
```

- **product-manager**: Owns `spec`. Converts requirements into structured specifications.
- **system-architect**: Owns `plan`. Turns specs into implementation plans.
- **backend / frontend**: Own `build`. Execute plans in their respective domains. Can run in parallel.
- **qa**: Owns `audit` for functional correctness.
- **security**: Owns `audit` for security posture.
- **auditor**: Owns final `audit`. Validates the complete deliverable against the original spec.
- **writer**: Owns documentation. Produces user-facing and developer-facing docs.
- **ship**: Owns `ship`. Packages and releases.

This chain is a default, not a requirement. Teams can remove, reorder, or add agents.

## What Agents Must NOT Do

- **Assume context not in the input.** If it is not in the handoff artifact, it does not exist.
- **Skip open questions.** Every unresolved question must appear in `open_questions`. Silence is a contract violation.
- **Modify upstream artifacts.** An agent does not edit the spec or plan. It flags problems and hands off.
- **Claim certainty without evidence.** "This is secure" without a security report is a constraint violation.
- **Invoke skills outside their allowed list.** The skill allowlist prevents scope creep.

## Adding Custom Agents

To add a custom agent:

1. Define the agent in the agents configuration with name, responsibility, input/output schemas, skills, and constraints.
2. Place the agent in the handoff chain at the appropriate position.
3. Ensure the upstream agent's output schema is compatible with the new agent's input schema.
4. Add any custom rubrics the agent should be evaluated against.

Custom agents follow the same contracts as built-in agents. There is no distinction at the protocol level.
