<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ExclamationCircleIcon } from "../icons";
import ActionButton from "../ui/ActionButton.vue";
import Icon from "../ui/Icon.vue";
import TextInput from "../ui/TextInput.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    categoryName: string;
    requiresTypedConfirmation?: boolean;
    isSubmitting?: boolean;
    errorMessage?: string;
  }>(),
  {
    requiresTypedConfirmation: false,
    isSubmitting: false,
    errorMessage: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [typedName: string];
  cancel: [];
}>();

const closeIconPath = "M6 6L18 18M18 6L6 18";
const typedCategoryName = ref("");
const localErrorMessage = ref("");

function wrapCurlyQuotes(value: string) {
  return `‘${value}’`;
}

const title = computed(() => "ยืนยันการลบหมวดหมู่");
const confirmText = computed(() =>
  props.requiresTypedConfirmation
    ? "ลบหมวดและบริการทั้งหมด"
    : "ลบรายการ",
);
const helperMessage = computed(() =>
  props.requiresTypedConfirmation
    ? `บริการในหมวด ${wrapCurlyQuotes(props.categoryName)} กำลังถูกใช้งานอยู่ การลบครั้งนี้จะลบบริการที่อยู่ในหมวดนี้ทั้งหมด
เพื่อยืนยัน กรุณาพิมพ์ชื่อหมวด ${wrapCurlyQuotes(props.categoryName)} ลงด้านล่าง`
    : `คุณต้องการลบหมวดหมู่ ${wrapCurlyQuotes(props.categoryName)} ใช่หรือไม่`,
);
const inputError = computed(() => localErrorMessage.value || props.errorMessage);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      typedCategoryName.value = "";
      localErrorMessage.value = "";
      return;
    }

    typedCategoryName.value = "";
    localErrorMessage.value = "";
  },
);

watch(
  () => props.requiresTypedConfirmation,
  () => {
    typedCategoryName.value = "";
    localErrorMessage.value = "";
  },
);

watch(
  () => props.errorMessage,
  (message) => {
    if (!message) {
      localErrorMessage.value = "";
    }
  },
);

function closeModal() {
  emit("update:modelValue", false);
  emit("cancel");
}

function confirmAction() {
  if (props.requiresTypedConfirmation) {
    if (typedCategoryName.value.trim() !== props.categoryName.trim()) {
      localErrorMessage.value = "ชื่อหมวดไม่ถูกต้อง";
      return;
    }
  }

  localErrorMessage.value = "";
  emit("confirm", typedCategoryName.value.trim());
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
      @click.self="closeModal"
    >
      <div
        class="relative w-full max-w-[560px] rounded-[16px] bg-white px-6 pb-8 pt-6 shadow-[0_20px_60px_rgba(23,51,106,0.18)] md:px-8"
      >
        <button
          type="button"
          class="absolute right-4 top-4 cursor-pointer text-gray-600 transition-colors hover:text-gray-700"
          aria-label="Close dialog"
          @click="closeModal"
        >
          <Icon :path="closeIconPath" class="h-5 w-5" />
        </button>

        <div class="flex flex-col items-center text-center">
          <component :is="ExclamationCircleIcon" class="mb-4 h-8 w-8 text-red" />

          <h2 class="style-headline-2 text-gray-950">
            {{ title }}
          </h2>

          <p class="mt-4 whitespace-pre-line style-body-2 text-gray-700">
            {{ helperMessage }}
          </p>

          <div v-if="requiresTypedConfirmation" class="mt-6 w-full text-left">
            <TextInput
              v-model="typedCategoryName"
              name="typed-category-name"
              :placeholder="`พิมพ์ชื่อหมวด ${categoryName}`"
              :error="inputError || null"
              :disabled="isSubmitting"
            />
          </div>

          <p
            v-else-if="inputError"
            class="mt-4 w-full text-left style-body-4 text-red"
          >
            {{ inputError }}
          </p>

          <div
            class="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <ActionButton
              class="min-w-[180px]"
              :disabled="isSubmitting"
              @click="confirmAction"
            >
              {{ confirmText }}
            </ActionButton>
            <ActionButton
              variant="secondary"
              class="min-w-[128px]"
              :disabled="isSubmitting"
              @click="closeModal"
            >
              ยกเลิก
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
