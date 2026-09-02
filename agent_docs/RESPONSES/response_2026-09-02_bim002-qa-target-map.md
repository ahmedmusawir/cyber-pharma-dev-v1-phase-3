# BIM-002 — QA TARGET MAP (information-only, for QA Lead Sol)
**Date:** 2026-09-02 · **Requested by:** Director, on Sol's behalf, before PRE-Q authorization
**Posture:** INFORMATION ONLY. No files modified beyond this response artifact · no tests rerun · no database reset · no env var changed · no git or cloud operation performed.
**Credential discipline:** no value, URL-with-credential, password, key, token, or connection string appears anywhere below. Projects are identified by **project ref** (a public identifier that appears in a Supabase project's URL) and by pooler host region. Env variables are named, never resolved.

---

## 1. SCRATCH TARGET

**YES.** The primary BIM-002 scratch database for X0–X5 is the project represented in `.env.local` by the older/fallback-style variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `PROTO06_DB_URL`

| Field | Value |
|---|---|
| Safe logical label | **SCRATCH** — "the Proto 06 rig throwaway" |
| Project ref | `jmzwhgnyunwssamrqyhp` |
| Pooler host region | `aws-1-us-west-1` (aws-**1** generation; the aws-0 generation does not resolve this tenant) |
| Lineage | Originally BIM-001's scratch project → reused as the Proto 06 rig database → reused as BIM-002's scratch under **Amendment A-1** |
| Authority | Manager Amendment A-1 (Director, 2026-09-01) directed `PROTO06_DB_URL` for X0–X5 |

Verified at X6 recon: this project's DB-URL ref and API-URL ref agree, and it is a **different project** from the replica — asserted mechanically before any destructive statement was issued.

## 2. REPLICA TARGET

**YES.** The second disposable database used for X6 is the project represented by `RLS_REPLICA_DB_URL`, `RLS_REPLICA_SUPABASE_URL`, `RLS_REPLICA_PUBLISHABLE_KEY`, `RLS_REPLICA_SECRET_KEY`.

| Field | Value |
|---|---|
| Safe logical label | **REPLICA** — "the clean-replica throwaway" |
| Project ref | `ihgcsrypblqkwommrkgj` |
| Pooler host region | `aws-1-ap-south-1` |
| Lineage | BIM-001's X2 replica throwaway, re-used at the Director's suggestion |
| Authority | Director ruling 2026-09-01 adopting harness option (a): replica keys carry the `RLS_REPLICA_` prefix |

## 3. GATE → TARGET MAP

| Gate | Target | What ran there |
|---|---|---|
| **X0** | **SCRATCH** | wipe (F-6 order) → chain `0001–0015` → `pg_catalog` recon; tenant-key + index confirmation |
| **X1** | **SCRATCH** | helpers `0016` applied; AC8 shape/grant assertions |
| **X2** | **SCRATCH** | 100,000-row A/B seed; formulations A/B/C EXPLAIN; shield test; residue cleaned |
| **X3** | **SCRATCH** | 11 policy migrations `0017–0027` landed red→green; policy-check after each |
| **X4** | **SCRATCH** | 320-cell matrix · row scoping · 28-case attack battery · R-C revocation |
| **X5** | **SCRATCH** | `npm run rls:prove` **twice** from empty |
| **X6** | **REPLICA** *(+ read-only assertion on SCRATCH)* | wipe → bootstrap → catalog match vs `DB_BASELINE.md` → chain `0001–0027` → full pipeline. **SCRATCH was read-only-queried once** to evidence it stayed untouched (policy count 18) — no writes |
| **X7** | **NO DATABASE** *(+ read-only catalog read on **BOTH**)* | build · tsc · jest · `git diff` on types · greps — all local. The `storage.objects` policy-count check was a **read-only** catalog read against both targets |

**Neither X0–X7 nor any BIM-002 evidence file involved the dev backend.** See §7.

## 4. CURRENT POST-ENGINEERING STATE

⚠️ **Method note, stated plainly:** this section describes the state **as left by the last engineering run, per evidence**. Because this request is information-only, I did **not** re-connect to either database to re-verify it this session. If Sol wants live confirmation before PRE-Q, say so and I will run read-only catalog reads only.

### SCRATCH — `jmzwhgnyunwssamrqyhp`

| Question | Answer |
|---|---|
| Complete BIM-002 post-chain state through `0027`? | **YES** — last written by X5 run 2 (`rls:prove`), which applies the full chain. Evidenced afterwards at X6 as 16 tables / **18 policies** / 4 helpers |
| Engineering seed/test data present? | **YES** — the seeded cast (4 auth identities: ownerA, staffA, ownerB, multiStore), 2 accounts, 3 stores, 6 junction rows, **600 `user_data` rows**, plus one row in every remaining table so that a `DENY` verdict is never vacuous |
| Explicitly disposable, safe for QA to wipe/reset? | **YES** — disposable throwaway by Director ruling since Proto 06; holds only synthetic data. **Nothing in it is a deliverable**; the deliverables are the migrations, the harness, and the evidence files in the repo |

### REPLICA — `ihgcsrypblqkwommrkgj`

| Question | Answer |
|---|---|
| Complete BIM-002 post-chain state through `0027`? | **YES** — X6 ran the full `rls:prove` pipeline against it |
| Engineering seed/test data present? | **YES** — same seeded cast and data shape as SCRATCH (the seed is deterministic; only generated ids differ) |
| Explicitly disposable, safe for QA to wipe/reset? | **YES** — disposable throwaway; it was itself wiped from a dirty 16-table state at the start of X6 |

## 5. HARNESS TARGET SELECTION

The harness resolves credentials through `loadEnv(prefix)`; the prefix comes from `RLS_HARNESS_PREFIX`, defaulting to `RLS_HARNESS_`. For each logical name (`DB_URL`, `SUPABASE_URL`, `PUBLISHABLE_KEY`, `SECRET_KEY`) it prefers `<PREFIX><logical>` and falls back to the Amendment A-1 names only when the prefixed key is absent.

| Target | How QA selects it |
|---|---|
| **SCRATCH** | **Run with no prefix override** — e.g. `npm run rls:prove`. The default prefix `RLS_HARNESS_` matches nothing on disk, so all four logical names fall through to the A-1 set |
| **REPLICA** | **`RLS_HARNESS_PREFIX=RLS_REPLICA_ npm run rls:prove`** — all four `RLS_REPLICA_*` keys are present, so no fallback occurs |

**Explicit clarification as asked: YES — SCRATCH currently relies on the Amendment A-1 fallback names, not an `RLS_HARNESS_*` set. No `RLS_HARNESS_*` keys exist in `.env.local`.** Key names on disk today: `PROTO06_DB_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (SCRATCH, via fallback) and `RLS_REPLICA_DB_URL`, `RLS_REPLICA_SUPABASE_URL`, `RLS_REPLICA_PUBLISHABLE_KEY`, `RLS_REPLICA_SECRET_KEY` (REPLICA, explicit).

**Self-identifying signal for QA:** when the fallback is in use the harness prints `[env] A-1 fallback in use for: DB_URL, SUPABASE_URL, PUBLISHABLE_KEY, SECRET_KEY`. **Presence of that line ⇒ the run targeted SCRATCH. Absence ⇒ it targeted REPLICA.** That line is the single cheapest way to confirm after the fact which database a given run hit, and it is preserved verbatim in every evidence log.

## 6. DESTRUCTIVE QA SAFETY

**SCRATCH DESTRUCTIVE QA: YES**
**REPLICA DESTRUCTIVE QA: YES**

Both are unconditional. Three operational facts QA should know before running, none of which changes either answer:

1. **`rls:prove` is genuinely destructive by design.** Stage 1 drops the `public` schema (after dropping the `ensure_rls` event trigger, per F-6 ordering) and re-grants; stage 2's seed then **deletes every row in the fourteen non-baseline tables and purges every `auth.users` identity on the target** before creating its cast. It leaves the target fully rebuilt, not merely re-seeded. On a throwaway that is correct behaviour; on any other target it would be catastrophic.
2. **SCRATCH is the DEFAULT target.** An unprefixed `npm run rls:prove` is not inert — it wipes SCRATCH. There is no "dry run" mode.
3. **A guard exists but is not a target guard.** The harness fails closed if the publishable key equals the secret key (which would let a run "prove" isolation while holding service-role privileges), and every instrument fails closed on sign-in failure and asserts `session.user.id`. **Nothing validates *which project* is being addressed** — that is entirely the operator's prefix choice. Recommend QA state the intended target aloud in its own log before each destructive run, exactly as Engineering did at X6 recon.

## 7. DEV BACKEND SEPARATION

**Confirmed on both counts.**

- **Neither SCRATCH nor REPLICA is the Cyber Pharma dev backend.** They are disposable throwaways — SCRATCH is the Proto 06 rig project, REPLICA is BIM-001's X2 replica.
- **BIM-002 QA must not target the dev backend.** The dev backend is held at the two-table baseline through BIM-004 under the standing **LIVE APPLY DEFERRED** ruling; the chain is applied there only in the Phase 3 APPLY SESSION, by the Director, after Gate Q.

Two supporting facts:

- **The dev backend's credentials are not present in `.env.local` at all.** Per Amendment A-1, the app-style variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`) currently point at the **Proto 06 throwaway (SCRATCH)**, not the dev backend. QA cannot reach the dev backend from this repo's environment even by accident.
- ⚠️ **Consequence worth flagging:** because those app-style variables point at SCRATCH, **running the Next.js app locally targets SCRATCH.** Wiping SCRATCH therefore also empties whatever a local `npm run dev` would talk to. Harmless — it is a throwaway holding synthetic data — but QA should not be surprised if a local app session appears empty after a destructive run.
- BIM-002 wrote to no other database. Every evidence log names its target host, and only these two appear.

