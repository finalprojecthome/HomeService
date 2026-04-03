<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import ActionButton from "../../../components/ui/ActionButton.vue";
import TextInput from "../../../components/ui/TextInput.vue";
import {
  deleteAdminCategory,
  getAdminCategories,
  reorderAdminCategories,
  type AdminCategoryItem,
} from "../../../services/AdminCategory";
import { Bin, Pencil, SearchIcon } from "../../../components/icons";
import { debounce } from "../../../utils/debounce";
import { formatDate } from "../../../utils/formatDateAdmin";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

type AdminCategoryRow = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const router = useRouter();

// ===== Page State =====
// Responsibility: manage category listing, deletion, and page-level reorder.
const searchKeyword = ref("");
const debouncedSearchKeyword = ref("");
const isDeleteModalOpen = ref(false);
const selectedCategory = ref<AdminCategoryRow | null>(null);
const draggedRowId = ref<number | null>(null);
const dropTargetRowId = ref<number | null>(null);
const categoryRows = ref<AdminCategoryRow[]>([]);
const currentPage = ref(0);
const totalPages = ref(0);
const totalItems = ref(0);
const pageSize = ref(10);
const isLoading = ref(false);
const isDeleting = ref(false);
const isReordering = ref(false);
const errorMessage = ref("");

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
  void fetchCategories();
});

onMounted(() => {
  void fetchCategories();
});

// ===== Data Fetching =====
// Responsibility: retrieve category data by current search keyword and page.
async function fetchCategories() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await getAdminCategories({
      search: debouncedSearchKeyword.value,
      page: currentPage.value,
    });

    categoryRows.value = response.items.map(mapCategoryRow);
    currentPage.value = response.page;
    totalPages.value = response.totalPages;
    totalItems.value = response.totalItems;
    pageSize.value = response.size;
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "ไม่สามารถโหลดหมวดหมู่ได้",
    );
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(row: AdminCategoryRow) {
  selectedCategory.value = row;
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  selectedCategory.value = null;
}

async function deleteCategory() {
  if (!selectedCategory.value) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = "";

  try {
    await deleteAdminCategory(selectedCategory.value.id);

    if (categoryRows.value.length === 1 && currentPage.value > 0) {
      currentPage.value -= 1;
    }

    closeDeleteModal();
    await fetchCategories();
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "ไม่สามารถลบหมวดหมู่ได้");
  } finally {
    isDeleting.value = false;
  }
}

function getDisplayOrder(rowId: number) {
  const index = categoryRows.value.findIndex((row) => row.id === rowId);
  return currentPage.value * pageSize.value + index + 1;
}

