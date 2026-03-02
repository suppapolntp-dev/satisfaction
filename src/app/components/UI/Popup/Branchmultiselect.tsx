"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Option {
  value: number;
  label: string;
  sub?:  string;
}

interface BranchMultiSelectProps {
  options:  Option[];
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
}

export function BranchMultiSelect({ options, selected, onChange }: BranchMultiSelectProps) {
  const [search,  setSearch]  = useState("");
  const [open,    setOpen]    = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && boxRef.current) {
      const r = boxRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
  }, [open]);

  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        (o.sub ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const toggle = (val: number) => {
    const next = new Set(selected);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange(next);
  };

  return (
    <div ref={boxRef} className="position-relative">
      <div
        className="form-control border-0 bg-light rounded-3 d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer", minHeight: "42px" }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-muted small">
          {selected.size === 0 ? "-- เลือก --" : `เลือกแล้ว ${selected.size} รายการ`}
        </span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} text-muted small`} />
      </div>

      {open && createPortal(
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10000 }} onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: dropPos.top, left: dropPos.left, width: dropPos.width,
            zIndex: 10001, background: "white", border: "1px solid #dee2e6",
            borderRadius: "0.75rem", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: "260px", overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            <div className="p-2 border-bottom">
              <input
                className="form-control form-control-sm border-0 bg-light rounded-3"
                placeholder="ค้นหา..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div style={{ overflowY: "auto" }}>
              {filtered.length === 0
                ? <div className="text-muted small text-center py-2">ไม่พบ</div>
                : filtered.map((o) => (
                  <label key={o.value}
                    className={`d-flex align-items-center gap-2 px-3 py-2 border-bottom mb-0 ${selected.has(o.value) ? "bg-success bg-opacity-10" : ""}`}
                    style={{ cursor: "pointer", fontSize: "0.82rem" }}
                    onMouseDown={(e) => { e.preventDefault(); toggle(o.value); }}
                  >
                    <input type="checkbox" className="form-check-input m-0 flex-shrink-0"
                      checked={selected.has(o.value)} onChange={() => {}} />
                    <span className="fw-semibold flex-grow-1">{o.label}</span>
                    {o.sub && (
                      <span className="badge" style={{ background: "#f0fdf4", color: "#166634", fontSize: "0.65rem" }}>
                        {o.sub}
                      </span>
                    )}
                  </label>
                ))
              }
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}