export function WhyLightweight() {
  const comparisons = [
    {
      instead: 'Orchestration runtime with daemon processes',
      zenkit: 'Plain files. No daemon. No runtime dependency.',
    },
    {
      instead: 'Agent personas with elaborate backstories',
      zenkit: 'Agent contracts with bounded responsibility and explicit handoffs.',
    },
    {
      instead: 'Custom DSL for workflow definition',
      zenkit: 'Markdown commands + JSON Schema. Tools you already know.',
    },
    {
      instead: 'Vendor-locked tool integrations',
      zenkit: 'Runtime-agnostic. Works with Claude Code, local runtimes, or custom harnesses.',
    },
    {
      instead: 'Dashboard-first management layer',
      zenkit: 'CLI-first. Files in your repo. Version-controlled with your code.',
    },
  ]

  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
            Why lightweight matters
          </h2>
          <p className="mt-4 text-zen-400 leading-relaxed">
            Heavier frameworks solve real problems but introduce their own. Every
            abstraction layer is a source of drift, a cost multiplier, and a
            barrier to understanding what actually happened during execution.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {comparisons.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 p-4 rounded-lg bg-zen-900/10"
            >
              <div className="text-sm text-zen-500">
                <span className="font-mono text-xs text-zen-600 mr-2">instead of</span>
                {c.instead}
              </div>
              <div className="text-sm text-zen-300">
                {c.zenkit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
