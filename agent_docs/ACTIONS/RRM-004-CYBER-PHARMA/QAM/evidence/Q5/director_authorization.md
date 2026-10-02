# Director instruction — Q5 (received 2026-10-02)

The Director relayed QA Lead acceptance of RRM004_QAM_Q2_REVIEW.zip for progression to cleanup. No product repair is requested. The later Next release is informational under the approved P1 cutoff; the recorded metadata-helper correction is QA helper repair.

Authorized sequence: verify candidate 2fbc72f1f514049255f2b94054bd11cc77cbd158 and Q2 HEAD 6b6cad642f69314904938e9df1ec8fdfbe08f15a; scan credential values and required encodings while .env.qa.local exists; delete and verify the env file; remove identified QA auth state/profiles and handle editor recovery files by name only; post-deletion pattern scan and server check; bounded cleanup, reports, inventory and Executor pilot metrics; final indexed privacy-checked Q5 review ZIP under QAM/HANDOFFS/. Preserve Q1/Q2 attempts. No test-board rerun, product/dependency edits, Git mutation or self-certification.

Authority: Director's Q5 message in this conversation, following QA Lead review. This is a faithful instruction summary, not a new ruling or certification. The full operative cleanup rules remain QAM_PROMPTS.md Q5 and A-13/A-14.

## Director Q5 command — verbatim

```text
QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q5.

The QA Lead has reviewed RRM004_QAM_Q2_REVIEW.zip and accepts the Q2 evidence for progression to cleanup. No product repair is requested. The later Next release is informational under the approved P1 cutoff; the recorded metadata-helper correction is QA helper repair.

Read:
agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md

Run Q5 from QAM_PROMPTS.md under the existing rulings and approved plan.

Tested product candidate:
2fbc72f1f514049255f2b94054bd11cc77cbd158

Q2 QA HEAD:
6b6cad642f69314904938e9df1ec8fdfbe08f15a

Verify identity before cleanup. Preserve the Q1/Q2 evidence and historical attempts. Do not rerun the test board, change product files, change dependencies, or perform Git mutations.

Follow the required sequence:
1. Scan credential values and required encodings while .env.qa.local still exists. Resolve and record any actual leak without exposing its value.
2. Delete .env.qa.local and verify removal.
3. Remove identified QA-created authentication state and temporary browser profiles; verify their removal. Handle editor recovery files exactly as the existing Q5 instructions require.
4. Run the post-deletion pattern scan. Preserve both scan results and confirm no QA server remains running.
5. Complete bounded cleanup, QAM_CLEANUP_REPORT.md, the artifact inventory, execution report and Executor-owned pilot metrics. Update AC-606 only from actual evidence. Leave certification and QA Lead/Director verdict sections to their owners.

Prepare one final indexed review package:
agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/HANDOFFS/RRM004_QAM_Q5_REVIEW.zip

Include the cleanup report, updated matrix, execution report, inventory, pilot results, privacy/removal proofs and relevant authority records. Reference the unchanged Q2 package for previously reviewed evidence; do not nest earlier ZIPs.

Check export privacy and archive integrity. Return the exact ZIP path/checksum, cleanup outcome, any unresolved item and selective staging commands for the Director. Do not stage, commit, push or self-certify.
```
