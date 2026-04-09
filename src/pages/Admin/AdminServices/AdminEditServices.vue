<script setup lang="ts">
import type { DropdownOption } from "../../../components/ui/Dropdown.vue";
import type { AxiosError } from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminConfirmDeleteModal from "../../../components/admin/AdminConfirmDeleteModal.vue";
import AdminServiceForm from "../../../components/admin/AdminServiceForm.vue";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import { Bin } from "../../../components/icons";
import ActionButton from "../../../components/ui/ActionButton.vue";
import Icon from "../../../components/ui/Icon.vue";
import {
  deleteAdminService,
  getAdminServiceById,
  updateAdminService,
  type AdminServicePayload,
} from "../../../services/AdminService";
import { apiAdmin } from "../../../services/apiAdmin";
import { getAllAdminCategoryOptions } from "../../../services/adminCategoryOptions";
import {
  createAdminServiceFormSubServiceDraft,
  type AdminServiceFormFieldErrors,
  type AdminServiceFormSubServiceDraft,
} from "../../../types/adminServiceForm";
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

const categoryOptions = ref<DropdownOption[]>([]);
const serviceName = ref("");
const categoryId = ref<number | null>(null);
const existingImageUrl = ref("");
const selectedImageFile = ref<File | null>(null);
const subServices = ref<AdminServiceFormSubServiceDraft[]>([
  createAdminServiceFormSubServiceDraft(),
]);
const createdAt = ref("");
const updatedAt = ref("");
const initialServiceName = ref("");
const fieldErrors = ref<AdminServiceFormFieldErrors>({
  subServices: {},
});
const errorMessage = ref("");
const isLoading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isRemovingSubService = ref(false);
const isDeleteModalOpen = ref(false);
const requiresForceDelete = ref(false);
const deleteModalErrorMessage = ref("");
const isCancelConfirmModalOpen = ref(false);
const isRemoveSubServiceModalOpen = ref(false);
const pendingRemoveSubService = ref<AdminServiceFormSubServiceDraft | null>(null);
const initialSnapshot = ref("");

function showErrorToast(message: string) {
  showCustomToast({
    variant: "error",
    title: "เกิดข้อผิดพลาด",
    description: message,
  });
}

const isBusy = computed(
  () =>
    isLoading.value ||
    isSubmitting.value ||
    isDeleting.value ||
    isRemovingSubService.value,
);
const canDelete = computed(() => serviceId.value !== null && !isLoading.value);
const canSubmit = computed(
  () =>
    serviceId.value !== null &&
    !isLoading.value &&
    !isSubmitting.value &&
    !isDeleting.value &&
    serializeFormState() !== initialSnapshot.value,
);

watch([serviceName, categoryId, subServices], () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
}, { deep: true });

onMounted(() => {
  void fetchPageData();
});

function serializeFormState() {
  return JSON.stringify({
    serviceName: serviceName.value.trim(),
    categoryId: categoryId.value,
    existingImageUrl: existingImageUrl.value,
    selectedImageFileName: selectedImageFile.value?.name || "",
    subServices: subServices.value.map((row) => ({
      subServiceId: row.subServiceId,
      name: row.name.trim(),
      unit: row.unit.trim(),
      pricePerUnit: row.pricePerUnit.trim(),
    })),
  });
}

function resetFieldErrors() {
  fieldErrors.value = {
    subServices: {},
  };
}

function removeSubServiceFromInitialSnapshot(subServiceId: number) {
  const snapshot = JSON.parse(initialSnapshot.value) as {
    serviceName: string;
    categoryId: number | null;
    existingImageUrl: string;
    selectedImageFileName: string;
    subServices: Array<{
      subServiceId: number | null;
      name: string;
      unit: string;
      pricePerUnit: string;
    }>;
  };

  snapshot.subServices = snapshot.subServices.filter(
    (row) => row.subServiceId !== subServiceId,
  );
  initialSnapshot.value = JSON.stringify(snapshot);
}

function goToServiceList() {
  router.push("/admin/service");
}

