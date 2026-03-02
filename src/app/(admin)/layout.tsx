import { AdminSidebar } from "../components/NavigationBar/SideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <AdminSidebar />
      <main
        className="flex-grow-1 bg-white border-start overflow-auto"
        style={{ minWidth: 0 }}
      >
        <div className="d-flex flex-column gap-4 p-4">
          {children}
        </div>
      </main>
    </div>
  );
}