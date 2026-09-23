# RRM-002-CYBER-PHARMA — Fixture and copy audit (AC-201) — rulings applied at P1b (2026-09-23); finalized at S2

**Engineer** · 2026-09-23 15:01 · baseline `1cd6e465ebbfeb0842738fcbab1ffbe65e2dbe6b` · `src/mocks/owedbook.ts` 150 rows · nothing edited. Director rulings applied at P1b (`RULINGS_ADDENDUM.md` A-05; campaign errata E-12/E-13/E-14). S2 applies the single ruled hunk (E-12) and re-verifies this file.

## Summary table (mirrors S0 plan §3)

| # | Rule | Path:line | Current value / text | Classification | Director ruling (P1b) |
|---|---|---|---|---|---|
| A-1 | 1 FEE | `src/`, `docs/`, `README.md` | `11.85` 0 hits · `10.64` 0 hits | CORRECT | CORRECT — record only (A-05) |
| A-2 | 3 EXPECTED | `src/mocks/owedbook.ts:14-162` | expected == round2(qty × medicaid_rate + 10.64): pass 1 / fail 149 (rows below) | VALUE-CONFLICT FLAGGED | FLAG-ONLY (E-13): fixture regeneration with real rates → BIM-004 seed scope; owner Architect; no frontend recomputation |
| A-2b | 3 (copy) | `src/mocks/owedbook.ts:5-6` | header comment does not state the rule-3 conflict | COPY-CORRECTION PROPOSED (optional) | TAKEN (E-12): one comment line at `src/mocks/owedbook.ts:5-6`, applied in S2 — the only S2 hunk |
| A-3 | 2 OWED (row) | all rows | owed == round2(expected − original_paid): pass 150 / fail 0; negative owed 28, zero 1 | CORRECT | CORRECT — record only (A-05) |
| A-4 | 2 OWED (aggregate) | `src/services/owedbook.ts:73,116` · `0044:68,71` · `0046` | positive-only aggregates (clamp at aggregate level) | FLAG-ONLY | FLAG-ONLY → Phase 5 parity harness (R-003); owner Architect |
| A-5 | 2 (presentation) | `src/components/owedbook/columns.tsx:8-9,35,46,58` | posNeg colours negatives destructive | FLAG-ONLY | FLAG-ONLY → Phase 5 UI ruling; owner Director / Frank |
| A-6 | 4–5 METHOD | `src/mocks/owedbook.ts` method | NADAC 27 · MAC 38 · AAC 61 · WAC 24 vs {AAC, FUL, GWAC, BWAC, Take Action, Manual Override} | FLAG-ONLY | FLAG-ONLY → Frank rider R3 via Coach |
| A-7 | 3 vs federal | 139 federal rows · `src/types/OwedBook.ts:24` | federal_expected == round2(aac × qty): 137/139; federal_diff == fe − original_paid: 132/139; sign 132 neg / 7 pos | FLAG-ONLY | FLAG-ONLY → Phase 5 federal math; owner Architect / Frank; BIM-005 note |
| A-8 | 6 PBM KEY | `src/**` copy | 0 hits (PBM key / BIN / editable) | CORRECT | CORRECT — record only (A-05) |
| A-9 | 7 POINT-IN-TIME | `src/**` copy | 0 hits (reprice / current price); `FilterRail.tsx:174,180` re-pull copy only | CORRECT | CORRECT — record only (A-05) |
| A-10 | AC-105 | `src/mocks/owedbook.ts` | 0 money values beyond 2 dp | CORRECT | CORRECT — record only (A-05) |
| A-11 | 5 vs Frank Ruling 5 | `src/mocks/owedbook.ts:15,27,117,150` · `OwedBook.ts:28-33` | null-PBM rows carry recovered/new/new/underpaid; no "Take Action" status | FLAG-ONLY | FLAG-ONLY (E-14) → Phase 5 pbm_info matching; owner Architect |
| A-12 | (R-003) | `src/services/owedbook.ts:76,81` · `KpiTiles.tsx:18,21` | Owed tile == Commercial Underpaid tile | FLAG-ONLY | FLAG-ONLY → Phase 5 parity harness (R-003); owner Architect (A-05) |

