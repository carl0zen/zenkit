import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import handoffSchema from '../../schemas/handoff.schema.json'
import taskSchema from '../../schemas/task.schema.json'
import auditSchema from '../../schemas/audit.schema.json'
import checkpointSchema from '../../schemas/checkpoint.schema.json'
import benchmarkSchema from '../../schemas/benchmark.schema.json'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

export const schemas = {
  handoff: handoffSchema,
  task: taskSchema,
  audit: auditSchema,
  checkpoint: checkpointSchema,
  benchmark: benchmarkSchema,
} as const

export type SchemaName = keyof typeof schemas

const validators = {
  handoff: ajv.compile(handoffSchema),
  task: ajv.compile(taskSchema),
  audit: ajv.compile(auditSchema),
  checkpoint: ajv.compile(checkpointSchema),
  benchmark: ajv.compile(benchmarkSchema),
}

export interface ValidationResult {
  valid: boolean
  errors: Array<{
    path: string
    message: string
    keyword: string
  }>
  schemaName: SchemaName
}

export function validateAgainstSchema(
  schemaName: SchemaName,
  data: unknown
): ValidationResult {
  const validate = validators[schemaName]
  const valid = validate(data) as boolean

  return {
    valid,
    errors: valid
      ? []
      : (validate.errors || []).map((err) => ({
          path: err.instancePath || '/',
          message: err.message || 'Unknown validation error',
          keyword: err.keyword,
        })),
    schemaName,
  }
}

export function getSchemaNames(): SchemaName[] {
  return Object.keys(schemas) as SchemaName[]
}

export function getSchema(name: SchemaName) {
  return schemas[name]
}
