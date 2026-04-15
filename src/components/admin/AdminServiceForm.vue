<script setup lang="ts">
import { computed, ref } from "vue";
import ActionButton from "../ui/ActionButton.vue";
import Dropdown, { type DropdownOption } from "../ui/Dropdown.vue";
import ImageUpload from "../ui/ImageUpload.vue";
import TextInput from "../ui/TextInput.vue";
import {
  createAdminServiceFormSubServiceDraft,
  type AdminServiceFormFieldErrors,
  type AdminServiceFormSubServiceDraft,
} from "../../types/adminServiceForm";

type SubServiceFieldKey = "name" | "unit" | "pricePerUnit";
type SubServiceLayout = "create" | "edit";

const props = withDefaults(
  defineProps<{
    serviceName: string;
    categoryId: number | null;
    categoryOptions: DropdownOption[];
    selectedImageFile: File | null;
    existingImageUrl?: string;
    subServices: AdminServiceFormSubServiceDraft[];
    fieldErrors: AdminServiceFormFieldErrors;
    disabled?: boolean;
    showMetadata?: boolean;
    createdAt?: string;
    updatedAt?: string;
    minSubServices?: number;
    subServiceLayout?: SubServiceLayout;
    confirmFilledSubServiceRemoval?: boolean;
  }>(),
  {
    existingImageUrl: "",
    disabled: false,
    showMetadata: false,
    createdAt: "",
    updatedAt: "",
    minSubServices: 1,
    subServiceLayout: "create",
    confirmFilledSubServiceRemoval: false,
  },
);

const emit = defineEmits<{
  "update:serviceName": [value: string];
  "update:categoryId": [value: number | null];
  "update:selectedImageFile": [value: File | null];
  "update:subServices": [value: AdminServiceFormSubServiceDraft[]];
  "request:removeSubService": [row: AdminServiceFormSubServiceDraft];
}>();

const dragDots = Array.from({ length: 6 });
const draggedRowKey = ref<string | null>(null);
const dropTargetRowKey = ref<string | null>(null);

const canRemoveRows = computed(
  () => props.subServices.length > props.minSubServices,
);

const subServiceFields = computed<
  Array<{ key: SubServiceFieldKey; label: string }>
>(() => {
  const fields = {
    name: {
      key: "name" as const,
      label: "ชื่อรายการ",
    },
    unit: {
      key: "unit" as const,
      label: "หน่วยการบริการ",
    },
    pricePerUnit: {
      key: "pricePerUnit" as const,
      label: "ค่าบริการ / 1 หน่วย",
    },
  };

  return props.subServiceLayout === "edit"
    ? [fields.name, fields.unit, fields.pricePerUnit]
    : [fields.name, fields.pricePerUnit, fields.unit];
});

function updateSubServices(nextRows: AdminServiceFormSubServiceDraft[]) {
  emit("update:subServices", nextRows);
}

function updateRowField(
  rowKey: string,
  field: SubServiceFieldKey,
  value: string,
) {
  updateSubServices(
    props.subServices.map((row) =>
      row.key === rowKey ? { ...row, [field]: value } : row,
    ),
  );
}

function addSubServiceRow() {
  updateSubServices([
    ...props.subServices,
    createAdminServiceFormSubServiceDraft(),
  ]);
}

function removeSubServiceRow(rowKey: string) {
  if (!canRemoveRows.value) {
    return;
  }

  const row = props.subServices.find((item) => item.key === rowKey);
  if (!row) {
    return;
  }

  const hasExistingContent =
    Boolean(row.subServiceId) ||
    row.name.trim().length > 0 ||
    row.unit.trim().length > 0 ||
    row.pricePerUnit.trim().length > 0;

  if (props.confirmFilledSubServiceRemoval && hasExistingContent) {
    emit("request:removeSubService", row);
    return;
  }

  updateSubServices(props.subServices.filter((item) => item.key !== rowKey));
}

function handleDragStart(rowKey: string) {
  if (props.disabled) {
    return;
  }

  draggedRowKey.value = rowKey;
}

function handleDragEnter(rowKey: string) {
  if (draggedRowKey.value === null || draggedRowKey.value === rowKey) {
    return;
  }

  dropTargetRowKey.value = rowKey;
}

function handleDrop(targetRowKey: string) {
  const sourceRowKey = draggedRowKey.value;

  if (sourceRowKey === null || sourceRowKey === targetRowKey) {
    handleDragEnd();
    return;
  }

  const nextRows = [...props.subServices];
  const sourceIndex = nextRows.findIndex((row) => row.key === sourceRowKey);
  const targetIndex = nextRows.findIndex((row) => row.key === targetRowKey);

  if (sourceIndex === -1 || targetIndex === -1) {
    handleDragEnd();
    return;
  }

  const [movedRow] = nextRows.splice(sourceIndex, 1);
  nextRows.splice(targetIndex, 0, movedRow);
  updateSubServices(nextRows);
  handleDragEnd();
}

function handleDragEnd() {
  draggedRowKey.value = null;
  dropTargetRowKey.value = null;
}

