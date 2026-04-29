<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import { UserIcon, List, History, Pencil, MapIcon } from "../components/icons";
import UserBox from "../components/UserBox.vue";
import ServiceOrderCard from "../components/ServiceOrderCard.vue";
import ServiceOrderCardSkeleton from "../components/ServiceOrderCardSkeleton.vue";
import EditProfileForm from "../components/profile/EditProfileForm.vue";
import ResetPasswordForm from "../components/profile/ResetPasswordForm.vue";
import AddressList from "../components/profile/AddressList.vue";
import AddressForm from "../components/profile/AddressForm.vue";
import { mapOrderSummaryToCardFields } from "../utils/serviceOrderCardFromApi";
import { useCustomerOrdersStore } from "../stores";

const route = useRoute();
const ordersStore = useCustomerOrdersStore();

const activeOrdersView = computed(() => ordersStore.activeOrders ?? []);
const completedOrdersView = computed(() => ordersStore.completedOrders ?? []);

watch(
  () => route.name,
  (name) => {
    if (name === "repairOrders") {
      void ordersStore.ensureActiveLoaded();
    } else if (name === "repairHistory") {
      void ordersStore.ensureCompletedLoaded();
    }
  },
  { immediate: true },
);

const title = computed(() => String(route.meta.title ?? ""));
const sidebarItems = [
  {
    icon: UserIcon,
    label: "ข้อมูลผู้ใช้งาน",
    path: "/profile",
  },
  {
    icon: MapIcon,
    label: "\u0e17\u0e35\u0e48\u0e2d\u0e22\u0e39\u0e48\u0e02\u0e2d\u0e07\u0e09\u0e31\u0e19",
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
          <template v-else-if="route.path.startsWith('/address')">
            <AddressList v-if="route.path === '/address'" />
            <AddressForm mode="add" v-else-if="route.path === '/address/add'" />
            <AddressForm mode="edit" v-else />
          </template>
          <template v-else-if="route.path === '/repair-orders'">
            <template v-if="ordersStore.loadingActive">
              <ServiceOrderCardSkeleton v-for="n in 2" :key="'order-skel-' + n" />
            </template>
            <p
              v-else-if="ordersStore.errorActive"
              class="style-body-2 text-red-600 py-4"
            >
              {{ ordersStore.errorActive }}
            </p>
            <p
              v-else-if="activeOrdersView.length === 0"
              class="style-body-2 text-gray-600 py-4"
            >
              ยังไม่มีรายการคำสั่งซ่อม
            </p>
            <template v-else>
              <ServiceOrderCard
                v-for="order in activeOrdersView"
                :key="order.id"
                v-bind="mapOrderSummaryToCardFields(order)"
              />
            </template>
          </template>
          <template v-else-if="route.path === '/repair-history'">
            <template v-if="ordersStore.loadingCompleted">
              <ServiceOrderCardSkeleton v-for="n in 2" :key="'hist-skel-' + n" />
            </template>
            <p
              v-else-if="ordersStore.errorCompleted"
              class="style-body-2 text-red-600 py-4"
            >
              {{ ordersStore.errorCompleted }}
            </p>
            <p
              v-else-if="completedOrdersView.length === 0"
              class="style-body-2 text-gray-600 py-4"
            >
              ยังไม่มีประวัติการซ่อม
            </p>
            <template v-else>
              <ServiceOrderCard
                v-for="order in completedOrdersView"
                :key="order.id"
                v-bind="mapOrderSummaryToCardFields(order)"
              />
            </template>
          </template>
          <template v-else-if="route.path === '/reset-password'">
            <ResetPasswordForm />
          </template>
        </div>
      </div>
    </section>
  </MainWithNarbar>
</template>
