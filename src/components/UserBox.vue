<script setup lang="ts">
type SidebarItem = {
  icon: unknown;
  label: string;
  path?: string;
};
defineProps<{
  sidebarItems: SidebarItem[];
  sidebarClass: string;
}>();
</script>
<template>
  <div
    class="flex flex-col xl:py-8 py-2 xl:px-6 px-4 xl:w-[253px] xl:h-[252px] bg-white rounded-card-box border border-gray-300 sticky top-3 opacity-95 md:opacity-100"
  >
    <h3 class="style-headline-3 text-gray-900 border-b border-gray-300 pb-5">
      บัญชีผู้ใช้
    </h3>
    <div class="flex flex-col pt-4">
      <div
        class="flex xl:flex-col xl:gap-0 items-center xl:items-start justify-between xl:justify-start"
      >
        <template
          v-for="(item, index) in sidebarItems ?? []"
          :key="item.path ?? item.label ?? index"
        >
          <router-link v-if="item.path" :to="item.path" :class="sidebarClass">
            <component :is="item.icon" />
            {{ item.label }}
          </router-link>
          <div v-else-if="index === 0" :class="sidebarClass">
            <component :is="item.icon" />
            {{ item.label }}
          </div>
          <span v-else :class="sidebarClass">
            <component :is="item.icon" />
            {{ item.label }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
