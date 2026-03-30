<script setup lang="ts">
import { computed } from "vue";
import SelectFilter, {
  type SelectFilterOption,
} from "./ui/SelectFilter.vue";
import ActionButton from "./ui/ActionButton.vue";

export interface FilterBarState {
  query: string;
  service: string;
  price: string;
  sort: string;
}

const props = withDefaults(
  defineProps<{
    query?: string;
    service?: string;
    price?: string;
    sort?: string;

    serviceOptions?: SelectFilterOption[];
    priceOptions?: SelectFilterOption[];
    sortOptions?: SelectFilterOption[];

    searchPlaceholder?: string;
    searchButtonText?: string;

    serviceLabel?: string;
    priceLabel?: string;
    sortLabel?: string;

    servicePlaceholder?: string;
    pricePlaceholder?: string;
    sortPlaceholder?: string;

    disabled?: boolean;
  }>(),
  {
    query: "",
    service: "",
    price: "",
    sort: "",

    serviceOptions: () => [],
    priceOptions: () => [],
    sortOptions: () => [],

    searchPlaceholder: "ค้นหาบริการ...",
    searchButtonText: "ค้นหา",

    serviceLabel: "",
    priceLabel: "",
    sortLabel: "",

    servicePlaceholder: "ทั้งหมด",
    pricePlaceholder: "0-2000฿",
    sortPlaceholder: "ตรงตัวอัก...",

    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:query", value: string): void;
  (e: "update:service", value: string): void;
  (e: "update:price", value: string): void;
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

const sortProxy = computed({
  get: () => props.sort,
  set: (value: string) => emit("update:sort", value),
});

function submitSearch() {
  emit("search", {
    query: queryProxy.value,
    service: serviceProxy.value,
    price: priceProxy.value,
    sort: sortProxy.value,
  });
}
</script>

<template>
  <section
    class="style-card-box style-shadow p-6 w-full"
    aria-label="Filter bar"
  >
    <div class="flex items-center gap-6">
      <div
        class="flex-1 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3"
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

      <ActionButton
        :disabled="disabled"
        size="lg"
        class="min-w-[132px] style-headline-2"
        @click="submitSearch"
      >
        {{ searchButtonText }}
      </ActionButton>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <SelectFilter
        v-model="serviceProxy"
        :options="serviceOptions"
        :label="serviceLabel"
        :placeholder="servicePlaceholder"
      />

      <SelectFilter
        v-model="priceProxy"
        :options="priceOptions"
        :label="priceLabel"
        :placeholder="pricePlaceholder"
      />

      <SelectFilter
        v-model="sortProxy"
        :options="sortOptions"
        :label="sortLabel"
        :placeholder="sortPlaceholder"
      />
    </div>
  </section>
</template>

