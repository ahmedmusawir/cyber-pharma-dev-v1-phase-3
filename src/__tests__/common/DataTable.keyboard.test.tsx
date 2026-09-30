/**
 * @jest-environment jsdom
 */

import { useState } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DataTable, type ColumnDef } from "@/components/common/DataTable";

// RRM-003 AC-101/102 (R-010): sortable headers are keyboard-operable through a
// native <button> inside the <th>; non-sortable tables keep plain headers.

interface TestRow extends Record<string, unknown> {
  id: string;
  name: string;
  amount: number;
}

const columns: ColumnDef<TestRow>[] = [
  { key: "name", label: "Name" },
  { key: "amount", label: "Amount", align: "right", numeric: true, hero: true },
];

const rows: TestRow[] = [
  { id: "1", name: "Alice", amount: 100 },
  { id: "2", name: "Bob", amount: -50 },
];

// Mirrors the page-local toggle (asc ↔ desc on the same key) so aria-sort can
// be compared between click and keyboard.
const SortHarness = () => {
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "amount",
    direction: "desc",
  });
  const onSort = (key: string) =>
    setSort((s) =>
      s.key === key
        ? { key, direction: s.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" },
    );
  return <DataTable<TestRow> columns={columns} rows={rows} sort={sort} onSort={onSort} />;
};

describe("DataTable keyboard access (AC-101/102)", () => {
  it("renders one type=button control per sortable header; columnheader role kept", () => {
    render(<DataTable<TestRow> columns={columns} rows={rows} onSort={() => {}} />);
    for (const name of [/name/i, /amount/i]) {
      const th = screen.getByRole("columnheader", { name });
      const buttons = within(th).getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveAttribute("type", "button");
    }
  });

  it("Tab reaches the sortable headers in column order", async () => {
    const user = userEvent.setup();
    render(<DataTable<TestRow> columns={columns} rows={rows} onSort={() => {}} />);
    await user.tab();
    expect(document.activeElement).toBe(
      within(screen.getByRole("columnheader", { name: /name/i })).getByRole("button"),
    );
    await user.tab();
    expect(document.activeElement).toBe(
      within(screen.getByRole("columnheader", { name: /amount/i })).getByRole("button"),
    );
  });

  it("without onSort, headers are not focusable (no button, no tabIndex, no role)", () => {
    const { container } = render(<DataTable<TestRow> columns={columns} rows={rows} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    container.querySelectorAll("th").forEach((th) => {
      expect(th).not.toHaveAttribute("tabindex");
      expect(th).not.toHaveAttribute("role");
    });
  });

  it("Enter and Space each call onSort exactly once with the column key", async () => {
    const user = userEvent.setup();
    const onSort = jest.fn();
    render(<DataTable<TestRow> columns={columns} rows={rows} onSort={onSort} />);
    await user.tab(); // Name header
    await user.keyboard("{Enter}");
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenLastCalledWith("name");
    await user.keyboard(" ");
    expect(onSort).toHaveBeenCalledTimes(2);
    expect(onSort).toHaveBeenLastCalledWith("name");
  });

  it("keyboard produces the same aria-sort sequence as click", async () => {
    const user = userEvent.setup();
    const ariaSortAfter = async (activate: (th: HTMLElement) => Promise<void>) => {
      const { unmount } = render(<SortHarness />);
      const seq: (string | null)[] = [];
      for (let i = 0; i < 3; i++) {
        await activate(screen.getByRole("columnheader", { name: /name/i }));
        seq.push(screen.getByRole("columnheader", { name: /name/i }).getAttribute("aria-sort"));
      }
      unmount();
      return seq;
    };
    const byClick = await ariaSortAfter(async (th) => {
      fireEvent.click(th);
    });
    const byEnter = await ariaSortAfter(async (th) => {
      within(th).getByRole("button").focus();
      await user.keyboard("{Enter}");
    });
    expect(byEnter).toEqual(byClick);
    expect(byClick).toEqual(["descending", "ascending", "descending"]);
  });

  it("mobile card mode carries no header buttons or tab stops", () => {
    render(<DataTable<TestRow> columns={columns} rows={rows} onSort={() => {}} />);
    const mobile = screen.getByTestId("datatable-mobile");
    expect(mobile.querySelectorAll("button, [tabindex]")).toHaveLength(0);
  });
});
