<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import {
  NotificationIcon,
  List,
  History,
  UserIcon,
  Logout
} from '../components/icons';

const router = useRouter();
const route = useRoute();

const sidebarLinks = [
  { id: 1, title: 'คำขอบริการซ่อม', icon: NotificationIcon, badge: 3, path: '/technician/requests' },
  { id: 2, title: 'รายการที่รอดำเนินการ', icon: List, path: '/technician/pending' },
  { id: 3, title: 'ประวัติการซ่อม', icon: History, path: '/technician/history' },
  { id: 4, title: 'ตั้งค่าบัญชีผู้ใช้', icon: UserIcon, path: '/technician/settings' },
];

const bottomLink = { id: 5, title: 'ออกจากระบบ', icon: Logout, path: '/' };

const handleMenuClick = (item: any) => {
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
      class="hidden md:flex flex-shrink-0"
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
