'use client'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  return (
    <div className="border border-zen-800/60 rounded-lg bg-zen-900/30 overflow-hidden">
      <div className="px-4 py-2 border-b border-zen-800/40 flex items-center justify-between">
        <span className="text-xs font-mono text-zen-500">JSON Input</span>
        <span className="text-xs text-zen-600">
          {value.split('\n').length} lines
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 bg-transparent text-zen-200 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
        spellCheck={false}
        aria-label="JSON data input"
        placeholder='{"key": "value"}'
      />
    </div>
  )
}
