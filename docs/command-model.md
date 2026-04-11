# ZenKit Command Model

ZenKit defines eight commands. Each command has a defined input contract, output contract, and position in the workflow chain. Commands are the atomic units of work in ZenKit.

## The Eight Commands

### spec

Converts a feature request or requirement into a structured specification. Input: raw requirement text. Output: a formal spec with scope, acceptance criteria, and constraints.

### plan

Takes a spec and produces an implementation plan. Defines tasks, ordering, dependencies, estimated effort, and risk areas. The plan is the contract between the product side and the build side.

### build

Executes a plan. Produces code, configurations, or other deliverables. The build command documents every decision made during implementation, including alternatives that were considered and rejected.

### audit

Validates build output against the spec and plan. Checks schema compliance, runs rubrics, and produces a pass/fail report with specific findings. Audit does not fix problems -- it identifies them.

### refactor

Takes audit findings and build output, then produces improved deliverables. Refactor is a targeted rebuild -- it addresses specific issues without re-planning the entire feature.

### handoff

Produces a structured artifact for transferring work between agents. The handoff includes all context the receiving agent needs to continue without asking questions that were already answered.

### checkpoint

Captures current workflow state for resumption. A checkpoint is not a save file -- it is a validated snapshot that includes enough context to restart the workflow from that point.

### ship

Packages validated deliverables for release. Ship only succeeds if the most recent audit passed. Produces a manifest of shipped artifacts.

## Command Chaining

Commands chain through their output contracts. The output of `spec` feeds into `plan`. The output of `plan` feeds into `build`. This chain is explicit -- there is no implicit state passing.

```
spec --> plan --> build --> audit --+--> ship
                   ^               |
                   |  (fail)       |
                   +-- refactor <--+
```

At any point, `checkpoint` can snapshot the state, and `handoff` can transfer work to another agent.

## Standard Output Shape

Every command produces output that conforms to a standard shape with these fields:

- **context**: What the agent knew when it made its decisions. Includes the input it received and any relevant state.
- **assumptions**: What the agent assumed to be true but could not verify. Every assumption is an explicit risk.
- **constraints**: Hard limits the agent operated within. Technical constraints, time constraints, scope constraints.
- **decision**: What the agent decided to do and why. Includes alternatives considered.
- **deliverable**: The actual output -- code, plan, report, or artifact.
- **risks**: Known risks in the deliverable. Not "things that could go wrong in general" but specific risks in this specific output.
- **open_questions**: What the agent could not resolve. These must be answered before downstream work can proceed safely.
- **next_agent**: Which agent or command should receive this output next. Makes the workflow chain explicit.

This shape ensures that no command produces a black-box result. Every output is auditable, every assumption is visible, and every gap is declared.

## Why This Matters

Commands that produce structured, predictable output can be tested, benchmarked, and replaced. If a new AI model produces better `build` output, you swap it in without changing the rest of the pipeline. The command model makes agents interchangeable at the interface level.
