import summary from '../../benchmark/results/summary-snapshot.json'

export function BenchmarkSummary() {
  return (
    <section className="py-12 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-4">
          All benchmark specs — {summary.passed}/{summary.total} passed
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {summary.results.map((r, i) => (
            <div
              key={i}
              className="p-4 border border-zen-800/60 rounded-lg bg-zen-900/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  r.status === 'pass' ? 'bg-green-500' : r.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs font-mono text-zen-300 truncate">
                  {r.spec.replace('.json', '')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zen-500">
                <span>criteria {r.criteria}</span>
                <span>checks {r.checks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
