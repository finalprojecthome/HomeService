<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import houseIcon from "../../assets/icon/house.png";
import ActionButton from "../../components/ui/ActionButton.vue";
import TextInput from "../../components/ui/TextInput.vue";
import {
  fetchAdminMe,
  getAdminAccessToken,
  initializeAdminAuthSession,
  registerAdmin,
} from "../../services/adminAuth";

const router = useRouter();

const name = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const inviteCode = ref("");

const isSubmitting = ref(false);
const isCheckingSession = ref(false);
const serverError = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const hasSubmitted = ref(false);

const fieldErrors = computed(() => {
  const errors: Record<string, string | null> = {
    name: null,
    phone: null,
    email: null,
    password: null,
    inviteCode: null,
  };

  if (!name.value.trim()) errors.name = "กรุณากรอกชื่อ";
  if (!phone.value.trim()) errors.phone = "กรุณากรอกเบอร์โทร";
  if (!email.value.trim()) errors.email = "กรุณากรอกอีเมล";
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }
  if (!password.value) errors.password = "กรุณากรอกรหัสผ่าน";
  if (password.value && password.value.length < 8) {
    errors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
  }
  if (!inviteCode.value.trim()) errors.inviteCode = "กรุณากรอก invite code";

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
    await registerAdmin({
      email: email.value.trim(),
      name: name.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
      inviteCode: inviteCode.value.trim(),
    });

    successMessage.value = "สมัครแอดมินสำเร็จ";
    router.replace("/admin/category");
  } catch (error) {
    serverError.value =
      error instanceof Error ? error.message : "สมัครแอดมินไม่สำเร็จ";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  isCheckingSession.value = true;
  try {
    await initializeAdminAuthSession();
    const token = await getAdminAccessToken();
    if (!token) {
      return;
    }

    const admin = await fetchAdminMe(true);
    if (admin.role === "admin") {
      router.replace("/admin/category");
    }
  } catch (error) {
    serverError.value =
      error instanceof Error ? error.message : "ไม่สามารถยืนยันสิทธิ์แอดมินได้";
  } finally {
    isCheckingSession.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-10 flex-col gap-[35px]"
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
        สมัครสมาชิกแอดมิน
      </h1>

      <form class="flex flex-col gap-[35px]" @submit.prevent="submit">
        <div class="grid grid-cols-1 gap-4">
          <TextInput
            v-model="name"
            label="Name"
            placeholder="Name - Surname"
            :error="hasSubmitted ? fieldErrors.name : null"
          />
          <TextInput
            v-model="phone"
            label="Phone"
            type="tel"
            placeholder="0xx-xxx-xxxx"
            :error="hasSubmitted ? fieldErrors.phone : null"
          />
          <TextInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            :error="hasSubmitted ? fieldErrors.email : null"
          />
          <TextInput
            v-model="inviteCode"
            type="password"
            label="Invite Code"
            placeholder="ADMIN-XXXX"
            :error="hasSubmitted ? fieldErrors.inviteCode : null"
          />
          <TextInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="password not less than 8 characters"
            autocomplete="new-password"
            :error="hasSubmitted ? fieldErrors.password : null"
          />
        </div>

        <div v-if="serverError" class="style-body-4 text-red">
          {{ serverError }}
        </div>
        <div v-if="successMessage" class="style-body-4 text-green-900">
          {{ successMessage }}
        </div>
        <div v-if="isCheckingSession" class="style-body-4 text-gray-700">
          กำลังตรวจสอบเซสชันแอดมิน...
        </div>

        <div class="flex flex-col items-center gap-4">
          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full justify-center py-3"
            :disabled="isSubmitting || isCheckingSession"
          >
            {{ isSubmitting ? "กำลังสมัคร..." : "สมัครแอดมิน" }}
          </ActionButton>

          <div class="flex items-center gap-2 style-body-3 text-gray-700">
            <span>มีบัญชีแล้ว?</span>
            <button
              type="button"
              class="style-button text-blue-600 hover:text-blue-400 active:text-blue-800 cursor-pointer"
              @click="router.push('/auth/admin/login')"
            >
              เข้าสู่ระบบแอดมิน
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
