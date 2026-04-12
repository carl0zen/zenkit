import { describe, it, expect } from 'vitest'
import { validateAgainstSchema, getSchemaNames, getSchema, type SchemaName } from '../schemas'
import { exampleData } from '../playground-examples'

describe('Schema Validation', () => {
  describe('getSchemaNames', () => {
    it('returns all schema names', () => {
      const names = getSchemaNames()
      expect(names).toContain('handoff')
      expect(names).toContain('task')
      expect(names).toContain('audit')
      expect(names).toContain('checkpoint')
      expect(names).toContain('benchmark')
      expect(names).toHaveLength(5)
    })
  })

  describe('getSchema', () => {
    it('returns schema object for each name', () => {
      for (const name of getSchemaNames()) {
        const schema = getSchema(name)
        expect(schema).toBeDefined()
        expect(schema).toHaveProperty('$schema')
        expect(schema).toHaveProperty('title')
        expect(schema).toHaveProperty('type', 'object')
      }
    })
  })

  describe('validateAgainstSchema', () => {
    describe('with valid example data', () => {
      const cases: SchemaName[] = ['handoff', 'task', 'audit', 'checkpoint', 'benchmark']
      for (const schemaName of cases) {
        it(`validates ${schemaName} example data successfully`, () => {
          const result = validateAgainstSchema(schemaName, exampleData[schemaName])
          expect(result.valid).toBe(true)
          expect(result.errors).toHaveLength(0)
          expect(result.schemaName).toBe(schemaName)
        })
      }
    })

    describe('with invalid data', () => {
      it('rejects empty object for handoff schema', () => {
        const result = validateAgainstSchema('handoff', {})
        expect(result.valid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })

      it('rejects handoff with missing required fields', () => {
        const result = validateAgainstSchema('handoff', {
          context: 'test',
          // missing: assumptions, decision, deliverable, next_agent
        })
        expect(result.valid).toBe(false)
        const errorPaths = result.errors.map((e) => e.message)
        expect(errorPaths.some((m) => m.includes('required'))).toBe(true)
      })

      it('rejects task with invalid status enum', () => {
        const result = validateAgainstSchema('task', {
          id: 'test-task',
          name: 'Test',
          status: 'invalid_status',
          command: 'build',
        })
        expect(result.valid).toBe(false)
        expect(result.errors.some((e) => e.keyword === 'enum')).toBe(true)
      })

      it('rejects task with invalid command enum', () => {
        const result = validateAgainstSchema('task', {
          id: 'test-task',
          name: 'Test',
          status: 'pending',
          command: 'nonexistent',
        })
        expect(result.valid).toBe(false)
      })

      it('rejects audit with invalid verdict', () => {
        const result = validateAgainstSchema('audit', {
          task_id: 'test',
          auditor: 'test',
          verdict: 'maybe',
          findings: [],
        })
        expect(result.valid).toBe(false)
      })

      it('rejects checkpoint with invalid id pattern', () => {
        const result = validateAgainstSchema('checkpoint', {
          checkpoint_id: 'invalid-no-prefix',
          task_id: 'test',
          status: 'snapshot',
          timestamp: '2026-04-11T10:00:00Z',
        })
        expect(result.valid).toBe(false)
      })

      it('rejects benchmark with missing required fields', () => {
        const result = validateAgainstSchema('benchmark', {
          benchmark_id: 'test',
          task_name: 'Test',
          started_at: '2026-04-11T10:00:00Z',
          completed_at: '2026-04-11T10:01:00Z',
          status: 'pass',
          // missing: version, mode, validation_summary, acceptance_criteria_results
        })
        expect(result.valid).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('validates minimal valid handoff', () => {
        const result = validateAgainstSchema('handoff', {
          context: 'Minimal context',
          assumptions: [],
          decision: 'Proceed',
          deliverable: { type: 'code', description: 'Minimal deliverable' },
          next_agent: 'qa-test-engineer',
        })
        expect(result.valid).toBe(true)
      })

      it('validates task with all optional fields', () => {
        const result = validateAgainstSchema('task', {
          id: 'full-task',
          name: 'Full task with all fields',
          status: 'in_progress',
          command: 'build',
          description: 'A comprehensive task',
          context: 'Testing all fields',
          assumptions: ['assumption 1'],
          constraints: ['constraint 1'],
          acceptance_criteria: ['criterion 1'],
          files_affected: ['file.ts'],
          assigned_agent: 'backend-architect',
          dependencies: ['other-task'],
          metadata: {
            created_at: '2026-04-11T10:00:00Z',
            estimated_tokens: 5000,
          },
        })
        expect(result.valid).toBe(true)
      })
    })
  })
})
