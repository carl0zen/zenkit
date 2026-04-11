# Security Review

> Audit code for OWASP top 10 vulnerabilities, auth issues, data exposure, and injection risks.

## Capability
Perform a focused security audit of code, configurations, and data flows. Check for OWASP Top 10 vulnerabilities, authentication and authorization flaws, sensitive data exposure, injection vectors, and misconfigured security controls. Produce findings with severity ratings, proof-of-concept descriptions, and remediation guidance.

## Trigger Conditions
- New code handles user input, authentication, authorization, or sensitive data.
- A feature touches payment processing, PII, or external integrations.
- A dependency update introduces new packages or major version changes.
- Pre-release or pre-deployment security gate needs to be passed.
- A penetration test or audit finding needs code-level verification.

## Input
- Code to review (files, pull request, or module reference).
- Description of the feature's security-relevant behavior (auth flows, data handling, external calls).
- Threat model or security requirements if available.
- Known compliance requirements (SOC 2, GDPR, HIPAA, PCI-DSS).

## Output
- **context**: Scope of the review and what was examined.
- **assumptions**: Trust boundaries assumed, threat actors considered, environment assumptions.
- **constraints**: Limitations of the review (static analysis only, no runtime testing, limited scope).
- **decision**: Overall security posture assessment -- pass, conditional pass, or fail -- with justification.
- **deliverable**: List of findings, each with: vulnerability type (CWE where applicable), severity (Critical/High/Medium/Low/Info), affected code location, proof-of-concept description, and specific remediation steps.
- **risks**: Residual risks that remain even after all findings are addressed.
- **open_questions**: Areas that need dynamic testing, access review, or infrastructure-level inspection.
- **next_agent**: Suggested follow-up skill (e.g., `backend-change`, `frontend-change`, `architecture-review`).

## Quality Criteria
- Every finding includes a specific code location, not just a category mention.
- Severity ratings follow a consistent framework (CVSS or equivalent reasoning).
- Remediation guidance is concrete and implementable, not generic advice.
- False positives are filtered out or explicitly marked as low-confidence.
- The review covers both the code itself and its interaction with adjacent systems.

## Common Pitfalls
- Reporting only injection flaws while ignoring authorization and business logic issues.
- Flagging theoretical vulnerabilities without considering existing mitigations.
- Providing generic remediation ("sanitize input") instead of specific, contextual fixes.
- Missing security issues in configuration files, environment variables, or build pipelines.
- Reviewing code in isolation without understanding the authentication and trust model.
