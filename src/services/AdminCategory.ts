import { apiAdmin } from "./apiAdmin";

export type AdminCategoryScope = "all" | "filtered" | "page";

export type AdminCategoryItem = {
  categoryId: number;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCategoryPageResponse = {
  items: AdminCategoryItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetAdminCategoriesParams = {
  search?: string;
  page?: number;
};

export type AdminCategoryPayload = {
  name: string;
};

export type ReorderAdminCategoriesPayload = {
  scope: AdminCategoryScope;
  categoryIds: number[];
  search?: string;
  page?: number;
};

export async function getAdminCategories(params: GetAdminCategoriesParams = {}) {
  const { data } = await apiAdmin.get<AdminCategoryPageResponse>(
    "/api/admin/categories",
    {
      params: {
        search: params.search?.trim() || undefined,
        page: params.page ?? 0,
      },
    },
  );
  return data;
}

export async function createAdminCategory(payload: AdminCategoryPayload) {
  const { data } = await apiAdmin.post<AdminCategoryItem>(
    "/api/admin/categories",
    payload,
  );
  return data;
}

export async function getAdminCategoryById(categoryId: number) {
  const { data } = await apiAdmin.get<AdminCategoryItem>(
    `/api/admin/categories/${categoryId}`,
  );
  return data;
}

export async function updateAdminCategory(
  categoryId: number,
  payload: AdminCategoryPayload,
) {
  const { data } = await apiAdmin.put<AdminCategoryItem>(
    `/api/admin/categories/${categoryId}`,
    payload,
  );
  return data;
}

export async function deleteAdminCategory(categoryId: number, force = false) {
  await apiAdmin.delete(`/api/admin/categories/${categoryId}`, {
    params: {
      force: force || undefined,
    },
  });
}

export async function reorderAdminCategories(
  payload: ReorderAdminCategoriesPayload,
) {
  await apiAdmin.put("/api/admin/categories/reorder", payload);
}
