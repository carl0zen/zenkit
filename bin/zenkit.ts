#!/usr/bin/env npx tsx
/**
 * ZenKit CLI
 *
 * Thin command-line interface for the ZenKit protocol layer.
 *
 * Usage:
 *   zenkit validate <schema> <file>    Validate a JSON file against a ZenKit schema
 *   zenkit validate:all                Validate all schemas compile correctly
 *   zenkit benchmark [spec]            Run a benchmark against a feature spec
 *   zenkit benchmark:all               Run all feature specs
 *   zenkit benchmark:report [result]   Generate markdown report from a result
 *   zenkit benchmark:compare [z] [b]   Compare zenkit vs baseline results
 *   zenkit init [dir]                  Scaffold ZenKit into a project directory
 *   zenkit status                      Show project ZenKit status
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const ROOT = findRoot()
const args = process.argv.slice(2)
const command = args[0]

function findRoot(): string {
  let dir = process.cwd()
  while (dir !== '/') {
    if (fs.existsSync(path.join(dir, 'schemas')) && fs.existsSync(path.join(dir, 'commands'))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return process.cwd()
}

function run(cmd: string) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 60000 })
  } catch {
    process.exit(1)
  }
}

function validate() {
  const schemaName = args[1]
  const filePath = args[2]

  if (!schemaName || !filePath) {
    console.error('Usage: zenkit validate <schema> <file>')
    console.error('Schemas: handoff, task, audit, checkpoint, benchmark')
    process.exit(1)
  }

  const validSchemas = ['handoff', 'task', 'audit', 'checkpoint', 'benchmark']
  if (!validSchemas.includes(schemaName)) {
    console.error(`Unknown schema: ${schemaName}`)
    console.error(`Available: ${validSchemas.join(', ')}`)
    process.exit(1)
  }

  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`)
    process.exit(1)
  }

  // Inline validation using Ajv
  const Ajv = require('ajv')
  const addFormats = require('ajv-formats')
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)

  const schemaPath = path.join(ROOT, 'schemas', `${schemaName}.schema.json`)
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
  const data = JSON.parse(fs.readFileSync(resolved, 'utf-8'))
  const validate = ajv.compile(schema)
  const valid = validate(data)

  if (valid) {
    console.log(`PASS — ${filePath} validates against ${schemaName}.schema.json`)
  } else {
    console.log(`FAIL — ${filePath} has ${validate.errors.length} error(s):`)
    for (const err of validate.errors) {
      console.log(`  ${err.instancePath || '/'}: ${err.message}`)
    }
    process.exit(1)
  }
}

function init() {
  const targetDir = args[1] ? path.resolve(args[1]) : process.cwd()

  const dirs = ['commands', 'schemas', 'skills', 'hooks', 'agents', 'rubrics', 'templates', 'benchmark/feature-specs', 'benchmark/results']
  const files: Record<string, string> = {
    'commands/.gitkeep': '',
    'schemas/.gitkeep': '',
    'skills/.gitkeep': '',
    'hooks/.gitkeep': '',
    'agents/.gitkeep': '',
    'rubrics/.gitkeep': '',
    'templates/.gitkeep': '',
  }

  console.log(`Initializing ZenKit in ${targetDir}\n`)

  for (const dir of dirs) {
    const full = path.join(targetDir, dir)
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true })
      console.log(`  created ${dir}/`)
    } else {
      console.log(`  exists  ${dir}/`)
    }
  }

  for (const [file, content] of Object.entries(files)) {
    const full = path.join(targetDir, file)
    if (!fs.existsSync(full)) {
      fs.writeFileSync(full, content)
    }
  }

  console.log('\nZenKit structure initialized.')
  console.log('Next: copy schemas from the ZenKit repo, or define your own.')
}

function status() {
  console.log('ZenKit Project Status')
  console.log('=====================\n')

  const checks: [string, boolean][] = []

  // Check directories
  const dirs = ['commands', 'schemas', 'skills', 'hooks', 'agents', 'rubrics']
  for (const dir of dirs) {
    const full = path.join(ROOT, dir)
    const exists = fs.existsSync(full)
    const count = exists ? fs.readdirSync(full).filter(f => !f.startsWith('.')).length : 0
    checks.push([`${dir}/ (${count} files)`, exists && count > 0])
  }

  // Check schemas
  const schemasDir = path.join(ROOT, 'schemas')
  if (fs.existsSync(schemasDir)) {
    const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'))
    checks.push([`${schemaFiles.length} JSON schemas`, schemaFiles.length > 0])
  }

  // Check benchmark
  const specsDir = path.join(ROOT, 'benchmark/feature-specs')
  if (fs.existsSync(specsDir)) {
    const specs = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'))
    checks.push([`${specs.length} benchmark specs`, specs.length > 0])
  }

  // Check results
  const resultsDir = path.join(ROOT, 'benchmark/results')
  if (fs.existsSync(resultsDir)) {
    const results = fs.readdirSync(resultsDir).filter(f => f.endsWith('-live.json'))
    checks.push([`${results.length} benchmark results`, results.length > 0])
  }

  // Check tests
  const testDir = path.join(ROOT, 'src/lib/__tests__')
  if (fs.existsSync(testDir)) {
    const tests = fs.readdirSync(testDir).filter(f => f.endsWith('.test.ts'))
    checks.push([`${tests.length} test files`, tests.length > 0])
  }

  // Check E2E
  const e2eDir = path.join(ROOT, 'e2e')
  if (fs.existsSync(e2eDir)) {
    const e2e = fs.readdirSync(e2eDir).filter(f => f.endsWith('.spec.ts'))
    checks.push([`${e2e.length} E2E test files`, e2e.length > 0])
  }

  // Check CI
  checks.push(['CI workflow', fs.existsSync(path.join(ROOT, '.github/workflows/ci.yml'))])

  for (const [label, ok] of checks) {
    console.log(`  ${ok ? 'OK' : '--'}  ${label}`)
  }

  const summary = path.join(ROOT, 'benchmark/results/summary.json')
  if (fs.existsSync(summary)) {
    const s = JSON.parse(fs.readFileSync(summary, 'utf-8'))
    console.log(`\nLast benchmark: ${s.passed}/${s.total} specs passed`)
  }
}

function audit() {
  console.log('ZenKit Audit')
  console.log('============\n')

  // Run all benchmarks
  let benchmarkOutput = ''
  try {
    benchmarkOutput = execSync('npx tsx benchmark/scripts/run-all.ts', {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 120000,
    })
    console.log(benchmarkOutput)
  } catch (err: any) {
    benchmarkOutput = err.stdout || ''
    console.log(benchmarkOutput)
  }

  // Read the summary
  const summaryPath = path.join(ROOT, 'benchmark/results/summary.json')
  if (!fs.existsSync(summaryPath)) {
    console.error('No benchmark summary found.')
    process.exit(1)
  }
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))

  // Build audit report per audit.schema.json
  const findings: any[] = []

  for (const result of summary.results) {
    if (result.status !== 'pass') {
      findings.push({
        category: 'correctness',
        severity: 'error',
        description: `Benchmark spec ${result.spec} status: ${result.status} (${result.criteria} criteria, ${result.checks} checks)`,
      })
    }
  }

  // Check for structural completeness
  const requiredDirs = ['commands', 'schemas', 'skills', 'hooks', 'agents', 'rubrics']
  for (const dir of requiredDirs) {
    const full = path.join(ROOT, dir)
    if (!fs.existsSync(full) || fs.readdirSync(full).filter(f => !f.startsWith('.')).length === 0) {
      findings.push({
        category: 'architecture',
        severity: 'warning',
        description: `Protocol directory ${dir}/ is missing or empty`,
      })
    }
  }

  if (!fs.existsSync(path.join(ROOT, '.github/workflows/ci.yml'))) {
    findings.push({
      category: 'testing',
      severity: 'info',
      description: 'No CI workflow found',
    })
  }

  const allPass = summary.failed === 0 && findings.filter((f: any) => f.severity === 'error').length === 0
  const verdict = allPass ? 'pass' : findings.some((f: any) => f.severity === 'error') ? 'fail' : 'conditional'

  const auditReport = {
    task_id: 'self-audit',
    auditor: 'zenkit-cli',
    timestamp: new Date().toISOString(),
    verdict,
    findings,
    rubric_scores: {
      execution_quality: Math.min(10, Math.round((summary.passed / summary.total) * 10)),
      verbosity_score: 8,
      architectural_alignment: findings.filter((f: any) => f.category === 'architecture').length === 0 ? 9 : 6,
    },
    open_questions: [
      'Rubric scores for verbosity and alignment are self-assessed — independent review recommended',
    ],
    recommendations: allPass
      ? ['All benchmark specs pass. Consider adding more feature specs for broader coverage.']
      : findings.filter((f: any) => f.severity === 'error').map((f: any) => `Fix: ${f.description}`),
  }

  // Write the audit report
  const auditPath = path.join(ROOT, 'benchmark/results/audit-report.json')
  fs.writeFileSync(auditPath, JSON.stringify(auditReport, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log(`Verdict: ${verdict.toUpperCase()}`)
  console.log(`Findings: ${findings.length} (${findings.filter((f: any) => f.severity === 'error').length} errors)`)
  console.log(`Benchmarks: ${summary.passed}/${summary.total} passed`)
  console.log(`Report: ${auditPath}`)

  if (findings.length > 0) {
    console.log('\nFindings:')
    for (const f of findings) {
      console.log(`  [${f.severity.toUpperCase()}] ${f.description}`)
    }
  }

  process.exit(verdict === 'fail' ? 1 : 0)
}

// --- Dispatch ---

switch (command) {
  case 'validate':
    if (args[1] === ':all' || args[1] === 'all') {
      run('npx tsx src/lib/validate-schemas.ts')
    } else {
      validate()
    }
    break

  case 'validate:all':
    run('npx tsx src/lib/validate-schemas.ts')
    break

  case 'benchmark':
    if (args[1]) {
      run(`npx tsx benchmark/scripts/run.ts ${args[1]}`)
    } else {
      run('npx tsx benchmark/scripts/run.ts')
    }
    break

  case 'benchmark:all':
    run('npx tsx benchmark/scripts/run-all.ts')
    break

  case 'benchmark:report':
    run(`npx tsx benchmark/scripts/report.ts ${args[1] || ''}`)
    break

  case 'benchmark:compare':
    run(`npx tsx benchmark/scripts/compare.ts ${args[1] || ''} ${args[2] || ''}`)
    break

  case 'audit':
    audit()
    break

  case 'init':
    init()
    break

  case 'status':
    status()
    break

  case 'help':
  case '--help':
  case '-h':
  case undefined:
    console.log(`zenkit — Disciplined workflows for coding agents.

Commands:
  validate <schema> <file>   Validate JSON against a ZenKit schema
  validate:all               Check all schemas compile
  benchmark [spec]           Run benchmark for a feature spec
  benchmark:all              Run all feature specs
  benchmark:report [result]  Generate markdown report
  benchmark:compare [z] [b]  Compare zenkit vs baseline
  audit                      Run all benchmarks and produce audit report
  init [dir]                 Scaffold ZenKit structure
  status                     Show project ZenKit status

Schemas: handoff, task, audit, checkpoint, benchmark, feature-spec`)
    break

  default:
    console.error(`Unknown command: ${command}`)
    console.error('Run "zenkit help" for usage.')
    process.exit(1)
}
