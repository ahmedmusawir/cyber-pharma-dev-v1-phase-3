# RRM-002-CYBER-PHARMA — Rulings Addendum (append-only)

Contract layer (`CLAUDE.md`, `RRM_BRIEF.md`, `ACCEPTANCE_SPEC.md`, `CLAUDY_PROMPTS.md`) is frozen at engineering handoff. Rulings made after that — in chat, in Plan Mode review, during QA — are written here the same day by the Engineer under an Architect/Director instruction, with provenance, and never edited into the frozen files. Audit rulings (P1b) also land in the spec erratum lane and the campaign ledger errata table (next free E-NN, verified on disk).

| ID | Date | Seat | Question raised (path:line) | Ruling | Affects (AC / stage) |
|---|---|---|---|---|---|
| A-01 | 2026-09-23 | Architect / Director | C-1 — `round2` is a non-exported const in frozen `src/services/owedbook.ts:56`; `format.ts` lacks it | Add `export const round2 = (n: number) => +n.toFixed(2);` to `src/components/owedbook/format.ts`, byte-identical expression to `:56`. AC-106 "no new rounding helper" reads as "no new rounding logic". | AC-106; S1 |
| A-02 | 2026-09-23 | Architect / Director | C-2 — ledger errata lane placeholder `E-10…` above real E-10/E-11 | Placeholder row removed at this step; next free campaign erratum is E-12. | ledger |
| A-03 | 2026-09-23 | Architect / Director | C-6 — AC-104 tab-switch behavior | Pinned: switching back to Summary re-requests summary rows (effect deps include `activeTab`); footer returns after the skeleton. | AC-104 |
| A-04 | 2026-09-23 | Architect / Director | C-7 — two docs-only commits above `<baseline>` instead of one | Recorded; product diff empty; no effect. | P1 |
| A-05 | 2026-09-23 | Director | Audit rows A-1…A-12 ruled | A-1, A-3, A-8, A-9, A-10 CORRECT — record only. A-2b TAKEN (E-12). A-2 FLAG-ONLY → fixture regeneration belongs to BIM-004 seed (E-13). A-4, A-12 FLAG-ONLY → Phase 5 parity harness (R-003). A-5 FLAG-ONLY → Phase 5 UI ruling. A-6 FLAG-ONLY → Frank rider R3 via Coach. A-7 FLAG-ONLY → Phase 5 federal math; BIM-005 note. A-11 FLAG-ONLY → Phase 5 pbm_info matching (E-14). S2 has exactly one hunk. | AC-201–204; S2 |
