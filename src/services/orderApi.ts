import { privateApi } from "./client";

export async function createOrder(payload: CreateOrderPayload) {
    const res = await privateApi.post("/orders", payload);
    return res.data as string; // orderId
  }

export type CreateOrderPayload = {
  addressDetail: string;
  subDistrictId: number;
  scheduledAt: string;
  items: {
    serviceName: string;
    quantity: number;
    pricePerUnit: number;
  }[];
};