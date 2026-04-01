<script setup lang="ts">
import cn from "../../utils/cn";
import { variants, type ToastVariant } from "../../utils/toast";
import { CloseIcon } from "../icons";

const props = defineProps<{
  title: string;
  description?: string;
  variant?: ToastVariant;
  class?: string;
  onCloseToast?: () => void;
}>();
</script>

<template>
  <article
    class="p-4 px-5 rounded-2xl font-(family-name:--default-font-family)"
    :class="cn(variants[props.variant ?? 'success'], props.class)"
    role="status"
    aria-live="polite"
  >
    <header class="flex justify-between items-start gap-4 pb-2">
      <h3 class="style-headline-2 md:whitespace-nowrap md:pr-30">
        {{ title }}
      </h3>
      <button
        type="button"
        class="shrink-0 p-0 border-0 bg-transparent cursor-pointer text-inherit"
        aria-label="Close notification"
        @click="props.onCloseToast?.()"
      >
        <CloseIcon :size="20" class="shrink-0" />
      </button>
    </header>
    <p
      v-if="props.description"
      class="style-body-2 md:whitespace-nowrap md:pr-10"
    >
      {{ description }}
    </p>
  </article>
</template>
