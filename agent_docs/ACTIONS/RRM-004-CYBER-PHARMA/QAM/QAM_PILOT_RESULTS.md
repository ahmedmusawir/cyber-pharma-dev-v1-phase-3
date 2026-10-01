# QAM Pilot Results — RRM-004-CYBER-PHARMA (10X Lab export)

Executor fills §1–§3 at the end of the run; QA Lead fills §4; Director fills §5 at DC-7.

## 1. The command and the clock

| Field | Value |
|---|---|
| Q1 command (verbatim, as given) · `date -Is` | |
| Q2 command (verbatim, as given) · `date -Is` | |
| Q5 command · `date -Is` | |
| `.env.qa.local` created (QC-1) / deleted (Q5) `date -Is` | |
| Q1 start / return · Q2 start / return · Q5 start / return | |
| Wall-clock Q2 command → return | |
| Executor active time | |
| Director active time | |

## 2. Metrics

| Metric | RRM-002 QA | RRM-003 QA | RRM-004 QAM |
|---|---|---|---|
| Wall-clock | two-part run | 74m55s active, two segments | |
| Director touches inside Q2 (classified) | credentials only | 8 (1 ruling, 7 sign-ins) | target 0 |
| Sign-ins per role (automated) | — | ADMIN 3, MEMBER 4 (human) | target 1 / 1 |
| Interruptions (Q-stops) | 1 environment | 1 environment | |
| Preflight failures | no preflight | discovered late | |
| Unenumerated stops | — | — | |
| Product findings by class | 0 | 0 + 1 observation | |
| Repair rounds | 0 | 0 | |
| Helpers written / promoted / retained | — | 3 retained | |
| Evidence files | — | 76 | |
| Privacy scan hits (value mode / pattern mode) | 0 | 0 | |
| Env file + auth state deleted with proof | n/a | n/a | |

## 3. Executor observations (process only)

- Fully autonomous checks: <…>
- Human judgment still needed: <…>
- Tooling or environment gaps: <…>
- Reusable automation: <…>
- What the manifest lacked / what the plan lacked: <…>

## 4. QA Lead — pilot verdict (separate from Gate Q)

| Field | Value |
|---|---|
| AC-701…AC-710 grades | |
| Pilot verdict (success / partial / fail per charter) | |
| Keep / change / drop | |

## 5. Director — DC-7

| Field | Value |
|---|---|
| QAM shape for BIM-004 and the next campaign: adopt / amend / drop | |
| QA passwords rotated (QC-5) `date` | |
| Notes | |
