<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import SelectFilter, {
  type SelectFilterOption,
} from "./ui/SelectFilter.vue";
import PriceRange from "./ui/PriceRange.vue";
import ActionButton from "./ui/ActionButton.vue";

export interface FilterBarState {
  query: string;
  service: string;
  price: string;
  priceRange: [number, number];
  sort: string;
}

const props = withDefaults(
  defineProps<{
    query?: string;
    service?: string;
    price?: string;
    priceRange?: [number, number];
    sort?: string;

    serviceOptions?: SelectFilterOption[];
    sortOptions?: SelectFilterOption[];

    searchPlaceholder?: string;
    searchButtonText?: string;

    serviceLabel?: string;
    priceLabel?: string;
    sortLabel?: string;

    servicePlaceholder?: string;
    sortPlaceholder?: string;

    priceMin?: number;
    priceMax?: number;
    priceStep?: number;
    priceCurrency?: string;

    disabled?: boolean;
  }>(),
  {
    query: "",
    service: "",
    price: "",
    priceRange: () => [0, 2000] as [number, number],
    sort: "",

    serviceOptions: () => [],
    sortOptions: () => [],

    searchPlaceholder: "ค้นหาบริการ...",
    searchButtonText: "ค้นหา",

    serviceLabel: "",
    priceLabel: "",
    sortLabel: "",

    servicePlaceholder: "ทั้งหมด",
    sortPlaceholder: "ตรงตัวอัก...",

    priceMin: 0,
    priceMax: 2000,
    priceStep: 1,
    priceCurrency: "฿",

    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:query", value: string): void;
  (e: "update:service", value: string): void;
  (e: "update:price", value: string): void;
  (e: "update:priceRange", value: [number, number]): void;
  (e: "update:sort", value: string): void;
  (e: "search", value: FilterBarState): void;
}>();

const queryProxy = computed({
  get: () => props.query,
  set: (value: string) => emit("update:query", value),
});

const serviceProxy = computed({
  get: () => props.service,
  set: (value: string) => emit("update:service", value),
});

const priceProxy = computed({
  get: () => props.price,
  set: (value: string) => emit("update:price", value),
});

const priceRangeProxy = computed({
  get: () => props.priceRange,
  set: (value: [number, number]) => {
    emit("update:priceRange", value);
    emit("update:price", `${value[0]}-${value[1]}`);
  },
});

const sortProxy = computed({
  get: () => props.sort,
  set: (value: string) => emit("update:sort", value),
});

const priceDropdownOpen = ref(false);
const priceDropdownRef = ref<HTMLElement>();

const priceDisplayText = computed(
  () => `${priceRangeProxy.value[0]} - ${priceRangeProxy.value[1]} ${props.priceCurrency}`,
);

function togglePriceDropdown() {
  priceDropdownOpen.value = !priceDropdownOpen.value;
}

function closePriceDropdown() {
  priceDropdownOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (
    priceDropdownRef.value &&
    !priceDropdownRef.value.contains(e.target as Node)
  ) {
    closePriceDropdown();
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);

function submitSearch() {
  emit("search", {
    query: queryProxy.value,
    service: serviceProxy.value,
    price: priceProxy.value,
    priceRange: priceRangeProxy.value,
    sort: sortProxy.value,
  });
}
</script>

<template>
  <section
    class="w-full flex justify-between items-center gap-10"
    aria-label="Filter bar"
  >
    <div class="flex items-center gap-6">
      <div
        class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3"
      >
        <svg
          class="w-5 h-5 text-gray-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M16.5 16.5 21 21"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <input
          v-model="queryProxy"
          type="text"
          :disabled="disabled"
          class="flex-1 bg-transparent outline-none style-body-2 text-gray-950 placeholder:text-gray-400"
          :placeholder="searchPlaceholder"
          @keydown.enter.prevent="submitSearch"
        />
      </div>

      
    </div>

    <div class="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
      <SelectFilter
        v-model="serviceProxy"
        :options="serviceOptions"
        :label="serviceLabel"
        :placeholder="servicePlaceholder"
      />

      <div ref="priceDropdownRef" class="relative">
        <span v-if="priceLabel" class="style-body-4 text-gray-500 mb-1 block">
          {{ priceLabel }}
        </span>

        <button
          type="button"
          class="w-full h-[42px] px-3  rounded-full bg-white flex items-center gap-2 transition-colors hover:bg-gray-100"
          @click="togglePriceDropdown"
        >
          <span class="flex-1 text-left style-body-2 text-black font-medium">
            {{ priceDisplayText }}
          </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="w-4 h-4 text-gray-400 transition-transform"
            :class="priceDropdownOpen && 'rotate-180'"
          >
            <path d="M4 6l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div
          v-if="priceDropdownOpen"
          class="absolute z-20 mt-2 w-full min-w-[280px] bg-white border border-gray-200 rounded-xl style-shadow p-3"
        >
          <PriceRange
            v-model="priceRangeProxy"
            :min="priceMin"
            :max="priceMax"
            :step="priceStep"
            :currency="priceCurrency"
          />
        </div>
      </div>

      <SelectFilter
        v-model="sortProxy"
        :options="sortOptions"
        :label="sortLabel"
        :placeholder="sortPlaceholder"
      />
    </div>
    <ActionButton
        :disabled="disabled"
        size="lg"
        class="min-w-[132px] style-headline-2"
        @click="submitSearch"
      >
        {{ searchButtonText }}
      </ActionButton>
  </section>
</template>