## Grep evidence (rule 1, 6, 7)

```
$ grep -rn "11\.85" src/ docs/ README.md        → 0 hits
$ grep -rn "10\.64" src/ docs/ README.md        → 0 hits
$ grep -rniE "pbm key|\bBIN\b|reprice|re-price|current price|current rates?|dispensing fee" src/ docs/ README.md → 0 hits
$ grep -rn posNeg src/  → columns.tsx:8 (def), :35 owed, :46 updated_difference, :58 federal_diff
```

## Rule 3 — expected vs round2(qty × medicaid_rate + 10.64): pass 1, fail 149 (listed, NOT fixed)

Passing: claim_100 (L34, qty 30 × 0.1459 + 10.64 = 15.02)

| id | line | qty | medicaid_rate | expected (fixture) | qty×rate+10.64 | method | pbm |
|---|---|---|---|---|---|---|---|
| claim_061 | 14 | 30 | 0.0938 | 22.34 | 13.45 | NADAC | OptumRx |
| claim_134 | 15 | 30 | 0.063 | 7.2 | 12.53 | MAC | null |
| claim_034 | 16 | 60 | 70.4481 | 4716.19 | 4237.53 | NADAC | OptumRx |
| claim_064 | 17 | 30 | 0.0467 | 7.2 | 12.04 | AAC | Prime Therapeutics |
| claim_019 | 18 | 30 | 0.0618 | 10.8 | 12.49 | NADAC | Prime Therapeutics |
| claim_108 | 19 | 45 | 0.0576 | 9.26 | 13.23 | WAC | OptumRx |
| claim_138 | 20 | 1 | 0.1888 | 106.62 | 10.83 | AAC | DST |
| claim_004 | 21 | 30 | 0.0461 | 17.36 | 12.02 | NADAC | OptumRx |
| claim_025 | 22 | 90 | 0.0756 | 70.42 | 17.44 | MAC | OptumRx |
| claim_040 | 23 | 30 | 0.1017 | 9.57 | 13.69 | AAC | Navitus Health Solutions |
| claim_084 | 24 | 90 | 0.0375 | 16.3 | 14.02 | AAC | Express Scripts |
| claim_140 | 25 | 1 | 1.2244 | 12.02 | 11.86 | MAC | Express Scripts |
| claim_098 | 26 | 90 | 0.0086 | 9.94 | 11.41 | AAC | OptumRx |
| claim_088 | 27 | 30 | 0.3323 | 33.79 | 20.61 | AAC | null |
| claim_146 | 28 | 30 | 0.021 | 6.95 | 11.27 | MAC | Prime Therapeutics |
| claim_022 | 29 | 60 | 0.1292 | 12.57 | 18.39 | AAC | Prime Therapeutics |
| claim_038 | 30 | 30 | 0.0876 | 14.13 | 13.27 | NADAC | OptumRx |
| claim_118 | 31 | 1 | 121.272 | 953.9 | 131.91 | WAC | Navitus Health Solutions |
| claim_122 | 32 | 30 | 0.0865 | 14.09 | 13.23 | AAC | OptumRx |
| claim_017 | 33 | 30 | 0.0682 | 5.37 | 12.69 | MAC | Prime Therapeutics |
| claim_091 | 35 | 90 | 0.0877 | 71.51 | 18.53 | MAC | OptumRx |
| claim_105 | 36 | 60 | 0.0662 | 10.34 | 14.61 | MAC | Express Scripts |
| claim_010 | 37 | 1 | 1.5865 | 59.5 | 12.23 | MAC | Caremark |
| claim_066 | 38 | 45 | 0.022 | 15.5 | 11.63 | AAC | OptumRx |
| claim_050 | 39 | 30 | 0.0425 | 2.37 | 11.92 | MAC | Caremark |
| claim_053 | 40 | 90 | 0.1931 | 21.95 | 28.02 | AAC | Caremark |
| claim_130 | 41 | 45 | 0.0559 | 2.99 | 13.16 | AAC | Caremark |
| claim_101 | 42 | 14 | 0.1349 | 4.93 | 12.53 | AAC | OptumRx |
| claim_039 | 43 | 60 | 0.0225 | 5.43 | 11.99 | NADAC | Caremark |
| claim_021 | 44 | 30 | 0.0637 | 23.3 | 12.55 | WAC | OptumRx |
| claim_076 | 45 | 10 | 0.0494 | 7.59 | 11.13 | NADAC | Prime Therapeutics |
| claim_031 | 46 | 90 | 0.4788 | 515.77 | 53.73 | MAC | OptumRx |
| claim_086 | 47 | 15 | 0.2056 | 20.75 | 13.72 | MAC | Prime Therapeutics |
| claim_042 | 48 | 30 | 0.0236 | 6.06 | 11.35 | WAC | Express Scripts |
| claim_099 | 49 | 90 | 0.077 | 73.25 | 17.57 | MAC | Express Scripts |
| claim_116 | 50 | 60 | 9.0853 | 862.8 | 555.76 | MAC | OptumRx |
| claim_120 | 51 | 30 | 0.1439 | 9.65 | 14.96 | WAC | Express Scripts |
| claim_018 | 52 | 90 | 0.2134 | 58.19 | 29.85 | AAC | DST |
| claim_054 | 53 | 4 | 0.3165 | 10.95 | 11.91 | MAC | Prime Therapeutics |
| claim_103 | 54 | 1 | 1.0264 | 7.56 | 11.67 | MAC | Navitus Health Solutions |
| claim_124 | 55 | 2 | 149.52 | 2098.07 | 309.68 | AAC | Express Scripts |
| claim_113 | 56 | 90 | 0.0449 | 11.23 | 14.68 | AAC | OptumRx |
| claim_080 | 57 | 90 | 0.0738 | 39.77 | 17.28 | AAC | DST |
| claim_144 | 58 | 90 | 0.0566 | 14.04 | 15.73 | WAC | Caremark |
| claim_085 | 59 | 60 | 10.7752 | 903.03 | 657.15 | AAC | OptumRx |
| claim_043 | 60 | 30 | 0.1349 | 4.58 | 14.69 | NADAC | OptumRx |
| claim_090 | 61 | 60 | 0.2357 | 75.3 | 24.78 | NADAC | Caremark |
| claim_008 | 62 | 90 | 0.0953 | 97.03 | 19.22 | AAC | Express Scripts |
| claim_125 | 63 | 30 | 5.2621 | 302.62 | 168.5 | NADAC | Navitus Health Solutions |
| claim_087 | 64 | 12 | 0.9303 | 83.75 | 21.8 | MAC | OptumRx |
| claim_036 | 65 | 9 | 0.1393 | 9.67 | 11.89 | AAC | Express Scripts |
| claim_029 | 66 | 1 | 0.4234 | 48.29 | 11.06 | MAC | Express Scripts |
| claim_133 | 67 | 60 | 0.0678 | 22.02 | 14.71 | AAC | OptumRx |
| claim_044 | 68 | 30 | 0.0168 | 7.85 | 11.14 | WAC | OptumRx |
| claim_046 | 69 | 30 | 0.021 | 8.43 | 11.27 | MAC | Express Scripts |
| claim_073 | 70 | 30 | 0.0891 | 15.57 | 13.31 | AAC | OptumRx |
| claim_012 | 71 | 60 | 0.0557 | 13.48 | 13.98 | AAC | Express Scripts |
| claim_030 | 72 | 240 | 0.0832 | 23.63 | 30.61 | AAC | Express Scripts |
| claim_136 | 73 | 90 | 0.1264 | 99.96 | 22.02 | WAC | OptumRx |
| claim_013 | 74 | 30 | 20.0042 | 347.76 | 610.77 | NADAC | Prime Therapeutics |
| claim_089 | 75 | 3 | 0.4196 | 110.57 | 11.9 | MAC | Express Scripts |
| claim_093 | 76 | 30 | 0.0523 | 8.94 | 12.21 | NADAC | Prime Therapeutics |
| claim_135 | 77 | 30 | 0.0603 | 15.53 | 12.45 | WAC | Prime Therapeutics |
| claim_072 | 78 | 20 | 0.0293 | 0.86 | 11.23 | NADAC | Caremark |
| claim_112 | 79 | 90 | 0.0476 | 51.7 | 14.92 | WAC | Express Scripts |
| claim_081 | 80 | 1 | 1.0555 | 20.13 | 11.7 | WAC | Prime Therapeutics |
| claim_148 | 81 | 60 | 0.0382 | 5.99 | 12.93 | AAC | Caremark |
| claim_024 | 82 | 1 | 2.9701 | 17.9 | 13.61 | WAC | Caremark |
| claim_063 | 83 | 30 | 0.0759 | 24.54 | 12.92 | MAC | OptumRx |
| claim_007 | 84 | 30 | 0.0812 | 10.56 | 13.08 | WAC | Prime Therapeutics |
| claim_123 | 85 | 60 | 0.1524 | 33.87 | 19.78 | MAC | OptumRx |
| claim_011 | 86 | 90 | 0.0821 | 21.12 | 18.03 | MAC | Capital RX |
| claim_129 | 87 | 30 | 0.1809 | 18.5 | 16.07 | AAC | Caremark |
| claim_023 | 88 | 75 | 0.1347 | 18.59 | 20.74 | AAC | Prime Therapeutics |
| claim_097 | 89 | 30 | 0.0671 | 4.46 | 12.65 | MAC | OptumRx |
| claim_055 | 90 | 120 | 0.1384 | 25.68 | 27.25 | NADAC | Navitus Health Solutions |
| claim_128 | 91 | 120 | 0.181 | 39.47 | 32.36 | AAC | Caremark |
| claim_143 | 92 | 30 | 0.0619 | 11.78 | 12.5 | MAC | Navitus Health Solutions |
| claim_109 | 93 | 90 | 0.0278 | 6.92 | 13.14 | AAC | Express Scripts |
| claim_047 | 94 | 90 | 0.0317 | 6.62 | 13.49 | NADAC | OptumRx |
| claim_141 | 95 | 1 | 145.0719 | 799.57 | 155.71 | AAC | Caremark |
| claim_102 | 96 | 90 | 0.0381 | 11.7 | 14.07 | AAC | OptumRx |
| claim_015 | 97 | 90 | 0.0939 | 31.4 | 19.09 | AAC | OptumRx |
| claim_028 | 98 | 3 | 0.0722 | 508.36 | 10.86 | AAC | OptumRx |
| claim_033 | 99 | 1 | 0.1031 | 45.38 | 10.74 | AAC | OptumRx |
| claim_117 | 100 | 60 | 0.013 | 9.39 | 11.42 | MAC | Prime Therapeutics |
| claim_058 | 101 | 180 | 0.037 | 24.19 | 17.3 | WAC | Caremark |
| claim_110 | 102 | 21 | 0.1339 | 17.85 | 13.45 | AAC | Prime Therapeutics |
| claim_150 | 103 | 12 | 0.0943 | 9.37 | 11.77 | AAC | Caremark |
| claim_145 | 104 | 60 | 0.0607 | 2.25 | 14.28 | MAC | Caremark |
| claim_119 | 105 | 30 | 0.0811 | 1.3 | 13.07 | AAC | Express Scripts |
| claim_094 | 106 | 1 | 0.6153 | 15.26 | 11.26 | WAC | OptumRx |
| claim_127 | 107 | 7 | 0.0688 | 4.06 | 11.12 | AAC | OptumRx |
| claim_137 | 108 | 1 | 2.2338 | 35.89 | 12.87 | AAC | OptumRx |
| claim_114 | 109 | 90 | 0.0754 | 8.67 | 17.43 | NADAC | Express Scripts |
| claim_032 | 110 | 1 | 0.0417 | 4.87 | 10.68 | WAC | Caremark |
| claim_060 | 111 | 30 | 0.1969 | 22.6 | 16.55 | WAC | Express Scripts |
| claim_005 | 112 | 30 | 0.2121 | 11.11 | 17 | AAC | OptumRx |
| claim_079 | 113 | 1 | 157.8409 | 506.57 | 168.48 | AAC | OptumRx |
| claim_131 | 114 | 90 | 0.0092 | 56.02 | 11.47 | NADAC | Express Scripts |
| claim_026 | 115 | 4 | 0.0764 | 3.89 | 10.95 | WAC | Navitus Health Solutions |
| claim_104 | 116 | 10 | 0.0467 | 12.63 | 11.11 | AAC | Express Scripts |
| claim_006 | 117 | 1 | 0.2509 | 17.59 | 10.89 | MAC | null |
| claim_077 | 118 | 30 | 0.2699 | 15.53 | 18.74 | MAC | OptumRx |
| claim_142 | 119 | 1 | 0.1782 | 8.83 | 10.82 | NADAC | Express Scripts |
| claim_009 | 120 | 90 | 0.1125 | 17.5 | 20.77 | WAC | OptumRx |
| claim_095 | 121 | 30 | 0.0379 | 9.63 | 11.78 | AAC | Navitus Health Solutions |
| claim_069 | 122 | 30 | 0.0347 | 11.48 | 11.68 | NADAC | Caremark |
| claim_132 | 123 | 20 | 0.0724 | 18.63 | 12.09 | NADAC | Prime Therapeutics |
| claim_037 | 124 | 60 | 0.018 | 2.21 | 11.72 | AAC | Caremark |
| claim_082 | 125 | 60 | 0.0637 | 24.45 | 14.46 | MAC | Prime Therapeutics |
| claim_106 | 126 | 30 | 0.0591 | 4.66 | 12.41 | AAC | Capital RX |
| claim_115 | 127 | 12 | 0.1989 | 15.39 | 13.03 | MAC | Prime Therapeutics |
| claim_049 | 128 | 90 | 0.169 | 115.31 | 25.85 | AAC | Express Scripts |
| claim_059 | 129 | 30 | 0.0314 | 10.66 | 11.58 | NADAC | OptumRx |
| claim_035 | 130 | 12 | 0.0783 | 7.46 | 11.58 | AAC | Express Scripts |
| claim_051 | 131 | 1 | 0.1929 | 247.39 | 10.83 | AAC | DST |
| claim_149 | 132 | 90 | 0.0075 | 17.06 | 11.32 | AAC | OptumRx |
| claim_078 | 133 | 60 | 0.0222 | 11.96 | 11.97 | MAC | Express Scripts |
| claim_003 | 134 | 270 | 0.0267 | 20.21 | 17.85 | AAC | Express Scripts |
| claim_074 | 135 | 60 | 0.2667 | 36.08 | 26.64 | WAC | Navitus Health Solutions |
| claim_027 | 136 | 60 | 0.0121 | 3.32 | 11.37 | AAC | Caremark |
| claim_070 | 137 | 120 | 0.1368 | 14.63 | 27.06 | NADAC | Caremark |
| claim_057 | 138 | 60 | 0.0378 | 9.19 | 12.91 | NADAC | Prime Therapeutics |
| claim_067 | 139 | 3 | 0.1051 | 33.8 | 10.96 | AAC | OptumRx |
| claim_139 | 140 | 180 | 0.0577 | 95.24 | 21.03 | NADAC | OptumRx |
| claim_068 | 141 | 1 | 0.1384 | 15.97 | 10.78 | AAC | Caremark |
| claim_121 | 142 | 90 | 0.0293 | 10.03 | 13.28 | MAC | Prime Therapeutics |
| claim_045 | 143 | 1 | 0.1069 | 8.29 | 10.75 | WAC | Capital RX |
| claim_048 | 144 | 270 | 0.0283 | 30.5 | 18.28 | AAC | OptumRx |
| claim_014 | 145 | 3 | 0.2559 | 4.81 | 11.41 | MAC | Caremark |
| claim_075 | 146 | 30 | 0.0219 | 6.94 | 11.3 | WAC | OptumRx |
| claim_065 | 147 | 1 | 9.3933 | 920.46 | 20.03 | AAC | Caremark |
| claim_107 | 148 | 45 | 0.0371 | 3.77 | 12.31 | MAC | Caremark |
| claim_041 | 149 | 90 | 0.0517 | 14.43 | 15.29 | AAC | Prime Therapeutics |
| claim_001 | 150 | 72 | 0.4574 | 6.29 | 43.57 | MAC | null |
| claim_020 | 151 | 1 | 0.2571 | 70.46 | 10.9 | AAC | Prime Therapeutics |
| claim_056 | 152 | 15 | 0.0654 | 12.81 | 11.62 | AAC | Caremark |
| claim_002 | 153 | 30 | 0.0331 | 4.52 | 11.63 | WAC | Caremark |
| claim_092 | 154 | 10 | 0.0494 | 6.06 | 11.13 | AAC | Caremark |
| claim_147 | 155 | 30 | 0.0281 | 6.06 | 11.48 | AAC | Express Scripts |
| claim_052 | 156 | 90 | 0.0367 | 21.84 | 13.94 | MAC | OptumRx |
| claim_083 | 157 | 14 | 0.2064 | 9.13 | 13.53 | MAC | Prime Therapeutics |
| claim_016 | 158 | 69 | 0.0999 | 42.31 | 17.53 | WAC | OptumRx |
| claim_096 | 159 | 42 | 0.2905 | 24.6 | 22.84 | NADAC | Caremark |
| claim_111 | 160 | 30 | 0.0359 | 8.72 | 11.72 | NADAC | Prime Therapeutics |
| claim_062 | 161 | 20 | 0.1322 | 39.67 | 13.28 | MAC | DST |
| claim_071 | 162 | 90 | 0.0445 | 15.6 | 14.64 | AAC | DST |
| claim_126 | 163 | 10 | 0.0587 | 1.35 | 11.23 | AAC | OptumRx |

