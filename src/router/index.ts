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
import AdminServices from "../pages/Admin/AdminServices/AdminServices.vue";
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
const AdminServicesList = () => import("../pages/Admin/AdminServices/AdminServicesList.vue");
const AdminAddServices = () => import("../pages/Admin/AdminServices/AdminAddServices.vue");
const AdminDetailServices = () => import("../pages/Admin/AdminServices/AdminDetailServices.vue");
const AdminEditServices = () => import("../pages/Admin/AdminServices/AdminEditServices.vue");

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
        roles: ["user", "customer"],
      },
    },
    {
      path: "/address",
      name: "address",
      component: AccountStubPage,
      meta: {
        title: "ข้อมูลที่อยู่",
        requiresAuth: true,
        roles: ["user", "customer"],
      },
    },
    {
      path: "/repair-orders",
      name: "repairOrders",
      component: AccountStubPage,
      meta: {
        title: "รายการคำสั่งซ่อม",
        requiresAuth: true,
        roles: ["user", "customer"],
      },
    },
    {
      path: "/repair-history",
      name: "repairHistory",
      component: AccountStubPage,
      meta: {
        title: "ประวัติการซ่อม",
        requiresAuth: true,
        roles: ["user", "customer"],
      },
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: AccountStubPage,
      meta: {
        title: "เปลี่ยนรหัสผ่าน",
        requiresAuth: true,
        roles: ["user", "customer"],
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
      meta: {
        requiresAuth: true,
        roles: ['technician']
      },
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
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/service",
      name: "admin-service",
      component: AdminServices,
      meta: { requiresAdmin: true },
      children: [
        {
          path: "",
          name: "admin-services-list",
          component: AdminServicesList,
        },
        {
          path: "add",
          name: "admin-add-services",
          component: AdminAddServices,
        },
        {
          path: ":id",
          name: "admin-detail-services",
          component: AdminDetailServices,
        },
        {
          path: ":id/edit",
          name: "admin-edit-services",
          component: AdminEditServices,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // 1. Handle Admin Authentication
  if (requiresAdmin) {
    await initializeAdminAuthSession();
    const token = await getAdminAccessToken();

    if (!token) {
      return next({
        name: "admin-login",
        query: { redirect: to.fullPath },
      });
    }

    try {
      const admin = await fetchAdminMe();
      if (admin.role !== "admin") {
        clearAdminAccessToken();
        return next({
          name: "admin-login",
          query: { redirect: to.fullPath },
        });
      }
      return next();
    } catch {
      clearAdminAccessToken();
      return next({
        name: "admin-login",
        query: { redirect: to.fullPath },
      });
    }
  }

  // 2. Handle User & Technician Authentication
  const authStore = useAuthStore();
  await authStore.initializeAuth();

  const isAuthenticated = Boolean(authStore.user);
  const role = authStore.user?.role;

  // Guest checking
  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: "home" });
  }

  // Auth checking
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  // Role checking
  if (to.meta.requiresAuth && to.meta.roles) {
    const roles = to.meta.roles as string[];
    // Cast to string for broad comparison
    const userRole = role as string;
    const currentRole = userRole === "customer" ? "user" : userRole;
    
    if (userRole && !roles.includes(userRole) && !roles.includes(currentRole)) {
      showCustomToast({
        variant: "error",
        title: "ไม่สามารถเข้าถึงหน้านี้",
        description: "คุณไม่มีสิทธิ์ที่จะเข้าถึงหน้านี้",
      });
      return next({ name: "home" });
    }
  }

  next();
});

export default router;
