import type { OwedBookSummaryRow } from "@/types/OwedBook";
import { round2, usd } from "./format";

// RRM-002 disclosure (Director D3, ledger R-015). The Summary breakdown skips
// claims with no PBM yet; the KPI total does not. This note states the gap
// between the two aggregates the service already returns for the SAME filters:
//   gap = round2(K − S), K = getKpis().commercial_underpaid,
//                        S = Σ getSummary()[i].commercial_dollars
// No other arithmetic, no count, no new bucket. Hidden when gap < 0.01
// (so "$0.00" and negative gaps never render). Pairing of K and S to one
// filters snapshot is the screen's job — this component only formats.
const NOTE_COPY =
  "in underpaid dollars belongs to claims awaiting a PBM match and isn't shown in this breakdown.";

interface SummaryUnattributedNoteProps {
  underpaid: number;
  summary: OwedBookSummaryRow[];
}

const SummaryUnattributedNote = ({ underpaid, summary }: SummaryUnattributedNoteProps) => {
  const attributed = summary.reduce((total, row) => total + row.commercial_dollars, 0);
  const gap = round2(underpaid - attributed);
  if (gap < 0.01) return null;

  return (
    <p data-testid="summary-unattributed-note" className="text-sm text-muted-foreground">
      {`${usd(gap)} ${NOTE_COPY}`}
    </p>
  );
};

export default SummaryUnattributedNote;
