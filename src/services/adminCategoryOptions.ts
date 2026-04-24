import {
  getAdminCategoriesAll,
  type AdminCategoryItem,
} from "./AdminCategory";

export type AdminCategoryOption = {
  label: string;
  value: number;
};

const CATEGORY_CACHE_TTL_MS = 30_000;

let cachedCategories: AdminCategoryItem[] | null = null;
let cachedAt = 0;
let pendingCategoriesRequest: Promise<AdminCategoryItem[]> | null = null;

export async function getAllAdminCategories() {
  const now = Date.now();
  if (cachedCategories && now - cachedAt < CATEGORY_CACHE_TTL_MS) {
    return cachedCategories;
  }

  if (!pendingCategoriesRequest) {
    pendingCategoriesRequest = getAdminCategoriesAll()
      .then((categories) => {
        cachedCategories = categories;
        cachedAt = Date.now();
        return categories;
      })
      .finally(() => {
        pendingCategoriesRequest = null;
      });
  }

  return pendingCategoriesRequest;
}

export function invalidateAllAdminCategoriesCache() {
  cachedCategories = null;
  cachedAt = 0;
  pendingCategoriesRequest = null;
}

export async function getAllAdminCategoryOptions() {
  const categories = await getAllAdminCategories();

  return categories.map((category) => ({
    label: category.name,
    value: category.categoryId,
  })) satisfies AdminCategoryOption[];
}

export function createAdminCategoryNameMap(categories: AdminCategoryItem[]) {
  return new Map(categories.map((category) => [category.categoryId, category.name]));
}
