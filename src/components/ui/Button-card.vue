<script setup lang="ts">
import { computed } from 'vue';
import cn from '../../utils/cn';

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

const baseStyle = "px-6 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  text: "text-blue-600 hover:text-blue-800 p-0 font-semibold text-[15px] hover:underline",
};

const computedClass = computed(() => cn(baseStyle, variants[props.variant || 'primary'], props.class));
</script>

<template>
  <button :type="type" :disabled="disabled" :class="computedClass" @click="emit('click', $event)">
    <slot />
  </button>
</template>
