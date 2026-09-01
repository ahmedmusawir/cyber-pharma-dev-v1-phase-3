// BIM-002 · rls-harness/payloads.mjs — per-table probe data (DATA, not logic).
// One insert row + one update patch + a static target row per table. Tenant
// payloads deliberately point at store A1, so the same fixed payload proves
// ALLOW for A-side identities and DENY for ownerB — the cross-tenant case falls
// out of the matrix instead of needing a special case.
export function payloadsFor(m) {
  return {
    accounts:                   { insert: { name: "probe-acct", owner_user_id: m.users.ownerA }, patch: { name: "probe-upd" }, target: m.accounts.A },
    // `restore` puts a seeded row back after a PERMITTED update, so the suite is
    // idempotent across runs (X3 row-scoping check caught the drift).
    businesses:                 { insert: { account_id: m.accounts.A, ncpdp: "0999999", npi: "1099999999", pharmacy_name: "probe-store" }, patch: { pharmacy_name: "probe-upd" }, restore: { pharmacy_name: "Store A1" }, target: m.businesses.a1 },
    user_roles:                 { insert: { user_id: m.users.staffA, role: "admin" }, patch: { role: "admin" }, target: null },
    // targetFor: resolved per identity. profiles' baseline policy is "owner or
    // superadmin", so the honest probe is the caller's OWN row — otherwise the
    // cell would read DENY for the trivial reason that the target doesn't exist,
    // and BIM-002 would never notice if it broke baseline profile editing.
    profiles:                   { insert: { id: m.users.staffA, email: "probe@rls.local" }, patch: { full_name: "probe-upd" }, target: null, targetFor: (id) => m.users[id] ?? null },
    user_businesses:            { insert: { user_id: m.users.staffA, business_id: m.businesses.b1, role: "admin" }, patch: { is_primary: false }, target: null },
    pending_registrations:      { insert: { ncpdp: "0999998", npi: "1099999998", email: "probe-pending@rls.local" }, patch: { phone: "555-0000" }, target: null },
    subscriptions:              { insert: { account_id: m.accounts.A, status: "active" }, patch: { status: "past_due" }, target: m.samples.subscriptionA },
    apa_memberships:            { insert: { license_number: "LIC-PROBE", membership: "APA", first_name: "P", last_name: "Robe" }, patch: { membership: "APA-UPD" }, target: null },
    user_data:                  { insert: { business_id: m.businesses.a1, script: "RX-PROBE", drug_name: "probe" }, patch: { drug_name: "probe-upd" }, target: m.samples.factA1 },
    report_files:               { insert: { business_id: m.businesses.a1, file_name: "probe.pdf" }, patch: { file_name: "probe-upd.pdf" }, target: m.samples.reportA1 },
    aac_reference:              { insert: { ndc: "00000000999", aac_date: "2026-09-01", aac: 1.23 }, patch: { aac: 9.99 }, target: null },
    wac_reference:              { insert: { ndc: "00000000999", effective_date: "2026-09-01", wac: 1.23 }, patch: { wac: 9.99 }, target: null },
    ful_reference:              { insert: { ndc: "00000000999", year: 2026, month: 9, aca_ful: 1.234567 }, patch: { aca_ful: 9.999999 }, target: null },
    pbm_info:                   { insert: { bin: "999999", matching_type: "bin_only" }, patch: { pbm_name: "probe-upd" }, target: null },
    audit_logs:                 { insert: { username: "probe", table_name: "user_data", action: "create" }, patch: { action: "update" }, target: null },
    reference_dataset_versions: { insert: { dataset_name: "probe-dataset" }, patch: { row_count: 42 }, target: null },
  };
}
