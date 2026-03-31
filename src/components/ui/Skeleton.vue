<script setup lang="ts">
import cn from "../../utils/cn";

const props = defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('bg-gray-300 rounded-md animate-pulse', props.class)" />
</template>
