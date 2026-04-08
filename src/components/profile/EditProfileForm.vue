<script setup lang="ts">
import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { InputForm } from "../form";
import ImageUpload from "../ui/ImageUpload.vue";
import ActionButton from "../ui/ActionButton.vue";
import { useAuthStore } from "../../stores";
import userApi from "../../services/api/user";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { showCustomToast } from "../../utils/toast";

const authStore = useAuthStore();

const profileImageFile = ref<File | null>(null);
const isSubmitting = ref(false);

type ProfileFormValues = {
  fullname: string;
  phone: string;
};

const handleSubmit: SubmissionHandler = async (values) => {
  const { fullname, phone } = values as ProfileFormValues;
  isSubmitting.value = true;
  try {
    const { message } = await userApi.updateProfile({
      fullname,
      phone,
      image: profileImageFile.value ?? undefined,
    });
    showCustomToast({
      title: "สำเร็จ",
      description: message,
    });
    try {
      await authStore.getUser();
    } catch {
      /* Profile saved; user state may refresh on next navigation */
    }
  } catch (error) {
    showCustomToast({
      variant: "error",
      title: "เกิดข้อผิดพลาด",
      description: getApiErrorMessage(error, "ไม่สามารถอัปเดตโปรไฟล์ได้"),
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Form @submit="handleSubmit">
    <fieldset :disabled="isSubmitting" class="flex flex-col gap-6 max-w-120">
      <ImageUpload
        v-model="profileImageFile"
        :existing-url="authStore.user?.imgUrl ?? null"
        label="รูปโปรไฟล์"
        class="h-70 sm:w-70"
      />
      <div class="flex flex-col items-end gap-10">
        <div class="flex flex-col w-full gap-5">
          <InputForm
            name="fullname"
            label="ชื่อ - นามสกุล"
            type="text"
            :value="authStore.user?.name"
            placeholder="กรุณากรอกชื่อ นามสกุล"
            autocomplete="name"
            rules="fullname"
            required
          />
          <InputForm
            name="phone"
            label="เบอร์โทรศัพท์"
            type="text"
            :value="authStore.user?.phone"
            placeholder="กรุณากรอกเบอร์โทรศัพท์"
            autocomplete="tel-national"
            inputmode="tel"
            rules="phone"
            required
          />
          <InputForm
            name="email"
            label="อีเมล์"
            type="email"
            :value="authStore.user?.email"
            placeholder="กรุณากรอกอีเมล"
            autocomplete="email"
            inputmode="email"
            :disabled="true"
            required
          />
        </div>
        <ActionButton type="submit" class="w-fit">แก้ไขข้อมูล</ActionButton>
      </div>
    </fieldset>
  </Form>
</template>
