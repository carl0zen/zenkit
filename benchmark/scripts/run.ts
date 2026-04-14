/**
 * ZenKit Benchmark Runner
 *
 * Verifies acceptance criteria from a feature spec against the actual
 * implementation. Produces structured results distinguishing validated
 * checks from estimated/illustrative data.
 *
 * Usage: npx tsx benchmark/scripts/run.ts [feature-spec-path]
 */
import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// --- Types ---

interface Verification {
  type: 'file_exists' | 'file_contains' | 'schema_count' | 'examples_valid' | 'schemas_consistent' | 'test_passes' | 'json_path_equals'
  path?: string
  pattern?: string
  expected?: number
  command?: string
  json_path?: string
  equals?: unknown
}

interface AcceptanceCriterion {
  id: string
  description: string
  verification: Verification
}

interface FeatureSpec {
  feature_id: string
  name: string
  description: string
  mode: 'zenkit' | 'baseline'
  acceptance_criteria: AcceptanceCriterion[]
  constraints: string[]
  expected_files: string[]
  assigned_commands: string[]
  estimated_complexity: string
  limitations: string[]
}

interface CriterionResult {
  id: string
  description: string
  status: 'pass' | 'fail'
  evidence: string
  verification_type: string
}

interface StageResult {
  name: string
  status: 'pass' | 'fail' | 'skipped'
  duration_ms: number
  checks_run: number
  checks_passed: number
  details: string[]
}

interface BenchmarkResult {
  benchmark_id: string
  version: string
  mode: 'zenkit' | 'baseline'
  task_name: string
  feature_spec: string
  started_at: string
  completed_at: string
  duration_ms: number
  status: 'pass' | 'fail' | 'partial'
  expected_files: string[]
  files_found: string[]
  files_missing: string[]
  acceptance_criteria_results: CriterionResult[]
  stages: StageResult[]
  validation_summary: {
    total_criteria: number
    criteria_passed: number
    criteria_failed: number
    schemas_valid: boolean
    examples_valid: boolean
  }
  telemetry: {
    estimated: {
      tokens: number
      cost_usd: number
      basis: string
    }
    actual: null | {
      tokens: number
      cost_usd: number
    }
  }
  uncertainty: string[]
  limitations: string[]
}

// --- Helpers ---

const ROOT = path.resolve(__dirname, '../..')

function resolve(p: string): string {
  return path.resolve(ROOT, p)
}

function fileExists(p: string): boolean {
  return fs.existsSync(resolve(p))
}

function fileContains(p: string, pattern: string): boolean {
  if (!fileExists(p)) return false
  const content = fs.readFileSync(resolve(p), 'utf-8')
  return content.includes(pattern)
}

function compileAllSchemas(): { valid: boolean; count: number; errors: string[] } {
  const schemasDir = resolve('schemas')
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'))
  const errors: string[] = []

  for (const file of files) {
    const localAjv = new Ajv({ allErrors: true, strict: false })
    addFormats(localAjv)
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf-8'))
    try {
      localAjv.compile(schema)
    } catch (err) {
      errors.push(`${file}: ${err}`)
    }
  }

  return { valid: errors.length === 0, count: files.length, errors }
}

function checkSchemasConsistent(): { consistent: boolean; details: string } {
  const schemasDir = resolve('schemas')
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'))
  const drafts = new Set<string>()

  for (const file of files) {
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf-8'))
    if (schema.$schema) drafts.add(schema.$schema)
  }

  const consistent = drafts.size === 1
  return {
    consistent,
    details: consistent
      ? `All ${files.length} schemas use ${[...drafts][0]}`
      : `Inconsistent drafts: ${[...drafts].join(', ')}`,
  }
}

function checkExamplesValid(): { valid: boolean; details: string[] } {
  // Dynamic import won't work in tsx script, so we re-implement validation inline
  const schemasDir = resolve('schemas')
  const schemaFiles: Record<string, string> = {
    handoff: 'handoff.schema.json',
    task: 'task.schema.json',
    audit: 'audit.schema.json',
    checkpoint: 'checkpoint.schema.json',
    benchmark: 'benchmark.schema.json',
  }

  const details: string[] = []
  let allValid = true

  // Load example data by reading the TS file and extracting JSON-like structure
  // Since we can't import TS directly, we validate example fixtures instead
  const fixtureDir = resolve('benchmark/fixtures')
  if (fs.existsSync(fixtureDir)) {
    const fixtures = fs.readdirSync(fixtureDir).filter(f => f.endsWith('.json'))
    for (const fixture of fixtures) {
      const data = JSON.parse(fs.readFileSync(path.join(fixtureDir, fixture), 'utf-8'))
      // Try to validate against handoff schema (our main fixture)
      const localAjv = new Ajv({ allErrors: true, strict: false })
      addFormats(localAjv)
      const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, 'handoff.schema.json'), 'utf-8'))
      const validate = localAjv.compile(schema)
      const valid = validate(data)
      if (valid) {
        details.push(`${fixture}: valid against handoff.schema.json`)
      } else {
        details.push(`${fixture}: INVALID — ${validate.errors?.map(e => e.message).join(', ')}`)
        allValid = false
      }
    }
  }

  // Also check that the schema library file registers all schemas
  const schemasTs = resolve('src/lib/schemas.ts')
  if (fs.existsSync(schemasTs)) {
    const content = fs.readFileSync(schemasTs, 'utf-8')
    for (const name of Object.keys(schemaFiles)) {
      if (content.includes(`${name}:`)) {
        details.push(`schemas.ts registers '${name}'`)
      } else {
        details.push(`schemas.ts MISSING registration for '${name}'`)
        allValid = false
      }
    }
  }

  return { valid: allValid, details }
}

