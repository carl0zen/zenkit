# Benchmarking

ZenKit benchmarks verify acceptance criteria against the actual implementation. The distinction: checking that a file contains `export function SchemaSelector` is verification. Checking that a file exists is weaker. Claiming "the feature works" is not verification at all.

## What the runner checks

The v0.2 benchmark runner executes four stages:

1. **Spec validation.** The feature spec has a name, acceptance criteria, and declared limitations.
2. **Schema compilation.** All JSON schemas compile without errors. All use the same draft version.
3. **Build verification.** Every file listed in `expected_files` exists in the repo.
4. **Acceptance criteria audit.** Each criterion runs a specific verification step:
   - `file_exists` — file is present
   - `file_contains` — file contains a specific string
   - `schema_count` — expected number of schemas compile
   - `examples_valid` — fixture data validates against schemas
   - `schemas_consistent` — all schemas use the same JSON Schema draft

Each check produces `evidence` — a string describing what was actually found. Results are `pass` or `fail`, never ambiguous.

## Telemetry

- **Estimated:** Token counts and costs computed from a heuristic (documented in the `basis` field). These are estimates, not measurements.
- **Actual:** Null when no API instrumentation is available. The schema enforces this: `actual` is either a real measurement or explicitly null.

## Comparison mode

Specs include a `mode` field: `zenkit` or `baseline`. Both modes run the same verification checks against the same codebase. The structural difference is in workflow metadata.

Current comparison data is **illustrative**. Both runs verify the same already-built feature, so pass/fail parity is expected. A meaningful comparison requires executing the implementation process twice with different workflow structures and measuring drift, retries, and rework.

## Limitations

- Acceptance criteria verify code structure and schema validity, not runtime UI behavior.
- UI interaction testing requires browser automation, which is not included.
- Token estimates are heuristics, not measurements.
- Self-audit benchmarks structure introspection but do not replace independent review.
