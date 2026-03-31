<script setup lang="ts">
import cn from '../../utils/cn';

defineProps<{
  path: string;
  class?: string;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="cn('w-[18px] h-[18px]', $props.class)">
    <path stroke-linecap="round" stroke-linejoin="round" :d="path" />
  </svg>
</template>
