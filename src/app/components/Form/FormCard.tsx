// src/app/components/UI/FormCard.tsx
// ── กล่องห่อ Create Form ทุกหน้า ──
import React from "react";
import { SectionHeader } from "../UI/SectionHeader";
import { SaveButton }    from "./SaveButton";

interface FormCardProps {
  icon:      string;
  title:     string;
  subtitle:  string;
  onSave:    () => void;
  saving:    boolean;
  saveLabel?: string;
  children:  React.ReactNode;
}

export function FormCard({ icon, title, subtitle, onSave, saving, saveLabel, children }: FormCardProps) {
  return (
    <div className="bg-white rounded-4 p-4 border shadow-sm">
      <SectionHeader icon={icon} title={title} subtitle={subtitle} />
      {children}
      <div className="mt-4 pt-2 border-top d-flex justify-content-end">
        <SaveButton onClick={onSave} loading={saving} label={saveLabel} />
      </div>
    </div>
  );
}