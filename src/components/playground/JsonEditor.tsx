'use client'

import { useRef, useCallback } from 'react'

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const lines = value.split('\n')
  const lineCount = lines.length

  const handleScroll = useCallback(() => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab inserts 2 spaces instead of moving focus
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      // Restore cursor position after React re-renders
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }, [value, onChange])

  return (
    <div className="border border-zen-800/60 rounded-lg bg-zen-900/30 overflow-hidden">
      <div className="px-4 py-2 border-b border-zen-800/40 flex items-center justify-between">
        <span className="text-xs font-mono text-zen-500">JSON Input</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              try {
                const formatted = JSON.stringify(JSON.parse(value), null, 2)
                onChange(formatted)
              } catch { /* ignore parse errors */ }
            }}
            className="text-xs text-zen-600 hover:text-zen-400 transition-colors font-mono"
          >
            format
          </button>
          <span className="text-xs text-zen-600">{lineCount} lines</span>
        </div>
      </div>
      <div className="flex h-96">
        {/* Line numbers gutter */}
        <div
          ref={gutterRef}
          className="flex-shrink-0 overflow-hidden select-none py-4 pr-2 text-right"
          style={{ width: '3rem' }}
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-xs font-mono text-zen-700 leading-relaxed px-2"
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="flex-1 h-full bg-transparent text-zen-200 font-mono text-sm py-4 pr-4 resize-none focus:outline-none leading-relaxed border-l border-zen-800/30"
          spellCheck={false}
          aria-label="JSON data input"
          placeholder='{"key": "value"}'
        />
      </div>
    </div>
  )
}
