<script setup lang="ts">
import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { InputForm } from "../form";
import ActionButton from "../ui/ActionButton.vue";
import { useAuthStore } from "../../stores";
import authApi from "../../services/api/auth";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { showCustomToast } from "../../utils/toast";

const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);

type ResetPasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const handleSubmit: SubmissionHandler = async (values) => {
  const { oldPassword, newPassword } = values as ResetPasswordFormValues;
  isSubmitting.value = true;
  try {
    const { message } = await authApi.resetPassword({
      oldPassword,
      newPassword,
    });
    showCustomToast({
      title: "สำเร็จ",
      description: `${message} กรุณาเข้าสู่ระบบอีกครั้งด้วยรหัสผ่านใหม่`,
    });
    authStore.logout();
    await router.replace({ name: "login" });
  } catch (error) {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: getApiErrorMessage(error, "ไม่สามารถเปลี่ยนรหัสผ่านได้"),
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Form @submit="handleSubmit">
    <fieldset :disabled="isSubmitting" class="flex flex-col max-w-120">
      <div class="flex flex-col items-end gap-10">
        <div class="flex flex-col w-full gap-5">
          <InputForm
            name="oldPassword"
            label="รหัสผ่านปัจจุบัน"
            type="password"
            placeholder="กรุณากรอกรหัสผ่านปัจจุบัน"
            autocomplete="current-password"
            rules="password"
            required
          />
          <InputForm
            name="newPassword"
            label="รหัสผ่านใหม่"
            type="password"
            placeholder="กรุณากรอกรหัสผ่านใหม่"
            autocomplete="new-password"
            rules="password"
            required
          />
          <InputForm
            name="confirmNewPassword"
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            placeholder="กรุณายืนยันรหัสผ่านใหม่"
            autocomplete="new-password"
            rules="confirmed:@newPassword"
            required
          />
        </div>
        <ActionButton type="submit" class="w-fit">เปลี่ยนรหัสผ่าน</ActionButton>
      </div>
    </fieldset>
  </Form>
</template>
