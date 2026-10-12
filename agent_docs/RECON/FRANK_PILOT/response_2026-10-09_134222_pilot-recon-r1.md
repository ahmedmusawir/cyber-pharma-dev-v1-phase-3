# R-1 Recon Report — Frank pilot (Engineer, read-only)

**Prompt:** `agent_docs/RECON/FRANK_PILOT/RECON_R1_PROMPT_v2_2026-10-09.md`
**Plan record:** `agent_docs/RESPONSES/response_2026-10-09_132928_pilot-recon-r1-plan.md`, approved 13:33 with Director rulings 1–4.
**Report location:** this file, by Director ruling 2. It replaces the RESPONSES destination named in the prompt.
**Method:** source inspection only. I ran no npm command, no build, no app, no database operation and no Git mutation in the working clone. There was one authorized clone into scratch.

---

## 0. Entry record

These were captured at 2026-10-09T13:26:30+06:00, before any R-1 write.

| Item | Value |
|---|---|
| Branch | `pilot-recon-r1` |
| HEAD | `a4c82e1ae9d603a83021831d39c4c3f1ea73aaff` (not equal to `5234abe`) |
| `main` / `origin/main` | `5234abe9ee4a076e0ddacdc69353e9f08246b4cd` (both) |
| `5234abe..origin/main` | empty (`origin/main` is not ahead) |
| `git status --porcelain` | empty, so the tree was clean |

**Setup commit, recorded separately from the app baseline.** `a4c82e1` ("09oct2026 - session open; RECOVERY stale-uncommitted line fixed; RESPONSES archived to _OLD; FRANK_PILOT recon R1 prompt v2") is the only commit in `5234abe..HEAD`. It touches:
- `CHANGELOG.md`
- `RECOVERY.md`
- `agent_docs/RECON/FRANK_PILOT/RECON_R1_PROMPT_v2_2026-10-09.md`
- `agent_docs/SESSIONS/session_2026-10-09.md`
- 18 `agent_docs/RESPONSES/*.md` records moved into `RESPONSES/_OLD/` (pure renames)

It touches nothing under `src/`, `scripts/`, `supabase/` or `package*.json`. **The app baseline is unchanged at `5234abe`.**

**Recon skill.** At step 0 I said "no recon skill found". That followed the prompt's prescribed check: `.claude/skills` is absent, and the `agent_docs/*.md` grep only hit campaign documents. **Correction:** step 2 later found a tracked skill at `_SKILLS/stark-recon-skill-v1.1/` (`SKILL.md`, `CLAUDE.md`, `templates/`, `references/`, `examples/`). It was **not used**. R-1 ran on the prompt alone, as approved. The skill's own default output folder is `agent_docs/recon/` (lowercase), which is not the live folder.

**Environment event.** At 13:31:58, while the plan was awaiting approval, `/home/moose/nextjs` was renamed to `/home/moose/NEXTJS` outside this agent. I re-verified the repo at the new path: same branch, HEAD and `origin/main`, and only the authorized files were dirty. Everything after approval ran at `/home/moose/NEXTJS/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3`.

---

## 1. Secrets scan

**Full-history secrets scan: NOT COMPLETED — no scanner installed.** Neither `gitleaks` nor `trufflehog` is on PATH, as the Director confirmed and I re-checked. Nothing was installed or downloaded. No content-search heuristic was substituted.

**Scratch clone.** This was the one clone allowed by Director ruling 4.
- Command: `git clone --no-local --no-recurse-submodules --branch main https://github.com/ahmedmusawir/cyber-pharma-dev-v1-phase-3.git /tmp/cyph-recon-r1.4VcGyN/repo`.
- The origin URL carries no credentials.
- Clone HEAD is `5234abe`, with 72 commits on `main`. The clone is not shallow.
- Refs present: `main` plus 18 remote branches (`phase-3-1`, `phase-3-2`, `phase-3-bim001…003`, `phase-3-doc-sync`, `phase-3-rrm-ffm`, `phase-3-rrm001…004`, `qa/phase-3-bim003`, `qa/phase-3-rrm001…004`) and 2 tags.

