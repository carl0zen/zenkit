/**
 * ZenKit Benchmark Visualizer
 *
 * Generates Mermaid diagram syntax from a benchmark result or summary.
 *
 * Usage:
 *   npx tsx benchmark/scripts/visualize.ts [result-path]
 *   npx tsx benchmark/scripts/visualize.ts --summary
 */
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')

function visualizeResult(resultPath: string): string {
  const r = JSON.parse(fs.readFileSync(resultPath, 'utf-8'))
  const lines: string[] = [
    'graph LR',
  ]

  // Stages as nodes
  for (let i = 0; i < r.stages.length; i++) {
    const s = r.stages[i]
    const id = s.name.replace(/[^a-zA-Z]/g, '')
    const label = `${s.name}\\n${s.checks_passed}/${s.checks_run}`
    const shape = s.status === 'pass' ? `${id}[${label}]` : `${id}{{${label}}}`
    lines.push(`    ${shape}`)

    if (i > 0) {
      const prevId = r.stages[i - 1].name.replace(/[^a-zA-Z]/g, '')
      lines.push(`    ${prevId} --> ${id}`)
    }
  }

  // Style pass/fail
  lines.push('')
  for (const s of r.stages) {
    const id = s.name.replace(/[^a-zA-Z]/g, '')
    if (s.status === 'pass') {
      lines.push(`    style ${id} fill:#064e3b,stroke:#059669,color:#d1fae5`)
    } else {
      lines.push(`    style ${id} fill:#7f1d1d,stroke:#dc2626,color:#fecaca`)
    }
  }

  return lines.join('\n')
}

function visualizeSummary(): string {
  const summaryPath = path.join(ROOT, 'benchmark/results/summary.json')
  if (!fs.existsSync(summaryPath)) {
    console.error('No summary.json found. Run benchmark:all first.')
    process.exit(1)
  }

  const s = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
  const lines: string[] = [
    'graph TD',
  ]

  for (let i = 0; i < s.results.length; i++) {
    const r = s.results[i]
    const id = `spec${i}`
    const name = r.spec.replace('.json', '').replace(/-/g, ' ')
    const label = `${name}\\n${r.criteria} criteria\\n${r.checks} checks`
    const shape = r.status === 'pass' ? `${id}[${label}]` : `${id}{{${label}}}`
    lines.push(`    ${shape}`)
  }

  // Connect to a central summary node
  lines.push(`    summary((${s.passed}/${s.total} passed))`)
  for (let i = 0; i < s.results.length; i++) {
    lines.push(`    spec${i} --> summary`)
  }

  lines.push('')
  for (let i = 0; i < s.results.length; i++) {
    const r = s.results[i]
    const id = `spec${i}`
    if (r.status === 'pass') {
      lines.push(`    style ${id} fill:#064e3b,stroke:#059669,color:#d1fae5`)
    } else {
      lines.push(`    style ${id} fill:#7f1d1d,stroke:#dc2626,color:#fecaca`)
    }
  }
  lines.push(`    style summary fill:#292824,stroke:#918f7e,color:#ededea`)

  return lines.join('\n')
}

function main() {
  const arg = process.argv[2]

  let mermaid: string

  if (arg === '--summary') {
    mermaid = visualizeSummary()
  } else if (arg) {
    mermaid = visualizeResult(path.resolve(arg))
  } else {
    // Default: use latest live result
    const defaultResult = path.join(ROOT, 'benchmark/results/svp-001-live.json')
    if (fs.existsSync(defaultResult)) {
      mermaid = visualizeResult(defaultResult)
    } else {
      console.error('No result file found. Specify a path or run a benchmark first.')
      process.exit(1)
    }
  }

  console.log(mermaid)

  // Also write to file
  const outDir = path.join(ROOT, 'benchmark/results')
  const outFile = arg === '--summary' ? 'workflow-summary.mermaid' : 'workflow.mermaid'
  fs.writeFileSync(path.join(outDir, outFile), mermaid)
  console.log(`\nWritten to: benchmark/results/${outFile}`)
}

main()
