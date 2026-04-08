<script setup lang="ts">
import { computed } from "vue";
import { ErrorMessage, Field, useFieldError } from "vee-validate";
import TextArea from "../ui/TextArea.vue";

interface Props {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
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
      :value="props.value"
      :rules="inputRules"
      :disabled="props.disabled"
      v-slot="{ field }"
    >
      <TextArea
        v-bind="field"
        :placeholder="props.placeholder"
        :isError="isFieldError"
        :disabled="props.disabled"
        :class="props.class"
      />
    </Field>
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
