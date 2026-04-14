import Link from 'next/link'

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zen-800/50 bg-zen-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium text-zen-300 tracking-wider">
          zenkit
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-sm text-zen-400">
          <a href="#primitives" className="hidden sm:inline hover:text-zen-200 transition-colors">Primitives</a>
          <a href="#benchmark" className="hidden sm:inline hover:text-zen-200 transition-colors">Benchmark</a>
          <Link href="/playground" className="hover:text-zen-200 transition-colors">Playground</Link>
          <a
            href="https://github.com/carl0zen/zenkit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zen-300 hover:text-zen-100 transition-colors font-mono"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
