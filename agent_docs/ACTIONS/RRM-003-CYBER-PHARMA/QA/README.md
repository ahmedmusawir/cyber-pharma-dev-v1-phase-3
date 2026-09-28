# RRM-003 QA lane (QA Lead / QA Executor)

The QA Lead authors `QA_TEST_PLAN.md` here at QA entry; the QA Executor's reports, disposable browser helpers and raw evidence stay here; the QA Lead's `QA_CERTIFICATION.md` lands here. `GOVERNING/` receives the QA playbook snapshot copied by the Engineer at handoff from `agent_docs/ACTIONS/RRM-002-CYBER-PHARMA/QA/GOVERNING/` with a fresh `PROVENANCE.md`.

Lesson from RRM-002 QA (field note 2026-09-28): run an environment preflight for the SCRATCH test accounts (ADMIN and MEMBER exist with the right roles, project awake) **before** the QA Executor opens a browser. The Director enters credentials in the browser (DC-4), never in a file.

Architect risk notes (input, not the plan): attack the focus trap with a real keyboard, not only jsdom — Tab from the last drawer element, Shift-Tab from the first, and the nested-Escape order (picker first, drawer second) · Enter and Space on a sortable header must produce the same `aria-sort` cycle as click; Space must not scroll · re-capture the cache headers from your own build (AC-202) and check the three negative controls still say `no-store` · the three SQL banners must be the only change in those files (byte-identical below line 1) · `supabase/migrations/**` byte-identical · the `(admin)` group changes by exactly one line · DA-2 status in DB_BASELINE.md must match what is actually in RRM-001's evidence folder, not what the Engineer hoped · the pilot's §Metrics are evidence for the campaign journal; note anything that contradicts them.

Finding classes and statuses per the governing playbook. Bounded J-19 cleanup after Gate Q; `RECOVERY.md` and `agent_docs/SESSIONS/**` untouched.
