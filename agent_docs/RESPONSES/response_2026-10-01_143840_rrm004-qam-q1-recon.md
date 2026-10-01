I’d hand off **one Q1 review bundle** containing:

| Include | Purpose |
|---|---|
| Entire [QAM folder](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM) | Draft plan, stop report, preflight/recon/auth/privacy evidence, both automation helpers, manifest and governing instructions. |
| [Original Q1 recon report](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/RESPONSES/response_2026-10-01_134927_rrm004-qam-q1-recon.md) | Readable summary of results and the unresolved Q4 stop. |
| [ACCEPTANCE_SPEC.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/ACCEPTANCE_SPEC.md) and [RULINGS_ADDENDUM.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RULINGS_ADDENDUM.md) | Frozen criteria and all existing amendments. |
| [CLAUDY_PROMPTS.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/CLAUDY_PROMPTS.md) | P0 instructions needed to adjudicate the AC-403 conflict. |
| [RRM_BRIEF.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/RRM_BRIEF.md) and [QA_HANDOFF.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QA_HANDOFF.md) | Allowed scope/dependency families and the Engineer’s claims. |

Ask the QA Lead to read these first:

1. [QAM_EXECUTION_REPORT.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_EXECUTION_REPORT.md) — Q4 and its evidence.
2. [QAM_TEST_PLAN.md](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_TEST_PLAN.md) — proposed Q2 execution and approval target.
3. [QAM_PREFLIGHT_Q1.txt](/home/moose/nextjs/CYBER_PHARMA/cyber-pharma-dev-v1-phase-3/agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/evidence/QAM_PREFLIGHT_Q1.txt) — the 18 passing gates.

**Decisions needed:** resolve Q1-C01/AC-403, review the proposed interpretation and coverage, and provide plan amendments plus an explicit approval line/date. Any contract amendment goes to the Engineer for the append-only addendum/erratum before Q2.

Keep repository-relative paths in the bundle so evidence links remain usable. Exclude `.env*`, `node_modules/` and `.next/`. The AC matrix and pilot-results files are still scaffolds; this handoff is for **Q1 verification and Q2-plan approval**.