async function fetchPageData() {
  if (serviceId.value === null) {
    errorMessage.value = "ไม่พบบริการที่ต้องการแก้ไข";
    showErrorToast(errorMessage.value);
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [service, categories] = await Promise.all([
      getAdminServiceById(serviceId.value),
      getAllAdminCategoryOptions(),
    ]);

    categoryOptions.value = categories;
    serviceName.value = service.name;
    initialServiceName.value = service.name;
    categoryId.value = service.categoryId;
    existingImageUrl.value = service.imageUrl || "";
    selectedImageFile.value = null;
    subServices.value =
      service.subServices.length > 0
        ? service.subServices.map((subService) =>
            createAdminServiceFormSubServiceDraft({
              subServiceId: subService.subServiceId,
              name: subService.name,
              unit: subService.unit,
              pricePerUnit: String(subService.pricePerUnit),
            }),
          )
        : [createAdminServiceFormSubServiceDraft()];
    createdAt.value = formatDate(service.createdAt);
    updatedAt.value = formatDate(service.updatedAt);
    initialSnapshot.value = serializeFormState();
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถโหลดข้อมูลบริการได้");
    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isLoading.value = false;
  }
}

function openCancelFlow() {
  if (isBusy.value) {
    return;
  }

  if (serializeFormState() === initialSnapshot.value) {
    goToServiceList();
    return;
  }

  isCancelConfirmModalOpen.value = true;
}

function closeCancelModal() {
  isCancelConfirmModalOpen.value = false;
}

function requestRemoveSubService(row: AdminServiceFormSubServiceDraft) {
  if (isBusy.value) {
    return;
  }

  pendingRemoveSubService.value = row;
  isRemoveSubServiceModalOpen.value = true;
}

function closeRemoveSubServiceModal() {
  isRemoveSubServiceModalOpen.value = false;
  pendingRemoveSubService.value = null;
}

async function confirmRemoveSubService() {
  const row = pendingRemoveSubService.value;
  if (!row) {
    return;
  }

  if (row.subServiceId !== null && serviceId.value !== null) {
    try {
      isRemovingSubService.value = true;
      await apiAdmin.delete(
        `/api/admin/services/${serviceId.value}/sub-services/${row.subServiceId}`,
      );
      removeSubServiceFromInitialSnapshot(row.subServiceId);
    } catch (error) {
      const apiMessage = getApiErrorMessage(
        error,
        "ไม่สามารถลบรายการบริการย่อยได้",
      );
      showErrorToast(apiMessage);
      closeRemoveSubServiceModal();
      return;
    } finally {
      isRemovingSubService.value = false;
    }
  }

  subServices.value = subServices.value.filter((item) => item.key !== row.key);
  closeRemoveSubServiceModal();
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

function validateForm() {
  const nextErrors: AdminServiceFormFieldErrors = {
    subServices: {},
  };
  let isValid = true;

  if (!serviceName.value.trim()) {
    nextErrors.serviceName = "กรุณากรอกชื่อบริการ";
    isValid = false;
  }

  if (categoryId.value === null) {
    nextErrors.categoryId = "กรุณาเลือกหมวดหมู่";
    isValid = false;
  }

  if (subServices.value.length === 0) {
    errorMessage.value = "กรุณาเพิ่มรายการบริการย่อยอย่างน้อย 1 รายการ";
    showErrorToast(errorMessage.value);
    isValid = false;
  }

  subServices.value.forEach((row) => {
    const rowErrors: AdminServiceFormFieldErrors["subServices"][string] = {};
    const parsedPrice = Number(row.pricePerUnit);

    if (!row.name.trim()) {
      rowErrors.name = "กรุณากรอกชื่อรายการ";
      isValid = false;
    }

    if (!row.unit.trim()) {
      rowErrors.unit = "กรุณากรอกหน่วยบริการ";
      isValid = false;
    }

    if (!row.pricePerUnit.trim()) {
      rowErrors.pricePerUnit = "กรุณากรอกค่าบริการ";
      isValid = false;
    } else if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      rowErrors.pricePerUnit = "กรุณากรอกค่าบริการให้ถูกต้อง";
      isValid = false;
    }

    if (Object.keys(rowErrors).length > 0) {
      nextErrors.subServices[row.key] = rowErrors;
    }
  });

  fieldErrors.value = nextErrors;
  return isValid;
}

