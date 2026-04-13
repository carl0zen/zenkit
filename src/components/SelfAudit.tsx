export function SelfAudit() {
  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
            Self-audit, not self-certification
          </h2>
          <p className="mt-4 text-zen-400 leading-relaxed">
            ZenKit uses its own benchmark system to audit itself. This is
            structured introspection, not proof of correctness. The claims
            are only as strong as the checks behind them.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-zen-800/60 rounded-lg bg-zen-900/20">
            <div className="font-mono text-sm text-zen-300 mb-3">What self-audit does</div>
            <ul className="space-y-2 text-sm text-zen-400">
              <li>Tests whether ZenKit&apos;s primitives are expressive enough to describe real work</li>
              <li>Produces inspectable evidence — run the benchmark yourself and verify</li>
              <li>Forces the same honesty requirements on ZenKit itself</li>
            </ul>
          </div>
          <div className="p-5 border border-zen-800/60 rounded-lg bg-zen-900/20">
            <div className="font-mono text-sm text-zen-300 mb-3">What self-audit does NOT do</div>
            <ul className="space-y-2 text-sm text-zen-400">
              <li>Does not prove ZenKit is correct — a system can only check what it knows to check</li>
              <li>Does not replace independent inspection</li>
              <li>Does not validate the rubrics themselves</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 border border-zen-800/40 rounded-lg bg-zen-900/10">
          <p className="text-xs text-zen-500 font-mono">
            Safeguards: benchmark checks are verifiable, uncertainty is required (not optional),
            limitations are inherited from specs, illustrative data is labeled, telemetry is
            never fabricated.
          </p>
        </div>
      </div>
    </section>
  )
}
