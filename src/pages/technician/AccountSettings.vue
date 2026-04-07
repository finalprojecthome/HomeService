<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ActionButton from '../../components/ui/ActionButton.vue';
import ToggleSwitch from '../../components/ui/ToggleSwitch.vue';
import CheckBox from '../../components/ui/CheckBox.vue';
import technicianApi from '../../services/api/technician';
import { showCustomToast } from '../../utils/toast';

// Form State
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  subDistrictId: 1, // Defaulting to 1, since we don't have sub-district picker built
  isAvailable: false,
  serviceIds: [] as number[],
});

const availableServices = ref<{id: number, title: string}[]>([]);
const isLoading = ref(true);

const loadProfile = async () => {
  isLoading.value = true;
  try {
    const profile = await technicianApi.getProfile();
    availableServices.value = await technicianApi.getServices();

    // Split name into first and last name if possible
    const nameParts = (profile.name || '').split(' ');
    formData.value.firstName = nameParts[0] || '';
    formData.value.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    formData.value.phone = profile.phone || '';
    formData.value.address = profile.addressDetail || '';
    formData.value.subDistrictId = profile.subDistrictId || 1;
    formData.value.isAvailable = profile.isAvailable;

    // Set service IDs
    formData.value.serviceIds = profile.serviceIds || [];
  } catch (error) {
    showCustomToast({ variant: 'error', title: 'เกิดข้อผิดพลาด', description: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้' });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadProfile();
});

const handleCancel = () => {
  loadProfile(); // Reset to backend data
};

const handleConfirm = async () => {
  try {
    const payload = {
      name: `${formData.value.firstName} ${formData.value.lastName}`.trim(),
      phone: formData.value.phone,
      addressDetail: formData.value.address,
      subDistrictId: formData.value.subDistrictId,
      isAvailable: formData.value.isAvailable,
      serviceIds: formData.value.serviceIds
    };

    await technicianApi.updateProfile(payload);
    showCustomToast({ title: 'สำเร็จ', description: 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
  } catch (err) {
    showCustomToast({ variant: 'error', title: 'เกิดข้อผิดพลาด', description: 'ไม่สามารถบันทึกข้อมูลได้' });
  }
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
            <CheckBox 
              v-for="svc in availableServices"
              :key="svc.id"
              :model-value="formData.serviceIds.includes(svc.id)"
              @update:model-value="(val) => {
                if (val) formData.serviceIds.push(svc.id);
                else formData.serviceIds = formData.serviceIds.filter(id => id !== svc.id);
              }"
              :label="svc.title" 
            />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
