<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Form } from "vee-validate";
import { storeToRefs } from "pinia";
import DatePicker from "../../../components/ui/DatePicker.vue";
import TimePicker from "../../../components/ui/TimePicker.vue";
import DropdownForm from "../../../components/form/DropdownForm.vue";
import type { DropdownOption } from "../../../components/ui/Dropdown.vue";
import { useAddressStore } from "../../../stores";
import type { UserAddress } from "../../../types/user";

export interface BookingStep2Value {
  date: string | null;
  time: string | null;
  addressId: number | null;
}

export type BookingStep2Errors = {
  date?: string;
  time?: string;
  addressId?: string;
};

const props = withDefaults(
  defineProps<{
    modelValue: BookingStep2Value;
    disabled?: boolean;
    errors?: BookingStep2Errors;
  }>(),
  {
    disabled: false,
    errors: () => ({}),
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: BookingStep2Value): void;
}>();

const addressStore = useAddressStore();
const { addresses, isLoading: isAddressesLoading } = storeToRefs(addressStore);

function formatAddressLabel(address: UserAddress): string {
  const locality =
    address.province.name === "กรุงเทพมหานคร"
      ? `แขวง${address.subDistrict.name}, เขต${address.district.name}`
      : `ตำบล${address.subDistrict.name}, อำเภอ${address.district.name}`;
  return `${address.addressName} — ${address.addressDetail}, ${locality}, จ.${address.province.name} ${address.postCode}`;
}

const addressOptions = computed<DropdownOption[]>(() =>
  addresses.value.map((a) => ({
    label: formatAddressLabel(a),
    value: a.id,
  }))
);

const formInitialValues = computed(() => ({
  bookingAddress: props.modelValue.addressId,
}));

function updateField<K extends keyof BookingStep2Value>(
  key: K,
  value: BookingStep2Value[K]
) {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
}

function handleAddressChange(value: string | number | null) {
  if (value === null || value === "") {
    updateField("addressId", null);
    return;
  }
  const id = typeof value === "number" ? value : Number(value);
  updateField("addressId", Number.isNaN(id) ? null : id);
}

onMounted(async () => {
  try {
    await addressStore.fetchAddresses();
  } catch {
    /* แสดงสถานะว่าง / ข้อความ error จาก store ถ้าต้องการ */
  }
});
</script>

<template>
  <section class="space-y-6">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label class="mb-1 flex w-fit gap-0.5 style-headline-5">
          วันที่ <span class="text-red">*</span>
        </label>

        <DatePicker
          :modelValue="modelValue.date"
          :disabled="disabled"
          @update:modelValue="updateField('date', $event)"
        />

        <p v-if="errors?.date" class="mt-1 text-sm text-red-500">
          {{ errors.date }}
        </p>
      </div>

      <div>
        <label class="mb-1 flex w-fit gap-0.5 style-headline-5">
          เวลา <span class="text-red">*</span>
        </label>

        <TimePicker
          :modelValue="modelValue.time"
          :disabled="disabled"
          @update:modelValue="updateField('time', $event)"
        />

        <p v-if="errors?.time" class="mt-1 text-sm text-red-500">
          {{ errors.time }}
        </p>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">ที่อยู่</h2>

      <template v-if="isAddressesLoading">
        <p class="text-sm text-gray-500">กำลังโหลดที่อยู่...</p>
      </template>
      <template v-else-if="addresses.length === 0">
        <p class="text-sm text-gray-600">
          คุณยังไม่มีที่อยู่ที่บันทึกไว้
          <router-link
            to="/address/add"
            class="font-medium text-blue-600 underline hover:text-blue-700"
          >
            เพิ่มที่อยู่
          </router-link>
        </p>
      </template>
      <Form v-else :initial-values="formInitialValues" class="w-full">
        <DropdownForm
          name="bookingAddress"
          label="เลือกที่อยู่"
          placeholder="เลือกที่อยู่สำหรับบริการ"
          :options="addressOptions"
          :value="modelValue.addressId"
          :disabled="disabled"
          @update:modelValue="handleAddressChange"
        />
        <p v-if="errors?.addressId" class="mt-1 text-sm text-red-500">
          {{ errors.addressId }}
        </p>
      </Form>
    </div>
  </section>
</template>
