export function Footer() {
  return (
    <footer className="py-12 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-zen-600">
          zenkit v0.2.0 — MIT License
        </div>
        <div className="flex items-center gap-6 text-xs text-zen-600">
          <a href="https://github.com/carl0zen/zenkit" className="hover:text-zen-400 transition-colors">
            GitHub
          </a>
          <a href="/playground" className="hover:text-zen-400 transition-colors">
            Playground
          </a>
          <span>Disciplined workflows for coding agents.</span>
        </div>
      </div>
    </footer>
  )
}
