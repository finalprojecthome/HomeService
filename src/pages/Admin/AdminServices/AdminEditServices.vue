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
  getAdminServiceDeleteImpact,
  getAdminServiceById,
  updateAdminService,
  uploadServiceImage,
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
const isDeleteImpactLoading = ref(false);
const isRemovingSubService = ref(false);
const isDeleteModalOpen = ref(false);
const requiresForceDelete = ref(false);
const deleteModalErrorMessage = ref("");
const isCancelConfirmModalOpen = ref(false);
const isRemoveSubServiceModalOpen = ref(false);
const pendingRemoveSubService = ref<AdminServiceFormSubServiceDraft | null>(
  null,
);
const initialSnapshot = ref("");

function showErrorToast(message: string) {
  showCustomToast({
    variant: "error",
    title: "à¹€à¸à¸´à¸”à¸‚à¹‰à¸­à¸œà¸´à¸”à¸žà¸¥à¸²à¸”",
    description: message,
  });
}

const isBusy = computed(
  () =>
    isLoading.value ||
    isSubmitting.value ||
    isDeleting.value ||
    isDeleteImpactLoading.value ||
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

watch(
  [serviceName, categoryId, subServices],
  () => {
    if (errorMessage.value) {
      errorMessage.value = "";
    }
  },
  { deep: true },
);

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
    errorMessage.value = "à¹„à¸¡à¹ˆà¸žà¸šà¸šà¸£à¸´à¸à¸²à¸£à¸—à¸µà¹ˆà¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚";
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
    const apiMessage = getApiErrorMessage(
      error,
      "à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¹‚à¸«à¸¥à¸”à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸£à¸´à¸à¸²à¸£à¹„à¸”à¹‰",
    );
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
        "à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸šà¸£à¸´à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢à¹„à¸”à¹‰",
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

async function openDeleteModal() {
  if (!canDelete.value || isSubmitting.value || isDeleting.value) {
    return;
  }

  isDeleteImpactLoading.value = true;
  requiresForceDelete.value = false;
  deleteModalErrorMessage.value = "";

  try {
    const impact = await getAdminServiceDeleteImpact(serviceId.value as number);
    requiresForceDelete.value = impact.requiresForceDelete;
    isDeleteModalOpen.value = true;
  } catch (error) {
    const apiMessage = getApiErrorMessage(
      error,
      "à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸•à¸£à¸§à¸ˆà¸ªà¸­à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸à¹ˆà¸­à¸™à¸¥à¸šà¸šà¸£à¸´à¸à¸²à¸£à¹„à¸”à¹‰",
    );
    deleteModalErrorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isDeleteImpactLoading.value = false;
  }
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
    nextErrors.serviceName = "à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸Šà¸·à¹ˆà¸­à¸šà¸£à¸´à¸à¸²à¸£";
    isValid = false;
  }

  if (categoryId.value === null) {
    nextErrors.categoryId = "à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆ";
    isValid = false;
  }

  if (subServices.value.length === 0) {
    errorMessage.value =
      "à¸à¸£à¸¸à¸“à¸²à¹€à¸žà¸´à¹ˆà¸¡à¸£à¸²à¸¢à¸à¸²à¸£à¸šà¸£à¸´à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 1 à¸£à¸²à¸¢à¸à¸²à¸£";
    showErrorToast(errorMessage.value);
    isValid = false;
  }

  subServices.value.forEach((row) => {
    const rowErrors: AdminServiceFormFieldErrors["subServices"][string] = {};
    const parsedPrice = Number(row.pricePerUnit);

    if (!row.name.trim()) {
      rowErrors.name = "à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸Šà¸·à¹ˆà¸­à¸£à¸²à¸¢à¸à¸²à¸£";
      isValid = false;
    }

    if (!row.unit.trim()) {
      rowErrors.unit = "à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸«à¸™à¹ˆà¸§à¸¢à¸šà¸£à¸´à¸à¸²à¸£";
      isValid = false;
    }

    if (!row.pricePerUnit.trim()) {
      rowErrors.pricePerUnit =
        "à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸„à¹ˆà¸²à¸šà¸£à¸´à¸à¸²à¸£";
      isValid = false;
    } else if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      rowErrors.pricePerUnit =
        "à¸à¸£à¸¸à¸“à¸²à¸à¸£à¸­à¸à¸„à¹ˆà¸²à¸šà¸£à¸´à¸à¸²à¸£à¹ƒà¸«à¹‰à¸–à¸¹à¸à¸•à¹‰à¸­à¸‡";
      isValid = false;
    }

    if (Object.keys(rowErrors).length > 0) {
      nextErrors.subServices[row.key] = rowErrors;
    }
  });

  fieldErrors.value = nextErrors;
  return isValid;
}

