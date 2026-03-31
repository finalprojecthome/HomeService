<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue?: [number, number];
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  currency?: string;
  formatFn?: (val: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [0, 2000],
  min: 0,
  max: 2000,
  step: 1,
  currency: "฿",
  label: "",
  formatFn: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: [number, number]];
  change: [value: [number, number]];
}>();

const localMin = ref(props.modelValue[0]);
const localMax = ref(props.modelValue[1]);

watch(
  () => props.modelValue,
  ([min, max]) => {
    localMin.value = min;
    localMax.value = max;
  },
  { deep: true },
);

const minPercent = computed(
  () => ((localMin.value - props.min) / (props.max - props.min)) * 100,
);
const maxPercent = computed(
  () => ((localMax.value - props.min) / (props.max - props.min)) * 100,
);

function onMinChange() {
  if (localMin.value >= localMax.value)
    localMin.value = localMax.value - props.step;
  emitChange();
}

function onMaxChange() {
  if (localMax.value <= localMin.value)
    localMax.value = localMin.value + props.step;
  emitChange();
}

function emitChange() {
  const val: [number, number] = [localMin.value, localMax.value];
  emit("update:modelValue", val);
  emit("change", val);
}

function formatPrice(val: number): string {
  if (props.formatFn) return props.formatFn(val);
  return val.toLocaleString();
}
</script>

<template>
  <div class="flex flex-col gap-2 min-w-[240px]">
    <label v-if="label" class="style-headline-5 text-gray-900">{{
      label
    }}</label>
    <div
      class="bg-white border border-gray-200 rounded-xl px-5 pt-4 pb-10 flex flex-col gap-3"
    >
      <!-- Price Display -->
      <div class="style-body-3 text-gray-700">
        {{ formatPrice(localMin) }}-{{ formatPrice(localMax) }}{{ currency }}
      </div>

      <!-- Slider -->
      <div class="relative h-5 flex items-center">
        <!-- Track Background -->
        <div
          class="absolute left-0 right-0 h-1 bg-gray-300 rounded-full pointer-events-none"
        >
          <!-- Active Fill -->
          <div
            class="absolute top-0 h-full bg-blue-500 rounded-full"
            :style="{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }"
          />
        </div>

        <!-- Min Thumb -->
        <input
          type="range"
          class="absolute left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-blue-700 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(59,130,246,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[5px] [&::-moz-range-thumb]:border-blue-700 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(59,130,246,0.4)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 hover:[&::-moz-range-thumb]:scale-125 hover:[&::-moz-range-thumb]:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
          :min="min"
          :max="max"
          :step="step"
          v-model.number="localMin"
          @input="onMinChange"
        />

        <!-- Max Thumb -->
        <input
          type="range"
          class="absolute left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-blue-700 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(59,130,246,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(59,130,246,0.2)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[5px] [&::-moz-range-thumb]:border-blue-700 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(59,130,246,0.4)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150 hover:[&::-moz-range-thumb]:scale-125 hover:[&::-moz-range-thumb]:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
          :min="min"
          :max="max"
          :step="step"
          v-model.number="localMax"
          @input="onMaxChange"
        />

        <!-- Dynamic Min Label -->
        <div
          class="absolute top-4 -translate-x-1/2 text-center pointer-events-none mt-1"
          :style="{
            left: `calc(${(localMin - min) / (max - min)} * (100% - 18px) + 9px)`,
          }"
        >
          <span class="style-body-4 text-blue-700">{{
            formatPrice(localMin)
          }}</span>
        </div>

        <div
          class="absolute top-4 -translate-x-1/2 text-center pointer-events-none mt-1"
          :style="{
            left: `calc(${(localMax - min) / (max - min)} * (100% - 18px) + 9px)`,
          }"
        >
          <span class="style-body-4 text-blue-700">{{
            formatPrice(localMax)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
