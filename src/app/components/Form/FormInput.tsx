interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
}

export const InputField = ({ label, type = "text", placeholder }: InputProps) => (
  <div className="col-md-4">
    <label className="form-label fw-bold text-muted mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.02em" }}>
      {label.toUpperCase()}
    </label>
    <input 
      type={type} 
      className="form-control border-0 bg-light px-3 py-2 rounded-3 w-100" 
      placeholder={placeholder}
      style={{ fontSize: "0.875rem shadow-none" }} 
    />
  </div>
);

export const SelectField = ({
  label,
  children,
  onChange,
}: {
  label: string;
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
}) => (
  <div className="col-md-4">
    <label className="form-label fw-bold text-muted mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.02em" }}>
      {label.toUpperCase()}
    </label>
    <select
      className="form-select border-0 bg-light px-3 py-2 rounded-3 w-100"
      style={{ fontSize: "0.875rem" }}
      onChange={onChange} 
    >
      {children}
    </select>
  </div>
);