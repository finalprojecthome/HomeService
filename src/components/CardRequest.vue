<script setup lang="ts">
import ActionButton from "./ui/ActionButton.vue";

export interface CardRequestProps {
  // Required data
  title: string;
  dateStr: string;
  time: string;
  serviceName: string;
  orderId: string;
  price: string | number;
  location: string;

  // Optional Labels (allow overriding)
  dateLabel?: string;
  serviceLabel?: string;
  orderIdLabel?: string;
  priceLabel?: string;
  locationLabel?: string;
  cancelText?: string;
  acceptText?: string;
  viewMapText?: string;

  // Preferences
  showMapIcon?: boolean;
}

withDefaults(defineProps<CardRequestProps>(), {
  dateLabel: "วันเวลาดำเนินการ",
  serviceLabel: "รายการ",
  orderIdLabel: "รหัสคำสั่งซ่อม",
  priceLabel: "ราคารวม",
  locationLabel: "สถานที่",
  cancelText: "ปฏิเสธ",
  acceptText: "รับงาน",
  viewMapText: "ดูแผนที่",
  showMapIcon: true,
});

const emit = defineEmits<{
  (e: "accept"): void;
  (e: "reject"): void;
  (e: "viewMap"): void;
}>();
</script>

<template>
  <article
    class="flex flex-col w-full pt-[20px] px-[24px] pb-[24px] gap-[16px] bg-white border border-gray-100 rounded-[8px] style-shadow md:max-w-[1120px]"
  >
    <!-- ===== Header: Request Title & Schedule ===== -->
    <header
      class="flex flex-col justify-between gap-[8px] md:flex-row md:items-start md:gap-4 md:border-none md:pb-0"
    >
      <h3 class="text-black style-headline-2">{{ title }}</h3>
      <div class="flex flex-col md:flex-row md:items-center md:gap-[16px]">
        <span class="text-gray-700 style-headline-5">{{ dateLabel }}</span>
        <span class="text-blue-500 style-headline-5">
          {{ dateStr }} เวลา {{ time }} น.
        </span>
      </div>
    </header>

    <!-- ===== Body: Service Details & Actions ===== -->
    <div
      class="flex flex-col w-full gap-[32px] md:flex-row md:items-end md:justify-between"
    >
      <section class="flex flex-col gap-[8px]">
        <!-- Service -->
        <div class="grid grid-cols-[120px_1fr] items-start gap-x-4">
          <span class="text-gray-700 style-headline-5">{{ serviceLabel }}</span>
          <span class="text-black style-body-1">{{ serviceName }}</span>
        </div>

        <!-- Order ID -->
        <div class="grid grid-cols-[120px_1fr] items-start gap-x-4">
          <span class="text-gray-700 style-headline-5">{{ orderIdLabel }}</span>
          <span class="text-black style-body-1">{{ orderId }}</span>
        </div>

        <!-- Price -->
        <div class="grid grid-cols-[120px_1fr] items-start gap-x-4">
          <span class="text-gray-700 style-headline-5">{{ priceLabel }}</span>
          <span class="text-black style-body-1">{{ price }} ฿</span>
        </div>

        <!-- Location -->
        <div class="grid grid-cols-[120px_1fr] items-start gap-x-4">
          <span class="text-gray-700 style-headline-5">{{
            locationLabel
          }}</span>
          <div class="flex flex-col items-start gap-1">
            <span class="text-black leading-snug style-body-1">
              {{ location }}
            </span>
            <button
              v-if="showMapIcon"
              type="button"
              class="flex items-center gap-2 mt-1 text-blue-500 transition-colors cursor-pointer hover:text-blue-600"
              @click="emit('viewMap')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="#346BFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M 12 18.5 L 7.06 12.73 A 6.5 6.5 0 1 1 16.94 12.73 Z"
                />
                <circle cx="12" cy="8.5" r="2.5" />
                <path d="M 6.5 20 A 5.5 1.5 0 0 0 17.5 20" />
              </svg>

              <span
                class="underline decoration-1 underline-offset-4 style-headline-5"
              >
                {{ viewMapText }}
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- ===== Footer: Action Buttons ===== -->
      <footer class="flex flex-row items-end justify-end w-full gap-3 md:w-fit">
        <ActionButton
          variant="secondary"
          class="flex-1 md:flex-none"
          @click="emit('reject')"
        >
          {{ cancelText }}
        </ActionButton>
        <ActionButton class="flex-1 md:flex-none" @click="emit('accept')">
          {{ acceptText }}
        </ActionButton>
      </footer>
    </div>
  </article>
</template>
