import { computed, ref, toValue, type ComputedRef, type MaybeRefOrGetter } from "vue";
import type { FilterBarState } from "../components/FilterBar.vue";

type FilterableServiceItem = {
  title: string;
  category: string;
  price: string;
};

type UseServiceFiltersResult<T extends FilterableServiceItem> = {
  displayedItems: ComputedRef<T[]>;
  onSearch: (filters: FilterBarState) => void;
  resetSearch: () => void;
};

function parsePriceValue(rawPrice: string): number {
  const cleaned = rawPrice.replace(/,/g, "");
  const matched = cleaned.match(/\d+(\.\d+)?/);
  return matched ? Number(matched[0]) : 0;
}

function applyFilters<T extends FilterableServiceItem>(
  items: T[],
  filters: FilterBarState,
): T[] {
  let result = [...items];

  const keyword = filters.query.trim().toLowerCase();
  if (keyword) {
    result = result.filter((item) => item.title.toLowerCase().includes(keyword));
  }

  if (filters.service) {
    result = result.filter((item) => item.category === filters.service);
  }

  const [minPrice, maxPrice] = filters.priceRange;
  result = result.filter((item) => {
    const value = parsePriceValue(item.price);
    return value >= minPrice && value <= maxPrice;
  });

  if (filters.sort === "asc") {
    result.sort((a, b) => a.title.localeCompare(b.title, "th"));
  } else if (filters.sort === "desc") {
    result.sort((a, b) => b.title.localeCompare(a.title, "th"));
  }

  // Skip "recommended" and "popular" for now.
  return result;
}

export function useServiceFilters<T extends FilterableServiceItem>(
  items: MaybeRefOrGetter<T[]>,
): UseServiceFiltersResult<T> {
  const searchedFilters = ref<FilterBarState | null>(null);

  const displayedItems = computed(() => {
    const sourceItems = toValue(items);
    if (!searchedFilters.value) return sourceItems;
    return applyFilters(sourceItems, searchedFilters.value);
  });

  function onSearch(filters: FilterBarState) {
    searchedFilters.value = { ...filters };
  }

  function resetSearch() {
    searchedFilters.value = null;
  }

  return {
    displayedItems,
    onSearch,
    resetSearch,
  };
}
