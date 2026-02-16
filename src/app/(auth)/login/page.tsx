"use client";

import Tipbox from "@/app/components/tipbox";
import { NavbarLogin } from "@/app/components/navbar";
import { Btnlogin } from "@/app/components/buttom";

const massageTipbox: string = "กรุณาติดต่อแผนก IT เพื่อขอความช่วยเหลือ 10000";

export default function LoginPage() {
  return (
    <>
      <header>
        <NavbarLogin></NavbarLogin>
      </header>
      <main className="container d-flex align-items-center justify-content-center min-vh-100 p-4 bg-light">
        {/* บีบขนาดให้ Compact ลงที่ 380px จะดูแพงที่สุดสำหรับหน้า Login */}
        <div className="w-100" style={{ maxWidth: "380px" }}>
          <div
            className="card border-0 p-4 p-md-5 bg-white"
            style={{
              borderRadius: "2.5rem", // โค้งมนพิเศษแบบแอปสมัยใหม่
              position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.06)", // Shadow ที่นุ่มและกว้างขึ้น
            }}
          >
            {/* เส้นประดับด้านบน: ใช้สีแดงไล่เฉดที่คุณชอบ */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "4px",
                background: "linear-gradient(90deg, #ff4d5a, #dc3545)",
                borderRadius: "0 0 10px 10px",
              }}
            />

            <div className="text-center mb-4 mt-2">
              <h2
                className="fw-bolder mb-1"
                style={{ color: "#1a202c", letterSpacing: "-0.03em" }}
              >
                เข้าสู่ระบบสาขา
              </h2>
              <p className="text-muted small">
                กรุณาระบุตัวตนเพื่อเข้าใช้งานระบบ
              </p>
            </div>

            <form>
              <div className="mb-3">
                <label
                  className="form-label small fw-bold text-secondary ms-1"
                  style={{ letterSpacing: "0.05em" }}
                >
                  รหัสสาขา (ID)
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control border-0 bg-light py-3 ps-5 rounded-4"
                    placeholder="ระบุรหัสสาขาของคุณ"
                    style={{ fontSize: "0.95rem", transition: "all 0.3s" }}
                  />
                  <span
                    className="material-symbols-outlined position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary opacity-50"
                    style={{ fontSize: "1.25rem" }}
                  >
                    badge
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="form-label small fw-bold text-secondary ms-1"
                  style={{ letterSpacing: "0.05em" }}
                >
                  รหัสผ่าน
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control border-0 bg-light py-3 ps-5 pe-5 rounded-4"
                    placeholder="••••••••"
                    style={{ fontSize: "0.95rem" }}
                  />
                  <span
                    className="material-symbols-outlined position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary opacity-50"
                    style={{ fontSize: "1.25rem" }}
                  >
                    lock
                  </span>
                  <span
                    className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-secondary"
                    style={{
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      opacity: 0.7,
                    }}
                  >
                    visibility_off
                  </span>
                </div>
              </div>

              {/* ปุ่ม Login: ผมแนะนำให้ใส่ Class ใน Btnlogin ให้กว้าง 100% และมีเงาสีแดงจางๆ */}
              <Btnlogin />
            </form>

            {/* Tipbox ส่วนท้าย: ปรับให้ดูเป็นส่วนแนะนำที่แยกออกมาชัดเจน */}
            <div className="mt-4 pt-3 border-top border-light-subtle">
              <div className="d-flex align-items-start gap-2">
                <Tipbox message={massageTipbox} />
              </div>
            </div>
          </div>

          {/* Footer นอกกล่อง: สำหรับพวก Credit หรือ Version */}
          <div className="text-center mt-4">
            <small className="text-muted opacity-50">
              © 2026 Satisfaction POS System
            </small>
          </div>
        </div>
      </main>
    </>
  );
}