## Rule 2 (row level) — owed vs round2(expected − original_paid): pass 150, fail 0

No failing rows.

## Negative owed rows (28) — preserved, presentation deferred (posNeg → destructive)

| id | line | owed | method | pbm | status |
|---|---|---|---|---|---|
| claim_022 | 29 | -0.07 | AAC | Prime Therapeutics | underpaid |
| claim_038 | 30 | -1.15 | NADAC | OptumRx | new |
| claim_118 | 31 | -74.08 | WAC | Navitus Health Solutions | underpaid |
| claim_122 | 32 | -2.2 | AAC | OptumRx | new |
| claim_017 | 33 | -1.67 | MAC | Prime Therapeutics | pending |
| claim_130 | 41 | -0.02 | AAC | Caremark | pending |
| claim_101 | 42 | -0.07 | AAC | OptumRx | pending |
| claim_086 | 47 | -0.12 | MAC | Prime Therapeutics | underpaid |
| claim_042 | 48 | -0.04 | WAC | Express Scripts | recovered |
| claim_073 | 70 | -0.11 | AAC | OptumRx | recovered |
| claim_030 | 72 | -0.45 | AAC | Express Scripts | underpaid |
| claim_013 | 74 | -218.61 | NADAC | Prime Therapeutics | recovered |
| claim_089 | 75 | -46.03 | MAC | Express Scripts | recovered |
| claim_072 | 78 | -0.49 | NADAC | Caremark | pending |
| claim_055 | 90 | -0.49 | NADAC | Navitus Health Solutions | new |
| claim_141 | 95 | -188.31 | AAC | Caremark | recovered |
| claim_145 | 104 | -0.27 | MAC | Caremark | emailed_pbm |
| claim_119 | 105 | -0.3 | AAC | Express Scripts | recovered |
| claim_137 | 108 | -0.66 | AAC | OptumRx | new |
| claim_114 | 109 | -2.41 | NADAC | Express Scripts | emailed_pbm |
| claim_005 | 112 | -5.21 | AAC | OptumRx | emailed_pbm |
| claim_142 | 119 | -1.74 | NADAC | Express Scripts | underpaid |
| claim_106 | 126 | -0.42 | AAC | Capital RX | pending |
| claim_149 | 132 | -4.37 | AAC | OptumRx | new |
| claim_027 | 136 | -1.05 | AAC | Caremark | pending |
| claim_070 | 137 | -2.12 | NADAC | Caremark | pending |
| claim_121 | 142 | -1.11 | MAC | Prime Therapeutics | new |
| claim_083 | 157 | -0.11 | MAC | Prime Therapeutics | emailed_pbm |

