# ZenKit Benchmarking

ZenKit's benchmark system measures what AI agents actually produce, not what they claim to produce. The distinction matters: an agent that says "I built a complete REST API" is making a claim. A benchmark that checks for route definitions, schema validation, and passing tests is checking reality.

## What "Certainty" Means

In ZenKit, certainty is the presence of explicit, validated artifacts. A feature is "done" when:

- The deliverable exists and parses.
- The deliverable validates against its output schema.
- The audit rubrics pass.
- Open questions are either resolved or explicitly deferred.

There is no confidence score. There is no percentage. There is pass or fail, with detailed findings for failures.

## How the Benchmark Runner Works

The benchmark runner executes a workflow against a feature spec and measures the results. The process:

1. **Load the feature spec.** The spec defines what should be built, including acceptance criteria.
2. **Run the workflow.** Commands execute in sequence: plan, build, audit. Each command's output is captured.
3. **Validate outputs.** Every command output is checked against its schema. Schema violations are failures.
4. **Apply rubrics.** Audit rubrics evaluate the deliverables against acceptance criteria.
5. **Collect telemetry.** Duration, token usage (if available), and artifact sizes are recorded.
6. **Produce the report.** A structured JSON report with per-command results, rubric scores, and telemetry.

## Validated vs. Inferred Data

ZenKit distinguishes between two categories of data in benchmark results:

- **Validated**: Data that was directly measured or verified. Schema compliance is validated. File existence is validated. Test pass/fail is validated.
- **Inferred**: Data that was estimated or derived. Token counts may be inferred from output length if the provider does not report them. Cost estimates are always inferred based on published pricing. Complexity scores are inferred from heuristics.

Every data point in a benchmark report is tagged as `validated` or `inferred`. This prevents the common mistake of treating estimates as measurements.

## Writing Feature Specs for Benchmarks

A benchmark feature spec includes:

- **description**: What the feature does.
- **acceptance_criteria**: A list of concrete, testable conditions.
- **constraints**: Technical boundaries (language, framework, performance requirements).
- **expected_artifacts**: What files or structures the build should produce.

Good acceptance criteria are binary -- they pass or fail. "The API should be fast" is not testable. "The API responds in under 200ms for the list endpoint" is testable.

## Running Benchmarks

```bash
zenkit benchmark run --spec features/my-feature.json
zenkit benchmark run --spec features/ --all
zenkit benchmark report --output results.json
```

## Reading Results

Benchmark results are structured JSON. Key fields:

- **pass/fail**: Did the workflow complete and pass audit?
- **rubric_scores**: Per-rubric pass/fail with findings.
- **telemetry**: Duration, token usage (tagged validated/inferred), artifact counts.
- **failures**: Specific schema violations, rubric failures, or missing artifacts.

Results are diffable. Run the same spec twice and compare outputs to measure consistency. Run after a model change to measure regression.
