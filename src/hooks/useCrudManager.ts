// src/hooks/useCrudManager.ts
// ═══════════════════════════════════════════════
// Generic CRUD Hook — ใช้ได้กับทุกหน้า management
// แยก useState + fetch logic ออกจาก page ให้สะอาด
// ═══════════════════════════════════════════════
"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types/models";

// ─── Config ──────────────────────────────────
interface CrudConfig<T> {
  /** API endpoint หลัก เช่น "/api/brands" */
  endpoint: string;
  /** ชื่อ field ที่เป็น primary key เช่น "brandId" */
  idKey: keyof T & string;
  /** endpoints เพิ่มเติมที่ต้อง fetch พร้อมกัน (optional) */
  relatedEndpoints?: { key: string; endpoint: string }[];
}

// ─── Return Type ─────────────────────────────
interface CrudManager<T> {
  // ── Data ──
  items:       T[];
  loading:     boolean;
  related:     Record<string, unknown[]>;

  // ── Fetch ──
  fetchAll:    () => Promise<void>;

  // ── Create ──
  creating:    boolean;
  handleCreate: (data: Partial<T>, onSuccess?: () => void) => Promise<boolean>;

  // ── Edit ──
  editingItem: T | null;
  saving:      boolean;
  setEditingItem: (item: T | null) => void;
  handleSave:    (data: Partial<T>, onSuccess?: () => void) => Promise<boolean>;

  // ── Delete ──
  confirmOpen:     boolean;
  pendingDeleteId: number | null;
  openDeleteConfirm:  (id: number) => void;
  closeDeleteConfirm: () => void;
  handleDeleteConfirm: (onSuccess?: () => void) => Promise<void>;
}

// ─── Hook ────────────────────────────────────
export function useCrudManager<T extends Record<string, unknown>>(
  config: CrudConfig<T>
): CrudManager<T> {
  const { endpoint, idKey, relatedEndpoints = [] } = config;

  // ── State: Data ──
  const [items,   setItems]   = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Record<string, unknown[]>>({});

  // ── State: Create ──
  const [creating, setCreating] = useState(false);

  // ── State: Edit ──
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [saving,      setSaving]      = useState(false);

  // ── State: Delete ──
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // ── Fetch All ──────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const promises = [
        fetch(endpoint).then((r) => r.json()),
        ...relatedEndpoints.map((re) =>
          fetch(re.endpoint).then((r) => r.json())
        ),
      ];
      const results = await Promise.all(promises);

      // main data
      const mainRes = results[0] as ApiResponse<T[]>;
      if (mainRes.success && mainRes.data) setItems(mainRes.data);

      // related data
      const relData: Record<string, unknown[]> = {};
      relatedEndpoints.forEach((re, i) => {
        const res = results[i + 1] as ApiResponse<unknown[]>;
        if (res.success && res.data) relData[re.key] = res.data;
      });
      if (relatedEndpoints.length > 0) setRelated(relData);
    } catch (err) {
      console.error(`[useCrudManager] fetchAll error:`, err);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Create ─────────────────────────────────
  const handleCreate = async (
    data: Partial<T>,
    onSuccess?: () => void
  ): Promise<boolean> => {
    setCreating(true);
    try {
      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse;
      if (json.success) {
        await fetchAll();
        onSuccess?.();
        setCreating(false);
        return true;
      } else {
        alert(json.error ?? "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error(`[useCrudManager] create error:`, err);
      alert("เกิดข้อผิดพลาดในการสร้างข้อมูล");
    }
    setCreating(false);
    return false;
  };

  // ── Save (Update) ─────────────────────────
  const handleSave = async (
    data: Partial<T>,
    onSuccess?: () => void
  ): Promise<boolean> => {
    setSaving(true);
    try {
      const res  = await fetch(endpoint, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = (await res.json()) as ApiResponse;
      if (json.success) {
        setEditingItem(null);
        await fetchAll();
        onSuccess?.();
        setSaving(false);
        return true;
      } else {
        alert(json.error ?? "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      console.error(`[useCrudManager] save error:`, err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
    setSaving(false);
    return false;
  };

  // ── Delete ─────────────────────────────────
  const openDeleteConfirm = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleDeleteConfirm = async (onSuccess?: () => void) => {
    if (pendingDeleteId === null) return;
    setConfirmOpen(false);
    try {
      await fetch(`${endpoint}?id=${pendingDeleteId}`, { method: "DELETE" });
      await fetchAll();
      onSuccess?.();
    } catch (err) {
      console.error(`[useCrudManager] delete error:`, err);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
    setPendingDeleteId(null);
  };

  return {
    items,
    loading,
    related,
    fetchAll,
    creating,
    handleCreate,
    editingItem,
    saving,
    setEditingItem,
    handleSave,
    confirmOpen,
    pendingDeleteId,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteConfirm,
  };
}