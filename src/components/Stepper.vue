<script setup lang="ts">
import { computed, type Component } from "vue";
import cn from "../utils/cn";
import { DetailIcon, Pencil, CheckedCard } from "./icons";

export interface StepperStep {
  id: string;
  label: string;
  icon?: Component;
}

const props = withDefaults(
  defineProps<{
    steps: StepperStep[];
    activeIndex?: number;
    clickable?: boolean;
    iconSize?: number;
  }>(),
  {
    steps: () => [],
    activeIndex: -1,
    clickable: true,
    iconSize: 28,
  },
);

const emit = defineEmits<{
  (e: "change", index: number): void;
}>();

function defaultIconByIndex(idx: number) {
  // Order of icons for demo/payment flow:
  // 0 => services, 1 => info, 2 => payment
  const icons = [DetailIcon, Pencil, CheckedCard];
  return icons[idx] ?? CheckedCard;
}

const safeActiveIndex = computed(() => {
  const max = props.steps.length - 1;
  if (max < 0) return -1;

  const ai = props.activeIndex ?? -1;
  if (ai < 0) return -1;
  return Math.min(Math.max(ai, 0), max);
});

function isActive(index: number) {
  return index === safeActiveIndex.value;
}

function isCompleted(index: number) {
  return index < safeActiveIndex.value;
}

function circleClass(index: number) {
  return cn(
    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors",
    isCompleted(index)
      ? "border-blue-500 text-white bg-blue-500"
      : isActive(index)
        ? "border-blue-600 text-blue-600 bg-white"
        : "border-gray-300 text-gray-400 bg-white",
  );
}

function connectorClass(stepIndex: number) {
  // connector after stepIndex => completed when stepIndex is completed
  return cn(
    "h-[2px] flex-1 transition-colors mt-6",
    stepIndex < safeActiveIndex.value ? "bg-blue-200" : "bg-gray-200",
  );
}
</script>

<template>
  <div
    v-if="steps.length"
    class="style-card-box style-shadow px-8 py-6 w-full"
    style="--c-light: #E7EEFF"
  >
    <div class="flex items-start w-full">
      <template v-for="(step, idx) in steps" :key="step.id">
        <div class="w-[160px] flex flex-col items-center shrink-0 text-center">
          <button
            v-if="clickable"
            type="button"
            class="focus:outline-none"
            :aria-label="step.label"
            :aria-current="isActive(idx)"
            :disabled="idx === safeActiveIndex"
            @click="emit('change', idx)"
          >
            <div :class="circleClass(idx)">
              <component :is="step.icon ?? defaultIconByIndex(idx)" :size="iconSize" />
            </div>
          </button>

          <div v-else :class="circleClass(idx)">
            <component :is="step.icon ?? defaultIconByIndex(idx)" :size="iconSize" />
          </div>

          <span
            :class="
              cn(
                'style-body-2',
                'whitespace-nowrap mt-4',
                isActive(idx)
                  ? 'text-blue-600'
                  : isCompleted(idx)
                    ? 'text-blue-600'
                    : 'text-gray-500',
              )
            "
          >
            {{ step.label }}
          </span>
        </div>

        <div v-if="idx < steps.length - 1" :class="connectorClass(idx)" />
      </template>
    </div>
  </div>
</template>

