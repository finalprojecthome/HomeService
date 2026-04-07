<script setup lang="ts">
import { computed } from "vue";
import { ErrorMessage, Field, useFieldError } from "vee-validate";
import Input from "../ui/Input.vue";

interface Props {
  name: string;
  label: string;
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
    return "inputRequired|" + rules;
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
      {{ label }}
      <span v-if="props.required" class="text-red">*</span>
    </label>
    <Field
      :name="props.name"
      :type="props.type"
      :value="props.value"
      :rules="inputRules"
      :disabled="props.disabled"
      v-slot="{ field }"
    >
      <Input
        v-bind="field"
        :type="props.type"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :inputmode="props.inputmode"
        :isError="isFieldError"
        :disabled="props.disabled"
        :class="props.class"
      />
    </Field>
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
