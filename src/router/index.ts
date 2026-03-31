import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import UI from '../pages/UI.vue'
import ServiceList from '../pages/ServiceList.vue'
import AccountStubPage from '../pages/AccountStubPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/ui',
      name: 'ui',
      component: UI
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceList
    },
    {
      path: '/profile',
      name: 'profile',
      component: AccountStubPage,
      meta: { title: 'ข้อมูลผู้ใช้งาน' }
    },
    {
      path: '/repair-orders',
      name: 'repairOrders',
      component: AccountStubPage,
      meta: { title: 'รายการคำสั่งซ่อม' }
    },
    {
      path: '/repair-history',
      name: 'repairHistory',
      component: AccountStubPage,
      meta: { title: 'ประวัติการซ่อม' }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: AccountStubPage,
      meta: { title: 'เข้าสู่ระบบ' }
    }
  ]
})

export default router
