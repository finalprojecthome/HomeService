<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import { UserIcon } from "../icons/icons";
import cn from "../../utils/cn";

interface Props {
  src?: string | null;
  alt?: string | null;
  fallbackIcon?: Component;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackIcon: () => UserIcon,
});

const isImageLoadFailed = ref(false);

const hasImage = computed(
  () =>
    Boolean(props.src && props.src.trim().length > 0) &&
    !isImageLoadFailed.value,
);

function handleImageError() {
  isImageLoadFailed.value = true;
}
</script>

<template>
  <figure
    :class="
      cn(
        'inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-500',
        props.class,
      )
    "
  >
    <img
      v-if="hasImage"
      :src="props.src ?? undefined"
      :alt="props.alt ?? 'Avatar'"
      class="size-full object-cover"
      @error="handleImageError"
    />
    <component :is="props.fallbackIcon" v-else class="size-1/2" />
  </figure>
</template>
