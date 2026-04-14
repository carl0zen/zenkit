export function Solution() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-zen-800/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-zen-100">
              Native Claude Code integration
            </h2>
            <p className="mt-4 text-zen-400 leading-relaxed">
              ZenKit installs as slash commands and skills that Claude Code
              already supports. No framework to learn. No runtime to manage.
              Just structured discipline added to your existing workflow.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-spec</span>
                <span className="text-sm text-zen-400">Define what to build before building it</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-plan</span>
                <span className="text-sm text-zen-400">Break a spec into tasks with acceptance criteria</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-build</span>
                <span className="text-sm text-zen-400">Implement with documented decisions</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-audit</span>
                <span className="text-sm text-zen-400">Review for correctness, security, alignment</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-checkpoint</span>
                <span className="text-sm text-zen-400">Capture state — what&apos;s validated vs assumed</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zen-500 w-32 flex-shrink-0 pt-0.5">/zenkit-handoff</span>
                <span className="text-sm text-zen-400">Transfer context without losing decisions</span>
              </div>
            </div>
          </div>

          <div className="code-block text-zen-300">
            <div className="text-zen-500 text-xs mb-3 font-mono">terminal</div>
            <pre className="text-sm leading-relaxed">{`$ npx zenkit init claude

ZenKit for Claude Code
======================

  created .claude/commands/zenkit-spec.md
  created .claude/commands/zenkit-plan.md
  created .claude/commands/zenkit-build.md
  created .claude/commands/zenkit-audit.md
  created .claude/commands/zenkit-checkpoint.md
  created .claude/commands/zenkit-handoff.md
  created .claude/skills/zenkit-audit/SKILL.md
  created .claude/skills/zenkit-handoff/SKILL.md
  created .claude/skills/zenkit-checkpoint/SKILL.md
  created CLAUDE.md

Done. Start with: /zenkit-spec "your feature"`}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}
