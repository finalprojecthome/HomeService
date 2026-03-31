<script setup lang="ts">
import { computed } from "vue";
import { ErrorMessage, useFieldError } from "vee-validate";
import Input from "../ui/Input.vue";

interface Props {
  name: string;
  label: string;
  value?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autocomplete?: string;
  inputmode?:string
  disabled?: boolean;
  rules?: string;
  required?: boolean;
  class?: string;
}

const props = defineProps<Props>();
const errorMessage = useFieldError(props.name);

const isFieldError = computed(() => Boolean(errorMessage.value));

const inputRules = computed(() => {
  const rules = props.rules ?? "";

  if (props.required) {
    return "required|" + rules;
  }

  return rules;
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      :for="props.name + '-id'"
      class="flex gap-0.5 w-fit style-headline-5"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red">*</span>
    </label>
    <Input
      :id="props.name"
      :name="props.name"
      :type="props.type"
      :value="props.value"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :inputmode="props.inputmode"
      :rules="inputRules"
      :disabled="props.disabled"
      :isError="isFieldError"
      :class="props.class"
    />
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
