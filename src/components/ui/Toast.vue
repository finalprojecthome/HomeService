<script setup lang="ts">
import cn from "../../utils/cn";
import Icon from "./Icon.vue";
import { variants, type ToastVariant } from "../../utils/toast";

const props = defineProps<{
  title: string;
  description?: string;
  variant?: ToastVariant;
  class?: string;
  onCloseToast?: () => void;
}>();

const closeIconPath = "M6 18 18 6M6 6l12 12";
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
        <Icon :path="closeIconPath" class="w-5 h-5" />
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
