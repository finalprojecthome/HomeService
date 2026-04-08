<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import {
  NotificationIcon,
  List,
  History,
  UserIcon,
  Logout
} from '../components/icons';
import technicianApi from '../services/api/technician';
import useAuthStore from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const availableJobsCount = ref(0);

const fetchJobsCount = async () => {
  try {
    const jobs = await technicianApi.getAvailableJobs();
    availableJobsCount.value = jobs.length;
  } catch (error) {
    console.error("Failed to load available jobs count:", error);
  }
};

onMounted(() => {
  fetchJobsCount();
  // Optionally poll the count every 30 seconds
  setInterval(fetchJobsCount, 30000);
});

const sidebarLinks = computed(() => [
  { id: 1, title: 'คำขอบริการซ่อม', icon: NotificationIcon, badge: availableJobsCount.value, path: '/technician/requests' },
  { id: 2, title: 'รายการที่รอดำเนินการ', icon: List, path: '/technician/pending' },
  { id: 3, title: 'ประวัติการซ่อม', icon: History, path: '/technician/history' },
  { id: 4, title: 'ตั้งค่าบัญชีผู้ใช้', icon: UserIcon, path: '/technician/settings' },
]);

const bottomLink = { id: 5, title: 'ออกจากระบบ', icon: Logout, path: '/auth/login' };

const handleMenuClick = (item: any) => {
  if (item.id === 5) {
    // Logout case
    authStore.logout();
    router.push('/auth/login');
    return;
  }
  
  if (item.path) {
    router.push(item.path);
  }
};
</script>

<template>
  <div class="flex h-screen bg-[#F3F4F6] w-full overflow-hidden">
    <!-- Sidebar Left -->
    <Sidebar
      :links="sidebarLinks"
      :bottom-link="bottomLink"
      @click="handleMenuClick"
      @logout-click="handleMenuClick"
      class="hidden md:flex shrink-0"
    />
    
    <!-- Mobile header replacement (simplified for dashboard) -->
    <!-- Not explicitly requested but good practice to allow scrolling for content -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto w-full p-4 md:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
