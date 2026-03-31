<template>
  <nav :class="wrapperClass" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
      
      <!-- clickable -->
      <button
        v-if="item.clickable"
        type="button"
        :class="[
          baseTextClass,
          clickableClass,

          // ⭐ จุดสำคัญ
          // ถ้าเป็นตัวแรก (index === 0) → ใช้ rootClass
          // ถ้าไม่ใช่ → ใช้ logic เดิม
          index === 0
            ? rootClass
            : item.active
              ? activeClass
              : textClass
        ]"
        @click="handleClick(index)"
      >
        {{ item.label }}
      </button>

      <!-- non-clickable -->
      <span
        v-else
        :class="[
          baseTextClass,
          // ⭐ logic เดียวกันกับด้านบน
          index === 0
            ? rootClass
            : item.active
              ? activeClass
              : textClass
        ]"
      >
        {{ item.label }}
      </span>

      <!-- separator -->
      <span
        v-if="index < items.length - 1"
        :class="separatorClass"
      >
        >
      </span>

    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

/** ===== Types ===== */
export type BreadcrumbItem = {
  label: string;
  active?: boolean;
  clickable?: boolean;
};

interface Props {
  items: BreadcrumbItem[];
  size?: "sm" | "md";
}

/** ===== Props ===== */
const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

/** ===== Emits ===== */
const emit = defineEmits<{
  (e: "navigate", index: number): void;
}>();

/** ===== Methods ===== */
const handleClick = (index: number) => {
  emit("navigate", index);
};

/** ===== Styles ===== */
const wrapperClass = computed(() => [
  "inline-flex items-center rounded-xl bg-white",
  props.size === "md"
    ? "px-8 py-5.5 gap-3"
    : "px-4 py-2.5 gap-2",
]);

const baseTextClass = "whitespace-nowrap bg-transparent border-0 p-0";

/** ⭐ style ปกติ (item ที่ไม่ active) */
const textClass = computed(() =>
  props.size === "md"
    ? "style-headline-5 text-grey-700"
    : "style-body-1 text-grey-700"
);

/** ⭐ style ของ item ที่ active (เช่น ล้างแอร์) */
const activeClass = computed(() =>
  props.size === "md"
    ? "style-headline-1 font-medium text-blue-600"
    : "style-headline-2 text-blue-600"
);

/** ⭐ NEW: style ของ "บริการของเรา" */
const rootClass = computed(() =>
  props.size === "md"
    ? "style-headline-5 text-grey-700"  // 👉 ปรับสีตรงนี้ได้
    : "style-body-1 text-grey-700"
);

const separatorClass = computed(() =>
  props.size === "md"
    ? "text-[16px] text-grey-400"
    : "text-[16px] text-grey-400"
);

const clickableClass =
  "cursor-pointer hover:opacity-80 transition-opacity";
</script>