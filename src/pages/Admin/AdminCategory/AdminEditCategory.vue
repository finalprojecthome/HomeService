<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import AdminConfirmDeleteModal from "../../../components/admin/AdminConfirmDeleteModal.vue";
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
import { showCustomToast } from "../../../utils/toast";

const router = useRouter();
const route = useRoute();

const backIconPath = "M15.75 19.5L8.25 12l7.5-7.5";

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
const requiresForceDelete = ref(false);
const deleteModalErrorMessage = ref("");
const isCancelConfirmModalOpen = ref(false);

const trimmedCategoryName = computed(() => categoryName.value.trim());
const isFormDirty = computed(
  () => trimmedCategoryName.value !== initialCategoryName.value,
);
const isBusy = computed(
  () => isLoading.value || isSubmitting.value || isDeleting.value,
);
const canDelete = computed(() => categoryId.value !== null && !isLoading.value);
const canSubmit = computed(
  () =>
    categoryId.value !== null &&
    !isLoading.value &&
    !isSubmitting.value &&
    !isDeleting.value &&
    isFormDirty.value,
);

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

  requiresForceDelete.value = false;
  deleteModalErrorMessage.value = "";
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  requiresForceDelete.value = false;
  deleteModalErrorMessage.value = "";
}

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

  if (!isFormDirty.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await updateAdminCategory(categoryId.value, {
      name: trimmedCategoryName.value,
    });
    goToCategoryList();
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถบันทึกข้อมูลหมวดหมู่ได้");

    if (apiMessage === "Category name already exists") {
      showCustomToast({
        variant: "error",
        title: "เกิดข้อผิดพลาด",
        description: `ชื่อหมวดหมู่ ${trimmedCategoryName.value} มีการใช้ในระบบแล้ว`,
      });
      return;
    }

    errorMessage.value = apiMessage;
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
  deleteModalErrorMessage.value = "";

  try {
    await deleteAdminCategory(categoryId.value, requiresForceDelete.value);
    goToCategoryList();
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถลบหมวดหมู่ได้");

    if (
      axiosError.response?.status === 409 &&
      apiMessage === "Category cannot be deleted because it is in use"
    ) {
      requiresForceDelete.value = true;
      return;
    }

    errorMessage.value = apiMessage;
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
            class="flex flex-col gap-4 bg-white px-[35px] py-[17px] md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isBusy"
                aria-label="Back to category list"
                @click="goToCategoryList"
              >
                <Icon :path="backIconPath" class="h-5 w-5" />
              </button>

              <div class="min-w-0">
                <p class="style-body-4 text-gray-500">หมวดหมู่</p>
                <h1 class="truncate style-headline-3 text-gray-950">
                  {{ initialCategoryName || "แก้ไขหมวดหมู่" }}
                </h1>
              </div>
            </div>

            <div class="flex items-center justify-end gap-[14px]">
              <ActionButton
                variant="secondary"
                class="min-w-[97px] justify-center"
                :disabled="isBusy"
                @click="openCancelFlow"
              >
                ยกเลิก
              </ActionButton>

              <ActionButton
                class="min-w-[97px] justify-center"
                :disabled="!canSubmit"
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
                class="style-button flex cursor-pointer items-center gap-2 text-gray-600 transition-colors hover:text-red disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!canDelete || isSubmitting || isDeleting"
                @click="openDeleteModal"
              >
                <component :is="Bin" class="h-[24px] w-[24px]" />
                <span>ลบหมวดหมู่</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <AdminConfirmDeleteModal
      v-model="isDeleteModalOpen"
      :item-name="initialCategoryName || trimmedCategoryName"
      title="ยืนยันการลบหมวดหมู่"
      simple-message-template="คุณต้องการลบหมวดหมู่ {itemName} ใช่หรือไม่"
      force-message-template="บริการในหมวด {itemName} กำลังถูกใช้งานอยู่ การลบครั้งนี้จะลบบริการที่อยู่ในหมวดนี้ทั้งหมด
เพื่อยืนยัน กรุณาพิมพ์ชื่อหมวด {itemName} ลงด้านล่าง"
      confirm-text="ลบรายการ"
      force-confirm-text="ลบหมวดและบริการทั้งหมด"
      typed-placeholder-template="พิมพ์ชื่อหมวด {itemName}"
      typed-mismatch-message="ชื่อหมวดไม่ถูกต้อง"
      :requires-typed-confirmation="requiresForceDelete"
      :is-submitting="isDeleting"
      :error-message="deleteModalErrorMessage"
      @confirm="deleteCategory"
      @cancel="closeDeleteModal"
    />

    <Modal
      v-model="isCancelConfirmModalOpen"
      title="ยืนยันการยกเลิก"
      message="มีข้อมูลชื่อหมวดหมู่อยู่ในฟอร์ม ต้องการยกเลิกและกลับไปหน้ารายการหรือไม่"
      confirm-text="ยืนยันยกเลิก"
      cancel-text="อยู่ต่อ"
      @confirm="goToCategoryList"
      @cancel="closeCancelModal"
    />
  </div>
</template>
