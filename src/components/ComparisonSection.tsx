import comparison from '../../benchmark/results/comparison-snapshot.json'

export function ComparisonSection() {
  const c = comparison

  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
          ZenKit vs baseline
        </h2>
        <p className="mt-4 text-zen-400 max-w-2xl leading-relaxed">
          Structured comparison of ZenKit-mode execution against unstructured
          baseline. Current data is{' '}
          <span className="text-zen-300 font-medium">illustrative</span> —
          both runs verify the same codebase. See caveats below.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zen-800/50">
                <th className="text-left py-2 pr-4 font-mono text-xs text-zen-500">Metric</th>
                <th className="text-left py-2 pr-4 font-mono text-xs text-zen-500">ZenKit</th>
                <th className="text-left py-2 font-mono text-xs text-zen-500">Baseline</th>
              </tr>
            </thead>
            <tbody className="text-zen-300">
              <tr className="border-b border-zen-800/30">
                <td className="py-2 pr-4 text-zen-400">Status</td>
                <td className="py-2 pr-4 font-mono">{c.summary.zenkit_status}</td>
                <td className="py-2 font-mono">{c.summary.baseline_status}</td>
              </tr>
              <tr className="border-b border-zen-800/30">
                <td className="py-2 pr-4 text-zen-400">Criteria passed</td>
                <td className="py-2 pr-4 font-mono">{c.summary.zenkit_criteria_passed}</td>
                <td className="py-2 font-mono">{c.summary.baseline_criteria_passed}</td>
              </tr>
              <tr className="border-b border-zen-800/30">
                <td className="py-2 pr-4 text-zen-400">Total checks</td>
                <td className="py-2 pr-4 font-mono">{c.summary.zenkit_total_checks}</td>
                <td className="py-2 font-mono">{c.summary.baseline_total_checks}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-3">
          {c.structural_differences.map((d, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 rounded bg-zen-900/20">
              <div className="text-xs font-mono text-zen-400">{d.category}</div>
              <div className="text-xs text-zen-500 md:col-span-2">{d.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border border-zen-800/40 rounded-lg bg-zen-900/10">
          <div className="font-mono text-xs text-zen-600 mb-2">
            Data source: {c.data_source}
          </div>
          <ul className="space-y-1">
            {c.caveats.map((caveat, i) => (
              <li key={i} className="text-xs text-zen-500">{caveat}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
