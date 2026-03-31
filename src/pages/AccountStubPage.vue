<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";

const route = useRoute();

const title = computed(() => String(route.meta.title ?? ""));
</script>

<template>
  <MainWithNarbar>
    <div class="px-4 py-8 md:px-12">
      <h1 class="style-headline-5 text-gray-900">{{ title }}</h1>
    </div>
  </MainWithNarbar>
</template>
