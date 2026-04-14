Create a checkpoint for the current work: $ARGUMENTS

Capture the current state as a structured snapshot:

1. **What has been completed** — List files changed, tests passing, features implemented.
2. **What is validated** — Only include facts you have actually verified (tests run, schemas compiled, files exist). Do not list assumed validations.
3. **What is assumed** — Explicitly list anything you believe to be true but have not verified.
4. **Gate conditions** — For each condition, state whether it is met:
   - Tests pass: yes/no/not run
   - Lint clean: yes/no/not run
   - Schema valid: yes/no/not checked
   - Audit findings addressed: yes/no/not audited
5. **Open questions** — What remains unresolved.
6. **Recommendation** — Is this checkpoint a safe rollback point? Should work continue or pause for review?

Be honest about the distinction between "validated" and "assumed." The value of a checkpoint is knowing exactly what is confirmed.
