import { format, isValid, parseISO } from "date-fns";
import type {
  OrderLineDto,
  OrderStatus,
  OrderSummaryResponse,
} from "../types/order";

export type ServiceOrderCardFields = {
  imageSrc?: string;
  orderId: string;
  status: OrderStatus;
  statusLabel: string;
  date: string;
  staff: string;
  price: number;
  items: string[];
};

const TH_TIME = "\u0e40\u0e27\u0e25\u0e32";
const TH_PENDING =
  "\u0e23\u0e2d\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23";
const TH_COMPLETED =
  "\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e2a\u0e34\u0e49\u0e19";
const TH_IN_PROGRESS =
  "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e01\u0e32\u0e23";
const TH_CANCELED = "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01";

/** Same pattern as mock: dd/MM/YY + time word + HH.mm น. (short Buddhist year). */
export function formatServiceOrderDateThai(iso: string): string {
  const d = parseISO(iso);
  if (!isValid(d)) {
    return iso;
  }
  const day = format(d, "d");
  const month = format(d, "MM");
  const beYearShort = String(d.getFullYear() + 543).slice(-2);
  const clock = `${format(d, "HH.mm")} \u0e19.`;
  return `${day}/${month}/${beYearShort} ${TH_TIME} ${clock}`;
}

function normalizeStatus(raw: string): { status: OrderStatus; label: string } {
  const key = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
  switch (key) {
    case "COMPLETED":
    case "DONE":
      return { status: "completed", label: TH_COMPLETED };
    case "IN_PROGRESS":
    case "INPROGRESS":
    case "PROCESSING":
      return { status: "in-progress", label: TH_IN_PROGRESS };
    case "CANCELED":
    case "CANCELLED":
      return { status: "canceled", label: TH_CANCELED };
    case "PENDING":
    default:
      return { status: "pending", label: TH_PENDING };
  }
}

function lineToText(line: OrderLineDto): string {
  const base = line.description ?? line.serviceName ?? line.name ?? "";
  if (line.quantity != null && line.quantity > 1) {
    return `${base} (${line.quantity})`.trim();
  }
  return base;
}

function extractItems(order: OrderSummaryResponse): string[] {
  const fromLines = order.orderLines?.map(lineToText).filter(Boolean) ?? [];
  if (fromLines.length) {
    return fromLines;
  }
  const items = order.items;
  if (!items?.length) {
    return [];
  }
  if (typeof items[0] === "string") {
    return items as string[];
  }
  return (items as OrderLineDto[]).map(lineToText).filter(Boolean);
}

export function mapOrderSummaryToCardFields(
  order: OrderSummaryResponse,
): ServiceOrderCardFields {
  const { status, label } = normalizeStatus(order.status);
  const items = extractItems(order);
  return {
    imageSrc: order.imageUrl ?? undefined,
    orderId: order.orderCode || String(order.id),
    status,
    statusLabel: label,
    date: formatServiceOrderDateThai(order.scheduledAt),
    staff: order.technicianName?.trim() || "—",
    price: Number(order.totalPrice) || 0,
    items: items.length ? items : ["—"],
  };
}
