import benchmarkResult from '../../benchmark/results/svp-001-live.json'

export function BenchmarkSection() {
  const r = benchmarkResult
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
          implementation — file contents, schema validity, and structural
          checks. Not file existence. Not narrative claims.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary card */}
          <div className="lg:col-span-1 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider">
              Feature
            </div>
            <div className="mt-2 text-lg font-medium text-zen-200">
              {r.task_name}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="font-mono text-xs text-zen-500">Status</div>
                <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-mono ${
                  r.status === 'pass'
                    ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                    : r.status === 'partial'
                    ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800/50'
                    : 'bg-red-900/40 text-red-400 border border-red-800/50'
                }`}>
                  {r.status}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Mode</div>
                <div className="mt-1 text-sm text-zen-300">{r.mode}</div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Criteria</div>
                <div className="mt-1 text-sm text-zen-300">
                  {criteriaPassed}/{criteriaTotal} passed
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Total checks</div>
                <div className="mt-1 text-sm text-zen-300">
                  {totalPassed}/{totalChecks} passed
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Telemetry</div>
                <div className="mt-1 text-sm text-zen-300">
                  ~{r.telemetry.estimated.tokens.toLocaleString()} tokens
                  <span className="text-zen-600 text-xs ml-1">(estimated)</span>
                </div>
                <div className="mt-0.5 text-sm text-zen-300">
                  ~${r.telemetry.estimated.cost_usd.toFixed(2)}
                  <span className="text-zen-600 text-xs ml-1">(estimated)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Criteria results */}
          <div className="lg:col-span-2 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-4">
              Acceptance Criteria
            </div>
            <div className="space-y-2">
              {r.acceptance_criteria_results.map((c: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    c.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zen-400">{c.id}</span>
                      <span className="text-sm text-zen-300">{c.description}</span>
                    </div>
                    <div className="text-xs text-zen-600 mt-0.5 truncate" title={c.evidence}>
                      {c.evidence}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stages */}
            <div className="mt-6 pt-4 border-t border-zen-800/40">
              <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-3">
                Stages
              </div>
              <div className="space-y-2">
                {r.stages.map((stage: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      stage.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-mono text-sm text-zen-300 w-20 flex-shrink-0">{stage.name}</span>
                    <span className="text-xs text-zen-500">
                      {stage.checks_passed}/{stage.checks_run} checks
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uncertainty */}
            {r.uncertainty && r.uncertainty.length > 0 && (
              <div className="mt-6 pt-4 border-t border-zen-800/40">
                <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-2">
                  What this benchmark does NOT prove
                </div>
                <ul className="space-y-1">
                  {r.uncertainty.map((note: string, i: number) => (
                    <li key={i} className="text-xs text-zen-500 flex items-start gap-2">
                      <span className="text-zen-600 mt-0.5">?</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
