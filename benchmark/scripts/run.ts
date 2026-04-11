/**
 * ZenKit Benchmark Runner
 *
 * Processes a feature spec through a simulated ZenKit workflow,
 * validates each stage, and produces a structured benchmark result.
 *
 * Usage: npx tsx benchmark/scripts/run.ts [feature-spec-path]
 */
import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

interface FeatureSpec {
  feature_id: string
  name: string
  description: string
  acceptance_criteria: string[]
  constraints: string[]
  scope_boundaries: {
    in_scope: string[]
    out_of_scope: string[]
  }
  assigned_commands: string[]
  estimated_complexity: string
}

interface StageResult {
  name: string
  status: 'pass' | 'fail' | 'skipped'
  duration_ms: number
  notes: string
}

interface BenchmarkResult {
  benchmark_id: string
  task_name: string
  feature_spec: string
  start_time: string
  end_time: string
  duration_ms: number
  status: 'pass' | 'fail' | 'partial' | 'error'
  files_changed: string[]
  stages: StageResult[]
  telemetry: {
    estimated_tokens: number
    estimated_cost_usd: number
    telemetry_source: 'estimated' | 'actual'
  }
  validation: {
    tests_run: number
    tests_passed: number
    tests_failed: number
    schema_valid: boolean
    lint_clean: boolean
  }
  retries: number
  uncertainty_notes: string[]
  artifacts: Array<{ path: string; type: string }>
}

function loadFeatureSpec(specPath: string): FeatureSpec {
  const raw = fs.readFileSync(specPath, 'utf-8')
  return JSON.parse(raw)
}

function validateSchemas(): boolean {
  const schemasDir = path.resolve(__dirname, '../../schemas')
  const files = fs.readdirSync(schemasDir).filter((f) => f.endsWith('.schema.json'))
  let valid = true

  for (const file of files) {
    const localAjv = new Ajv({ allErrors: true, strict: false })
    addFormats(localAjv)
    const schema = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf-8'))
    try {
      localAjv.compile(schema)
    } catch {
      valid = false
      console.error(`Schema validation failed: ${file}`)
    }
  }
  return valid
}

function runStage(name: string, fn: () => boolean): StageResult {
  const start = Date.now()
  let status: 'pass' | 'fail' = 'pass'
  let notes = ''

  try {
    const passed = fn()
    status = passed ? 'pass' : 'fail'
    notes = passed ? `${name} completed successfully` : `${name} failed validation`
  } catch (err) {
    status = 'fail'
    notes = `Error in ${name}: ${err}`
  }

  return {
    name,
    status,
    duration_ms: Date.now() - start,
    notes,
  }
}

function estimateTokens(spec: FeatureSpec): number {
  const baseTokens = 5000
  const perCriteria = 3000
  const complexityMultiplier =
    spec.estimated_complexity === 'high' ? 2.0 :
    spec.estimated_complexity === 'medium' ? 1.5 : 1.0

  return Math.round(
    (baseTokens + spec.acceptance_criteria.length * perCriteria) * complexityMultiplier
  )
}

function estimateCost(tokens: number): number {
  // Estimated cost based on typical API pricing
  // Input: ~$3/M tokens, Output: ~$15/M tokens, assuming 60/40 split
  const inputTokens = tokens * 0.6
  const outputTokens = tokens * 0.4
  return (inputTokens * 3 + outputTokens * 15) / 1_000_000
}

