# QA TEST CASES — BIM-000-CYBER-PHARMA
## Gate Q Execution Workbook

**Status:** NOT EXECUTED  
**QA Lead:** Sol  
**Human-in-the-loop:** Director of QA (Tony)  
**Rule:** Execute one test case at a time. Paste fresh output. Do not substitute Engineer evidence for QA evidence.

### Result Vocabulary

- **PASS** — expected result independently observed.
- **FAIL** — expected result disproved or regression found.
- **BLOCKED** — required access/evidence/setup unavailable.
- **N/A** — only with written reason.

For every FAIL: capture evidence before any rework.

---

# A. Preflight — Gate Q Prerequisites

## TC-P1 — Candidate branch and commit identity

**Purpose:** Establish exactly what revision QA is grading.  
**Covers:** P1 / Gate Q ground truth.

**Run:**
```bash
git branch --show-current
git rev-parse HEAD
git status --short
```

**Expected:**
- BIM-000 work is committed.
- Working tree state is understood and does not contain unreviewed BIM-000 changes.
- Branch identity is resolved.

**Special check:** Acceptance Spec says `bim-000-cyber-pharma`; Handoff Manifest says `phase-3-1`. Record actual disk truth and resolve the documentation conflict before proceeding.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-P2 — Stripe secret purge / rotation attestation

**Purpose:** Verify Coordinator prerequisite without exposing secrets.  
**Covers:** P2.

**Procedure:** Director/Coordinator states:
1. six `STRIPE_*` keys were removed from `.env.local`;
2. those secrets were rotated out-of-band.

**Do NOT paste `.env.local` or secret values.**

**Expected:** explicit attestation to both points.

**Result:** PENDING  
**Evidence:** Director/Coordinator attestation only.  
**Notes:**

---

## TC-P3 — `phase2.md` verdict completed

**Purpose:** Close R3 before Gate Q.  
**Covers:** P3.

**Check:**
- `phase2.md` is recovered into `agent_docs/`, **or**
- Director/Coordinator has ruled it unrecoverable.
- `agent_docs/DB_BASELINE.md` Sibling Note records the final verdict, not `PENDING`.

**Suggested safe checks:**
```bash
find agent_docs -maxdepth 2 -iname 'phase2.md' -o -iname '*phase2*.md'
grep -n -A6 "Sibling Note" agent_docs/DB_BASELINE.md
```

**Expected:** one explicit final verdict.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# B. AC1 — Dependency Removal

## TC-001 — Manifest dependency absence

**Purpose:** Prove direct dependency declarations are gone.  
**Covers:** AC1.

**Run:**
```bash
grep -nE '"sass"|"stripe"' package.json || true
```

**Expected:** no output.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-002 — Clean-install dependency proof

**Purpose:** Prove lockfile/install consistency and absence after a clean install.  
**Covers:** AC1.

**Run:**
```bash
npm ls sass stripe
npm ci
npm ls sass stripe
ls node_modules/sass node_modules/stripe 2>&1
```

**Expected:**
- `npm ls sass stripe` reports no installed packages / `(empty)`.
- `npm ci` exits clean.
- post-`npm ci` dependency check remains empty.
- both direct node_modules paths are absent.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# C. AC2 — Full Regression Triad

## TC-003 — Production build

**Purpose:** Detect runtime/build regression caused by hygiene changes.  
**Covers:** AC2.

**Run:**
```bash
npm run build
```

**Expected:** clean exit; current route build remains successful.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-004 — TypeScript validation

**Purpose:** Prove compile-time type integrity.  
**Covers:** AC2, supports AC5.

**Run:**
```bash
npx tsc --noEmit
```

**Expected:** exit 0; no TypeScript errors.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-005 — Full Jest regression

**Purpose:** Independently verify the frozen test board.  
**Covers:** AC2, regression requirement.

**Run:**
```bash
npm test
```

**Expected:** exactly:
- 26 suites passed
- 120 tests passed
- 0 failures

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# D. AC3 — Environment Contract Truth

## TC-006 — `.env.example` key set

**Purpose:** Verify documented env keys without exposing values.  
**Covers:** AC3.

