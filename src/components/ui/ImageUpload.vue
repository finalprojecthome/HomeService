<script setup lang="ts">
import { computed, ref } from "vue";
import cn from "../../utils/cn";
import { AddImage } from "../icons";

interface Props {
  modelValue?: File | null;
  existingUrl?: string | null;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  disabled?: boolean;
  hint?: number;
  instruction?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  existingUrl: null,
  accept: "image/png,image/jpeg",
  multiple: false,
  maxSizeMb: 10,
  disabled: false,
  hint: 10,
  instruction: "",
});

const emit = defineEmits<{
  "update:modelValue": [file: File | null];
  change: [file: File | null];
  error: [message: string];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const previewUrl = ref<string | null>(null);
const errorMessage = ref("");
const hasError = ref(false);

const displayUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value;
  const url = props.existingUrl?.trim();
  return url && url.length > 0 ? url : null;
});

const previewImageAlt = computed(() =>
  previewUrl.value ? "Profile photo preview" : "Current profile photo",
);

function triggerFileInput() {
  if (!props.disabled) fileInputRef.value?.click();
}

function handleDragOver() {
  if (!props.disabled) isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) processFile(file);
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) processFile(file);
}

function processFile(file: File) {
  errorMessage.value = "";
  hasError.value = false;

  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Please upload an image file (PNG or JPG)";
    hasError.value = true;
    emit("error", errorMessage.value);
    return;
  }

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    errorMessage.value = `File size must not exceed ${props.maxSizeMb}MB`;
    hasError.value = true;
    emit("error", errorMessage.value);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  emit("update:modelValue", file);
  emit("change", file);
}

function removeFile() {
  previewUrl.value = null;
  errorMessage.value = "";
  hasError.value = false;
  if (fileInputRef.value) fileInputRef.value.value = "";
  emit("update:modelValue", null);
  emit("change", null);
}
</script>

<template>
  <div class="flex flex-col gap-[8px] min-w-[240px] w-full">
    <label v-if="label" class="style-headline-5 text-gray-900">
      {{ label }}
    </label>
    <div
      class="relative rounded-xl border-2 border-dashed min-h-[160px] flex items-center justify-center cursor-pointer transition-all duration-200"
      :class="
        cn(
          'relative rounded-xl border-2 border-dashed min-h-[160px] flex items-center justify-center cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/40',
          hasError ? 'border-red-400' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          props.class,
        )
      "
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <!-- Preview (new file or existing URL) -->
      <div
        v-if="displayUrl"
        class="relative w-full h-full min-h-[120px] flex items-center justify-center p-4"
      >
        <img
          :src="displayUrl"
          :alt="previewImageAlt"
          class="max-w-full max-h-[200px] object-contain rounded-lg"
        />
        <button
          v-if="previewUrl"
          type="button"
          class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-150 shadow-sm cursor-pointer"
          @click.stop="removeFile"
          title="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center gap-2 text-center px-6 py-8"
      >
        <div class="text-gray-400 mb-1">
          <AddImage :size="40" />
        </div>
        <p class="style-body-3 text-gray-700 leading-relaxed">
          <span
            class="text-blue-600 cursor-pointer"
            @click.stop="triggerFileInput"
            >อัพโหลดรูปภาพ</span
          >
          หรือ ลากและวางที่นี่
        </p>
        <p class="style-body-4 text-gray-700">
          PNG, JPG ขนาดไม่เกิน {{ hint }}MB
        </p>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFileChange"
      />
    </div>

    <p v-if="instruction">
      <span class="text-gray-700">{{ instruction }}</span>
    </p>
    <p v-if="errorMessage" class="text-[13px] text-red">{{ errorMessage }}</p>
  </div>
</template>
