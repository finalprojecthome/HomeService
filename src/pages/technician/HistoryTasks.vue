<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FilterBar from '../../components/FilterBar.vue';
import Table from '../../components/ui/Table.vue';
import { DetailIcon } from '../../components/icons'; // placeholder for Action Icon

const router = useRouter();

// Filter parameters
const query = ref('');
const service = ref('');
const date = ref(''); // Mocking date filter if needed in FilterBar

const serviceOptions = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'cleaning', label: 'ทำความสะอาดทั่วไป' },
  { value: 'air', label: 'ล้างแอร์' }
];

const dateOptions = [
  { value: '', label: 'วันนี้' },
  { value: 'week', label: 'สัปดาห์นี้' },
  { value: 'month', label: 'เดือนนี้' }
];

// Mock data
const mockHistoryOrders = [
  {
    id: 'AD04071205',
    serviceTitle: 'ล้างแอร์',
    date: '25/04/2563 เวลา 13.00 น.',
    price: '1,550.00 ฿'
  },
  {
    id: 'AD04071206',
    serviceTitle: 'ทำความสะอาดทั่วไป',
    date: '24/04/2563 เวลา 10.00 น.',
    price: '750.00 ฿'
  },
  {
    id: 'AD04071207',
    serviceTitle: 'ล้างแอร์',
    date: '23/04/2563 เวลา 13.00 น.',
    price: '1,550.00 ฿'
  }
];

const handleSearch = () => {
  console.log('Search triggered', { query: query.value, service: service.value, date: date.value });
};

const goToDetails = (id: string) => {
  router.push(`/technician/history/${id}`);
};
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-sm">
    <h1 class="style-headline-2 text-gray-900 mb-2">ประวัติการซ่อม</h1>
    
    <FilterBar
      v-model:query="query"
      v-model:service="service"
      v-model:sort="date"
      :service-options="serviceOptions"
      :sort-options="dateOptions"
      @search="handleSearch"
    />

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
        <tr v-for="order in mockHistoryOrders" :key="order.id" class="hover:bg-gray-50 cursor-pointer" @click="goToDetails(order.id)">
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
