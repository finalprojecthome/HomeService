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
    return "ชื่อ - นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร";
  }

  if (value.trim().length > 100) {
    return "ชื่อ - นามสกุลต้องไม่เกิน 100 ตัวอักษร";
  }

  if (!/^[a-zA-Zก-๏\s]+$/.test(value)) {
    return "ชื่อ - นามสกุลต้องมีอักษรภาษาไทย หรือภาษาอังกฤษเท่านั้น";
  }
  return true;
});

defineRule("addressName", (value: string) => {
  if (value.trim().length < 2) {
    return "ชื่อของที่อยู่ต้องมีอย่างน้อย 2 ตัวอักษร";
  }

  if (value.trim().length > 20) {
    return "ชื่อของที่อยู่ต้องไม่เกิน 20 ตัวอักษร";
  }

  if (!/^[a-zA-Z0-9ก-๏\s]+$/.test(value)) {
    return "ชื่อของที่อยู่ต้องมีอักษรภาษาไทย ภาษาอังกฤษ หรือตัวเลขเท่านั้น";
  }
  return true;
});

defineRule("addressDetail", (value: string) => {
  if (value.trim().length < 10) {
    return "ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร";
  }

  if (value.trim().length > 100) {
    return "ที่อยู่ต้องไม่เกิน 100 ตัวอักษร";
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

// CheckBox
defineRule("checkTermsRequired", (value: boolean) => {
  if (!value) {
    return "กรุณายอมรับข้อตกลง และข้อกำหนดการใช้งาน";
  }
  return true;
});

// SelectBox
defineRule("selectRoleRequired", (value: string) => {
  if (!value) {
    return "กรุณาเลือกบทบาท";
  }
  return true;
});

// Dropdown
defineRule("dropdownRequired", (value: string) => {
  if (!value) {
    return "กรุณาเลือก";
  }
  return true;
});

// Map (latitude / longitude)
defineRule("mapLatitudeRequired", (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "กรุณาเลือกตำแหน่งบนแผนที่";
  }
  return true;
});

defineRule("mapLatitudeRange", (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  const n =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  if (Number.isNaN(n) || n < -90 || n > 90) {
    return "ละติจูดไม่ถูกต้อง";
  }
  return true;
});

defineRule("mapLongitudeRange", (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  const n =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  if (Number.isNaN(n) || n < -180 || n > 180) {
    return "ลองจิจูดไม่ถูกต้อง";
  }
  return true;
});
