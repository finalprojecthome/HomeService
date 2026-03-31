<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useScrollState } from "../../composables/useScrollState";
import cn from "../../utils/cn";
import { History, List, Logout, UserIcon } from "../icons";
import Avatar from "../ui/Avatar.vue";
import NavigationButton from "../ui/NavigationButton.vue";
import Skeleton from "../ui/Skeleton.vue";

const router = useRouter();
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

const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

function goHome() {
  router.push({ name: "home" });
}

function goServices() {
  router.push({ name: "services" });
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function closeUserMenu() {
  userMenuOpen.value = false;
}

function handleUserMenuOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
}

function goProfile() {
  closeUserMenu();
  router.push({ name: "profile" });
}

function goRepairOrders() {
  closeUserMenu();
  router.push({ name: "repairOrders" });
}

function goRepairHistory() {
  closeUserMenu();
  router.push({ name: "repairHistory" });
}

function goLogout() {
  closeUserMenu();
  router.push({ name: "login" });
}

onMounted(() => document.addEventListener("click", handleUserMenuOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleUserMenuOutside)
);
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
      <button
        type="button"
        class="inline-flex items-center gap-1 md:gap-2 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        @click="goHome"
      >
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
      </button>
      <div class="hidden pt-3 pb-2 md:block">
        <button
          type="button"
          class="style-headline-5 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="goServices"
        >
          บริการของเรา
        </button>
      </div>
    </div>
    <div class="inline-flex items-center">
      <div class="px-2.5 py-3.5 md:hidden">
        <button
          type="button"
          class="style-body-3 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="goServices"
        >
          บริการของเรา
        </button>
      </div>
      <div v-if="user" ref="userMenuRef" class="relative">
        <button
          v-if="!isGetUserLoading"
          type="button"
          class="flex gap-3 items-center cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          :aria-expanded="userMenuOpen"
          aria-haspopup="true"
          @click.stop="toggleUserMenu"
        >
          <span class="hidden style-body-3 text-gray-700 md:inline">
            {{ user.name }}
          </span>
          <Avatar :src="user.imgUrl" class="size-8 md:size-10" />
        </button>
        <div v-else class="flex gap-3 items-center">
          <Skeleton class="hidden h-5.25 w-30 md:block" />
          <Skeleton class="rounded-full size-8 md:size-10" />
        </div>

        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="userMenuOpen && !isGetUserLoading"
            class="absolute right-0 top-full z-200 mt-2 min-w-[240px] rounded-xl bg-white py-2 shadow-[2px_2px_12px_0px_rgba(64,50,133,0.12)]"
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-3 px-4 py-3 text-left style-body-3 text-gray-700 transition-colors hover:bg-gray-100"
              @click="goProfile"
            >
              <UserIcon :size="20" class="shrink-0 text-gray-600" />
              ข้อมูลผู้ใช้งาน
            </button>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-3 px-4 py-3 text-left style-body-3 text-gray-700 transition-colors hover:bg-gray-100"
              @click="goRepairOrders"
            >
              <List :size="20" class="shrink-0 text-gray-600" />
              รายการคำสั่งซ่อม
            </button>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-3 px-4 py-3 text-left style-body-3 text-gray-700 transition-colors hover:bg-gray-100"
              @click="goRepairHistory"
            >
              <History :size="20" class="shrink-0 text-gray-600" />
              ประวัติการซ่อม
            </button>
            <div class="my-1 h-px bg-gray-200" role="presentation" />
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-3 px-4 py-3 text-left style-body-3 text-gray-700 transition-colors hover:bg-gray-100"
              @click="goLogout"
            >
              <Logout :size="20" class="shrink-0 text-gray-600" />
              ออกจากระบบ
            </button>
          </div>
        </Transition>
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
