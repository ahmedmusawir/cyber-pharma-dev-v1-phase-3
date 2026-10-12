🔵 **ENTERING PLAN MODE.** Task: Frank pilot R-1 recon, read-only.

## Step 0: entry record, taken before any write (13:26:30 +06:00)

- **Branch:** `pilot-recon-r1`.
- **HEAD:** `a4c82e1ae9d603a83021831d39c4c3f1ea73aaff`. This is not `5234abe`. It is the one documentation commit that installed the prompt. It touches the prompt file, `RECOVERY.md`, `CHANGELOG.md`, today's session log, and the 18 RESPONSES records moved into `_OLD/`. It changes nothing under `src/`, `scripts/`, `supabase/` or `package*.json`, so it is not an app change.
- **`main` and `origin/main`:** both are `5234abe9ee4a076e0ddacdc69353e9f08246b4cd`. `origin/main` is not ahead, and `5234abe..origin/main` is empty.
- **Working tree:** `git status --porcelain` was empty, so the tree was clean.
- **Recon skill:** none found. `.claude/skills` doesn't exist, and the grep only matched campaign documents that mention recon. I'm proceeding with the prompt alone.
- **Scratch directory:** `/tmp/cyph-recon-r1.4VcGyN` exists and is empty.
- **Scanner:** none, as you told me. The secrets scan will be marked "NOT COMPLETED — no scanner installed", and I'll install nothing.
- **Origin URL:** a plain https GitHub URL with no credentials in it.

The session log now has a PENDING_APPROVAL entry. That entry is the only write so far.

## Plan for steps 1–9 (all read-only except the report and session log)

1. **Secrets scan:** marked NOT COMPLETED, and I won't substitute a grep over history. The step also asks for a list of credential-shaped filenames ever added to history, and that runs against the clone. See question 4 for whether I still clone.
2. **Instruction files:** I'll list instruction-shaped files at the repo root and under `agent_docs/`, including `.github/` if present. I'll state what this session actually loaded at start: the root `CLAUDE.md` plus my memory index, and nothing else. Anything else gets marked "not observed", and GPT/Codex behaviour gets marked "not known from here".
3. **Environment variables:** where `REQUIRED_ENV` is defined and which names it holds, where `SUPABASE_SECRET_KEY` is read, and which non-test files import the admin client. I'll include the count of `process.env` names used under `src/`, and confirm or correct the 2026-10-06 finding that only `admin.ts` uses the secret.
4. **Logout and auth routes:** I'll find the logout code, read each hit, and describe the mechanism as file:line plus one-line summaries. I'll list the auth route handlers under `src/app`.
5. **Seed and reset scripts:** I'll read `seed.mjs`, `db-reset.mjs`, `db-verify.mjs` and `RUN_NOTES.md` and report the following:
   - which environment variables each one reads
   - which tables it writes to or purges
   - what guards it has besides `DB_RESET_ALLOW`
   - how it parses the connection string, and whether it checks the host or username

   These are descriptions only, with no row counts. Any embedded credential will appear only as "embedded literal present at path:line".
6. **Runtime and tooling:** the `engines` field, or "none declared"; the declared versions of `next`, `@playwright/test`, `jest`, `typescript` and `eslint`; and the env lines in `.gitignore`.
7. **Routes and role gates:** every `page.tsx` and `layout.tsx` under `src/app`, the role check in each layout, which routes a MEMBER could reach, and where login lands. All of this will be labelled "inferred from source; not exercised".
8. **CI:** whether `.github/` exists, and if so its workflows, triggers and the secret names they reference. Also the `package.json` scripts and the variable names a placeholder-env build would need. I won't run a build.
9. **Report:** sections 0–8, the table comparing against the 2026-10-06 findings, the setup facts the kit and VIK need, and the scan coverage and limitations. Then I delete the scratch directory, run `git status --porcelain` (it should show only the session log and the report), give the four-line checkpoint, and stop.

I won't touch any tracked file except the session log. That means no `npm` commands, no build, no app run, no git changes, no branch switch, and no edit to `RECOVERY.md`.

## Rulings I need: root protocol vs. the prompt's write contract

The contract says to stop and ask rather than write, so I need these decided first:

1. **Plan file in RESPONSES.** The root protocol and your standing preference say every plan gets mirrored to `agent_docs/RESPONSES/`. The contract allows only the final report there, so I have not written this plan to disk. **Should I add a `response_…_pilot-recon-r1-plan.md`?** My recommendation is yes, as a fourth permitted write.
2. **Report location.** The prompt names `agent_docs/RESPONSES/…_pilot-recon-r1.md`. Your standing rule (from 2026-09-18) says recon reports belong in `agent_docs/RECON/`. **Which folder?** My recommendation is `agent_docs/RECON/FRANK_PILOT/`, next to the prompt, unless the QA Lead needs the RESPONSES path.
3. **RECOVERY.md at the end.** The root protocol requires updating it after a plan completes, but the contract forbids it. **My default is to skip it**, record that in the session log, and let you update it.
4. **Clone without a scanner.** The heading of step 1 reads "only with an installed scanner", but the filename-only list for step 1 needs the fresh clone, and the contract allows that one clone. **Should I still clone `main` into the scratch directory just for that list?** My recommendation is yes. If not, that list is also marked NOT COMPLETED.

→ Waiting for your approval and the four rulings before I run steps 1–9.

---

**Late-write note (13:29):** this file was written after the plan was already shown on screen, when Tony asked "where the hell is my response file?". The text above is the plan exactly as it was displayed. That treats ruling 1 as answered "yes": a plan file in RESPONSES is a fourth permitted write.
