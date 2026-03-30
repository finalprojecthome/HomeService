<script setup lang="ts">
import { computed } from "vue";
import cn from "../../utils/cn";
const PRIMARY = "#336DF2";
const LIGHT = "#E7EEFF";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    value?: string;
    label?: string;
    disabled?: boolean;
    name?: string;
  }>(),
  {
    value: "",
    label: "",
    disabled: false,
  }
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
  <label
    :class="
      cn(
        'inline-flex items-center gap-3 py-2 cursor-pointer select-none group/radio',
        disabled && 'cursor-not-allowed'
      )
    "
    :style="{ '--c-primary': PRIMARY, '--c-light': LIGHT }"
    @click.prevent="select"
  >
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="isSelected"
      :disabled="disabled"
      class="sr-only"
    />
    <span
      :class="
        cn(
          'flex items-center justify-center w-5 h-5 rounded-full border transition-colors shrink-0',
          !isSelected &&
            !disabled &&
            'border-gray-300 group-hover/radio:border-(--c-primary)',
          isSelected &&
            !disabled &&
            'border-(--c-primary) bg-(--c-primary)',
          !isSelected && disabled && 'border-gray-200 bg-gray-100',
          
        )
      "
    >
      <span v-if="isSelected" class="w-2 h-2 rounded-full bg-white" />
    </span>
    <span
      :class="
        cn(
          'style-body-2 transition-colors',
          !isSelected &&
            !disabled &&
            'text-gray-700 group-hover/radio:text-(--c-primary)',
          isSelected && !disabled && 'text-gray-950',
          disabled && 'text-gray-400'
        )
      "
    >
      {{ label }}
    </span>
  </label>
</template>
