<script setup lang="ts">
import { Form } from "vee-validate";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import InputForm from "../components/form/InputForm.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import Separator from "../components/ui/Separator.vue";
import ActionButton from "../components/ui/ActionButton.vue";

const handleSubmit = (values: Record<string, unknown>) => {
  console.log(values);
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
        <fieldset class="flex flex-col gap-6 w-full">
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
