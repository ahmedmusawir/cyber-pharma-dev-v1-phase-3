# RULINGS_ADDENDUM — BIM-003-CYBER-PHARMA (append-only; CLAUDE.md §5 and BIM003_BRIEF.md are frozen)

- R-6a (2026-09-14, Architect, credited Claudy): BEFORE TRUNCATE FOR EACH STATEMENT trigger on audit_logs raising unconditionally. Row triggers never see TRUNCATE; without it the service role could empty the trail in one statement. Extends R-6 "every role, no exceptions."
- R-8a (2026-09-14, Architect): businesses is stamped with business_id = its own id (its id IS the business). Precedent 0019:25.
- R-10 (2026-09-14, Architect): the S3 audit runner seeds a small set of user_data rows with insurance, new_paid, and status populated so the golden trail exercises summary, pbm_options, and the updated tab non-empty. Audit-runner seed only; BIM-002 cast untouched.
- CF-9 (carried flag): scripts/db-verify.mjs AC7 asserts zero non-baseline policies and has been red since BIM-002 (0016). Pre-existing. Route: QA Cleanup — re-baseline AC7 to the certified policy set. Sol informed via this file.
- CF-8 additions (harness improvements → BIM-005): rls-prove sub-runners write evidence to a hardcoded BIM-002 path; prove.mjs verdict line says "18 policies" (now 19); give scratch a real env prefix so the harness never depends on the app's NEXT_PUBLIC_* runtime names.
