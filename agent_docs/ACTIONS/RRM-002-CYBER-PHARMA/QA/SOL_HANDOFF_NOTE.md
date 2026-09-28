# RRM-002-CYBER-PHARMA — SOL handoff

Candidate `34e6fb6fd8c4e5c6610f4b0f49177abcb6cc0731` remains the tested product specimen beneath documentation-only HEAD `cb9f7b7e707f206f019b40c7079487888cc14d03` on `qa/phase-3-rrm002`. The pinned static, fixture, race and frozen regression-board evidence is in `QA_EXECUTION_REPORT.md` and `AC_EVIDENCE_MATRIX.md`; none of those passing checks was rerun after the Director's AC-304 ruling.

AC-304 used the Director-authorized **base CyberPharma auth environment**. Existing ADMIN and MEMBER accounts reached `/owedbook` through Director-entered browser logins. The automated Playwright matrix completed 16 Summary states: both roles, desktop/375px, light/dark, default/named-PBM. Every default state showed one exact **$20.27** note; every named-PBM state hid it. Filter-transition observers recorded no stale note, and both roles passed two consecutive Clear actions and tab visibility checks. See `raw/auth_admin_matrix.json`, `raw/auth_member_matrix.json`, `SCREENSHOT_TRACE_INVENTORY.json` and `raw/ac304_environment.json`.

Classification input **QA-F01**: earlier authentication unavailability was an **Environment / Setup Issue** caused by the replica free-tier pause. The Director reactivated it, then superseded it with the base-environment ruling. It is not a product defect. The initial ADMIN browser-helper click obstruction was corrected within the QA lane and is not a product finding. QA-O01 remains a search-context observation. Protected auth values and browser state were absent from repository evidence (`raw/config_value_scan.json`).

This is evidence for SOL adjudication, not a QA verdict, Gate Q recommendation or certification. No final QA cleanup, staging, commit, push or merge was performed.
