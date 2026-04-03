<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import houseIcon from "../../assets/icon/house.png";
import ActionButton from "../../components/ui/ActionButton.vue";
import TextInput from "../../components/ui/TextInput.vue";
import {
  clearAdminAccessToken,
  fetchAdminMe,
  getAdminAccessToken,
  initializeAdminAuthSession,
  loginAdmin,
} from "../../services/adminAuth";

const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");

const isSubmitting = ref(false);
const isResolvingSession = ref(false);
const serverError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const hasSubmitted = ref(false);

const fieldErrors = computed(() => {
  const errors: Record<string, string | null> = { email: null, password: null };

  if (!email.value.trim()) errors.email = "กรุณากรอกอีเมล";
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }
  if (!password.value) errors.password = "กรุณากรอกรหัสผ่าน";

  return errors;
});

const hasClientError = computed(() =>
  Object.values(fieldErrors.value).some((value) => !!value),
);

async function submit() {
  hasSubmitted.value = true;
  serverError.value = null;
  successMessage.value = null;
  if (hasClientError.value) return;

  isSubmitting.value = true;
  try {
    const session = await loginAdmin({
      email: email.value.trim(),
      password: password.value,
    });
    if (!session.accessToken) {
      throw new Error("ไม่สามารถสร้างเซสชันแอดมินได้");
    }

    const admin = await fetchAdminMe(true);
    if (admin.role !== "admin") {
      clearAdminAccessToken();
      throw new Error("บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานแอดมิน");
    }

    successMessage.value = "เข้าสู่ระบบสำเร็จ";
    const redirectPath =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/admin/category";
    router.replace(redirectPath);
  } catch (error) {
    serverError.value =
      error instanceof Error
        ? error.message
        : "ไม่สามารถเข้าสู่ระบบแอดมินได้";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  isResolvingSession.value = true;
  serverError.value = null;

  try {
    await initializeAdminAuthSession();
    const token = await getAdminAccessToken();
    if (!token) {
      return;
    }

    const admin = await fetchAdminMe(true);
    if (admin.role !== "admin") {
      clearAdminAccessToken();
      serverError.value = "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานแอดมิน";
      return;
    }

    const redirectPath =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/admin/category";
    router.replace(redirectPath);
  } catch (error) {
    clearAdminAccessToken();
    serverError.value =
      error instanceof Error
        ? error.message
        : "ไม่สามารถตรวจสอบสิทธิ์แอดมินได้";
  } finally {
    isResolvingSession.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-10 flex flex-col gap-[35px]"
  >
    <div
      class="flex items-center gap-[17px] text-[52px] font-weight-500 text-blue-600"
    >
      <img :src="houseIcon" alt="House Icon" class="w-[69px] h-[69px]" />
      <h1>HomeServices</h1>
    </div>

    <div
      class="flex flex-col w-full max-w-[614px] min-h-[498px] style-card-box style-shadow px-[40px] md:px-[85px] py-[60px] gap-[35px]"
    >
      <h1 class="style-headline-1 text-gray-950 text-center">
        เข้าสู่ระบบแอดมิน
      </h1>

      <form class="flex flex-col gap-[35px]" @submit.prevent="submit">
        <div class="flex flex-col gap-4">
          <TextInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            :required="true"
            :error="hasSubmitted ? fieldErrors.email : null"
          />
          <TextInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="password"
            autocomplete="current-password"
            :required="true"
            :error="hasSubmitted ? fieldErrors.password : null"
          />
        </div>

        <div v-if="serverError" class="style-body-4 text-red">
          {{ serverError }}
        </div>
        <div v-if="successMessage" class="style-body-4 text-green-900">
          {{ successMessage }}
        </div>
        <div v-if="isResolvingSession" class="style-body-4 text-gray-700">
          กำลังตรวจสอบเซสชันแอดมิน...
        </div>

        <div class="flex flex-col items-center gap-4">
          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full justify-center py-3"
            :disabled="isSubmitting || isResolvingSession"
          >
            {{ isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
          </ActionButton>

          <div class="flex items-center gap-2 style-body-3 text-gray-700">
            <span>ยังไม่มีบัญชี?</span>
            <button
              type="button"
              class="style-button text-blue-600 hover:text-blue-400 active:text-blue-800 cursor-pointer"
              @click="router.push('/auth/admin/register')"
            >
              สมัครแอดมิน
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
