export function Solution() {
  return (
    <section className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
              A thin protocol layer
            </h2>
            <p className="mt-4 text-zen-400 leading-relaxed">
              ZenKit does not replace your agent runtime. It adds structure
              around it. A shared vocabulary of commands, schemas, and contracts
              that make agent workflows predictable, auditable, and repeatable.
            </p>
            <p className="mt-4 text-zen-400 leading-relaxed">
              Every command produces structured output. Every handoff preserves
              context. Every checkpoint records what was validated versus what
              was assumed.
            </p>
          </div>

          <div className="code-block text-zen-300">
            <div className="text-zen-500 text-xs mb-3 font-mono">terminal</div>
            <pre className="text-sm leading-relaxed">{`# Validate a handoff artifact against the schema
$ zenkit validate handoff build-output.json
PASS — build-output.json validates against handoff.schema.json

# Run all benchmark specs (4 specs, 35 criteria, 101 checks)
$ zenkit benchmark:all
  [PASS] Handoff Contract System — 9/9 criteria
  [PASS] Protocol Completeness — 10/10 criteria
  [PASS] Schema Validator Playground — 8/8 criteria
  [PASS] ZenKit Self-Audit — 8/8 criteria
  4/4 passed

# Check project health
$ zenkit status
  OK  commands/ (8 files)
  OK  schemas/ (5 files)
  OK  5 JSON schemas
  OK  CI workflow
  Last benchmark: 4/4 specs passed`}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}