**Run:**
```bash
grep -E '^[A-Z0-9_]+=' .env.example | cut -d= -f1 | sort
```

**Expected key set exactly:**
```text
NEXT_PUBLIC_ENABLE_MOOSE_PORTAL
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SECRET_KEY
```

Also expected:
- no `NEXT_PUBLIC_API_BASE_URL`
- no `STRIPE_*`

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-007 — Independent env-consumer sweep / omission attack

**Purpose:** Attack Engineering's grep scope and look for missed consumers.  
**Covers:** AC3 + QA Note exploratory requirement.

**Run from repo root:**
```bash
grep -RIn "process\.env" src next.config.* scripts 2>/dev/null || true
```

Then inspect the returned **key names only**.

Also search for bracket-style access that a dot-notation extractor could miss:
```bash
grep -RIn "process\.env\[" src next.config.* scripts 2>/dev/null || true
```

**Expected:**
- no sixth required key exists.
- consumed key set matches TC-006.
- config/scripts do not reveal a missing `.env.example` contract key.

**Safety:** do not print `.env.local`.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# E. AC4 — Fossil Removal

## TC-008 — GHL example file absent

**Purpose:** Prove deletion actually landed.  
**Covers:** AC4.

**Run:**
```bash
test ! -e temp/ghl-example.json && echo "PASS: absent" || echo "FAIL: exists"
```

**Expected:** `PASS: absent`.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# F. AC5 — TypeScript Exclusions

## TC-009 — Required exclude paths present

**Purpose:** Verify config contract and preserve clean TypeScript.  
**Covers:** AC5.

**Run:**
```bash
grep -n -A6 '"exclude"' tsconfig.json
```

**Expected:** exclude array contains:
- `agent_docs/**`
- `_SKILLS/**`

TC-004 must also be PASS.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# G. AC6 — Documentation Board Accuracy

## TC-010 — README / TESTING counts match fresh Jest board

**Purpose:** Prevent documentation drift.  
**Covers:** AC6.

**Run:**
```bash
grep -nE '120|26 suites|26 test suites|Jest-' README.md docs/TESTING.md
```

**Expected:** all documented live counts resolve to **120 tests / 26 suites**, consistent with TC-005.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# H. AC7 — DB Baseline Independent Verification

## TC-011 — DB baseline vs original Coordinator catalog

**Purpose:** Prove the migration-chain starting truth was transcribed faithfully.  
**Covers:** AC7.

**Required source evidence:** Director/Coordinator's original 2026-08-11 live catalog output.

**Inspect:**
```bash
cat agent_docs/DB_BASELINE.md
```

**Compare against original catalog for:**
- exactly two application tables:
  - `public.user_roles`
  - `public.profiles`
- exactly three policy names:
  - `Profiles are updatable by owner or superadmins`
  - `Profiles are viewable by owner or superadmins`
  - `Users can read their own role`
- setup.sql + profiles-migration interpretation
- catalog date `2026-08-11`
- finalized `phase2.md` sibling verdict from TC-P3

**Expected:** byte-faithful table/policy names and correct catalog date/interpretation.

**If original catalog evidence is unavailable:** **BLOCKED**, not guessed.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# I. AC8 — Frozen Baseline Predicates

## TC-012 — Production `any` baseline

**Purpose:** Prove frozen static baseline was not disturbed.  
**Covers:** AC8.

**Method:** run the repo's baseline production `any` predicate from recon/module docs.

**Expected:** exactly 2 hits, located at:
- `src/components/ui/command.tsx`
- `src/utils/supabase/server.ts`

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-013 — `user_metadata` role-smell baseline

**Purpose:** Ensure authorization-role smell count remains zero.  
**Covers:** AC8.

**Method:** run the repo's baseline role-smell predicate from recon/module docs.

**Expected:** 0 production hits.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-014A — Legacy numbered-color predicate

**Purpose:** Verify the literal frozen BIM-000 baseline, even though the instrument is known to be flawed.  
**Covers:** AC8.

**Method:** run the exact recon-original numbered-color predicate.

**Expected:** 5 hits.

**Important:** The exact original predicate is not reproduced in the supplied spec/handoff. Retrieve it from the repo's recon/module evidence. If unavailable, mark this case BLOCKED/GAP rather than inventing a substitute and calling it the same test.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-014B — Boundary-aware numbered-color exploratory probe