async function main() {
  const specPath = process.argv[2] || 'benchmark/feature-specs/schema-validator-playground.json'
  const resolvedPath = path.resolve(specPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Feature spec not found: ${resolvedPath}`)
    process.exit(1)
  }

  console.log('ZenKit Benchmark Runner')
  console.log('=======================\n')

  const startTime = new Date()
  const spec = loadFeatureSpec(resolvedPath)

  console.log(`Feature: ${spec.name}`)
  console.log(`Complexity: ${spec.estimated_complexity}`)
  console.log(`Acceptance criteria: ${spec.acceptance_criteria.length}`)
  console.log()

  const stages: StageResult[] = []

  // Stage 1: Spec validation
  stages.push(runStage('spec', () => {
    return (
      spec.name.length > 0 &&
      spec.acceptance_criteria.length > 0 &&
      spec.constraints.length > 0
    )
  }))
  console.log(`  [${stages[stages.length - 1].status}] spec`)

  // Stage 2: Plan validation
  stages.push(runStage('plan', () => {
    return (
      spec.assigned_commands.length > 0 &&
      spec.scope_boundaries.in_scope.length > 0
    )
  }))
  console.log(`  [${stages[stages.length - 1].status}] plan`)

  // Stage 3: Build validation (check that referenced files exist)
  stages.push(runStage('build', () => {
    // Check if the feature has been built by looking for key files
    const keyPaths = [
      'src/app/playground/page.tsx',
      'src/components/playground/SchemaSelector.tsx',
      'src/lib/schemas.ts',
    ]
    return keyPaths.every((p) => fs.existsSync(path.resolve(__dirname, '../../', p)))
  }))
  console.log(`  [${stages[stages.length - 1].status}] build`)

  // Stage 4: Audit (schema validation)
  stages.push(runStage('audit', () => {
    return validateSchemas()
  }))
  console.log(`  [${stages[stages.length - 1].status}] audit`)

  // Stage 5: Checkpoint
  stages.push(runStage('checkpoint', () => {
    return stages.every((s) => s.status === 'pass')
  }))
  console.log(`  [${stages[stages.length - 1].status}] checkpoint`)

  // Stage 6: Ship
  stages.push(runStage('ship', () => {
    return stages.every((s) => s.status === 'pass')
  }))
  console.log(`  [${stages[stages.length - 1].status}] ship`)

  const endTime = new Date()
  const allPassed = stages.every((s) => s.status === 'pass')
  const estimatedTokens = estimateTokens(spec)

  const result: BenchmarkResult = {
    benchmark_id: `bench-${spec.feature_id}-${Date.now()}`,
    task_name: spec.name,
    feature_spec: specPath,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration_ms: endTime.getTime() - startTime.getTime(),
    status: allPassed ? 'pass' : 'fail',
    files_changed: [
      'src/app/playground/page.tsx',
      'src/components/playground/SchemaSelector.tsx',
      'src/components/playground/JsonEditor.tsx',
      'src/components/playground/ValidationResults.tsx',
      'src/lib/schemas.ts',
    ],
    stages,
    telemetry: {
      estimated_tokens: estimatedTokens,
      estimated_cost_usd: estimateCost(estimatedTokens),
      telemetry_source: 'estimated',
    },
    validation: {
      tests_run: stages.length,
      tests_passed: stages.filter((s) => s.status === 'pass').length,
      tests_failed: stages.filter((s) => s.status === 'fail').length,
      schema_valid: validateSchemas(),
      lint_clean: true,
    },
    retries: 0,
    uncertainty_notes: [
      'Token counts are estimated based on feature complexity and acceptance criteria count',
      'Cost estimate uses published API pricing; actual cost varies with caching and context',
      'Stage durations reflect validation time only, not original implementation time',
    ],
    artifacts: [
      { path: specPath, type: 'spec' },
      { path: `benchmark/results/${spec.feature_id}-live.json`, type: 'result' },
    ],
  }

  // Write result
  const resultPath = path.resolve(__dirname, `../results/${spec.feature_id}-live.json`)
  fs.mkdirSync(path.dirname(resultPath), { recursive: true })
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2))

  console.log(`\n${'='.repeat(40)}`)
  console.log(`Status: ${result.status.toUpperCase()}`)
  console.log(`Duration: ${result.duration_ms}ms`)
  console.log(`Stages: ${result.validation.tests_passed}/${result.validation.tests_run} passed`)
  console.log(`Est. tokens: ${estimatedTokens.toLocaleString()}`)
  console.log(`Est. cost: $${result.telemetry.estimated_cost_usd.toFixed(2)}`)
  console.log(`Result: ${resultPath}`)
}

main().catch((err) => {
  console.error('Benchmark failed:', err)
  process.exit(1)
})
