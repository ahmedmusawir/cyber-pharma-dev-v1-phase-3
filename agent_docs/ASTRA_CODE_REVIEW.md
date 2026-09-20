# Astra independent adversarial review — Cyber Pharma

Director: Tony Stark. RRM pilot / Factory Engine 2. Review and evidence only.

## 1. Executive assessment

The most consequential defect is in real user administration, not the mock pharmacy screens. Moose's privileged actions have no caller authorization or feature-flag check at the operation boundary. The layout checks both, but the actions do not use that guard. Isolated execution confirmed all five action bodies can reach a privileged client substitute without identity. A compiled HTTP demonstration remains unavailable; no deployment was tested.

Two further security risks need explicit disposition: the documented upgrade SQL trusts signup metadata for role assignment, and the locked image-processing dependencies match a published native-library vulnerability while the app permits a broad remote-image host. Their actual deployment prerequisites are unverified.

The ledger's summary silently omits money on claims with missing PBMs. Keyboard interaction also falls short of the original accessibility requirements. The mock service separation is useful, but the promise that only service bodies need to change for real integration is too strong: refresh invalidation and failure handling are incomplete in the components.

This assessment contains **8 findings: 3 High, 4 Medium, 1 Low; 0 demonstrated Critical**. Classifications: **4 current defects, 3 conditional risks, 1 future integration risk**. High is deliberately used for the unguarded actions despite potentially critical impact: a deployed unauthenticated compromise was not demonstrated. This is advisory input to adjudication, not a production-readiness declaration or SOL Gate Q.

## 2. Specimen and independence

- Approved directory: `/home/moose/nextjs/cyber-pharma-dev-v1-astra-review`.
- Start: **2026-09-17T08:34:04Z** (14:34:04 Asia/Dhaka).
- Identity: Director-approved Cyber Pharma export; package name `cyber-pharma`, version `0.1.0`; original project spine identifies `cyber-pharma-dev-v1`.
- Branch, HEAD, historical diff, and equivalence to earlier SHA: **unavailable — intentionally Git-free export**.
- Historical anchor: `f1113177a5250e46136671ae4845659bda58f359`. **No claim that this export matches it.**
- Reviewed commit for **every finding below**: unavailable under the Director clarification. The exact reviewed file bytes are identified by [initial SHA-256 manifest](evidence/initial-manifest.json), not a commit.
- No previous reviewer findings, Fable output, review summaries, adjudication or repair documents were read. Directory inventory exposed historical document filenames only. Original requirements/instructions and source comments were read as permitted. No comparison with other reviews occurred.
- No initial `astra-review/` or local `node_modules/` existed. There is no Git-based claim about pre-existing modifications. File stability is assessed only against the initial manifest.

## 3. Architecture and integration map

This export is Next App Router with TypeScript, React, Tailwind, Radix controls, Zustand and Supabase SSR. There is no FastAPI application in the reviewed source. Browser domain screens call two TypeScript service modules. Real authentication uses Next route handlers and Supabase clients. Server layouts pass authenticated identity/role into the shared navbar.

| Entry / journey | Implementation and enforcement | Data-path classification |
|---|---|---|
| `/` | Server calls Supabase `getUser`; authenticated user redirected to `/owedbook`; otherwise marketing content | Real identity + static content |
| `/auth` | Login and signup forms; route handlers below | Real auth |
| `POST /api/auth/login` | Password sign-in, cookie writes, role read from `user_roles`, cache revalidation; client persists identity snapshot | Real Supabase |
| `GET /api/auth/login` | Legacy diagnostic query against `posts`; returns success/error message, not row contents | Real attempted query; table existence unknown |
| `POST /api/auth/signup` | Public signup; sends `full_name` metadata; depends on database trigger for role/profile | Real Supabase; deployed trigger unknown |
| `GET /api/auth/confirm` | OTP verification and redirect; `next` assigned to pathname | Real Supabase |
| `POST /api/auth/logout` | Session signout, cache revalidation; client clears auth snapshot and navigates | Real Supabase |
| `/owedbook` | ADMIN/MEMBER layout guard; shared filter context; ledger service filters 150 fixture rows, paginates, aggregates | Mock fixtures, browser-local calculation |
| Upload / Get Fresh Data / report buttons | Upload and refresh delay then succeed; report button has no operation | Intentionally deferred ingest/reports; no file read or network |
| `/profile` | ADMIN/MEMBER layout guard plus page `getUser`; display from auth metadata; browser password update | Real Auth; not an editable profile-table form |
| `/admin-portal` and `/stores/[id]`, `/invite`, `/billing`, `/settings`, `/audit` | ADMIN layout guard (members redirected to ledger); client services use a single in-memory demo store | Local/in-memory domain state; billing/email simulated |
| `/moose-portal` and `/users`, `/users/edit/[id]`, `/users/add-member` | Layout requires ADMIN and public build flag; actions create service-credential client without repeating either check | **Real privileged Supabase**, A-001 |
| `src/proxy.ts` | Broad request matcher; session refresh only, no access denial; excludes framework images/static assets | Real Auth session refresh |
| `src/utils/supabase/admin.ts` | Duplicate privileged factory; no consumer found | Unused infrastructure; Moose uses its own factory |
| Stripe dependency | No runtime Stripe import, checkout or webhook route found | Deferred/unused dependency |

