"use client";
import { BtnSatisfaction } from "@/app/components/UI/Button";

export default function CustomerPage() {
  return (
    <>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
        />
      </head>
      <main className="vh-100 overflow-hidden d-flex align-items-center justify-content-center p-lg-5 w-100">
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center h-100 pb-5">
          <div className="w-100 d-flex flex-column align-items-center text-center mb-5">
            <div
              className="mb-5"
              style={{
                userSelect:       "none",
                WebkitUserSelect: "none",
                pointerEvents:    "none",
              }}
            >
              <h1 className="fw-bold text-dark mb-3" style={{ fontSize: "2rem" }}>
                ท่านมีความพึงพอใจต่อการบริการในวันนี้อย่างไร?
              </h1>
              <p className="text-secondary fs-4 fw-semibold">
                โปรดประเมินความพึงพอใจจากตัวเลือกด้านล่าง
              </p>
            </div>
            <BtnSatisfaction />
          </div>
        </div>
      </main>
    </>
  );
}