<script setup lang="ts">
import { computed } from "vue";
import { useScrollState } from "../../composables/useScrollState";
import cn from "../../utils/cn";
import Avatar from "../ui/Avatar.vue";
import NavigationButton from "../ui/NavigationButton.vue";
import Skeleton from "../ui/Skeleton.vue";

const { scrollDirection, scrollY } = useScrollState();

const isHideNavbar = computed(
  () => scrollY.value > 60 && scrollDirection.value === "down"
);

const user: { name: string; imgUrl?: string | null } | null = true
  ? {
      name: "สมศรี จันทร์อังคารพุธ",
      imgUrl: true
        ? "https://izmkosofgpuwlopleptv.supabase.co/storage/v1/object/public/user-assets/87eb79fc-f79b-43b3-828b-76b6c845409e-20260328082723.jpeg"
        : null,
    }
  : null;

const isGetUserLoading = false;
</script>

<template>
  <nav
    :class="
      cn(
        'fixed top-0 left-0 z-100 flex justify-between w-full px-4 bg-white sm:px-8 md:py-4.5 md:px-12 lg:px-20 xl:px-32 2xl:px-40',
        'transition-all duration-400 ease-in-out',
        isHideNavbar
          ? '-translate-y-full shadow-none'
          : 'translate-y-0 shadow-[2px_2px_12px_0px_rgba(64,50,133,0.12)]'
      )
    "
  >
    <div class="flex items-center gap-8 lg:gap-12 xl:gap-16">
      <div class="inline-flex items-center gap-1 md:gap-2">
        <img
          src="../../assets/icon/house.png"
          alt="Home Services"
          class="size-6.5 md:size-8"
        />
        <span
          class="content-center font-medium text-sm text-blue-600 md:h-9 md:text-2xl"
        >
          HomeServices
        </span>
      </div>
      <div class="hidden pt-3 pb-2 md:block">
        <span class="style-headline-5">บริการของเรา</span>
      </div>
    </div>
    <div class="inline-flex items-center">
      <div class="px-2.5 py-3.5 md:hidden">
        <span class="style-body-3">บริการของเรา</span>
      </div>
      <div v-if="user">
        <div class="flex gap-3 items-center">
          <Skeleton
            v-if="isGetUserLoading"
            class="hidden h-5.25 w-30 md:block"
          />
          <span v-else class="hidden style-body-3 text-gray-700 md:inline">
            {{ user.name }}
          </span>
          <Skeleton
            v-if="isGetUserLoading"
            class="rounded-full size-8 md:size-10"
          />
          <Avatar v-else :src="user.imgUrl" class="size-8 md:size-10" />
        </div>
      </div>
      <NavigationButton
        v-else
        variant="secondary"
        to="/auth/login"
        class="h-9.25 px-4 text-sm md:h-10 md:px-6 md:text-[1rem]"
      >
        เข้าสู่ระบบ
      </NavigationButton>
    </div>
  </nav>
</template>