**Filename-only inventory.** These are filenames ever added in history that look credential-shaped. The command was `git log --all --diff-filter=A --name-only | grep -iE '\.env|\.pem$|\.key$|credential|secret'` over all refs in the clone.

| Filename | Note |
|---|---|
| `.env.example` | the only match; a template that is tracked by design |

**Coverage and limitations.** The inventory covers every ref on `origin` as of the clone (19 branches and 2 tags). Each branch is fully deep. It checks **filenames only**: it says nothing about secrets inside file content, commit messages or renamed files. Local-only branches and stashes in the working clone are not covered. **This inventory is not clearance to share history with guests.** That clearance still needs a real scanner run.

---

## 2. Instruction files

**Repo root (`ls -a`):** `CLAUDE.md` is the only instruction-shaped file. There is no `AGENTS.md`, `.cursorrules`, `.windsurfrules` or `GEMINI.md`. **`.github/` is absent.** `.claude/` holds only `settings.local.json`, which is ignored by the user's global git ignore and not by the repo.

**Under `agent_docs/` (top level):** none. Instruction-shaped files found deeper:
- `agent_docs/ACTIONS/<module>/CLAUDE.md` for BIM-000, BIM-001, BIM-002, BIM-003, FIX-001 and RRM-001…004
- `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md`
- `_SKILLS/stark-recon-skill-v1.1/CLAUDE.md`, `_SKILLS/stark-cloud-deploy-skills/CLAUDE.md` and `_SKILLS/stark-kit-residue-cleaner-skill/CLAUDE.md`

**Observed in this session.** The tool loaded the root `CLAUDE.md` at start, plus the user's auto-memory index (`MEMORY.md`, outside the repo). No nested `CLAUDE.md` or `AGENTS.md` was shown to me. Whether any of them would load under other conditions: **not observed**.

**GPT/Codex behaviour** toward `AGENTS.md`: **not known from here.**

---

## 3. Env contract and startup

