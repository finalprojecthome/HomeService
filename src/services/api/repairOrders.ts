import type { OrderStatus } from "../../components/ServiceOrderCard.vue";
import type { RepairOrder, SpringPage } from "../../types/repairOrder";
import { privateApi } from "../client";

/** ขนาดหน้าเริ่มต้น (เมื่อเกินจำนวนนี้ต่อหน้า ให้ใช้ pagination) */
export const REPAIR_ORDERS_PAGE_SIZE_DEFAULT = 3;

/** เปลี่ยนเป็น false เมื่อ Spring Boot endpoint พร้อมใช้งาน */
const USE_MOCK_REPAIR_ORDERS_API = true;

export type FetchRepairOrdersParams = {
  /** ส่งซ้ำเป็น query ?status=a&status=b ให้ backend filter ฝั่งเซิร์ฟเวอร์ */
  statuses: OrderStatus[];
  page?: number;
  size?: number;
};

/**
 * Spring Boot แนะนำ: GET /api/repair-orders?status=pending&status=in-progress&page=0&size=3
 */
function buildRepairOrdersQuery(params: Required<FetchRepairOrdersParams>): string {
  const search = new URLSearchParams();
  for (const s of params.statuses) {
    search.append("status", s);
  }
  search.set("page", String(params.page));
  search.set("size", String(params.size));
  return search.toString();
}

/** seed เดียวกัน — ใช้ทั้ง mock และเป็นตัวอย่าง payload จาก backend */
export const REPAIR_ORDERS_SEED: RepairOrder[] = [
  {
    orderId: "RO-2026-0142",
    status: "pending",
    statusLabel: "รอดำเนินการ",
    date: "02/04/2569 เวลา 09.30 น.",
    staff: "สมาน ไมตรี",
    price: 1550,
    items: ["ล้างแอร์ 9,000-12,000 BTU, 1 ชุด", "เปลี่ยนใบกรองอากาศ"],
  },
  {
    orderId: "RO-2026-0160",
    status: "pending",
    statusLabel: "รอดำเนินการ",
    date: "03/04/2569 เวลา 08.00 น.",
    staff: "อรุณ แสงทอง",
    price: 2100,
    items: ["ตรวจระบบท่อน้ำทิ้งแอร์"],
  },
  {
    orderId: "RO-2026-0155",
    status: "in-progress",
    statusLabel: "กำลังดำเนินการ",
    date: "02/04/2569 เวลา 11.15 น.",
    staff: "ประเสริฐ ทองคำ",
    price: 890,
    items: ["ตรวจเช็กไฟฟ้าแผงควบคุม และรีเซ็ตเบรกเกอร์"],
  },
  {
    orderId: "RO-2026-0121",
    status: "pending",
    statusLabel: "รอดำเนินการ",
    date: "15/03/2569 เวลา 10.00 น.",
    staff: "นภา รุ่งเรือง",
    price: 4500,
    items: ["ติดตั้งแอร์ 18,000 BTU ติดผนัง", "เดินท่อน้ำทิ้ง 4 เมตร"],
  },
  {
    orderId: "RO-2026-0171",
    status: "in-progress",
    statusLabel: "กำลังดำเนินการ",
    date: "01/04/2569 เวลา 15.20 น.",
    staff: "ชัย มั่นคง",
    price: 1750,
    items: ["ซ่อมสวิตช์ไฟสะพานปลา 1 จุด"],
  },
  {
    orderId: "RO-2026-0138",
    status: "completed",
    statusLabel: "ดำเนินการเสร็จสิ้น",
    date: "28/03/2569 เวลา 14.00 น.",
    staff: "วิไล ศิริพงษ์",
    price: 3200,
    items: ["ซ่อมน้ำรั่วท่อประปา จุดเดียว"],
  },
  {
    orderId: "RO-2026-0104",
    status: "completed",
    statusLabel: "ดำเนินการเสร็จสิ้น",
    date: "10/02/2569 เวลา 11.00 น.",
    staff: "มาลี สุขใจ",
    price: 980,
    items: ["ล้างแอร์ 18,000 BTU"],
  },
  {
    orderId: "RO-2026-0099",
    status: "canceled",
    statusLabel: "ยกเลิก",
    date: "01/02/2569 เวลา 16.45 น.",
    staff: "ธนา ใจดี",
    price: 0,
    items: ["บริการล้างตู้เย็น (ลูกค้ายกเลิกนัด)"],
  },
  {
    orderId: "RO-2026-0088",
    status: "canceled",
    statusLabel: "ยกเลิก",
    date: "20/01/2569 เวลา 09.00 น.",
    staff: "แพรว พิรุณ",
    price: 0,
    items: ["นัดติดตั้งแอร์ (ยกเลิกก่อนนัด)"],
  },
];

function filterByStatuses(
  rows: RepairOrder[],
  statuses: OrderStatus[],
): RepairOrder[] {
  const allow = new Set(statuses);
  return rows.filter((r) => allow.has(r.status));
}

function slicePage<T>(rows: T[], page: number, size: number): SpringPage<T> {
  const totalElements = rows.length;
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
  const safePage =
    totalPages === 0 ? 0 : Math.min(Math.max(0, page), totalPages - 1);
  const start = safePage * size;
  const content = rows.slice(start, start + size);
  return {
    content,
    totalElements,
    totalPages,
    size,
    number: safePage,
    first: totalPages === 0 || safePage === 0,
    last: totalPages === 0 || safePage >= totalPages - 1,
  };
}

async function fetchRepairOrdersPageMock(
  params: FetchRepairOrdersParams,
): Promise<SpringPage<RepairOrder>> {
  const page = params.page ?? 0;
  const size = params.size ?? REPAIR_ORDERS_PAGE_SIZE_DEFAULT;
  const filtered = filterByStatuses(REPAIR_ORDERS_SEED, params.statuses);
  return slicePage(filtered, page, size);
}

async function fetchRepairOrdersPageRemote(
  params: FetchRepairOrdersParams,
): Promise<SpringPage<RepairOrder>> {
  const page = params.page ?? 0;
  const size = params.size ?? REPAIR_ORDERS_PAGE_SIZE_DEFAULT;
  const qs = buildRepairOrdersQuery({
    statuses: params.statuses,
    page,
    size,
  });
  const { data } = await privateApi.get<SpringPage<RepairOrder>>(
    `/api/repair-orders?${qs}`,
  );
  return data;
}

export async function fetchRepairOrdersPage(
  params: FetchRepairOrdersParams,
): Promise<SpringPage<RepairOrder>> {
  if (USE_MOCK_REPAIR_ORDERS_API) {
    return fetchRepairOrdersPageMock(params);
  }
  return fetchRepairOrdersPageRemote(params);
}

const repairOrdersApi = {
  getPage: fetchRepairOrdersPage,
};

export default repairOrdersApi;