Sum of negative owed: -553.68 · signed net Σ owed: 3534.86 · positive-only K: 4088.54. Zero-owed row: claim_002 L153.

## Method vocabulary (rules 4–5)

| fixture method | rows | in vocabulary? | relabel path |
|---|---|---|---|
| AAC | 61 | yes | — |
| MAC | 38 | no | no target in vocabulary; business decision |
| NADAC | 27 | no | no target in vocabulary; business decision |
| WAC | 24 | no | GWAC or BWAC per row — needs brand/generic authority (Frank rider R3) |

## Federal (rule 3 vs federal math) — FLAG-ONLY → Phase 5

federal rows: 139 (11 null). federal_expected == round2(aac × qty) fails 2: claim_018 L52 aac 0.1735 × 90 = 15.614999999999998 → fixture 15.62, toFixed 15.61; claim_121 L142 aac 0.0295 × 90 = 2.655 → fixture 2.66, toFixed 2.65

federal_diff == round2(federal_expected − original_paid) fails 7 (one cent each; Astra §8 "seven"):

| id | line | federal_expected | original_paid | federal_diff (fixture) | fe − op |
|---|---|---|---|---|---|
| claim_120 | 51 | 3.38 | 6.28 | -2.91 | -2.9 |
| claim_018 | 52 | 15.62 | 29.97 | -14.36 | -14.35 |
| claim_043 | 60 | 3.17 | 4.46 | -1.3 | -1.29 |
| claim_109 | 93 | 2.93 | 6.86 | -3.94 | -3.93 |
| claim_015 | 97 | 7.25 | 26.94 | -19.7 | -19.69 |
| claim_121 | 142 | 2.66 | 11.14 | -8.49 | -8.48 |
| claim_002 | 153 | 0.98 | 4.52 | -3.55 | -3.54 |

