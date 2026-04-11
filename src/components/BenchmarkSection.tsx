import benchmarkResult from '../../benchmark/results/schema-validator-playground.json'

export function BenchmarkSection() {
  const result = benchmarkResult
  const duration = result.duration_ms
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)

  return (
    <section id="benchmark" className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
          Benchmark: bounded autonomous execution
        </h2>
        <p className="mt-4 text-zen-400 max-w-2xl leading-relaxed">
          ZenKit proves certainty through explicit artifacts, not claims.
          This benchmark ran a full feature through spec, plan, build, audit,
          and ship — recording every stage.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary card */}
          <div className="lg:col-span-1 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider">
              Feature
            </div>
            <div className="mt-2 text-lg font-medium text-zen-200">
              {result.task_name}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="font-mono text-xs text-zen-500">Status</div>
                <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-mono ${
                  result.status === 'pass'
                    ? 'bg-green-900/40 text-green-400 border border-green-800/50'
                    : 'bg-red-900/40 text-red-400 border border-red-800/50'
                }`}>
                  {result.status}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Duration</div>
                <div className="mt-1 text-sm text-zen-300">
                  {minutes}m {seconds}s
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Tests</div>
                <div className="mt-1 text-sm text-zen-300">
                  {result.validation.tests_passed}/{result.validation.tests_run} passed
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Telemetry</div>
                <div className="mt-1 text-sm text-zen-300">
                  ~{result.telemetry.estimated_tokens?.toLocaleString()} tokens
                  <span className="text-zen-500 text-xs ml-1">({result.telemetry.telemetry_source})</span>
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zen-500">Cost</div>
                <div className="mt-1 text-sm text-zen-300">
                  ~${result.telemetry.estimated_cost_usd?.toFixed(2)}
                  <span className="text-zen-500 text-xs ml-1">({result.telemetry.telemetry_source})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stages */}
          <div className="lg:col-span-2 p-6 border border-zen-800/60 rounded-lg bg-zen-900/30">
            <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-4">
              Workflow Stages
            </div>
            <div className="space-y-3">
              {result.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    stage.status === 'pass' ? 'bg-green-500' : stage.status === 'fail' ? 'bg-red-500' : 'bg-zen-600'
                  }`} />
                  <div className="font-mono text-sm text-zen-300 w-24 flex-shrink-0">
                    {stage.name}
                  </div>
                  <div className="text-xs text-zen-500 flex-1">
                    {stage.notes}
                  </div>
                  <div className="font-mono text-xs text-zen-600">
                    {stage.duration_ms ? `${(stage.duration_ms / 1000).toFixed(1)}s` : '—'}
                  </div>
                </div>
              ))}
            </div>

            {result.uncertainty_notes && result.uncertainty_notes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-zen-800/40">
                <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-2">
                  Uncertainty Notes
                </div>
                <ul className="space-y-1">
                  {result.uncertainty_notes.map((note, i) => (
                    <li key={i} className="text-xs text-zen-500 flex items-start gap-2">
                      <span className="text-zen-600 mt-0.5">?</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-zen-800/40">
              <div className="font-mono text-xs text-zen-500 uppercase tracking-wider mb-2">
                Files Changed
              </div>
              <div className="flex flex-wrap gap-2">
                {result.files_changed.map((file, i) => (
                  <span key={i} className="text-xs font-mono text-zen-500 bg-zen-800/50 px-2 py-0.5 rounded">
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