**Purpose:** Independently verify the known predicate artifact so QA does not confuse a green legacy count with five real violations.  
**Covers:** exploratory/process risk adjacent to AC8.

**Expected based on current handoff claim:** real numbered-color utility violations = 0; legacy five hits are substring/comment artifacts.

**Disposition:** This exploratory result does not rewrite AC8 during BIM-000. It informs follow-up/tooling doctrine.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# J. AC9 — Scope Integrity / Handoff Integrity

## TC-015 — No `src/**` changes from Phase 3 starting point

**Purpose:** Prove BIM-000 respected its forbidden source-write zone.  
**Covers:** AC9.

**Campaign starting SHA recorded in journal:** `6f6e63d`.

**Run:**
```bash
git diff --name-only 6f6e63d..HEAD -- src/
```

**Expected:** no output.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-016 — Review full BIM-000 changed-file surface

**Purpose:** Catch undocumented scope creep.  
**Covers:** AC9 + Gate Q scope/contract.

**Run:**
```bash
git diff --name-only 6f6e63d..HEAD
```

**Expected:** changed files are explainable by BIM-000 scope / Coordinator close work. No unexplained product-source changes.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-017 — Commit/handoff concern integrity

**Purpose:** Verify Coordinator committed the concerns and the handoff is traceable.  
**Covers:** AC9 / P1.

**Run:**
```bash
git log --oneline --no-merges 6f6e63d..HEAD
```

**Expected:** BIM-000 changes are traceable to the concern commits / close commit described by the handoff manifest.

**Engineer-zero-mutating-git subclaim:** QA cannot prove a negative about another agent's historical terminal behavior from the filesystem alone unless an audit trail exists. Record the available attestation/process evidence explicitly rather than pretending it is independently observable.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# K. Gate Q Exploratory Closeout

## TC-E01 — Dependency-remnant probe

**Purpose:** Look for source/config references to removed packages that a package manifest check would miss.

**Procedure:** search repo code/config for actual `sass` / `stripe` imports, requires, or runtime use, excluding generated/vendor directories and historical docs where appropriate.

**Expected:** no live runtime consumer requiring either removed dependency.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

## TC-E02 — Unexpected changed-file / documentation drift probe

**Purpose:** Look for evidence that the module changed more than its contract says.

**Use:** TC-016 changed-file list + spot inspection of any unexpected item.

**Expected:** every change is in-scope or explicitly Coordinator/protocol work.

**Result:** PENDING  
**Evidence:**  
**Notes:**

---

# L. Completion Board

| Test Case | AC / Gate | Result |
|---|---|---|
| TC-P1 | P1 | PENDING |
| TC-P2 | P2 | PENDING |
| TC-P3 | P3 | PENDING |
| TC-001 | AC1 | PENDING |
| TC-002 | AC1 | PENDING |
| TC-003 | AC2 | PENDING |
| TC-004 | AC2/AC5 | PENDING |
| TC-005 | AC2 | PENDING |
| TC-006 | AC3 | PENDING |
| TC-007 | AC3 | PENDING |
| TC-008 | AC4 | PENDING |
| TC-009 | AC5 | PENDING |
| TC-010 | AC6 | PENDING |
| TC-011 | AC7 | PENDING |
| TC-012 | AC8 | PENDING |
| TC-013 | AC8 | PENDING |
| TC-014A | AC8 | PENDING |
| TC-014B | Exploratory | PENDING |
| TC-015 | AC9 | PENDING |
| TC-016 | AC9 | PENDING |
| TC-017 | AC9 | PENDING |
| TC-E01 | Exploratory | PENDING |
| TC-E02 | Exploratory | PENDING |

---

# M. Gate Q Exit Rule

Do not issue the final verdict until:

- P1–P3 are complete,
- every AC1–AC9 has sufficient independent evidence,
- all required regression tests are green,
- findings are classified and routed,
- any rework cycle is retested,
- affected regression is rerun,
- final branch + SHA are recorded.

Final output after execution:

`GATE_Q_REPORT_BIM-000-CYBER-PHARMA.md`
