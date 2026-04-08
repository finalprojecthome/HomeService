<script setup lang="ts">
import { useRouter } from "vue-router";
import { useScrollState } from "../composables/useScrollState";
import cn from "../utils/cn";

type SidebarItem = {
  icon: unknown;
  label: string;
  path?: string;
};

defineProps<{
  sidebarItems: SidebarItem[];
  sidebarClass: string;
}>();

const router = useRouter();
const { scrollDirection } = useScrollState();
</script>
<template>
  <div
    :class="
      cn(
        'sticky h-fit py-4 bg-bg-gray z-10',
        'transition-all duration-400 ease-in-out',
        scrollDirection === 'down'
          ? 'top-0 xl:top-4 xl:py-0'
          : 'top-13 md:top-20 xl:pt-0',
      )
    "
  >
    <div
      class="flex flex-col xl:py-8 py-2 xl:px-6 px-4 mx-4 xl:mx-0 xl:w-[253px] bg-white rounded-card-box border border-gray-300 opacity-95 md:opacity-100"
    >
      <h3 class="style-headline-3 text-gray-900 border-b border-gray-300 pb-5">
        บัญชีผู้ใช้
      </h3>
      <div
        class="flex pt-4 gap-2 overflow-x-auto xl:flex-col xl:gap-0 items-center xl:items-start justify-between xl:justify-start"
      >
        <template
          v-for="(item, index) in sidebarItems ?? []"
          :key="item.path ?? item.label ?? index"
        >
          <router-link
            v-if="item.path"
            :to="item.path"
            :class="
              cn(
                sidebarClass,
                'shrink-0 min-w-29 sm:min-w-32 max-xl:flex-col max-xl:items-center max-xl:justify-center max-xl:gap-1 max-xl:py-2 max-xl:px-1 xl:min-w-0 xl:max-w-none xl:w-full xl:flex-row xl:shrink xl:gap-1 xl:py-3 xl:px-0',
              )
            "
          >
            <component
              :is="item.icon"
              :class="
                cn(
                  'size-6 shrink-0 text-gray-500',
                  router.currentRoute.value.path.startsWith(item.path ?? '') &&
                    'text-blue-700',
                )
              "
            />
            <span
              :class="
                cn(
                  'text-center xl:text-left text-balance line-clamp-2 leading-snug wrap-break-word min-w-0 xl:min-w-0',
                  router.currentRoute.value.path.startsWith(item.path ?? '') &&
                    'text-blue-700',
                )
              "
              >{{ item.label }}</span
            >
          </router-link>
          <div
            v-else
            :class="
              cn(
                sidebarClass,
                'shrink-0 min-w-29 sm:min-w-32 max-xl:flex-col max-xl:items-center max-xl:justify-center max-xl:gap-1 max-xl:py-2 max-xl:px-1 xl:min-w-0 xl:w-full xl:flex-row xl:shrink xl:gap-1 xl:py-3 xl:px-0',
              )
            "
          >
            <component :is="item.icon" class="size-6 shrink-0 text-gray-500" />
            <span
              :class="
                cn(
                  'text-center xl:text-left text-balance line-clamp-2 leading-snug wrap-break-word min-w-0',
                  router.currentRoute.value.path.startsWith(item.path ?? '') &&
                    'text-blue-700',
                )
              "
            >
              {{ item.label }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
