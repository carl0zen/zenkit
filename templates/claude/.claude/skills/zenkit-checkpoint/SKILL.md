---
description: Capture workflow state as structured checkpoints that distinguish validated facts from assumptions.
---

# ZenKit Checkpoint

When you need to record the current state of work — before a risky change, at a milestone, or before handing off — use this skill.

## What a checkpoint captures

1. **Completed work** — Files changed, features implemented.
2. **Validated facts** — Only things you have actually verified: tests you ran, schemas you compiled, files you confirmed exist. Do not list things you assume are true.
3. **Assumptions** — Things you believe are true but have not verified.
4. **Gate conditions** — Each with a clear met/not-met status:
   - Tests pass: yes / no / not run
   - Lint clean: yes / no / not run
   - Schema valid: yes / no / not checked
   - Audit findings addressed: yes / no / not audited
5. **Open questions** — What remains unresolved.
6. **Recommendation** — Is this a safe rollback point? Should work continue or pause?

## Output format

```
## Checkpoint: [name]

**Stage:** [plan/build/audit/ship]
**Recommendation:** [continue/pause for review/rollback]

### Validated
- [item]: [evidence]

### Assumed (not verified)
- [item]

### Gates
- Tests pass: [yes/no/not run]
- Lint clean: [yes/no/not run]
- Schema valid: [yes/no/not checked]
- Audit addressed: [yes/no/not audited]

### Open Questions
- ...
```

## Rules

- The value of a checkpoint is knowing exactly what is confirmed vs assumed.
- Never mark a gate as "yes" unless you actually ran the check.
- "Not run" is always better than a false "yes."
