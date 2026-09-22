# RRM-001 final QA evidence handoff to SOL

Prepared by Cody for SOL through Tony on 2026-09-22. This note exports evidence; it does not issue a verdict, certification, cleanup approval or Architect-closeout authorization.

## Identity

- Repository: `cyber-pharma-dev-v1-phase-3`
- Current branch: `qa/phase-3-rrm001`
- Full HEAD SHA: `cad164d62a623a115541c0441302de01ff74da5b`
- QA branch ref: `cad164d62a623a115541c0441302de01ff74da5b`
- Immutable implementation candidate tested: `cad164d62a623a115541c0441302de01ff74da5b`
- Engineering reference beneath the selected candidate: `4965c0c56ae7f658995d8b7cd634b5cdbc697f56`
- Code baseline: `5f45fb3db7ed0aa7d38dc6802c3a877c3f119dd9`

## AC-304 live-walk status

The required matrix is **not complete: 0 of 8 ADMIN/MEMBER × desktop/375px × light/dark combinations has a complete end-to-end walk record**.

Director-observed evidence: Tony confirms one successful manual login on port 3000. The retained QA checkpoint was designated `ADMIN`, 1440px, light mode, but it captured `/auth` and zero completed journey records. A successful login alone does not establish the resolved role or any post-login step.

Exact missing evidence:

1. Successful-login landing pathname `/owedbook` is not recorded.
2. Runtime ADMIN role resolution is not recorded.
3. ADMIN access to `/admin-portal` is not recorded.
4. ADMIN and MEMBER access to `/profile`, including visible password-update form, is not recorded.
5. Authenticated desktop/375px and light/dark combinations are not recorded for either role.
6. Logout's actual destination is not recorded.
7. Session termination plus post-logout unauthenticated `/owedbook` → `/auth` is not recorded.
8. No existing MEMBER-account authenticated journey is recorded.

The precise next operator-assisted step remains: run the working app, log in with the existing ADMIN account, stop after navigation, and report the address-bar pathname before navigating or logging out. Credentials remain browser-only.

## Logout authority

`RULINGS_ADDENDUM.md` contains A-01 through A-12 and OBS-1/OBS-2. **A-13 is absent.** `ACCEPTANCE_SPEC.md` retains an empty append-only erratum lane; an A-13 acceptance-spec erratum is absent. The current recorded instruction leaves the frozen logout-to-`/` requirement pending Architect/Director adjudication. Candidate and baseline source target `/auth`; QA has not silently changed the requirement or product.

## Working-tree status at export

- No staged changes and no Git mutation by Cody.
- Director-approved archive cleanup: 20 tracked BIM-003 response paths appear as unstaged deletions, with 20 byte-identical untracked counterparts under `agent_docs/RESPONSES/_OLD/`. They must remain there and are not a product defect.
- QA outputs: `QA/GOVERNING/README.md` is an unstaged tracked QA documentation update; the module's other QA reports, evidence and helpers are untracked QA outputs, including this note.
- Response outputs: the prior timestamped RRM-001 handoff response, the final-export response record, and this ZIP export are untracked response artifacts.
- Product/configuration files remain equal to the pinned candidate; no product repair is included.
- No cleanup report or certification report has been issued. `QA/DIRECTOR_ARCHIVE_RULING.md` is included as the existing archive-disposition record only; it is not a QA cleanup completion.

## Package boundary

The ZIP contains only the requested QA/contract records, this handoff note, and the existing archive-disposition record. It excludes credentials, environment files, browser profiles/sessions, cookies/tokens, raw runtime logs, screenshots and generated application builds.
