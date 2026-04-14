import { describe, it, expect } from 'vitest'
import {
  validate,
  getSchema,
  getSchemaNames,
  loadFeatureSpec,
  createHandoff,
  type SchemaName,
  type ValidationResult,
  type Handoff,
} from '../../index'

describe('ZenKit Public API', () => {
  describe('validate', () => {
    it('validates valid handoff data', () => {
      const result = validate('handoff', {
        context: 'Test context',
        assumptions: ['assumption 1'],
        decision: 'Proceed',
        deliverable: { type: 'code', description: 'Test' },
        next_agent: 'qa-test-engineer',
      })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.schemaName).toBe('handoff')
    })

    it('returns errors for invalid data', () => {
      const result = validate('handoff', { broken: true })
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0]).toHaveProperty('path')
      expect(result.errors[0]).toHaveProperty('message')
      expect(result.errors[0]).toHaveProperty('keyword')
    })

    it('handles unknown schema name gracefully', () => {
      const result = validate('nonexistent' as SchemaName, {})
      expect(result.valid).toBe(false)
      expect(result.errors[0].message).toContain('Unknown schema')
    })

    it('validates all schema types', () => {
      const names = getSchemaNames()
      expect(names.length).toBeGreaterThanOrEqual(6)
      for (const name of names) {
        const schema = getSchema(name)
        expect(schema).toBeDefined()
        expect(schema).toHaveProperty('$schema')
      }
    })
  })

  describe('getSchemaNames', () => {
    it('returns all schema names', () => {
      const names = getSchemaNames()
      expect(names).toContain('handoff')
      expect(names).toContain('task')
      expect(names).toContain('audit')
      expect(names).toContain('checkpoint')
      expect(names).toContain('benchmark')
      expect(names).toContain('feature-spec')
    })
  })

  describe('getSchema', () => {
    it('returns a schema object with title and type', () => {
      const schema = getSchema('handoff') as any
      expect(schema.title).toBeDefined()
      expect(schema.type).toBe('object')
      expect(schema.required).toBeDefined()
    })
  })

  describe('loadFeatureSpec', () => {
    it('loads and validates a valid feature spec', () => {
      const spec = loadFeatureSpec('benchmark/feature-specs/schema-validator-playground.json')
      expect(spec.feature_id).toBe('svp-001')
      expect(spec.name).toBeDefined()
      expect(spec.mode).toBe('zenkit')
      expect(spec.acceptance_criteria.length).toBeGreaterThan(0)
      expect(spec.limitations.length).toBeGreaterThan(0)
    })

    it('throws for invalid feature spec', () => {
      // Create a temp invalid spec
      const fs = require('fs')
      const path = require('path')
      const tmpFile = path.join(require('os').tmpdir(), 'zenkit-test-bad-spec.json')
      fs.writeFileSync(tmpFile, JSON.stringify({ name: 'bad' }))
      try {
        expect(() => loadFeatureSpec(tmpFile)).toThrow('Invalid feature spec')
      } finally {
        fs.unlinkSync(tmpFile)
      }
    })

    it('throws for nonexistent file', () => {
      expect(() => loadFeatureSpec('/nonexistent/path.json')).toThrow()
    })
  })

  describe('createHandoff', () => {
    it('creates and returns a valid handoff', () => {
      const handoff: Handoff = {
        context: 'Completed the auth module',
        assumptions: ['Redis available'],
        decision: 'Used JWT with refresh tokens',
        deliverable: {
          type: 'code',
          description: 'Auth module with tests',
          files_changed: ['src/auth.ts'],
          validation_status: 'passed',
        },
        next_agent: 'frontend-architect',
      }
      const result = createHandoff(handoff)
      expect(result).toEqual(handoff)
    })

    it('throws for invalid handoff', () => {
      expect(() => createHandoff({
        context: 'test',
        // missing required fields
      } as any)).toThrow('Invalid handoff')
    })
  })

  describe('type exports', () => {
    it('ValidationResult has expected shape', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        schemaName: 'handoff',
      }
      expect(result.valid).toBe(true)
    })
  })
})