function handleImageChange(file: File | null) {
  emit("update:selectedImageFile", file);
}
</script>

<template>
  <div
    class="flex flex-col rounded-[8px] border border-gray-200 bg-white px-[24px] py-[40px] style-shadow"
  >
    <div
      class="grid items-start gap-[16px] md:grid-cols-[126px_minmax(0,520px)] md:gap-[40px]"
    >
      <div class="pt-[10px]">
        <p class="style-body-5 text-gray-700">
          ชื่อบริการ<span class="text-red">*</span>
        </p>
      </div>

      <TextInput
        :model-value="serviceName"
        name="admin-service-name"
        :disabled="disabled"
        :error="fieldErrors.serviceName || null"
        @update:model-value="emit('update:serviceName', $event)"
      />

      <div class="pt-[10px]">
        <p class="style-body-5 text-gray-700">
          หมวดหมู่<span class="text-red">*</span>
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <Dropdown
          :model-value="categoryId"
          :options="categoryOptions"
          placeholder="เลือกหมวดหมู่"
          :disabled="disabled"
          @update:model-value="
            emit('update:categoryId', $event as number | null)
          "
        />
        <span v-if="fieldErrors.categoryId" class="style-body-4 text-red">
          {{ fieldErrors.categoryId }}
        </span>
      </div>

      <div class="pt-[10px]">
        <p class="style-body-5 text-gray-700">
          รูปภาพ<span class="text-red">*</span>
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-if="existingImageUrl && !selectedImageFile"
          class="w-fit overflow-hidden rounded-[8px] border border-gray-200"
        >
          <img
            :src="existingImageUrl"
            alt="Service image"
            class="block h-[180px] w-auto max-w-[360px] object-cover"
          />
        </div>

        <ImageUpload
          :model-value="selectedImageFile"
          :disabled="disabled"
          :hint="5"
          instruction="ขนาดภาพแนะนำ: 1440 × 225 PX"
          @update:model-value="handleImageChange"
        />
      </div>
    </div>

    <div class="my-[40px] h-px bg-gray-200" />

    <section class="flex flex-col gap-[40px]">
      <h2 class="style-headline-5 text-gray-700">รายการบริการย่อย</h2>

      <div class="flex flex-col gap-[40px]">
        <div
          v-for="row in subServices"
          :key="row.key"
          :draggable="!disabled"
          :class="[
            'grid gap-3 rounded-[8px] border border-gray-200 px-4 py-4 transition-colors md:grid-cols-[24px_minmax(0,1fr)_160px_160px_88px]',
            draggedRowKey === row.key && 'bg-blue-100/60',
            dropTargetRowKey === row.key && 'bg-gray-100',
          ]"
          @dragstart="handleDragStart(row.key)"
          @dragenter.prevent="handleDragEnter(row.key)"
          @dragover.prevent
          @drop.prevent="handleDrop(row.key)"
          @dragend="handleDragEnd"
        >
          <div
            class="flex items-center justify-center pt-7 text-gray-500"
            :class="
              disabled
                ? 'cursor-not-allowed'
                : 'cursor-grab active:cursor-grabbing'
            "
            title="ลากเพื่อจัดลำดับ"
          >
            <span class="grid grid-cols-2 gap-[3px]" aria-hidden="true">
              <span
                v-for="(_, dotIndex) in dragDots"
                :key="dotIndex"
                class="h-[3px] w-[3px] rounded-full bg-current"
              />
            </span>
          </div>

          <div
            v-for="field in subServiceFields"
            :key="`${row.key}-${field.key}`"
            class="space-y-1.5"
          >
            <p class="style-body-3 text-gray-700">{{ field.label }}</p>
            <TextInput
              :model-value="row[field.key]"
              :disabled="disabled"
              :error="fieldErrors.subServices[row.key]?.[field.key] || null"
              @update:model-value="updateRowField(row.key, field.key, $event)"
            />
          </div>

          <div class="flex items-start justify-end pt-7">
            <button
              type="button"
              class="style-button cursor-pointer text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:text-gray-400"
              :disabled="disabled || !canRemoveRows"
              @click="removeSubServiceRow(row.key)"
            >
              ลบรายการ
            </button>
          </div>
        </div>
      </div>

      <ActionButton
        variant="secondary"
        class="min-w-[129px] justify-center"
        :disabled="disabled"
        @click="addSubServiceRow"
      >
        <span>เพิ่มรายการ</span>
        <span class="text-lg leading-none">+</span>
      </ActionButton>
    </section>

    <template v-if="showMetadata">
      <div class="my-6 h-px bg-gray-200" />

      <div class="grid gap-4 md:grid-cols-[126px_minmax(0,1fr)] md:gap-y-6">
        <p class="style-body-5 text-gray-700">สร้างเมื่อ</p>
        <p class="style-body-3 text-gray-900">
          {{ createdAt || "-" }}
        </p>

        <p class="style-body-5 text-gray-700">แก้ไขล่าสุด</p>
        <p class="style-body-3 text-gray-900">
          {{ updatedAt || "-" }}
        </p>
      </div>
    </template>
  </div>
</template>