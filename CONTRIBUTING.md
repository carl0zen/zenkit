# Contributing to ZenKit

## Setup

```bash
git clone https://github.com/carl0zen/zenkit.git
cd zenkit
npm install
npx playwright install chromium  # for E2E tests
```

## Verify everything works

```bash
npm test                     # 42 unit tests
npm run lint                 # ESLint
npm run validate:schemas     # 6 JSON schemas
npm run benchmark:all        # 5 feature specs, 109+ checks
npm run build                # Next.js production build
npm run test:e2e             # 12 Playwright browser tests
```

## Adding protocol artifacts

**New command:** Copy `templates/command.template.md` to `commands/`. Follow the compressed format used by existing commands.

**New skill:** Copy `templates/skill.template.md` to `skills/`.

**New agent:** Copy `templates/agent.template.md` to `agents/`.

**New schema:** Add `schemas/your-name.schema.json`, register in `src/lib/schemas.ts`, add example data in `src/lib/playground-examples.ts`. Run `npm run validate:schemas` to verify.

## Adding benchmark specs

1. Create `benchmark/feature-specs/your-feature.json` following the `feature-spec.schema.json` format.
2. Include at least one `limitations` entry — specs must be honest about what they don't verify.
3. Run `npm run benchmark your-spec.json` to test it.
4. Commit the spec. Live results are gitignored — they regenerate on each run.

### Verification types available

| Type | What it checks |
|------|---------------|
| `file_exists` | File is present |
| `file_contains` | File contains a string pattern |
| `schema_count` | Expected number of schemas compile |
| `examples_valid` | Fixture data validates against schemas |
| `schemas_consistent` | All schemas use the same draft |
| `test_passes` | Shell command exits with code 0 |
| `json_path_equals` | JSON file path equals expected value |

## PR expectations

- Tests pass (`npm test`)
- Lint clean (`npm run lint`)
- Benchmarks pass (`npm run benchmark:all`)
- Build succeeds (`npm run build`)
- No fabricated telemetry or claims — estimated data must be labeled
- Uncertainty and limitations declared where applicable

## Design principles

Keep it thin. If your change adds a major subsystem, a runtime dependency, or theatrical agent language, reconsider. See [docs/philosophy.md](docs/philosophy.md).
