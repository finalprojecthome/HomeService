<script setup lang="ts">
import type { Component } from 'vue';
import { useRoute } from 'vue-router';
import NavLinkItem from './NavLinkItem.vue';

export interface NavLink {
  title: string;
  icon: Component;
  badge?: number;
  id?: string | number;
  active?: boolean;
  path?: string;
}

defineProps<{
  links: NavLink[];
}>();

const emit = defineEmits<{
  (e: 'click', link: NavLink): void;
}>();

const route = useRoute();
</script>

<template>
  <div class="flex flex-col">
    <NavLinkItem 
      v-for="(link, index) in links" 
      :key="link.id || index"
      :title="link.title"
      :icon="link.icon"
      :badge="link.badge"
      :active="link.active ?? (link.path === route.path)"
      @click="emit('click', link)"
    />
  </div>
</template>
