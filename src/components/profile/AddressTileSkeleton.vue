<script setup lang="ts">
import Skeleton from '../ui/Skeleton.vue';

</script>

<template>
  <article
    class="flex flex-col gap-2 w-full p-4 bg-white rounded-lg style-card-box"
  >
    <Skeleton class="h-7.5 w-25" />
    <Skeleton class="h-6 max-w-150" />
  </article>
</template>
