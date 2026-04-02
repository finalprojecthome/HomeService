import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import UI from "../pages/UI.vue";
import {
  clearAdminAccessToken,
  fetchAdminMe,
  getAdminAccessToken,
  initializeAdminAuthSession,
} from "../services/adminAuth";
import ServiceList from "../pages/ServiceList.vue";
import AccountStubPage from "../pages/AccountStubPage.vue";
import AdminRegister from "../pages/Admin/Register.vue";
import AdminLogin from "../pages/Admin/Login.vue";
import AdminCategory from "../pages/Admin/AdminCategory/AdminCategory.vue";
import { useAuthStore } from "../stores";
import { showCustomToast } from "../utils/toast";
import TechnicianLayout from '../layouts/TechnicianLayout.vue'

const BookingPage = () => import("../pages/BookingPage.vue");
const Login = () => import("../pages/Login.vue");
const Register = () => import("../pages/Register.vue");
const AdminCategoryList = () =>
  import("../pages/Admin/AdminCategory/AdminCategoryList.vue");
const AdminAddCategory = () =>
  import("../pages/Admin/AdminCategory/AdminAddCategory.vue");
const AdminDetailCategory = () =>
  import("../pages/Admin/AdminCategory/AdminDetailCategory.vue");
const AdminEditCategory = () =>
  import("../pages/Admin/AdminCategory/AdminEditCategory.vue");

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
      path: "/services",
      name: "services",
      component: ServiceList,
    },
    {
      path: "/profile",
      name: "profile",
      component: AccountStubPage,
      meta: {
        title: "ข้อมูลผู้ใช้งาน",
        requiresAuth: true,
        roles: ["customer"],
      },
    },
    {
      path: "/address",
      name: "address",
      component: AccountStubPage,
      meta: {
        title: "ข้อมูลที่อยู่",
        requiresAuth: true,
        roles: ["customer"],
      },
      children: [
        {
          path: "add",
          name: "addAddress",
          component: AccountStubPage,
        },
        {
          path: "edit/:id",
          name: "editAddress",
          component: AccountStubPage,
        },
      ],
    },
    {
      path: "/repair-orders",
      name: "repairOrders",
      component: AccountStubPage,
      meta: {
        title: "รายการคำสั่งซ่อม",
        requiresAuth: true,
        roles: ["customer"],
      },
    },
    {
      path: "/repair-history",
      name: "repairHistory",
      component: AccountStubPage,
      meta: {
        title: "ประวัติการซ่อม",
        requiresAuth: true,
        roles: ["customer"],
      },
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: AccountStubPage,
      meta: {
        title: "เปลี่ยนรหัสผ่าน",
        requiresAuth: true,
        roles: ["customer"],
      },
    },
    {
      path: "/auth/login",
      name: "login",
      component: Login,
      meta: {
        title: "เข้าสู่ระบบ",
        requiresGuest: true,
      },
    },
    {
      path: '/technician',
      component: TechnicianLayout,
      redirect: '/technician/requests',
      children: [
        {
          path: 'requests',
          name: 'technician-requests',
          component: () => import('../pages/technician/ServiceRequests.vue')
        },
        {
          path: 'pending',
          name: 'technician-pending',
          component: () => import('../pages/technician/PendingTasks.vue')
        },
        {
          path: 'pending/:id',
          name: 'technician-pending-details',
          component: () => import('../pages/technician/PendingTaskDetails.vue')
        },
        {
          path: 'history',
          name: 'technician-history',
          component: () => import('../pages/technician/HistoryTasks.vue')
        },
        {
          path: 'history/:id',
          name: 'technician-history-details',
          component: () => import('../pages/technician/HistoryTaskDetails.vue')
        },
        {
          path: 'settings',
          name: 'technician-settings',
          component: () => import('../pages/technician/AccountSettings.vue')
        }
      ]
    },
    {
      path: "/login",
      redirect: "/auth/login",
    },
    {
      path: "/auth/register",
      name: "register",
      component: Register,
      meta: {
        title: "ลงทะเบียน",
        requiresGuest: true,
      },
    },
    {
      path: "/register",
      redirect: "/auth/register",
    },
    {
      path: "/auth/admin/register",
      name: "admin-register",
      component: AdminRegister,
    },
    {
      path: "/auth/admin/login",
      name: "admin-login",
      component: AdminLogin,
    },
    {
      path: "/admin/category",
      name: "admin-category",
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
    {
      path: "/booking",
      name: "booking",
      component: BookingPage,
      meta: {requiresAuth: true}
    },
  ],
});

router.beforeEach(async (to, _from) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);


  if (requiresAuth) {
    const token = localStorage.getItem("accessToken");


    if (!token) {
      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }
  }

  if (requiresAdmin) {
    await initializeAdminAuthSession();
    const token = await getAdminAccessToken();

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
  } else {
    const authStore = useAuthStore();
    await authStore.initializeAuth();

    const isAuthenticated = Boolean(authStore.user);
    const role = authStore.user?.role;

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }

    if (to.meta.requiresGuest && isAuthenticated) {
      return { name: "home" };
    }

    // Check if the route has role restrictions
    if (to.meta.requiresAuth && to.meta.roles && role) {
      const roles = to.meta.roles as string[];
      if (!roles.includes(role)) {
        showCustomToast({
          variant: "error",
          title: "ไม่สามารถเข้าถึงหน้านี้",
          description: "คุณไม่มีสิทธิ์ที่จะเข้าถึงหน้านี้",
        });
        return { name: "home" };
      }
    }

    return true;
  }
});

export default router;
