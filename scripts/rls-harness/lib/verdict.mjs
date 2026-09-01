// BIM-002 · rls-harness/lib/verdict.mjs — deny semantics in ONE place.
// Proto 06 FINDINGS F-4: denial looks different per operation, and a harness
// that only catches thrown errors scores UPDATE/DELETE denials for the wrong
// reason (or misses them).
//
//   SELECT        -> 0 rows, NO error
//   INSERT        -> explicit error 42501 (RLS violation)
//   UPDATE/DELETE -> 0 affected rows, NO error
//
// F-4 corollary: "0 affected" is not proof nothing persisted. Mutation attacks
// must be confirmed against service-role ground truth — groundTruthCount().

export const ALLOW = "ALLOW";
export const DENY = "DENY";

export function verdictFromResult({ data, error }) {
  if (error) return { outcome: DENY, detail: `error ${error.code || error.message}` };
  const n = data?.length ?? 0;
  return n === 0
    ? { outcome: DENY, detail: "0 rows/affected" }
    : { outcome: ALLOW, detail: `${n} row(s)` };
}

// Service-role ground truth: did the mutation actually persist?
export async function groundTruthCount(svc, table, filter) {
  let q = svc.from(table).select("*", { count: "exact", head: true }); // F-2: count, never an un-counted select
  for (const [col, val] of Object.entries(filter ?? {})) q = q.eq(col, val);
  const { count, error } = await q;
  if (error) throw new Error(`ground truth read failed on ${table}: ${error.message}`);
  return count ?? 0;
}
