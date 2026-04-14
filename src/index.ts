/**
 * ZenKit — Programmatic API
 *
 * Usage:
 *   import { validate, schemas, loadFeatureSpec } from 'zenkit'
 *
 *   const result = validate('handoff', myData)
 *   if (!result.valid) console.error(result.errors)
 */
import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// --- Schema Loading ---

import handoffSchema from '../schemas/handoff.schema.json'
import taskSchema from '../schemas/task.schema.json'
import auditSchema from '../schemas/audit.schema.json'
import checkpointSchema from '../schemas/checkpoint.schema.json'
import benchmarkSchema from '../schemas/benchmark.schema.json'
import featureSpecSchema from '../schemas/feature-spec.schema.json'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

export const schemas = {
  handoff: handoffSchema,
  task: taskSchema,
  audit: auditSchema,
  checkpoint: checkpointSchema,
  benchmark: benchmarkSchema,
  'feature-spec': featureSpecSchema,
} as const

export type SchemaName = keyof typeof schemas

const validators: Record<SchemaName, ReturnType<typeof ajv.compile>> = {
  handoff: ajv.compile(handoffSchema),
  task: ajv.compile(taskSchema),
  audit: ajv.compile(auditSchema),
  checkpoint: ajv.compile(checkpointSchema),
  benchmark: ajv.compile(benchmarkSchema),
  'feature-spec': ajv.compile(featureSpecSchema),
}

// --- Validation ---

export interface ValidationError {
  path: string
  message: string
  keyword: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  schemaName: SchemaName
}

/**
 * Validate data against a named ZenKit schema.
 *
 * @example
 * const result = validate('handoff', { context: '...', ... })
 * if (!result.valid) console.error(result.errors)
 */
export function validate(schemaName: SchemaName, data: unknown): ValidationResult {
  const validator = validators[schemaName]
  if (!validator) {
    return {
      valid: false,
      errors: [{ path: '/', message: `Unknown schema: ${schemaName}`, keyword: 'schema' }],
      schemaName,
    }
  }

  const valid = validator(data) as boolean
  return {
    valid,
    errors: valid
      ? []
      : (validator.errors || []).map((err) => ({
          path: err.instancePath || '/',
          message: err.message || 'Unknown validation error',
          keyword: err.keyword,
        })),
    schemaName,
  }
}

/**
 * Get the raw JSON Schema object for a named schema.
 */
export function getSchema(name: SchemaName): object {
  return schemas[name]
}

/**
 * List all available schema names.
 */
export function getSchemaNames(): SchemaName[] {
  return Object.keys(schemas) as SchemaName[]
}

// --- Feature Spec Loading ---

export interface Verification {
  type: string
  path?: string
  pattern?: string
  expected?: number
  command?: string
  json_path?: string
  equals?: unknown
}

export interface AcceptanceCriterion {
  id: string
  description: string
  verification: Verification
}

export interface FeatureSpec {
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

/**
 * Load and validate a feature spec from a JSON file.
 * Returns the parsed spec if valid, throws if invalid.
 */
export function loadFeatureSpec(specPath: string): FeatureSpec {
  const resolved = path.resolve(specPath)
  const raw = fs.readFileSync(resolved, 'utf-8')
  const data = JSON.parse(raw)

  const result = validate('feature-spec', data)
  if (!result.valid) {
    const errorMsg = result.errors.map(e => `${e.path}: ${e.message}`).join(', ')
    throw new Error(`Invalid feature spec: ${errorMsg}`)
  }

  return data as FeatureSpec
}

// --- Handoff Helpers ---

export interface Deliverable {
  type: 'code' | 'document' | 'schema' | 'plan' | 'review' | 'test' | 'artifact'
  description: string
  files_changed?: string[]
  validation_status?: 'passed' | 'failed' | 'partial' | 'untested'
}

export interface Risk {
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  mitigation?: string
}

export interface Handoff {
  context: string
  assumptions: string[]
  constraints?: string[]
  decision: string
  deliverable: Deliverable
  risks?: Risk[]
  open_questions?: string[]
  next_agent: string
  metadata?: {
    timestamp?: string
    source_agent?: string
    command?: string
    iteration?: number
  }
}

/**
 * Create and validate a handoff object.
 * Returns the handoff if valid, throws if invalid.
 */
export function createHandoff(handoff: Handoff): Handoff {
  const result = validate('handoff', handoff)
  if (!result.valid) {
    const errorMsg = result.errors.map(e => `${e.path}: ${e.message}`).join(', ')
    throw new Error(`Invalid handoff: ${errorMsg}`)
  }
  return handoff
}

// --- Re-exports for backwards compatibility ---

/** @deprecated Use `validate` instead */
export const validateAgainstSchema = validate
