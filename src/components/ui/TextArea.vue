<script setup lang="ts">
import cn from "../../utils/cn";

interface Props {
  name: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  class?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Props>();
</script>

<template>
  <textarea
    v-bind="$attrs"
    :id="props.name + '-id'"
    :name="props.name"
    :value="props.value"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="
      cn(
        'w-full h-23 px-4 py-2.5 style-body-2  text-gray-950 bg-white rounded-lg ring ring-inset ring-gray-300 transition-all outline-none',
        'focus-visible:ring-blue-600',
        'disabled:text-gray-400 disabled:bg-gray-100 disabled:ring-gray-300',
        disabled ? 'placeholder:text-gray-400' : 'placeholder:text-gray-700',
        isError && 'ring-red focus-visible:ring-red',
        props.class,
      )
    "
  />
</template>
