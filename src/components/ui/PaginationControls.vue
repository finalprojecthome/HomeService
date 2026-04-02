<script setup lang="ts">
import { computed } from "vue";

const pageIndex = defineModel<number>("pageIndex", { required: true });

const props = withDefaults(
  defineProps<{
    totalPages: number;
    loading?: boolean;
  }>(),
  { loading: false },
);

function goPrev() {
  pageIndex.value = Math.max(0, pageIndex.value - 1);
}

function goNext() {
  pageIndex.value = Math.min(
    Math.max(0, props.totalPages - 1),
    pageIndex.value + 1,
  );
}

const isFirst = computed(() => pageIndex.value <= 0);
const isLast = computed(
  () =>
    props.totalPages <= 0 || pageIndex.value >= props.totalPages - 1,
);
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-center gap-4 pt-2"
  >
    <button
      type="button"
      class="rounded border border-gray-300 bg-white px-4 py-2 text-gray-800 style-body-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="loading || isFirst"
      @click="goPrev"
    >
      ก่อนหน้า
    </button>
    <span class="text-gray-700 style-body-2">
      หน้า {{ pageIndex + 1 }} / {{ totalPages }}
    </span>
    <button
      type="button"
      class="rounded border border-gray-300 bg-white px-4 py-2 text-gray-800 style-body-3 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="loading || isLast"
      @click="goNext"
    >
      ถัดไป
    </button>
  </div>
</template>
