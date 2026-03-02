// src/app/components/UI/MultiSelect.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: number;
  label: string;
  sub?:  string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "ค้นหา...",
}: {
  options:     SelectOption[];
  selected:    Set<number>;
  onChange:    (next: Set<number>) => void;
  placeholder?: string;
}) {
  const [search,  setSearch]  = useState("");
  const [open,    setOpen]    = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  // คำนวณตำแหน่ง dropdown ทุกครั้งที่เปิด
  useEffect(() => {
    if (open && boxRef.current) {
      const r = boxRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
  }, [open]);

  const filtered = search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          (o.sub ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const toggle = (val: number) => {
    const next = new Set(selected);
    next.has(val) ? next.delete(val) : next.add(val);
    onChange(next);
  };

  const remove = (val: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selected);
    next.delete(val);
    onChange(next);
  };

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      {/* ── Tag input box ── */}
      <div
        className="form-control border-0 bg-light rounded-3 d-flex flex-wrap gap-1 align-items-center"
        style={{ minHeight: "42px", cursor: "text" }}
        onClick={() => setOpen(true)}
      >
        {[...selected].map((val) => {
          const opt = options.find((o) => o.value === val);
          return opt ? (
            <span
              key={val}
              className="badge d-flex align-items-center gap-1 px-2 py-1"
              style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.72rem", whiteSpace: "nowrap" }}
            >
              {opt.label}
              <span
                style={{ cursor: "pointer", fontWeight: "bold", lineHeight: 1 }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => remove(val, e)}
              >
                ×
              </span>
            </span>
          ) : null;
        })}
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="border-0 bg-transparent flex-grow-1"
          style={{ outline: "none", fontSize: "0.85rem", minWidth: "80px", background: "transparent" }}
          placeholder={selected.size === 0 ? placeholder : ""}
        />
      </div>

      {/* ── Dropdown via Portal ── */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            {/* overlay */}
            <div
              style={{ position: "fixed", inset: 0, zIndex: 9990 }}
              onMouseDown={() => { setOpen(false); setSearch(""); }}
            />
            {/* list */}
            <div
              className="border rounded-3 bg-white shadow"
              style={{
                position:  "absolute",
                zIndex:    9991,
                top:       dropPos.top,
                left:      dropPos.left,
                width:     dropPos.width,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {filtered.length === 0 ? (
                <div className="text-muted small text-center py-3">ไม่พบรายการ</div>
              ) : (
                filtered.map((o) => (
                  <label
                    key={o.value}
                    className={`d-flex align-items-center gap-2 px-3 py-2 border-bottom mb-0 ${
                      selected.has(o.value) ? "bg-success bg-opacity-10" : ""
                    }`}
                    style={{ cursor: "pointer", fontSize: "0.82rem" }}
                    // ใช้ onMouseDown แทน onClick เพื่อไม่ให้ overlay ปิดก่อน
                    onMouseDown={(e) => { e.preventDefault(); toggle(o.value); }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input m-0 flex-shrink-0"
                      checked={selected.has(o.value)}
                      onChange={() => {}} // controlled via onMouseDown
                    />
                    <span className="fw-semibold flex-grow-1">{o.label}</span>
                    {o.sub && (
                      <span
                        className="badge"
                        style={{ background: "#f0fdf4", color: "#166534", fontSize: "0.65rem" }}
                      >
                        {o.sub}
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}