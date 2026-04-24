<script setup lang="ts">
import { computed, type Component } from "vue";
import { ExclamationCircleIcon } from "./icons";
import ActionButton from "./ui/ActionButton.vue";
import Icon from "./ui/Icon.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    itemName?: string;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: Component;
    iconClass?: string;
  }>(),
  {
    itemName: "",
    title: "ยืนยันการลบรายการ?",
    message: "",
    confirmText: "ลบรายการ",
    cancelText: "ยกเลิก",
    icon: () => ExclamationCircleIcon,
    iconClass: "text-red",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const closeIconPath = "M6 6L18 18M18 6L6 18";

function toCurlyQuotes(value: string) {
  return value
    .replace(/"([^"]+)"/g, "‘$1’")
    .replace(/'([^']+)'/g, "‘$1’");
}

const resolvedTitle = computed(() => toCurlyQuotes(props.title));

const resolvedMessage = computed(() => {
  if (props.message) {
    return toCurlyQuotes(props.message);
  }

  return toCurlyQuotes(`คุณต้องการลบรายการ ${props.itemName}
ใช่หรือไม่`);
});

const messageLines = computed(() =>
  resolvedMessage.value.split("\n").filter((line) => line.trim().length > 0),
);

function closeModal() {
  emit("update:modelValue", false);
  emit("cancel");
}

function confirmAction() {
  emit("confirm");
  emit("update:modelValue", false);
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
        class="relative w-full max-w-[480px] rounded-[16px] bg-white px-6 pb-8 pt-6 shadow-[0_20px_60px_rgba(23,51,106,0.18)] md:px-8"
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
          <component :is="icon" :class="['mb-4 h-8 w-8', iconClass]" />

          <h2 class="style-headline-2 text-gray-950">
            {{ resolvedTitle }}
          </h2>

          <div class="mt-4 space-y-2 style-body-2 text-gray-700">
            <p v-for="(line, index) in messageLines" :key="index">
              {{ line }}
            </p>
          </div>

          <div
            class="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <ActionButton class="min-w-[128px]" @click="confirmAction">
              {{ confirmText }}
            </ActionButton>
            <ActionButton
              variant="secondary"
              class="min-w-[128px]"
              @click="closeModal"
            >
              {{ cancelText }}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
