export type ServiceApiItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  imageSrc: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

const mockServiceItems: ServiceApiItem[] = [
  {
    id: "svc-001",
    title: "ล้างแอร์",
    category: "บริการทั่วไป",
    price: "500.00 - 10,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "svc-002",
    title: "ติดตั้งแอร์",
    category: "บริการทั่วไป",
    price: "2,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "svc-003",
    title: "ซ่อมเครื่องซักผ้า",
    category: "บริการทั่วไป",
    price: "500.00",
    imageSrc:
      "https://images.unsplash.com/photo-1626806787461-102c1a7f9f79?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "svc-004",
    title: "ติดตั้งเตาแก๊ส",
    category: "บริการติดตั้ง",
    price: "1,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "svc-005",
    title: "ติดตั้งเครื่องทำน้ำอุ่น",
    category: "บริการติดตั้ง",
    price: "500.00",
    imageSrc:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
  },
];

export async function fetchServices(): Promise<ServiceApiItem[]> {
  if (USE_MOCK_API) {
    return Promise.resolve(mockServiceItems);
  }

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
