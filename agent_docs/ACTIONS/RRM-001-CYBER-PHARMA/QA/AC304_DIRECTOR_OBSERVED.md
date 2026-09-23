# AC-304 Director-observed evidence

Date: 2026-09-22. Evidence attribution: **Director-observed manual walk**, reported to Cody checkpoint by checkpoint. This is not Cody-controlled browser telemetry and contains no credentials, cookies, tokens or environment values.

Tony started the repository development server on port 3000 with the normal local configuration and confirmed that this was the intended Supabase project before authentication. Cody did not start, stop or reconfigure the server. Read-only preflight tied the served repository to branch `qa/phase-3-rrm001`, HEAD `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`, whose changes from tested implementation `cad164d62a623a115541c0441302de01ff74da5b` are documentation/evidence only; the product/configuration diff is empty.

Tony used existing ADMIN and MEMBER accounts and kept all credentials inside his own browser. Cody requested bounded observations one at a time. No account was created, no password was changed or submitted, and no migration or business-data change was requested.

## Completed walk

| AC-304 step | Director-observed result |
|---|---|
| Existing ADMIN login at `/auth` | Login succeeded and landed on `/owedbook`. |
| ADMIN authorization | `/admin-portal` loaded successfully. |
| ADMIN profile | `/profile` loaded and the password-update form rendered; nothing was submitted. |
| ADMIN presentation matrix | Desktop and 375px, light and dark, remained usable. `/profile` was checked in all four combinations; `/admin-portal` was explicitly checked at 375px in light and dark after the desktop authorization check. |
| ADMIN logout/session end | Logout landed on `/auth`; manually opening `/owedbook` afterward ended on `/auth`. |
| Existing MEMBER login at `/auth` | Login succeeded and landed on `/owedbook`. |
| MEMBER authorization boundary | No ADMIN portal entry was available, as expected for the MEMBER role. |
| MEMBER profile | `/profile` loaded and the password-update form rendered; nothing was submitted. |
| MEMBER presentation matrix | Tony completed and explicitly confirmed desktop and 375px, light and dark. |
| MEMBER logout/session end | Logout landed on `/auth`; manually opening `/owedbook` afterward redirected to `/auth`. |

The ADMIN observations were reported at each checkpoint. Tony then performed the corresponding MEMBER routine and explicitly confirmed the six-item record: desktop and 375px in light/dark; login landing `/owedbook`; `/profile` password form; no ADMIN portal entry; logout to `/auth`; and post-logout `/owedbook` redirect to `/auth`.

An intermediate screenshot showed ADMIN `/profile` in dark responsive mode at 400px. It was used only to notice and correct the width; it is not claimed as the required 375px evidence. Tony changed DevTools to exactly 375px and separately confirmed the required dark and light observations. No authenticated screenshot was copied into durable QA evidence.

## Logout authority

Ruling A-13 is recorded in `RULINGS_ADDENDUM.md`, and the matching acceptance-spec erratum is recorded in `ACCEPTANCE_SPEC.md` dated 2026-09-22. A-13 corrects the drafting error: logout must end the session and land on `/auth`, then an unauthenticated `/owedbook` request must redirect to `/auth`. Both roles produced that result. No product correction was required.

## Scope boundary

This completes the released AC-304 live-walk observations. It does not adjudicate or certify RRM-001; SOL retains those authorities. It also does not satisfy AC-206, whose separate Director-owned Supabase toggle and direct-signup-denial evidence remains NOT YET.
