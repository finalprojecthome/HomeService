import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import UI from "../pages/UI.vue";

// Lazy import
const Login = () => import("../pages/Login.vue");
const Register = () => import("../pages/Register.vue");
import ServiceList from '../pages/ServiceList.vue'
import AccountStubPage from '../pages/AccountStubPage.vue'
import AdminRegister from '../pages/Admin/Register.vue'
import AdminLogin from '../pages/Admin/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/ui",
      name: "ui",
      component: UI,
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
    },
    {
      path: "/auth/login",
      name: "login",
      component: Login,
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegister
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: "/login",
      redirect: "/auth/login",
    },
    {
      path: "/auth/register",
      name: "register",
      component: Register,
    },
    {
      path: "/register",
      redirect: "/auth/register",
    },
  ],
});

export default router;
