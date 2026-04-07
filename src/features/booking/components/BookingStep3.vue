<script setup lang="ts">
import PaymentSelection from "../../../components/PaymentSelection.vue";

export interface BookingStep3Value {
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
export type BookingStep3Error = {
  paymentMethod?: string;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}



const props = withDefaults(
  defineProps<{
    modelValue: BookingStep3Value;
    disabled?: boolean;
    errors?: BookingStep3Error;
  }>(),
  {
    disabled: false,
    errors: () => ({}),
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: BookingStep3Value): void;
}>();

function updateField<K extends keyof BookingStep3Value>(
  key: K,
  value: BookingStep3Value[K]
) {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
}

type PaymentMethod = "credit-card" | "qr";

function handlePaymentMethodChange(value: string) {
  const method = value as PaymentMethod;

  if (method === "qr") {
    emit("update:modelValue", {
      ...props.modelValue,
      paymentMethod: method,
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
    return;
  }

  emit("update:modelValue", {
    ...props.modelValue,
    paymentMethod: method,
  });
}
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h1 class="mb-2 text-2xl font-semibold text-gray-900">ชำระเงิน</h1>
      <p class="text-gray-600">
        กรุณาเลือกวิธีการชำระเงิน
      </p>
    </div>

    <!-- Payment method -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <PaymentSelection
        :model-value="modelValue.paymentMethod"
        @update:model-value="handlePaymentMethodChange"
      />

      <p v-if="errors?.paymentMethod" class="mt-2 text-sm text-red-500">
        {{ errors.paymentMethod }}
      </p>
    </div>

    <!-- Credit card form -->
    <div
      v-if="modelValue.paymentMethod === 'credit-card'"
      class="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 class="mb-4 text-xl font-semibold text-gray-900">ข้อมูลบัตร</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">
            ชื่อบนบัตร
          </label>
          <input
            type="text"
            class="w-full rounded-xl border px-4 py-3"
            :class="errors?.cardName ? 'border-red-500' : 'border-gray-300'"
            :value="modelValue.cardName"
            :disabled="disabled"
            @input="updateField('cardName', ($event.target as HTMLInputElement).value)"
          />
          <p v-if="errors?.cardName" class="mt-1 text-sm text-red-500">
            {{ errors.cardName }}
          </p>
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">
            หมายเลขบัตร
          </label>
          <input
            type="text"
            class="w-full rounded-xl border px-4 py-3"
            :class="errors?.cardNumber ? 'border-red-500' : 'border-gray-300'"
            :value="modelValue.cardNumber"
            :disabled="disabled"
            @input="updateField('cardNumber', ($event.target as HTMLInputElement).value)"
          />
          <p v-if="errors?.cardNumber" class="mt-1 text-sm text-red-500">
            {{ errors.cardNumber }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            วันหมดอายุ
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            class="w-full rounded-xl border px-4 py-3"
            :class="errors?.expiry ? 'border-red-500' : 'border-gray-300'"
            :value="modelValue.expiry"
            :disabled="disabled"
            @input="updateField('expiry', ($event.target as HTMLInputElement).value)"
          />
          <p v-if="errors?.expiry" class="mt-1 text-sm text-red-500">
            {{ errors.expiry }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            CVV
          </label>
          <input
            type="password"
            class="w-full rounded-xl border px-4 py-3"
            :class="errors?.cvv ? 'border-red-500' : 'border-gray-300'"
            :value="modelValue.cvv"
            :disabled="disabled"
            @input="updateField('cvv', ($event.target as HTMLInputElement).value)"
          />
          <p v-if="errors?.cvv" class="mt-1 text-sm text-red-500">
            {{ errors.cvv }}
          </p>
        </div>
      </div>
    </div>

    <!-- PromptPay QR -->
    <div
      v-else-if="modelValue.paymentMethod === 'qr'"
      class="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 class="mb-4 text-xl font-semibold text-gray-900">QR พร้อมเพย์</h2>

      <div
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8"
      >
        <div
          class="mb-4 flex h-48 w-48 items-center justify-center rounded-xl bg-gray-100 text-gray-400"
        >
          QR Placeholder
        </div>
        <p class="text-sm text-gray-500">
          กรุณาสแกน QR เพื่อชำระเงิน
        </p>
      </div>
    </div>
  </section>
</template>
