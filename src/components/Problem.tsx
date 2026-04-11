export function Problem() {
  const problems = [
    {
      label: 'Drift',
      description: 'Agents wander from the plan. Each step introduces compounding divergence from the intended architecture.',
    },
    {
      label: 'Verbosity',
      description: 'Workflows burn tokens on narration, restating context, and theatrical reasoning instead of producing artifacts.',
    },
    {
      label: 'Hidden uncertainty',
      description: 'Agents report success without distinguishing what was validated from what was assumed.',
    },
    {
      label: 'Lost context',
      description: 'Handoffs between agents or sessions lose assumptions, constraints, and decisions made earlier.',
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
            The problem with agent workflows
          </h2>
          <p className="mt-4 text-zen-400 leading-relaxed">
            Most AI-assisted development workflows share the same structural
            failures. These are not model capability issues — they are protocol
            gaps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p) => (
            <div
              key={p.label}
              className="p-6 border border-zen-800/60 rounded-lg bg-zen-900/30"
            >
              <div className="font-mono text-sm text-zen-300 font-medium">
                {p.label}
              </div>
              <p className="mt-2 text-sm text-zen-400 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
