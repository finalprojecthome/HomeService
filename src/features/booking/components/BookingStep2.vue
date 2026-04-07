```vue
<script setup lang="ts">
import InputForm from "../../../components/form/InputForm.vue";
import DatePicker from "../../../components/ui/DatePicker.vue";
import TimePicker from "../../../components/ui/TimePicker.vue";

/* ------------------ types ------------------ */
export interface SelectOption {
  label: string;
  value: string;
}

export interface BookingStep2Value {
  date: string | null;
  time: string | null;
  houseNo: string;
  provinceId: string;
  districtId: string;
  subDistrictId: string;
}

export type BookingStep2Errors = {
  date?: string;
  time?: string;
  houseNo?: string;
  provinceId?: string;
  districtId?: string;
  subDistrictId?: string;
};

/* ------------------ props ------------------ */
const props = withDefaults(
  defineProps<{
    modelValue: BookingStep2Value;
    provinceOptions?: SelectOption[];
    districtOptions?: SelectOption[];
    subDistrictOptions?: SelectOption[];
    disabled?: boolean;
    errors?: BookingStep2Errors;
  }>(),
  {
    disabled: false,
    provinceOptions: () => [],
    districtOptions: () => [],
    subDistrictOptions: () => [],
    errors: () => ({}),
  }
);

/* ------------------ emits ------------------ */
const emit = defineEmits<{
  (e: "update:modelValue", value: BookingStep2Value): void;
  (e: "province-change", value: string): void;
  (e: "district-change", value: string): void;
}>();

/* ------------------ handlers ------------------ */
function updateField<K extends keyof BookingStep2Value>(
  key: K,
  value: BookingStep2Value[K]
) {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
}

function handleProvinceChange(value: string) {
  emit("update:modelValue", {
    ...props.modelValue,
    provinceId: value,
    districtId: "",
    subDistrictId: "",
  });

  emit("province-change", value);
}

function handleDistrictChange(value: string) {
  emit("update:modelValue", {
    ...props.modelValue,
    districtId: value,
    subDistrictId: "",
  });

  emit("district-change", value);
}
</script>

<template>
  <section class="space-y-6">
    <!-- Date & Time -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- Date -->
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

      <!-- Time -->
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

    <!-- Address -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">ที่อยู่</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- House No -->
        <div>
          <InputForm
            name="houseNo"
            label="บ้านเลขที่"
            placeholder="กรอกบ้านเลขที่"
            required
            :value="modelValue.houseNo"
            :disabled="disabled"
            @input="updateField('houseNo', ($event.target as HTMLInputElement).value)"
          />

          <p v-if="errors?.houseNo" class="mt-1 text-sm text-red-500">
            {{ errors.houseNo }}
          </p>
        </div>

        <!-- Province -->
        <div>
          <label class="mb-1 flex w-fit gap-0.5 style-headline-5">
            จังหวัด <span class="text-red">*</span>
          </label>

          <select
            class="w-full rounded-lg border border-gray-300 px-4 py-3"
            :value="modelValue.provinceId"
            :disabled="disabled"
            @change="handleProvinceChange(($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>เลือกจังหวัด</option>
            <option
              v-for="option in provinceOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <p v-if="errors?.provinceId" class="mt-1 text-sm text-red-500">
            {{ errors.provinceId }}
          </p>
        </div>

        <!-- District -->
        <div>
          <label class="mb-1 flex w-fit gap-0.5 style-headline-5">
            อำเภอ / เขต <span class="text-red">*</span>
          </label>

          <select
            class="w-full rounded-lg border border-gray-300 px-4 py-3"
            :value="modelValue.districtId"
            :disabled="disabled || !modelValue.provinceId"
            @change="handleDistrictChange(($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>เลือกอำเภอ / เขต</option>
            <option
              v-for="option in districtOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <p v-if="errors?.districtId" class="mt-1 text-sm text-red-500">
            {{ errors.districtId }}
          </p>
        </div>

        <!-- Sub District -->
        <div>
          <label class="mb-1 flex w-fit gap-0.5 style-headline-5">
            ตำบล / แขวง <span class="text-red">*</span>
          </label>

          <select
            class="w-full rounded-lg border border-gray-300 px-4 py-3"
            :value="modelValue.subDistrictId"
            :disabled="disabled || !modelValue.districtId"
            @change="updateField('subDistrictId', ($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>เลือกตำบล / แขวง</option>
            <option
              v-for="option in subDistrictOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <p v-if="errors?.subDistrictId" class="mt-1 text-sm text-red-500">
            {{ errors.subDistrictId }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
```
