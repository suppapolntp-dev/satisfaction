export function NavbarLogin() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-2">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-end ms-auto gap-3 ">
              {/* รูปหน้ายิ้ม (ใช้ Icon แทน Image เพื่อความคมชัดและเบา) */}
              <div className=" lh-1 d-none d-sm-block text-end">
                <div
                  className="fw-bold text-dark"
                  style={{ fontSize: "1rem", letterSpacing: "-0.02em" }}
                >
                  Satisfaction <span style={{ color: "#dc3545" }}>POS</span>
                </div>
                <small
                  className="text-muted"
                  style={{ fontSize: "0.5rem", textTransform: "uppercase" }}
                >
                  Service Mind System
                </small>
              </div>
              <div
              className="bg-success text-white d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #ff4d5a 0%, #dc3545 100%)",
              }}
            >
              <i
                className="bi bi-emoji-smile"
                style={{ fontSize: "1.5rem" }}
              ></i>
            </div>
              
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export function NavbarMain() {
  return (
    <>
    <header>

    
    </header>
      <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-2">
        <div className="container-fluid">
          {/* ใช้ ms-auto เพื่อดัน Dropdown ไปทางขวาสุด */}
          <div className="dropdown ms-auto">
            <button
              className="btn d-flex align-items-center gap-2 border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="text-end lh-1 d-none d-sm-block">
                <div
                  className="fw-bold text-dark"
                  style={{ fontSize: "0.9rem" }}
                >
                  CRG
                </div>
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Administrator
                </small>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=CRG&background=dc3545&color=ffffff&length=3"
                className="rounded-circle border"
                width="35"
                alt="Profile"
              />
            </button>

            {/* เมนูที่แสดงเมื่อคลิก */}
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li>
                <h6 className="dropdown-header">Profile Menu</h6>
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center gap-2"
                  href="#"
                >
                  <span className="material-symbols-outlined fs-6">person</span>{" "}
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item text-danger d-flex align-items-center gap-2"
                  href="#"
                >
                  <span className="material-symbols-outlined fs-6">logout</span>{" "}
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
