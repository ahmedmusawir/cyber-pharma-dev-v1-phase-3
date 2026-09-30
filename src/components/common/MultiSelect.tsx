"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  triggerLabel?: string;
  placeholder?: string;
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  triggerLabel = "Select",
  placeholder = "Search...",
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Keyboard (R-010). Escape closes the picker only and returns focus to the
  // trigger; preventDefault + stopPropagation keep an enclosing drawer open
  // (its handler skips defaultPrevented events, A-06). Tab wraps inside the panel.
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("input, button"),
    ).filter((el) => el.tabIndex >= 0 && !el.hasAttribute("disabled"));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    // Always stop here so an enclosing drawer's trap never double-handles.
    e.stopPropagation();
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!panelRef.current.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  };

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  const summary = selected.length === 0 ? "All" : `${selected.length} selected`;

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={onKeyDown}>
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-testid="multiselect-trigger"
        className="w-full justify-between"
      >
        <span>
          <span className="text-muted-foreground mr-2">{triggerLabel}:</span>
          {summary}
        </span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {open && (
        <div
          ref={panelRef}
          data-testid="multiselect-panel"
          role="listbox"
          aria-label={triggerLabel}
          className="absolute z-50 mt-1 w-full bg-popover border border-border shadow-lg p-2 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              autoFocus
            />
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              data-testid="multiselect-clear"
              className="text-left text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground py-1 px-2 border-b border-border"
            >
              Clear all
            </button>
          )}
          <div className="max-h-64 overflow-auto flex flex-col">
            {filtered.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                No options
              </div>
            ) : (
              filtered.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent/10 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => toggleOption(opt)}
                    className="accent-primary"
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
