'use client'

import type { ValidationResult } from '@/lib/schemas'

interface ValidationResultsProps {
  result: ValidationResult | null
  parseError: string | null
}

export function ValidationResults({ result, parseError }: ValidationResultsProps) {
  return (
    <div className="border border-zen-800/60 rounded-lg bg-zen-900/30 overflow-hidden">
      <div className="px-4 py-2 border-b border-zen-800/40">
        <span className="text-xs font-mono text-zen-500">Validation Results</span>
      </div>
      <div className="p-4 min-h-[120px]">
        {parseError && (
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-red-400">JSON Parse Error</div>
              <div className="mt-1 text-xs font-mono text-zen-400">{parseError}</div>
            </div>
          </div>
        )}

        {result && result.valid && (
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-green-400">Valid</div>
              <div className="mt-1 text-xs text-zen-400">
                Data conforms to <code className="text-zen-300 bg-zen-800/50 px-1 rounded">{result.schemaName}.schema.json</code>
              </div>
            </div>
          </div>
        )}

        {result && !result.valid && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-sm font-medium text-red-400">
                {result.errors.length} validation error{result.errors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {result.errors.map((err, i) => (
                <div
                  key={i}
                  className="p-3 bg-zen-800/30 rounded border border-zen-800/40"
                >
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-zen-300">{err.path}</code>
                    <span className="text-xs text-zen-600">({err.keyword})</span>
                  </div>
                  <div className="mt-1 text-xs text-zen-400">{err.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && !parseError && (
          <div className="text-sm text-zen-600 text-center py-8">
            Click &quot;Validate&quot; to check your JSON against the selected schema.
          </div>
        )}
      </div>
    </div>
  )
}
