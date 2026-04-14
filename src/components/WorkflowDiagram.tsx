import summary from '../../benchmark/results/summary-snapshot.json'

export function WorkflowDiagram() {
  const mermaidCode = [
    'graph TD',
    ...summary.results.map((r, i) => {
      const name = r.spec.replace('.json', '').replace(/-/g, ' ')
      return `    spec${i}[${name} — ${r.criteria} criteria, ${r.checks} checks]`
    }),
    `    summary((${summary.passed}/${summary.total} passed))`,
    ...summary.results.map((_, i) => `    spec${i} --> summary`),
  ].join('\n')

  return (
    <section className="py-12 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-xs text-zen-500 uppercase tracking-wider">
            Workflow visualization (Mermaid)
          </div>
          <div className="text-xs text-zen-600">
            Copy to any Mermaid renderer to view as a diagram
          </div>
        </div>
        <pre className="code-block text-xs text-zen-400 leading-relaxed">{mermaidCode}</pre>
      </div>
    </section>
  )
}
