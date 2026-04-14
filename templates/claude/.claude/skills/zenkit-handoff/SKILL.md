---
description: Produce structured handoff documents that preserve context, assumptions, decisions, and open questions between sessions or agents.
---

# ZenKit Handoff

When work needs to be transferred — to another session, another agent, or a future you — use this skill to produce a complete handoff.

## What a handoff must contain

1. **Context** — What was done, why, and current state.
2. **Assumptions** — Every assumption made. The recipient inherits these.
3. **Constraints** — Hard limits still in effect.
4. **Decision** — Key decisions and rationale, including rejected alternatives.
5. **Deliverable** — What was produced: type, description, files changed, validation status (passed/failed/partial/untested).
6. **Risks** — Known risks in the deliverable. Be specific.
7. **Open questions** — What could not be resolved. The recipient must address these.
8. **Next agent** — Who should receive this.

## Output format

```json
{
  "context": "...",
  "assumptions": ["..."],
  "constraints": ["..."],
  "decision": "...",
  "deliverable": { "type": "code", "description": "...", "files_changed": ["..."], "validation_status": "passed" },
  "risks": [{ "description": "...", "severity": "medium", "mitigation": "..." }],
  "open_questions": ["..."],
  "next_agent": "..."
}
```

## Rules

- A handoff that says "everything looks good" without specifics is a failed handoff.
- Every assumption must be listed. Silence is not confidence.
- If validation_status is "untested", say so. Do not claim "passed" without evidence.
