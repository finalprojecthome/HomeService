<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { Toaster } from "vue-sonner";
import { useAuthStore } from "./stores";
import { showCustomToast } from "./utils/toast";

const authStore = useAuthStore();
const route = useRoute();

onMounted(async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      await authStore.getUser();
      if (route.name === "home") {
        showCustomToast({
          title: "ยินดีต้อนรับกลับ",
          description: `ดีใจที่ได้เจอคุณอีกครั้ง${
            authStore.user?.name ? `คุณ ${authStore.user.name}` : ""
          }`,
        });
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      showCustomToast({
        variant: "error",
        title: "เกิดข้อผิดพลาด",
        description: authStore.error || "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
      });
    }
  }
});
</script>

<template>
  <Toaster />
  <router-view />
</template>
