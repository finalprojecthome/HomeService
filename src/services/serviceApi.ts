import { privateApi } from "./client";

export type ServiceApiItem = {
  id: string;
  title: string;
  category: string;
  price: string;

  imageSrc: string;
};
export type SubServiceApiItem = {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
};

/** รองรับทั้ง array ตรงๆ และ body แบบ Spring Page / wrapper */
function unwrapSubServiceList(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    for (const key of ["content", "data", "items", "results"] as const) {
      const v = o[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function normalizeSubServiceItem(raw: Record<string, unknown>): SubServiceApiItem {
  const id = Number(raw.id);
  const priceRaw =
    raw.pricePerUnit ?? raw.price_per_unit ?? raw.price ?? 0;
  return {
    id: Number.isFinite(id) ? id : 0,
    name: String(raw.name ?? ""),
    unit: String(raw.unit ?? raw.unit_label ?? ""),
    pricePerUnit: typeof priceRaw === "number" ? priceRaw : Number(priceRaw) || 0,
  };
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";


/* ===================== API FUNCTIONS ===================== */

/**
 * Fetch Services
 */
export async function fetchServices(): Promise<ServiceApiItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`);
  }

  return (await response.json()) as ServiceApiItem[];
}

export async function fetchSubServices(
  serviceId: string | number
): Promise<SubServiceApiItem[]> {
  try {
    const res = await privateApi.get<unknown>(
      `/api/services/${serviceId}/sub-services`
    );
    const list = unwrapSubServiceList(res.data);
    return list.map((item) =>
      normalizeSubServiceItem(
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {}
      )
    );
  } catch (error) {
    console.error("fetchSubServices error:", error);
    throw error;
  }
}