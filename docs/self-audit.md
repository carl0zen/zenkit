# Self-Audit

ZenKit can structure audits of its own repository. This is useful but requires explicit safeguards against circular self-certification.

## What self-audit does

Using ZenKit commands and schemas to audit ZenKit produces structured artifacts: findings, rubric scores, and uncertainty notes. This is valuable because it:

- Tests whether ZenKit's own primitives are expressive enough to describe real work
- Produces concrete evidence of what passes and what does not
- Forces the same honesty requirements (explicit uncertainty, bounded claims) on ZenKit itself

## What self-audit does NOT do

- It does not prove ZenKit is correct. A system auditing itself can only check what it knows to check.
- It does not replace independent inspection. External review finds the blind spots self-audit cannot.
- It does not validate the rubrics themselves. If a rubric is poorly designed, self-audit scores are meaningless.

## Safeguards

1. **Benchmark checks are verifiable.** The runner checks file existence, pattern matching, schema compilation, and example validation. These are inspectable — run the benchmark yourself and verify.
2. **Uncertainty is required, not optional.** Every benchmark result must include an `uncertainty` array. Empty uncertainty is a red flag, not a sign of perfection.
3. **Limitations are inherited from specs.** The feature spec declares what verification cannot cover. These propagate to results.
4. **Illustrative data is labeled.** Comparison artifacts and example data are explicitly marked as `illustrative` where applicable.
5. **Telemetry is never fabricated.** Estimated figures state their estimation basis. Actual telemetry is null when not instrumented.

## The honest framing

ZenKit structures its own audits, but its claims are only as strong as the checks behind them. The v0.2 benchmark verifies 23 specific checks across 8 acceptance criteria. It does not verify runtime UI behavior, performance under load, or multi-agent workflow fidelity. Those remain unvalidated until specific checks are added.
