<script setup lang="ts">
import { ExclamationCircleIcon } from "../icons";
import cn from "../../utils/cn";

interface Props {
  name: string;
  value?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autocomplete?: string;
  inputmode?:
    | "text"
    | "email"
    | "search"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal";
  disabled?: boolean;
  isError?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inputmode: "text",
  autocomplete: "off",
});
</script>

<template>
  <div :class="cn('relative', props.class)">
    <input
      :id="props.name + '-id'"
      :name="props.name"
      :type="props.type"
      :value="props.value"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :inputmode="props.inputmode"
      :disabled="props.disabled"
      :class="
        cn(
          'w-full px-4 py-2.5 style-body-2 text-gray-950 bg-white rounded-lg ring ring-inset ring-gray-300 transition-all outline-none',
          'focus-visible:ring-blue-600 placeholder:text-gray-700',
          'disabled:text-gray-400 disabled:bg-gray-100 disabled:ring-gray-300 disabled:placeholder:text-gray-400',
          isError && 'ring-red focus-visible:ring-red',
        )
      "
    />
    <component
      v-if="isError && !disabled"
      :is="ExclamationCircleIcon"
      class="absolute top-3.5 right-3.5 size-4 text-red"
    />
  </div>
</template>
