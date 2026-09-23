/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OwedBookScreen from "@/components/owedbook/OwedBookScreen";
import { OwedBookProvider, useOwedBook } from "@/components/owedbook/OwedBookContext";
import { round2, usd } from "@/components/owedbook/format";
import { owedBookService } from "@/services/owedbook";
import { owedBookFixtures } from "@/mocks/owedbook";
import type { OwedBookFilters, OwedBookKpis, OwedBookRow, OwedBookSummaryRow } from "@/types/OwedBook";

// RRM-002 AC-101..AC-104 at the screen level. Part 1 runs against the REAL
// mock-backed service; every expected dollar figure is DERIVED from the
// fixtures here (never a literal). Part 2 spies on the service to inject
// rejected / deferred / cross-filter responses for the same-filters pairing.

const NOTE = "summary-unattributed-note";
const COPY = "in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown.";

// Derivation (S0 §1): gap == Σ positive owed on null-PBM rows within the filtered set.
const expectedNote = (pick: (r: OwedBookRow) => boolean = () => true) =>
  `${usd(
    round2(
      owedBookFixtures
        .filter((r) => r.pbm === null && r.owed > 0 && pick(r))
        .reduce((s, r) => s + r.owed, 0)
    )
  )} ${COPY}`;

// Tiny harness: the only way filters change in production is through the context.
const FilterDriver = ({ next }: { next: OwedBookFilters }) => {
  const { applyFilters } = useOwedBook();
  return (
    <button type="button" onClick={() => applyFilters(next)}>
      drive-apply
    </button>
  );
};

const renderScreen = (next: OwedBookFilters = { pbms: [] }) =>
  render(
    <OwedBookProvider>
      <FilterDriver next={next} />
      <OwedBookScreen />
    </OwedBookProvider>
  );

// Radix TabsTrigger activates on mousedown (button 0, no ctrl).
const goTab = (name: string) => fireEvent.mouseDown(screen.getByRole("tab", { name }));
const applyFilters = () => fireEvent.click(screen.getByRole("button", { name: "drive-apply" }));
const skeletonGone = () =>
  waitFor(() => expect(screen.queryByTestId("owedbook-skeleton")).not.toBeInTheDocument());

