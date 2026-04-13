/**
 * ZenKit Benchmark Runner — All Specs
 *
 * Runs the benchmark against every feature spec in benchmark/feature-specs/
 * and produces a combined summary.
 *
 * Usage: npx tsx benchmark/scripts/run-all.ts
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')
const specsDir = path.join(ROOT, 'benchmark/feature-specs')

interface Summary {
  total: number
  passed: number
  failed: number
  partial: number
  results: Array<{
    spec: string
    status: string
    criteria: string
    checks: string
    duration_ms: number
  }>
  generated_at: string
}

function main() {
  const specs = fs.readdirSync(specsDir)
    .filter(f => f.endsWith('.json') && !f.includes('baseline'))
    .sort()

  console.log('ZenKit Benchmark Runner — All Specs')
  console.log('====================================\n')
  console.log(`Found ${specs.length} feature specs\n`)

  const summary: Summary = {
    total: specs.length,
    passed: 0,
    failed: 0,
    partial: 0,
    results: [],
    generated_at: new Date().toISOString(),
  }

  for (const spec of specs) {
    const specPath = path.join('benchmark/feature-specs', spec)
    try {
      const output = execSync(`npx tsx benchmark/scripts/run.ts ${specPath}`, {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 30000,
      })

      // Parse the result from the generated file
      const specData = JSON.parse(fs.readFileSync(path.join(specsDir, spec), 'utf-8'))
      const resultPath = path.join(ROOT, `benchmark/results/${specData.feature_id}-live.json`)
      const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'))

      const totalChecks = result.stages.reduce((s: number, st: any) => s + st.checks_run, 0)
      const totalPassed = result.stages.reduce((s: number, st: any) => s + st.checks_passed, 0)

      summary.results.push({
        spec: spec,
        status: result.status,
        criteria: `${result.validation_summary.criteria_passed}/${result.validation_summary.total_criteria}`,
        checks: `${totalPassed}/${totalChecks}`,
        duration_ms: result.duration_ms,
      })

      if (result.status === 'pass') summary.passed++
      else if (result.status === 'partial') summary.partial++
      else summary.failed++

      const icon = result.status === 'pass' ? 'PASS' : result.status === 'partial' ? 'PARTIAL' : 'FAIL'
      console.log(`  [${icon}] ${specData.name} — criteria ${summary.results[summary.results.length - 1].criteria}, checks ${summary.results[summary.results.length - 1].checks}`)
    } catch (err) {
      summary.failed++
      summary.results.push({
        spec: spec,
        status: 'error',
        criteria: '0/0',
        checks: '0/0',
        duration_ms: 0,
      })
      console.log(`  [ERROR] ${spec} — ${err}`)
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Total:   ${summary.total} specs`)
  console.log(`Passed:  ${summary.passed}`)
  console.log(`Failed:  ${summary.failed}`)
  console.log(`Partial: ${summary.partial}`)

  // Write summary
  const summaryPath = path.join(ROOT, 'benchmark/results/summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  console.log(`\nSummary: ${summaryPath}`)

  // Write markdown summary
  const lines = [
    '# Benchmark Summary',
    '',
    `Generated: ${summary.generated_at}`,
    '',
    `| Spec | Status | Criteria | Checks | Duration |`,
    `|------|--------|----------|--------|----------|`,
  ]
  for (const r of summary.results) {
    lines.push(`| ${r.spec} | ${r.status.toUpperCase()} | ${r.criteria} | ${r.checks} | ${r.duration_ms}ms |`)
  }
  lines.push('', `**${summary.passed}/${summary.total} passed**`)

  const mdPath = path.join(ROOT, 'benchmark/results/summary.md')
  fs.writeFileSync(mdPath, lines.join('\n'))
  console.log(`Report:  ${mdPath}`)

  process.exit(summary.failed > 0 ? 1 : 0)
}

main()
