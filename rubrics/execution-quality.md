# Execution Quality

> Measures correctness, completeness, and production-readiness of delivered work.

## Scale
0-10, where 0 is entirely broken and 10 is flawless production-ready work.

## Criteria

### Score 0-2: Failing
The deliverable does not function. Core requirements are unmet, tests fail or are absent, and the output cannot be used without a full rewrite. Fundamental misunderstandings of the requirements are evident.

### Score 3-4: Incomplete
The deliverable partially works but has significant gaps. Some requirements are met, but critical paths are broken or untested. Error handling is missing or incorrect. The work needs substantial rework before it can be reviewed.

### Score 5-6: Functional
The deliverable meets most requirements and works for the happy path. Tests exist but coverage is thin. Error handling covers common cases but misses edge cases. The work is reviewable but needs fixes before shipping.

### Score 7-8: Solid
The deliverable meets all requirements and handles edge cases well. Test coverage is thorough, error handling is robust, and the code follows project conventions. Minor improvements may be suggested but nothing blocks shipping.

### Score 9-10: Exemplary
The deliverable exceeds expectations. All requirements are met with comprehensive test coverage, excellent error handling, clear documentation, and thoughtful handling of edge cases. The work is a reference example for future implementations.

## How to Apply
Use this rubric during implementation-auditor review to score the overall quality of a deliverable. The minimum score to pass the pre-ship gate is configurable (default: 7). Score each dimension (correctness, completeness, test coverage, error handling, conventions) individually, then average for the final score.
