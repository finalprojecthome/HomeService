<script setup lang="ts">
import { Form } from "vee-validate";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import CheckboxForm from "../components/form/CheckboxForm.vue";
import InputForm from "../components/form/InputForm.vue";
import ActionButton from "../components/ui/ActionButton.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import Separator from "../components/ui/Separator.vue";

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
        ลงทะเบียน
      </h1>
      <Form @submit="handleSubmit" class="w-full">
        <fieldset class="flex flex-col gap-6 w-full">
          <div class="flex flex-col gap-5">
            <InputForm
              name="fullname"
              label="ชื่อ - นามสกุล"
              type="text"
              placeholder="กรุณากรอกชื่อ นามสกุล"
              autocomplete="name"
              rules="fullname"
              required
            />
            <InputForm
              name="phone"
              label="เบอร์โทรศัพท์"
              type="text"
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
              rules="password"
              required
            />
            <InputForm
              name="confirm-password"
              label="ยืนยันรหัสผ่าน"
              type="password"
              placeholder="กรุณายืนยันรหัสผ่าน"
              rules="confirmed:@password"
              required
            />
            <CheckboxForm name="terms" required>
              <div
                class="flex flex-wrap items-center gap-1 style-body-2 text-gray-900"
              >
                <span>ยอมรับ</span>
                <ActionButton variant="ghost">
                  ข้อตกลงและเงื่อนไข
                </ActionButton>
                <span>และ</span>
                <ActionButton variant="ghost">
                  นโยบายความเป็นส่วนตัว
                </ActionButton>
              </div>
            </CheckboxForm>
          </div>
          <ActionButton type="submit" class="w-full">ลงทะเบียน</ActionButton>
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
      <NavigationButton variant="ghost" to="/auth/login">
        กลับไปหน้าเข้าสู่ระบบ
      </NavigationButton>
    </section>
  </MainWithNarbar>
</template>
