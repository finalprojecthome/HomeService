import type { DropdownOption } from "../components/ui/Dropdown.vue";
import {
  createAdminCategoryNameMap,
  getAllAdminCategories,
  type AdminCategoryOption,
} from "../services/adminCategoryOptions";
import type { AdminCategoryItem } from "../services/AdminCategory";

const ADMIN_SERVICE_CATEGORY_CACHE_TTL_MS = 30_000;

let cachedCategories: AdminCategoryItem[] | null = null;
let cachedAt = 0;
let pendingCategoriesPromise: Promise<AdminCategoryItem[]> | null = null;

export async function getCachedAdminServiceCategories() {
  if (
    cachedCategories &&
    Date.now() - cachedAt < ADMIN_SERVICE_CATEGORY_CACHE_TTL_MS
  ) {
    return cachedCategories;
  }

  if (!pendingCategoriesPromise) {
    pendingCategoriesPromise = getAllAdminCategories()
      .then((categories) => {
        cachedCategories = categories;
        cachedAt = Date.now();
        return categories;
      })
      .finally(() => {
        pendingCategoriesPromise = null;
      });
  }

  return pendingCategoriesPromise;
}

export async function getCachedAdminServiceCategoryOptions(): Promise<
  DropdownOption[] | AdminCategoryOption[]
> {
  const categories = await getCachedAdminServiceCategories();

  return categories.map((category) => ({
    label: category.name,
    value: category.categoryId,
  }));
}

export async function getCachedAdminServiceCategoryNameMap() {
  const categories = await getCachedAdminServiceCategories();
  return createAdminCategoryNameMap(categories);
}