federal_expected == round2(aac × qty + 10.64) (fee variant): 0/139 — the federal formula carries no fee (type comment OwedBook.ts:24). Sign: 132 negative / 7 positive / 0 zero.

## Null-PBM rows (disclosure input)

| id | line | date | status | method | owed |
|---|---|---|---|---|---|
| claim_134 | 15 | 2026-06-15 | recovered | MAC | 0.31 |
| claim_088 | 27 | 2026-06-01 | new | AAC | 12.94 |
| claim_006 | 117 | 2026-01-29 | new | MAC | 5.25 |
| claim_001 | 150 | 2025-12-28 | underpaid | MAC | 1.77 |

Σ positive owed on null-PBM rows = 20.27 = round2(K − S) with K 4088.54, S 4068.27.

## Flag-only items — owner and gate (AC-204, map §10)

| Item | Owner | Gate |
|---|---|---|
| Aggregate Owed KPI / positive-only aggregates / `commercial_scripts` federal exclusion (A-4, A-12) | Architect | Phase 5 parity harness |
| Federal fee, sign convention, one-cent rounding, rounding law (A-7) | Architect / Frank | Phase 5, before validation week |
| Negative-owed display (A-5) | Director / Frank | Phase 5 UI ruling |
| Method relabel — brand/generic authority (A-6) | Coach → Frank | rider R3 |
| Rule-3 fixture regeneration (A-2, E-13) | Architect | BIM-004 seed (map §6) |
| Unmatched-claim status vocabulary vs Ruling 5 (A-11, E-14) | Architect | Phase 5 pbm_info matching |
| Unattributed bucket | Architect | Phase 5 |