**Ownership and state.** `user_roles` is canonical for page authorization; browser-persisted `auth-store` is not the shared navbar's authority. Admin demo state is one browser module singleton seeded with fictional owner/stores, not an authenticated tenant partition. `getOwner()` returns the seed owner and is not consumed by the screens. Demo state is intentionally nonpersistent and resets on full reload; no product logout reset of that store was found. That is a future ownership/cache gate, not evidence of real cross-tenant database leakage.

**Database assets.** Only auth foundation SQL was found: identical `docs/setup.sql` and `supabase/setup.sql`, plus alternate `docs/migration_add_profiles.sql`. They define `app_role`, `user_roles`, `profiles`, policies and auth-user triggers. None executes automatically in the application/build. Real code queries the two tables, but installed definitions are unknown. No Frank-domain migrations/tables, ingest implementation, report-generation route, or payment/webhook implementation exists in this export. Older docs' historical assertions about an external database were not accepted as current deployment evidence.

**Deployment.** Docker uses Node 22 Alpine, `npm ci`, Next standalone output and a non-root runtime. Cloud Build injects public values at build and runtime, mounts `SUPABASE_SECRET_KEY` at runtime, permits unauthenticated network access, and defaults Moose's flag false. `instrumentation.ts` checks four required variable names at startup. No secret values or environment files were opened. Broad no-cache response headers are configured; this is not proof that every internal/browser cache is invalidated. Next's Google font integration also affects build network requirements.

**Conflicting or stale requirements.** Phase-2 contracts describe an ADMIN-only OwedBook at the old route and a Phase-3 service swap; later UI amendments/code allow both roles at `/owedbook`, while app architecture prose says Phase 7. PROJECT_OVERVIEW says admin login lands on Admin Portal; code and later route docs use OwedBook. ROUTES_AND_SURFACES says any authenticated user can use Profile, but its layout requires ADMIN/MEMBER. Architecture prose lists removed spinner/auth-mock files. The admin contract still permits a role argument while the current UI hardcodes member and uses job title. These are decisions/documentation reconciliation items, not grounds to invent missing functionality. Original docs explicitly defer actual ingestion, reporting, real billing and admin-domain persistence.

## 4. Verification and limits

| Check | Outcome |
|---|---|
| Initial SHA-256 manifest | 215 included files, before verification; policy in `evidence/manifest.py` |
| Source tracing | Auth APIs, proxy, all privileged actions/consumers, layouts, ledger services/fixtures/controls, admin services/store/screens, database assets, configuration and relevant tests/contracts |
| `node evidence/probes.cjs` (from review directory, or root path in RUN_NOTES) | Completed: actual erased TypeScript action/service/store bodies with declared substitutes; page guard counterexamples; ledger totals/filter/page checks; demo state consistency probes |
| `node evidence/async-probes.cjs` | Completed: exact pre-JSX handler/effect slices with synthetic failures and signup responses |
| Typecheck | **Blocked**: TypeScript unavailable; no typecheck script; no installation |
| ESLint | **Blocked**: eslint/config dependencies unavailable; no lint result claimed |
| Existing Jest suites | **Blocked**: Jest, ts-jest, React unavailable; 26 test files inventoried, no pass count claimed |
| Next build / dev server | **Blocked**: Next/React absent; no environment-loading command launched |
| Browser / responsive / assistive technology | Chrome executable exists; app runtime and Playwright absent; **not run** |
| Database / real SDK / deployed HTTP / E3/E4 | **Not run**, prohibited live services; no migrations executed |
| Dependency advisories | Targeted official Next/Sharp/libheif checks; not a complete transitive dependency audit |

Available runtime: Node **22.17.0**, npm **11.15.0**, Python 3, Chrome executable. **Installed project dependency versions: unavailable (dependencies absent).** Locked versions: Next/eslint-config-next **16.2.12**, React/react-dom **19.2.4**, Supabase SSR **0.6.1**, Supabase JS/auth-js **2.106.1**, TypeScript **5.5.4**, Jest **30.4.2**, ts-jest **29.4.12**, ESLint **9.39.5**, Playwright **1.59.1**, Sharp **0.35.3**, Linux-musl Sharp libvips package **1.3.2**. Exact records: [tooling evidence](evidence/tooling.json).

