<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AdminConfirmDeleteModal from "../../../components/admin/AdminConfirmDeleteModal.vue";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import { Bin, Pencil, SearchIcon } from "../../../components/icons";
import ActionButton from "../../../components/ui/ActionButton.vue";
import TextInput from "../../../components/ui/TextInput.vue";
import {
  deleteAdminService,
  getAdminServices,
  reorderAdminServices,
  type AdminServiceItem,
} from "../../../services/AdminService";
import {
  createAdminCategoryNameMap,
  getAllAdminCategories,
} from "../../../services/adminCategoryOptions";
import { debounce } from "../../../utils/debounce";
import { formatDate } from "../../../utils/formatDateAdmin";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { showCustomToast } from "../../../utils/toast";

type AdminServiceRow = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

const router = useRouter();

const searchKeyword = ref("");
const debouncedSearchKeyword = ref("");
const isDeleteModalOpen = ref(false);
const requiresForceDelete = ref(false);
const deleteModalErrorMessage = ref("");
const selectedService = ref<AdminServiceRow | null>(null);
const draggedRowId = ref<number | null>(null);
const dropTargetRowId = ref<number | null>(null);
const serviceRows = ref<AdminServiceRow[]>([]);
const currentPage = ref(0);
const totalPages = ref(0);
const totalItems = ref(0);
const pageSize = ref(10);
const isLoading = ref(false);
const isDeleting = ref(false);
const isReordering = ref(false);
const errorMessage = ref("");

function showErrorToast(message: string) {
  showCustomToast({
    variant: "error",
    title: "เกิดข้อผิดพลาด",
    description: message,
  });
}

const dragDots = Array.from({ length: 6 });
const isBusy = computed(
  () => isLoading.value || isDeleting.value || isReordering.value,
);

watch(
  searchKeyword,
  debounce((newVal: string) => {
    debouncedSearchKeyword.value = newVal;
  }, 1000),
);

watch(debouncedSearchKeyword, () => {
  currentPage.value = 0;
  void fetchServices();
});

onMounted(() => {
  void fetchServices();
});

async function fetchServices() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [response, categories] = await Promise.all([
      getAdminServices({
        search: debouncedSearchKeyword.value,
        page: currentPage.value,
      }),
      getAllAdminCategories(),
    ]);

    const categoryNameMap = createAdminCategoryNameMap(categories);

    serviceRows.value = response.items.map((service) =>
      mapServiceRow(service, categoryNameMap),
    );
    currentPage.value = response.page;
    totalPages.value = response.totalPages;
    totalItems.value = response.totalItems;
    pageSize.value = response.size;
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถโหลดข้อมูลบริการได้");
    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isLoading.value = false;
  }
}

function mapServiceRow(
  service: AdminServiceItem,
  categoryNameMap: Map<number, string>,
): AdminServiceRow {
  return {
    id: service.serviceId,
    name: service.name,
    categoryId: service.categoryId,
    categoryName: categoryNameMap.get(service.categoryId) || "-",
    createdAt: formatDate(service.createdAt),
    updatedAt: formatDate(service.updatedAt),
  };
}

function getCategoryBadgeClass(categoryId: number) {
  const palette = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-600",
  ];

  return palette[Math.abs(categoryId) % palette.length];
}

function openDeleteModal(row: AdminServiceRow) {
  selectedService.value = row;
  requiresForceDelete.value = false;
  deleteModalErrorMessage.value = "";
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  selectedService.value = null;
  requiresForceDelete.value = false;
  deleteModalErrorMessage.value = "";
}

async function deleteService() {
  if (!selectedService.value) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = "";
  deleteModalErrorMessage.value = "";

  try {
    await deleteAdminService(selectedService.value.id, requiresForceDelete.value);

    if (serviceRows.value.length === 1 && currentPage.value > 0) {
      currentPage.value -= 1;
    }

    closeDeleteModal();
    await fetchServices();
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถลบบริการได้");

    if (
      axiosError.response?.status === 409 &&
      apiMessage === "Service cannot be deleted because it has sub-services"
    ) {
      requiresForceDelete.value = true;
      return;
    }

    deleteModalErrorMessage.value = apiMessage;
  } finally {
    isDeleting.value = false;
  }
}

function getDisplayOrder(rowId: number) {
  const index = serviceRows.value.findIndex((row) => row.id === rowId);
  return currentPage.value * pageSize.value + index + 1;
}

function goToServiceDetail(rowId: number) {
  if (isBusy.value) {
    return;
  }

  router.push(`/admin/service/${rowId}`);
}

function handleDragStart(rowId: number) {
  if (isBusy.value) {
    return;
  }

  draggedRowId.value = rowId;
}

