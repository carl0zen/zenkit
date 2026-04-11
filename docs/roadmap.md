# ZenKit Roadmap

This roadmap describes concrete next steps for ZenKit. Items are listed roughly in priority order. No timelines are promised -- this is an open-source project and progress depends on contributions.

## Real Telemetry Adapters

Currently, token counts and cost estimates are inferred from output size. The next step is provider-specific adapters that capture actual token usage, latency breakdowns, and cost from API responses. Initial targets: OpenAI, Anthropic, and local model servers that expose usage metadata.

## CI Integration

ZenKit workflows should run in CI pipelines. This means a CLI mode that exits with proper codes, structured output to stdout, and integration examples for GitHub Actions, GitLab CI, and generic shell-based runners. The benchmark system should produce JUnit-compatible reports for CI dashboards.

## Custom Schema Extensions

Teams need to extend the standard output shape with domain-specific fields without breaking compatibility. Schema extension support will allow adding custom fields to command outputs while preserving the base contract. Extensions must be declared and versioned.

## Workflow Visualization

A command that reads checkpoint and handoff artifacts and produces a visual map of the workflow: which agents ran, what they produced, where failures occurred, and how long each step took. Output targets: terminal-friendly text, SVG, and Mermaid diagram syntax.

## Community Skills Registry

A registry where teams can publish and discover reusable skills. Skills must include schema definitions, test cases, and usage examples. The registry is a package index, not a marketplace -- no accounts, no payments, just versioned skill packages.

## Multi-Repo Support

Workflows that span multiple repositories. A plan in repo A triggers builds in repos B and C, with handoff artifacts coordinated across repo boundaries. This requires a lightweight coordination layer on top of the existing file-based protocol.

## IDE Plugins

Editor integrations that surface ZenKit workflow state, checkpoint status, and audit findings inline. Initial targets: VS Code and JetBrains IDEs. Plugins should be thin wrappers around the CLI, not reimplementations.
