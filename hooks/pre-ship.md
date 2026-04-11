# Pre-Ship Hook

> When: Before shipping or deploying

## Purpose
Validates that all quality, security, and documentation gates are satisfied before code leaves the development environment.

## Trigger
Fires automatically before any ship or deploy action, including creating a release PR, tagging a release, or triggering a deployment pipeline.

## Checks
- All audit findings from the implementation-auditor are addressed or explicitly accepted.
- All quality gates pass (execution-quality rubric score meets threshold).
- The changelog is updated with an entry describing the shipped changes.
- A checkpoint (commit or snapshot) exists that captures the exact state being shipped.
- No open blocking issues remain on the task.
- All agent handoffs in the chain have been completed.

## On Failure
- The ship action is blocked and does not proceed.
- A summary of unmet conditions is presented with links to the relevant findings.
- The responsible agent is directed to resolve each blocker before retrying.
- If audit findings are intentionally deferred, they must be marked as accepted with a rationale.

## Configuration
- `require_audit_clear`: (boolean, default `true`) Whether all audit findings must be resolved.
- `require_changelog`: (boolean, default `true`) Whether the changelog must have a new entry.
- `require_checkpoint`: (boolean, default `true`) Whether a checkpoint commit must exist.
- `min_quality_score`: (number, default `7`) Minimum execution-quality rubric score to ship.
- `allow_deferred_findings`: (boolean, default `false`) Whether accepted-but-unresolved findings are permitted.
