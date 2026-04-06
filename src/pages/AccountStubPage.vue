<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import { UserIcon, List, History, Pencil, TagIcon } from "../components/icons";
import UserBox from "../components/UserBox.vue";
import ServiceOrderCard from "../components/ServiceOrderCard.vue";
import EditProfileForm from "../components/profile/EditProfileForm.vue";
import ResetPasswordForm from "../components/profile/ResetPasswordForm.vue";
const route = useRoute();

const title = computed(() => String(route.meta.title ?? ""));
const sidebarItems = [
  {
    icon: UserIcon,
    label: "ข้อมูลผู้ใช้งาน",
    path: "/profile",
  },
  {
    icon: TagIcon,
    label: "ข้อมูลที่อยู่",
    path: "/address",
  },
  {
    icon: List,
    label: "รายการคำสั่งซ่อม",
    path: "/repair-orders",
  },
  {
    icon: History,
    label: "ประวัติการซ่อม",
    path: "/repair-history",
  },
  {
    icon: Pencil,
    label: "เปลี่ยนรหัสผ่าน",
    path: "/reset-password",
  },
];
const sidebarclass =
  "flex flex-row gap-1 items-center style-body-2 py-3 text-gray-900 hover:text-blue-600 cursor-pointer";
</script>

<template>
  <MainWithNarbar>
    <div
      class="flex flex-col items-center bg-blue-600 justify-center px-4 py-8 md:px-12"
    >
      <h1 class="style-headline-1 text-white">{{ title }}</h1>
    </div>
    <section>
      <div
        class="flex xl:flex-row flex-col pb-12 md:px-40 lg:px-40 xl:px-40 xl:pt-6 xl:pb-20 2xl:px-40 3xl:px-80 justify-center gap-9 w-full mx-auto"
      >
        <UserBox :sidebar-items="sidebarItems" :sidebar-class="sidebarclass" />
        <div class="flex flex-col gap-4 flex-1 mx-4 xl:mx-0">
          <template v-if="route.path === '/profile'">
            <EditProfileForm />
          </template>
          <template v-else-if="route.path === '/repair-orders'">
            <ServiceOrderCard
              orderId="AD04071205"
              status="pending"
              statusLabel="รอดำเนินการ"
              date="25/04/63 เวลา 13.00 น."
              staff="สมาน ไมตรี"
              :price="1550"
              :items="['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง']"
            />
            <ServiceOrderCard
              orderId="AD04071205"
              status="completed"
              statusLabel="ดำเนินการเสร็จสิ้น"
              date="25/04/63 เวลา 13.00 น."
              staff="สมาน ไมตรี"
              :price="1550"
              :items="['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง']"
            />
            <ServiceOrderCard
              orderId="AD04071205"
              status="pending"
              statusLabel="รอดำเนินการ"
              date="25/04/63 เวลา 13.00 น."
              staff="สมาน ไมตรี"
              :price="1550"
              :items="['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง']"
            />
          </template>
          <template v-else-if="route.path === '/reset-password'">
            <ResetPasswordForm />
          </template>
        </div>
      </div>
    </section>
  </MainWithNarbar>
</template>
