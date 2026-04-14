Produce a structured handoff for: $ARGUMENTS

You are transferring work to another agent or a future session. The handoff must contain everything the recipient needs to continue without re-asking questions that were already answered.

Produce this structure:

1. **Context** — What was done, why, and what state things are in now.
2. **Assumptions** — Every assumption you made. The recipient will inherit these unless they explicitly revisit them.
3. **Constraints** — Hard limits that still apply.
4. **Decision** — Key decisions made and their rationale. Include rejected alternatives.
5. **Deliverable** — What you produced:
   - Type: code, document, schema, plan, review, test, or artifact
   - Description
   - Files changed
   - Validation status: passed, failed, partial, or untested
6. **Risks** — Known risks in the deliverable. Be specific.
7. **Open questions** — What you could not resolve. The recipient must address these.
8. **Next agent** — Who should receive this handoff.

Do not summarize vaguely. A handoff that says "everything looks good" without specifics is a failed handoff.
