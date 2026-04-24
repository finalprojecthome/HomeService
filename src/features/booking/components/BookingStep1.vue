<script setup lang="ts">
import { computed, ref, watch } from "vue";
import QuantityList, {
  type QuantityListItem,
} from "../../../components/QuantityList.vue";

export interface SubService {
  id: string;
  name: string;
  price: number;
  unitLabel?: string;
  summaryLabel?: string;
}

export interface SelectedSubService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  unitLabel?: string;
  summaryLabel?: string;
}

const props = withDefaults(
  defineProps<{
    serviceName?: string;
    subServices: SubService[];
    modelValue?: SelectedSubService[];
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: SelectedSubService[]): void;
  (e: "change", value: { selectedItems: SelectedSubService[]; total: number }): void;
}>();

const quantityItems = computed<QuantityListItem[]>(() =>
  props.subServices.map((service) => ({
    id: service.id,
    title: service.name,
    pricePerUnit: service.price,
    unitLabel: service.unitLabel ?? "เครื่อง",
  }))
);

const quantities = ref<number[]>([]);

watch(
  () => [props.subServices, props.modelValue],
  () => {
    if (!props.subServices.length) {
      quantities.value = [];
      return;
    }

    const selectedMap = new Map(
      (props.modelValue ?? []).map((item) => [item.id, item.quantity])
    );

    quantities.value = props.subServices.map(
      (service) => selectedMap.get(service.id) ?? 0
    );
  },
  { immediate: true, deep: true }
);



function handleQuantityChange(payload: { quantities: number[]; total: number }) {
  quantities.value = payload.quantities;

  const nextSelectedItems = props.subServices
    .map((service, index) => {
      const quantity = payload.quantities[index] ?? 0;
      return {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity,
        subtotal: quantity * service.price,
        unitLabel: service.unitLabel ?? "เครื่อง",
        summaryLabel: service.summaryLabel ?? "รายการ",
      };
    })
    .filter((item) => item.quantity > 0);

  emit("update:modelValue", nextSelectedItems);
  emit("change", {
    selectedItems: nextSelectedItems,
    total: nextSelectedItems.reduce((sum, item) => sum + item.subtotal, 0),
  });
}
</script>

<template>
  <section class="space-y-6">
    <div class="bg-white p-6 ">
      <h1 class="mb-2 text-2xl font-semibold text-gray-900">
        เลือกรายการบริการ{{ serviceName ? ` ${serviceName}` : "" }}
      </h1>
    </div>

    <div class=" bg-white p-6">
      <QuantityList
        :items="quantityItems"
        :model-value="quantities"
        :disabled="disabled"
        @change="handleQuantityChange"
      />
    </div>
  </section>
</template>