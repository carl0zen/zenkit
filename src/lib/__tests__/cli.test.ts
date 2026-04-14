import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

const ROOT = path.resolve(__dirname, '../../..')
const CLI = `npx tsx ${path.join(ROOT, 'bin/zenkit.ts')}`

function run(args: string, opts?: { cwd?: string }): string {
  return execSync(`${CLI} ${args}`, {
    cwd: opts?.cwd || ROOT,
    encoding: 'utf-8',
    timeout: 30000,
  })
}

describe('zenkit CLI', () => {
  describe('help', () => {
    it('shows usage information', () => {
      const output = run('help')
      expect(output).toContain('zenkit')
      expect(output).toContain('validate')
      expect(output).toContain('benchmark')
      expect(output).toContain('init')
      expect(output).toContain('status')
    })
  })

  describe('status', () => {
    it('shows project health with all OK', () => {
      const output = run('status')
      expect(output).toContain('OK')
      expect(output).toContain('commands/')
      expect(output).toContain('schemas/')
      expect(output).toContain('4/4 specs passed')
    })
  })

  describe('validate', () => {
    it('passes for valid handoff fixture', () => {
      const output = run('validate handoff benchmark/fixtures/valid-handoff.json')
      expect(output).toContain('PASS')
    })

    it('fails for invalid data', () => {
      const tmpFile = path.join(os.tmpdir(), 'zenkit-test-invalid.json')
      fs.writeFileSync(tmpFile, '{"invalid": true}')
      try {
        run(`validate handoff ${tmpFile}`)
        expect.fail('Should have thrown')
      } catch (err: any) {
        expect(err.stdout || err.stderr || '').toContain('FAIL')
      } finally {
        fs.unlinkSync(tmpFile)
      }
    })

    it('rejects unknown schema name', () => {
      try {
        run('validate nonexistent /tmp/test.json')
        expect.fail('Should have thrown')
      } catch (err: any) {
        expect(err.stdout + err.stderr).toContain('Unknown schema')
      }
    })
  })

  describe('validate:all', () => {
    it('validates all schemas compile', () => {
      const output = run('validate:all')
      expect(output).toContain('All')
      expect(output).toContain('schemas are valid')
    })
  })

  describe('init', () => {
    it('scaffolds ZenKit structure in a temp directory', () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zenkit-init-'))
      try {
        const output = run(`init ${tmpDir}`)
        expect(output).toContain('Initializing ZenKit')

        // Check directories were created
        expect(fs.existsSync(path.join(tmpDir, 'commands'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'schemas'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'skills'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'hooks'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'agents'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'rubrics'))).toBe(true)
        expect(fs.existsSync(path.join(tmpDir, 'benchmark/feature-specs'))).toBe(true)
      } finally {
        fs.rmSync(tmpDir, { recursive: true })
      }
    })
  })
})

describe('Handoff example validation', () => {
  it('landing page handoff example validates against handoff.schema.json', () => {
    // The HandoffExample component defines a handoff inline.
    // We extract it by importing the same data shape and validating.
    const Ajv = require('ajv')
    const addFormats = require('ajv-formats')
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)

    const schema = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'schemas/handoff.schema.json'), 'utf-8')
    )
    const validate = ajv.compile(schema)

    // The handoff from HandoffExample.tsx
    const handoff = {
      context: "Backend architect completed the user profile API endpoint with data validation and error handling.",
      assumptions: [
        "PostgreSQL is the primary datastore",
        "Authentication middleware is already in place",
        "Profile images are stored in object storage, not the database"
      ],
      constraints: [
        "Response time must be under 200ms at p95",
        "No breaking changes to existing /api/v1 endpoints"
      ],
      decision: "Implemented as a new /api/v1/profile resource with GET/PATCH operations. Used existing ORM patterns rather than raw SQL for consistency.",
      deliverable: {
        type: "code",
        description: "Profile API endpoint with validation, tests, and OpenAPI spec",
        files_changed: [
          "src/api/profile.ts",
          "src/api/profile.test.ts",
          "docs/openapi.yaml"
        ],
        validation_status: "passed"
      },
      risks: [
        {
          description: "Profile PATCH allows partial updates — concurrent writes could cause data races",
          severity: "medium",
          mitigation: "Added optimistic locking via updated_at timestamp check"
        }
      ],
      open_questions: [
        "Should profile deletion be soft-delete or hard-delete?",
        "Is rate limiting needed on the PATCH endpoint?"
      ],
      next_agent: "frontend-architect"
    }

    const valid = validate(handoff)
    expect(valid).toBe(true)
  })
})

describe('Feature spec schema validation', () => {
  it('all feature specs validate against feature-spec.schema.json', () => {
    const Ajv = require('ajv')
    const addFormats = require('ajv-formats')
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)

    const schema = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'schemas/feature-spec.schema.json'), 'utf-8')
    )
    const validate = ajv.compile(schema)

    const specsDir = path.join(ROOT, 'benchmark/feature-specs')
    const specs = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'))

    expect(specs.length).toBeGreaterThan(0)
    for (const spec of specs) {
      const data = JSON.parse(fs.readFileSync(path.join(specsDir, spec), 'utf-8'))
      const valid = validate(data)
      if (!valid) {
        console.error(`${spec} validation errors:`, validate.errors)
      }
      expect(valid).toBe(true)
    }
  })
})
