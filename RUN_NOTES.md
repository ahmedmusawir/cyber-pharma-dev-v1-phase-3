# RUN_NOTES.md — database proof commands (Phase 3)

Two one-command proofs live in `scripts/rls-harness/`. **Both are destructive on their target:** each drops the `public` schema, replays the whole migration chain from `0001`, purges every `auth.users` row, and reseeds. Point them only at a throwaway project. The dev backend is never a target (LIVE APPLY is a named Director session).

| Command | What it proves | Evidence written to |
|---|---|---|
| `npm run rls:prove` | BIM-002 tenant isolation: chain from scratch, helper grants (AC8, from scratch), the four structural laws, the 320-cell identity×table×operation matrix, row-level scoping, the 28-case attack battery with ground truth, live-session revocation. | `agent_docs/ACTIONS/BIM-002-CYBER-PHARMA/evidence/` (hardcoded — CF-8) |
| `npm run audit:prove` | BIM-003 audit trail: chain from scratch, immutability under every role (six tampering probes), write trail on a `business_id` table and an R-8 table, six wrapper reads (log-then-return), cross-tenant denial, admin-only trail visibility, and a row-for-row match of the produced trail against `scripts/rls-harness/golden/audit_trail_expected.json`. | `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/` |

## Environment

Both read `.env.local` at the repo root through `scripts/rls-harness/lib/env.mjs`. Values are never printed.

- **Default target** — the unprefixed block: `PROTO06_DB_URL` (direct Postgres, pooler) · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` · `SUPABASE_SECRET_KEY`. This is the scratch throwaway (`agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/evidence/ENV_NOTE.md`).
- **Re-point** — set `RLS_HARNESS_PREFIX=<PREFIX>_` and provide `<PREFIX>_DB_URL`, `<PREFIX>_SUPABASE_URL`, `<PREFIX>_PUBLISHABLE_KEY`, `<PREFIX>_SECRET_KEY` (e.g. `RLS_HARNESS_PREFIX=RLS_REPLICA_ npm run audit:prove`). No code change.
- The harness fails closed if a key is missing or if the publishable key equals the secret key.
- **No new environment names were introduced by BIM-003.**

## Reading a result

- `rls:prove` ends with `✓ ISOLATION PROVEN` and exit 0; `audit:prove` ends with `✓ TRAIL PROVEN` and exit 0. Any stage failure exits non-zero and names the stage.
- A golden mismatch prints `DIFF at row N` with the expected and produced rows (symbolised: `admin-A`/`member-A`/`admin-B`/`multi`, `A1`/`A2`/`B1`, `<uuid>`) and exits 3 from the session stage, 8 from the runner.
- Each run also writes a `.normalised.log` twin (uuids/timestamps masked) so two runs can be diffed byte-for-byte.

## Stage-by-stage (for debugging one piece)

```
node scripts/db-reset.mjs reset          # needs DB_URL and DB_RESET_ALLOW=yes in the environment
node scripts/rls-harness/seed.mjs        # BIM-002 cast: ownerA, staffA, ownerB, multiStore + tenants
node scripts/rls-harness/audit-seed.mjs  # BIM-003: multiAdmin (admin of A1+B1) + R-10 rows
node scripts/rls-harness/audit-session.mjs   # the scripted session, probes, golden diff
node scripts/rls-harness/audit-catalog.mjs S1|S2   # pg_catalog evidence generators (rolled-back writes)
node scripts/rls-harness/audit-wrappers.mjs  # wrapper session probes (AC-204…208)
```
