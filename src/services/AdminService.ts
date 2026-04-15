import { apiAdmin } from "./apiAdmin";

export type AdminSubServiceItem = {
  subServiceId: number;
  name: string;
  unit: string;
  pricePerUnit: number;
  updatedAt: string;
};

export type AdminServiceItem = {
  serviceId: number;
  categoryId: number;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  subServices: AdminSubServiceItem[];
};

export type AdminServicePageResponse = {
  items: AdminServiceItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetAdminServicesParams = {
  search?: string;
  categoryId?: number;
  page?: number;
};

export type AdminSubServicePayload = {
  subServiceId?: number;
  name: string;
  unit: string;
  pricePerUnit: number;
};

export type AdminServicePayload = {
  categoryId: number;
  name: string;
  imageUrl?: string | null;
  subServices: AdminSubServicePayload[];
};

export type AdminServiceScope = "all" | "filtered" | "page";

export type ReorderAdminServicesPayload = {
  scope: AdminServiceScope;
  serviceIds: number[];
  search?: string;
  categoryId?: number;
  page?: number;
};

export type AdminServiceDeleteImpact = {
  serviceId: number;
  requiresForceDelete: boolean;
};

export async function getAdminServices(params: GetAdminServicesParams = {}) {
  const { data } = await apiAdmin.get<AdminServicePageResponse>("/api/admin/services", {
    params: {
      search: params.search?.trim() || undefined,
      categoryId: params.categoryId ?? undefined,
      page: params.page ?? 0,
    },
  });

  return data;
}

export async function createAdminService(payload: AdminServicePayload) {
  const { data } = await apiAdmin.post<AdminServiceItem>(
    "/api/admin/services",
    payload,
  );

  return data;
}

export async function getAdminServiceById(serviceId: number) {
  const { data } = await apiAdmin.get<AdminServiceItem>(
    `/api/admin/services/${serviceId}`,
  );

  return data;
}

export async function getAdminServiceDeleteImpact(serviceId: number) {
  const { data } = await apiAdmin.get<AdminServiceDeleteImpact>(
    `/api/admin/services/${serviceId}/delete-impact`,
  );

  return data;
}

export async function updateAdminService(
  serviceId: number,
  payload: AdminServicePayload,
) {
  const { data } = await apiAdmin.put<AdminServiceItem>(
    `/api/admin/services/${serviceId}`,
    payload,
  );

  return data;
}

export async function deleteAdminService(serviceId: number, force = false) {
  await apiAdmin.delete(`/api/admin/services/${serviceId}`, {
    params: {
      force: force || undefined,
    },
  });
}

export async function reorderAdminServices(
  payload: ReorderAdminServicesPayload,
) {
  await apiAdmin.put("/api/admin/services/reorder", payload);
}

export async function uploadServiceImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiAdmin.post<{ imageUrl: string }>(
    "/api/admin/services/upload-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data.imageUrl;
}
