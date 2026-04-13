import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { validateAgainstSchema } from '../schemas'

const ROOT = path.resolve(__dirname, '../../..')

describe('Benchmark Runner', () => {
  describe('feature spec format', () => {
    it('zenkit spec has required fields', () => {
      const spec = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'benchmark/feature-specs/schema-validator-playground.json'), 'utf-8')
      )
      expect(spec.feature_id).toBeDefined()
      expect(spec.name).toBeDefined()
      expect(spec.mode).toBe('zenkit')
      expect(spec.acceptance_criteria.length).toBeGreaterThan(0)
      expect(spec.limitations.length).toBeGreaterThan(0)
      expect(spec.expected_files.length).toBeGreaterThan(0)
    })

    it('baseline spec has required fields and mode=baseline', () => {
      const spec = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'benchmark/feature-specs/schema-validator-baseline.json'), 'utf-8')
      )
      expect(spec.mode).toBe('baseline')
      expect(spec.acceptance_criteria.length).toBeGreaterThan(0)
      expect(spec.limitations.length).toBeGreaterThan(0)
    })

    it('both specs have identical acceptance criteria IDs', () => {
      const zenkit = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'benchmark/feature-specs/schema-validator-playground.json'), 'utf-8')
      )
      const baseline = JSON.parse(
        fs.readFileSync(path.join(ROOT, 'benchmark/feature-specs/schema-validator-baseline.json'), 'utf-8')
      )
      const zenkitIds = zenkit.acceptance_criteria.map((c: any) => c.id).sort()
      const baselineIds = baseline.acceptance_criteria.map((c: any) => c.id).sort()
      expect(zenkitIds).toEqual(baselineIds)
    })
  })

  describe('runner execution', () => {
    it('produces a valid result file when run', () => {
      const result = execSync('npx tsx benchmark/scripts/run.ts', {
        cwd: ROOT,
        encoding: 'utf-8',
        timeout: 30000,
      })

      expect(result).toContain('PASS')
      expect(result).toContain('23/23 passed')
    })

    it('result file validates against benchmark schema', () => {
      const resultPath = path.join(ROOT, 'benchmark/results/svp-001-live.json')
      expect(fs.existsSync(resultPath)).toBe(true)

      const data = JSON.parse(fs.readFileSync(resultPath, 'utf-8'))
      const validation = validateAgainstSchema('benchmark', data)
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
  })

  describe('result structure', () => {
    const resultPath = path.join(ROOT, 'benchmark/results/svp-001-live.json')
    const data = JSON.parse(fs.readFileSync(resultPath, 'utf-8'))

    it('has version and mode', () => {
      expect(data.version).toBe('0.2.0')
      expect(data.mode).toBe('zenkit')
    })

    it('has acceptance criteria results with evidence', () => {
      expect(data.acceptance_criteria_results.length).toBeGreaterThan(0)
      for (const c of data.acceptance_criteria_results) {
        expect(c.id).toBeDefined()
        expect(c.status).toMatch(/^(pass|fail)$/)
        expect(c.evidence).toBeDefined()
        expect(c.evidence.length).toBeGreaterThan(0)
      }
    })

    it('has stages with check counts', () => {
      for (const s of data.stages) {
        expect(s.checks_run).toBeGreaterThanOrEqual(0)
        expect(s.checks_passed).toBeLessThanOrEqual(s.checks_run)
      }
    })

    it('telemetry.actual is null (no instrumentation)', () => {
      expect(data.telemetry.actual).toBeNull()
    })

    it('telemetry.estimated has a basis explaining the heuristic', () => {
      expect(data.telemetry.estimated.basis).toBeDefined()
      expect(data.telemetry.estimated.basis.length).toBeGreaterThan(10)
    })

    it('uncertainty array is non-empty', () => {
      expect(data.uncertainty.length).toBeGreaterThan(0)
    })

    it('limitations array is non-empty', () => {
      expect(data.limitations.length).toBeGreaterThan(0)
    })

    it('files_missing is empty when status is pass', () => {
      if (data.status === 'pass') {
        expect(data.files_missing).toHaveLength(0)
      }
    })
  })

  describe('comparison artifact', () => {
    const compPath = path.join(ROOT, 'benchmark/results/comparison-svp-001.json')

    it('exists', () => {
      expect(fs.existsSync(compPath)).toBe(true)
    })

    it('is labeled as illustrative', () => {
      const data = JSON.parse(fs.readFileSync(compPath, 'utf-8'))
      expect(data.data_source).toBe('illustrative')
    })

    it('has caveats', () => {
      const data = JSON.parse(fs.readFileSync(compPath, 'utf-8'))
      expect(data.caveats.length).toBeGreaterThan(0)
    })
  })
})
