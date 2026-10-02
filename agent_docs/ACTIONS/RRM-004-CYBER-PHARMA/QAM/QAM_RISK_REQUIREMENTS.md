# QAM Risk and Attack Requirements — RRM-004-CYBER-PHARMA

**Owner:** QA Lead · **Ratified by: QA Lead, 2026-10-01 — approved for Q1 recon and plan drafting with A-14 applied. Q2 requires separate QA Lead approval of the recon-informed test plan.** · **Frozen at:** the Director's Q1 command (amendments afterwards go to the plan at Q1b, or to `../RULINGS_ADDENDUM.md`).

This file is what the QA Executor drafts `QAM_TEST_PLAN.md` *from* in Q1, together with the frozen `../ACCEPTANCE_SPEC.md`, `QAM_MANIFEST.md` and what recon finds. §A is the QA Lead's standing doctrine as applied in RRM-001…003 (carried here so the Director installs no second QA file). §B is the Architect's risk input for this module. §C is the QA Lead's module-specific requirements, filled at ratification (A-14). The Executor's plan must cite which requirement each attack satisfies.

## §A — QA Lead standing requirements (carried from RRM-002/003 test plans and Gate Q records)

1. Engineering output is a claim. Every expected value is derived independently: versions from the registry, installed metadata from the Executor's own `node_modules`, route tables from the Executor's own build, image inventories from source.
2. PASS only for an independently proven literal AC. FAIL for a demonstrated miss. BLOCKED for an unavailable prerequisite (name it). NOT RUN when not attempted (say why). ADJUDICATE when a contract question decides the grade. BLOCKED is never PASS.
3. Entry gate before anything: clean tree, pinned candidate, ancestry, docs-only successor diff. Stop on any product, test, dependency or configuration change after the candidate.
4. Run independent `tsc`, `eslint` and full `jest --ci`; record errors and warnings separately; suites, passed/failed/skipped/pending/todo counts; compare README/TESTING counts to the measured suite.
5. Never reuse the Engineer's `node_modules/` or `.next/`. Fresh installs, fresh builds, in `.next`, with Supabase keys overridden only in the process environment.
6. Served proofs come from the Executor's own build with the standalone static/public copy (`cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public`; precedent RRM-003 A-02); every capture records the HTTP status line; `-I`, never `-X HEAD`.
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

## §C — QA Lead module-specific requirements (ratified 2026-10-01, A-14)

1. **C1 — Priority.** Prioritize dependency identity, native image operation and cache preservation, then complete every remaining contracted AC. Derive expectations independently; engineering measurements remain claims.
2. **C2 — Image and instrument controls.** Exercise the specified local PNG optimizer success, and the remote-host rejection with the required response body. Prove the version/floor instrument rejects deliberately invalid synthetic input, without modifying the product or installed packages.
3. **C3 — Walk coverage.** AC-605 covers the contracted routes for ADMIN and MEMBER at desktop and 375px, in both light and dark themes. Reuse each role's in-memory session across its matrix; log out and dispose of the context afterward. No business-data writes, and no account or configuration changes.
4. **C4 — New advisories.** A new registry advisory is reported with its publication date and the affected installed package, for QA Lead adjudication. Do not silently exempt it or automatically expand repair scope.
5. **C5 — Retest.** After an authorized repair: pin the new candidate, verify the bounded repair diff, then rerun the affected ACs and the full required regression board. Preserve earlier attempt evidence and identify the retest round.
6. **C6 — Authentication authority.** Automated login/logout against the approved main dev target is authorized. No Director manual matrix is expected. Stop for an actual access, scope or instrument blocker under the enumerated rules.
