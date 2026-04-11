export function WhyLightweight() {
  const comparisons = [
    {
      heavy: 'Orchestration runtime with daemon processes',
      zen: 'Plain files. No daemon. No runtime dependency.',
    },
    {
      heavy: 'Agent personas with elaborate backstories',
      zen: 'Agent contracts with bounded responsibility and explicit handoffs.',
    },
    {
      heavy: 'Custom DSL for workflow definition',
      zen: 'Markdown commands + JSON Schema. Tools you already know.',
    },
    {
      heavy: 'Vendor-locked tool integrations',
      zen: 'Runtime-agnostic. Works with Claude Code, local runtimes, or custom harnesses.',
    },
    {
      heavy: 'Dashboard-first management layer',
      zen: 'CLI-first. Files in your repo. Version-controlled with your code.',
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

        <div className="mt-12 space-y-4">
          {comparisons.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 rounded-lg"
            >
              <div className="text-sm text-zen-500 line-through decoration-zen-700">
                {c.heavy}
              </div>
              <div className="text-sm text-zen-300">
                {c.zen}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
