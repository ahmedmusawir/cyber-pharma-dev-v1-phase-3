# RETROSPECTIVE — BIM-000-CYBER-PHARMA
## Stage Prep & Hygiene · Engineer close, 2026-08-13

> What fought back, what the next module should know.

---

## What fought back

1. **The sass removal fought hardest.** `npm uninstall sass` removed the direct dep but
   npm left `sass@1.77.8` installed and lock-pinned as **next's optional peer**
   (`peerOptional sass@"^1.3.0" from next@16.2.12`). `npm ls sass` therefore stayed
   non-empty and G1 was red. Resolution: surgically deleted the `node_modules/sass` node
   from package-lock.json (optional peers may legitimately be absent), removed the
   installed copy, and let `npm ci` (full clean reinstall, 832 packages, 0 vulns) prove
   the lockfile consistent. **Lesson for future dep removals:** `npm uninstall` is not
   sufficient when a framework declares the package as an optional peer — always verify
   with `npm ls <pkg>` afterward, not just package.json.

2. **The V10 numbered-color predicate is a mirage.** It reproduces exactly (5 hits) but
   4 hits are `tran**slate**-`/`**slide**-` substring matches and the 5th is the
   globals.css comment that *bans* numbered colors. Real numbered-color utility count: 0.
   Gate G8 passes as written; predicate untouched per R4. **The campaign map's SP-close
   predicate should be rebuilt before it's used as a completion gate** — as written it
   can never reach 0 (the comment alone keeps it ≥1), so an SP-close gate of "0" would
   deadlock, and a gate of "unchanged" measures nothing real.

3. **Environment quirk:** this machine's `grep` is ugrep — BRE escapes (`\|`, `\{2,3\}`)
   behave differently than GNU grep, which initially made the numbered-color baseline
   unreproducible (got 0 and 1 where recon said 5). Recovered the recon's original
   command from the session transcript to reproduce it exactly. **Predicates in future
   managers should embed the exact command string, not a prose description.**

## Flags raised at launch (Coordinator-facing, still open)

- **FLAG-1:** `PHASE_3_CAMPAIGN_JOURNAL.md` claimed "live" in manager §1 — not on disk.
  These friction notes are homeless until it exists.
- **FLAG-3:** `src/instrumentation.ts:5` comment cites `.env.local.example`; actual file
  is `.env.example`. One-word comment fix for any module with src write access.
- **FLAG-4:** `agent_docs/recon/` → `RECON/` rename: RECOVERY.md pointer fixed at this
  close; session_2026-08-11.md still cites lowercase (left as historical record).

## What went smoothly

- All T1–T4 pre-verification facts held at fresh HEAD — the recon (2 days old) had zero
  drift against disk. Ground was as verified.
- Triad landed identical pre/post (build 22 routes, tsc clean, 26/120/0) — the removals
  were provably inert at runtime, which is the whole thesis of a hygiene module.
- `.env.example` parity closed exactly on AC3's 5-var list; the full-sweep grep found no
  hidden consumer in next.config/proxy/instrumentation beyond the list.

## Process friction (for the campaign journal, when it exists)

- Small mid-flight harness interruption (Operator switched permission modes) — no state
  lost; session file was already ahead of the CLI per Disaster Recovery protocol.
- `temp/` is now an empty directory; deleting the dir itself was not in scope. One-line
  Coordinator decision at commit time.
