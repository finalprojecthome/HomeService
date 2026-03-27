<script setup lang="ts">
import { computed } from 'vue';
import cn from '../../utils/cn';

const props = withDefaults(defineProps<{
  variant?: 'blue' | 'purple' | 'green' | 'yellow' | 'gray';
  class?: string;
}>(), {
  variant: 'blue'
});

const baseStyle = "px-3 py-1 text-[13px] font-medium rounded-full inline-flex items-center";
const variants = {
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-900",
  green: "bg-green-100 text-green-900",
  yellow: "bg-yellow-100 text-yellow-900",
  gray: "bg-gray-200 text-gray-800",
};

const computedClass = computed(() => cn(baseStyle, variants[props.variant || 'blue'], props.class));
</script>

<template>
  <span :class="computedClass">
    <slot />
  </span>
</template>
