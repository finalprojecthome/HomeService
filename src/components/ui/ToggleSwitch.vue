<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const isChecked = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
    emit('change', val);
  }
});
</script>

<template>
  <label class="inline-flex items-center cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <div class="relative">
      <input 
        type="checkbox" 
        v-model="isChecked"
        class="sr-only peer" 
        :disabled="disabled"
      />
      <!-- Track -->
      <div 
        class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-colors"
      ></div>
      <!-- Thumb -->
      <div 
        class="absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5"
      ></div>
    </div>
    <!-- Optional Label -->
    <span v-if="label" class="ml-3 text-sm font-medium text-gray-900 style-body-1 dark:text-gray-300">
      {{ label }}
    </span>
  </label>
</template>
