// แก้ชื่อฟังก์ชันเป็นตัวพิมพ์ใหญ่ (Tipbox) ตามมาตรฐาน React Component นะครับ
export default function Tipbox({ message }: { message: string }) {
  return (
    <>
      <style>
        {`.info-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            cursor: help;
            margin-left: 4px;
            vertical-align: middle;}
          .tooltip-box {
            visibility: hidden;
            width: 220px;
            background-color: #333;
            color: #fff;
            padding: 8px 12px;
            position: absolute;
            z-index: 100;
            bottom: 150%; /* ให้ลอยขึ้นด้านบน */
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            font-size: 0.75rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            pointer-events: none;
          }
        
          /* ทำหัวลูกศรชี้ลง */
          .tooltip-box::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
          }
        
          .info-wrapper:hover .tooltip-box {
            visibility: visible;
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
          }
        `}
      </style>
      <div className="mt-4 text-center">
        <div className="border-top pt-4">
          <p className="small text-muted mb-0 d-flex align-items-center justify-content-center">
            ถ้าหากลืมรหัสผ่านโปรดติดต่อผู้ดูแลระบบ
            <span className="info-wrapper">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "18px",
                  color: "#dc3545",
                  cursor: "pointer",
                }}
              >
                info
              </span>
              {/* ใช้ค่าจาก message ที่ส่งเข้ามา */}
              <span className="tooltip-box">
                {message || "กรุณาติดต่อแผนก IT เพื่อขอความช่วยเหลือ"}
              </span>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
