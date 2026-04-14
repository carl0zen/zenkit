---
description: Audit code changes for correctness, security, and architectural alignment using ZenKit's structured rubrics.
---

# ZenKit Audit

When the user asks you to audit, review, or check code quality, use this skill.

## Process

1. Identify the files changed and the spec/plan they implement.
2. Review each file for: correctness, security (OWASP top 10), performance, style, architecture, testing, and documentation.
3. Score on three rubrics (0-10):
   - **Execution quality** — correctness, completeness, production-readiness
   - **Verbosity score** — signal-to-noise ratio (higher = more concise code and comments)
   - **Architectural alignment** — follows project conventions and planned architecture
4. Produce findings. Each finding has: category, severity (info/warning/error/critical), description, file, suggestion.
5. Deliver a verdict: pass, fail, conditional, or needs_review.

## Output format

```
## Audit Report

**Verdict:** [pass/fail/conditional/needs_review]
**Scores:** execution [X/10], verbosity [X/10], alignment [X/10]

### Findings
- [SEVERITY] category: description (file:line) — suggestion

### Open Questions
- ...

### Recommendations
1. ...
```

## Rules

- Do not rubber-stamp. If something is wrong, say so.
- If you cannot verify a claim (e.g., "tests pass"), say you cannot verify it rather than assuming.
- Distinguish validated observations from inferences.
