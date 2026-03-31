<script setup lang="ts">
import { computed } from "vue";
import { ErrorMessage, Field } from "vee-validate";
import Checkbox from "../ui/Checkbox.vue";

interface Props {
  name: string;
  label?: string;
  modelValue?: boolean;
  disabled?: boolean;
  rules?: string;
  required?: boolean;
  class?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const checkboxRules = computed(() => {
  const rules = props.rules ?? "";

  if (props.required) {
    return "checkboxRequired|" + rules;
  }

  return rules;
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <Field
      :name="props.name"
      type="checkbox"
      :rules="checkboxRules"
      :disabled="props.disabled"
      v-slot="{ value, handleChange }"
    >
      <Checkbox
        :label="props.label"
        :disabled="props.disabled"
        :model-value="value ?? false"
        @update:modelValue="
          (checked) => {
            handleChange(checked);
            emit('update:modelValue', checked);
          }
        "
        :class="props.class"
      >
        <slot>
          {{ label }}
        </slot>
      </Checkbox>
    </Field>
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
