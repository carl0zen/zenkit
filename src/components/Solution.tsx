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
            <div className="text-zen-500 text-xs mb-3 font-mono">workflow.ts</div>
            <pre className="text-sm leading-relaxed">{`// ZenKit workflow: spec → plan → build → audit → ship
const feature = await zenkit.spec({
  name: "user-profile-page",
  acceptance: ["renders profile data", "handles loading state"],
});

const plan = await zenkit.plan({ spec: feature });
const build = await zenkit.build({ plan });
const audit = await zenkit.audit({ build });

// Checkpoint: explicit gate before shipping
await zenkit.checkpoint({
  stage: "pre-ship",
  gates: [
    { condition: "tests pass", met: audit.tests_passing },
    { condition: "no critical findings", met: audit.critical === 0 },
  ],
});

await zenkit.ship({ audit });`}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}
