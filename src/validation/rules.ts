import { defineRule } from "vee-validate";

// Input
defineRule("inputRequired", (value: string) => {
  if (!value || !value.length) {
    return "กรุณากรอกข้อมูล";
  }
  return true;
});

defineRule("fullname", (value: string) => {
  if (value.trim().length < 2) {
    return "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร";
  }

  if (value.trim().length > 100) {
    return "ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร";
  }

  if (!/^[a-zA-Zก-๏\s]+$/.test(value)) {
    return "ชื่อ-นามสกุลต้องมีอักษรภาษาไทย หรืออักษรภาษาอังกฤษเท่านั้น";
  }
  return true;
});

defineRule("phone", (value: string) => {
  if (!/^0\d{9}$/.test(value)) {
    return "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
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

defineRule("confirmed", (value: string, [target]: string[]) => {
  if (value === target) {
    return true;
  }
  return "รหัสผ่านไม่ตรงกัน";
});

// Checkbox
defineRule("checkboxRequired", (value: boolean) => {
  if (!value) {
    return "กรุณายืนยัน";
  }
  return true;
});
