import type { OrderStatus } from "../components/ServiceOrderCard.vue";

/** รายการคำสั่งซ่อมในรูปแบบที่ใช้กับ UI (สอดคล้อง props ของ ServiceOrderCard) */
export interface RepairOrder {
  orderId: string;
  status: OrderStatus;
  statusLabel: string;
  date: string;
  staff: string;
  price: number;
  items: string[];
}

/** รูปแบบ Page<T> จาก Spring Data (ใช้เฉพาะฟิลด์ที่จำเป็นใน frontend) */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