describe("OwedBookScreen disclosure — real mock service", () => {
  it("AC-101 unfiltered: exactly one note whose value is derived from the fixtures", async () => {
    renderScreen();
    goTab("Summary");
    const note = await screen.findByTestId(NOTE);
    expect(screen.getAllByTestId(NOTE)).toHaveLength(1);
    expect(note).toHaveTextContent(expectedNote());
  });

  it("AC-101 filtered: a date range isolating a null-PBM row shows that subset's derived value", async () => {
    const range = { from: "2026-06-01", to: "2026-06-01" };
    const inRange = (r: OwedBookRow) => r.date >= range.from && r.date <= range.to;
    const unfiltered = expectedNote();
    const filtered = expectedNote(inRange);
    expect(filtered).not.toBe(unfiltered); // the range really narrows the set

    renderScreen({ ...range, pbms: [] });
    goTab("Summary");
    await screen.findByTestId(NOTE);
    applyFilters();
    await screen.findByTestId("active-filters");
    await waitFor(() => expect(screen.getByTestId(NOTE)).toHaveTextContent(filtered));
    expect(screen.getAllByTestId(NOTE)).toHaveLength(1);
  });

  it("AC-102 named-PBM-only filter: no note", async () => {
    const pbms = await owedBookService.getPbmOptions();
    const namedOnlyK = round2(
      owedBookFixtures.filter((r) => r.pbm !== null && r.owed > 0).reduce((s, r) => s + r.owed, 0)
    );
    renderScreen({ pbms });
    goTab("Summary");
    await screen.findByTestId(NOTE);
    applyFilters();
    // KPI tiles show the named-only total (derived) → the KPI request for the new filters
    // resolved. Two tiles carry it (Owed == Commercial Underpaid, ledger R-003), hence findAll.
    await screen.findAllByText(usd(namedOnlyK));
    await skeletonGone();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();
  });

  it("AC-104: absent on the other three tabs; removed on switch away; back after the skeleton", async () => {
    renderScreen();
    await screen.findByText(/Page 1 of/); // Commercial loaded
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();

    goTab("Updated Payments");
    await skeletonGone();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();

    goTab("Federal Dollars");
    await skeletonGone();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();

    goTab("Summary");
    await screen.findByTestId(NOTE);

    goTab("Commercial Dollars");
    await waitFor(() => expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument());
    await skeletonGone();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();

    goTab("Summary"); // A-03: re-requests summary rows; note returns after the skeleton
    expect(screen.getByTestId("owedbook-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();
    expect(await screen.findByTestId(NOTE)).toHaveTextContent(expectedNote());
  });
});

type Deferred<T> = { promise: Promise<T>; resolve: (v: T) => void };
const deferred = <T,>(): Deferred<T> => {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
};

describe("OwedBookScreen disclosure — injected responses (AC-103 same-filters pair)", () => {
  const realKpis = owedBookService.getKpis.bind(owedBookService);
  const realSummary = owedBookService.getSummary.bind(owedBookService);

  afterEach(() => jest.restoreAllMocks());

  it("rejected getKpis: no note, ZERO_KPIS fallback unchanged", async () => {
    jest.spyOn(owedBookService, "getKpis").mockRejectedValue(new Error("kpis down"));
    renderScreen();
    goTab("Summary");
    await skeletonGone();
    await screen.findAllByText("OptumRx"); // summary rendered (DataTable paints table + card layouts)
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();
    expect(screen.getAllByText("$0.00").length).toBeGreaterThanOrEqual(3); // three money tiles at zero
  });

  it("loading: skeleton shows no note while the summary is pending", async () => {
    const pending = deferred<OwedBookSummaryRow[]>();
    jest.spyOn(owedBookService, "getSummary").mockImplementation(() => pending.promise);
    renderScreen();
    goTab("Summary");
    expect(screen.getByTestId("owedbook-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();
    pending.resolve(await realSummary({ pbms: [] }));
    expect(await screen.findByTestId(NOTE)).toHaveTextContent(expectedNote());
  });

  it("stale summary: deferred across a filters change, then resolved → no note from the stale pair", async () => {
    const calls: Deferred<OwedBookSummaryRow[]>[] = [];
    jest.spyOn(owedBookService, "getSummary").mockImplementation(() => {
      const d = deferred<OwedBookSummaryRow[]>();
      calls.push(d);
      return d.promise;
    });
    renderScreen({ from: "2026-01-01", pbms: [] });
    goTab("Summary");
    expect(calls).toHaveLength(1);
    applyFilters(); // filters change while call 1 is still pending
    await screen.findByTestId("active-filters");
    expect(calls).toHaveLength(2);
    calls[0].resolve(await realSummary({ pbms: [] })); // stale pair resolves late
    await Promise.resolve();
    expect(screen.getByTestId("owedbook-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();
    calls[1].resolve(await realSummary({ from: "2026-01-01", pbms: [] })); // the valid pair
    expect(await screen.findByTestId(NOTE)).toHaveTextContent(
      expectedNote((r) => r.date >= "2026-01-01")
    );
  });

  it("K for filters A with S for filters B → no note until K for B resolves", async () => {
    const filtersB: OwedBookFilters = { from: "2026-01-01", pbms: [] };
    let pendingKpis: Deferred<OwedBookKpis> | null = null;
    renderScreen(filtersB);
    goTab("Summary");
    await screen.findByTestId(NOTE); // pair A valid

    jest.spyOn(owedBookService, "getKpis").mockImplementation(() => {
      pendingKpis = deferred<OwedBookKpis>();
      return pendingKpis.promise;
    });
    applyFilters(); // B: summary resolves (real), KPI stays pending → K is still A's
    await screen.findByTestId("active-filters");
    await skeletonGone();
    expect(pendingKpis).not.toBeNull();
    expect(screen.queryByTestId(NOTE)).not.toBeInTheDocument();

    pendingKpis!.resolve(await realKpis(filtersB));
    expect(await screen.findByTestId(NOTE)).toHaveTextContent(
      expectedNote((r) => r.date >= filtersB.from!)
    );
  });
});
