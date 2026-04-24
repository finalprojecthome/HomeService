<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ClockIcon } from "../icons/icons";

type TimeValue = string | null;

type Props = {
  modelValue: TimeValue;
  placeholder?: string;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  placeholder: "กรุณาเลือกเวลา",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: TimeValue): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const selectedHour = ref<number | null>(null);
const selectedMinute = ref<number | null>(null);

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function parseTimeValue(value: string | null) {
  if (!value) {
    selectedHour.value = null;
    selectedMinute.value = null;
    return;
  }

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isInteger(hour) &&
    Number.isInteger(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  ) {
    selectedHour.value = hour;
    selectedMinute.value = minute;
    return;
  }

  selectedHour.value = null;
  selectedMinute.value = null;
}

watch(
  () => props.modelValue,
  (value) => {
    parseTimeValue(value);
  },
  { immediate: true }
);

const displayValue = computed(() => {
  if (selectedHour.value === null || selectedMinute.value === null) return "";
  return `${pad(selectedHour.value)}:${pad(selectedMinute.value)}`;
});

function openTimePicker() {
  if (props.disabled) return;
  isOpen.value = true;
}

function closeTimePicker() {
  isOpen.value = false;
}

function toggleTimePicker() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectHour(hour: number) {
  selectedHour.value = hour;
}

function selectMinute(minute: number) {
  selectedMinute.value = minute;
}

function confirmTime() {
  if (selectedHour.value === null || selectedMinute.value === null) return;

  const value = `${pad(selectedHour.value)}:${pad(selectedMinute.value)}`;
  emit("update:modelValue", value);
  closeTimePicker();
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null;

  if (containerRef.value && target && !containerRef.value.contains(target)) {
    closeTimePicker();
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <input
      type="text"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 hover:border-blue-400 cursor-pointer"
      @click="toggleTimePicker"
      @focus="openTimePicker"
    />

    <ClockIcon
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />

    <div
      v-if="isOpen"
      class="absolute right-0 z-20 mt-2 w-[160px] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
    >
      <div class="flex h-60">
        <div class="flex-1 overflow-y-auto border-r border-gray-100">
          <button
            v-for="hour in hours"
            :key="hour"
            type="button"
            class="flex w-full justify-center py-2 text-sm cursor-pointer transition"
            :class="
              selectedHour === hour
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            "
            @click="selectHour(hour)"
          >
            {{ pad(hour) }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <button
            v-for="minute in minutes"
            :key="minute"
            type="button"
            class="flex w-full justify-center py-2 text-sm cursor-pointer transition"
            :class="
              selectedMinute === minute
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            "
            @click="selectMinute(minute)"
          >
            {{ pad(minute) }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <span class="text-sm text-gray-700">
          {{ displayValue || "--:--" }}
        </span>

        <button
          type="button"
          class="text-sm font-semibold text-blue-600 cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed underline"
          :disabled="selectedHour === null || selectedMinute === null"
          @click="confirmTime"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  </div>
</template>