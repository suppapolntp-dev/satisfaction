// src/app/components/Statistic/chart.tsx
"use client";

export interface StatsData {
  total:       number;
  counts:      { good: number; average: number; poor: number };
  percentages: { good: number; average: number; poor: number };
  updatedAt:   string;
}

// ─── ส่วนที่ 1+2: ยอดรวม + 3 sentiment blocks ──
export function SatisfactionChart({ data, loading, updatedAt }: { data: StatsData | null; loading: boolean; updatedAt: string }) {
  const counts = data?.counts ?? { good: 0, average: 0, poor: 0 };

  const items = [
    { icon: "sentiment_dissatisfied", label: "แย่",      count: counts.poor,    color: "#dc3545" },
    { icon: "sentiment_neutral",      label: "ปานกลาง", count: counts.average, color: "#ffc107" },
    { icon: "sentiment_satisfied",    label: "ดี",       count: counts.good,    color: "#10b981" },
  ];

  return (
    <div className="col-12 col-lg-8">
      <div className="card border rounded-4 shadow-sm p-4" style={{ minHeight: "280px" }}>

        {/* header: ชื่อ + ยอดรวม + วันที่ */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-1">ความพึงพอใจที่ตอบกลับทั้งหมด</h5>
            <div className="d-flex align-items-end gap-2">
              <span className="fw-bold" style={{ fontSize: "2rem", color: "#10b981", lineHeight: 1 }}>
                {loading ? <span className="spinner-border spinner-border-sm text-success" /> : (data?.total ?? 0).toLocaleString()}
              </span>
              <span className="text-muted fw-semibold mb-1" style={{ fontSize: "0.85rem" }}>ครั้ง</span>
            </div>
          </div>
          {updatedAt && (
            <span className="text-muted d-flex align-items-center gap-1 flex-shrink-0" style={{ fontSize: "0.72rem" }}>
              <i className="bi bi-clock text-success" />
              {updatedAt}
            </span>
          )}
        </div>

        {loading ? (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "50px" }}>
            <span className="spinner-border text-success me-2" />
            <span className="text-muted">กำลังโหลด...</span>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-4" key={item.label}>
                <div
                  className="d-flex flex-column align-items-center justify-content-center gap-2 p-3 rounded-4 border h-100"
                  style={{ borderColor: item.color, borderWidth: "2px", minHeight: "130px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: item.color }}>
                    {item.icon}
                  </span>
                  <div className="text-center">
                    <div className="fw-bold" style={{ fontSize: "1.6rem", color: item.color, lineHeight: 1 }}>
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-muted fw-semibold mt-1" style={{ fontSize: "0.8rem" }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ส่วนที่ 3: Donut + icon ตรงกลาง ──────────
export function OverallChart({ data, loading }: { data: StatsData | null; loading: boolean }) {
  const counts = data?.counts ?? { good: 0, average: 0, poor: 0 };
  const total  = counts.good + counts.average + counts.poor;

  const goodPct    = total > 0 ? (counts.good    / total) * 100 : 0;
  const averagePct = total > 0 ? (counts.average / total) * 100 : 0;
  const poorPct    = total > 0 ? (counts.poor    / total) * 100 : 0;

  const goodEnd    = goodPct;
  const averageEnd = goodEnd + averagePct;

  const topKey = counts.good >= counts.average && counts.good >= counts.poor ? "happy"
               : counts.average >= counts.poor ? "neutral" : "sad";

  const topIcon  = topKey === "happy" ? "sentiment_satisfied"
                 : topKey === "neutral" ? "sentiment_neutral" : "sentiment_dissatisfied";
  const topColor = topKey === "happy" ? "#10b981" : topKey === "neutral" ? "#ffc107" : "#dc3545";
  const topPct   = topKey === "happy" ? goodPct : topKey === "neutral" ? averagePct : poorPct;
  const topLabel = topKey === "happy" ? "ดี" : topKey === "neutral" ? "ปานกลาง" : "แย่";

  const gradient = total === 0
    ? "#e5e7eb"
    : `conic-gradient(#10b981 0% ${goodPct}%, #ffc107 ${goodPct}% ${averageEnd}%, #dc3545 ${averageEnd}% 100%)`;

  return (
    <div className="col-12 col-lg-4">
      <div className="card border rounded-4 shadow-sm p-4 h-100 d-flex flex-column align-items-center">
        <h5 className="fw-bold mb-3 align-self-start">ภาพรวมความพึงพอใจ</h5>

        {loading ? (
          <div className="d-flex align-items-center justify-content-center flex-grow-1">
            <span className="spinner-border text-success me-2" />
            <span className="text-muted small">กำลังโหลด...</span>
          </div>
        ) : (
          <>
            {/* Donut */}
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
              style={{ width: "160px", height: "160px", background: gradient }}>
              <div className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
                style={{ width: "130px", height: "130px" }}>
                {total === 0 ? (
                  <span className="text-muted small">ไม่มีข้อมูล</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: topColor }}>
                      {topIcon}
                    </span>
                    <span className="fw-bold" style={{ fontSize: "1rem", color: topColor }}>
                      {Math.round(topPct)}%
                    </span>
                    <span className="text-muted" style={{ fontSize: "0.6rem" }}>{topLabel}</span>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="d-flex flex-column gap-2 w-100 mt-4 px-2">
              {[
                { icon: "sentiment_satisfied",   label: "ดี",       pct: Math.round(goodPct),    count: counts.good,    color: "#10b981" },
                { icon: "sentiment_neutral",      label: "ปานกลาง", pct: Math.round(averagePct), count: counts.average, color: "#ffc107" },
                { icon: "sentiment_dissatisfied", label: "แย่",     pct: Math.round(poorPct),    count: counts.poor,    color: "#dc3545" },
              ].map((leg) => (
                <div key={leg.label} className="d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: "1.2rem", color: leg.color }}>{leg.icon}</span>
                  <span className="small flex-grow-1 fw-semibold">{leg.label}</span>
                  <span className="fw-bold small" style={{ color: leg.color }}>{leg.pct}%</span>
                  <span className="text-muted" style={{ fontSize: "0.72rem" }}>({leg.count.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}