function handleDragEnter(rowId: number) {
  if (draggedRowId.value === null || draggedRowId.value === rowId) {
    return;
  }

  dropTargetRowId.value = rowId;
}

async function handleDrop(targetRowId: number) {
  const sourceRowId = draggedRowId.value;

  if (sourceRowId === null || sourceRowId === targetRowId) {
    handleDragEnd();
    return;
  }

  const nextRows = [...serviceRows.value];
  const sourceIndex = nextRows.findIndex((row) => row.id === sourceRowId);
  const targetIndex = nextRows.findIndex((row) => row.id === targetRowId);

  if (sourceIndex === -1 || targetIndex === -1) {
    handleDragEnd();
    return;
  }

  const [movedRow] = nextRows.splice(sourceIndex, 1);
  nextRows.splice(targetIndex, 0, movedRow);
  serviceRows.value = nextRows;

  try {
    isReordering.value = true;
    errorMessage.value = "";

    await reorderAdminServices({
      scope: "page",
      serviceIds: nextRows.map((row) => row.id),
      search: debouncedSearchKeyword.value.trim() || undefined,
      page: currentPage.value,
    });

    await fetchServices();
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถจัดลำดับบริการได้");
    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
    await fetchServices();
  } finally {
    isReordering.value = false;
    handleDragEnd();
  }
}

function handleDragEnd() {
  draggedRowId.value = null;
  dropTargetRowId.value = null;
}

function goToPreviousPage() {
  if (currentPage.value <= 0 || isLoading.value) {
    return;
  }

  currentPage.value -= 1;
  void fetchServices();
}

