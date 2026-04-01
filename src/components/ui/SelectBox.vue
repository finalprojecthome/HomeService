<script setup lang="ts">
import { computed } from "vue";
import cn from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    value?: string;
    label?: string;
    disabled?: boolean;
    class?: string;
  }>(),
  {
    value: "",
    label: "",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isSelected = computed(() => props.modelValue === props.value);

function select() {
  if (!props.disabled) emit("update:modelValue", props.value);
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="
      cn(
        'flex flex-col items-center justify-center gap-2 w-60 h-28 rounded-lg border-2 px-4 py-3 transition-all cursor-pointer select-none group/box',
        !isSelected &&
          !disabled &&
          'border-gray-300 bg-white hover:border-blue-600',
        isSelected && !disabled && 'border-blue-600 bg-blue-100',
        disabled &&
          'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed',
        props.class,
      )
    "
    @click="select"
  >
    <div
      :class="
        cn(
          'transition-colors',
          !isSelected &&
            !disabled &&
            'text-gray-700 group-hover/box:text-blue-600',
          isSelected && !disabled && 'text-blue-600',
          disabled && 'text-gray-400',
        )
      "
    >
      <slot name="icon">
        <!-- Default QR-code style icon -->
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-8">
          <path
            d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z"
          />
        </svg>
      </slot>
    </div>
    <span
      :class="
        cn(
          'style-headline-5 transition-colors',
          !isSelected &&
            !disabled &&
            'text-gray-950 group-hover/box:text-blue-600',
          isSelected && !disabled && 'text-blue-600',
          disabled && 'text-gray-400',
        )
      "
    >
      {{ label }}
    </span>
  </button>
</template>