// --- Criterion Verification ---

function verifyCriterion(criterion: AcceptanceCriterion): CriterionResult {
  const { verification } = criterion

  switch (verification.type) {
    case 'file_exists': {
      const exists = fileExists(verification.path!)
      return {
        id: criterion.id,
        description: criterion.description,
        status: exists ? 'pass' : 'fail',
        evidence: exists ? `${verification.path} exists` : `${verification.path} not found`,
        verification_type: 'file_exists',
      }
    }

    case 'file_contains': {
      const found = fileContains(verification.path!, verification.pattern!)
      return {
        id: criterion.id,
        description: criterion.description,
        status: found ? 'pass' : 'fail',
        evidence: found
          ? `${verification.path} contains '${verification.pattern}'`
          : `${verification.path} does not contain '${verification.pattern}'`,
        verification_type: 'file_contains',
      }
    }

    case 'schema_count': {
      const result = compileAllSchemas()
      const pass = result.count === verification.expected!
      return {
        id: criterion.id,
        description: criterion.description,
        status: pass ? 'pass' : 'fail',
        evidence: `${result.count} schemas found (expected ${verification.expected}), ${result.errors.length} compilation errors`,
        verification_type: 'schema_count',
      }
    }

    case 'examples_valid': {
      const result = checkExamplesValid()
      return {
        id: criterion.id,
        description: criterion.description,
        status: result.valid ? 'pass' : 'fail',
        evidence: result.details.join('; '),
        verification_type: 'examples_valid',
      }
    }

    case 'schemas_consistent': {
      const result = checkSchemasConsistent()
      return {
        id: criterion.id,
        description: criterion.description,
        status: result.consistent ? 'pass' : 'fail',
        evidence: result.details,
        verification_type: 'schemas_consistent',
      }
    }

    case 'test_passes': {
      const cmd = verification.command || 'npm test'
      try {
        const { execSync } = require('child_process')
        execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 60000, stdio: 'pipe' })
        return {
          id: criterion.id,
          description: criterion.description,
          status: 'pass',
          evidence: `Command '${cmd}' exited with code 0`,
          verification_type: 'test_passes',
        }
      } catch (err: any) {
        return {
          id: criterion.id,
          description: criterion.description,
          status: 'fail',
          evidence: `Command '${cmd}' failed with exit code ${err.status || 'unknown'}`,
          verification_type: 'test_passes',
        }
      }
    }

    case 'json_path_equals': {
      const filePath = verification.path!
      const jsonPath = verification.json_path!
      const expectedValue = verification.equals
      if (!fileExists(filePath)) {
        return {
          id: criterion.id,
          description: criterion.description,
          status: 'fail',
          evidence: `File not found: ${filePath}`,
          verification_type: 'json_path_equals',
        }
      }
      try {
        const data = JSON.parse(fs.readFileSync(resolve(filePath), 'utf-8'))
        // Simple dot-path traversal
        const parts = jsonPath.split('.')
        let current: any = data
        for (const part of parts) {
          if (current === undefined || current === null) break
          current = current[part]
        }
        const match = JSON.stringify(current) === JSON.stringify(expectedValue)
        return {
          id: criterion.id,
          description: criterion.description,
          status: match ? 'pass' : 'fail',
          evidence: match
            ? `${filePath}:${jsonPath} equals ${JSON.stringify(expectedValue)}`
            : `${filePath}:${jsonPath} is ${JSON.stringify(current)}, expected ${JSON.stringify(expectedValue)}`,
          verification_type: 'json_path_equals',
        }
      } catch (err) {
        return {
          id: criterion.id,
          description: criterion.description,
          status: 'fail',
          evidence: `Error reading ${filePath}: ${err}`,
          verification_type: 'json_path_equals',
        }
      }
    }

    default:
      return {
        id: criterion.id,
        description: criterion.description,
        status: 'fail',
        evidence: `Unknown verification type: ${verification.type}`,
        verification_type: 'unknown',
      }
  }
}

