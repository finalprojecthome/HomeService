<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ActionButton from "./ui/ActionButton.vue";
import { TagIcon } from "./icons";

export interface QuantityListItem {
  id: string;
  title: string;
  pricePerUnit: number;
  unitLabel?: string; // default: "เครื่อง"
}

export type QuantityListUnitLabel = string;

const props = withDefaults(
  defineProps<{
    title?: string; // header for the whole list
    items: ReadonlyArray<QuantityListItem>;

    modelValue?: number[]; // quantity per item (same order as items)
    min?: number;
    max?: number | null;
    unitLabel?: QuantityListUnitLabel; // default: "เครื่อง"
    disabled?: boolean;
  }>(),
  {
    title: "",
    modelValue: () => [],
    min: 0,
    max: null,
    unitLabel: "เครื่อง",
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
  (e: "change", value: { quantities: number[]; total: number }): void;
}>();

function clampQuantity(n: number) {
  const min = props.min ?? 0;
  const max = props.max ?? null;
  if (n < min) return min;
  if (typeof max === "number" && n > max) return max;
  return n;
}

function formatPriceTH(value: number) {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Keep an internal ref to ensure UI updates even when parent passes fewer values.
const quantitiesRef = ref<number[]>([]);

watch(
  () => [props.items, props.modelValue],
  () => {
    const input = props.modelValue ?? [];
    const next = props.items.map((_, i) => {
      const v = input[i];
      return typeof v === "number" && Number.isFinite(v)
        ? clampQuantity(v)
        : props.min ?? 0;
    });
    quantitiesRef.value = next;
  },
  { immediate: true, deep: true },
);

const total = computed(() => {
  return props.items.reduce((sum, item, i) => {
    const qty = quantitiesRef.value[i] ?? 0;
    return sum + qty * item.pricePerUnit;
  }, 0);
});

function emitUpdate(next: number[]) {
  emit("update:modelValue", next);
  emit("change", { quantities: next, total: total.value });
}

function setAt(index: number, nextQty: number) {
  if (props.disabled) return;
  const current = quantitiesRef.value[index] ?? (props.min ?? 0);
  const clamped = clampQuantity(nextQty);
  if (clamped === current) return;
  const next = quantitiesRef.value.slice();
  next[index] = clamped;
  quantitiesRef.value = next;
  emitUpdate(next);
}

function decrement(index: number) {
  setAt(index, (quantitiesRef.value[index] ?? props.min ?? 0) - 1);
}

function increment(index: number) {
  setAt(index, (quantitiesRef.value[index] ?? props.min ?? 0) + 1);
}

const isMinusDisabled = (index: number) => {
  const qty = quantitiesRef.value[index] ?? props.min ?? 0;
  return props.disabled || qty <= (props.min ?? 0);
};

const isPlusDisabled = (index: number) => {
  if (props.disabled) return true;
  if (typeof props.max !== "number") return false;
  const qty = quantitiesRef.value[index] ?? props.min ?? 0;
  return qty >= props.max;
};
</script>

<template>
  <section class="w-full">
    <h3 v-if="title" class="style-headline-3 text-gray-950 mb-4">
      {{ title }}
    </h3>

    <div
      class="w-full border border-gray-200 rounded-xl divide-y divide-gray-200 bg-transparent"
    >
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        class="px-6 py-5 flex items-start justify-between gap-4"
      >
        <div class="flex flex-col gap-2">
          <div class="style-headline-4 text-gray-950">
            {{ item.title }}
          </div>

          <div class="flex items-center gap-2 text-gray-600">
            <TagIcon :size="18" class="text-gray-400" />
            <span class="style-body-2">
              {{ formatPriceTH(item.pricePerUnit) }} ฿ /
              {{ item.unitLabel ?? unitLabel }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <ActionButton
            variant="secondary"
            size="sm"
            class="w-10 h-10 px-0 py-0 rounded-lg"
            :disabled="isMinusDisabled(idx)"
            @click="decrement(idx)"
          >
            <span class="text-lg leading-none">-</span>
          </ActionButton>

          <span class="min-w-8 text-center style-headline-5 text-gray-950">
            {{ quantitiesRef[idx] ?? (min ?? 0) }}
          </span>

          <ActionButton
            variant="secondary"
            size="sm"
            class="w-10 h-10 px-0 py-0 rounded-lg"
            :disabled="isPlusDisabled(idx)"
            @click="increment(idx)"
          >
            <span class="text-lg leading-none">+</span>
          </ActionButton>
        </div>
      </div>
    </div>
  </section>
</template>

