<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import { UserIcon, List, History } from "../components/icons";
import UserBox from "../components/UserBox.vue";
import ServiceOrderCard from "../components/ServiceOrderCard.vue";
import PaginationControls from "../components/ui/PaginationControls.vue";
import {
  fetchRepairOrdersPage,
  REPAIR_ORDERS_PAGE_SIZE_DEFAULT,
} from "../services/api/repairOrders";
import type { OrderStatus } from "../components/ServiceOrderCard.vue";
import type { RepairOrder, SpringPage } from "../types/repairOrder";

const route = useRoute();

const title = computed(() => String(route.meta.title ?? ""));
const sidebarItems = [
  {
    icon: UserIcon,
    label: "ข้อมูลผู้ใช้งาน",
    path: "/profile",
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
];
const sidebarclass =
  "flex flex-col xl:flex-row gap-3 items-center style-body-2 py-3 text-gray-900 hover:text-blue-600 cursor-pointer";

const page = ref(0);
const ordersPage = ref<SpringPage<RepairOrder> | null>(null);
const loading = ref(false);
const fetchError = ref<string | null>(null);

function statusesForPath(path: string): OrderStatus[] | null {
  if (path === "/repair-orders") return ["pending", "in-progress"];
  if (path === "/repair-history") return ["completed", "canceled"];
  return null;
}

const isOrdersListRoute = computed(
  () =>
    route.path === "/repair-orders" || route.path === "/repair-history",
);

async function loadOrders() {
  const statuses = statusesForPath(route.path);
  if (!statuses) {
    ordersPage.value = null;
    return;
  }
  loading.value = true;
  fetchError.value = null;
  try {
    ordersPage.value = await fetchRepairOrdersPage({
      statuses,
      page: page.value,
      size: REPAIR_ORDERS_PAGE_SIZE_DEFAULT,
    });
  } catch (e) {
    ordersPage.value = null;
    fetchError.value =
      e instanceof Error ? e.message : "โหลดข้อมูลไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.path,
  (path, prevPath) => {
    if (path !== prevPath) page.value = 0;
  },
);

watch([() => route.path, page], () => {
  void loadOrders();
}, { immediate: true });
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
        class="flex xl:flex-row flex-col px-4 md:px-40 lg:px-40 xl:px-40 2xl:px-40 3xl:px-80 py-7 justify-center gap-9 w-full mx-auto"
      >
        <UserBox :sidebar-items="sidebarItems" :sidebar-class="sidebarclass" />
        <div class="flex flex-col gap-4 flex-1">
          <template v-if="isOrdersListRoute">
            <div
              v-if="loading"
              class="text-gray-600 style-body-2"
            >
              กำลังโหลดรายการ…
            </div>
            <div
              v-else-if="fetchError"
              class="text-red-600 style-body-2"
            >
              {{ fetchError }}
            </div>
            <template v-else>
              <template v-if="ordersPage?.content.length">
                <ServiceOrderCard
                  v-for="(order, index) in ordersPage.content"
                  :key="`${order.orderId}-${index}`"
                  v-bind="order"
                />
              </template>
              <div
                v-else
                class="text-gray-600 style-body-2"
              >
                ไม่มีรายการในหน้านี้
              </div>

              <PaginationControls
                v-if="ordersPage"
                v-model:page-index="page"
                :total-pages="ordersPage.totalPages"
                :loading="loading"
              />
            </template>
          </template>

          <template v-else>
            <div class="text-gray-600 style-body-2">
              ยังไม่มีข้อมูลสำหรับหน้านี้
            </div>
          </template>
        </div>
      </div>
    </section>
  </MainWithNarbar>
</template>
