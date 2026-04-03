import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import UI from "../pages/UI.vue";
import {
  clearAdminAccessToken,
  fetchAdminMe,
  getAdminAccessToken,
} from "../services/adminAuth";

// Lazy import
const Login = () => import("../pages/Login.vue");
const Register = () => import("../pages/Register.vue");
import ServiceList from '../pages/ServiceList.vue'

// admin
import AdminCategory from '../pages/Admin/AdminCategory/AdminCategory.vue'
const AdminCategoryList = () => import("../pages/Admin/AdminCategory/AdminCategoryList.vue");
const AdminAddCategory = () => import("../pages/Admin/AdminCategory/AdminAddCategory.vue");
const AdminDetailCategory = () => import("../pages/Admin/AdminCategory/AdminDetailCategory.vue");
const AdminEditCategory = () => import("../pages/Admin/AdminCategory/AdminEditCategory.vue");
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
    // admin
    {
      path: '/auth/admin/register',
      name: 'admin-register',
      component: AdminRegister
    },
    { 
      path: '/auth/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin/category',
      name: 'admin-category',
      component: AdminCategory,
      meta: { requiresAdmin: true },
      children: [
        {
          path: "",
          name: "admin-category-list",
          component: AdminCategoryList,
        },
        {
          path: "add",
          name: "admin-add-category",
          component: AdminAddCategory,
        },
        {
          path: ":id",
          name: "admin-detail-category",
          component: AdminDetailCategory,
        },
        {
          path: ":id/edit",
          name: "admin-edit-category",
          component: AdminEditCategory,
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (!requiresAdmin) {
    return true;
  }

  const token = getAdminAccessToken();

  if (!token) {
    return {
      name: "admin-login",
      query: { redirect: to.fullPath },
    };
  }

  try {
    const admin = await fetchAdminMe();

    if (admin.role !== "admin") {
      clearAdminAccessToken();
      return {
        name: "admin-login",
        query: { redirect: to.fullPath },
      };
    }

    return true;
  } catch {
    clearAdminAccessToken();
    return {
      name: "admin-login",
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
