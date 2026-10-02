# QAM Pilot Charter — RRM-004-CYBER-PHARMA

**Version:** v1.1, 2026-09-30 — Architect, from the QA Lead's pilot plan v0.1, the Architect's QAM opinion (2026-09-29) and the QA Lead's rulings of 2026-09-30 · **Ratified by: QA Lead, 2026-10-01 — approved for Q1 recon and plan drafting with A-14 applied. Q2 requires separate QA Lead approval of the recon-informed test plan.** · **Frozen at:** the Director's Q1 command (QC-1).

## What the pilot is

The first run of a **QA Module (QAM)**: a prepared folder that holds everything a QA Executor needs to verify one engineering candidate in one session, started by one Director command. RRM-002 proved agent-driven browser QA with the Director handling credentials only; RRM-003 proved the one-shot shape on the Engineering side (preflight gate, enumerated stops, declared checkpoints, one commit). The QAM applies the RRM-003 shape to QA and adds the one line the previous modules never made structural: **the seat that built the candidate does not write the plan that tests it.**

RRM-004 is the right first candidate: bounded (a dependency bump), high blast radius (the only module that can break everything at once), every product proof mechanical (versions, audit, metadata read, builds, headers, image responses), and one authenticated browser walk with no new flow to invent.

## What the pilot measures (and what it does not)

Two verdicts, never mixed:

| Verdict | Criteria | Issued by | Recorded in |
|---|---|---|---|
| **Gate Q** (product) | `ACCEPTANCE_SPEC.md` AC-100…AC-600 | QA Lead | `QAM_CERTIFICATION.md` |
| **Pilot verdict** (process) | AC-700 + the metrics below | QA Lead (metrics by the Executor; Director acknowledges at DC-7) | `QAM_PILOT_RESULTS.md` |

A clean product with a messy pilot is a Gate Q PASS with lessons. A perfect pilot on a failing product is a Gate Q FAIL. The pilot never rescues or blocks the product.

## Authorship split (DD-4, Rulings 2 and 3)

| Half | Content | Author |
|---|---|---|
| **Manifest** (facts) | candidate identity, baseline, branch, provenance; reproduction (install, build, serve, exact probe lines); changed-file inventory and product diff; environment (services, ports, identities and roles required, tools); the Engineer's measurements **labeled as claims**; evidence schema | Engineer, at handoff |
| **Plan** (judgment) | risk ranking — what to attack first; how to attack it; negative controls — what must still be true; reference values derived independently and the derivation rule; the instrument to corrupt deliberately; finding classification rules | **QA Executor drafts in Q1** from the frozen spec, `QAM_RISK_REQUIREMENTS.md`, the manifest and recon; **QA Lead amends and approves** before Q2 (Ruling 2). The QA Lead's standing requirements travel in the QAM so the Director installs no second QA file |
| **Law** (static) | `QAM_ENTRY.md` (model-neutral start), `AGENTS.md` (seat boundaries, phases, Q-stops, evidence rules), `QAM_PREFLIGHT.md`, `QAM_CHECKPOINTS.md` | Architect from the rulings; QA Lead ratifies. Cody is a persistent seat with a swappable model, so his law is `AGENTS.md`, never `CLAUDE.md` (Ruling 3) |

The Executor consumes all three and writes only evidence, reports, proposals and metrics.

## The RBM / repair proposal

When a product AC fails, the Executor **drafts** `REPAIR_PROPOSAL.md`: finding IDs, evidence paths, affected ACs, a suggested allowed-file list, a suggested retest scope. It is a proposal. The QA Lead classifies (implementation defect / contract gap / environment / instrument); the Architect rules scope and issues the P4 repair prompt; the Director commits. The Engineer receives nothing until the scope ruling. The QA seat never writes an engineering contract.

## Metrics (Executor fills; comparison columns from the journal and RRM-003's `ONE_SHOT_QA_OBSERVATIONS.md`)

| Metric | RRM-002 QA | RRM-003 QA | RRM-004 QAM |
|---|---|---|---|
| Wall-clock, Q2 command → Executor return (Q1 and Q5 recorded separately) | two-part run (replica pause) | 74m55s active over two segments | |
| Executor active time | — | 74m55s | |
| Director active time / touches | credentials only | 8 touches (1 ruling, 7 sign-ins) | target: QC-1 env file + Q1/Q2/Q5 commands only; **0 inside Q2** |
| Interruptions (stops) | 1 environment (QA-F01) | 1 environment (QA-F01, SCRATCH absent) | target 0 (Q1 recon is a planned stop, not an interruption) |
| Preflight failures | no preflight | entry gate only; SCRATCH readiness discovered late | target 0 (QF-01…QF-18 gate incl. credential rows) |
| Product findings by class | 0 defects | 0 defects; 1 non-blocking observation (QA-F02) | |
| Repair rounds | 0 | 0 | |
| Helpers promoted / retained | 0 | 3 retained by Director ruling | |
| Evidence files | — | 76 | |
| Sign-ins per role, by phase | — | ADMIN 3, MEMBER 4 (Director at keyboard) | Q1 (QF-16 login/logout) target 1 / 1 · Q2 (walk) target 1 / 1 — automated from `.env.qa.local` (A-13 d) |
| Director credential entries during execution | — | 7 | target 0 |

## Pilot success (process)

The pilot **succeeds** if: Q2 ran from one command to the return with zero unenumerated stops and zero Director touches; every preflight row was measured before the body, at Q1 and Q2; the plan was drafted by the Executor and approved by the QA Lead after handoff; one automated sign-in per role per phase (Q1 QF-16, Q2 walk), zero Director credential entries; the scanner caught its planted secret and passed its clean control; `.env.qa.local`, all auth state and temporary browser profiles deleted with proof; both privacy scans at 0 leaks, any leak recorded with its resolution; the QA Lead certified from the matrix, the evidence map and the cleanup report. It **partially succeeds** if a Q-stop occurred, was logged with its number, and was resumed without a manual matrix. It **fails** if the Executor edited anything outside its lane, self-certified, or needed an unenumerated Director instruction to proceed — and that failure is written down as the lesson, not hidden.

## Export

`QAM_PILOT_RESULTS.md` is the 10X Lab export. This is an experimental pilot: nothing in it is promoted into production QA doctrine until it is measured and reviewed. The Director rules at DC-7 whether the QAM shape is adopted, amended or dropped for BIM-004 and the next campaign.
