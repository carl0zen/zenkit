# ZenKit Design Philosophy

ZenKit is a lightweight protocol layer for AI-assisted software building. It is not a framework, not a platform, and not an orchestration engine. It is a set of contracts that keep AI agents useful and honest.

## Thin Over Grand

ZenKit does the minimum required to make AI-assisted workflows repeatable and auditable. There is no runtime, no daemon, no server. The protocol is a set of JSON schemas, shell commands, and conventions. If you can run a shell script and read JSON, you can use ZenKit.

Grand architectures create grand maintenance burdens. ZenKit stays thin so teams can adopt it incrementally without rewriting their toolchain.

## Protocol Over Persona

AI agents do not need personalities. They need input contracts, output contracts, and clear boundaries. ZenKit defines what an agent receives, what it must produce, and what it must not do. The rest is implementation detail.

Persona-driven agents drift into unpredictable behavior. Protocol-driven agents produce artifacts you can diff, review, and version.

## Bounded Autonomy Over Fake Certainty

An agent that says "I'm 95% confident" without evidence is worse than one that says "I don't know." ZenKit requires agents to declare their assumptions, constraints, and open questions explicitly. Autonomy is bounded by schema validation, not by trust.

Every command output includes an `open_questions` field. Silence is not confidence -- it is a schema violation.

## Validation Over Narration

ZenKit does not care what an agent says it did. It cares what artifacts exist, whether they parse, and whether they satisfy the spec. The audit system checks deliverables against schemas, not against prose descriptions.

## Low Drift

Each command produces a structured output that feeds into the next command. The chain is explicit. There is no hidden state, no ambient context that accumulates silently, no memory that decays. If context is needed, it is passed as input.

## Real Benchmarkability

If you cannot measure it, you cannot improve it. ZenKit's benchmark system validates actual artifacts -- not claims about artifacts. Telemetry distinguishes between measured values and estimated values. Results are reproducible because inputs and outputs are versioned.

ZenKit is intentionally small because the problem it solves -- keeping AI agents accountable in a build workflow -- does not require a large solution. It requires a precise one.
