# Benchmarking

ZenKit benchmarks verify acceptance criteria against the actual implementation.

## What the runner checks

The benchmark runner executes four stages per feature spec:

1. **Spec validation.** The spec validates against `feature-spec.schema.json`. Must have acceptance criteria and declared limitations.
2. **Schema compilation.** All JSON schemas compile. All use the same draft version.
3. **Build verification.** Every file in `expected_files` exists.
4. **Acceptance criteria audit.** Each criterion runs a typed verification step.

## Verification types

| Type | What it checks |
|------|---------------|
| `file_exists` | File is present |
| `file_contains` | File contains a specific string |
| `schema_count` | Expected number of schemas compile |
| `examples_valid` | Fixture data validates against schemas |
| `schemas_consistent` | All schemas use the same draft |
| `test_passes` | Shell command exits with code 0 |
| `json_path_equals` | JSON file at a dot-path equals expected value |

Each check produces `evidence` — a string describing what was found. Results are `pass` or `fail`.

## Telemetry

- **Estimated:** Token and cost figures from a heuristic (documented in the `basis` field).
- **Actual:** Null when no API instrumentation is available. Never fabricated.

## CLI

```bash
zenkit benchmark [spec]          # Single spec
zenkit benchmark:all             # All specs
zenkit benchmark:report [result] # Markdown report
zenkit benchmark:compare [z] [b] # ZenKit vs baseline
zenkit audit                     # Run all benchmarks + produce audit report
```

## Comparison mode

Feature specs include a `mode` field: `zenkit` or `baseline`. Current comparison data is **illustrative** — both runs verify the same codebase. Real comparison requires A/B workflow execution.

## Limitations

- Acceptance criteria verify code structure and schema validity, not runtime UI behavior (except via `test_passes` running E2E).
- Token estimates are heuristics, not measurements.
- Self-audit benchmarks structure introspection but do not replace independent review.
