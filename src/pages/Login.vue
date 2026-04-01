<script setup lang="ts">
import { useRouter } from "vue-router";
import { Form, type SubmissionHandler } from "vee-validate";
import { InputForm } from "../components/form";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import ActionButton from "../components/ui/ActionButton.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import Separator from "../components/ui/Separator.vue";
import { useAuthStore } from "../stores";
import type { LoginFormValues } from "../types/auth";
import { showCustomToast } from "../utils/toast";

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit: SubmissionHandler = async (values) => {
  const data = values as LoginFormValues;
  try {
    await authStore.login(data);
    router.push({ name: "home" });
    showCustomToast({
      title: "สำเร็จ",
      description: authStore.message || "เข้าสู่ระบบสำเร็จ",
    });
  } catch {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: authStore.error || "ไม่สามารถเข้าสู่ระบบได้",
    });
  }
};
</script>

<template>
  <MainWithNarbar
    class="place-items-center px-4 py-8 sm:px-8 md:py-16 xl:py-24"
  >
    <section
      aria-labelledby="login-label"
      class="flex flex-col items-center gap-6 w-full max-w-153.5 px-4 py-8 bg-white style-card-box rounded-lg sm:px-8 md:px-16 md:py-12 lg:gap-8 lg:px-21.5"
    >
      <h1
        id="login-label"
        class="style-headline-2 text-blue-950 md:style-headline-1"
      >
        เข้าสู่ระบบ
      </h1>
      <Form @submit="handleSubmit" class="w-full">
        <fieldset
          :disabled="authStore.isLoading"
          class="flex flex-col gap-6 w-full"
        >
          <div class="flex flex-col gap-5">
            <InputForm
              name="email"
              label="อีเมล์"
              type="email"
              placeholder="กรุณากรอกอีเมล"
              autocomplete="email"
              inputmode="email"
              rules="email"
              required
            />
            <InputForm
              name="password"
              label="รหัสผ่าน"
              type="password"
              placeholder="กรุณากรอกรหัสผ่าน"
              autocomplete="current-password"
              rules="password"
              required
            />
          </div>
          <ActionButton type="submit" class="w-full">เข้าสู่ระบบ</ActionButton>
        </fieldset>
      </Form>
      <div class="flex items-center gap-2 w-full">
        <Separator class="flex-1" />
        <span class="style-body-3 text-gray-700">หรือลงชื่อเข้าใช้ผ่าน</span>
        <Separator class="flex-1" />
      </div>
      <ActionButton variant="secondary" class="w-full">
        เข้าสู่ระบบด้วย Facebook
      </ActionButton>
      <div class="flex gap-2">
        <span class="style-body-2 text-gray-700">
          ยังไม่มีบัญชีผู้ใช้ HomeService?
        </span>
        <NavigationButton variant="ghost" to="/auth/register">
          ลงทะเบียน
        </NavigationButton>
      </div>
    </section>
  </MainWithNarbar>
</template>
