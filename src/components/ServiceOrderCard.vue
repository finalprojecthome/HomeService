<script setup lang="ts">
import Badge from './ui/Badge.vue';
import ActionButton from './ui/ActionButton.vue';
import Icon from './ui/Icon.vue';
import { UserIcon } from './icons/icons';
import type { OrderStatus } from '../types/order';

export type { OrderStatus };
type BadgeVariant = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

const props = withDefaults(defineProps<{
  imageSrc?: string;
  orderId: string;
  status: OrderStatus;
  statusLabel: string;
  date: string;
  staff: string;
  price: number;
  items: string[];
}>(), {
  status: 'pending',
  statusLabel: 'รอดำเนินการ',
});

const emit = defineEmits<{
  (e: 'action-click'): void
}>();

// Map OrderStatus to BadgeVariant
const getStatusVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case 'completed': return 'green';
    case 'in-progress': return 'yellow';
    case 'canceled': return 'gray';
    case 'pending':
    default: return 'gray';
  }
};

const calendarIconPath = "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5";
</script>

<template>
  <div class="style-card-box p-5 md:p-6 w-full flex gap-5 overflow-hidden">
    
    <!-- Thumbnail if exists -->
    <div v-if="imageSrc" class="hidden sm:block w-[120px] h-[120px] rounded-lg bg-gray-100 shrink-0 overflow-hidden">
        <img :src="imageSrc" alt="service thumbnail" class="w-full h-full object-cover"/>
    </div>

    <div class="flex-1 w-full">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 pt-1 gap-3 sm:gap-0">
        <h3 class="text-xl sm:text-[22px] font-bold text-gray-900 leading-none">คำสั่งการซ่อมรหัส : {{ orderId }}</h3>
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="text-[14px] sm:text-[15px] text-gray-500">สถานะ:</span>
          <Badge :variant="getStatusVariant(status)">{{ statusLabel || status }}</Badge>
        </div>
      </div>

      <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-[14px] sm:text-[15px]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div class="flex items-center gap-2 sm:gap-3 text-gray-500">
            <Icon :path="calendarIconPath" class="text-gray-400 w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" /> 
            <span>วันเวลาดำเนินการ: <span class="text-gray-700">{{ date }}</span></span>
          </div>
          <!-- Desktop Price (Hidden on mobile) -->
          <div class="hidden sm:flex items-center gap-3">
            <span class="text-[15px] text-gray-500">ราคารวม:</span>
            <span class="text-lg font-bold text-gray-900">{{ price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ฿</span>
          </div>
        </div>
        
        <div class="flex items-center gap-2 sm:gap-3 text-gray-500">
          <UserIcon class="text-gray-400 w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0" /> 
          <span>พนักงาน: <span class="text-gray-700">{{ staff }}</span></span>
        </div>
        
        <!-- Mobile Price (Visible only on mobile, below Staff) -->
        <div class="flex sm:hidden items-center gap-2 sm:gap-3">
          <span class="text-[14px] sm:text-[15px] text-gray-500">ราคารวม:</span>
          <span class="font-bold text-gray-900">{{ price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ฿</span>
        </div>
      </div>


      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
        <div>
          <h4 class="text-[15px] font-medium text-gray-600 mb-2">รายการ:</h4>
          <ul class="list-disc list-inside text-[15px] text-gray-900 space-y-1.5 ml-1 font-medium">
            <li v-for="(item, index) in items" :key="index">{{ item }}</li>
          </ul>
        </div>
        
        <ActionButton variant="primary" @click="emit('action-click')" class="w-full sm:w-auto mt-2 sm:mt-0">
          ดูรายละเอียด
        </ActionButton>
      </div>
    </div>
  </div>
</template>
