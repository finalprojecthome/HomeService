<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CheckedCircle } from "../../../components/icons";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import Modal from "../../../components/AlertModal.vue";
import ActionButton from "../../../components/ui/ActionButton.vue";
import TextInput from "../../../components/ui/TextInput.vue";
import { createAdminCategory } from "../../../services/AdminCategory";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { showCustomToast } from "../../../utils/toast";

const router = useRouter();

const categoryName = ref("");
const fieldError = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);
const isSuccessModalOpen = ref(false);
const isCancelConfirmModalOpen = ref(false);

const trimmedCategoryName = computed(() => categoryName.value.trim());
const isFormDirty = computed(() => trimmedCategoryName.value.length > 0);

watch(categoryName, () => {
  if (fieldError.value) {
    fieldError.value = "";
  }

  if (errorMessage.value) {
    errorMessage.value = "";
  }
});

function goToCategoryList() {
  router.push("/admin/category");
}

function openCancelFlow() {
  if (isSubmitting.value) {
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

function closeSuccessModal() {
  categoryName.value = "";
  fieldError.value = "";
  errorMessage.value = "";
  isSuccessModalOpen.value = false;
}

async function handleSubmit() {
  if (isSubmitting.value) {
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
    await createAdminCategory({
      name: trimmedCategoryName.value,
    });
    isSuccessModalOpen.value = true;
  } catch (error) {
    const apiMessage = getApiErrorMessage(error, "ไม่สามารถสร้างหมวดหมู่ได้");

    if (apiMessage === "Category name already exists") {
      showCustomToast({
        variant: "error",
        title: "เกิดข้อผิดพลาด",
        description: `ชื่อหมวดหมู่ ‘${trimmedCategoryName.value}’ มีการใช้ในระบบแล้ว`,
      });
      return;
    }

    errorMessage.value = apiMessage;
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
            <h1 class="style-headline-2 text-gray-950">เพิ่มหมวดหมู่</h1>

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
                :disabled="isSubmitting"
                @click="handleSubmit"
              >
                สร้าง
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
                class
                ="grid items-start gap-[16px] md:grid-cols-[126px_minmax(0,272px)] md:gap-[18px]"
              >
                <div class="pt-[10px]">
                  <p class="style-body-5 text-gray-700">
                    ชื่อหมวดหมู่<span class="text-red">*</span>
                  </p>
                </div>

                <TextInput
                  v-model="categoryName"
                  name="admin-category-name"
                  placeholder=""
                  :disabled="isSubmitting"
                  :error="fieldError || null"
                />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>

    <Modal
      v-model="isSuccessModalOpen"
      :icon="CheckedCircle"
      icon-class="text-green-900"
      title="สร้างหมวดหมู่สำเร็จ"
      message="ต้องการกลับไปหน้ารายการหมวดหมู่หรือไม่"
      confirm-text="กลับไปหน้า list"
      cancel-text="อยู่หน้าต่อ"
      @confirm="goToCategoryList"
      @cancel="closeSuccessModal"
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
