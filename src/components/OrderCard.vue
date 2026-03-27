<script setup lang="ts">
import Badge from './ui/Badge.vue';
import Button from './ui/Button-card.vue';
import Icon from './ui/Icon.vue';

export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'canceled';
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
const userIconPath = "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z";
</script>

<template>
  <div class="style-card-box style-shadow p-5 md:p-6 w-full max-w-[800px] flex gap-5 overflow-hidden">
    
    <!-- Thumbnail if exists -->
    <div v-if="imageSrc" class="hidden sm:block w-[120px] h-[120px] rounded-lg bg-gray-100 shrink-0 overflow-hidden">
        <img :src="imageSrc" alt="service thumbnail" class="w-full h-full object-cover"/>
    </div>

    <div class="flex-1 w-full">
      <div class="flex justify-between items-start mb-6 pt-1">
        <h3 class="text-[22px] font-bold text-gray-900 leading-none">{{ orderId }}</h3>
        <div class="flex items-center gap-3">
          <span class="text-[15px] text-gray-500">สถานะ:</span>
          <Badge :variant="getStatusVariant(status)">{{ statusLabel || status }}</Badge>
        </div>
      </div>

      <div class="space-y-4 mb-8">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div class="flex items-center gap-3 text-[15px] text-gray-500">
            <Icon :path="calendarIconPath" class="text-gray-400" /> 
            <span>วันเวลาดำเนินการ: <span class="text-gray-700">{{ date }}</span></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[15px] text-gray-500">ราคารวม:</span>
            <span class="text-lg font-bold text-gray-900">฿ {{ price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3 text-[15px] text-gray-500">
          <Icon :path="userIconPath" class="text-gray-400" /> 
          <span>พนักงาน: <span class="text-gray-700">{{ staff }}</span></span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
        <div>
          <h4 class="text-[15px] font-medium text-gray-600 mb-2">รายการ:</h4>
          <ul class="list-disc list-inside text-[15px] text-gray-900 space-y-1.5 ml-1 font-medium">
            <li v-for="(item, index) in items" :key="index">{{ item }}</li>
          </ul>
        </div>
        
        <Button variant="outline" @click="emit('action-click')" class="w-full sm:w-auto mt-2 sm:mt-0 text-center flex justify-center">
          ดูรายละเอียด
        </Button>
      </div>
    </div>
  </div>
</template>
