<script setup lang="ts">
import { ref, computed } from "vue";
import ActionButton from "../../components/ui/ActionButton.vue";
import TextInput from "../../components/ui/TextInput.vue";
import houseIcon from "../../assets/icon/house.png";

const email = ref("");
const password = ref("");

const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const hasSubmitted = ref(false);

const fieldErrors = computed(() => {
  const errors: Record<string, string | null> = { email: null, password: null };
  if (!email.value.trim()) errors.email = "กรุณากรอกอีเมล";
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value))
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  if (!password.value) errors.password = "กรุณากรอกรหัสผ่าน";
  return errors;
});

const hasClientError = computed(() =>
  Object.values(fieldErrors.value).some((v) => !!v),
);

async function submit() {
  hasSubmitted.value = true;
  serverError.value = null;
  if (hasClientError.value) return;

  isSubmitting.value = true;
  try {
    // NOTE: ยังไม่ได้เชื่อม API login ใน step นี้ (ทำเฉพาะหน้า UI ตามที่ขอ)
    await new Promise((r) => setTimeout(r, 300));
    serverError.value = "ยังไม่ได้เชื่อมระบบล็อกอิน (จะทำใน step ถัดไป)";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10 flex flex-col gap-[35px]"
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
            placeholder="รหัสผ่าน"
            autocomplete="current-password"
            :required="true"
            :error="hasSubmitted ? fieldErrors.password : null"
          />
        </div>

        <div v-if="serverError" class="style-body-4 text-red">
          {{ serverError }}
        </div>

        <div class="flex flex-col items-center gap-4">
          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            class="w-full justify-center py-3"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
          </ActionButton>

          <div class="flex items-center gap-2 style-body-3 text-gray-700">
            <span>ยังไม่มีบัญชี?</span>
            <router-link
              to="/admin/register"
              class="style-button text-blue-600 hover:text-blue-400 active:text-blue-800"
            >
              สมัครแอดมิน
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
