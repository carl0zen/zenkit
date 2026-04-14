# ZenKit Architecture

ZenKit is built from six primitive categories that compose into workflows. There is no runtime -- only schemas, commands, and conventions that tools and agents agree to follow.

## The Six Primitives

### Commands

The verbs of the system. Each command (`spec`, `plan`, `build`, `audit`, `refactor`, `handoff`, `checkpoint`, `ship`) takes structured input and produces structured output. Commands are stateless -- they read input, produce output, and exit.

### Schemas

JSON schemas that define the shape of every input and output. Schemas are the source of truth. If an agent produces output that does not validate against its schema, the output is rejected. No exceptions.

### Skills

Reusable capabilities that agents can invoke during command execution. A skill is a scoped unit of work -- "generate SQL migration," "run lint," "estimate complexity." Skills are composable and can be shared across agents.

### Hooks

Lifecycle callbacks that fire before or after a command runs. Hooks handle side effects: logging, notifications, file cleanup, environment validation. They keep commands pure by moving side effects to the edges.

### Checkpoints

Snapshots of workflow state at a given point. A checkpoint captures the current context, completed steps, and pending work. Checkpoints enable resumption -- if a workflow fails at step 4, you restart from checkpoint 3, not from zero.

### Rubrics

Evaluation criteria that the audit system uses to grade deliverables. A rubric defines what "done" looks like for a given command or workflow stage. Rubrics are explicit, versioned, and diffable.

## Workflow Composition

Primitives compose into workflows through chaining. The output of one command becomes the input of the next. The standard lifecycle is:

```
plan --> build --> audit --> ship

    +---> checkpoint (at any stage)
    +---> refactor (loops back to build)
    +---> handoff (transfers between agents)
```

### The Lifecycle

```
  +---------+     +---------+     +---------+     +---------+
  |  PLAN   |---->|  BUILD  |---->|  AUDIT  |---->|  SHIP   |
  +---------+     +---------+     +---------+     +---------+
       |               |               |               |
       v               v               v               v
  checkpoint      checkpoint      checkpoint      checkpoint
                       ^               |
                       |    (fail)     |
                       +---------------+
                        refactor loop
```

**Plan**: Define what will be built, how, and why. Produces a structured plan with scope, dependencies, and risk assessment.

**Build**: Execute the plan. Produce code, configurations, migrations, or whatever the spec requires. Output includes the deliverable plus metadata about decisions made during building.

**Audit**: Validate the build output against the spec and rubrics. The audit checks schema compliance, runs tests if available, and flags gaps. Audit failures feed back into a refactor cycle.

**Ship**: Package and release the validated output. Ship only runs after audit passes. It produces a manifest of what was shipped and where.

## The Handoff Contract

Agents do not share memory. They share documents. When one agent finishes its work, it produces a handoff artifact that contains everything the next agent needs: context, deliverables, assumptions, constraints, and open questions.

The handoff contract ensures that agent A does not need to know how agent B works. It only needs to produce output that matches the handoff schema. This is what makes agents replaceable -- swap the implementation, keep the contract.

```
Agent A                    Agent B
  |                          |
  +--- handoff artifact ---->|
  |    (schema-validated)    |
  |                          +---> continues work
```

Handoff artifacts are versioned and stored alongside the code they describe. They are first-class project artifacts, not ephemeral messages.

## The CLI

The `zenkit` CLI provides the executable interface to the protocol: `validate` checks data against schemas, `benchmark` runs feature specs, `audit` produces structured audit reports, `init` scaffolds ZenKit into a project, and `status` shows project health. The CLI is a thin wrapper — it delegates to the same scripts and schemas that compose the protocol layer.

## What Is Not Here

There is no central orchestrator. There is no agent registry service. There is no shared memory bus. Coordination happens through files, schemas, and explicit contracts. This is intentional — ZenKit works with any AI provider, any CI system, and any language.
