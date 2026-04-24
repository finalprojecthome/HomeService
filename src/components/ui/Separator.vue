<script setup lang="ts">
import cn from "../../utils/cn";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <hr :class="cn('text-gray-500', props.class)" />
</template>
