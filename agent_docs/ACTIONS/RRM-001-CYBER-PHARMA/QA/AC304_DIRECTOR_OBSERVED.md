# AC-304 Director-observed evidence

Date: 2026-09-21. Evidence class: **CLAIM / Director-observed**, not independent Cody browser evidence.

Tony confirms that he manually logged in successfully using the repository app on port 3000. The retained QA browser checkpoint identifies the requested account context as **ADMIN**, viewport 1440px, light mode, but it stopped at `/auth` before login and contains zero completed journey records. Therefore the evidence supports only: an existing account successfully authenticated in Tony's manual run. It does not independently prove the resolved role, landing pathname, admin portal, profile/password form, logout destination, session termination, MEMBER behavior, 375px, or dark mode.

The manual port-3000 run used the normal `.env.local` Supabase URL/key. The earlier Director-authorized QA SCRATCH standalone used distinct `RLS_REPLICA_*` mappings. The successful manual login is not represented as a successful SCRATCH walk, and no cause is assigned to the failed SCRATCH login attempt.

## Completed versus outstanding

| AC-304 step | Evidence state |
|---|---|
| Existing account authenticates at `/auth` | Director-observed successful login; account checkpoint was designated ADMIN |
| Lands on `/owedbook` | Not recorded |
| Runtime role resolves as ADMIN | Not recorded; ADMIN is the requested checkpoint label only |
| ADMIN reaches `/admin-portal` | Not recorded |
| ADMIN reaches `/profile`; password-update form renders | Not recorded |
| Existing MEMBER login and `/owedbook` landing | Not recorded |
| MEMBER reaches `/profile`; password-update form renders | Not recorded |
| Logout actual destination | Not recorded |
| Session ended; unauthenticated `/owedbook` redirects `/auth` | Not recorded |
| Desktop + 375px, light + dark authenticated journey | Not recorded |

## Next operator-assisted checkpoint

Per QA_PLAYBOOK v1.1 §15, proceed one test at a time. Tony must start the app exactly as in the successful port-3000 run, log in with the existing **ADMIN** account, stop immediately after the landing navigation, and report the pathname visible in the address bar. Do not navigate or log out until that observation is recorded. Credentials remain browser-only.

After `/owedbook` is established, the remaining bounded sequence is ADMIN `/admin-portal` → `/profile` password form; viewport/theme confirmations; logout destination/session termination; then the corresponding existing MEMBER walk. No password update, user creation, migration or business-data mutation is permitted.

## Logout authority

No `A-13` row exists in `RULINGS_ADDENDUM.md`, and the frozen acceptance spec's erratum lane remains empty. The only recorded instruction says the frozen homepage-destination requirement remains pending Architect/Director ruling. Candidate and baseline source navigate to `/auth`. Under Doctrine Journal v0.3 J-20/J-21, this remains **PASS-PENDING-ADJUDICATION** if all other logout/session behavior passes; no product correction or contract rewrite is authorized here.
