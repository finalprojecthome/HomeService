<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ActionButton from "../../components/ui/ActionButton.vue";
import TextInput from "../../components/ui/TextInput.vue";

const router = useRouter();

const name = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const inviteCode = ref("");

const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

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
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  if (!password.value) errors.password = "กรุณากรอกรหัสผ่าน";
  if (password.value && password.value.length < 8) errors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
  if (!inviteCode.value.trim()) errors.inviteCode = "กรุณากรอก invite code";

  return errors;
});

const hasClientError = computed(() =>
  Object.values(fieldErrors.value).some((v) => !!v),
);

const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

async function submit() {
  serverError.value = null;
  successMessage.value = null;
  if (hasClientError.value) return;

  isSubmitting.value = true;
  try {
    const res = await fetch(`${apiBaseUrl}/auth/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value,
        name: name.value.trim(),
        phone: phone.value.trim(),
        inviteCode: inviteCode.value.trim(),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      serverError.value = data?.message || "สมัครแอดมินไม่สำเร็จ";
      return;
    }

    successMessage.value = "สมัครแอดมินสำเร็จ กรุณาเข้าสู่ระบบ";
    setTimeout(() => router.push({ name: "admin-login" }), 500);
  } catch {
    serverError.value = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
    <div class="style-card-box style-shadow w-full max-w-[420px] p-6 md:p-8 flex flex-col gap-6">
      <div class="flex flex-col gap-1">
        <h1 class="style-headline-2 text-gray-950">สมัครสมาชิกแอดมิน</h1>
        <p class="style-body-3 text-gray-600">
          สร้างบัญชีเพื่อจัดการหมวดหมู่ บริการ และโปรโมชั่น
        </p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <TextInput v-model="name" label="ชื่อ" placeholder="ชื่อ-นามสกุล" :error="fieldErrors.name" />
        <TextInput v-model="phone" label="เบอร์โทร" type="tel" placeholder="0xx-xxx-xxxx" :error="fieldErrors.phone" />
        <TextInput v-model="email" label="อีเมล" type="email" placeholder="you@example.com" autocomplete="email" :error="fieldErrors.email" />
        <TextInput v-model="password" label="รหัสผ่าน" type="password" placeholder="อย่างน้อย 8 ตัวอักษร" autocomplete="new-password" :error="fieldErrors.password" />
        <TextInput v-model="inviteCode" label="Invite Code" placeholder="เช่น ADMIN-XXXX" :error="fieldErrors.inviteCode" />

        <div v-if="serverError" class="style-body-4 text-red">
          {{ serverError }}
        </div>
        <div v-if="successMessage" class="style-body-4 text-green-900">
          {{ successMessage }}
        </div>

        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full justify-center"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "กำลังสมัคร..." : "สมัครแอดมิน" }}
        </ActionButton>
      </form>

      <div class="flex items-center justify-center gap-2 style-body-3 text-gray-700">
        <span>มีบัญชีแล้ว?</span>
        <button
          type="button"
          class="style-button text-blue-600 hover:text-blue-400 active:text-blue-800"
          @click="router.push({ name: 'admin-login' })"
        >
          เข้าสู่ระบบแอดมิน
        </button>
      </div>
    </div>
  </div>
</template>

