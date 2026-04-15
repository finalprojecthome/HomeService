<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import ActionButton from "../../../components/ui/ActionButton.vue";
import Icon from "../../../components/ui/Icon.vue";
import { getAdminServiceById, type AdminServiceItem } from "../../../services/AdminService";
import {
  createAdminCategoryNameMap,
  getAllAdminCategories,
} from "../../../services/adminCategoryOptions";
import { formatDate } from "../../../utils/formatDateAdmin";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { showCustomToast } from "../../../utils/toast";

const router = useRouter();
const route = useRoute();

const backIconPath = "M15.75 19.5L8.25 12l7.5-7.5";

const serviceId = computed(() => {
  const rawId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  const parsedId = Number(rawId);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
});

const service = ref<AdminServiceItem | null>(null);
const categoryName = ref("-");
const createdAt = ref("");
const updatedAt = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

function showErrorToast(message: string) {
  showCustomToast({
    variant: "error",
    title: "เกิดข้อผิดพลาด",
    description: message,
  });
}

onMounted(() => {
  void fetchService();
});

function goToServiceList() {
  router.push("/admin/service");
}

function goToEditService() {
  if (serviceId.value === null) {
    return;
  }

  router.push(`/admin/service/${serviceId.value}/edit`);
}

async function fetchService() {
  if (serviceId.value === null) {
    errorMessage.value = "ไม่พบรหัสบริการที่ต้องการดูรายละเอียด";
    showErrorToast(errorMessage.value);
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [serviceResponse, categories] = await Promise.all([
      getAdminServiceById(serviceId.value),
      getAllAdminCategories(),
    ]);

    const categoryNameMap = createAdminCategoryNameMap(categories);

    service.value = serviceResponse;
    categoryName.value = categoryNameMap.get(serviceResponse.categoryId) || "-";
    createdAt.value = formatDate(serviceResponse.createdAt);
    updatedAt.value = formatDate(serviceResponse.updatedAt);
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถโหลดข้อมูลบริการได้");
    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex min-h-screen">
      <aside>
        <AdminSidebar />
      </aside>

      <main class="flex-1 overflow-x-hidden bg-bg-gray">
        <section class="flex min-h-screen flex-col">
          <header
            class="flex flex-col gap-4 bg-white px-[35px] py-[17px] md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isLoading"
                aria-label="Back to service list"
                @click="goToServiceList"
              >
                <Icon :path="backIconPath" class="h-5 w-5" />
              </button>

              <div class="min-w-0">
                <p class="style-body-4 text-gray-700">บริการ</p>
                <h1 class="truncate style-headline-2 text-gray-950">
                  {{ service?.name || "รายละเอียดบริการ" }}
                </h1>
              </div>
            </div>

            <div class="flex justify-end">
              <ActionButton
                class="min-w-[97px] justify-center"
                :disabled="serviceId === null || isLoading"
                @click="goToEditService"
              >
                แก้ไข
              </ActionButton>
            </div>
          </header>

          <div class="flex-1 px-[35px] py-[35px]">
            <div
              class="rounded-[8px] border border-gray-200 bg-white px-[16px] py-[22px] style-shadow"
            >
              <div class="grid gap-[16px] md:grid-cols-[126px_minmax(0,1fr)] md:gap-[18px]">
                <p class="pt-[10px] style-body-5 text-gray-700">ชื่อบริการ</p>
                <p class="pt-[10px] style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : service?.name || "-" }}
                </p>

                <p class="style-body-5 text-gray-700">หมวดหมู่</p>
                <p class="style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : categoryName }}
                </p>

                <p class="style-body-5 text-gray-700">รูปภาพ</p>
                <div>
                  <div
                    v-if="service?.imageUrl"
                    class="w-fit overflow-hidden rounded-[8px] border border-gray-200"
                  >
                    <img
                      :src="service.imageUrl"
                      alt="Service image"
                      class="block h-[180px] w-auto max-w-[360px] object-cover"
                    />
                  </div>
                  <p v-else class="style-body-3 text-gray-500">-</p>
                </div>
              </div>

              <div class="my-6 h-px bg-gray-200" />

              <section class="flex flex-col gap-[40px]">
                <h2 class="style-headline-4 text-gray-950">รายการบริการย่อย</h2>

                <div class="flex flex-col gap-[32px]">
                  <div
                    v-for="subService in service?.subServices || []"
                    :key="subService.subServiceId"
                    class="grid gap-4 rounded-[8px] px-4 py-4 md:grid-cols-3"
                  >
                    <div class="space-y-1">
                      <p class="style-body-5 text-gray-700">ชื่อรายการ</p>
                      <p class="style-body-3 text-gray-900">{{ subService.name }}</p>
                    </div>

                    <div class="space-y-1">
                      <p class="style-body-5 text-gray-700">หน่วยการบริการ</p>
                      <p class="style-body-3 text-gray-900">{{ subService.unit }}</p>
                    </div>

                    <div class="space-y-1">
                      <p class="style-body-5 text-gray-700">ค่าบริการ / 1 หน่วย</p>
                      <p class="style-body-3 text-gray-900">
                        {{ subService.pricePerUnit.toFixed(2) }}
                      </p>
                    </div>
                  </div>

                  <p
                    v-if="!isLoading && (service?.subServices.length ?? 0) === 0"
                    class="style-body-3 text-gray-500"
                  >
                    ไม่พบบริการย่อย
                  </p>
                </div>
              </section>

              <div class="my-6 h-px bg-gray-200" />

              <div class="grid gap-4 md:grid-cols-[126px_minmax(0,1fr)] md:gap-y-6">
                <p class="style-body-5 text-gray-700">สร้างเมื่อ</p>
                <p class="style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : createdAt || "-" }}
                </p>

                <p class="style-body-5 text-gray-700">แก้ไขล่าสุด</p>
                <p class="style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : updatedAt || "-" }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
