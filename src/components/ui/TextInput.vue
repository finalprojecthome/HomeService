<script setup lang="ts">
import { computed } from "vue";
import { ExclamationCircleIcon } from "../icons";
import cn from "../../utils/cn";

type InputType = "text" | "email" | "password" | "tel";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    placeholder?: string;
    type?: InputType;
    name?: string;
    autocomplete?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string | null;
    class?: string;
  }>(),
  {
    modelValue: "",
    label: "",
    placeholder: "",
    type: "text",
    name: undefined,
    autocomplete: undefined,
    disabled: false,
    required: false,
    error: null,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputClass = computed(() =>
  cn(
    "w-full rounded-lg border px-4 py-3 style-body-3 outline-none transition-colors",
    "bg-white text-gray-950 placeholder:text-gray-700",
    props.error && "pr-11",
    props.disabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
    props.error
      ? "border-red focus:border-red"
      : "border-gray-300 focus:border-blue-600",
    props.class,
  ),
);
</script>

<template>
  <label class="flex flex-col gap-[4px]">
    <span v-if="label" class="style-headline-5 text-gray-900">
      {{ label }}<span v-if="required" class="text-red">*</span>
    </span>
    <div class="relative">
      <input
        :value="modelValue"
        :type="type"
        :name="name"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClass"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <component
        :is="ExclamationCircleIcon"
        v-if="error"
        class="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-red"
      />
    </div>
    <span v-if="error" class="style-body-4 text-red">{{ error }}</span>
  </label>
</template>