// --- Stage Runners ---

function runSpecStage(spec: FeatureSpec, specPath: string): StageResult {
  const start = Date.now()
  const checks: string[] = []
  let passed = 0
  const total = 4

  // Validate spec against feature-spec.schema.json
  const specSchemaPath = resolve('schemas/feature-spec.schema.json')
  if (fs.existsSync(specSchemaPath)) {
    const localAjv = new Ajv({ allErrors: true, strict: false })
    addFormats(localAjv)
    const specSchema = JSON.parse(fs.readFileSync(specSchemaPath, 'utf-8'))
    const validate = localAjv.compile(specSchema)
    const specData = JSON.parse(fs.readFileSync(path.resolve(specPath), 'utf-8'))
    if (validate(specData)) {
      passed++; checks.push('spec validates against feature-spec.schema.json')
    } else {
      checks.push(`FAIL: spec schema validation — ${validate.errors?.map(e => e.message).join(', ')}`)
    }
  } else {
    checks.push('SKIP: feature-spec.schema.json not found')
  }

  if (spec.name.length > 0) { passed++; checks.push('name present') }
  else checks.push('FAIL: name empty')

  if (spec.acceptance_criteria.length > 0) { passed++; checks.push(`${spec.acceptance_criteria.length} acceptance criteria defined`) }
  else checks.push('FAIL: no acceptance criteria')

  if (spec.limitations.length > 0) { passed++; checks.push(`${spec.limitations.length} limitations declared`) }
  else checks.push('FAIL: no limitations declared — specs should be honest about scope')

  return {
    name: 'spec',
    status: passed === total ? 'pass' : 'fail',
    duration_ms: Date.now() - start,
    checks_run: total,
    checks_passed: passed,
    details: checks,
  }
}

function runBuildStage(spec: FeatureSpec): StageResult {
  const start = Date.now()
  const checks: string[] = []
  let passed = 0

  for (const file of spec.expected_files) {
    if (fileExists(file)) {
      passed++
      checks.push(`${file} exists`)
    } else {
      checks.push(`FAIL: ${file} not found`)
    }
  }

  return {
    name: 'build',
    status: passed === spec.expected_files.length ? 'pass' : 'fail',
    duration_ms: Date.now() - start,
    checks_run: spec.expected_files.length,
    checks_passed: passed,
    details: checks,
  }
}

function runAuditStage(criteriaResults: CriterionResult[]): StageResult {
  const start = Date.now()
  const passed = criteriaResults.filter(c => c.status === 'pass').length
  const total = criteriaResults.length

  return {
    name: 'audit',
    status: passed === total ? 'pass' : passed > 0 ? 'fail' : 'fail',
    duration_ms: Date.now() - start,
    checks_run: total,
    checks_passed: passed,
    details: criteriaResults.map(c => `[${c.status.toUpperCase()}] ${c.id}: ${c.evidence}`),
  }
}

function runSchemaStage(): StageResult {
  const start = Date.now()
  const result = compileAllSchemas()
  const consistency = checkSchemasConsistent()

  return {
    name: 'schemas',
    status: result.valid && consistency.consistent ? 'pass' : 'fail',
    duration_ms: Date.now() - start,
    checks_run: result.count + 1,
    checks_passed: (result.count - result.errors.length) + (consistency.consistent ? 1 : 0),
    details: [
      `${result.count} schemas compiled, ${result.errors.length} errors`,
      consistency.details,
      ...result.errors,
    ],
  }
}

// --- Telemetry ---

function estimateTokens(spec: FeatureSpec): number {
  const base = 5000
  const perCriterion = 2500
  const multiplier = spec.estimated_complexity === 'high' ? 2.0 :
    spec.estimated_complexity === 'medium' ? 1.5 : 1.0
  return Math.round((base + spec.acceptance_criteria.length * perCriterion) * multiplier)
}

function estimateCost(tokens: number): number {
  // $3/M input, $15/M output, assuming 60/40 split
  return (tokens * 0.6 * 3 + tokens * 0.4 * 15) / 1_000_000
}

// --- Main ---

