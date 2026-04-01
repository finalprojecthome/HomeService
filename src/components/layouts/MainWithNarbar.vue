<script setup lang="ts">
import cn from "../../utils/cn";
import Narbar from "./Narbar.vue";
import Footer from "../Footer.vue";

const props = defineProps<{ class?: string }>();
</script>

<template>
  <Narbar />
  <main :class="cn('mt-13 md:mt-20', props.class)">
    <slot />
  </main>
  <Footer />
</template>
