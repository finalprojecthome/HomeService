<script setup lang="ts">
// A generic table shell for consistent styling
defineProps<{
  // Optional loading state
  loading?: boolean;
}>();
</script>

<template>
  <div class="w-full overflow-x-auto rounded-lg border border-gray-200">
    <table class="w-full text-left text-sm text-gray-500">
      <thead class="bg-gray-50 text-xs uppercase text-gray-700">
        <tr>
          <!-- Header slots for defining table columns -->
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="100%" class="p-4 text-center">
            <div class="flex justify-center items-center">
              <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
            </div>
          </td>
        </tr>
        <slot name="body" v-else></slot>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@reference "../../style.css";

/* Scoped styles that target slotted headers and body rows */
:deep(th) {
  @apply px-6 py-3 font-medium text-gray-700 text-sm;
}
:deep(td) {
  @apply px-6 py-4 border-t border-gray-100 text-gray-800 bg-white text-sm;
}
:deep(tr:hover td) {
  @apply bg-gray-50;
}
</style>
