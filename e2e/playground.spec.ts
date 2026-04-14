import { test, expect } from '@playwright/test'

test.describe('Schema Validator Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground')
    await page.waitForSelector('#schema-select', { timeout: 15000 })
  })

  test('loads with default handoff schema selected', async ({ page }) => {
    await expect(page.locator('#schema-select')).toHaveValue('handoff')
  })

  test('displays pre-loaded example JSON', async ({ page }) => {
    const editor = page.locator('textarea[aria-label="JSON data input"]')
    const value = await editor.inputValue()
    expect(value).toContain('"context"')
    expect(value).toContain('"next_agent"')
  })

  test('validates valid handoff data — shows green Valid indicator', async ({ page }) => {
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-green-400')).toContainText('Valid')
  })

  test('shows errors for invalid JSON', async ({ page }) => {
    const editor = page.locator('textarea[aria-label="JSON data input"]')
    await editor.fill('{ not valid json }')
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-red-400')).toContainText('JSON Parse Error')
  })

  test('shows validation errors for empty object', async ({ page }) => {
    const editor = page.locator('textarea[aria-label="JSON data input"]')
    await editor.fill('{}')
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-red-400')).toContainText('validation error')
  })

  test('switches schema and loads new example', async ({ page }) => {
    await page.selectOption('#schema-select', 'task')
    const editor = page.locator('textarea[aria-label="JSON data input"]')
    const value = await editor.inputValue()
    expect(value).toContain('"command"')
    expect(value).toContain('"status"')
  })

  test('validates task example data — green indicator', async ({ page }) => {
    await page.selectOption('#schema-select', 'task')
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-green-400')).toContainText('Valid')
  })

  test('load example button resets editor and validation', async ({ page }) => {
    const editor = page.locator('textarea[aria-label="JSON data input"]')
    await editor.fill('{"broken": true}')
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-red-400')).toContainText('validation error')

    await page.click('button:has-text("Load Example")')
    await page.click('button:has-text("Validate")')
    await expect(page.locator('.text-green-400')).toContainText('Valid')
  })

  test('schema viewer toggles', async ({ page }) => {
    const toggle = page.locator('button:has-text("Schema Definition")')
    await toggle.click()
    await expect(page.locator('pre').first()).toBeVisible()
    await toggle.click()
    await expect(page.locator('pre').first()).not.toBeVisible()
  })

  test('validates all 6 schemas with example data', async ({ page }) => {
    const schemas = ['handoff', 'task', 'audit', 'checkpoint', 'benchmark', 'feature-spec']
    for (const schema of schemas) {
      await page.selectOption('#schema-select', schema)
      await page.click('button:has-text("Validate")')
      await expect(page.locator('.text-green-400')).toContainText('Valid', { timeout: 5000 })
    }
  })
})

test.describe('Landing Page', () => {
  test('renders hero, benchmark, and self-audit sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Disciplined workflows')
    await expect(page.locator('#benchmark')).toBeVisible()
    await expect(page.getByText('Self-audit, not self-certification')).toBeVisible()
  })

  test('navigates to playground', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/playground"]', { timeout: 10000 })
    await expect(page).toHaveURL('/playground')
    await page.waitForSelector('#schema-select', { timeout: 15000 })
  })
})
