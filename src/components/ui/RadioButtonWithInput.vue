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
    inputValue?: string;
    suffix?: string;
    inputPlaceholder?: string;
  }>(),
  {
    value: "",
    label: "",
    disabled: false,
    inputValue: "",
    suffix: "%",
    inputPlaceholder: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:inputValue": [value: string];
}>();

const isSelected = computed(() => props.modelValue === props.value);

function select() {
  if (!props.disabled) emit("update:modelValue", props.value);
}

function onInput(e: Event) {
  emit("update:inputValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center gap-3 py-2 select-none group/radio',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )
    "
    :style="{ '--c-primary': PRIMARY, '--c-light': LIGHT }"
  >
    <label class="inline-flex items-center gap-3 min-w-28 shrink-0" @click.prevent="select">
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
            'flex items-center justify-center w-5 h-5 rounded-full transition-colors shrink-0',
            !isSelected &&
              !disabled &&
              'border-2 border-gray-300 group-hover/radio:border-(--c-primary)',
            isSelected &&
              !disabled &&
              'border-2 border-(--c-primary) bg-(--c-primary)',
            disabled && 'border border-gray-300 bg-gray-100'
          )
        "
      >
        <span v-if="isSelected" class="w-2 h-2 rounded-full bg-white" />
      </span>
      <span
        :class="
          cn(
            'style-body-2 transition-colors whitespace-nowrap',
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

    <div
      :class="
        cn(
          'flex items-center w-[140px] h-[42px] border border-gray-300 rounded-lg overflow-hidden transition-colors shrink-0',
          !isSelected && !disabled && 'bg-gray-100',
          isSelected && !disabled && 'bg-white focus-within:border-(--c-primary)',
          disabled && 'bg-gray-100'
        )
      "
    >
      <input
        type="text"
        :value="inputValue"
        :disabled="disabled"
        :placeholder="inputPlaceholder"
        :class="
          cn(
            'flex-1 min-w-0 px-3 style-body-2 outline-none bg-transparent text-right',
            disabled && 'text-gray-400 cursor-not-allowed'
          )
        "
        @input="onInput"
        @click.stop
      />
      <span
        :class="
          cn(
            'pr-3 pl-1 style-body-2 shrink-0',
            disabled ? 'text-gray-400' : 'text-gray-500'
          )
        "
      >
        {{ suffix }}
      </span>
    </div>
  </div>
</template>
