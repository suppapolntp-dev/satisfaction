src/

├── app/

│   ├── (admin)/        หน้า admin ทั้งหมด (dashboard, manager ต่างๆ)

│   ├── (auth)/login    หน้า Login

│   ├── (user)/         หน้า iPad satisfaction

│   ├── api/            API ทุกตัวอยู่ที่นี่

│   └── components/     UI ที่ใช้ซ้ำ (sidebar, modal, กราฟ)

│
├── auth.ts             ระบบ Login, JWT, เก็บ permission ลง session

├── middleware.ts       ดักทุก request เช็ค login และสิทธิ์ก่อนเข้าหน้า

├── proxy.ts            กำหนดว่า route ไหน ต้องใช้ permission อะไร

├── db/

│   ├── schema.ts       โครงสร้างทุก Table (Brand, Branch, Role, Account...)

│   └── index.ts        เชื่อมต่อ Database

├── hooks/

│   └── useCrudManager.ts   Logic เพิ่ม/แก้/ลบ กลาง ที่ทุกหน้า Manager ใช้ร่วมกัน

└── types/

    └── models.ts       Type ทั้งหมด เช่น Brand, Branch, ApiResponse, Permission
    

ต้องการ แก้ไปที่
API ดึงข้อมูล / บันทึกข้อมูล			src/app/api/[ชื่อ]/route.ts

หน้า Dashboard / Filter 			src/app/(admin)/dashboard/page.tsx

หน้า Login			src/app/(auth)/login/page.tsx

หน้ากด Satisfaction (iPad)	src/app/(user)/satisfaction/page.tsx

ระบบ Login / สิทธิ์ใน JWT 			src/auth.ts

กันคนเข้าหน้าที่ไม่มีสิทธิ์				src/middleware.ts

โครงสร้าง Database			src/db/schema.ts

Sidebar / เมนู					src/app/components/Sidebar/AdminSidebar.tsxModal / 

Popup				src/app/components/UI/AdminModal.tsx

กราฟสถิติ							src/app/components/Statistic/chart.tsx



🛠️ Tech Stack

Frontend

Next.js 16 — Framework หลัก (App Router)

React 19 — UI Library

TypeScript — ภาษาหลัก (คุม Type เข้มงวด)

Bootstrap 5 — จัด Layout / Style

Bootstrap Icons — ไอคอน (bi-*)

Recharts — กราฟสถิติใน Dashboard

Framer Motion — Animation


Backend / Database

Drizzle ORM — จัดการ Database ด้วย TypeScript

MySQL — ฐานข้อมูลหลัก

Docker — รัน MySQL ผ่าน Container

Auth / Security

NextAuth.js v5 — ระบบ Login, Session, JWT

bcrypt — เข้ารหัส Password

Zod — Validate ข้อมูลก่อนบันทึก DB

Middleware — Route Guard เช็คสิทธิ์


Dev Tools

Drizzle Studio — GUI ดูข้อมูลใน DB (npm run db:studio)

Drizzle Kit — Generate / Migrate schema
