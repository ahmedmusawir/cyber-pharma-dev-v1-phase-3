# QAM Risk and Attack Requirements — RRM-004-CYBER-PHARMA

**Owner:** QA Lead · **Ratified by the QA Lead:** <date, position> · **Frozen at:** the Director's Q1 command (amendments afterwards go to the plan at Q1b, or to `../RULINGS_ADDENDUM.md`).

This file is what the QA Executor drafts `QAM_TEST_PLAN.md` *from* in Q1, together with the frozen `../ACCEPTANCE_SPEC.md`, `QAM_MANIFEST.md` and what recon finds. §A is the QA Lead's standing doctrine as applied in RRM-001…003 (carried here so the Director installs no second QA file). §B is the Architect's risk input for this module. §C is the QA Lead's module-specific requirements — the QA Lead fills or strikes it at ratification. The Executor's plan must cite which requirement each attack satisfies.

## §A — QA Lead standing requirements (carried from RRM-002/003 test plans and Gate Q records)

1. Engineering output is a claim. Every expected value is derived independently: versions from the registry, installed metadata from the Executor's own `node_modules`, route tables from the Executor's own build, image inventories from source.
2. PASS only for an independently proven literal AC. FAIL for a demonstrated miss. BLOCKED for an unavailable prerequisite (name it). NOT RUN when not attempted (say why). ADJUDICATE when a contract question decides the grade. BLOCKED is never PASS.
3. Entry gate before anything: clean tree, pinned candidate, ancestry, docs-only successor diff. Stop on any product, test, dependency or configuration change after the candidate.
4. Run independent `tsc`, `eslint` and full `jest --ci`; record errors and warnings separately; suites, passed/failed/skipped/pending/todo counts; compare README/TESTING counts to the measured suite.
5. Never reuse the Engineer's `node_modules/` or `.next/`. Fresh installs, fresh builds, in `.next`, with Supabase keys overridden only in the process environment.
6. Served proofs come from the Executor's own build with the A-02 static copy; every capture records the HTTP status line; `-I`, never `-X HEAD`.
7. Command exit codes and unfiltered raw output are preserved where practical. Build output and transient server assets stay out of the durable inventory.
8. No credential, token, key value, env value or personal data enters evidence, logs, screenshots, traces or reports. Traces start after login and retain only a sanitized action timeline. No auth state survives a phase.
9. Process-only claims (the Engineer's metrics, preflight tables) are graded as *verified artifact content* vs *unobserved historical execution*, and the matrix says which.
10. Every possible defect gets an ID, AC, steps, expected, actual, evidence path and cause class (implementation / contract gap / environment / instrument / observation). Inherited behavior is not a regression unless a baseline comparison proves it.
11. Recheck HEAD and tree status at the end. Return a recommendation, never a verdict.

## §B — Architect risk input (this module)

1. The one thing a dependency bump can silently undo is RRM-003's cache header — re-capture the pair and all three negative controls from your own build.
2. `/_next/image` is the only place sharp runs in this app. A 500 there with 200 everywhere else is what a broken native binding looks like. Probe it with `Accept: image/webp` and hex-dump the first 16 bytes.
3. Attack the instrument: read `@img/sharp-libvips-<platform>/versions` on **your** platform; if it differs from the Engineer's, that is a second data point, not a mismatch. Deliberately corrupt one derived reference (e.g. compare against a wrong floor) and record the non-zero failure.
4. `npm ci` must accept the committed lockfile without complaint; a lockfile/`package.json` disagreement is a finding.
5. `npm audit` depends on the registry at run time. An advisory published after the candidate is recorded with its date and classified, not failed.
6. The negative host probe passes only on `400` **and** the body `"url" parameter is not allowed` (A-04); a `400` for any other reason is not attributable.
7. Expected images per route come from source (`src/components/global/Navbar*.tsx`, `src/app/(public)/HomePageContent.tsx`), never from the manifest.
8. One sign-in per role per phase — Q1 (QF-16 login/logout) and Q2 (the walk), counted separately (A-13 d). The env file makes an extra one a finding about the driver, not the product.
9. RRM-003's retained driver (`agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/evidence/browser/qa_ac107.cjs`) is a starting point for `AUTOMATION/`, not a requirement; its Enter/Space probe is now QF-10.

## §C — QA Lead module-specific requirements (fill or strike at ratification)

- <risk ranking constraints, e.g. "grade AC-303 and AC-204 before anything else">
- <mandatory negative controls beyond the spec>
- <theme coverage for the image walk: light only / light + dark>
- <retest rule if a repair round happens>
- <anything the Executor must not automate>
