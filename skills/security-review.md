# Security Review

> Audit code for OWASP top 10 vulnerabilities, auth issues, data exposure, and injection risks.

**When to use:**
- New code handles user input, authentication, authorization, or sensitive data
- Feature touches payment processing, PII, or external integrations
- Pre-release security gate or dependency update with new/major packages

**Input:** Code to review (files, PR, or module reference), description of security-relevant behavior, threat model if available, and compliance requirements (SOC 2, GDPR, HIPAA, PCI-DSS).

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is a list of findings with vulnerability type (CWE), severity (Critical/High/Medium/Low/Info), affected location, proof-of-concept, and remediation steps.

**Watch for:**
- Reporting only injection flaws while ignoring authorization and business logic issues
- Providing generic remediation ("sanitize input") instead of specific contextual fixes
- Missing security issues in config files, env vars, or build pipelines
