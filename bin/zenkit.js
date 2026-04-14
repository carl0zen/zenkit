#!/usr/bin/env node

/**
 * ZenKit CLI wrapper
 *
 * When installed from npm, this runs the compiled CLI.
 * During development, use `npx tsx bin/zenkit.ts` directly.
 */

// Try compiled version first (npm install), fall back to tsx (development)
try {
  require('../dist/cli.js')
} catch {
  const { execSync } = require('child_process')
  const args = process.argv.slice(2).join(' ')
  try {
    execSync(`npx tsx ${__dirname}/zenkit.ts ${args}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
  } catch (err) {
    process.exit(err.status || 1)
  }
}
