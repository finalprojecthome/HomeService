<script setup lang="ts">
import { ref } from 'vue';
import ActionButton from '../../components/ui/ActionButton.vue';
import ToggleSwitch from '../../components/ui/ToggleSwitch.vue';
import Checkbox from '../../components/ui/Checkbox.vue';

// Form State
const formData = ref({
  firstName: 'สมมติ',
  lastName: 'รักความสะอาด',
  phone: '081 234 5678',
  address: '332 อาคารพาณิชย์ ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ',
  isAvailable: true,
  services: {
    cleaning: true,
    air_clean: true,
    general_clean: true,
    air_repair: true,
    machine_repair: true,
    car_clean: false,
    car_repair: false,
    bike_repair: false,
    other: true
  }
});

const handleCancel = () => {
  console.log('Cancelled form changes');
  // Reset logic or navigate away
};

const handleConfirm = () => {
  console.log('Confirmed form changes', formData.value);
  // Submit logic
};

const isRefreshingLocation = ref(false);

const handleRefreshLocation = () => {
  isRefreshingLocation.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          // Use OpenStreetMap's free Nominatim API to get real address
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`);
          const data = await res.json();
          if (data && data.display_name) {
            formData.value.address = data.display_name;
          } else {
            formData.value.address = `พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          }
        } catch (e) {
          console.error("Geocoding error", e);
          formData.value.address = `พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
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
</script>

<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h1 class="style-headline-2 text-gray-900">ตั้งค่าบัญชีผู้ใช้</h1>
      <div class="flex items-center gap-4">
        <ActionButton variant="secondary" @click="handleCancel">ยกเลิก</ActionButton>
        <ActionButton @click="handleConfirm">ยืนยัน</ActionButton>
      </div>
    </div>

    <!-- Scrollable Form Area -->
    <div class="p-8 flex flex-col gap-10">
      
      <!-- Account Details -->
      <section>
        <h2 class="style-headline-3 text-gray-900 mb-6">รายละเอียดบัญชี</h2>
        
        <div class="grid grid-cols-[180px_1fr] md:grid-cols-[240px_1fr] items-center gap-y-6">
          <label class="text-gray-900 style-headline-5">ชื่อ<span class="text-red-500">*</span></label>
          <input 
            v-model="formData.firstName" 
            type="text" 
            class="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 style-body-1 focus:outline-none focus:border-blue-500" 
          />

          <label class="text-gray-900 style-headline-5">นามสกุล<span class="text-red-500">*</span></label>
          <input 
            v-model="formData.lastName" 
            type="text" 
            class="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 style-body-1 focus:outline-none focus:border-blue-500" 
          />

          <label class="text-gray-900 style-headline-5">เบอร์ติดต่อ<span class="text-red-500">*</span></label>
          <input 
            v-model="formData.phone" 
            type="text" 
            class="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 style-body-1 focus:outline-none focus:border-blue-500" 
          />

          <label class="text-gray-900 style-headline-5">ตำแหน่งที่อยู่ปัจจุบัน<span class="text-red-500">*</span></label>
          <div class="flex items-center gap-2">
            <input 
              v-model="formData.address" 
              type="text" 
              readonly
              class="w-full max-w-md border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed rounded-lg px-4 py-2 style-body-1 focus:outline-none" 
            />
            <ActionButton variant="secondary" @click="handleRefreshLocation" :disabled="isRefreshingLocation">{{ isRefreshingLocation ? 'กำลังค้นหา...' : 'รีเฟรช' }}</ActionButton>
          </div>
        </div>
      </section>

      <hr class="border-gray-100" />

      <!-- Account Status -->
      <section>
        <div class="grid grid-cols-[180px_1fr] md:grid-cols-[240px_1fr] items-start">
          <label class="text-gray-900 style-headline-3">สถานะบัญชี</label>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <ToggleSwitch v-model="formData.isAvailable" />
              <span class="text-gray-900 style-body-1">พร้อมให้บริการ</span>
            </div>
            <p class="text-gray-500 style-body-2">
              ระบบจะแสดงคำสั่งซ่อมในบริเวณใกล้เคียงกับตำแหน่งที่อยู่ปัจจุบัน เพื่ออำนวยความสะดวกในการรับงาน
            </p>
          </div>
        </div>
      </section>

      <hr class="border-gray-100" />

      <!-- Offered Services -->
      <section>
        <div class="grid grid-cols-[180px_1fr] md:grid-cols-[240px_1fr] items-start">
          <label class="text-gray-900 style-headline-3">บริการที่รับซ่อม</label>
          <div class="flex flex-col gap-4 mt-1">
            <Checkbox v-model="formData.services.cleaning" label="ล้างแอร์" />
            <Checkbox v-model="formData.services.air_clean" label="ติดตั้งแอร์" />
            <Checkbox v-model="formData.services.general_clean" label="ทำความสะอาดทั่วไป" />
            <Checkbox v-model="formData.services.air_repair" label="ซ่อมแอร์" />
            <Checkbox v-model="formData.services.machine_repair" label="ซ่อมเครื่องซักผ้า" />
            <Checkbox v-model="formData.services.car_clean" label="ติดตั้งจานดาวเทียม" />
            <Checkbox v-model="formData.services.car_repair" label="ติดตั้งกล้องวงจรปิด" />
            <Checkbox v-model="formData.services.bike_repair" label="ติดตั้งผ้าม่าน" />
            <Checkbox v-model="formData.services.other" label="ติดตั้งเครื่องทำน้ำอุ่น" />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
