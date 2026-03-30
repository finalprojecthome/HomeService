<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { isToday } from "date-fns";
type DateValue = string | null;

type Props = {
  modelValue: DateValue;
  placeholder?: string;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select date",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: DateValue): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const currentMonth = ref(new Date());

const selectedDate = computed<Date | null>(() => {
  if (!props.modelValue) return null;

  const parsed = parseISO(props.modelValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
});

const displayValue = computed(() => {
  if (!selectedDate.value) return "";
  return format(selectedDate.value, "d MMM,yyyy");
});

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentMonth.value);
  const monthEnd = endOfMonth(currentMonth.value);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
});

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function openCalendar() {
  if (props.disabled) return;
  isOpen.value = true;
}

function isTodayDate(date: Date) {
  return isToday(date);
}

function closeCalendar() {
  isOpen.value = false;
}

function toggleCalendar() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectDate(date: Date) {
  emit("update:modelValue", format(date, "yyyy-MM-dd"));
  currentMonth.value = date;
  closeCalendar();
}

function goToPreviousMonth() {
  currentMonth.value = addMonths(currentMonth.value, -1);
}

function goToNextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1);
}

function isSelected(date: Date) {
  return !!selectedDate.value && isSameDay(date, selectedDate.value);
}

function isOutsideMonth(date: Date) {
  return !isSameMonth(date, currentMonth.value);
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null;

  if (containerRef.value && target && !containerRef.value.contains(target)) {
    closeCalendar();
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);

  if (selectedDate.value) {
    currentMonth.value = selectedDate.value;
  }
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
      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
      @click="toggleCalendar"
      @focus="openCalendar"
    />

    <div
      v-if="isOpen"
      class="absolute left-0 z-20 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div class="mb-4 flex items-center justify-between">
        <div class="text-sm font-semibold text-gray-900">
          {{ format(currentMonth, "MMMM yyyy") }}
        </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          @click="goToPreviousMonth"
        >
          ‹
        </button>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
          @click="goToNextMonth"
        >
          ›
        </button>
      </div>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center">
        <div
          v-for="label in weekdayLabels"
          :key="label"
          class="mb-1 text-xs font-medium text-gray-400"
        >
          {{ label }}
        </div>

        <button
          v-for="day in calendarDays"
          :key="day.toISOString()"
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full text-sm transition cursor-pointer"
          :class="[
            isSelected(day)
              ? 'bg-blue-600 text-white'
              : isTodayDate(day)
                ? 'border border-blue-600 text-grey-900'
                : isOutsideMonth(day)
                    ? 'text-gray-300'
                    : 'text-gray-700 hover:bg-gray-100',
          ]"
          @click="selectDate(day)"
        >
          {{ format(day, "d") }}
        </button>
      </div>
    </div>
  </div>
</template>