import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import UI from "../pages/UI.vue";
import ServiceList from "../pages/ServiceList.vue";
import AccountStubPage from "../pages/AccountStubPage.vue";
import { useAuthStore } from "../stores";
import { showCustomToast } from "../utils/toast";

// Lazy import
const Login = () => import("../pages/Login.vue");
const Register = () => import("../pages/Register.vue");

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
        roles: ["user"],
      },
    },
    {
      path: "/repair-orders",
      name: "repairOrders",
      component: AccountStubPage,
      meta: { title: "รายการคำสั่งซ่อม" },
    },
    {
      path: "/repair-history",
      name: "repairHistory",
      component: AccountStubPage,
      meta: { title: "ประวัติการซ่อม" },
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
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await authStore.initializeAuth();

  const isAuthenticated = Boolean(authStore.user);
  const role = authStore.user?.role;

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "login" });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: "home" });
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
      return next({ name: "home" });
    }
  }

  next();
});

export default router;
