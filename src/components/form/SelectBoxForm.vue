<script setup lang="ts">
import { computed, useSlots } from "vue";
import { ErrorMessage, Field, useFieldError } from "vee-validate";
import SelectBox from "../ui/SelectBox.vue";

interface Props {
  name: string;
  value: string;
  label?: string;
  showError?: boolean;
  disabled?: boolean;
  rules?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  showError: true,
  disabled: false,
  rules: "",
  required: false,
  class: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
const slots = useSlots();

const errorMessage = useFieldError(props.name);
const isFieldError = computed(() => Boolean(errorMessage.value));
</script>

<template>
  <div class="flex flex-col flex-1 gap-1">
    <Field
      :name="props.name"
      :rules="props.rules"
      :disabled="props.disabled"
      v-slot="{ value, handleChange }"
    >
      <SelectBox
        :model-value="value ?? ''"
        :value="props.value"
        :label="props.label"
        :disabled="props.disabled"
        :class="props.class"
        @update:modelValue="
          (selectedValue) => {
            handleChange(selectedValue);
            emit('update:modelValue', selectedValue);
          }
        "
      >
        <template v-if="slots.icon" #icon>
          <slot name="icon" :isError="isFieldError" />
        </template>
      </SelectBox>
    </Field>
    <ErrorMessage
      v-if="showError"
      :name="props.name"
      class="style-body-4 text-red"
    />
  </div>
</template>
