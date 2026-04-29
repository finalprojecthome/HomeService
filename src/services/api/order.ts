import type { OrderSummaryResponse } from "../../types/order";
import { privateApi } from "../client";

const ORDER_BASE_URL = "/api/orders/my-orders";

function unwrapOrderList(payload: unknown): OrderSummaryResponse[] {
  if (Array.isArray(payload)) {
    return payload as OrderSummaryResponse[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "content" in payload &&
    Array.isArray((payload as { content: unknown }).content)
  ) {
    return (payload as { content: OrderSummaryResponse[] }).content;
  }
  return [];
}

/** Same values as backend `CustomerOrderListScope` (GET `scope` query param). */
export type ListMyOrdersScope = "ACTIVE" | "COMPLETED";

export type ListMyOrdersOptions = {
  scope?: ListMyOrdersScope;
};

const orderApi = {
  listMine: async (
    options?: ListMyOrdersOptions,
  ): Promise<OrderSummaryResponse[]> => {
    const { data } = await privateApi.get<unknown>(ORDER_BASE_URL, {
      params: {
        ...(options?.scope ? { scope: options.scope } : {}),
      },
    });
    return unwrapOrderList(data);
  },
};

export default orderApi;
