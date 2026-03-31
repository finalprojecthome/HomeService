<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import cn from "../../utils/cn";
const PRIMARY = "#336DF2";
const LIGHT = "#E7EEFF";

export interface SelectFilterOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options?: SelectFilterOption[];
    placeholder?: string;
    label?: string;
  }>(),
  {
    modelValue: "",
    options: () => [],
    placeholder: "Select...",
    label: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const isOpen = ref(false);
const wrapperRef = ref<HTMLElement>();

const selectedLabel = computed(() => {
  const option = props.options.find((o) => o.value === props.modelValue);
  return option?.label ?? props.placeholder;
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(value: string) {
  emit("update:modelValue", value);
  isOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <div
    ref="wrapperRef"
    class="relative inline-block min-w-40"
    :style="{ '--c-primary': PRIMARY, '--c-light': LIGHT }"
  >
  <div
      :class="
        cn(
          'border-x px-8 transition-colors',
          'border-gray-300'
        )
      "
    >
    <span v-if="label" class="style-body-4 text-gray-500 mb-1 block">
      {{ label }}
    </span>
    
      <button
        type="button"
        :class="
          cn(
            'flex items-center w-full transition-colors rounded-full group/trigger',
            !modelValue && 'hover:bg-gray-100 hover:text-black',
            modelValue && 'bg-(--c-light) hover:bg-(--c-light)'
          )
        "
        @click="toggleDropdown"
      >
        <span
          :class="
            cn(
              'flex-1 text-left px-3 py-2 truncate',
              modelValue ? 'style-headline-5 text-gray-950' : 'style-body-2 text-gray-500'
            )
          "
        >
          {{ selectedLabel }}
        </span>
        <span class="flex items-center self-stretch px-2">
          <svg
            class="w-4 h-4 text-gray-400 transition-transform"
            :class="isOpen && 'rotate-180'"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg style-shadow overflow-hidden"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="
            cn(
              'w-full text-left px-4 py-2.5 style-body-2 transition-colors bg-transparent border-0 appearance-none',
              option.value === modelValue
                ? 'text-(--c-primary) font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            )
          "
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