function buildPayload(): AdminServicePayload {
  return {
    categoryId: categoryId.value as number,
    name: serviceName.value.trim(),
    imageUrl: existingImageUrl.value || "",
    subServices: subServices.value.map((row) => ({
      subServiceId: row.subServiceId ?? undefined,
      name: row.name.trim(),
      unit: row.unit.trim(),
      pricePerUnit: Number(row.pricePerUnit),
    })),
  };
}

async function handleSubmit() {
  if (isBusy.value || serviceId.value === null) {
    return;
  }

  resetFieldErrors();
  errorMessage.value = "";

  if (!validateForm() || !canSubmit.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await updateAdminService(serviceId.value, buildPayload());
    goToServiceList();
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถบันทึกข้อมูลบริการได้");

    if (apiMessage === "Service name already exists in this category") {
      showCustomToast({
        variant: "error",
        title: "เกิดข้อผิดพลาด",
        description: `ชื่อบริการ '${serviceName.value.trim()}' ถูกใช้งานในหมวดหมู่นี้แล้ว`,
      });
      return;
    }

    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteService() {
  if (serviceId.value === null || isDeleting.value) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = "";
  deleteModalErrorMessage.value = "";

  try {
    await deleteAdminService(serviceId.value, requiresForceDelete.value);
    closeDeleteModal();
    goToServiceList();
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
                aria-label="Back to service list"
                @click="goToServiceList"
              >
                <Icon :path="backIconPath" class="h-5 w-5" />
              </button>

              <div class="min-w-0">
                <p class="style-body-4 text-gray-500">บริการ</p>
                <h1 class="truncate style-headline-3 text-gray-950">
                  {{ initialServiceName || "แก้ไขบริการ" }}
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
            <AdminServiceForm
              :service-name="serviceName"
              :category-id="categoryId"
              :category-options="categoryOptions"
              :selected-image-file="selectedImageFile"
              :existing-image-url="existingImageUrl"
              :sub-services="subServices"
              :field-errors="fieldErrors"
              :disabled="isBusy"
              :show-metadata="true"
              :created-at="createdAt"
              :updated-at="updatedAt"
              :confirm-filled-sub-service-removal="true"
              sub-service-layout="edit"
              @update:service-name="serviceName = $event"
              @update:category-id="categoryId = $event"
              @update:selected-image-file="selectedImageFile = $event"
              @update:sub-services="subServices = $event"
              @request:remove-sub-service="requestRemoveSubService"
            />

            <div class="mt-6 flex justify-end">
              <button
                type="button"
                class="style-button flex cursor-pointer items-center gap-2 text-gray-600 transition-colors hover:text-red disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!canDelete || isSubmitting || isDeleting"
                @click="openDeleteModal"
              >
                <component :is="Bin" class="h-[24px] w-[24px]" />
                <span>ลบบริการ</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <AdminConfirmDeleteModal
      v-model="isDeleteModalOpen"
      :item-name="initialServiceName || serviceName"
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

    <Modal
      v-model="isRemoveSubServiceModalOpen"
      title="ยืนยันการลบรายการย่อย"
      :message="`คุณต้องการลบรายการย่อย \`${pendingRemoveSubService?.name || '-'}\` ใช่หรือไม่`"
      confirm-text="ลบรายการ"
      cancel-text="ยกเลิก"
      @confirm="confirmRemoveSubService"
      @cancel="closeRemoveSubServiceModal"
    />

    <Modal
      v-model="isCancelConfirmModalOpen"
      title="ยืนยันการยกเลิก"
      message="มีข้อมูลบริการอยู่ในฟอร์ม ต้องการยกเลิกและกลับไปหน้ารายการหรือไม่"
      confirm-text="ยืนยันยกเลิก"
      cancel-text="อยู่ต่อ"
      @confirm="goToServiceList"
      @cancel="closeCancelModal"
    />
  </div>
</template>