<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import { Bin } from "../../../components/icons";
import ActionButton from "../../../components/ui/ActionButton.vue";
import Icon from "../../../components/ui/Icon.vue";
import TextInput from "../../../components/ui/TextInput.vue";
import {
  deleteAdminCategory,
  getAdminCategoryById,
  updateAdminCategory,
} from "../../../services/AdminCategory";
import { formatDate } from "../../../utils/formatDateAdmin";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

const router = useRouter();
const route = useRoute();

const backIconPath = "M15.75 19.5L8.25 12l7.5-7.5";

// ===== Route Context =====
// Responsibility: edit a single category identified by the current route param.
const categoryId = computed(() => {
  const rawId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  const parsedId = Number(rawId);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
});

const categoryName = ref("");
const initialCategoryName = ref("");
const createdAt = ref("");
const updatedAt = ref("");
const fieldError = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isDeleteModalOpen = ref(false);
const isCancelConfirmModalOpen = ref(false);

const trimmedCategoryName = computed(() => categoryName.value.trim());
const isFormDirty = computed(
  () => trimmedCategoryName.value !== initialCategoryName.value,
);
const isBusy = computed(
  () => isLoading.value || isSubmitting.value || isDeleting.value,
);
const canDelete = computed(() => categoryId.value !== null && !isLoading.value);

watch(categoryName, () => {
  if (fieldError.value) {
    fieldError.value = "";
  }

  if (errorMessage.value) {
    errorMessage.value = "";
  }
});

onMounted(() => {
  void fetchCategory();
});

function goToCategoryList() {
  router.push("/admin/category");
}

// ===== Data Fetching =====
// Responsibility: load the current category before edit and detail metadata rendering.
async function fetchCategory() {
  if (categoryId.value === null) {
    errorMessage.value = "ไม่พบรหัสหมวดหมู่ที่ต้องการแก้ไข";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const category = await getAdminCategoryById(categoryId.value);
    categoryName.value = category.name;
    initialCategoryName.value = category.name;
    createdAt.value = formatDate(category.createdAt);
    updatedAt.value = formatDate(category.updatedAt);
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
  } finally {
    isLoading.value = false;
  }
}

function openCancelFlow() {
  if (isBusy.value) {
    return;
  }

  if (!isFormDirty.value) {
    goToCategoryList();
    return;
  }

  isCancelConfirmModalOpen.value = true;
}

function closeCancelModal() {
  isCancelConfirmModalOpen.value = false;
}

function openDeleteModal() {
  if (!canDelete.value || isSubmitting.value || isDeleting.value) {
    return;
  }

  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
}

/* ================= Submit Flow ================= */
// Business rule: invalid route id and empty category name must block the update request.
async function handleSubmit() {
  if (isBusy.value) {
    return;
  }

  if (categoryId.value === null) {
    errorMessage.value = "ไม่พบรหัสหมวดหมู่ที่ต้องการแก้ไข";
    return;
  }

  fieldError.value = "";
  errorMessage.value = "";

  if (!trimmedCategoryName.value) {
    fieldError.value = "กรุณากรอกชื่อหมวดหมู่";
    return;
  }

  isSubmitting.value = true;

  try {
    await updateAdminCategory(categoryId.value, {
      name: trimmedCategoryName.value,
    });
    goToCategoryList();
  } catch (error) {
    errorMessage.value = getApiErrorMessage(
      error,
      "ไม่สามารถบันทึกข้อมูลหมวดหมู่ได้",
    );
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteCategory() {
  if (categoryId.value === null || isDeleting.value) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = "";

  try {
    await deleteAdminCategory(categoryId.value);
    goToCategoryList();
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "ไม่สามารถลบหมวดหมู่ได้");
    isDeleteModalOpen.value = false;
  } finally {
    isDeleting.value = false;
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
            class="flex flex-col gap-4 px-[35px] py-[17px] bg-white md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isBusy"
                aria-label="Back to category list"
                @click="goToCategoryList"
              >
                <Icon :path="backIconPath" class="w-5 h-5" />
              </button>

              <div class="min-w-0">
                <p class="style-body-4 text-gray-500">หมวดหมู่</p>
                <h1 class="style-headline-3 truncate text-gray-950">
                  {{ initialCategoryName || "แก้ไขหมวดหมู่" }}
                </h1>
              </div>
            </div>

            <div class="flex items-center justify-end gap-[14px]">
              <ActionButton
                variant="secondary"
                class="justify-center min-w-[97px]"
                :disabled="isBusy"
                @click="openCancelFlow"
              >
                ยกเลิก
              </ActionButton>

              <ActionButton
                class="justify-center min-w-[97px]"
                :disabled="isBusy"
                @click="handleSubmit"
              >
                ยืนยัน
              </ActionButton>
            </div>
          </header>

          <form class="flex-1 px-[35px] py-[35px]" @submit.prevent="handleSubmit">
            <p v-if="errorMessage" class="mb-4 style-body-2 text-red">
              {{ errorMessage }}
            </p>

            <div
              class="rounded-[8px] border border-gray-200 bg-white px-[16px] py-[22px] style-shadow"
            >
              <div
                class="grid items-start gap-[16px] md:grid-cols-[126px_minmax(0,272px)] md:gap-[18px]"
              >
                <div class="pt-[10px]">
                  <p class="style-body-5 text-gray-700">
                    ชื่อหมวดหมู่<span class="text-red">*</span>
                  </p>
                </div>

                <TextInput
                  v-model="categoryName"
                  name="admin-category-name"
                  :disabled="isBusy || categoryId === null"
                  :error="fieldError || null"
                />
              </div>

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

            <div class="mt-6 flex justify-end">
              <button
                type="button"
                class="flex items-center gap-2 cursor-pointer style-button text-gray-600 transition-colors hover:text-red disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!canDelete || isSubmitting || isDeleting"
                @click="openDeleteModal"
              >
                <component :is="Bin" class="w-[24px] h-[24px]" />
                <span>ลบหมวดหมู่</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <Modal
      v-model="isDeleteModalOpen"
      :item-name="`'${initialCategoryName || trimmedCategoryName}'`"
      title="ยืนยันการลบรายการ?"
      confirm-text="ลบรายการ"
      cancel-text="ยกเลิก"
      @confirm="deleteCategory"
      @cancel="closeDeleteModal"
    />

    <Modal
      v-model="isCancelConfirmModalOpen"
      title="ยืนยันการยกเลิก"
      message="มีข้อมูลชื่อหมวดหมู่อยู่ในฟอร์ม\nต้องการยกเลิกและกลับไปหน้ารายการหรือไม่"
      confirm-text="ยืนยันยกเลิก"
      cancel-text="อยู่ต่อ"
      @confirm="goToCategoryList"
      @cancel="closeCancelModal"
    />
  </div>
</template>
