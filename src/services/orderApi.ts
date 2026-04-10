import type { AxiosError } from "axios";
import { privateApi } from "./client";

const ORDERS_BASE = import.meta.env.VITE_API_ORDER_PATH ?? "/api/orders";

/** ตรงกับ backend OrderItemRequest — camelCase */
export type OrderItemRequest = {
  serviceName: string;
  quantity: number;
  pricePerUnit: number;
};

/** ตรงกับ backend CreateOrderRequest — camelCase */
export type CreateOrderPayload = {
  addressDetail: string;
  subDistrictId: number;
  latitude: number;
  longitude: number;
  /** ISO-8601 (เช่น +07:00 หรือ Z) — ไม่บังคับ ส่ง undefined เพื่อไม่ใส่ใน JSON */
  scheduledAt?: string | null;
  items: OrderItemRequest[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<string> {
  const body: Record<string, unknown> = {
    addressDetail: payload.addressDetail,
    subDistrictId: payload.subDistrictId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    items: payload.items,
  };
  if (payload.scheduledAt != null && payload.scheduledAt !== "") {
    body.scheduledAt = payload.scheduledAt;
  }
  const res = await privateApi.post<string>(ORDERS_BASE, body);
  return res.data;
}

export function getOrderErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "response" in err) {
    const ax = err as AxiosError<Record<string, unknown> | string>;
    const status = ax.response?.status;
    const data = ax.response?.data;

    if (typeof data === "string" && data.trim()) return data;

    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;

      if (typeof d.message === "string" && d.message.trim()) return d.message;
      if (typeof d.detail === "string" && d.detail.trim()) return d.detail;
      if (typeof d.error === "string" && d.error.trim()) {
        const path = typeof d.path === "string" ? d.path : "";
        const base = path ? `${d.error} (${path})` : d.error;
        if (status === 500) {
          return `${base} — เป็น error ฝั่งเซิร์ฟเวอร์ ให้ดู stack trace ใน console/terminal ที่รัน Spring`;
        }
        return base;
      }

      const errors = d.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        const first = errors[0] as { defaultMessage?: string; message?: string };
        return first.defaultMessage ?? first.message ?? JSON.stringify(errors[0]);
      }
      if (errors && typeof errors === "object" && !Array.isArray(errors)) {
        const map = errors as Record<string, string>;
        const parts = Object.entries(map).map(([k, v]) => `${k}: ${v}`);
        if (parts.length > 0) return parts.join("; ");
      }

      if (status === 500) {
        return `เซิร์ฟเวอร์ตอบ 500 — ตรวจ log ฝั่ง Spring (มักเป็น DB / null / business logic ไม่ใช่รูปแบบ JSON)`;
      }
    }

    if (ax.message) return ax.message;
  }
  if (err instanceof Error) return err.message;
  return "ไม่สามารถสร้างคำสั่งซื้อได้";
}
