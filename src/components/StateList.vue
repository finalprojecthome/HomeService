<script setup lang="ts">
import { computed } from "vue";
import cn from "../utils/cn";
import { CheckedCircle, SpinnerIcon, List as ListIcon } from "./icons";

export interface StateListItem {
  id: string;
  label: string;
  icon?: any;
}

type StateStatus = "todo" | "doing" | "done";

const props = withDefaults(
  defineProps<{
    items: StateListItem[];
    activeIndex?: number;
    clickable?: boolean;
    iconSize?: number;
    todoIcon?: any;
    doingIcon?: any;
    doneIcon?: any;
  }>(),
  {
    items: () => [],
    activeIndex: -1,
    clickable: false,
    iconSize: 24,
  },
);

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const safeActiveIndex = computed(() => {
  const max = props.items.length - 1;
  if (max < 0) return -1;

  const ai = props.activeIndex ?? -1;
  if (ai < 0) return -1;
  return Math.min(Math.max(ai, 0), max);
});

function statusForIndex(idx: number): StateStatus {
  if (idx < safeActiveIndex.value) return "done";
  if (idx === safeActiveIndex.value) return "doing";
  return "todo";
}

function containerClass(idx: number) {
  const status = statusForIndex(idx);
  return cn(
    "w-full rounded-xl border-2 px-6 py-5 flex flex-col items-center gap-3 transition-colors bg-white",
    status === "todo" && "border-gray-200 hover:border-gray-300",
    status === "doing" && "border-blue-400 bg-blue-50",
    status === "done" && "border-green-400 bg-green-50",
  );
}

function iconCircleClass(idx: number) {
  const status = statusForIndex(idx);
  return cn(
    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors",
    status === "todo" && "border-gray-300 text-gray-300 bg-white",
    status === "doing" && "border-blue-600 text-blue-600 bg-white",
    status === "done" && "border-blue-500 text-white bg-blue-500",
  );
}

function iconForItem(item: StateListItem, idx: number) {
  if (item.icon) return item.icon;
  const status = statusForIndex(idx);
  if (status === "done") return props.doneIcon ?? CheckedCircle;
  if (status === "doing") return props.doingIcon ?? SpinnerIcon;
  return props.todoIcon ?? ListIcon;
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full" style="--c-light: #E7EEFF">
    <button
      v-for="(item, idx) in items"
      :key="item.id"
      type="button"
      :disabled="!clickable"
      @click="clickable ? emit('select', item.id) : undefined"
      :class="containerClass(idx)"
    >
      <div :class="iconCircleClass(idx)">
        <component :is="iconForItem(item, idx)" :size="iconSize" />
      </div>

      <span
        :class="
          cn(
            'style-body-2',
            statusForIndex(idx) === 'doing'
              ? 'text-blue-600'
              : statusForIndex(idx) === 'done'
                ? 'text-green-800'
                : 'text-gray-600',
          )
        "
      >
        {{ item.label }}
      </span>
    </button>
  </div>
</template>

