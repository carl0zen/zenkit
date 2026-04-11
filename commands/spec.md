# /spec

> Write a feature specification.

## Purpose
Produces a machine-readable specification with acceptance criteria, constraints, and scope boundaries. Captures the "what" and "why" so that downstream commands (`/plan`, `/build`) operate from a single source of truth. Eliminates ambiguity before work begins.

## When to Use
- When a feature or change is complex enough to need a written definition.
- When multiple agents or team members will collaborate on the same work.
- Before `/plan`, to ensure the plan is grounded in a clear spec.

## Input Contract
- A user story, feature request, bug report, or high-level description.
- Optional: existing code references, design documents, or constraints.

## Output Contract
| Field | Description |
|---|---|
| `context` | Background and motivation for the feature or change. |
| `assumptions` | What the spec takes as given (dependencies, environment, user behavior). |
| `constraints` | Hard limits on scope, technology, performance, or compatibility. |
| `decision` | Key design decisions baked into the spec. |
| `deliverable` | The specification itself: scope, acceptance criteria, out-of-scope items. |
| `risks` | Known risks and their potential impact. |
| `open_questions` | Items that need stakeholder input before proceeding. |
| `next_agent` | Typically `/plan`. |

## Workflow Position
**spec** is the earliest command in the lifecycle. It precedes `/plan` and sets the foundation for everything downstream.

```
[spec] --> plan --> build --> audit --> ship
```

## Example
```
> /spec "User-facing API key rotation"

context: Users currently cannot rotate API keys without contacting support...
assumptions:
  - Users authenticate via bearer tokens tied to API keys.
  - Key storage uses the existing credentials table.
constraints:
  - Old key must remain valid for a grace period (configurable).
  - Must not require downtime.
decision: Dual-key model where old and new keys overlap during grace period.
deliverable:
  scope:
    - POST /keys/rotate endpoint
    - Grace period configuration
    - Audit log entry on rotation
  acceptance_criteria:
    - Rotating a key returns a new key and sets expiry on the old one.
    - Requests with the old key succeed until grace period expires.
  out_of_scope:
    - Automatic rotation schedules (future work).
risks:
  - Grace period too short could lock out slow-deploying clients.
open_questions:
  - Default grace period duration?
next_agent: /plan
```
