<script setup lang="ts">
import { useRouter } from "vue-router";
import Sidebar from "../Sidebar.vue";
import { categoryIcon, Logout, promotionCodeIcon, serviceIcon } from "../icons";
import { clearAdminAccessToken } from "../../services/adminAuth";

const router = useRouter();

const navLinks = [
  {
    id: "category",
    title: "หมวดหมู่",
    icon: categoryIcon,
    path: "/admin/category",
  },
  {
    id: "service",
    title: "บริการ",
    icon: serviceIcon,
    path: "/admin/service",
  },
  {
    id: "promotion",
    title: "Promotion Code",
    icon: promotionCodeIcon,
    path: "/admin/promotion",
  },
];

const bottomLink = {
  id: "logout",
  title: "ออกจากระบบ",
  icon: Logout,
  path: "/auth/admin/login",
};

function handleNavigate(link: { path?: string }) {
  if (!link.path) {
    return;
  }

  router.push(link.path);
}

function handleLogout() {
  clearAdminAccessToken();
  router.push(bottomLink.path);
}
</script>

<template>
  <Sidebar
    :links="navLinks"
    :bottom-link="bottomLink"
    width="w-[240px]"
    @click="handleNavigate"
    @logout-click="handleLogout"
  />
</template>
