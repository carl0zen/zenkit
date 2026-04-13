# Prompt Pruning

> Reduce prompt verbosity and token waste while preserving instruction quality and coverage.

**When to use:**
- Prompt or system instruction exceeds its token budget
- Response quality degraded due to overly long context
- Multiple prompts need consolidation or adaptation for a new model's context limits

**Input:** The prompt(s) to prune, token budget or reduction target, priority ranking of instructions (must-keep vs. nice-to-have), and example outputs to validate against.

**Output:** Structured per ZenKit contract (context, assumptions, constraints, decision, deliverable, risks, open_questions). Deliverable is the pruned prompt(s) with before/after token counts and a change log of what was removed, merged, or rewritten.

**Watch for:**
- Removing "redundant" instructions that actually reinforce model compliance
- Over-compressing nuanced instructions into ambiguous shorthand
- Pruning safety or guardrail instructions because they seem verbose
