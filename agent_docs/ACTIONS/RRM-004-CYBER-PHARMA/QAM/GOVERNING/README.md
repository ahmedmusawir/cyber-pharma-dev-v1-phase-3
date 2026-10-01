# QA/GOVERNING — supplied governing snapshots

Director-supplied on 2026-09-21:

| Document | Declared version / status | SHA-256 |
|---|---|---|
| `QA_PLAYBOOK.md` | **v1.1**, 2026-08-10, Active — field-tested | `b6c70f14af18bb187ca7980954317af486e43b682821245d9911f2160d5198a5` |
| `WEB_FACTORY_P1_DOCTRINE_JOURNAL.md` | **v0.3**, started 2026-09-05, OPEN | `53d41dc4aefde9c849a6faea321cd1d3cf245336e75cfedbd248c2d17f84d301` |

`QA_PLAYBOOK.md` v1.1's version history says the AC-numbering synchronization was incorporated in v1.1. No separate AC-sync patch file was supplied. Neither document embeds its original repository path or source commit; provenance is therefore Director-supplied-to-this-module, with original source revision unavailable.

Applicable journal refinements: J-11/J-12 seat and branch separation; J-15 Cody-as-executor/SOL-as-adjudicator; J-18 QA entry; J-19 post-Gate-Q cleanup; J-20/J-21 erratum/status handling; J-22 bounded retest. J-19 governs the J-13 retention conflict identified as C-5.

Concrete current unmet requirements: AC-304's authenticated navigation matrix is incomplete beyond Director-observed successful login; A-13/logout erratum is absent; AC-206 remains NOT YET; and post-Gate-Q cleanup cannot begin until SOL adjudicates and releases it. The current working tree is not represented as clean.

## Historical P3 note (superseded by the Director-supplied files above)

Written by Claudy at P3, 2026-09-20. P3 asks for a repo-local copy of the project QA playbook that BIM-003 QA used, with version and source path.

**That file is not on disk, so nothing was copied and nothing was substituted.**

- Searched: this repo (all of `agent_docs/`, `_SKILLS/`, `docs/`, root) and, read-only, the sibling repos one level up. No `QA_PLAYBOOK*` file exists.
- What disk does say: `agent_docs/ACTIONS/BIM-000-CYBER-PHARMA/QA/QA_PLAN_BIM-000-CYBER-PHARMA.md:71` cites "`QA_PLAYBOOK.md` v1.1"; `agent_docs/AUTHORITY/PHASE_3_BIM_CAMPAIGN_MAP.md:42` says "QA per QA_PLAYBOOK + AC-sync patch"; `agent_docs/ACTIONS/BIM-003-CYBER-PHARMA/QA/` has no `GOVERNING/` folder.
- Only QA doctrine that IS repo-local: `agent_docs/AUTHORITY/BIM_PLAYBOOK.md` v1.0 §9 "QA Engagement" (verdict vocabulary, evidence bar). Already in the repo — not duplicated here.

**Director action:** drop `QA_PLAYBOOK.md` (the version SOL/Cody used for BIM-003, plus the AC-sync patch if separate) into this folder and record its version + source path in `agent_docs/ACTIONS/RRM-001-CYBER-PHARMA/QA_HANDOFF.md`.