## 8. ROTATION / CLEANUP AFTER GATE Q

Carried in the manager as **CF-4** (credential rotation) and **CF-5** (rig cleanup). Names only:

**Projects to retire or rotate (two distinct projects):**
1. **SCRATCH** — project ref `jmzwhgnyunwssamrqyhp` (Proto 06 rig / BIM-001 scratch / BIM-002 scratch). Its connection string and keys transited chat during BIM-001, Proto 06 and BIM-002.
2. **REPLICA** — project ref `ihgcsrypblqkwommrkgj` (BIM-001 X2 replica / BIM-002 X6 replica). Same exposure.

**Credential sets in `.env.local` to rotate or remove once QA is finished (names only):**
- `PROTO06_DB_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` *(currently pointing at SCRATCH — note that repointing these later also repoints the local app)*
- `RLS_REPLICA_DB_URL`, `RLS_REPLICA_SUPABASE_URL`, `RLS_REPLICA_PUBLISHABLE_KEY`, `RLS_REPLICA_SECRET_KEY`

**Repo artifacts to retire (CF-5, after the harness port is certified):**
- `proto-06/` landing zone on `main`
- branch `phase-3-proto-6`

**Not secrets, but worth knowing they are committed:** the synthetic harness passwords used to create throwaway test identities are in-repo constants (`CAST_PASSWORD` in `scripts/rls-harness/lib/env.mjs`, `RIG_PASSWORD` in `proto-06/scripts/rig-lib.mjs`). They are valid only against identities the seed itself creates on a throwaway, and they should never be reused on any durable project.

---

```
QA TARGET MAP
SCRATCH: Proto 06 rig throwaway — project ref jmzwhgnyunwssamrqyhp (aws-1-us-west-1)
ENV SELECTION: no prefix override; default RLS_HARNESS_ misses, falls back to A-1 names
               (PROTO06_DB_URL + NEXT_PUBLIC_SUPABASE_URL/PUBLISHABLE_KEY + SUPABASE_SECRET_KEY)
DESTRUCTIVE QA: YES

REPLICA: clean-replica throwaway — project ref ihgcsrypblqkwommrkgj (aws-1-ap-south-1)
ENV SELECTION: RLS_HARNESS_PREFIX=RLS_REPLICA_
DESTRUCTIVE QA: YES

DEV BACKEND: OUT OF BOUNDS
```
