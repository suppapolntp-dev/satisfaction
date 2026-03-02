export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="d-flex align-items-center justify-content-between px-4 py-4 bg-white border-bottom">
    <div className="d-flex flex-column gap-1">
      <h2 className="mb-0 fw-bold" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      <p className="mb-0 text-muted" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
        {subtitle}
      </p>
    </div>
  </header>
);