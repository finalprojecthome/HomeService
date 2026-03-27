<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface Props {
  modelValue?: string | number | null;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: "Place Holder",
  label: "",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  change: [value: string | number | null];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  return props.options.find((o) => o.value === props.modelValue)?.label ?? "";
});

function toggleDropdown() {
  if (!props.disabled) isOpen.value = !isOpen.value;
}

function selectOption(option: DropdownOption) {
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
}

function handleOutsideClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleOutsideClick));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleOutsideClick),
);
</script>

<template>
  <div class="flex flex-col gap-1.5 min-w-[240px]">
    <label v-if="label" class="style-headline-5 text-gray-900">{{
      label
    }}</label>

    <div class="relative" ref="dropdownRef">
      <button
        type="button"
        class="w-full flex items-center justify-between px-[16px] py-[10px] bg-white border rounded-[8px] style-body-3 text-left transition-all duration-200 focus:outline-none"
        :class="[
          isOpen
            ? 'border-blue-600'
            : 'border-blue-600 hover:ring-[3px] hover:ring-blue-500/15',
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-50'
            : 'cursor-pointer',
        ]"
        @click="toggleDropdown"
        :disabled="disabled"
        :aria-expanded="isOpen"
      >
        <span :class="modelValue ? 'text-gray-900' : 'text-gray-700'">
          {{ selectedLabel || placeholder }}
        </span>
        <span
          class="text-gray-500 flex items-center transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6L8 10L12 6Z" fill="#A3A3A3" />
          </svg>
        </span>
      </button>

      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1.5"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1.5"
      >
        <ul
          v-if="isOpen"
          class="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[8px] style-shadow py-[8px] z-50 list-none mt-1"
          role="listbox"
        >
          <li
            v-for="option in options"
            :key="option.value"
            class="style-body-3 px-[14px] py-[6px] cursor-pointer text-gray-700 transition-colors duration-150"
            :class="
              modelValue === option.value
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-100 hover:text-gray-950'
            "
            role="option"
            :aria-selected="modelValue === option.value"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>
