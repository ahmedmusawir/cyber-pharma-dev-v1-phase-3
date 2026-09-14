# S3 failure path — AC-303 (the deliberately broken run)

Generated 2026-09-14T15:37:06+08:00. **One golden row was altered on purpose**, `npm run audit:prove` was run, the non-zero exit and diff were captured, and the golden was restored byte-for-byte (verified by re-parse).

## The alteration

```diff
- row 1: "actor_user_id": "admin-A"
+ row 1: "actor_user_id": "member-A"
```

## Result

```
$ npm run audit:prove
exit code: 8

[audit:prove] audit-trail proof from an empty scratch — 2026-09-14T0736
═══ 1/4 WIPE + CHAIN 0001-0047 ═══
═══ 2/4 SEED (BIM-002 cast + FK-safe reset) ═══
═══ 3/4 AUDIT-SEED (multi + R-10 rows) ═══
═══ 4/4 SESSION + PROBES + GOLDEN DIFF ═══
[audit-session] BIM-003 scripted two-tenant session — 2026-09-14T07:36:46.878Z — host jmzwhgnyunwssamrqyhp.supabase.co
  DIFF at row 1:
    expected: {"table_name":"user_data","action":"insert","actor_role":"authenticated","actor_user_id":"member-A","business_id":"A1","row_id":"<uuid>","old_data":null,"new_data":"present","context":null}
    produced: {"table_name":"user_data","action":"insert","actor_role":"authenticated","actor_user_id":"admin-A","business_id":"A1","row_id":"<uuid>","old_data":null,"new_data":"present","context":null}
  ok   row count: produced 10, golden 10
  FAIL 1 differing row(s) against golden/audit_trail_expected.json
[audit-session] 1 FAILURE(S)
[audit:prove] ✗ FAILED at 4/4 SESSION + PROBES + GOLDEN DIFF (exit 3)
[audit:prove] evidence → evidence/S3_audit_prove_2026-09-14T0736.log (+ .normalised.log)
```

Every other probe in that run was green — only the golden comparison failed, and it named the row and both sides. Full log: `S3_audit_prove_2026-09-14T0736.log`.

## Restoration

```
row 1 actor_user_id = admin-A ✓ (re-parsed after restore)
```
