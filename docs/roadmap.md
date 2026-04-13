# Roadmap

## Done in v0.2

- Acceptance-criteria-driven benchmark runner (23 checks, 8 criteria)
- Baseline vs zenkit comparison architecture (illustrative data)
- Self-audit documentation with circular-validation safeguards
- 72% reduction in protocol artifact size
- Telemetry honesty: estimated/actual separation with basis field
- Uncertainty and limitations as first-class result fields

## Done in v0.3

- 12 Playwright E2E browser tests
- 4 benchmark feature specs (35 criteria, 101 checks)
- ESLint integration (clean)
- GitHub Actions CI pipeline (lint, test, benchmark, build, E2E)
- Multi-spec benchmark runner with aggregate summary
- Landing page: benchmark summary, comparison section, self-audit section
- `zenkit` CLI tool (validate, benchmark, init, status)
- CLAUDE.md for Claude Code integration
- Mermaid workflow visualization
- README with accurate test counts and full command reference

## Next priorities

### Real telemetry adapters
Provider-specific adapters that capture actual token usage and cost from API responses. Initial targets: Anthropic, OpenAI.

### A/B workflow comparison
Execute the same feature spec twice — once with ZenKit structure, once without — and measure drift, retries, and rework. Prerequisite for meaningful (non-illustrative) comparison data.

### Custom schema extensions
Allow teams to extend the standard output contract with domain-specific fields without breaking compatibility.

### npm package publishing
Publish `zenkit` as an npm package so `zenkit init` and `zenkit validate` work globally without cloning the repo.

### Interactive workflow visualization
Render Mermaid diagrams directly in the landing page, with clickable stages showing check details.

### More verification types
Add `test_passes` (run a specific test and check exit code), `url_responds` (HTTP health check), and `json_path_equals` (check specific values in JSON files).
