// src/app/components/UI/RowActions.tsx
import React from "react";

// ── โหมดปกติ: ปุ่ม Edit + Delete ──
interface ViewActionsProps {
  mode:      "view";
  onEdit:    () => void;
  onDelete:  () => void;
}

// ── โหมด editing: ปุ่ม Save + Cancel ──
interface EditActionsProps {
  mode:      "edit";
  onSave:    () => void;
  onCancel:  () => void;
  saving?:   boolean;
}

type RowActionsProps = ViewActionsProps | EditActionsProps;

export function RowActions(props: RowActionsProps) {
  return (
    <div className="d-flex gap-2 justify-content-center">
      {props.mode === "edit" ? (
        <>
          <button onClick={props.onSave} disabled={props.saving}
            className="btn btn-sm btn-success rounded-3">
            <i className="bi bi-check-lg" />
          </button>
          <button onClick={props.onCancel}
            className="btn btn-sm btn-light rounded-3">
            <i className="bi bi-x-lg" />
          </button>
        </>
      ) : (
        <>
          <button onClick={props.onEdit}
            className="btn btn-sm btn-outline-info rounded-3">
            <i className="bi bi-pencil" />
          </button>
          <button onClick={props.onDelete}
            className="btn btn-sm btn-outline-danger rounded-3">
            <i className="bi bi-trash" />
          </button>
        </>
      )}
    </div>
  );
}