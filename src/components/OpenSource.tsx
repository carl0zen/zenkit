export function OpenSource() {
  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
            Three layers, adopt what you need
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-400 mb-2">Layer 1: Claude Code pack</div>
              <p className="text-sm text-zen-400">
                Slash commands, skills, and CLAUDE.md. One command, zero dependencies.
              </p>
              <div className="mt-3 font-mono text-xs text-zen-500">npx zenkit init claude</div>
            </div>
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-400 mb-2">Layer 2: Protocol + CLI</div>
              <p className="text-sm text-zen-400">
                Schemas, benchmarks, validation engine. For teams that want machine-verifiable workflows.
              </p>
              <div className="mt-3 font-mono text-xs text-zen-500">npm install zenkit</div>
            </div>
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-400 mb-2">Layer 3: MCP server</div>
              <p className="text-sm text-zen-400">
                Dynamic tool calls for validate, benchmark, and checkpoint. Coming soon.
              </p>
              <div className="mt-3 font-mono text-xs text-zen-600">planned</div>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="https://github.com/carl0zen/zenkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zen-100 text-zen-950 text-sm font-medium rounded-lg hover:bg-white transition-colors"
            >
              View on GitHub
              <span className="text-lg">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