The probes remove TypeScript types using Node's built-in experimental eraser, substitute imports explicitly, and evaluate bodies in a VM with no SDK, credentials or network binding. Store probing substitutes only Zustand's simple vanilla state mechanism. Async probes execute source slices, not React rendering. These are **E2 function-level observations**, not framework HTTP, browser, SQL, typecheck or full-test evidence. Console logs contain only synthetic inputs and aggregate fixture values. See [probe output](evidence/probes.log), [async output](evidence/async-probes.log), and [numbered source excerpts](evidence/source-excerpts.txt).

## 5. Prioritized findings

| ID | Bounded title | Classification | Severity | Confidence | Evidence | Suggested disposition |
|---|---|---|---|---|---|---|
| A-001 | Moose privileged actions omit operation-level authorization | Current defect | High | High | E2 bodies + E1 framework trace | Candidate repair now |
| A-002 | Upgrade trigger grants roles from user-controlled metadata | Conditional risk | High | High in SQL; deployment unknown | E1 | Candidate repair now; establish installed trigger |
| A-003 | Locked AVIF processing stack matches an RCE advisory | Conditional risk | High | High version match; medium exploit applicability | E1 | Candidate repair now; isolated dependency gate |
| A-004 | Missing-PBM claims disappear from dollar summaries | Current defect | Medium | High | E2 | Candidate repair now; choose representation |
| A-005 | Ledger controls omit required keyboard/focus behavior | Current defect | Medium | High source confidence | E1 | Candidate repair now |
| A-006 | Ledger components cannot safely support a service-only real-data swap | Future integration risk | Medium | High | E2 slices + E1 wiring | Future gate |
| A-007 | Signup has incomplete failure and confirmation states | Current defect | Medium | High code behavior; confirmation setting unknown | E2 slices | Candidate repair now |
| A-008 | Fresh-setup trigger reads the wrong display-name key | Conditional risk | Low | High artifact mismatch; deployment unknown | E1 | Candidate repair now |

## 6. Detailed findings

### A-001 — Moose privileged actions omit operation-level authorization

**Classification/severity/confidence/evidence:** current defect / High / High / E2 function bodies, E1 framework reachability. Reviewed commit unavailable; use initial manifest.

**Locations:** `src/app/moose-portal/users/actions.ts:22` (`getUsers`), `:91` (`getUserById`), `:122` (`editUser`), `:157` (`deleteUser`), `:173` (`addMember`); `_lib/admin.ts:14`; `src/app/moose-portal/layout.tsx:15`; `src/utils/supabase/middleware.ts:37`. Client consumers: `DeleteUserButton.tsx:18`, `users/edit/[id]/EditUserForm.tsx:24`, `users/add-member/AddMemberForm.tsx`.

**Expected/source:** docs/AUTHORIZATION's verify-then-act rule requires authenticated identity and canonical permitted role before service credentials are used; ROUTES_AND_SURFACES requires ADMIN plus Moose flag. `deleteUser`'s own comment restricts deletion to members.

**Actual path:** exported `use server` actions instantiate the privileged client immediately, then query global profiles/roles or call Auth Admin. Proxy refreshes a session but never rejects absent/wrong-role callers. Layout checks do not run inside the action. The delete action accepts arbitrary target ID without a target-role restriction; hiding Delete for nonmembers only constrains the rendered cards. These symptoms share the missing operation authorization boundary.

**Evidence/reproduction:** `node astra-review/evidence/probes.cjs`: all five actual action bodies reached synthetic privileged operations with no actor/session and a false flag; deleting the synthetic superadmin target reached the delete substitute. The same harness confirms actual `protectPage` denies absent/member actors, so the defect is missing use of enforcement, not a broken role comparator. No SDK request was made.

