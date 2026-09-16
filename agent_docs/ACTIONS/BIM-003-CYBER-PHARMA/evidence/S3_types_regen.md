# S3 — Supabase types regeneration (AC-307) · Director-run, credential boundary

Run in **your** terminal, repo root, on branch `phase-3-bim003`. The Engineer session never logs in, links, or holds anything wider than the throwaway. Two equivalent routes — pick one.

## Route A — no login, no link (recommended): generate straight from the scratch database URL

The scratch's direct connection string is already in `.env.local` as `PROTO06_DB_URL`. The CLI can introspect it without a Supabase login:

```bash
set -a; source .env.local; set +a
npx supabase gen types typescript --db-url "$PROTO06_DB_URL" --schema public > src/types/supabase.ts
unset PROTO06_DB_URL NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY SUPABASE_SECRET_KEY RLS_REPLICA_DB_URL RLS_REPLICA_SUPABASE_URL RLS_REPLICA_PUBLISHABLE_KEY RLS_REPLICA_SECRET_KEY
```

(The `unset` line only clears the shell you sourced into; nothing is written anywhere.)

## Route B — login → gen → logout (the classic sequence)

```bash
npx supabase login
npx supabase gen types typescript --project-id <scratch-project-ref> --schema public > src/types/supabase.ts
npx supabase logout
```

`<scratch-project-ref>` is the subdomain of `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` (the 20-character ref). Do not paste the ref into chat.

## Then paste me the following (read-only, no secrets)

```bash
git diff --stat 011eada -- src/types/supabase.ts
git diff 011eada -- src/types/supabase.ts | grep -E '^[-+]' | grep -vE '^(\+\+\+|---)' | cut -c1-120
```

I verify AC-307 from that: hunks confined to the `audit_logs` block under `Tables` and the four `owedbook_*` entries under `Functions`; no removals or edits to any other entry. The verification block is then appended to `evidence/S3_files.md` § AC-307 and the AC-307 evidence cell is filled.

**State on the scratch right now:** the full chain `0001`–`0047` is applied (last `audit:prove` run, `S3_audit_prove_2026-09-14T0738.log`), so the generated types reflect the certified schema.
