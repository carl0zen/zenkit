# ZenKit Workflow Discipline

This project uses ZenKit for structured AI-assisted development.

## Commands

Use these slash commands during development:

- `/zenkit-spec` — Write a feature specification before building
- `/zenkit-plan` — Create a structured implementation plan
- `/zenkit-build` — Implement from a plan with documented decisions
- `/zenkit-audit` — Review changes for correctness, security, and alignment
- `/zenkit-checkpoint` — Capture current state (what's validated vs assumed)
- `/zenkit-handoff` — Produce a structured context transfer document

## Workflow

```
/zenkit-spec → /zenkit-plan → /zenkit-build → /zenkit-audit → /zenkit-checkpoint
```

## Output contract

Every command output should include:
- **Context** — current situation
- **Assumptions** — explicit, not hidden
- **Constraints** — hard limits
- **Decision** — what and why
- **Deliverable** — what was produced
- **Risks** — specific to this output
- **Open questions** — unresolved items
- **Next handoff** — who continues

## Rules

1. Do not claim tests pass without running them.
2. Do not hide assumptions in prose — list them explicitly.
3. Distinguish validated facts from inferences in every checkpoint.
4. When uncertain, say so. "I don't know" beats a false claim.
5. Keep output concise. Artifacts over narration.
