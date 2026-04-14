Audit the recent changes for: $ARGUMENTS

Review the implementation against its spec/plan. Produce a structured audit report:

1. **Context** — What was built and what spec/plan does it implement?
2. **Findings** — List each finding with:
   - Category: correctness, security, performance, style, architecture, testing, documentation
   - Severity: info, warning, error, critical
   - Description: what's wrong
   - File and line if applicable
   - Suggestion: how to fix it
3. **Rubric scores** (0-10):
   - Execution quality: correctness, completeness, production-readiness
   - Verbosity score: signal-to-noise ratio (higher = more concise)
   - Architectural alignment: follows project conventions and planned architecture
4. **Verdict**: pass, fail, conditional, needs_review
5. **Open questions** — Unresolved issues that need attention.
6. **Recommendations** — Prioritized list of what to fix.

Be adversarial. Do not rubber-stamp. If something is wrong, say so clearly. If you can't verify a claim, say that too.
