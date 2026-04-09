import {
  getAdminCategories,
  type AdminCategoryItem,
} from "./AdminCategory";

export type AdminCategoryOption = {
  label: string;
  value: number;
};

export async function getAllAdminCategories() {
  const categories: AdminCategoryItem[] = [];
  let page = 0;
  let hasNext = true;

  while (hasNext) {
    const response = await getAdminCategories({ page });
    categories.push(...response.items);
    hasNext = response.hasNext;
    page += 1;
  }

  return categories;
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
