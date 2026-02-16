"use client";
import { NavbarMain } from "@/app/components/navbar";
import { BtnSatisfaction, BtnSubmit } from "@/app/components/buttom";

export default function CustomerPage() {
  return (
    <>
      <header>
        {/* <NavbarMain /> */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=optional"
        />
      </header>
      <main>
        <main className="vh-100 overflow-hidden mt-5 d-flex align-items-center justify-content-center p-lg-5 w-100">
          <div className="container-fluid max-width-6xl d-flex flex-column align-items-center justify-content-center h-100 pb-5">
            <div className="w-100 d-flex flex-column align-items-center text-center mb-5">
              <div
                className="mb-5"
                style={{
                  userSelect: "none", // ห้ามคลุมดำ
                  WebkitUserSelect: "none", // สำหรับ Safari
                  pointerEvents: "none", // ห้ามลาก ห้ามคลิกตัวมันเอง (ให้ทะลุไปโดนปุ่ม/div แทน)
                }}
              >
                <h6
                  className="display-3 fw-black text-dark dark-text-white mb-3 fw-bold"
                  style={{ fontSize: 2.0 + "rem" }}
                >
                  ท่านมีความพึงพอใจต่อการบริการในวันนี้อย่างไร?
                </h6>
                <p className="text-secondary fs-4 fw-semibold">
                  โปรดประเมินความพึงพอใจจากตัวเลือกด้านล่าง
                </p>
              </div>
              <BtnSatisfaction></BtnSatisfaction>
              {/* <BtnSubmit></BtnSubmit> */}
            </div>
          </div>
        </main>
      </main>
    </>
  );
}