| Fact | Where | Summary |
|---|---|---|
| `REQUIRED_ENV` defined | `src/instrumentation.ts:11` | four names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL` |
| Startup check | `src/instrumentation.ts:18` (`register()`) | Throws if any name is missing or blank, so the server refuses to start. It checks presence only and never reads the value for use. |
| `SUPABASE_SECRET_KEY` read (app) | `src/utils/supabase/admin.ts:22` | used inside `createAdminClient()` |
| `SUPABASE_SECRET_KEY` (tests) | `src/__tests__/jest.setup.ts:3` | Sets a placeholder default for Jest; a test fixture, not a consumer. |
| `SUPABASE_SECRET_KEY` (scripts) | `scripts/rls-harness/lib/env.mjs:19` | A-1 fallback name for the harness `SECRET_KEY`. It is read from `.env.local` by a file parser, not from `process.env`. |
| Admin client importers (non-test) | none | Nothing under `src/` or `scripts/` imports `utils/supabase/admin`. The file header (`admin.ts:1-9`) states it is unconsumed and fenced to seed/system jobs. |
| Harness service-role client | `scripts/rls-harness/lib/db.mjs:15` | A separate `serviceClient()` that the harness builds from the same key. |

**`process.env.<NAME>` reads under `src/`, deduplicated with counts:**

| Count | Name |
|---|---|
| 6 | `NEXT_PUBLIC_SUPABASE_URL` |
| 5 | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| 3 | `NEXT_PUBLIC_SITE_URL` |
| 3 | `SUPABASE_SECRET_KEY` (1 in `admin.ts`, 2 in one line of `jest.setup.ts`) |

Files reading `process.env`: `utils/supabase/admin.ts`, `client.ts`, `middleware.ts`, `server.ts`, and `__tests__/jest.setup.ts`. `instrumentation.ts` reads by dynamic key (`process.env[key]`), so the grep doesn't count it.

**2026-10-06 finding, "only `admin.ts` consumes the secret":** **CONFIRMED for application code, with an addition.** In `src/`, `admin.ts:22` is the only consumer; `instrumentation.ts` only checks presence and `jest.setup.ts` only sets a fixture. Outside `src/`, the RLS harness also consumes the same key through `.env.local` (`scripts/rls-harness/lib/env.mjs:19` → `lib/db.mjs:16`). Note too that `admin.ts` itself has zero importers.

---

## 4. Logout control and auth routes

**Logout mechanism: a POST route handler, called from the client store.**
- `src/app/api/auth/logout/route.ts:5`: `POST` creates the server Supabase client and calls `auth.signOut()`. On error it returns 400 JSON. On success it calls `revalidatePath('/', 'layout')` (line 14) and returns 200 JSON.
- `src/store/useAuthStore.ts:54`: `logout()` fetches `POST /api/auth/logout` and throws on a non-OK response. It then clears the Zustand auth state (user, role and the flags).
- Callers all run `logout()`, then `router.refresh()`, then `router.push("/auth")`:
  - `src/components/auth/Logout.tsx:10`: a dropdown item labelled **"Logout"**, used in `components/global/Navbar.tsx:157` (desktop "My Account" menu) and `components/global/UserMenu.tsx:50`.
  - `src/components/global/Navbar.tsx:95` (`handleLogout`): the mobile-menu button labelled **"Log out"** at line ~203.
  - `src/components/global/MobileNav.tsx:30` (`handleLogout`): the same pattern, wired to the button at line 85.
- `src/components/global/NavbarLoginReg.tsx:28` only mentions logout in text; it has no control.
- Test hits (`__tests__/global/Navbar.mobile.test.tsx`, `MobileNav.test.tsx`, `UserMenu.test.tsx`) were not described.
- No server action performs logout. The only `"use server"` file is `src/utils/supabase/actions.ts`, and it holds `protectPage`.

**Auth route handlers under `src/app`:**
- `src/app/api/auth/confirm/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`

---

## 5. Seed and reset tooling (static inspection; declared operations only)

These are declared operations, not measured row counts.

### `scripts/rls-harness/seed.mjs` (with `lib/env.mjs`, `lib/db.mjs`)

**Env read.** It reads `.env.local` at the repo root through a line parser (`lib/env.mjs:22-50`), not through `process.env`.
- It looks for the prefixed names `RLS_HARNESS_DB_URL`, `_SUPABASE_URL`, `_PUBLISHABLE_KEY` and `_SECRET_KEY`. The prefix can be overridden with `process.env.RLS_HARNESS_PREFIX`.
- **A-1 fallback** (`env.mjs:15-20`): if a prefixed name is missing, it uses the unprefixed `PROTO06_DB_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`. **These are the same names the app reads.**

**Purge (`seed.mjs:43-47`).** It runs an unconditional `delete from` on 13 public tables, in this order:
1. `user_data`
2. `report_files`
3. `subscriptions`
4. `user_businesses`
5. `businesses`
6. `accounts`
7. `apa_memberships`
8. `pending_registrations`
9. `aac_reference`
10. `wac_reference`
11. `ful_reference`
12. `pbm_info`
13. `reference_dataset_versions`

`audit_logs` is excluded because it is append-only.

**Auth purge (`seed.mjs:54-59`).** It deletes **every** `auth.users` row found, up to 1000 per page, through the service-role admin API.

**Inserts.**
- 4 auth users with synthetic `@rls.local` emails (`:65`).
- `accounts` (`:72-73`) and `businesses` (`:74-76`).
- `user_businesses` (`:78`) and `subscriptions` (`:89`).
- `user_data`: 200 rows per store, generated (`:91-94`).
- `report_files` (`:95`), `apa_memberships` (`:97`) and `pending_registrations` (`:98`).
- `reference_dataset_versions` (`:100`), `aac_reference` (`:101`), `wac_reference` (`:102`), `ful_reference` (`:103`) and `pbm_info` (`:104`).

`user_roles` and `profiles` are filled by the `handle_new_user` trigger, and `audit_logs` by the audit triggers. The script writes `scripts/rls-harness/seed-map.json` (ids only) at `:117`.

**Guards.**
- Fail-closed if `.env.local` or any key is missing (`env.mjs:24-26`, `:39-41`).
- Fail-closed if the publishable key equals the secret key (`env.mjs:44-46`).
- **There is no `DB_RESET_ALLOW` check in `seed.mjs`.** It needs no confirmation and does not check the host or project.

**Connection.** `lib/db.mjs:9` passes `DB_URL` straight to `pg.Client({ connectionString })`. **Host and username are never checked.**

**Embedded literal present at `scripts/rls-harness/lib/env.mjs:53`.** It is a synthetic cast password; the value is not reproduced here.

### `scripts/db-reset.mjs`

**Env read.** `DB_URL` (`:38`) and `DB_RESET_ALLOW` (`:43`), both from `process.env`.

**Commands and declared operations.** It has four commands: `reset`, `bootstrap`, `apply` and `inventory`.
- `reset`: drops the event trigger `ensure_rls` (`:89`), then `DROP SCHEMA public CASCADE` and recreates it (`:90`). It re-grants schema privileges (`:93-99`), runs `scripts/db-bootstrap-baseline.sql` (`:101`), then replays every `supabase/migrations/NNNN_*.sql` (`:114-116`).
- `bootstrap`: runs the baseline SQL only (`:104-110`).
- `apply`: replays the chain only.
- `inventory`: lists public tables (read-only).

**Guards.**
- Fail-closed anchors: the migrations directory and bootstrap file must exist (`:26-31`).
- `DB_URL` is required (`:39-42`).
- `reset` requires `DB_RESET_ALLOW` to be exactly `yes` (`:43-46`).
- **`apply` and `bootstrap` have no confirmation guard.** The only protection for `apply` is that migration `0001` asserts the baseline, according to the comment at `:112-113`; I didn't open `0001` in R-1.

**Connection.** `new URL(dbUrl)` (`:53`). The hostname and database name are **printed only** (`:54`). They are **never compared against an allow-list or deny-list**, and the username is never checked.

**Guard bypass by callers.** `scripts/rls-harness/prove.mjs:33` and `scripts/rls-harness/audit-prove.mjs:23` call `db-reset.mjs reset` with `DB_RESET_ALLOW: "yes"` already set. **So `npm run rls:prove` and `npm run audit:prove` drop the target schema without any operator confirmation.** Their target comes from `.env.local` through the A-1 fallback described above.

### `scripts/db-verify.mjs`

**Env read.** `DB_URL` only (`:11-12`), fail-closed.

**Default mode.** Structural `information_schema` / catalog checks, read-only (header `:4`).

**`--probes` mode (`:191` onward), declared scratch-only:**
- Inserts into `auth.users`, `accounts`, `businesses`, `user_businesses` and `user_data` inside `begin … rollback` (`~:195-223`).
- **Real committed** insert, update and delete on `reference_dataset_versions` for the AC12 probe (`~:226-236`).
- Creates and drops a table `public.__ensure_rls_probe__` (`~:241-246`).

**Guards.** The `--probes` flag is the only gate. There is no `DB_RESET_ALLOW` check and no host check. The connection string goes straight to `pg.Client`.

### `RUN_NOTES.md`

- It declares both proofs **destructive**: they drop `public`, replay the chain, purge all `auth.users` and reseed. It says to point them only at a throwaway (`:3`).
- **`:14` states that the default unprefixed block (`PROTO06_DB_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`) is the scratch throwaway.** I didn't open `.env.local`, so I can't say which project those values currently point at. If the app's `.env.local` targets a real dev project, the default `rls:prove` target is that project.
- `:15` documents re-pointing with `RLS_HARNESS_PREFIX`. `:28` documents manual `reset` with `DB_RESET_ALLOW=yes`.

---

## 6. Runtime floor and tooling

| Item | Declared |
|---|---|
| `engines` | **no engines field** |
| `.nvmrc` / `.node-version` / `.tool-versions` | none present |
| `packageManager` / `volta` | not declared |
| `next` | `16.3.7` |
| `@playwright/test` | `^1.59.1` |
| `jest` | `^30.0.5` |
| `typescript` | `^5` |
| `eslint` | `^9.39.4` |

**`<NODE_VERSION_FLOOR>`: none declared.**

**`.gitignore` env lines:**
- `:27` is a comment.
- `:28` is `.env*.local`.
- `:35` is `next-env.d.ts`, which isn't an env file.

**A plain `.env` (no `.local`) is not covered by the repo `.gitignore`.**

**Playwright:** `test:e2e` scripts are declared, but there is **no `playwright.config.*`, `e2e/` or `tests/` directory** at the root.

---

## 7. Routes and role gates

Everything in this section is **inferred from source; not exercised.**

**Pages:**
- `/` (`(public)/page.tsx`)
- `/access-denied`
- `/auth`
- `/error`
- `/owedbook`
- `/profile`
- `/admin-portal`, `/admin-portal/audit`, `/admin-portal/billing`, `/admin-portal/settings`, `/admin-portal/stores/[id]`, `/admin-portal/stores/[id]/invite`

**Layouts and their gates:**

| Layout | Gate | Summary |
|---|---|---|
| `src/app/layout.tsx` | none | root shell |
| `src/app/(public)/layout.tsx:20` | none (no redirect) | Resolves the user and role on the server for the navbar; logged-out visitors are allowed. |
| `src/app/(auth)/layout.tsx` | none | |
| `src/app/(admin)/layout.tsx:13` | `protectPage([ADMIN], { unauthorizedRedirect: "/owedbook" })` | Admin only. A MEMBER is redirected to `/owedbook`. |
| `src/app/owedbook/layout.tsx:17` | `protectPage([ADMIN, MEMBER])` | either role |
| `src/app/profile/layout.tsx:15` | `protectPage([ADMIN, MEMBER])` | either role |

**`protectPage`** (`src/utils/supabase/actions.ts:8`):
- It checks the session with `auth.getUser()`. No user means a redirect to `/auth` (`:18-20`).
- It reads the role from `user_roles` via `getUserRole`. A missing or disallowed role redirects to `opts.unauthorizedRedirect`, or `/auth` by default (`:24-27`).

`src/proxy.ts` (Next 16 proxy, with a matcher at `:9`) refreshes the session but **does not redirect** (`utils/supabase/middleware.ts:36`).

**A MEMBER reaches:** `/`, `/access-denied`, `/auth`, `/error`, `/owedbook` and `/profile`. `/admin-portal/**` redirects a MEMBER to `/owedbook`.

**Login landing:**
- `LoginForm.tsx:61-70` posts to `/api/auth/login`, which uses `signInWithPassword`.
- `useAuthStore.ts:48-52` sends **both ADMIN and MEMBER to `/owedbook`**. Any other role goes to `/access-denied`.
- Admins reach `/admin-portal` through the navbar switcher.

---

## 8. `.github/` and CI feasibility

**`.github/`: absent.** There are no workflows, triggers or referenced secrets in the repo.

**`package.json` scripts:**

| Group | Scripts |
|---|---|
| App | `dev`, `build`, `start` (next) · `lint` (`eslint .`) · `test` (`jest`) |
| End-to-end | `test:e2e` and `test:e2e:ui` (playwright; **no config present**) |
| Database | `db:reset`, `db:apply`, `db:inventory` (db-reset.mjs) · `db:verify`, `db:verify:probes` (db-verify.mjs) |
| Proofs | `rls:prove` · `audit:prove` (**both destructive**, see §5) |

**What a placeholder-env build would need** (names only, from `REQUIRED_ENV`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

Whether `register()` runs during `next build`, as opposed to server start, was not checked; I ran no build. `.env.example` lists the same four names.

---

## 2026-10-06 finding → status

The 2026-10-06 findings document is **not on disk** in this repo; a search of `agent_docs/` found no file for that date. Only the finding quoted in the R-1 prompt could be checked.

| 2026-10-06 finding | Status | Evidence |
|---|---|---|
| Only `admin.ts` consumes `SUPABASE_SECRET_KEY` | **Confirmed** for `src/`, **with an addition** | `admin.ts:22` is the only app consumer. The RLS harness also consumes it from `.env.local` (`scripts/rls-harness/lib/env.mjs:19` → `lib/db.mjs:16`). `admin.ts` has zero importers. |
| Any other 2026-10-06 finding | **Not checked** | source document not available here |

---

## Setup facts for the kit and VIK

| Fact | Value |
|---|---|
| `<NODE_VERSION_FLOOR>` | **none declared** (no `engines`, no `.nvmrc`) |
| Logout control | **"Logout"** dropdown item in the desktop user menu (`components/auth/Logout.tsx`), and a **"Log out"** button in the mobile menu (`Navbar.tsx` / `MobileNav.tsx`). Both call `POST /api/auth/logout` via `useAuthStore.logout()`, then go to `/auth`. |
| Login landing | `/owedbook` for ADMIN and MEMBER; `/access-denied` otherwise |
| Instruction files observed | root `CLAUDE.md` only (plus the user's auto-memory, outside the repo). `AGENTS.md` exists only at `agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/AGENTS.md`. There is no root `AGENTS.md` and no `.github/`. |
| Seed tables | Purges 13 public tables plus **all** `auth.users`. Inserts into 13 public tables and 4 auth users. `user_roles`, `profiles` and `audit_logs` are filled by triggers. |
| Seed and reset guards | `seed.mjs`: key presence and publishable≠secret only, with **no confirmation and no host check**. `db-reset reset`: `DB_RESET_ALLOW=yes`, **auto-set by `rls:prove`/`audit:prove`**. `db-reset apply`/`bootstrap`: no guard. `db-verify --probes`: flag only. **No script checks the host or username.** |
| Harness default target | Unprefixed fallback, **sharing the app's Supabase env names** (`RUN_NOTES.md:14`, `env.mjs:15-20`). The current `.env.local` target was **not inspected**. |
| Required env | 4 names (§8) |
| CI | none (`.github/` absent) |
| Recon skill | `_SKILLS/stark-recon-skill-v1.1/` exists; not used in R-1 |

---

## Scan coverage and limitations

- **Secrets scan: NOT COMPLETED — no scanner installed.** No heuristic was substituted.
- The filename inventory covers all 19 `origin` branches and 2 tags at full depth, and it checks filenames only. **It is not clearance for guest access to history.**
- I didn't open `.env.local`, so no values were read. The harness target project is therefore unknown.
- Line numbers marked `~` in §5 (`db-verify.mjs` probes) were derived from an offset read and are approximate to ±2.
- §7 is inferred from source only; no route was exercised.
- Migration `0001`'s baseline assertion was cited from a comment and not read.

## Scratch cleanup

`/tmp/cyph-recon-r1.4VcGyN` (holding the clone `repo/`) was **deleted entirely** after this report was written. Its result is in the step-9 checkpoint below.

## Step-9 result

- **Scratch:** `rm -rf /tmp/cyph-recon-r1.4VcGyN` was run, and the directory is confirmed absent.
- **HEAD:** still `a4c82e1`.
- **App diff:** `git diff HEAD -- src scripts supabase package.json package-lock.json` is empty.
- **`git status --porcelain`:**
  ```
   M agent_docs/SESSIONS/session_2026-10-09.md
  ?? agent_docs/RECON/FRANK_PILOT/response_2026-10-09_134222_pilot-recon-r1.md
  ?? agent_docs/RESPONSES/response_2026-10-09_132928_pilot-recon-r1-plan.md
  ```
  These are exactly the three permitted writes: the session log, the report and the plan record.

## Checkpoint

- **Completed:** R-1 steps 0–9. The secrets scan is NOT COMPLETED (no scanner). The filename inventory, report and scratch deletion are done. RECOVERY.md was left unchanged, per ruling 3.
- **Evidence seen:**
  - The app secret has one consumer (`admin.ts`, which has zero importers), and the harness also uses the same key.
  - Logout is `POST /api/auth/logout` via `useAuthStore.logout()`.
  - No Node floor is declared, and there is no `.github/` and no Playwright config.
  - The seed purges every `auth.users` row with no confirmation.
  - `rls:prove` and `audit:prove` auto-set `DB_RESET_ALLOW=yes`.
  - No script checks the host or username.
- **Uncertain:**
  - Which project the current `.env.local` targets (not opened).
  - Whether `register()` runs at build time.
  - The rest of the 2026-10-06 findings (the document isn't on disk).
  - Who renamed `nextjs` to `NEXTJS` at 13:31:58, and why.
- **Proposed next step:** the Director installs a scanner (`gitleaks`) for a real full-history scan before any guest gets history access. Separately, the Architect decides whether the harness's fallback to the app's env names, and the missing host check, need a guard before the Frank pilot touches seed tooling.
