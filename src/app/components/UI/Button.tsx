"use client";
const SFemoji_size = 8.0;
import { useState,useEffect } from "react";
import { ThankPopup } from "./Popup";
/* -----------------------------login----------------------------- */
export function Btnlogin() {
  return (
    <>
      <button
        className="btn w-100 mt-2 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #ff4d5a 0%, #dc3545 100%)",
          color: "white",
          height: "55px",
          fontWeight: "bold",
          borderRadius: "0.75rem",
        }}
      >
        <span className="me-2">Login</span>
        <span className="material-symbols-outlined fw-bold">arrow_forward</span>
      </button>
    </>
  );
}

/* -----------------------------customer----------------------------- */
export function BtnSatisfaction() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); 

  const FeedbackClick = (e: React.MouseEvent, value: string) => {
    if (isProcessing) return; // ถ้ากำลังทำงานอยู่ ไม่ให้ทำซ้ำ

    setIsProcessing(true); // เริ่ม Lock ทันที
    (e.currentTarget as HTMLElement).blur();
    setSelected(value);

    setTimeout(() => {
      setIsOpen(true);
      setSelected(null);

      setTimeout(() => {
        setIsOpen(false);
        setIsProcessing(false); // ปลด Lock เมื่อ Popup หายไปแล้ว
      }, 3500); 
    }, 1500);
  };

  return (
    <>
      <div 
        className="row g-3 g-md-4 g-lg-5 w-100 px-2 mb-5 justify-content-center"
        style={{ 
          pointerEvents: isProcessing ? "none" : "auto", 
        }}
      >
        {["sad", "neutral", "happy"].map((type) => (
          <div className="col-4" key={type}>
            <label className="sentiment-option w-100">
              <div
                className={`sentiment-card d-flex flex-column align-items-center justify-content-center gap-3 p-4 p-md-5 rounded-5 shadow-sm border ${selected === type ? "is-selected" : ""}`}
                onClick={(e) => FeedbackClick(e, type)}
                style={{
                  "--sentiment-color": type === "sad" ? "#dc3545" : type === "neutral" ? "#ffc107" : "#10b981",
                  "--sentiment-hover-bg": type === "sad" ? "#fff5f5" : type === "neutral" ? "#fffdf0" : "#f0fdf4",
                } as React.CSSProperties }
              >
                <span className="material-symbols-outlined icon-display" style={{ fontSize: "4rem", pointerEvents: "none" }}>
                  {type === "sad" ? "sentiment_dissatisfied" : type === "neutral" ? "sentiment_neutral" : "sentiment_satisfied"}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>
      {isOpen && <ThankPopup onClose={() => {}} />}
    </>
  );
}

export function BtnSubmit() {
  return (
    <>
      <div className="w-400 max-width-2xl mt-4 px-2">
        <button className="btn btn-outline-success w-100 py-4 rounded-5 border-4 shadow-sm d-flex align-items-center justify-content-center gap-2">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "2rem" }}
          >
            check_circle
          </span>
          <span className="h4 fw-black mb-0">SUBMIT FEEDBACK</span>
        </button>
      </div>
    </>
  );
}

export function BtnCreate() {
  const btnFontSize = "0.85rem"; // ปรับขนาดฟอนต์ให้ดูพอดี

  return (
    <div className="d-flex flex-column p-3 mt-2">
      <div className="d-flex justify-content-end align-items-center">
        <button
          className="btn text-white border-0 d-flex align-items-center justify-content-center gap-2 px-4 py-2"
          style={{
            borderRadius: "1rem",
            background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            boxShadow: "0 8px 20px -6px rgba(16, 185, 129, 0.5)",
            transition: "all 0.3s ease",
            minHeight: "48px", // ความสูงเท่ากับโลโก้
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "1.25rem" }}
          >
            check_circle
          </span>
          <span className="fw-bold mb-0" style={{ fontSize: btnFontSize }}>
            บันทึก
          </span>
        </button>
      </div>
    </div>
  );
}
