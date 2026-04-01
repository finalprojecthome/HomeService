<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import CheckBox from "../ui/CheckBox.vue";

interface Props {
  name: string;
  label?: string;
  modelValue?: boolean;
  disabled?: boolean;
  rules?: string;
  class?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <Field
      :name="props.name"
      type="checkbox"
      :rules="props.rules"
      :disabled="props.disabled"
      v-slot="{ value, handleChange }"
    >
      <CheckBox
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
      </CheckBox>
    </Field>
    <ErrorMessage :name="props.name" class="style-body-4 text-red" />
  </div>
</template>
