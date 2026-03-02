"use client";
import { useState } from "react";
import { ThankPopup } from "./Popup/index";
import { useSession } from "next-auth/react";

/* ─── Login Button ─────────────────────────── */
export function Btnlogin({ loading = false }: { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn w-100 mt-2 d-flex align-items-center justify-content-center"
      style={{
        background: loading
          ? "#adb5bd"
          : "linear-gradient(135deg, #ff4d5a 0%, #dc3545 100%)",
        color: "white",
        height: "55px",
        fontWeight: "bold",
        borderRadius: "0.75rem",
        transition: "all 0.3s ease",
      }}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          <span>กำลังเข้าสู่ระบบ...</span>
        </>
      ) : (
        <>
          <span className="me-2">Login</span>
          <span className="material-symbols-outlined fw-bold">arrow_forward</span>
        </>
      )}
    </button>
  );
}

/* ─── Satisfaction Buttons ─────────────────── */
const SATISFACTION_MAP: Record<string, string> = {
  sad:     "แย่",
  neutral: "ปานกลาง",
  happy:   "ดี",
};

const SENTIMENT_COLORS: Record<string, { color: string; hoverBg: string }> = {
  sad:     { color: "#dc3545", hoverBg: "#fff5f5" },
  neutral: { color: "#ffc107", hoverBg: "#fffdf0" },
  happy:   { color: "#10b981", hoverBg: "#f0fdf4" },
};

const SENTIMENT_ICONS: Record<string, string> = {
  sad:     "sentiment_dissatisfied",
  neutral: "sentiment_neutral",
  happy:   "sentiment_satisfied",
};



export function BtnSatisfaction() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [selected,     setSelected]     = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();

  const handleClick = async (e: React.MouseEvent, value: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    (e.currentTarget as HTMLElement).blur();
    setSelected(value);

    try {
      await fetch("/api/satisfactions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          satisfactionName: SATISFACTION_MAP[value],
          userId:           Number(session?.user?.id),
          branchId:         (session?.user?.branchIds as number[] | undefined)?.[0] ?? null,
        }),
      });
    } catch (err) {
      console.error("Failed to save:", err);
    }

    setTimeout(() => {
      setIsOpen(true);
      setSelected(null);
      setTimeout(() => {
        setIsOpen(false);
        setIsProcessing(false);
      }, 3500);
    }, 1500);
  };

  return (
    <>
      <div
        className="row g-3 g-md-4 g-lg-5 w-100 px-2 mb-5 justify-content-center"
        style={{ pointerEvents: isProcessing ? "none" : "auto" }}
      >
        {["sad", "neutral", "happy"].map((type) => (
          <div className="col-4" key={type}>
            <label className="sentiment-option w-100">
              <div
                className={`sentiment-card d-flex flex-column align-items-center justify-content-center gap-3 p-4 p-md-5 rounded-5 shadow-sm border ${selected === type ? "is-selected" : ""}`}
                onClick={(e) => handleClick(e, type)}
                style={{
                  "--sentiment-color":    SENTIMENT_COLORS[type].color,
                  "--sentiment-hover-bg": SENTIMENT_COLORS[type].hoverBg,
                } as React.CSSProperties}
              >
                <span
                  className="material-symbols-outlined icon-display"
                  style={{ fontSize: "4rem", pointerEvents: "none" }}
                >
                  {SENTIMENT_ICONS[type]}
                </span>
                <span
                  className="fw-bold sentiment-label"
                  style={{ fontSize: "1.1rem", pointerEvents: "none" }}
                >
                  {SATISFACTION_MAP[type]}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>

      <ThankPopup isOpen={isOpen} />
    </>
  );
}