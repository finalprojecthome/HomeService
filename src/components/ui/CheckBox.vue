<script setup lang="ts">
import cn from "../../utils/cn";
const PRIMARY = "#336DF2";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    label: "",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

function toggle() {
  if (!props.disabled) emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <label
    :class="
      cn(
        'inline-flex items-center gap-3 py-2 cursor-pointer select-none group/check',
        disabled && 'cursor-not-allowed',
      )
    "
    :style="{ '--c-primary': PRIMARY }"
    @click.prevent="toggle"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only"
    />
    <span
      :class="
        cn(
          'flex items-center justify-center w-5 h-5 rounded border-2 transition-colors shrink-0',
          !modelValue &&
            !disabled &&
            'border-gray-300 group-hover/check:border-(--c-primary)',
          modelValue && !disabled && 'border-(--c-primary) bg-(--c-primary)',
          !modelValue && disabled && 'border-gray-200 bg-gray-100',
          modelValue && disabled && 'border-gray-300 bg-gray-300',
        )
      "
    >
      <svg
        v-if="modelValue"
        class="w-3.5 h-3.5 text-white"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M2.5 7L5.5 10L11.5 4"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span
      :class="
        cn(
          'style-body-2 transition-colors',
          !modelValue &&
            !disabled &&
            'text-gray-700 group-hover/check:text-(--c-primary)',
          modelValue && !disabled && 'text-gray-950',
          disabled && 'text-gray-400',
        )
      "
    >
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>
