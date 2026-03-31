<script setup lang="ts">
import { ref } from 'vue';

export interface OrderItem {
  name: string;
  quantity: number;
}

const props = withDefaults(defineProps<{
  items: OrderItem[];
  date?: string;
  time?: string;
  location?: string;
  discount?: number;
  totalPrice: number;
  startExpanded?: boolean;
}>(), {
  startExpanded: true,
});

const isExpanded = ref(props.startExpanded);

// Toggle the expansion state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="style-card-box style-shadow bg-white p-5 w-full max-w-[360px]">
    <!-- Header with Toggle -->
    <div 
      class="flex justify-between items-center cursor-pointer mb-1" 
      @click="toggleExpanded"
    >
      <h3 class="text-[15px] text-gray-600 font-semibold">สรุปรายการ</h3>
      <svg 
        v-if="isExpanded" 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 text-gray-500 transition-transform" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      <svg 
        v-else 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5 text-gray-500 transition-transform" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Expanded Content -->
    <div v-show="isExpanded">
      <div class="space-y-3 mt-4 mb-4">
        <div v-for="(item, idx) in items" :key="idx" class="flex justify-between items-start text-[14px]">
          <span class="text-gray-900 font-medium leading-relaxed max-w-[75%]">{{ item.name }}</span>
          <span class="text-gray-500 shrink-0">{{ item.quantity }} รายการ</span>
        </div>
      </div>
      
      <div class="border-t border-gray-200 py-4 space-y-3">
        <div v-if="date" class="flex justify-between items-start text-[14px]">
          <span class="text-gray-500 w-[60px] shrink-0">วันที่</span>
          <span class="text-gray-900 font-medium text-right">{{ date }}</span>
        </div>
        <div v-if="time" class="flex justify-between items-start text-[14px]">
          <span class="text-gray-500 w-[60px] shrink-0">เวลา</span>
          <span class="text-gray-900 font-medium text-right">{{ time }}</span>
        </div>
        <div v-if="location" class="flex justify-between items-start text-[14px]">
          <span class="text-gray-500 w-[60px] shrink-0">สถานที่</span>
          <span class="text-gray-900 font-medium text-right whitespace-pre-wrap leading-relaxed">{{ location }}</span>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-4 space-y-3">
        <div v-if="discount && discount > 0" class="flex justify-between items-center text-[14px]">
          <span class="text-gray-500">Promotion Code</span>
          <span class="text-red-500 font-medium">-{{ discount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ฿</span>
        </div>
        <div class="flex justify-between items-center pt-1">
          <span class="text-gray-500 text-[15px]">รวม</span>
          <span class="text-[15px] font-bold text-gray-900">
            {{ totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ฿
          </span>
        </div>
      </div>
    </div>

    <!-- Collapsed Content -->
    <div v-show="!isExpanded">
      <div class="pt-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-500 text-[15px]">รวม</span>
          <span class="text-[15px] font-bold text-gray-900">
            {{ totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ฿
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
