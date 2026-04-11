'use client'

import { useState, useCallback } from 'react'
import { SchemaSelector } from '@/components/playground/SchemaSelector'
import { JsonEditor } from '@/components/playground/JsonEditor'
import { ValidationResults } from '@/components/playground/ValidationResults'
import { SchemaViewer } from '@/components/playground/SchemaViewer'
import { validateAgainstSchema, getSchema, type SchemaName, type ValidationResult } from '@/lib/schemas'
import { exampleData } from '@/lib/playground-examples'

export default function PlaygroundPage() {
  const [selectedSchema, setSelectedSchema] = useState<SchemaName>('handoff')
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(exampleData.handoff, null, 2)
  )
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const handleSchemaChange = useCallback((schema: SchemaName) => {
    setSelectedSchema(schema)
    setJsonInput(JSON.stringify(exampleData[schema], null, 2))
    setResult(null)
    setParseError(null)
  }, [])

  const handleValidate = useCallback(() => {
    setParseError(null)
    try {
      const data = JSON.parse(jsonInput)
      const validationResult = validateAgainstSchema(selectedSchema, data)
      setResult(validationResult)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON')
      setResult(null)
    }
  }, [jsonInput, selectedSchema])

  const handleLoadExample = useCallback(() => {
    setJsonInput(JSON.stringify(exampleData[selectedSchema], null, 2))
    setResult(null)
    setParseError(null)
  }, [selectedSchema])

  return (
    <div className="min-h-screen bg-zen-950">
      {/* Header */}
      <header className="border-b border-zen-800/50 bg-zen-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="font-mono text-sm text-zen-400 hover:text-zen-200 transition-colors">
              zenkit
            </a>
            <span className="text-zen-700">/</span>
            <span className="font-mono text-sm text-zen-200">playground</span>
          </div>
          <div className="text-xs text-zen-500 font-mono">
            Schema Validator
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zen-100">
            Schema Validator Playground
          </h1>
          <p className="mt-2 text-sm text-zen-400">
            Validate JSON data against ZenKit schemas. Select a schema, edit the
            JSON, and run validation to see detailed results.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <SchemaSelector
            selected={selectedSchema}
            onChange={handleSchemaChange}
          />
          <button
            onClick={handleValidate}
            className="px-4 py-2 bg-zen-100 text-zen-950 text-sm font-medium rounded-lg hover:bg-white transition-colors"
          >
            Validate
          </button>
          <button
            onClick={handleLoadExample}
            className="px-4 py-2 border border-zen-700 text-zen-300 text-sm rounded-lg hover:border-zen-500 hover:text-zen-100 transition-colors"
          >
            Load Example
          </button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="space-y-4">
            <JsonEditor
              value={jsonInput}
              onChange={(val) => {
                setJsonInput(val)
                setResult(null)
                setParseError(null)
              }}
            />
          </div>

          {/* Right: Results + Schema */}
          <div className="space-y-4">
            <ValidationResults
              result={result}
              parseError={parseError}
            />
            <SchemaViewer schema={getSchema(selectedSchema)} />
          </div>
        </div>
      </div>
    </div>
  )
}