function goToNextPage() {
  if (currentPage.value + 1 >= totalPages.value || isLoading.value) {
    return;
  }

  currentPage.value += 1;
  void fetchServices();
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex min-h-screen">
      <aside>
        <AdminSidebar />
      </aside>

      <main class="flex-1 overflow-x-hidden">
        <section class="flex min-h-screen flex-col">
          <header
            class="flex items-center justify-between bg-white px-[35px] py-[17px]"
          >
            <h1 class="style-headline-2 text-gray-950">บริการ</h1>

            <div class="flex items-center justify-end gap-[24px]">
              <div class="relative w-full md:w-[320px]">
                <TextInput
                  v-model="searchKeyword"
                  name="admin-service-search"
                  placeholder="ค้นหาบริการ..."
                  class="pl-11"
                />
                <SearchIcon
                  class="pointer-events-none absolute left-[8px] top-1/2 -translate-y-1/2 text-gray-400"
                  size="18"
                />
              </div>

              <ActionButton
                class="min-w-[140px] justify-center"
                @click="router.push('/admin/service/add')"
              >
                <span>เพิ่มบริการ</span>
                <span class="text-lg leading-none">+</span>
              </ActionButton>
            </div>
          </header>

          <div class="flex-1 px-[35px] py-[35px]">
            <div
              class="overflow-hidden rounded-[8px] border border-gray-200 bg-white style-shadow"
            >
              <div class="block">
                <table class="min-w-full border border-gray-200">
                  <thead>
                    <tr class="bg-gray-100 text-gray-700">
                      <th class="w-[44px] px-[8px] py-[8px] text-left"></th>
                      <th class="w-[70px] px-[24px] py-[10px] text-left style-body-3">
                        ลำดับ
                      </th>
                      <th class="px-[24px] py-[10px] text-left style-body-3">
                        ชื่อบริการ
                      </th>
                      <th class="px-[24px] py-[10px] text-left style-body-3">
                        หมวดหมู่
                      </th>
                      <th class="px-[24px] py-[10px] text-left style-body-3">
                        สร้างเมื่อ
                      </th>
                      <th class="px-[24px] py-[10px] text-left style-body-3">
                        แก้ไขล่าสุด
                      </th>
                      <th
                        class="w-[112px] px-[24px] py-[10px] text-center style-body-3"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="row in serviceRows"
                      :key="row.id"
                      :draggable="!isBusy"
                      :class="[
                        'border-t border-gray-200 transition-colors',
                        draggedRowId === row.id && 'bg-blue-100/60',
                        dropTargetRowId === row.id && 'bg-gray-100',
                      ]"
                      @dragstart="handleDragStart(row.id)"
                      @dragenter.prevent="handleDragEnter(row.id)"
                      @dragover.prevent
                      @drop.prevent="handleDrop(row.id)"
                      @dragend="handleDragEnd"
                    >
                      <td class="px-[11px] py-[4px]">
                        <div
                          class="flex items-center justify-center text-gray-300"
                          :class="
                            isBusy
                              ? 'cursor-not-allowed'
                              : 'cursor-grab active:cursor-grabbing'
                          "
                          title="ลากเพื่อสลับลำดับ"
                        >
                          <span class="grid grid-cols-2 gap-[3px]" aria-hidden="true">
                            <span
                              v-for="(_, dotIndex) in dragDots"
                              :key="dotIndex"
                              class="h-[3px] w-[3px] rounded-full bg-current"
                            />
                          </span>
                        </div>
                      </td>
                      <td
                        class="cursor-pointer px-[24px] py-[32px] text-center style-body-2"
                        @click="goToServiceDetail(row.id)"
                      >
                        {{ getDisplayOrder(row.id) }}
                      </td>
                      <td
                        class="cursor-pointer px-[24px] py-[32px] style-body-2"
                        @click="goToServiceDetail(row.id)"
                      >
                        {{ row.name }}
                      </td>
                      <td
                        class="cursor-pointer px-[24px] py-[32px] style-body-2"
                        @click="goToServiceDetail(row.id)"
                      >
                        <span
                          class="inline-flex rounded-full px-3 py-1 style-body-4"
                          :class="getCategoryBadgeClass(row.categoryId)"
                        >
                          {{ row.categoryName }}
                        </span>
                      </td>
                      <td
                        class="cursor-pointer px-[24px] py-[32px] style-body-2"
                        @click="goToServiceDetail(row.id)"
                      >
                        {{ row.createdAt }}
                      </td>
                      <td
                        class="cursor-pointer px-[24px] py-[32px] style-body-2"
                        @click="goToServiceDetail(row.id)"
                      >
                        {{ row.updatedAt }}
                      </td>
                      <td class="py-[10px]">
                        <div class="flex items-center justify-center gap-[8px]">
                          <button
                            type="button"
                            class="cursor-pointer text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Delete service"
                            :disabled="isBusy"
                            @click="openDeleteModal(row)"
                          >
                            <component :is="Bin" class="h-[18px] w-[18px]" />
                          </button>
                          <button
                            type="button"
                            class="cursor-pointer text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Edit service"
                            :disabled="isBusy"
                            @click.stop="router.push(`/admin/service/${row.id}/edit`)"
                          >
                            <component :is="Pencil" class="h-[18px] w-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="isLoading">
                      <td
                        colspan="7"
                        class="px-[24px] py-[32px] text-center style-body-2 text-gray-500"
                      >
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>

                    <tr v-else-if="serviceRows.length === 0">
                      <td
                        colspan="7"
                        class="px-[24px] py-[32px] text-center style-body-2 text-gray-500"
                      >
                        ไม่พบบริการ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              class="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <p class="style-body-2 text-gray-600">
                แสดง {{ serviceRows.length }} จากทั้งหมด {{ totalItems }} รายการ
              </p>

              <div class="flex items-center gap-3">
                <ActionButton
                  variant="secondary"
                  class="min-w-[110px] justify-center"
                  :disabled="currentPage === 0 || isLoading"
                  @click="goToPreviousPage"
                >
                  ก่อนหน้า
                </ActionButton>

                <span class="style-body-2 text-gray-700">
                  หน้า {{ currentPage + 1 }} / {{ totalPages || 1 }}
                </span>

                <ActionButton
                  variant="secondary"
                  class="min-w-[110px] justify-center"
                  :disabled="currentPage + 1 >= totalPages || isLoading"
                  @click="goToNextPage"
                >
                  ถัดไป
                </ActionButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <AdminConfirmDeleteModal
      v-model="isDeleteModalOpen"
      :item-name="selectedService?.name ?? ''"
      title="ยืนยันการลบบริการ"
      simple-message-template="คุณต้องการลบรายการ {itemName}
ใช่หรือไม่"
      force-message-template="บริการ {itemName} มีรายการบริการย่อยอยู่ในระบบ การลบครั้งนี้จะลบรายการบริการย่อยทั้งหมดของบริการนี้ด้วย
เพื่อยืนยัน กรุณาพิมพ์ชื่อบริการ {itemName} ลงด้านล่าง"
      confirm-text="ลบรายการ"
      force-confirm-text="ลบบริการและรายการย่อย"
      typed-placeholder-template="พิมพ์ชื่อบริการ {itemName}"
      typed-mismatch-message="ชื่อบริการไม่ถูกต้อง"
      :requires-typed-confirmation="requiresForceDelete"
      :is-submitting="isDeleting"
      :error-message="deleteModalErrorMessage"
      @confirm="deleteService"
      @cancel="closeDeleteModal"
    />
  </div>
</template>
