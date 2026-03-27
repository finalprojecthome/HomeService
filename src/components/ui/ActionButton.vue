<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from "vue";
import {
  baseStyle,
  sizes,
  variants,
  type ButtonSize,
  type ButtonVariant,
} from "../../constants/buttonVariant";
import cn from "../../utils/cn";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonHTMLAttributes["type"];
  disabled?: ButtonHTMLAttributes["disabled"];
  class?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "sm",
  type: "button",
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
  <button :type="props.type" :disabled="props.disabled" :class="buttonClass">
    <slot />
  </button>
</template>
