"use client";

export function SatisfactionChart() {
  return (
    <div className="col-12 col-lg-8">
      <div
        className="card border rounded-4 shadow-sm p-4"
        style={{ minHeight: "400px" }}
      >
        <h5 className="fw-bold mb-4">Satisfaction by (Brand) ตัวแปร</h5>
        {/* Chart Placeholder Structure */}
        <div className="d-flex align-items-end justify-content-around h-100 pt-5">
          {[
            { name: "a", h: "60%" },
            { name: "b", h: "80%" },
            { name: "c", h: "30%" },
            { name: "d", h: "70%" },
          ].map((brand, i) => (
            <div key={i} className="text-center w-100">
              <div
                className="bg-success rounded-top mx-auto"
                style={{ width: "40px", height: brand.h, opacity: 0.8 }}
              ></div>
              <p
                className="mt-3 text-muted fw-bold mb-0"
                style={{ fontSize: "0.75rem" }}
              >
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OverallChart() {
  return (
    <div className="col-12 col-lg-4">
      <div className="card border rounded-4 shadow-sm p-4 h-100 text-center">
        <h5 className="fw-bold mb-1">Overall Sentiment</h5>
        <p className="text-muted small mb-5">Aggregated from all branches</p>
        <div
          className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "180px",
            height: "180px",
            background:
              "conic-gradient(#10b981 0% 65%, #ffc107 65% 85%, #ef4444 85% 100%)",
          }}
        >
          <div
            className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
            style={{ width: "135px", height: "135px" }}
          >
            <h2 className="fw-bold mb-0">65%</h2>
            <span
              className="text-success fw-bold text-uppercase"
              style={{ fontSize: "0.65rem" }}
            >
              Smile ขึ้นมาตามค่ามากที่สุด
              
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
