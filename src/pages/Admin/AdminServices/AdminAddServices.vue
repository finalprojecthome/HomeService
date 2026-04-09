<script setup lang="ts">
import type { DropdownOption } from "../../../components/ui/Dropdown.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AdminServiceForm from "../../../components/admin/AdminServiceForm.vue";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import { CheckedCircle } from "../../../components/icons";
import ActionButton from "../../../components/ui/ActionButton.vue";
import {
  createAdminService,
  type AdminServicePayload,
} from "../../../services/AdminService";
import { getAllAdminCategoryOptions } from "../../../services/adminCategoryOptions";
import {
  createAdminServiceFormSubServiceDraft,
  type AdminServiceFormFieldErrors,
  type AdminServiceFormSubServiceDraft,
} from "../../../types/adminServiceForm";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { showCustomToast } from "../../../utils/toast";

const router = useRouter();

const categoryOptions = ref<DropdownOption[]>([]);
const serviceName = ref("");
const categoryId = ref<number | null>(null);
const selectedImageFile = ref<File | null>(null);
const subServices = ref<AdminServiceFormSubServiceDraft[]>([
  createAdminServiceFormSubServiceDraft(),
]);
const fieldErrors = ref<AdminServiceFormFieldErrors>({
  subServices: {},
});
const errorMessage = ref("");
const isLoadingCategories = ref(false);
const isSubmitting = ref(false);
const isSuccessModalOpen = ref(false);
const isCancelConfirmModalOpen = ref(false);

function showErrorToast(message: string) {
  showCustomToast({
    variant: "error",
    title: "เกิดข้อผิดพลาด",
    description: message,
  });
}

const isFormDirty = computed(() =>
  JSON.stringify(serializeFormState()) !==
  JSON.stringify({
    serviceName: "",
    categoryId: null,
    selectedImageFileName: "",
    subServices: [{ name: "", unit: "", pricePerUnit: "" }],
  }),
);

watch([serviceName, categoryId, subServices], () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
}, { deep: true });

onMounted(() => {
  void fetchCategoryOptions();
});

async function fetchCategoryOptions() {
  isLoadingCategories.value = true;

  try {
    categoryOptions.value = await getAllAdminCategoryOptions();
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถโหลดหมวดหมู่ได้");
    errorMessage.value = apiMessage;
    showErrorToast(apiMessage);
  } finally {
    isLoadingCategories.value = false;
  }
}

function serializeFormState() {
  return {
    serviceName: serviceName.value.trim(),
    categoryId: categoryId.value,
    selectedImageFileName: selectedImageFile.value?.name || "",
    subServices: subServices.value.map((row) => ({
      name: row.name.trim(),
      unit: row.unit.trim(),
      pricePerUnit: row.pricePerUnit.trim(),
    })),
  };
}

function resetFieldErrors() {
  fieldErrors.value = {
    subServices: {},
  };
}

function goToServiceList() {
  router.push("/admin/service");
}

function openCancelFlow() {
  if (isSubmitting.value) {
    return;
  }

  if (!isFormDirty.value) {
    goToServiceList();
    return;
  }

  isCancelConfirmModalOpen.value = true;
}

function closeCancelModal() {
  isCancelConfirmModalOpen.value = false;
}

function closeSuccessModal() {
  serviceName.value = "";
  categoryId.value = null;
  selectedImageFile.value = null;
  subServices.value = [createAdminServiceFormSubServiceDraft()];
  resetFieldErrors();
  errorMessage.value = "";
  isSuccessModalOpen.value = false;
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
    imageUrl: "",
    subServices: subServices.value.map((row) => ({
      name: row.name.trim(),
      unit: row.unit.trim(),
      pricePerUnit: Number(row.pricePerUnit),
    })),
  };
}

async function handleSubmit() {
  if (isSubmitting.value || isLoadingCategories.value) {
    return;
  }

  resetFieldErrors();
  errorMessage.value = "";

  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await createAdminService(buildPayload());
    isSuccessModalOpen.value = true;
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถสร้างบริการได้");

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
            class="flex items-center justify-between bg-white px-[35px] py-[17px]"
          >
            <h1 class="style-headline-2 text-gray-950">เพิ่มบริการ</h1>

            <div class="flex items-center justify-end gap-[14px]">
              <ActionButton
                variant="secondary"
                class="min-w-[97px] justify-center"
                :disabled="isSubmitting"
                @click="openCancelFlow"
              >
                ยกเลิก
              </ActionButton>

              <ActionButton
                class="min-w-[97px] justify-center"
                :disabled="isSubmitting || isLoadingCategories"
                @click="handleSubmit"
              >
                สร้าง
              </ActionButton>
            </div>
          </header>

          <form class="flex-1 px-[35px] py-[35px]" @submit.prevent="handleSubmit">
            <AdminServiceForm
              :service-name="serviceName"
              :category-id="categoryId"
              :category-options="categoryOptions"
              :selected-image-file="selectedImageFile"
              :sub-services="subServices"
              :field-errors="fieldErrors"
              :disabled="isSubmitting || isLoadingCategories"
              @update:service-name="serviceName = $event"
              @update:category-id="categoryId = $event"
              @update:selected-image-file="selectedImageFile = $event"
              @update:sub-services="subServices = $event"
            />
          </form>
        </section>
      </main>
    </div>

    <Modal
      v-model="isSuccessModalOpen"
      :icon="CheckedCircle"
      icon-class="text-green-900"
      title="สร้างบริการสำเร็จ"
      message="ต้องการกลับไปหน้ารายการบริการหรือไม่"
      confirm-text="กลับไปหน้า list"
      cancel-text="อยู่หน้าต่อ"
      @confirm="goToServiceList"
      @cancel="closeSuccessModal"
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