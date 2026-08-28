# X2 PRE-CHECK — REPLICA IS NOT FACTORY-FRESH (STOP, surfaced)
**Date:** 2026-08-28 · **Target:** replica project `ihgcsrypblqkwommrkgj` (aws-1-ap-south-1 pooler)

The Director's brief said "factory-fresh." The catalog says otherwise:

| Found | Detail | Why it matters |
|---|---|---|
| `keepalive` table | uptime-pinger artifact | something may be actively pinging this project |
| `subscriptions` table **with 4 policies** | "Users can read own subscription" + 3 "No direct user *" — a **user-scoped StarkReads-pattern** table | my chain's 0006 creates `subscriptions` — plain CREATE would **collide**; the existing shape is from a different project lineage |
| `profiles` + `user_roles` | present | baseline-ish, but… |
| policy `"Users can read own role"` | **≠ baseline** `"Users can read their own role"` | different name = different deployment lineage, NOT our setup.sql |
| all 3 functions incl. `update_updated_at` | present | unlike LIVE (which lacks update_updated_at per X0) — again a different lineage |
| `ensure_rls` | present | consistent with a starter-kit deployment |

**Verdict:** this project is a REUSED instance carrying another deployment's schema (starter-kit + StarkReads subscriptions + keepalive), not a fresh one. X2 requires "a replica containing ONLY baseline (2 tables / 3 policies / 3 functions)" — this target cannot serve X2 as-is, and wiping it without confirmation is exactly the class of destructive action the git-zero/flag-first doctrine forbids me from improvising, since the keepalive table suggests possible active use.

**AC1 side-note (already banked):** the empty-DB loud-fail test ran against this target BEFORE bootstrap and PASSED for the right reason in the wrong costume — 0001 aborted (exit 2, named error) on the policy-set assert. A cleaner AC1 negative can be re-run on the scratch project post-wipe if QA wants the abort to fire on the *table* assert specifically.

**Options for the Director:**
1. **Confirm wipe:** "wipe the replica" → I drop the public schema on `ihgcsrypblqkwommrkgj`, run `bootstrap` (baseline-only), then `apply` (X2), then structural verify.
2. **Different project:** provide a genuinely fresh ref; I bootstrap + apply there.

Holding X2. All other scratch-side gates already green (X1, X3, X4, X5-live, probes).
