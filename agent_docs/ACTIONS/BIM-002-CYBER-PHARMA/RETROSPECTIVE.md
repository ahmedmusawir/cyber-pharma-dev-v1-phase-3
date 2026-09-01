# RETROSPECTIVE — BIM-002-CYBER-PHARMA
## RLS Policy Campaign · Engineer close, 2026-09-01

> What fought back. Five gate stops, five Director/Architect rulings, four errata, four new findings — and not one of them was a policy defect.

---

## The headline

**Every defect found in this module was in an instrument or a template — never in a policy.** The eleven policy migrations landed red→green on the first attempt, every one, and held across three independent from-scratch proofs on two separate databases. What broke was the machinery used to *verify* them, and the template inherited from the rig that was supposed to be already-proven.

That is the rig doing its job one level up: BIM-002 became the harness for Proto 06's transfer package, and found two corrections in it (F-10, F-11) that BIM-005 would otherwise have inherited silently.

## What fought back

1. **The proven helper template was wrong twice, in the same line.** TRANSFERS §1.0's `revoke … from anon` is a no-op — PUBLIC grants EXECUTE by default and `anon` inherits it (E-2). Then the fix for *that* proved insufficient, because `pg_default_acl` grants functions to `anon` **explicitly** as well (E-4). Two independent channels, one line closing neither. The rig never caught it because its matrix asserted *table* access, where `anon` was denied anyway — table-level denial masked the grant entirely.

2. **X1's GREEN was an artifact, and only formulation C exposed it.** `create or replace` preserves an existing ACL, so the two-step apply history (v1 revoked from anon, v2 revoked from public) left a clean grant that a fresh database would never reproduce. Creating a brand-new helper for the A/B is what surfaced it. **X5 would have failed on the from-scratch run.** The lesson became F-12 and then a permanent stage of `rls:prove` — privilege assertions are only valid after a drop-and-apply.

3. **The first A/B measured a corpse and called it fast.** Formulation B clocked 10 ms — 160× faster — while returning **zero rows**. Its inline junction subquery is invoker-evaluated and was silently blinded by the junction's own RLS. Row-count parity is now asserted *before* any timing is compared, which is the only reason the second run was trustworthy. F-11.

4. **`accounts.owner_user_id` has no `ON DELETE` behaviour**, so `auth.admin.deleteUser` fails for any account owner. The seed's purge died half-way, orphaned identities' sign-ins **failed silently**, and the queries ran as `anon` — presenting as "multiStore sees 0 rows", which looks exactly like perfect isolation. Fixed by ordering (public data before auth purge); recorded as **CF-1** because it is a real production constraint, not a test artifact.

5. **The harness mutated the world it was measuring.** Probes with INSERT permitted but DELETE denied left rows behind; a permitted UPDATE renamed a seeded store for good. Counts drifted 400 → 426 → 428 across runs. Caught by the row-scoping check, not by the matrix — because the matrix only asks *allowed or denied*, never *how many* or *which*.

6. **Four instrument defects in one campaign, and the fourth was mine.** An ad-hoc scoping script treated a failed sign-in as "0 rows". The permanent harness fails closed; the throwaway script beside it did not. Standing law now: every instrument fails closed on auth failure **and** asserts the identity it ran as.

7. **Infrastructure, twice, mid-measurement:** a pooler `ECONNRESET` and then an orphaned `idle in transaction` backend holding a lock on `user_data`, found via `pg_stat_activity` and terminated. Neither touched the results, but both cost a run.

## What went right, and why

- **Red-then-green, mechanised.** The X3 driver aborts if the matrix is green *before* a policy lands. That single rule is what makes eleven "GREEN" results mean something rather than eleven tautologies.
- **Ground truth on every mutation.** `0 affected` is not proof; twenty-eight attacks were each re-read through the service role. Zero mismatches — and the discipline is what would have caught a partial write.
- **Deny-all tables seeded with rows.** A refusal against an empty table proves nothing. Logging the service-role row count beside each `0` turns a vacuous pass into a real one.
- **The Architect's formulation C.** Asked for a measurement before adopting B, and the answer was better than either option: B's plan shape with A's shield. 30–54× faster than A, and immune to the blindness that makes B unsafe. That ruling is the single highest-value decision in the module.

## Process notes for the campaign journal

- **Five gate stops worked.** Every stop surfaced something the next gate would have inherited. X1's stop found E-2; X2's found E-4 and C; X3's found two harness defects; X6's found the diff-honesty question.
- **One process slip, logged not penalised:** the E-4 fix was applied before ratification because the ratified AC was otherwise unmeetable. The Director's correction stands — hold pinned text, report "blocked, remedy proven", and take the ruling in-session.
- **Refusing to normalise the host was the right call.** Masking the pooler host would have made X6's cross-target diff look byte-clean while destroying the only line proving which database ran. A clean diff you cannot trust is worth less than an honest one with three explained lines.
- **The authority package worked.** After four consecutive launches missing an input, BIM-002 launched with everything staged. Zero doc-staging flags. The launch-line prerequisite earns its place.
