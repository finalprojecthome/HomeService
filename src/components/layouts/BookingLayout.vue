<script setup lang="ts">
import Narbar from "./Narbar.vue";
import Breadcrumb, { type BreadcrumbItem } from "../ui/Breadcrumb.vue";
import Stepper, { type StepperStep } from "../Stepper.vue";

interface Props {
  bannerImage?: string;
  bannerAlt?: string;
  breadcrumbItems?: BreadcrumbItem[];
  steps?: StepperStep[];
  activeStep?: number;
  stickySummary?: boolean;
  showBreadcrumb?: boolean;
  showStepper?: boolean;
}

withDefaults(defineProps<Props>(), {
  bannerImage: "",
  bannerAlt: "Booking banner",
  breadcrumbItems: () => [],
  steps: () => [],
  activeStep: 0,
  stickySummary: true,
  showBreadcrumb: true,
  showStepper: true,
});

const emit = defineEmits<{
  (e: "breadcrumb-navigate", index: number): void;
  (e: "step-change", index: number): void;
}>();

function handleBreadcrumbNavigate(index: number) {
  emit("breadcrumb-navigate", index);
}

function handleStepChange(index: number) {
  emit("step-change", index);
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Narbar />

    <!-- เว้นพื้นที่ให้ navbar fixed -->
    <div class="pt-[70px] md:pt-[80px]">
      <!-- Hero / Banner -->
      <section class="relative">
        <div class="h-[154px] overflow-hidden md:h-[220px] lg:h-[250px]">
          <img
            v-if="bannerImage"
            :src="bannerImage"
            :alt="bannerAlt"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="h-full w-full bg-linear-to-r from-blue-100 to-blue-50"
          />
        </div>

        <!-- Breadcrumb -->
        <div
          v-if="showBreadcrumb && breadcrumbItems.length"
          class="absolute left-4 top-6 z-10 md:left-8 lg:left-20 xl:left-32"
        >
          <Breadcrumb
            :items="breadcrumbItems"
            size="md"
            @navigate="handleBreadcrumbNavigate"
          />
        </div>

        <!-- Stepper -->
        <div
          v-if="showStepper && steps.length"
          class="absolute left-1/2 bottom-0 z-10 w-full max-w-[1120px] -translate-x-1/2 translate-y-1/2 px-4 md:px-8 lg:px-12"
        >
          <Stepper
            :steps="steps"
            :active-index="activeStep"
            :clickable="false"
            @change="handleStepChange"
          />
        </div>
      </section>

      <!-- Main content -->
      <section class="mx-auto w-full max-w-[1120px] px-40 pt-20 pb-28 md:px-8 bg-red">
        <div
          :class="
            $slots.summary
              ? 'grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]'
              : 'block'
          "
        >
          <!-- Left content -->
          <main class="min-w-0">
            <slot />
          </main>

          <!-- Right summary -->
          <aside v-if="$slots.summary" class="min-w-0">
            <div :class="stickySummary ? 'lg:sticky lg:top-28' : ''">
              <slot name='summary' />
            </div>
          </aside>
        </div>
      </section>

      <!-- Bottom actions -->
      <footer
        class="fixed right-0 bottom-0 left-0 z-30 border-t border-gray-200 bg-green-700 backdrop-blur"
      >
        <div
          class="mx-auto flex w-full max-w-[1120px] items-center justify-between px-4 py-4 md:px-8"
        >
          <div>
            <slot name="footer-left" />
          </div>

          <div class="flex items-center gap-3">
            <slot name="footer-right" />
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>