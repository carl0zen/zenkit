export function OpenSource() {
  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
            Public core, private overlays
          </h2>
          <p className="mt-4 text-zen-400 leading-relaxed">
            ZenKit&apos;s protocol layer is fully open source. Commands, schemas,
            hooks, and rubrics live in your repo alongside your code. Extend
            with private skills, proprietary agent configs, or custom
            benchmarks as needed.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-500 mb-2">Explore</div>
              <p className="text-sm text-zen-300">
                Read the source. Understand the protocol. Try the playground.
              </p>
            </div>
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-500 mb-2">Benchmark</div>
              <p className="text-sm text-zen-300">
                Run a feature through the workflow. See the artifacts. Verify the claims.
              </p>
            </div>
            <div className="p-4 border border-zen-800/60 rounded-lg">
              <div className="font-mono text-xs text-zen-500 mb-2">Extend</div>
              <p className="text-sm text-zen-300">
                Add commands, skills, and agents. Adapt to your stack and team.
              </p>
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
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
