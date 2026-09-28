/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SummaryUnattributedNote from "@/components/owedbook/SummaryUnattributedNote";

// RRM-002 AC-101 (text/testid) + AC-102 (gap < 0.01 never renders, "$0.00" never shown).
// K and S are injected directly; the screen-level pairing is covered in
// OwedBookScreen.disclosure.test.tsx.
const rows = (...dollars: number[]) =>
  dollars.map((d, i) => ({ pbm: `PBM ${i}`, commercial_dollars: d, federal_dollars: 0 }));

const COPY = "in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown.";

describe("SummaryUnattributedNote", () => {
  it("renders exactly one note with usd(gap) when gap ≥ 0.01 (AC-101)", () => {
    render(<SummaryUnattributedNote underpaid={100} summary={rows(80, 5)} />);
    const notes = screen.getAllByTestId("summary-unattributed-note");
    expect(notes).toHaveLength(1);
    expect(notes[0]).toHaveTextContent(`$15.00 ${COPY}`);
  });

  it("renders at the 0.01 boundary", () => {
    render(<SummaryUnattributedNote underpaid={10.01} summary={rows(10)} />);
    expect(screen.getByTestId("summary-unattributed-note")).toHaveTextContent(`$0.01 ${COPY}`);
  });

  it("renders nothing when gap is exactly 0 (AC-102)", () => {
    const { container } = render(<SummaryUnattributedNote underpaid={10} summary={rows(6, 4)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when S exceeds K by 0.004 (AC-102)", () => {
    const { container } = render(<SummaryUnattributedNote underpaid={10} summary={rows(10.004)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when K − S = 0.004 (rounds to 0)", () => {
    const { container } = render(<SummaryUnattributedNote underpaid={10.004} summary={rows(10)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a negative gap of −5.00 (AC-102)", () => {
    const { container } = render(<SummaryUnattributedNote underpaid={5} summary={rows(10)} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/\$0\.00/)).not.toBeInTheDocument();
  });
});
