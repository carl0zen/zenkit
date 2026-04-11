# Bug Triage

> Investigate and classify bugs, identify root cause, propose fix strategy.

## Capability
Systematically investigate a reported bug to confirm its existence, determine severity, isolate the root cause, and propose a fix strategy. Distinguish between symptoms and underlying issues. Classify the bug by type, affected area, and urgency to enable efficient prioritization.

## Trigger Conditions
- A bug report is filed by a user, QA, or automated monitoring.
- A test failure occurs that was not caused by an intentional change.
- Unexpected behavior is observed during development or code review.
- A production incident needs rapid diagnosis.

## Input
- Bug report or description of unexpected behavior.
- Steps to reproduce (if known).
- Environment details (browser, OS, API version, deployment stage).
- Relevant logs, error messages, or screenshots.
- Recent changes that may be related (commits, deployments, config changes).

## Output
- **context**: Summary of the reported issue and investigation scope.
- **assumptions**: What was assumed about the environment, data state, and reproduction conditions.
- **constraints**: Time or access limitations that affected the investigation.
- **decision**: Root cause determination and recommended fix strategy (with rationale for choosing it over alternatives).
- **deliverable**: Triage report containing: confirmed/not-confirmed status, severity classification, root cause analysis, affected components, and proposed fix with estimated effort.
- **risks**: Risk of the proposed fix introducing regressions or masking deeper issues.
- **open_questions**: Unknowns that require further investigation or access to resolve.
- **next_agent**: Suggested follow-up skill (e.g., `backend-change`, `frontend-change`, `security-review`).

## Quality Criteria
- Root cause is identified, not just the symptom.
- Severity classification is justified with impact evidence (number of users affected, data integrity risk, workaround availability).
- Proposed fix addresses the root cause, not just the visible symptom.
- Reproduction steps are verified or clearly marked as unverified.
- Related or similar past issues are referenced if they exist.

## Common Pitfalls
- Fixing the symptom without understanding the underlying cause.
- Classifying severity based on how loud the reporter is rather than actual impact.
- Assuming the bug is in the most recently changed code without verifying.
- Skipping reproduction and jumping straight to a fix based on guesswork.
- Failing to check whether the same root cause affects other code paths.
