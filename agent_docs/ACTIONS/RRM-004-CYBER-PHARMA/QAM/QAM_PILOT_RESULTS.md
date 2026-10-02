# QAM Pilot Results — RRM-004-CYBER-PHARMA (10X Lab export)

Q2 attempt 1 + Q5 attempt 1; Executor records observations, QA Lead owns verdict. §4–§5 remain unchanged and blank.

## 1. The command and the clock

| Field | Value |
|---|---|
| Q1 command (verbatim) | “Start QAM here: agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/ Read QAM_ENTRY.md and follow its Q1 instructions.” |
| Q2 command | Verbatim block below; start 2026-10-01T17:06:28+06:00 |
| Q5 command/start/return | Director Q5 instruction preserved verbatim in evidence/Q5/director_authorization.md; recorded start 2026-10-02T06:59:57+06:00; sequence complete 2026-10-02T07:02:04+06:00; export/release timestamp in HANDOFFS verification receipt |
| Credential file created / deleted | Creation timestamp not independently observed; present and ignored at Q1/Q2. Deleted and verified 2026-10-02T07:00:38+06:00 |
| Q1 start / first return | 2026-10-01T13:29:22+06:00 / 2026-10-01T13:49:27+06:00 |
| Q1 interpretation interruption | Q4 13:42:29 → Q1b resolution 16:51:01 +06:00; preserved, not Q2 active time |
| Q2 start / measurement-body completion | 2026-10-01T17:06:28+06:00 / 2026-10-01T17:16:36+06:00 |
| Q2 report/export return timestamp | Recorded at packaging in evidence/q2_final_checks.json and HANDOFFS verification JSON |
| Wall-clock Q2 → measurement-body completion | 10m08s; report/export time recorded separately in final checks |
| Executor active time | Not independently instrumented; continuous phase elapsed is an upper bound, not an attention-time measurement |
| Director active time | Not instrumented; zero observed interventions inside Q2 |

Q2 command, verbatim:

> tree is clean ... QA EXECUTOR — RRM-004-CYBER-PHARMA QAM, Q2.
> 
> Read agent_docs/ACTIONS/RRM-004-CYBER-PHARMA/QAM/QAM_ENTRY.md and run Q2 from QAM_PROMPTS.md using the approved QAM_TEST_PLAN.md.
> 
> Verify the committed approval/A-15, clean tree and full current QA HEAD. Confirm successors of product candidate 2fbc72f1f514049255f2b94054bd11cc77cbd158 are documentation-only.
> 
> Execute the approved plan, stopping only on an enumerated Q-stop. Return the indexed review ZIP under QAM/HANDOFFS/ and its exact path. No self-certification, Git mutation or Q5 cleanup.

## 2. Metrics

| Metric | RRM-002 QA | RRM-003 QA | RRM-004 QAM |
|---|---|---|---|
| Wall-clock | two-part run | 74m55s active, two segments | Q1 first return 20m05s; Q2 measurements 10m08s / release 17m21s; Q5 cleanup sequence 127s; Q5 report/export elapsed in verification receipt |
| Director touches inside Q2 | credentials only | 8 (1 ruling, 7 sign-ins) | 0 credential entry / ruling / spot-check / other |
| Sign-ins per role — Q1 | — | — | ADMIN 1 / MEMBER 1, original QF-16 evidence |
| Sign-ins per role — Q2 | — | ADMIN 3 / MEMBER 4, human | ADMIN 1 / MEMBER 1, automated; both logged out |
| Director credential entries during execution | credentials only | 7 | 0 |
| Interruptions (Q-stops) | 1 environment | 1 environment | Q1 one Q4 resolved by A-15; Q2 zero; Q5 zero |
| Preflight failures | no preflight | discovered late | Q1 zero; Q2 zero, 17 measured rows and QF-16 covered by walk |
| Unenumerated stops | — | — | 0 |
| Product findings by class | 0 defects | 0 defects + 1 observation | 0 implementation defects; 1 non-blocking later-release observation; AC-606 Q5 PASS |
| Repair rounds | 0 | 0 | 0 product repairs; 1 Q2 QA-only helper self-repair; 2 Q5 wrapper corrections, no scanner repair |
| Helpers written / promoted / retained | — | 3 retained | 5 new Q2 measurement helpers, 1 existing export adapter reused, 2 original Q1 helpers retained; 0 promoted |
| Evidence files / retained artifacts | — | 76 | 134 evidence files / 171 inventoried durable artifacts at Q5 cutoff; export member count in FILE_INDEX/verification receipt |
| Privacy self-test | — | — | planted secret detected, clean control clean; QF-17 PASS |
| Current privacy scans | 0 leaks | 0 leaks | value 0 / pattern 0; documentation mentions listed in privacy_audit.json; export checked separately |
| Actual leaks / resolutions | — | — | 0 / none |
| Env/auth/profile cleanup | n/a | n/a | Q5 env deleted; all 4 recorded temp paths absent; no editor recovery files or QA server; post-deletion pattern scan 0 leaks |

