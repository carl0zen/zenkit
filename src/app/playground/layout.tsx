import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schema Validator Playground — ZenKit',
  description: 'Validate JSON data against ZenKit schemas. Interactive client-side validation with Ajv, pre-loaded examples, and detailed error paths.',
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
