# Prompt Pruning

> Reduce prompt verbosity and token waste while preserving instruction quality and coverage.

## Capability
Analyze prompts, system instructions, or agent definitions to identify redundancy, excessive verbosity, and wasted tokens. Rewrite content to be more concise while preserving all essential instructions, edge-case handling, and behavioral constraints. Measure token reduction and verify that no critical coverage is lost.

## Trigger Conditions
- A prompt or system instruction exceeds its token budget.
- Response quality has degraded due to overly long context.
- A prompt is being optimized for cost efficiency.
- Multiple prompts need to be consolidated without losing coverage.
- A new model with different context limits requires prompt adaptation.

## Input
- The prompt(s) or system instruction(s) to prune.
- Token budget or reduction target if specified.
- Priority ranking of instructions (what must be preserved vs. what is nice-to-have).
- Examples of desired output behavior to validate against.

## Output
- **context**: Summary of the original prompt's purpose and structure.
- **assumptions**: Assumptions about model behavior, instruction priority, and acceptable quality trade-offs.
- **constraints**: Hard requirements that cannot be pruned (safety instructions, compliance language, critical behavioral rules).
- **decision**: Pruning strategy chosen and rationale (e.g., deduplication, compression, restructuring, removal of low-value content).
- **deliverable**: The pruned prompt(s) with a token count comparison (before/after) and a change log noting what was removed, merged, or rewritten.
- **risks**: Instructions that were thinned or removed and could cause behavioral drift.
- **open_questions**: Areas where pruning safety is uncertain without empirical testing.
- **next_agent**: Suggested follow-up (e.g., re-run the pruned prompt through evaluation to verify quality).

## Quality Criteria
- Token count is measurably reduced toward the stated target.
- All critical instructions survive the pruning intact.
- The pruned prompt produces equivalent output quality on representative test cases.
- Formatting aids comprehension (clear structure, no walls of text).
- Changes are documented so pruning decisions can be reviewed and reversed.

## Common Pitfalls
- Removing "redundant" instructions that actually serve as reinforcement for model compliance.
- Over-compressing nuanced instructions into ambiguous shorthand.
- Optimizing for token count at the expense of clarity -- a shorter prompt that confuses the model wastes more than it saves.
- Pruning safety or guardrail instructions because they seem verbose.
- Failing to test the pruned prompt against edge cases that the original handled.
