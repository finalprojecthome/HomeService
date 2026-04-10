export type OrderStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "canceled";

/** Single line on an order (join table / embedded DTO from backend). */
export type OrderLineDto = {
  description?: string;
  serviceName?: string;
  name?: string;
  quantity?: number;
};

/**
 * Expected JSON from GET /api/orders/my-orders — align field names with your Spring entity
 * or adjust mapOrderSummaryToCardFields in utils/serviceOrderCardFromApi.ts.
 */
export type OrderSummaryResponse = {
  id: string;
  orderCode: string;
  status: string;
  scheduledAt: string;
  technicianName?: string | null;
  totalPrice: number;
  items?: string[] | OrderLineDto[];
  orderLines?: OrderLineDto[];
  imageUrl?: string | null;
};
