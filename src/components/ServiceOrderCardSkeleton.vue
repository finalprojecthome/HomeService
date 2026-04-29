<script setup lang="ts">
import Skeleton from "./ui/Skeleton.vue";
</script>

<template>
  <div
    class="style-card-box p-5 md:p-6 w-full flex gap-5 overflow-hidden"
    aria-hidden="true"
  >
    <div class="flex-1 w-full min-w-0">
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 pt-1 gap-3 sm:gap-0"
      >
        <Skeleton
          class="h-7 sm:h-[22px] w-[92%] sm:w-[55%] max-w-xl rounded-md"
        />
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <Skeleton class="h-[15px] w-13 sm:w-14 rounded" />
          <Skeleton class="h-7 min-w-22 w-28 rounded-full" />
        </div>
      </div>

      <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-[14px] sm:text-[15px]">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
        >
          <div class="flex items-center gap-2 sm:gap-3 text-gray-500 min-w-0 sm:flex-1">
            <Skeleton
              class="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0 rounded-[3px]"
            />
            <Skeleton class="h-[18px] w-full max-w-70 sm:max-w-88" />
          </div>
          <div class="hidden sm:flex items-center gap-3 shrink-0">
            <Skeleton class="h-[15px] w-18" />
            <Skeleton class="h-7 w-25 rounded-md" />
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 text-gray-500">
          <Skeleton
            class="w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0 rounded-[3px]"
          />
          <Skeleton class="h-[18px] w-50 sm:w-55 max-w-[85%]" />
        </div>

        <div class="flex sm:hidden items-center gap-2 sm:gap-3">
          <Skeleton class="h-4 w-18" />
          <Skeleton class="h-5 w-22 rounded-md" />
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5"
      >
        <div class="min-w-0">
          <Skeleton class="h-[15px] w-16 mb-2 rounded" />
          <div class="ml-1 space-y-1.5">
            <div class="flex items-start gap-2.5">
              <Skeleton class="mt-[0.35rem] size-1.5 rounded-full shrink-0" />
              <Skeleton class="h-4 w-52 sm:w-62 max-w-[calc(100%-1rem)]" />
            </div>
          </div>
        </div>

        <Skeleton
          class="h-10 w-full sm:w-auto sm:min-w-[148px] rounded-lg shrink-0 mt-2 sm:mt-0"
        />
      </div>
    </div>
  </div>
</template>
