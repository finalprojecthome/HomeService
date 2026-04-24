<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ExclamationCircleIcon } from "../icons";
import ActionButton from "../ui/ActionButton.vue";
import Icon from "../ui/Icon.vue";
import TextInput from "../ui/TextInput.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    itemName: string;
    title: string;
    simpleMessageTemplate: string;
    forceMessageTemplate: string;
    confirmText: string;
    forceConfirmText: string;
    typedPlaceholderTemplate?: string;
    typedMismatchMessage?: string;
    requiresTypedConfirmation?: boolean;
    isSubmitting?: boolean;
    errorMessage?: string;
  }>(),
  {
    typedPlaceholderTemplate: "",
    typedMismatchMessage: "ชื่อรายการไม่ถูกต้อง",
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
const typedItemName = ref("");
const localErrorMessage = ref("");

const resolvedConfirmText = computed(() =>
  props.requiresTypedConfirmation ? props.forceConfirmText : props.confirmText,
);
const resolvedMessage = computed(() =>
  resolveTemplate(
    props.requiresTypedConfirmation
      ? props.forceMessageTemplate
      : props.simpleMessageTemplate,
  ),
);
const resolvedPlaceholder = computed(() =>
  resolveTemplate(props.typedPlaceholderTemplate),
);
const inputError = computed(() => localErrorMessage.value || props.errorMessage);

function wrapCurlyQuotes(value: string) {
  return `‘${value}’`;
}

function resolveTemplate(template: string) {
  return template.replaceAll("{itemName}", wrapCurlyQuotes(props.itemName));
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      typedItemName.value = "";
      localErrorMessage.value = "";
      return;
    }

    typedItemName.value = "";
    localErrorMessage.value = "";
  },
);

watch(
  () => props.requiresTypedConfirmation,
  () => {
    typedItemName.value = "";
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
    if (typedItemName.value.trim() !== props.itemName.trim()) {
      localErrorMessage.value = props.typedMismatchMessage;
      return;
    }
  }

  localErrorMessage.value = "";
  emit("confirm", typedItemName.value.trim());
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
          :disabled="isSubmitting"
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
            {{ resolvedMessage }}
          </p>

          <div v-if="requiresTypedConfirmation" class="mt-6 w-full text-left">
            <TextInput
              v-model="typedItemName"
              name="typed-item-name"
              :placeholder="resolvedPlaceholder"
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
              {{ resolvedConfirmText }}
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
