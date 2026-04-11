export function Primitives() {
  const primitives = [
    {
      name: 'Commands',
      description: 'Eight workflow verbs: spec, plan, build, audit, refactor, handoff, checkpoint, ship. Each has a defined input/output contract.',
      example: '/plan → structured plan with tasks, constraints, and acceptance criteria',
    },
    {
      name: 'Schemas',
      description: 'JSON Schema definitions for handoffs, tasks, audits, checkpoints, and benchmarks. Machine-validateable contracts.',
      example: 'handoff.schema.json validates every agent-to-agent transfer',
    },
    {
      name: 'Skills',
      description: 'Reusable capabilities: architecture review, security audit, bug triage, prompt pruning, release checks. Composable within commands.',
      example: 'security-review skill triggers during /audit on auth-related changes',
    },
    {
      name: 'Hooks',
      description: 'Automatic checkpoints at workflow boundaries. Pre-change validates plans exist. Post-change validates tests pass. Pre-ship validates all gates.',
      example: 'pre-ship hook blocks deploy if audit findings are unaddressed',
    },
    {
      name: 'Checkpoints',
      description: 'Explicit state snapshots with gate conditions. Distinguish validated facts from assumptions. Enable bounded rollback.',
      example: 'checkpoint captures git ref, test status, and token spend before shipping',
    },
    {
      name: 'Rubrics',
      description: 'Evaluation criteria for execution quality, verbosity, and architectural alignment. Quantified scoring on a 0-10 scale.',
      example: 'verbosity-score penalizes restating known context or theatrical reasoning',
    },
  ]

  return (
    <section id="primitives" className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
          Core primitives
        </h2>
        <p className="mt-4 text-zen-400 max-w-2xl leading-relaxed">
          Six categories of artifacts that compose into disciplined workflows.
          Each is a plain file — markdown or JSON Schema — readable by humans
          and machines alike.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {primitives.map((p) => (
            <div
              key={p.name}
              className="p-6 border border-zen-800/60 rounded-lg bg-zen-900/20 flex flex-col"
            >
              <div className="font-mono text-sm font-medium text-zen-200">
                {p.name}
              </div>
              <p className="mt-3 text-sm text-zen-400 leading-relaxed flex-1">
                {p.description}
              </p>
              <div className="mt-4 text-xs font-mono text-zen-500 border-t border-zen-800/40 pt-3">
                {p.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