function buildPayload(imageUrl: string): AdminServicePayload {
  return {
    categoryId: categoryId.value as number,
    name: serviceName.value.trim(),
    imageUrl: imageUrl || null,
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
    let imageUrl = existingImageUrl.value || "";
    if (selectedImageFile.value) {
      imageUrl = await uploadServiceImage(selectedImageFile.value);
    }
    await updateAdminService(serviceId.value, buildPayload(imageUrl));
    goToServiceList();
  } catch (error) {
    const apiMessage = getApiErrorMessage(
      error,
      "à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸šà¸±à¸™à¸—à¸¶à¸à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸£à¸´à¸à¸²à¸£à¹„à¸”à¹‰",
    );

    if (apiMessage === "Service name already exists in this category") {
      showCustomToast({
        variant: "error",
        title: "à¹€à¸à¸´à¸”à¸‚à¹‰à¸­à¸œà¸´à¸”à¸žà¸¥à¸²à¸”",
        description: `à¸Šà¸·à¹ˆà¸­à¸šà¸£à¸´à¸à¸²à¸£ '${serviceName.value.trim()}' à¸–à¸¹à¸à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹ƒà¸™à¸«à¸¡à¸§à¸”à¸«à¸¡à¸¹à¹ˆà¸™à¸µà¹‰à¹à¸¥à¹‰à¸§`,
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
    const apiMessage = getApiErrorMessage(
      error,
      "à¹„à¸¡à¹ˆà¸ªà¸²à¸¡à¸²à¸£à¸–à¸¥à¸šà¸šà¸£à¸´à¸à¸²à¸£à¹„à¸”à¹‰",
    );

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
                <p class="style-body-4 text-gray-500">à¸šà¸£à¸´à¸à¸²à¸£</p>
                <h1 class="truncate style-headline-3 text-gray-950">
                  {{ initialServiceName || "à¹à¸à¹‰à¹„à¸‚à¸šà¸£à¸´à¸à¸²à¸£" }}
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
                à¸¢à¸à¹€à¸¥à¸´à¸
              </ActionButton>

              <ActionButton
                class="min-w-[97px] justify-center"
                :disabled="!canSubmit"
                @click="handleSubmit"
              >
                à¸¢à¸·à¸™à¸¢à¸±à¸™
              </ActionButton>
            </div>
          </header>

          <form
            class="flex-1 px-[35px] py-[35px]"
            @submit.prevent="handleSubmit"
          >
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
                <span>à¸¥à¸šà¸šà¸£à¸´à¸à¸²à¸£</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>

    <AdminConfirmDeleteModal
      v-model="isDeleteModalOpen"
      :item-name="initialServiceName || serviceName"
      title="à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸¥à¸šà¸šà¸£à¸´à¸à¸²à¸£"
      simple-message-template="à¸„à¸¸à¸“à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£ {itemName}
à¹ƒà¸Šà¹ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ"
      force-message-template="à¸šà¸£à¸´à¸à¸²à¸£ {itemName} à¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¸šà¸£à¸´à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸£à¸°à¸šà¸š à¸à¸²à¸£à¸¥à¸šà¸„à¸£à¸±à¹‰à¸‡à¸™à¸µà¹‰à¸ˆà¸°à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸šà¸£à¸´à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”à¸‚à¸­à¸‡à¸šà¸£à¸´à¸à¸²à¸£à¸™à¸µà¹‰à¸”à¹‰à¸§à¸¢
à¹€à¸žà¸·à¹ˆà¸­à¸¢à¸·à¸™à¸¢à¸±à¸™ à¸à¸£à¸¸à¸“à¸²à¸žà¸´à¸¡à¸žà¹Œà¸Šà¸·à¹ˆà¸­à¸šà¸£à¸´à¸à¸²à¸£ {itemName} à¸¥à¸‡à¸”à¹‰à¸²à¸™à¸¥à¹ˆà¸²à¸‡"
      confirm-text="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"
      force-confirm-text="à¸¥à¸šà¸šà¸£à¸´à¸à¸²à¸£à¹à¸¥à¸°à¸£à¸²à¸¢à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢"
      typed-placeholder-template="à¸žà¸´à¸¡à¸žà¹Œà¸Šà¸·à¹ˆà¸­à¸šà¸£à¸´à¸à¸²à¸£ {itemName}"
      typed-mismatch-message="à¸Šà¸·à¹ˆà¸­à¸šà¸£à¸´à¸à¸²à¸£à¹„à¸¡à¹ˆà¸–à¸¹à¸à¸•à¹‰à¸­à¸‡"
      :requires-typed-confirmation="requiresForceDelete"
      :is-submitting="isDeleting"
      :error-message="deleteModalErrorMessage"
      @confirm="deleteService"
      @cancel="closeDeleteModal"
    />

    <Modal
      v-model="isRemoveSubServiceModalOpen"
      title="à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢"
      :message="`à¸„à¸¸à¸“à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£à¸¢à¹ˆà¸­à¸¢ \`${pendingRemoveSubService?.name || '-'}\` à¹ƒà¸Šà¹ˆà¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ`"
      confirm-text="à¸¥à¸šà¸£à¸²à¸¢à¸à¸²à¸£"
      cancel-text="à¸¢à¸à¹€à¸¥à¸´à¸"
      @confirm="confirmRemoveSubService"
      @cancel="closeRemoveSubServiceModal"
    />

    <Modal
      v-model="isCancelConfirmModalOpen"
      title="à¸¢à¸·à¸™à¸¢à¸±à¸™à¸à¸²à¸£à¸¢à¸à¹€à¸¥à¸´à¸"
      message="à¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸šà¸£à¸´à¸à¸²à¸£à¸­à¸¢à¸¹à¹ˆà¹ƒà¸™à¸Ÿà¸­à¸£à¹Œà¸¡ à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸¢à¸à¹€à¸¥à¸´à¸à¹à¸¥à¸°à¸à¸¥à¸±à¸šà¹„à¸›à¸«à¸™à¹‰à¸²à¸£à¸²à¸¢à¸à¸²à¸£à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ"
      confirm-text="à¸¢à¸·à¸™à¸¢à¸±à¸™à¸¢à¸à¹€à¸¥à¸´à¸"
      cancel-text="à¸­à¸¢à¸¹à¹ˆà¸•à¹ˆà¸­"
      @confirm="goToServiceList"
      @cancel="closeCancelModal"
    />
  </div>
</template>
