<script setup lang="ts">
import { computed } from "vue";
import SelectBox from "./ui/SelectBox.vue";
import { QrIcon, Card } from "./icons";

export interface PaymentOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options?: PaymentOption[];
    label?: string;
  }>(),
  {
    modelValue: "",
    options: () => [
      { value: "credit-card", label: "บัตรเครดิต/เดบิต" },
      { value: "qr", label: "QR พร้อมเพย์" },
    ],
    label: "ชำระเงิน",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

function updatePayment(value: string) {
  emit("update:modelValue", value);
}

const hasPaymentSelection = computed(() => props.modelValue !== "");
</script>

<template>
  <section class="w-full">
    <h3 v-if="label" class="style-headline-3 text-gray-800 mb-4">
      {{ label }}
    </h3>

    <div
      class="flex flex-wrap gap-4 transition-opacity"
      :class="hasPaymentSelection ? 'opacity-100' : 'opacity-0'"
    >
      <SelectBox
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        @update:model-value="updatePayment"
      >
        <template #icon>
          <span class="flex items-center justify-center transition-colors">
            <QrIcon v-if="option.value === 'qr'" :size="32" />
            <Card v-else :size="32" />
          </span>
        </template>
      </SelectBox>
    </div>
  </section>
</template>
