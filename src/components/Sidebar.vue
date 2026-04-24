<script setup lang="ts">
import NavLinks, { type NavLink } from './NavLinks.vue';
import NavLinkItem from './NavLinkItem.vue';
import houseIcon from '../assets/icon/house.png';
import { RouterLink } from 'vue-router';

interface Props {
  logoText?: string;
  links: NavLink[];
  bottomLink?: NavLink;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  logoText: 'HomeServices',
  width: 'w-[240px]',
});

const emit = defineEmits<{
  (e: 'click', link: NavLink): void;
  (e: 'logout-click', link: NavLink): void;
}>();

const handleLinkClick = (link: NavLink) => {
  emit('click', link);
};

const handleBottomLinkClick = () => {
  if (props.bottomLink) {
    emit('logout-click', props.bottomLink);
  }
};
</script>

<template>
  <aside :class="['flex flex-col gap-[16px] h-full min-h-screen max-w-[240px] bg-blue-950 overflow-hidden', width]">
    <!-- Logo Section -->
    <div class="px-[24px] pt-[24px] pb-[28px]">
      <slot name="logo">
        <RouterLink to="/" class="flex items-center justify-center gap-[10px] px-[12px] py-[8px] bg-blue-100 rounded-xl text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer">
          <img :src="houseIcon" alt="HomeServices Logo" class="w-7 h-7 shrink-0 object-contain" />
          <span class="style-headline-2">{{ logoText }}</span>
        </RouterLink>
      </slot>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto w-full">
      <NavLinks :links="links" @click="handleLinkClick" />
    </div>

    <!-- Bottom Action (Logout) -->
    <div class="mb-8">
      <slot name="bottom-action">
        <NavLinkItem
          v-if="bottomLink"
          :title="bottomLink.title"
          :icon="bottomLink.icon"
          :active="bottomLink.active" 
          @click="handleBottomLinkClick"
        />
      </slot>
    </div>
  </aside>
</template>
