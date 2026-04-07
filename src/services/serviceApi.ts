
import { publicApi } from "./client";


export type ServiceApiItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  /** ว่างเมื่อไม่มีรูป — ให้การ์ดแสดง skeleton */
  imageSrc: string;
};
export type SubServiceApiItem = {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
};


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
    const res = await publicApi.get<SubServiceApiItem[]>(
      `/api/services/${serviceId}/sub-services`
    );
    return res.data;
  } catch (error) {
    console.error("fetchSubServices error:", error);
    throw error;
  }
}