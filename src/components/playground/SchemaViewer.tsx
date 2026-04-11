'use client'

import { useState } from 'react'

interface SchemaViewerProps {
  schema: object
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-zen-800/60 rounded-lg bg-zen-900/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 border-b border-zen-800/40 flex items-center justify-between hover:bg-zen-800/20 transition-colors"
      >
        <span className="text-xs font-mono text-zen-500">Schema Definition</span>
        <span className="text-xs text-zen-600">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <pre className="p-4 text-xs font-mono text-zen-400 overflow-x-auto max-h-96 leading-relaxed">
          {JSON.stringify(schema, null, 2)}
        </pre>
      )}
    </div>
  )
}
