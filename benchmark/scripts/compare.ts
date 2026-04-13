/**
 * ZenKit Benchmark Comparison
 *
 * Compares a zenkit-mode benchmark result against a baseline-mode result.
 * Produces a structured comparison artifact.
 *
 * Usage: npx tsx benchmark/scripts/compare.ts <zenkit-result> <baseline-result>
 */
import fs from 'fs'
import path from 'path'

interface ComparisonResult {
  comparison_id: string
  version: string
  zenkit_result: string
  baseline_result: string
  generated_at: string
  data_source: 'illustrative' | 'measured'
  summary: {
    zenkit_status: string
    baseline_status: string
    zenkit_criteria_passed: number
    baseline_criteria_passed: number
    zenkit_total_checks: number
    baseline_total_checks: number
    zenkit_duration_ms: number
    baseline_duration_ms: number
  }
  structural_differences: {
    category: string
    zenkit: string
    baseline: string
    note: string
  }[]
  telemetry_comparison: {
    metric: string
    zenkit: string
    baseline: string
    source: string
  }[]
  interpretation: string[]
  caveats: string[]
}

function main() {
  const zenkitPath = process.argv[2] || 'benchmark/results/svp-001-live.json'
  const baselinePath = process.argv[3] || 'benchmark/results/svp-001-baseline-live.json'

  const zk = JSON.parse(fs.readFileSync(path.resolve(zenkitPath), 'utf-8'))
  const bl = JSON.parse(fs.readFileSync(path.resolve(baselinePath), 'utf-8'))

  const zkChecks = (zk.stages || []).reduce((s: number, st: any) => s + st.checks_run, 0)
  const blChecks = (bl.stages || []).reduce((s: number, st: any) => s + st.checks_run, 0)

  const comparison: ComparisonResult = {
    comparison_id: `cmp-${Date.now()}`,
    version: '0.2.0',
    zenkit_result: zenkitPath,
    baseline_result: baselinePath,
    generated_at: new Date().toISOString(),
    data_source: 'illustrative',
    summary: {
      zenkit_status: zk.status,
      baseline_status: bl.status,
      zenkit_criteria_passed: zk.validation_summary.criteria_passed,
      baseline_criteria_passed: bl.validation_summary.criteria_passed,
      zenkit_total_checks: zkChecks,
      baseline_total_checks: blChecks,
      zenkit_duration_ms: zk.duration_ms,
      baseline_duration_ms: bl.duration_ms,
    },
    structural_differences: [
      {
        category: 'Workflow structure',
        zenkit: `${zk.stages?.length || 0} stages with ${zkChecks} checks`,
        baseline: `${bl.stages?.length || 0} stages with ${blChecks} checks`,
        note: 'ZenKit enforces staged validation; baseline runs the same checks without workflow metadata',
      },
      {
        category: 'Uncertainty tracking',
        zenkit: `${zk.uncertainty?.length || 0} uncertainty notes, ${zk.limitations?.length || 0} limitations`,
        baseline: `${bl.uncertainty?.length || 0} uncertainty notes, ${bl.limitations?.length || 0} limitations`,
        note: 'Both specs can declare uncertainty; ZenKit workflow structure makes this a first-class requirement',
      },
      {
        category: 'Handoff contracts',
        zenkit: 'Handoff schema enforced between stages',
        baseline: 'No handoff contracts — context transfer is implicit',
        note: 'This structural difference matters most in multi-agent workflows, not single-feature benchmarks',
      },
      {
        category: 'Acceptance criteria format',
        zenkit: 'Machine-verifiable criteria with verification steps',
        baseline: 'Same criteria format (shared spec structure)',
        note: 'The verification format is the same — the difference is that ZenKit mandates it',
      },
    ],
    telemetry_comparison: [
      {
        metric: 'Estimated tokens',
        zenkit: `~${zk.telemetry?.estimated?.tokens?.toLocaleString() || 'N/A'}`,
        baseline: `~${bl.telemetry?.estimated?.tokens?.toLocaleString() || 'N/A'}`,
        source: 'estimated',
      },
      {
        metric: 'Estimated cost',
        zenkit: `~$${zk.telemetry?.estimated?.cost_usd?.toFixed(2) || 'N/A'}`,
        baseline: `~$${bl.telemetry?.estimated?.cost_usd?.toFixed(2) || 'N/A'}`,
        source: 'estimated',
      },
    ],
    interpretation: [
      'In this comparison, both modes verify the same codebase and produce the same pass/fail results.',
      'The structural difference is in workflow metadata: ZenKit runs enforce staged validation, explicit uncertainty, and handoff contracts.',
      'A meaningful cost/quality comparison requires running the actual implementation process twice — once with ZenKit structure, once without — and measuring drift, retries, and rework.',
      'This comparison demonstrates the architecture for such measurement, not the measurement itself.',
    ],
    caveats: [
      'This is illustrative data. Both benchmark runs validate the same already-built feature.',
      'Pass/fail parity is expected — the value of ZenKit structure shows in multi-step, multi-agent workflows where drift compounds.',
      'Real comparison data requires A/B workflow execution, which is outside the scope of this static benchmark.',
    ],
  }

  // Write JSON
  const outPath = path.resolve('benchmark/results/comparison-svp-001.json')
  fs.writeFileSync(outPath, JSON.stringify(comparison, null, 2))

  // Write markdown
  const lines = [
    '# Benchmark Comparison: ZenKit vs Baseline',
    '',
    `> **Data source: ${comparison.data_source}** — This comparison demonstrates the measurement architecture, not a measured result.`,
    '',
    '## Summary',
    '',
    '| Metric | ZenKit | Baseline |',
    '|--------|--------|----------|',
    `| Status | ${comparison.summary.zenkit_status} | ${comparison.summary.baseline_status} |`,
    `| Criteria passed | ${comparison.summary.zenkit_criteria_passed} | ${comparison.summary.baseline_criteria_passed} |`,
    `| Total checks | ${comparison.summary.zenkit_total_checks} | ${comparison.summary.baseline_total_checks} |`,
    `| Duration | ${comparison.summary.zenkit_duration_ms}ms | ${comparison.summary.baseline_duration_ms}ms |`,
    '',
    '## Structural Differences',
    '',
  ]

  for (const d of comparison.structural_differences) {
    lines.push(`### ${d.category}`)
    lines.push(`- **ZenKit:** ${d.zenkit}`)
    lines.push(`- **Baseline:** ${d.baseline}`)
    lines.push(`- *${d.note}*`)
    lines.push('')
  }

  lines.push('## Interpretation', '')
  for (const i of comparison.interpretation) lines.push(`- ${i}`)

  lines.push('', '## Caveats', '')
  for (const c of comparison.caveats) lines.push(`- ${c}`)

  lines.push('', '---', '', '*Generated by ZenKit Benchmark Comparison v0.2*')

  const mdPath = path.resolve('benchmark/results/comparison-svp-001.md')
  fs.writeFileSync(mdPath, lines.join('\n'))

  console.log(lines.join('\n'))
  console.log(`\nJSON: ${outPath}`)
  console.log(`Markdown: ${mdPath}`)
}

main()