function goToCategoryDetail(rowId: number) {
  if (isBusy.value) {
    return;
  }

  router.push(`/admin/category/${rowId}`);
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

/* ================= Reorder Flow ================= */
// Business rule: reorder only the currently visible page, while keeping other pages intact.
async function handleDrop(targetRowId: number) {
  const sourceRowId = draggedRowId.value;

  if (sourceRowId === null || sourceRowId === targetRowId) {
    dropTargetRowId.value = null;
    return;
  }

  const nextRows = [...categoryRows.value];
  const sourceIndex = nextRows.findIndex((row) => row.id === sourceRowId);
  const targetIndex = nextRows.findIndex((row) => row.id === targetRowId);

  if (sourceIndex === -1 || targetIndex === -1) {
    handleDragEnd();
    return;
  }

  const [movedRow] = nextRows.splice(sourceIndex, 1);
  nextRows.splice(targetIndex, 0, movedRow);
  categoryRows.value = nextRows;

  try {
    isReordering.value = true;
    errorMessage.value = "";

    await reorderAdminCategories({
      scope: "page",
      categoryIds: nextRows.map((row) => row.id),
      search: debouncedSearchKeyword.value.trim() || undefined,
      page: currentPage.value,
    });

    await fetchCategories();
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "ไม่สามารถจัดลำดับหมวดหมู่ได้",
    );
    await fetchCategories();
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
  void fetchCategories();
}

function goToNextPage() {
  if (currentPage.value + 1 >= totalPages.value || isLoading.value) {
    return;
  }

  currentPage.value += 1;
  void fetchCategories();
}

function mapCategoryRow(category: AdminCategoryItem): AdminCategoryRow {
  return {
    id: category.categoryId,
    name: category.name,
    createdAt: formatDate(category.createdAt),
    updatedAt: formatDate(category.updatedAt),
  };
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
            class="flex items-center justify-between px-[35px] py-[17px] bg-white"
          >
            <h1 class="style-headline-2 text-gray-950">หมวดหมู่</h1>

            <div class="flex items-center justify-end gap-[24px]">
              <div class="relative w-full md:w-[320px]">
                <TextInput
                  v-model="searchKeyword"
                  name="admin-category-search"
                  placeholder="ค้นหาหมวดหมู่..."
                  class="pl-11"
                />
                <SearchIcon
                  class="absolute left-[8px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size="18"
                />
              </div>

              <ActionButton
                class="justify-center min-w-[165px]"
                @click="router.push('/admin/category/add')"
              >
                <span>เพิ่มหมวดหมู่</span>
                <span class="text-lg leading-none">+</span>
              </ActionButton>
            </div>
          </header>

          <div class="flex-1 px-[35px] py-[35px]">
            <p v-if="errorMessage" class="mb-4 style-body-2 text-red">
              {{ errorMessage }}
            </p>

            <div
              class="overflow-hidden rounded-[8px] border border-gray-200 bg-white style-shadow"
            >
              <div class="block">
                <table class="min-w-full border border-gray-200">
                  <thead>
                    <tr class="bg-gray-100 text-gray-700">
                      <th class="w-[44px] px-[8px] py-[8px] text-left"></th>
                      <th
                        class="w-[70px] px-[24px] py-[10px] text-left style-body-3"
                      >
                        ลำดับ
                      </th>
                      <th class="px-[24px] py-[10px] text-left style-body-3">
                        ชื่อหมวดหมู่
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
                      v-for="row in categoryRows"
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
                          <span
                            class="grid grid-cols-2 gap-[3px]"
                            aria-hidden="true"
                          >
                            <span
                              v-for="(_, dotIndex) in dragDots"
                              :key="dotIndex"
                              class="w-[3px] h-[3px] rounded-full bg-current"
                            />
                          </span>
                        </div>
                      </td>
                      <td
                        class="px-[24px] py-[32px] text-center cursor-pointer style-body-2"
                        @click="goToCategoryDetail(row.id)"
                      >
                        {{ getDisplayOrder(row.id) }}
                      </td>
                      <td
                        class="px-[24px] py-[32px] cursor-pointer style-body-2"
                        @click="goToCategoryDetail(row.id)"
                      >
                        {{ row.name }}
                      </td>
                      <td
                        class="px-[24px] py-[32px] cursor-pointer style-body-2"
                        @click="goToCategoryDetail(row.id)"
                      >
                        {{ row.createdAt }}
                      </td>
                      <td
                        class="px-[24px] py-[32px] cursor-pointer style-body-2"
                        @click="goToCategoryDetail(row.id)"
                      >
                        {{ row.updatedAt }}
                      </td>
                      <td class="py-[10px]">
                        <div class="flex items-center justify-center gap-[8px]">
                          <button
                            type="button"
                            class="cursor-pointer text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Delete category"
                            :disabled="isBusy"
                            @click="openDeleteModal(row)"
                          >
                            <component :is="Bin" class="w-[18px] h-[18px]" />
                          </button>
                          <button
                            type="button"
                            class="cursor-pointer text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Edit category"
                            :disabled="isBusy"
                            @click.stop="router.push(`/admin/category/${row.id}/edit`)"
                          >
                            <component :is="Pencil" class="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr v-if="isLoading">
                      <td
                        colspan="6"
                        class="px-[24px] py-[32px] text-center style-body-2 text-gray-500"
                      >
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>

                    <tr v-else-if="categoryRows.length === 0">
                      <td
                        colspan="6"
                        class="px-[24px] py-[32px] text-center style-body-2 text-gray-500"
                      >
                        ไม่พบข้อมูลหมวดหมู่
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
                แสดง {{ categoryRows.length }} จากทั้งหมด {{ totalItems }} รายการ
              </p>

              <div class="flex items-center gap-3">
                <ActionButton
                  variant="secondary"
                  class="justify-center min-w-[110px]"
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
                  class="justify-center min-w-[110px]"
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

    <Modal
      v-model="isDeleteModalOpen"
      :item-name="`'${selectedCategory?.name ?? ''}'`"
      @confirm="deleteCategory"
      @cancel="closeDeleteModal"
    />
  </div>
</template>
