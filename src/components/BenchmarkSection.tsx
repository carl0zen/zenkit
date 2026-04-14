import result from '../../benchmark/results/svp-001-snapshot.json'
import summary from '../../benchmark/results/summary-snapshot.json'
import comparison from '../../benchmark/results/comparison-snapshot.json'

export function BenchmarkSection() {
  const r = result
  const criteriaPassed = r.validation_summary.criteria_passed
  const criteriaTotal = r.validation_summary.total_criteria
  const totalChecks = r.stages.reduce((sum: number, s: any) => sum + s.checks_run, 0)
  const totalPassed = r.stages.reduce((sum: number, s: any) => sum + s.checks_passed, 0)

  return (
    <section id="benchmark" className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
          Benchmark: criteria-driven verification
        </h2>
        <p className="mt-4 text-zen-400 max-w-2xl leading-relaxed">
          ZenKit benchmarks verify acceptance criteria against the actual
          implementation — file contents, schema validity, test execution,
          and JSON value checks. Not file existence. Not narrative claims.
        </p>

        {/* All specs summary grid */}
        <div className="mt-10">
          <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-3">
            {summary.passed}/{summary.total} specs passed
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {summary.results.map((s: any, i: number) => (
              <div key={i} className="p-3 border border-zen-800/60 rounded-lg bg-zen-900/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono text-zen-300 truncate">
                    {s.spec.replace('.json', '').replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-zen-600">{s.criteria} criteria, {s.checks} checks</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed criteria for primary spec */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider">
              Detail: {r.task_name}
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="font-mono text-xs text-zen-500">Status</div>
                <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-mono ${
                  r.status === 'pass'
                    ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                    : 'bg-red-900/40 text-red-400 border border-red-800/50'
                }`}>{r.status}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-zen-500">Criteria</div>
                <div className="mt-1 text-sm text-zen-300">{criteriaPassed}/{criteriaTotal}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-zen-500">Checks</div>
                <div className="mt-1 text-sm text-zen-300">{totalPassed}/{totalChecks}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-zen-500">Telemetry</div>
                <div className="mt-1 text-xs text-zen-400">
                  ~{r.telemetry.estimated.tokens.toLocaleString()} tokens, ~${r.telemetry.estimated.cost_usd.toFixed(2)}
                  <span className="text-zen-600 ml-1">(estimated)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-3">
              Acceptance criteria
            </div>
            <div className="space-y-1.5">
              {r.acceptance_criteria_results.map((c: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                    c.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-zen-400">{c.id}</span>
                    <span className="text-xs text-zen-300 ml-2">{c.description}</span>
                    <div className="text-xs text-zen-600 truncate" title={c.evidence}>{c.evidence}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Uncertainty */}
            {r.uncertainty?.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zen-800/40">
                <div className="font-mono text-xs text-zen-600 mb-1.5">What this does NOT prove</div>
                {r.uncertainty.map((note: string, i: number) => (
                  <div key={i} className="text-xs text-zen-600">? {note}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compact comparison */}
        <div className="mt-8 p-5 border border-zen-800/60 rounded-lg bg-zen-900/20">
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider">
              ZenKit vs baseline
            </div>
            <div className="text-xs text-zen-600">
              data source: {comparison.data_source}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-zen-500">Metric</div>
            <div className="text-zen-400 font-mono">ZenKit</div>
            <div className="text-zen-400 font-mono">Baseline</div>
            <div className="text-zen-500">Status</div>
            <div className="text-zen-300 font-mono">{comparison.summary.zenkit_status}</div>
            <div className="text-zen-300 font-mono">{comparison.summary.baseline_status}</div>
            <div className="text-zen-500">Criteria</div>
            <div className="text-zen-300 font-mono">{comparison.summary.zenkit_criteria_passed}</div>
            <div className="text-zen-300 font-mono">{comparison.summary.baseline_criteria_passed}</div>
            <div className="text-zen-500">Checks</div>
            <div className="text-zen-300 font-mono">{comparison.summary.zenkit_total_checks}</div>
            <div className="text-zen-300 font-mono">{comparison.summary.baseline_total_checks}</div>
          </div>
          <div className="mt-3 text-xs text-zen-600">
            Both modes verify the same codebase — structural difference is in workflow metadata.
            Real comparison requires A/B execution.
          </div>
        </div>
      </div>
    </section>
  )
}
