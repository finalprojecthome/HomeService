<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Table from '../../components/ui/Table.vue';
import { DetailIcon } from '../../components/icons';
import technicianApi from '../../services/api/technician';

const router = useRouter();

// Filter parameters
const query = ref('');
const service = ref('');
const serviceOptions = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'ล้างแอร์', label: 'ล้างแอร์' },
  { value: 'ทำความสะอาดทั่วไป', label: 'ทำความสะอาดทั่วไป' },
  { value: 'ซ่อมแอร์', label: 'ซ่อมแอร์' },
  { value: 'ซ่อมเครื่องซักผ้า', label: 'ซ่อมเครื่องซักผ้า' },
  { value: 'ติดตั้งเครื่องดูดควัน', label: 'ติดตั้งเครื่องดูดควัน' },
  { value: 'ติดตั้งเครื่องทำน้ำอุ่น', label: 'ติดตั้งเครื่องทำน้ำอุ่น' }
];

// Data state
const allJobs = ref<any[]>([]);

const loadJobs = async () => {
    try {
        const jobs = await technicianApi.getMyJobs();
        // History tasks include COMPLETED, COMPLETED_BY_TECHNICIAN, etc.
        allJobs.value = jobs.filter(j => ['COMPLETED'].includes(j.status));
    } catch (e) {
        console.error("Failed to load history jobs", e);
    }
};

onMounted(() => {
    loadJobs();
});

const displayOrders = computed(() => {
    return allJobs.value.map(job => {
        const dateObj = new Date(job.scheduledAt || new Date().toISOString());
        return {
            id: job.orderId,
            serviceTitle: job.serviceItems && job.serviceItems.length > 0 ? job.serviceItems[0] : 'บริการซ่อม',
            date: `${dateObj.toLocaleDateString('th-TH')} เวลา ${dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
            price: job.totalPrice ? `${job.totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿` : '0.00 ฿'
        }
    }).filter(job => {
        if (service.value && job.serviceTitle !== service.value) return false;
        if (query.value && !job.id.toLowerCase().includes(query.value.toLowerCase())) return false;
        return true;
    });
});

const goToDetails = (id: string) => {
  router.push(`/technician/history/${id}`);
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="style-headline-2 text-gray-900">ประวัติการซ่อม</h1>
      
      <!-- Search Box -->
      <div class="flex items-center gap-3 rounded-[8px] border border-gray-200 bg-white px-4 py-2.5 w-full md:w-[320px]">
        <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          <path d="M16.5 16.5 21 21" stroke-linecap="round" />
        </svg>
        <input v-model="query" type="text" class="min-w-0 flex-1 bg-transparent outline-none style-body-2 text-gray-900 placeholder:text-gray-400" placeholder="ค้นหารายการคำสั่งซ่อม..." />
      </div>
    </div>
    
    <div class="flex flex-wrap items-center gap-6 mt-2 mb-2">
      <!-- Service Filter Dropdown -->
      <div class="flex items-center gap-3">
        <span class="style-body-2 text-gray-700">บริการ</span>
        <div class="relative">
          <select v-model="service" class="appearance-none border border-gray-200 rounded-[8px] pl-3 pr-8 py-2 style-body-2 text-gray-700 bg-white outline-none focus:border-blue-500 cursor-pointer min-w-[160px]">
            <option v-for="opt in serviceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <Table>
      <template #header>
        <th>บริการ</th>
        <th>วันนัดดำเนินการ</th>
        <th>รหัสคำสั่งซ่อม</th>
        <th>ราคาประเมิน</th>
        <th class="w-20 text-center">Action</th>
      </template>

      <template #body>
        <tr v-for="order in displayOrders" :key="order.id" class="hover:bg-gray-50 cursor-pointer" @click="goToDetails(order.id)">
          <td>{{ order.serviceTitle }}</td>
          <td>{{ order.date }}</td>
          <td>{{ order.id }}</td>
          <td>{{ order.price }}</td>
          <td class="text-center">
            <button class="text-blue-600 hover:text-blue-800 p-2" @click.stop="goToDetails(order.id)">
              <DetailIcon class="w-5 h-5 mx-auto"/>
            </button>
          </td>
        </tr>
      </template>
    </Table>
  </div>
</template>
