<script setup lang="ts">
import { computed } from "vue";
import { ErrorMessage, Field, useFieldError } from "vee-validate";
import Dropdown, { type DropdownOption } from "../ui/Dropdown.vue";

interface Props {
  name: string;
  label: string;
  value?: string | number | null;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  rules?: string;
  required?: boolean;
  class?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
}>();

const errorMessage = useFieldError(props.name);
const isFieldError = computed(() => Boolean(errorMessage.value));

const inputRules = computed(() => {
  const rules = props.rules ?? "";

  if (props.required) {
    return "dropdownRequired|" + rules;
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
      :rules="inputRules"
      :disabled="props.disabled"
      v-slot="{ value, handleChange }"
    >
      <Dropdown
        :id="props.name + '-id'"
        :model-value="value ?? props.value ?? null"
        :options="props.options"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :isError="isFieldError"
        :class="props.class"
        @update:modelValue="
          (selectedValue) => {
            handleChange(selectedValue);
            emit('update:modelValue', selectedValue);
          }
        "
      />
    </Field>
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
