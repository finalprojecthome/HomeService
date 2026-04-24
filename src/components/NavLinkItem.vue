<script setup lang="ts">
import type { Component } from "vue";

export interface SidebarItemProps {
  title: string;
  icon: Component;
  badge?: number;
  active?: boolean;
}

defineProps<SidebarItemProps>();
</script>

<template>
  <button
    type="button"
    :class="[
      'flex items-center w-full py-[15px] px-[24px] gap-[16px]',
      'text-left text-white cursor-pointer transition-colors',
      active ? 'bg-blue-900' : 'bg-blue-950 hover:bg-blue-900'
    ]"
  >
    <!-- Icon Layer -->
    <component
      :is="icon"
      aria-hidden="true"
      class="w-6 h-6 text-white shrink-0"
    />

    <!-- Title Label -->
    <span class="flex-1 text-gray-100 leading-tight style-headline-5">
      {{ title }}
    </span>

    <!-- Notification Badge -->
    <span
      v-if="badge !== undefined && badge > 0"
      class="flex items-center justify-center min-w-[20px] h-[20px] px-[6px] bg-red text-[12px] text-gray-100 rounded-full shrink-0 style-body-3"
    >
      {{ badge > 99 ? "99+" : badge }}
    </span>
  </button>
</template>