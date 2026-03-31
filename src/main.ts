import { defineRule } from "vee-validate";
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

defineRule("required", (value: string) => {
  if (!value || !value.length) {
    return "กรุณากรอกข้อมูล";
  }
  return true;
});

defineRule("email", (value: string) => {
  if (!/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(value)) {
    return "รูปแบบอีเมลไม่ถูกต้อง";
  }
  return true;
});

defineRule("password", (value: string) => {
  if (value.length < 12) {
    return "รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร";
  }
  return true;
});

createApp(App).use(router).mount("#app");