**Framework validation:** Next requires authorization in Server Functions and warns that layout checks do not cover all entry points. Used action references, unlike unused/tree-shaken functions, must be treated as callable boundaries. [Official data-security guide](https://nextjs.org/docs/app/guides/data-security), [authentication guide](https://nextjs.org/docs/app/guides/authentication). The locked-version [16.2.12 action handler](https://raw.githubusercontent.com/vercel/next.js/v16.2.12/packages/next/src/server/app-render/action-handler.ts) resolves/invokes actions before subsequent render work (lines 1269–1317); origin checks do not establish caller identity.

**Consequence/prerequisites:** with the action retained in the build, a usable action reference and configured service credentials, unauthorized direct invocation can create confirmed accounts, modify names or delete users across the project. At minimum, a previously authorized client after role/session change is not rechecked. Potential impact is critical if exposed unauthenticated in deployment; this review assigns High because no compiled HTTP exploit or deployed reachability was established. Auth IDs/action IDs are prerequisites, not authorization.

**Observed vs unknown:** guard omission and privileged execution are demonstrated; action-manifest retention with flag false, externally obtainable IDs, deployment ingress and real successful deletion are unverified. Read actions were tested as functions; their HTTP export retention was not assumed equivalent to client-imported mutations.

**Falsification/narrowing:** a build demonstrating removal of all affected action endpoints, or independently enforced operation authorization before privileged execution, would narrow exposure. A 404 page alone would not. An HTTP test must prove the fake admin sink remains untouched, not just inspect the final page/status.

**Minimal repair objective:** require fresh actor/role/feature authorization and allowed target scope before every privileged call; make member-only deletion enforceable at that boundary. **Verification objective:** synthetic HTTP/action tests for missing session, member, role downgrade, disabled flag, expired session, admin/superadmin targets, and authorized member management; assert no privileged-client creation on denial. No repair implemented.

### A-002 — Upgrade trigger grants roles from user-controlled metadata

**Classification/severity/confidence/evidence:** conditional risk / High / High for SQL behavior, installed state unknown / E1. Reviewed commit unavailable; initial manifest.

**Locations:** `docs/migration_add_profiles.sql:71–101`, particularly `:82–90`; `docs/DATABASE_SETUP.md:22–24`; safe counterexamples `docs/setup.sql:95–96` and `supabase/setup.sql:95–96`.

**Expected/source:** docs/AUTHORIZATION requires public signups to receive member and explicitly rejects metadata as authority. The main setup scripts implement that policy.

**Actual path:** DATABASE_SETUP directs existing installations to the alternate migration. Its SECURITY DEFINER auth-insert trigger casts `NEW.raw_user_meta_data->>'role'` directly into `app_role` and inserts it into the canonical role table. Supabase accepts user-supplied signup metadata; it is not privileged app metadata. [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

**Supporting evidence:** source trace with hypothetical new-user metadata `{ "role": "admin" }` yields the admin enum branch; `{ "role": "superadmin" }` also passes the enum. The app signup wrapper omits role, but a public Supabase signup boundary is independently callable when enabled. No account creation or SQL probe was executed.

**Consequence/prerequisites:** if this migration's trigger is installed and public signups are permitted, a new registrant can influence their canonical role. Choosing admin aligns with current app gates; superadmin is not automatically useful for the current layouts. RLS on `user_roles` does not restore trust after a privileged trigger inserts the attacker-selected value.

**Observed vs unknown:** unsafe documented migration is present; active trigger, public signup configuration and deployment use are unknown. Updating metadata on an existing user is **not** claimed to re-run this INSERT trigger.

**Falsification/narrowing:** active schema showing the safe fixed-member trigger and proof this alternate migration is never applied remove current deployment exposure. That leaves a hazardous documented installation path.

**Minimal repair objective:** keep role assignment independent of untrusted metadata and reconcile the two installation paths. **Verification objective:** in an isolated database/auth substitute, signup metadata requesting admin/superadmin must still create member; verify legitimate privileged provisioning separately. Candidate repair now, without claiming this export's external project is compromised.

### A-003 — Locked AVIF processing stack matches an RCE advisory

**Classification/severity/confidence/evidence:** conditional risk / High / High version match, Medium end-to-end applicability / E1. Reviewed commit unavailable; initial manifest.

**Locations:** `package-lock.json:10052` (Next 16.2.12), `:11389` (Sharp 0.35.3), `:1362` (libvips Linux-musl package 1.3.2); `package.json` Sharp override; `next.config.js:5–11`; `src/proxy.ts:10`; Dockerfile's Node Alpine runtime.

**Expected/source:** the deployment's image decoder must not process untrusted input with a known applicable memory-safety vulnerability. Primary advisory [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) lists affected Next 16 versions below 16.3.3 and disables AVIF optimization in patched versions. The underlying [GHSA-g89c-p67h-r497](https://github.com/strukturag/libheif/security/advisories/GHSA-g89c-p67h-r497) affects libheif 1.22.0–1.23.1 inclusive, fixed in 1.23.2. Next advisory has no known CVE listed at lookup.

**Actual path/evidence:** official [sharp-libvips 1.3.2 build metadata](https://raw.githubusercontent.com/lovell/sharp-libvips/v1.3.2/versions.properties) selects libheif **1.23.1**. The locked-version [Next image optimizer](https://raw.githubusercontent.com/vercel/next.js/v16.2.12/packages/next/src/server/image-optimizer.ts) does not include AVIF in bypass types and feeds upstream bytes to Sharp. App configuration permits HTTPS `res.cloudinary.com` with no account/path restriction; `_next/image` is outside the auth proxy matcher. No crafted image was created, fetched or decoded.

**Consequence/prerequisites:** the public optimizer could process attacker-influenced AVIF bytes if they can be served unaltered from an allowed host/path and the deployed decoder follows this lockfile. Published impact includes remote code execution. The broad Cloudinary hostname makes third-party input relevant, but exact raw-byte preservation and deployed binaries are unverified. App-specific severity is High conditional, not the advisory's automatic Critical.

**Self-challenge:** current UI images are local SVG/PNG and do not prove AVIF use; attackers would need direct optimizer input. Default WebP output does not necessarily prevent AVIF input decoding. The Sharp override is present but resolves to the affected native bundle. Linux hosting makes the separate Windows advisory GHSA-p293-qw3h-jr36/CVE-2026-75604 inapplicable to the declared Docker target. The reviewed lock is also above the 16.2.11 fix for GHSA-m99w-x7hq-7vfj; that DoS advisory is not a finding here.

**Falsification/narrowing:** patched deployed libheif/Next, externally disabled optimizer, or a proven inability to deliver affected bytes through allowed sources would reduce/remove deployment exposure. No dependency-wide clean bill is implied.

**Minimal repair objective:** eliminate the affected decoder path and constrain remote-image inputs to intended assets. **Verification objective:** inspect the built runtime's native versions and safely verify allowed/rejected optimizer sources; use vendor regression tests in isolation. Do not reproduce native exploitation against this application. Candidate dependency repair now; no upgrade performed.

### A-004 — Missing-PBM claims disappear from dollar summaries

**Classification/severity/confidence/evidence:** current defect / Medium / High / E2. Reviewed commit unavailable; initial manifest.

**Locations:** `src/services/owedbook.ts:71–84` vs `:108–125`; `src/types/OwedBook.ts:10`; `src/__tests__/services/owedbook.test.ts:53–67`.

**Expected/source:** DATA_CONTRACT §4 explicitly allows missing PBM and says null renders as an em dash; §5 defines a filtered summary aggregate. Dollars represented by the filtered ledger should remain reconcilable, or an excluded category must be made explicit. This does not impose a gross-versus-net reimbursement definition.

**Actual path:** KPI includes all filtered rows with positive owed; summary executes `if (!r.pbm) continue`, silently discarding their entire monetary contribution. UI shows neither a missing-PBM bucket nor an exclusion disclosure.

**Reproduction:** actual fixture/service probe: all claims yield $4,088.54 KPI versus $4,068.27 commercial summary; four null-PBM rows account for exactly $20.27. Set From=To=2026-06-01: two claims and $15.79 KPI, but only Prime Therapeutics $2.85 appears in Summary. $12.94 disappears from that view. Empty-set handling itself passed the probe.

**Consequence/prerequisites:** ordinary users comparing the same filters receive inconsistent totals; missing PBMs already occur in shipped fixtures. No real pharmacy loss is claimed because domain data remains mock.

**Observed vs unknown:** dropped rows and discrepancy are demonstrated. Whether a separate exception workflow or intentional named-PBM-only report is desired is a product decision. Existing tests validate shape and sort order, not reconciliation or null coverage; their seven-PBM assumption can discourage an unknown bucket.

**Falsification/narrowing:** a requirement explicitly defining Summary as named-PBM-only plus a visible exclusion disclosure would downgrade the contradiction. No such handling was found.

**Minimal repair objective:** preserve or visibly account for unattributed money without choosing a new financial formula. **Verification objective:** independently reconcile detail, KPI and summary for mixed/null-only/named-only PBM sets and date/status filters. Candidate repair now; bucket/exception representation needs Tony/Frank's choice.

### A-005 — Ledger controls omit required keyboard/focus behavior

**Classification/severity/confidence/evidence:** current defect / Medium / High source confidence / E1. Reviewed commit unavailable; initial manifest.

**Locations:** `src/components/common/DataTable.tsx:70–89`; `src/components/layout/AuthedShell.tsx:46–58,93–120`; `src/components/common/MultiSelect.tsx:24–49,88–133`; Phase-2 `UI_SPEC.md:237–242`.

**Expected/source:** UI_SPEC §8 explicitly requires keyboard-operable sortable headers and focus trapping for both filter drawer and MultiSelect. This is completed UI scope, not a backend feature.

**Actual path:** sorting is attached only to a bare `<th onClick>` with no focusable button, tabIndex or keyboard handler. `aria-sort` announces state but cannot activate sorting. The custom drawer declares `aria-modal` yet only handles Escape/body scrolling; it neither transfers/traps/restores focus nor makes the background inert. MultiSelect autofocuses search and closes on Escape/outside click but similarly has no focus boundary/return behavior. Shared root: custom interaction primitives implement pointer/open state without the required keyboard model.

**Reproduction/source prediction:** desktop Tab traversal cannot reach a sort activation control. Open the collapsed filter drawer via keyboard: focus is not moved into it, and sequential focus is unrestricted outside it. No browser or assistive-technology execution was available; these predictions are not labeled E2. Existing DataTable tests call `fireEvent.click` on the header; drawer tests prove closure after Apply, not keyboard containment. The mobile cards offer no alternate sort controls.

**Consequence:** keyboard users cannot perform the same sorting task and can operate obscured page controls while a modal claims to contain interaction. Affects the shipped mock UI regardless of backend.

**Falsification/narrowing:** an actual focus manager/native wrapper around these elements, or a browser demonstration of full keyboard equivalence, would narrow the claim. No such wrapper exists in the traced path; Radix on other components does not wrap these custom elements.

**Minimal repair objective:** fulfill the existing keyboard/focus contract in these primitives. **Verification objective:** real Tab/Shift-Tab, Enter/Space, Escape and focus-return checks at desktop and collapsed breakpoints, including nested PBM popup behavior. Candidate repair now.

### A-006 — Ledger components cannot safely support a service-only real-data swap

**Classification/severity/confidence/evidence:** future integration risk / Medium / High / E2 handler/effect slices and E1 wiring. Reviewed commit unavailable; initial manifest.

**Locations:** `src/components/owedbook/FilterRail.tsx:59–72,173`; `OwedBookScreen.tsx:77–86,89–114`; `OwedBookContext.tsx:50–65`; `src/__tests__/owedbook/FilterRail.test.tsx:17–24`.

**Expected/source:** UI_SPEC §5.4 explicitly defers ingest but promises a service-body swap; §7 promises error/retry behavior. APP_ARCHITECTURE repeats that components need not change. Real service latency/errors and changed results must be representable.

**Actual path:** successful upload/refresh only changes rail-local status. It does not invalidate ledger rows, summary, KPI or PBM options. The ledger reload key is local to its Retry control; KPIs depend only on filter identity; PBMs load once. Failed refresh/upload rejects without a catch/finally. KPI rejection is converted to all-zero financial values without an error state. This is a component state model built around an infallible, unchanging mock service.

**Controlled evidence:** exact-handler slices with synthetic failures leave refresh at `refreshing` and upload at `uploading`; the refresh button remains disabled by that state. A rejected KPI promise sets four zeros. Success logs show status completion; lack of invalidation is established by source wiring, not by the harness's diagnostic counter alone. Existing tests inject only successful refresh/upload promises.

**Consequence/prerequisites:** once service bodies actually mutate/fetch data, users can see “Done” with stale results, apparent $0 obligations after a failed query, and no retry after refresh failure. Today's delay-only mock cannot naturally produce backend failures, so this is **not** a claim that real refresh is currently required.

**Falsification/narrowing:** an explicit service subscription consumed by all dependent views or documented forced full-navigation contract would narrow the stale-data path; none exists. Error-capable contract tests are missing, not proof that current mock success fails.

**Minimal repair objective:** define and implement invalidation plus distinguish success/empty/loading/error across the data views before real integration. **Verification objective:** deferred promises, rejection, successful mutation with changed data, old requests resolving late, and retries must leave a coherent screen. Existing cancellation flags for read effects should be preserved. Future integration gate; no implementation change.

### A-007 — Signup has incomplete failure and confirmation states

**Classification/severity/confidence/evidence:** current defect / Medium / High code behavior / E2 slices. Reviewed commit unavailable; initial manifest.

**Locations:** `src/components/auth/RegisterForm.tsx:67–92`; `src/app/api/auth/signup/route.ts:7–26`; `src/app/owedbook/layout.tsx:17`.

**Expected/source:** docs/AUTHENTICATION describes a real signup journey. A network failure must release the form with a recoverable error; account creation requiring confirmation is not an authenticated session. Official [Supabase auth client source](https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/src/GoTrueClient.ts) documents signup returning user with null session when confirmation is enabled.

**Actual path:** form sets loading true, awaits fetch without catch/finally, and resets loading only after a non-OK response with successfully parsed JSON. Every OK response navigates to the protected ledger without reading session data or providing confirmation instructions.

**Controlled evidence:** injected rejected fetch leaves `busy:true`, no visible error state and a rejected handler. Injected OK `{user: synthetic, session:null}` navigates to `/owedbook`; loading stays true. The latter response body is never inspected. Under email confirmation, the ledger guard should then redirect to auth; this redirect sequence was source-traced, not browser-executed.

**Consequence/prerequisites:** real offline/transport failure strands the Signup button until remount/reload. If email confirmation is enabled, successful registrations receive misleading navigation instead of next-step instructions. Confirmation configuration is unknown and no email was sent.

**Falsification/narrowing:** disabling confirmation removes the second scenario, not the rejected-fetch defect. An enclosing handler that restores this component's loading/error state would narrow the first; none was found. A general error page is not evidence of local recovery.

**Minimal repair objective:** explicitly represent transport/API failure, confirmation-required creation and authenticated signup; release loading appropriately. **Verification objective:** rejected fetch, non-JSON error response, ordinary API error, OK-null-session, and OK-session. Candidate repair now.

### A-008 — Fresh-setup trigger reads the wrong display-name key

**Classification/severity/confidence/evidence:** conditional risk / Low / High artifact mismatch, deployed schema unknown / E1. Reviewed commit unavailable; initial manifest.

**Locations:** `src/app/api/auth/signup/route.ts:14`; `src/app/moose-portal/users/actions.ts:186`; `docs/setup.sql:103`; `supabase/setup.sql:103`; profile reads at actions `:50,:98`. Compare alternate migration `:98`.

**Expected/source:** setup comments promise that auth insertion copies supplied full name into `profiles`; the typed profile returned by user administration uses that column.

**Actual path/support:** both public signup and Moose creation send `full_name`. Both fresh-setup trigger copies read `raw_user_meta_data->>'name'`. An object containing only `full_name` has no `name` value, so the SQL expression is null. There is no subsequent app-side profile insert/update on signup/createMember to fill it.

**Consequence/prerequisites:** installations using the provided fresh setup create blank profile names even when the caller supplied one. Moose list/edit uses the blank profile while own Profile displays metadata `full_name`, producing inconsistent identity presentation. Requires this trigger to be active; no live profile was inspected.

**Observed vs unknown:** artifact mismatch is certain; production incidence is not. The alternate migration reads `full_name` but introduces A-002 and is not a safe suggested workaround.

**Falsification/narrowing:** a deployed corrected trigger or authorized separate synchronization mechanism removes current incidence. **Minimal repair objective:** align metadata field naming across safe provisioning paths without weakening default-member role assignment. **Verification objective:** isolated signup and privileged creation each populate a profile name consistent with auth metadata. Candidate repair now, lower priority than authority defects.

## 7. Protections worth preserving

- `protectPage` uses verified server user identity and canonical database role lookup; missing user/role is denied. Synthetic denial/allow counterexamples confirm this function's intended behavior.
- Navbar identity comes from server layout props, not mutable persisted browser role flags. The navbar handles external sign-out and navigation refresh. Do not infer a general privilege bypass merely from `auth-store` persistence.
- Main setup scripts hardcode member role, enforce unique role per auth user, enable RLS, and limit ordinary role/profile reads to self. These are source protections, not a claim about deployed policies.
- Service credentials are read in server-side factories, not placed in public env names. `.dockerignore` excludes `.env*`; Cloud Build provides the secret at runtime; container runs non-root. No leaked credential was observed or searched for in secret files.
- Admin demo sends no email/payment, stores no invite password, and labels mock billing. Refresh-reset behavior is deliberate. Service-only access to domain fixtures/store is maintained in the reviewed UI paths.
- Ledger date/PBM/status filters run before pagination, page bounds are clamped for ordinary integer inputs, and empty sets are handled. Separate federal and commercial fields avoid aliasing different values.
- Async read effects generally cancel obsolete result application. Member mutation/form components often use busy state and try/finally or form submission state. Preserve these when adding real latency.

## 8. Coverage gaps and questions for adjudication

**Highest-priority missing evidence:** built action manifest/HTTP behavior with Moose disabled and enabled; actual installed auth trigger/RLS; deployed native decoder versions and image ingress. Those determine exposure, not whether the cited source omissions exist. Reproduce only with synthetic isolated substitutes in the next stage.

**Financial decisions:** gross positive “underpaid” and “owed” are identical ($4,088.54), while signed net owed is $3,534.86. The test explicitly requires equality of the first two, but the contracts do not settle their business definitions. Do not change either formula based on this review alone. Seven federal fixture differences disagree by one cent with subtraction of the displayed rounded expected/paid values; higher-precision rounding is a plausible explanation. Frank must define calculation precision before classifying that as a financial defect. These questions are distinct from A-004's demonstrated missing-PBM omission.

**Sorting decision:** code deliberately sorts only the current 25-row page and labels global/server sort deferred. Ascending date on page 1 begins 2026-05-15 while the dataset's earliest date (2025-12-15) remains on page 6. This limits user interpretation and contradicts a naive “sort all results” expectation, but the deferral is explicit. Agree semantics before real pagination; the existing no-sort service signature cannot provide server sorting without a contract decision. Do not treat a header-click test as proof of global order.

**Demo consistency decisions:** synthetic save of pharmacyName changes settings but not store/billing names. Add-store creates a card without settings/billing counterparts, and an unknown-store invite is accepted by the local service. The original brief explicitly specifies a mock card drop and postpones provisioning; normal Settings uses only the first seeded store. These observations are bounded demo/integration questions, not demonstrated authorization breaches or a mandate to implement real provisioning now. Clarify whether same-store identity must synchronize during demonstrations. Real tenant ownership must be enforced at the eventual backend, regardless of TypeScript input signatures.

**Auth/session gaps:** no expired-cookie refresh, role-downgrade browser navigation, multiple tabs, Supabase SSR cookie chunking, password-update outage or logout error UX was exercised. Source shows navbar only refreshes on SIGNED_OUT; cached page UI after an external role change remains a test case, not an additional proven authority flaw. Unused UserMenu/MobileNav references to persisted roles were not promoted to active-path findings.

**Verification scope:** no installed dependency tree, typecheck, lint, Jest, Next compilation, visual/mobile browser test, database execution, deployment, load test or comprehensive advisory scan. Original tests use synthetic navigation/cache/SDK doubles; `proxy.test.ts` proves delegation/matcher strings, not denial; `actions.test.ts` covers protectPage, not Moose CRUD; store owner-shape checks prove API shape, not tenant isolation. `drawer-apply.integration.test.tsx` is useful component integration but not an actual browser/HTTP end-to-end test. Test pass claims in historical requirements were not used as current evidence.

**Performance:** Moose list reads all non-superadmin role IDs then sends an IN filter and paginates profiles. This is an O(N) pre-read despite a six-row page and could encounter hosted response limits at scale. No actual limit/configuration/volume was verified, so no measured performance or completeness finding is asserted. Ledger filtering is O(N), current-page sorting O(25 log 25), appropriate for the fixture size; no speculative optimization request.

## 9. Suggested disposition

**Candidate repair now:** A-001 first; A-002 and A-003 security containment/installation decisions next; then A-004, A-005, A-007, and lower-priority A-008. All objectives remain advisory and require the separate bounded-rework stage.

**Decision needed:** installed SQL provenance, intended Moose lifecycle/global operator authority, unknown-PBM presentation, financial sign/rounding definitions, sorting semantics and contradictory phase ownership. Resolve the mock admin identity/provisioning expectations without expanding this demo into StoreLens.

**Future gate:** A-006 plus actual tenant-boundary, atomic mutation/audit, idempotency, failure recovery and session-transition evidence before domain backend connection. **Optional:** reconciled architecture docs/test naming once the authoritative decisions are made. No finding quota or stylistic cleanup is proposed.

## 10. Self-critique and narrowed hypotheses

1. **Layout protects actions?** Challenged against all application guards, action imports, proxy, and official locked-version framework source. It does not protect the function boundary. However, false-flag compilation/action retention is untested; do not claim a reproduced public exploit. Severity bounded to High.
2. **All database paths trust metadata?** Disproved. Main setup assigns member; only the documented alternative migration trusts role metadata. A-002 is conditional.
3. **All current dependency advisories apply?** Disproved. Windows-only RCE does not match Alpine; July action DoS is fixed by locked 16.2.12. AVIF remains a version-matched conditional path, not demonstrated code execution. No exploit code was run.
4. **Missing real upload/Stripe/report functionality is a defect?** Withdrawn. Explicitly deferred. A-006 concerns future swap readiness, not current ingest success requirements.
5. **Page-only sorting is an undisclosed implementation accident?** Narrowed to an explicit tradeoff/contract question. No separate current-defect finding.
6. **Gross vs net and one-cent discrepancies prove wrong pharmacy math?** Withdrawn as defect claims pending financial definitions. Null-PBM omission remains independently reproducible with the existing positive-only rule.
7. **Persisted auth flags defeat page security?** Not supported on active shared-navbar/layout paths. Server role checks remain canonical. Session staleness needs browser integration evidence.
8. **Demo state mutation probes prove tenant leaks?** No. They exercise a fictional local store with a minimal Zustand substitute. Deployment/session ownership claims cannot be derived from them.
9. **Probe strength:** type erasure and handler extraction preserve the relevant bodies but bypass compilation, framework routing, real SDK behavior and React rendering. E2 is limited accordingly. Missing dependencies are an environment limitation, not a fabricated tooling defect or passing test result.

## 11. Final change-boundary check

The final comparison is recorded in [manifest-comparison.json](evidence/manifest-comparison.json) and [final-manifest.json](evidence/final-manifest.json). It rescans the same inclusion policy, including additions/deletions within included trees, and checks every initial included path. **215 inputs; no added, deleted, or changed included files.** This proves stability during review only, not historical Git provenance.

All review-created files are under `astra-review/`: this report, preserved prompt/clarification, run notes, manifest script/manifests/comparison, synthetic probes/logs, dependency preflight/tooling evidence, numbered source excerpts and official-source notes. No application source, existing tests, fixture, configuration, manifest/lockfile, environment file, SQL or project contract was edited. No ordinary build/cache artifacts were generated outside the review directory. No pre-existing file was restored or deleted. No unexplained input change was observed. Excluded secrets/prior-review files were not content-audited, so no claim is made about their bytes.

No repairs, dependency installations/upgrades, Git mutations, live application-service requests, emails, payments, migrations or deployments were performed.
