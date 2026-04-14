export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-block mb-6 px-3 py-1 border border-zen-700 rounded-full text-xs font-mono text-zen-400 tracking-wide">
          npx zenkit init claude
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold text-zen-50 leading-tight tracking-tight">
          Disciplined workflows
          <br />
          <span className="text-zen-400">for Claude Code.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zen-400 max-w-2xl mx-auto leading-relaxed">
          Add structured specs, plans, audits, checkpoints, and handoffs to
          any project. One command. Native slash commands and skills. No
          daemon, no framework, no lock-in.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="code-block px-6 py-3 text-sm font-mono text-zen-200">
            npx zenkit init claude
          </div>
          <a
            href="#how-it-works"
            className="px-6 py-3 border border-zen-700 text-zen-300 text-sm font-medium rounded-lg hover:border-zen-500 hover:text-zen-100 transition-colors"
          >
            How it works
          </a>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
    </section>
  )
}