Comparison provenance: `GOVERNING/WEB_FACTORY_P1_DOCTRINE_JOURNAL.md`, `QAM_PILOT_CHARTER.md`, (`agent_docs/ACTIONS/RRM-003-CYBER-PHARMA/QA/ONE_SHOT_QA_OBSERVATIONS.md`), and `agent_docs/RRM_CAMPAIGN_JOURNAL.md` RRM-002/RRM-003 entries. Historical comparison columns are cited artifacts, not remeasured runs.

## 3. Executor observations (process only)

- One Director command covered the entry gate, preflight, independent measurements, role matrix and review export. No manual login/matrix request or target substitution.
- Main-dev authorization and fingerprint were retained; credentials remained confined to browser/scanner helpers. Q2 produced 28 safe image cells and cropped captures without raw authenticated tracing.
- The metadata helper initially assumed sharp exported package.json; the installed-file read fixed the QA helper and the failed attempt was preserved. Numeric version controls independently rejected invalid input.
- Engineering metrics/hygiene are verified historical artifact contents; no report relabels them as witnessed QA execution.
- No product repair or additional scope is proposed. Human decisions still needed: QA Lead cleanup review/certification/pilot verdict and Director commit/clean-tree verification/rotation. Privacy and cleanup requirements are not waived.
- Existing validated scanner and Q1 export path adapter are reused. Prior ZIPs/attempt evidence stay unchanged; no measurement is rerun for packaging.

- Q5 introduced no new helper, login, build or test-board execution. It reused the validated scanner. Two cleanup-wrapper corrections are recorded with initial attempts; neither was an actual leak or enumerated stop.
- Q5 Director touches inside execution: 0 credential entry / ruling / spot-check / other; initiating command is a checkpoint touch, counted separately. The relay acceptance and Q5 command form one Director checkpoint instruction, not a test intervention.
- Recorded Q5 cleanup sequence elapsed 127s. Pre-command reading and active attention were not independently instrumented; report/export elapsed ends at the external release receipt timestamp. This is an elapsed-time bound, not a claimed speedup or attention measurement.
- Final inventory and FILE_INDEX record evidence/artifact counts; release receipt records ZIP count and checksum. QA Lead and Director verdict/rotation rows below remain untouched.

## 4. QA Lead — pilot verdict (separate from Gate Q)

| Field | Value |
|---|---|
| AC-701…AC-710 grades | AC-701–709: accepted PASS. AC-710: PASS through this QA Lead review and certification. (QA Lead, 2026-10-02 — `QAM_CERTIFICATION.md`; transcribed by the Engineer at P5) |
| Pilot verdict (success / partial / fail per charter) | **PARTIAL SUCCESS** under the charter's recorded-Q-stop rule. Reason: Q1 raised a contract/scope stop, resolved through A-15 and Q1b; that history is preserved. Q2 one-shot execution itself SUCCEEDED: zero Director interventions during Q2; one automated sign-in per role; zero Q2 enumerated or unenumerated stops; one QA helper correction handled and documented independently (Q2-SR01). Measurement body 10m08s; reported release elapsed 17m21s. These figures exclude earlier preparation and Q1 resolution, so this is not an end-to-end 10-minute QA process. |
| Keep / change / drop | KEEP: recon before execution, independently approved plan, automated role coverage, indexed handoff ZIPs and bounded cleanup. CHANGE: resolve scope exceptions before Q1; make both CLAUDE.md and AGENTS.md reliable, model-neutral entry points in future module designs; standardize exports directly under QAM/HANDOFFS/. DROP: manual file hunting and repetitive Director browser matrices. These are 10X Lab findings, not automatic changes to production QA doctrine. |

## 5. Director — DC-7

| Field | Value |
|---|---|
| QAM shape for BIM-004 and the next campaign: adopt / amend / drop | |
| QA passwords rotated (QC-5) `date` | |
| Notes | |