async function main() {
  const specPath = process.argv[2] || 'benchmark/feature-specs/schema-validator-playground.json'
  const resolvedPath = path.resolve(specPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Feature spec not found: ${resolvedPath}`)
    process.exit(1)
  }

  console.log('ZenKit Benchmark Runner v0.2')
  console.log('============================\n')

  const startTime = new Date()
  const spec: FeatureSpec = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))

  console.log(`Feature: ${spec.name}`)
  console.log(`Mode: ${spec.mode}`)
  console.log(`Criteria: ${spec.acceptance_criteria.length}`)
  console.log(`Expected files: ${spec.expected_files.length}`)
  console.log()

  // Run stages
  const stages: StageResult[] = []

  // 1. Spec validation
  const specStage = runSpecStage(spec, resolvedPath)
  stages.push(specStage)
  console.log(`  [${specStage.status}] spec (${specStage.checks_passed}/${specStage.checks_run})`)

  // 2. Schema compilation
  const schemaStage = runSchemaStage()
  stages.push(schemaStage)
  console.log(`  [${schemaStage.status}] schemas (${schemaStage.checks_passed}/${schemaStage.checks_run})`)

  // 3. Build verification (expected files)
  const buildStage = runBuildStage(spec)
  stages.push(buildStage)
  console.log(`  [${buildStage.status}] build (${buildStage.checks_passed}/${buildStage.checks_run})`)

  // 4. Acceptance criteria audit
  const criteriaResults = spec.acceptance_criteria.map(verifyCriterion)
  const auditStage = runAuditStage(criteriaResults)
  stages.push(auditStage)
  console.log(`  [${auditStage.status}] audit (${auditStage.checks_passed}/${auditStage.checks_run})`)

  const endTime = new Date()
  const allPassed = stages.every(s => s.status === 'pass')
  const anyPassed = stages.some(s => s.status === 'pass')
  const estimatedTokens = estimateTokens(spec)

  // Determine actual files found/missing
  const filesFound = spec.expected_files.filter(fileExists)
  const filesMissing = spec.expected_files.filter(f => !fileExists(f))

  const result: BenchmarkResult = {
    benchmark_id: `bench-${spec.feature_id}-${Date.now()}`,
    version: '0.2.0',
    mode: spec.mode,
    task_name: spec.name,
    feature_spec: specPath,
    started_at: startTime.toISOString(),
    completed_at: endTime.toISOString(),
    duration_ms: endTime.getTime() - startTime.getTime(),
    status: allPassed ? 'pass' : anyPassed ? 'partial' : 'fail',
    expected_files: spec.expected_files,
    files_found: filesFound,
    files_missing: filesMissing,
    acceptance_criteria_results: criteriaResults,
    stages,
    validation_summary: {
      total_criteria: criteriaResults.length,
      criteria_passed: criteriaResults.filter(c => c.status === 'pass').length,
      criteria_failed: criteriaResults.filter(c => c.status === 'fail').length,
      schemas_valid: schemaStage.status === 'pass',
      examples_valid: criteriaResults.find(c => c.id === 'ac-6')?.status === 'pass' || false,
    },
    telemetry: {
      estimated: {
        tokens: estimatedTokens,
        cost_usd: estimateCost(estimatedTokens),
        basis: 'Heuristic: 5000 base + 2500 per criterion, scaled by complexity',
      },
      actual: null,
    },
    uncertainty: [
      'Token and cost figures are estimates — no actual API telemetry is captured by this runner',
      'Acceptance criteria verify code structure and schema validity, not runtime UI behavior',
      'Stage durations reflect verification time, not original implementation time',
    ],
    limitations: spec.limitations,
  }

  // Write result
  const resultPath = resolve(`benchmark/results/${spec.feature_id}-live.json`)
  fs.mkdirSync(path.dirname(resultPath), { recursive: true })
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2))

  // Summary
  const totalChecks = stages.reduce((sum, s) => sum + s.checks_run, 0)
  const totalPassed = stages.reduce((sum, s) => sum + s.checks_passed, 0)

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Status:     ${result.status.toUpperCase()}`)
  console.log(`Checks:     ${totalPassed}/${totalChecks} passed`)
  console.log(`Criteria:   ${result.validation_summary.criteria_passed}/${result.validation_summary.total_criteria} passed`)
  console.log(`Files:      ${filesFound.length}/${spec.expected_files.length} found`)
  console.log(`Duration:   ${result.duration_ms}ms`)
  console.log(`Est tokens: ~${estimatedTokens.toLocaleString()} (estimated)`)
  console.log(`Est cost:   ~$${result.telemetry.estimated.cost_usd.toFixed(2)} (estimated)`)
  console.log(`Result:     ${resultPath}`)

  if (filesMissing.length > 0) {
    console.log(`\nMissing files:`)
    filesMissing.forEach(f => console.log(`  - ${f}`))
  }

  const failedCriteria = criteriaResults.filter(c => c.status === 'fail')
  if (failedCriteria.length > 0) {
    console.log(`\nFailed criteria:`)
    failedCriteria.forEach(c => console.log(`  - ${c.id}: ${c.evidence}`))
  }
}

main().catch(err => {
  console.error('Benchmark failed:', err)
  process.exit(1)
})
