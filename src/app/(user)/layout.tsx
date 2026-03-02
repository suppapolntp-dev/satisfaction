export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex min-vh-100 bg-light overflow-hidden">
      
      <main className="flex-grow-1 d-flex flex-column bg-white shadow-sm border vh-100">
        {/* children คือเนื้อหาจาก page.tsx ของแต่ละหน้าจะมาโผล่ตรงนี้ */}
        {children}
      </main>
    </div>
  );
}