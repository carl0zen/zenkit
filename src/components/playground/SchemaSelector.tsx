'use client'

import { getSchemaNames, type SchemaName } from '@/lib/schemas'

interface SchemaSelectorProps {
  selected: SchemaName
  onChange: (schema: SchemaName) => void
}

export function SchemaSelector({ selected, onChange }: SchemaSelectorProps) {
  const schemas = getSchemaNames()

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-mono text-zen-500" htmlFor="schema-select">
        Schema:
      </label>
      <select
        id="schema-select"
        value={selected}
        onChange={(e) => onChange(e.target.value as SchemaName)}
        className="bg-zen-900 border border-zen-700 text-zen-200 text-sm rounded-lg px-3 py-2 font-mono focus:border-zen-500 focus:outline-none focus:ring-1 focus:ring-zen-500"
      >
        {schemas.map((name) => (
          <option key={name} value={name}>
            {name}.schema.json
          </option>
        ))}
      </select>
    </div>
  )
}
