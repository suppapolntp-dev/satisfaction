// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginTipbox } from "@/app/components/Form/Tipbox";
import { NavbarLogin } from "@/app/components/NavigationBar/Navbar";
import { Btnlogin } from "@/app/components/UI/Button";

const massageTipbox = "กรุณาติดต่อแผนก IT เพื่อขอความช่วยเหลือ 10000";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"username" | "password" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setErrorField("");

    if (!username.trim()) { setError("กรุณากรอกรหัสสาขา"); setErrorField("username"); return; }
    if (!password.trim()) { setError("กรุณากรอกรหัสผ่าน"); setErrorField("password"); return; }

    setLoading(true);
    try {
      const chk = await fetch("/api/accounts/check", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username }),
      }).then((r) => r.json());
      if (!chk.exists) {
        setError("ไม่พบรหัสสาขานี้ในระบบ"); setErrorField("username"); setLoading(false); return;
      }
    } catch { /* fallthrough */ }

    const res = await signIn("credentials", { username, password, redirect: false });
    if (res?.error) { setError("รหัสผ่านไม่ถูกต้อง"); setErrorField("password"); }
    else { router.push("/dashboard"); }
    setLoading(false);
  };

  const clearError = () => { setError(""); setErrorField(""); };

  return (
    <>
      <header><NavbarLogin /></header>
      <main className="container d-flex align-items-center justify-content-center min-vh-100 p-4 bg-light">
        <div className="w-100" style={{ maxWidth: "420px" }}>
          <div className="card border-0 p-4 p-md-5 bg-white position-relative"
            style={{ borderRadius: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "4px",
              background: "linear-gradient(90deg, #ff4d5a, #dc3545)", borderRadius: "0 0 10px 10px" }} />
            <div className="text-center mb-4 mt-2">
              <h2 className="fw-bolder mb-1" style={{ color: "#1a202c", letterSpacing: "-0.03em" }}>เข้าสู่ระบบสาขา</h2>
              <p className="text-muted small">กรุณาระบุตัวตนเพื่อเข้าใช้งานระบบ</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-4 py-2 px-3 mb-3 d-flex align-items-center gap-2"
                  style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", fontSize: "0.8rem" }}>
                  <span className="material-symbols-outlined text-danger" style={{ fontSize: "1.1rem" }}>
                    {errorField === "username" ? "person_off" : "lock_open"}
                  </span>
                  <span className="text-danger fw-semibold">{error}</span>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary ms-1" style={{ letterSpacing: "0.05em" }}>รหัสสาขา (ID)</label>
                <div className="position-relative">
                  <input type="text"
                    className={`form-control border-0 bg-light py-3 ps-5 rounded-4 ${errorField === "username" ? "border border-danger border-2" : ""}`}
                    placeholder="ระบุรหัสสาขาของคุณ" value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError(); }} disabled={loading} style={{ fontSize: "0.95rem" }} />
                  <span className={`material-symbols-outlined position-absolute start-0 top-50 translate-middle-y ms-3 ${errorField === "username" ? "text-danger" : "text-secondary opacity-50"}`}
                    style={{ fontSize: "1.25rem" }}>badge</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary ms-1" style={{ letterSpacing: "0.05em" }}>รหัสผ่าน</label>
                <div className="position-relative">
                  <input type={showPassword ? "text" : "password"}
                    className={`form-control border-0 bg-light py-3 ps-5 pe-5 rounded-4 ${errorField === "password" ? "border border-danger border-2" : ""}`}
                    placeholder="••••••••" value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }} disabled={loading} style={{ fontSize: "0.95rem" }} />
                  <span className={`material-symbols-outlined position-absolute start-0 top-50 translate-middle-y ms-3 ${errorField === "password" ? "text-danger" : "text-secondary opacity-50"}`}
                    style={{ fontSize: "1.25rem" }}>lock</span>
                  <span className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"
                    style={{ cursor: "pointer", fontSize: "1.2rem", opacity: 0.7 }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </div>
              </div>

              <Btnlogin loading={loading} />
            </form>

            <div className="mt-4 pt-1"><LoginTipbox message={massageTipbox} /></div>
          </div>
          <div className="text-center mt-4"><small className="text-muted opacity-50">© 2026 Satisfaction POS System</small></div>
        </div>
      </main>
    </>
  );
}