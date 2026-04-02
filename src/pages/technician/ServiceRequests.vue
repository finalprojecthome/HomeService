<script setup lang="ts">
import { ref } from 'vue';
import CardRequest from '../../components/CardRequest.vue';
import ActionButton from '../../components/ui/ActionButton.vue';

// Define the shape of our request item
interface RequestItem {
  id: string;
  title: string;
  dateStr: string;
  time: string;
  serviceName: string;
  price: string;
  location: string;
}

const requestsList = ref<RequestItem[]>([
  {
    id: 'AD04071205',
    title: 'ล้างแอร์',
    dateStr: '25/04/2563',
    time: '13.00',
    serviceName: 'ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง',
    price: '1,550.00',
    location: '444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ',
  },
  {
    id: 'AD04071206',
    title: 'ล้างแอร์',
    dateStr: '26/04/2563',
    time: '10.00',
    serviceName: 'ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง',
    price: '1,550.00',
    location: '444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ',
  }
]);

// Location state
const currentLocationStr = ref('332 อาคารพาณิชย์ ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ');
const isRefreshingLocation = ref(false);

const handleRefreshLocation = () => {
  isRefreshingLocation.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock updating the location text using coordinates
        console.log("Got coordinates:", position.coords.latitude, position.coords.longitude);
        currentLocationStr.value = "อัปเดตตำแหน่งล่าสุดสำเร็จ (Mock)"; // In a real app we'd reverse-geocode this
        isRefreshingLocation.value = false;
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("ไม่สามารถเข้าถึงตำแหน่งได้: กรุณาอนุญาตการเข้าถึง Location ใน Browser");
        isRefreshingLocation.value = false;
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
    isRefreshingLocation.value = false;
  }
};

// Modal State
const showConfirmModal = ref(false);
const selectedRequest = ref<RequestItem | null>(null);

const handleReject = (id: string) => {
  requestsList.value = requestsList.value.filter(req => req.id !== id);
};

const triggerAccept = (id: string) => {
  const req = requestsList.value.find(r => r.id === id);
  if (req) {
    selectedRequest.value = req;
    showConfirmModal.value = true;
  }
};

const confirmAccept = () => {
  if (selectedRequest.value) {
    // Simulate accepting and moving to pending queue
    requestsList.value = requestsList.value.filter(req => req.id !== selectedRequest.value!.id);
    showConfirmModal.value = false;
    selectedRequest.value = null;
  }
};

const cancelAccept = () => {
  showConfirmModal.value = false;
  selectedRequest.value = null;
};

const openMap = (location: string) => {
  // Open google maps with the string
  window.open(`https://maps.google.com/?q=${encodeURIComponent(location)}`, '_blank');
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
    <h1 class="style-headline-2 text-gray-900">คำขอบริการซ่อม</h1>

    <!-- Current Location View -->
    <div class="flex flex-col gap-4">
      <!-- Current Location Alert -->
      <div class="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-lg">
        <div class="mt-1">
          <!-- Location Icon Marker -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#3B82F6"/>
          </svg>
        </div>
        <div class="flex flex-col flex-1">
          <span class="text-blue-500 style-headline-5">ตำแหน่งที่อยู่ปัจจุบัน</span>
          <span class="text-blue-700 style-body-1">{{ currentLocationStr }}</span>
        </div>
        <div class="ml-auto mt-auto mb-auto">
          <button 
            @click="handleRefreshLocation" 
            :disabled="isRefreshingLocation"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full px-3 py-1 text-xs cursor-pointer transition-colors"
          >
            {{ isRefreshingLocation ? 'กำลังค้นหา...' : 'รีเฟรช' }}
          </button>
        </div>
      </div>

      <!-- Requests List -->
      <div class="flex flex-col gap-4">
        <template v-if="requestsList.length > 0">
          <CardRequest 
            v-for="req in requestsList" 
            :key="req.id"
            :title="req.title"
            :date-str="req.dateStr"
            :time="req.time"
            :service-name="req.serviceName"
            :order-id="req.id"
            :price="req.price"
            :location="req.location"
            @accept="triggerAccept(req.id)"
            @reject="handleReject(req.id)"
            @view-map="openMap(req.location)"
          />
        </template>
        <div v-else class="text-center py-10 bg-white rounded-lg border border-gray-100 text-gray-500">
          <p>ไม่มีคำขอบริการซ่อมในขณะนี้</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirmation Modal -->
  <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl flex flex-col items-center relative">
      <!-- Close icon top right -->
      <button @click="cancelAccept" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
        </svg>
      </button>
      
      <!-- Icon center top -->
      <div class="text-blue-600 mb-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
        </svg>
      </div>

      <h3 class="style-headline-2 text-gray-900 text-center mb-2">ยืนยันการรับงาน?</h3>
      <p class="style-body-2 text-gray-500 text-center mb-8" v-if="selectedRequest">
        คุณสามารถให้บริการ '{{ selectedRequest.title }}' ในวันที่ <br/>
        {{ selectedRequest.dateStr }} เวลา {{ selectedRequest.time }} น.
      </p>

      <div class="flex gap-4 w-full">
        <ActionButton variant="secondary" class="w-full flex-1 justify-center" @click="cancelAccept">ยกเลิก</ActionButton>
        <ActionButton class="w-full flex-1 justify-center" @click="confirmAccept">ยืนยัน</ActionButton>
      </div>
    </div>
  </div>
</template>
