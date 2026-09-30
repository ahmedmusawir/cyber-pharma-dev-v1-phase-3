> Provenance: QA Lead (SOL / JARVIS) Gate Q certification, relayed by the Director on 2026-09-29 and filed verbatim by the Engineer at P5 closeout. Text below the rule is unedited QA-seat text.

---

FABLE — QA LEAD CERTIFICATION: RRM-003-CYBER-PHARMA

Gate Q verdict: PASS.

Certified immutable product candidate:
21ea108bb27b965ddc5edae29dc3b1d6971ae576

QA HEAD:
1a94277b73c9ee61eab1ed74991f54fcd4771afe

The candidate-to-QA-HEAD difference is documentation/evidence only. Cody made no product repair and performed no Git mutation.

FINAL RESULTS

- 26 acceptance criteria PASS.
- 0 FAIL.
- 0 BLOCKED.
- 0 NOT RUN.
- ADMIN and MEMBER completed 249/249 authenticated browser checks.
- Coverage included desktop and 375px, light and dark themes.
- Sorting, focus traps, nested Escape behavior, routes, logout, and session protection passed.
- Eight focused screenshots and two sanitized browser traces were retained.
- Console, hydration, page, and failed-route errors: zero.
- Independent builds, TypeScript, ESLint, Jest, protected-path checks, SQL quarantine checks, and cache-header verification passed.
- The QA server was stopped and its port was confirmed closed.
- No credential, environment-value, or session leakage was reported.

ENVIRONMENT RULING

The Director authorized the existing main development Supabase in place of unavailable SCRATCH for the login-only AC-107 walk. Existing ADMIN and MEMBER accounts were used. This substitution resolved QA-F01 and did not authorize application-data changes, user creation, role changes, or Supabase configuration changes.

QA-F02 ADJUDICATION

Cody observed that Enter on the focused, closed PBM trigger was prevented and did not open the control; Space opened it and moved focus correctly.

QA Lead disposition: NON-BLOCKING OBSERVATION.

The frozen keyboard contract passed using Space, a complete keyboard path exists, and Cody did not establish that RRM-003 introduced the Enter behavior. It is not charged as an RRM-003 defect and does not justify a repair round. Preserve it in the observation/backlog lane for a future accessibility review.

CERTIFICATION BOUNDARY

This certification applies only to RRM-003 and candidate 21ea108bb27b965ddc5edae29dc3b1d6971ae576. It certifies the frozen RRM-003 acceptance contract and does not expand into deferred campaign findings or future modules.

DIRECTOR INTENT

The Director wants RRM-003 closed now without reopening engineering. Please issue the bounded Architect closeout prompt for Claudy on qa/phase-3-rrm003.

Closeout should preserve durable QA evidence, retain the QA-F02 observation, record the Gate Q PASS, complete the two-seat campaign-journal entries without either seat editing the other, remove only disposable QA debris, confirm no product-code change after the certified candidate, and return an explicit staging/commit block to the Director.

Claudy must not commit, merge, push, repair product code, or rerun the entire campaign unless the closeout checks expose evidence corruption.

— SOL / JARVIS
QA Lead
RRM-003-CYBER-PHARMA
29 September 2026
