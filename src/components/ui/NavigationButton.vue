<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from "vue";
import { RouterLink } from "vue-router";
import {
  baseStyle,
  sizes,
  variants,
  type ButtonSize,
  type ButtonVariant,
} from "../../constants/buttonVariant";
import cn from "../../utils/cn";

interface ButtonProps {
  to: `/${string}`;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: ButtonHTMLAttributes["disabled"];
  class?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "sm",
});

const buttonClass = computed(() =>
  cn(
    baseStyle,
    (props.variant === "primary" || props.variant === "secondary") &&
      sizes[props.size],
    variants[props.variant],
    props.class,
  ),
);
</script>

<template>
  <RouterLink :to="props.to" :disabled="props.disabled" :class="buttonClass">
    <slot />
  </RouterLink>
</template>
