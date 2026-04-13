# Roadmap

## Done in v0.2

- Acceptance-criteria-driven benchmark runner (23 checks, 8 criteria)
- Baseline vs zenkit comparison architecture (illustrative data)
- Self-audit documentation with circular-validation safeguards
- 72% reduction in protocol artifact size
- Telemetry honesty: estimated/actual separation with basis field
- Uncertainty and limitations as first-class result fields

## Next priorities

### Browser-based acceptance criteria
Add Playwright or Cypress tests as a verification type so the benchmark can check UI behavior, not just code structure.

### Real telemetry adapters
Provider-specific adapters that capture actual token usage and cost from API responses. Initial targets: Anthropic, OpenAI.

### CI integration
CLI mode with proper exit codes, JUnit-compatible report output, and GitHub Actions example workflow.

### A/B workflow comparison
Execute the same feature spec twice — once with ZenKit structure, once without — and measure drift, retries, and rework. This is the prerequisite for meaningful (non-illustrative) comparison data.

### Custom schema extensions
Allow teams to extend the standard output contract with domain-specific fields without breaking compatibility.

### Workflow visualization
Read checkpoint and handoff artifacts, produce a visual map of agent execution. Output targets: terminal text, Mermaid diagram syntax.

### Community skills registry
Versioned skill packages with schema definitions and test cases. A package index, not a marketplace.
