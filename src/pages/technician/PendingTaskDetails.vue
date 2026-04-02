<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Badge from '../../components/ui/Badge.vue';

const route = useRoute();
const router = useRouter();
const orderId = route.params.id as string;

// Mock Details
const orderDetail = ref({
  id: orderId,
  title: 'ล้างแอร์',
  category: 'บริการทั่วไป',
  serviceItems: 'ล้างแอร์ 9,000 - 18,000 BTU, แบบติดผนัง 2 เครื่อง',
  date: '25/04/2563 เวลา 13.00 น.',
  location: '444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ',
  price: '1,550.00 ฿',
  customerName: 'สมมติ รักความสะอาด',
  customerPhone: '081 234 5678'
});

const goBack = () => router.back();
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto">
    
    <!-- Top Nav -->
    <button @click="goBack" class="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-fit">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="currentColor"/>
      </svg>
      <span class="style-headline-3">{{ orderDetail.title }}</span>
    </button>
    
    <!-- Content Box -->
    <div class="bg-white p-8 rounded-lg shadow-sm">
      <h2 class="style-headline-2 text-gray-900 mb-8">{{ orderDetail.title }}</h2>

      <div class="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-y-6 items-start">
        
        <span class="text-gray-500 style-headline-5">หมวดหมู่</span>
        <div>
          <!-- Fallback badge style if Badge.vue doesn't support the right props -->
          <span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            {{ orderDetail.category }}
          </span>
        </div>

        <span class="text-gray-500 style-headline-5">รายการ</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.serviceItems }}</span>

        <span class="text-gray-500 style-headline-5">วันเวลาดำเนินการ</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.date }}</span>

        <span class="text-gray-500 style-headline-5">สถานที่</span>
        <div class="flex flex-col">
          <span class="text-gray-900 style-body-1 mb-1">{{ orderDetail.location }}</span>
          <button class="flex items-center gap-1 text-blue-600 hover:underline w-fit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
            </svg>
            <span class="style-headline-5">ดูแผนที่</span>
          </button>
        </div>

        <span class="text-gray-500 style-headline-5">รหัสคำสั่งซ่อม</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.id }}</span>

        <span class="text-gray-500 style-headline-5">ราคาประเมิน</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.price }}</span>

        <span class="text-gray-500 style-headline-5">ผู้รับบริการ</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.customerName }}</span>

        <span class="text-gray-500 style-headline-5">เบอร์ติดต่อ</span>
        <span class="text-gray-900 style-body-1">{{ orderDetail.customerPhone }}</span>

      </div>
    </div>
  </div>
</template>
