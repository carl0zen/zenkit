/**
 * ZenKit CLI — compilable entry point
 *
 * This is the CLI that gets compiled to dist/cli.js for npm distribution.
 * During development, bin/zenkit.ts is used directly via tsx.
 */
import { validate, getSchemaNames, loadFeatureSpec, type SchemaName } from './index'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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

const ROOT = findRoot()

function run(cmd: string) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 60000 })
  } catch {
    process.exit(1)
  }
}

function doValidate() {
  const schemaName = args[1] as SchemaName
  const filePath = args[2]

  if (!schemaName || !filePath) {
    console.error('Usage: zenkit validate <schema> <file>')
    console.error(`Schemas: ${getSchemaNames().join(', ')}`)
    process.exit(1)
  }

  if (!getSchemaNames().includes(schemaName)) {
    console.error(`Unknown schema: ${schemaName}`)
    console.error(`Available: ${getSchemaNames().join(', ')}`)
    process.exit(1)
  }

  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`)
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(resolved, 'utf-8'))
  const result = validate(schemaName, data)

  if (result.valid) {
    console.log(`PASS — ${filePath} validates against ${schemaName}.schema.json`)
  } else {
    console.log(`FAIL — ${filePath} has ${result.errors.length} error(s):`)
    for (const err of result.errors) {
      console.log(`  ${err.path}: ${err.message}`)
    }
    process.exit(1)
  }
}

function status() {
  console.log('ZenKit Project Status')
  console.log('=====================\n')

  const checks: [string, boolean][] = []
  const dirs = ['commands', 'schemas', 'skills', 'hooks', 'agents', 'rubrics']
  for (const dir of dirs) {
    const full = path.join(ROOT, dir)
    const exists = fs.existsSync(full)
    const count = exists ? fs.readdirSync(full).filter(f => !f.startsWith('.')).length : 0
    checks.push([`${dir}/ (${count} files)`, exists && count > 0])
  }

  const schemasDir = path.join(ROOT, 'schemas')
  if (fs.existsSync(schemasDir)) {
    const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'))
    checks.push([`${schemaFiles.length} JSON schemas`, schemaFiles.length > 0])
  }

  const specsDir = path.join(ROOT, 'benchmark/feature-specs')
  if (fs.existsSync(specsDir)) {
    const specs = fs.readdirSync(specsDir).filter(f => f.endsWith('.json') && !f.includes('baseline'))
    checks.push([`${specs.length} benchmark specs`, specs.length > 0])
  }

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

function findPackageTemplates(): string {
  // Find the zenkit package's template directory
  const candidates = [
    path.join(__dirname, '..', 'templates', 'claude'), // compiled (dist/)
    path.join(__dirname, '..', '..', 'templates', 'claude'), // development
    path.join(ROOT, 'templates', 'claude'), // local repo
    path.join(ROOT, 'node_modules', 'zenkit', 'templates', 'claude'), // npm installed
  ]
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  return ''
}

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath)
        console.log(`  created ${path.relative(args[1] === 'claude' ? (args[2] || process.cwd()) : (args[1] || process.cwd()), destPath)}`)
      } else {
        console.log(`  exists  ${path.relative(args[1] === 'claude' ? (args[2] || process.cwd()) : (args[1] || process.cwd()), destPath)}`)
      }
    }
  }
}

function initClaude() {
  const targetDir = args[2] ? path.resolve(args[2]) : process.cwd()
  const templateDir = findPackageTemplates()

  console.log('ZenKit for Claude Code')
  console.log('======================\n')

  if (!templateDir) {
    console.error('Could not find Claude Code templates. Make sure zenkit is installed.')
    process.exit(1)
  }

  // Copy .claude directory
  const claudeSrc = path.join(templateDir, '.claude')
  const claudeDest = path.join(targetDir, '.claude')
  if (fs.existsSync(claudeSrc)) {
    copyDirRecursive(claudeSrc, claudeDest)
  }

  // Generate CLAUDE.md (append if exists, create if not)
  const claudeMdSrc = path.join(templateDir, 'CLAUDE.md')
  const claudeMdDest = path.join(targetDir, 'CLAUDE.md')
  if (fs.existsSync(claudeMdSrc)) {
    const content = fs.readFileSync(claudeMdSrc, 'utf-8')
    if (fs.existsSync(claudeMdDest)) {
      const existing = fs.readFileSync(claudeMdDest, 'utf-8')
      if (!existing.includes('ZenKit Workflow Discipline')) {
        fs.appendFileSync(claudeMdDest, '\n\n' + content)
        console.log('  appended ZenKit section to CLAUDE.md')
      } else {
        console.log('  exists  CLAUDE.md (already has ZenKit section)')
      }
    } else {
      fs.copyFileSync(claudeMdSrc, claudeMdDest)
      console.log('  created CLAUDE.md')
    }
  }

  console.log(`
Done. ZenKit is now available in Claude Code.

Commands (use as /slash-commands):
  /zenkit-spec        Write a feature specification
  /zenkit-plan        Create an implementation plan
  /zenkit-build       Implement from a plan
  /zenkit-audit       Review changes for quality
  /zenkit-checkpoint  Capture current state
  /zenkit-handoff     Produce a context transfer

Skills (activated automatically):
  zenkit-audit        Structured code review with rubrics
  zenkit-handoff      Context-preserving handoff documents
  zenkit-checkpoint   State snapshots with validated/assumed distinction

Start with: /zenkit-spec "your feature description"`)
}

function init() {
  if (args[1] === 'claude') {
    initClaude()
    return
  }

  const targetDir = args[1] ? path.resolve(args[1]) : process.cwd()
  const dirs = ['commands', 'schemas', 'skills', 'hooks', 'agents', 'rubrics', 'templates', 'benchmark/feature-specs', 'benchmark/results']

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

  console.log('\nZenKit structure initialized.')
  console.log('Next: add schemas, commands, and feature specs.')
  console.log('\nFor Claude Code integration instead, run: zenkit init claude')
}

// Dispatch
switch (command) {
  case 'validate':
    if (args[1] === ':all' || args[1] === 'all') {
      run('npx tsx src/lib/validate-schemas.ts')
    } else {
      doValidate()
    }
    break
  case 'validate:all':
    run('npx tsx src/lib/validate-schemas.ts')
    break
  case 'benchmark':
    run(`npx tsx benchmark/scripts/run.ts ${args[1] || ''}`)
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
    run('npx tsx benchmark/scripts/run-all.ts')
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
  init claude [dir]           Install Claude Code commands + skills + CLAUDE.md
  init [dir]                 Scaffold full ZenKit protocol structure
  status                     Show project ZenKit status

Schemas: ${getSchemaNames().join(', ')}`)
    break
  default:
    console.error(`Unknown command: ${command}`)
    console.error('Run "zenkit help" for usage.')
    process.exit(1)
}
