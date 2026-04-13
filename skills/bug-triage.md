# Bug Triage

> Investigate and classify bugs, identify root cause, propose fix strategy.

**When to use:**
- Bug report filed by a user, QA, or automated monitoring
- Unexpected test failure not caused by an intentional change
- Production incident needs rapid diagnosis

**Input:** Bug report or description of unexpected behavior, reproduction steps, environment details, relevant logs/errors/screenshots, and recent related changes.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is a triage report: confirmed/not-confirmed status, severity classification, root cause analysis, affected components, and proposed fix with estimated effort.

**Watch for:**
- Fixing the symptom without understanding the underlying root cause
- Classifying severity based on reporter loudness rather than actual impact
- Skipping reproduction and jumping straight to a fix based on guesswork
