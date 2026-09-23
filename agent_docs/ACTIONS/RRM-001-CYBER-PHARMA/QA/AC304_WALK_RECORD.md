# AC-304 live-auth walk record

Completed 2026-09-22 on the Director-started local application at `http://localhost:3000`, using the normal local configuration and the intended Supabase project confirmed by Tony before authentication. Credentials remained in Tony's browser. Cody did not start, stop or reconfigure the application server.

Tested implementation: `cad164d62a623a115541c0441302de01ff74da5b`. Current branch/HEAD during the final walk: `qa/phase-3-rrm001` / `9ab95e525e6775e5cb38e0ff12922b8ea1b85cc4`. The successor diff is documentation/evidence only and has no product/configuration change.

| Role | Viewport/theme coverage | Login | Role route | Profile/password form | Logout | Post-logout guard |
|---|---|---|---|---|---|---|
| ADMIN | Desktop and 375px; light and dark | `/auth` → `/owedbook` | `/admin-portal` loaded | `/profile`; password-update form rendered, not submitted | Landed `/auth` | `/owedbook` → `/auth` |
| MEMBER | Desktop and 375px; light and dark | `/auth` → `/owedbook` | No ADMIN portal entry | `/profile`; password-update form rendered, not submitted | Landed `/auth` | `/owedbook` → `/auth` |

Evidence attribution is Director-observed manual interaction, reported checkpoint by checkpoint and finalized by Tony's explicit confirmation of the complete MEMBER matrix. The abandoned QA-controlled browser attempt under `evidence/AC304_FINAL/` remained at `/auth`, recorded zero authenticated walks, was closed by Cody, and never touched the Director-owned application server. It is retained only as boundary/provenance evidence and is not the basis of the completed walk.

A-13 and the 2026-09-22 acceptance-spec erratum govern logout: `/auth` is the required destination, followed by the unauthenticated `/owedbook` → `/auth` check. Observed behavior matched that correction for both roles.

No password was changed, no user was created, and no migration, database operation, product repair, broad rerun or Git mutation was performed by Cody.
