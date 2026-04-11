/**
 * CLI script to validate all ZenKit schemas are well-formed.
 * Usage: npx tsx src/lib/validate-schemas.ts
 */
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import fs from 'fs'
import path from 'path'

const schemasDir = path.resolve(__dirname, '../../schemas')
const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const files = fs.readdirSync(schemasDir).filter((f) => f.endsWith('.schema.json'))

let allValid = true

for (const file of files) {
  const filePath = path.join(schemasDir, file)
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  try {
    ajv.compile(schema)
    console.log(`  ✓ ${file}`)
  } catch (err) {
    console.error(`  ✗ ${file}: ${err}`)
    allValid = false
  }
}

if (allValid) {
  console.log(`\nAll ${files.length} schemas are valid.`)
  process.exit(0)
} else {
  console.error('\nSome schemas have errors.')
  process.exit(1)
}
