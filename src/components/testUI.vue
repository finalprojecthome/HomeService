<script setup lang="ts">
import { ref } from "vue";
import Dropdown, { type DropdownOption } from "./ui/Dropdown.vue";
import PriceRange from "./ui/PriceRange.vue";
import ImageUpload from "./ui/ImageUpload.vue";
import { debounce } from "../utils/debounce";

const dropdownOptions: DropdownOption[] = [
  { label: "Place Holder", value: "1" },
  { label: "Place Holder 2", value: "2" },
  { label: "Place Holder 3", value: "3" },
  { label: "Place Holder 4", value: "4" },
];

const selectedDropdown = ref<string | null>(null);

const priceRange = ref<[number, number]>([0, 2000]);

const uploadedImage = ref<File | null>(null);

function onChanged(val: string | number | null) {
  window.console.log("เปลี่ยนเป็น:" + val);
}

function onImageChange(file: File | null) {
  console.log("ไฟล์ที่เลือก:", file?.name);
}

function onImageError(message: string) {
  console.error("Error:", message);
}

const onPriceRangeChanged = debounce((val: [number, number]) => {
  window.console.log("เปลี่ยนเป็น:" + val);
}, 1000);
</script>

<template>
  <div class="px-8 py-12 max-w-5xl mx-auto flex flex-col gap-12">
    <!-- Row 1: Dropdowns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <!-- 
          Dropdown Props:
          - label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - v-model: ค่าที่ถูกเลือกในปัจจุบัน
          - options: รายการตัวเลือกใน Dropdown
          - placeholder: ข้อความแสดงเมื่อยังไม่ได้เลือกค่า
          - @change: เหตุการณ์เมื่อมีการเลือกค่าใหม่
        -->
        <Dropdown
          label="Dropdown"
          v-model="selectedDropdown"
          :options="dropdownOptions"
          placeholder="Place Holder"
          @change="onChanged"
        />
      </div>
    </div>

    <!-- Row 2: Image Upload -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div>
        <!-- 
          ImageUpload Props:
          - label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - v-model: ไฟล์รูปภาพที่เลือก
          - maxSizeMb: ขนาดไฟล์สูงสุด (มีหรือไม่มีก็ได้ ค่า default 10MB)
          - hint: ตัวเลขแสดงคำแนะนำขนาดไฟล์ใน UI (มีหรือไม่มีก็ได้ ค่า default 10MB)
          - instruction: ข้อความคำแนะนำเพิ่มเติม (มีหรือไม่มีก็ได้)
          - @change: เหตุการณ์เมื่อมีการเปลี่ยนแปลงรูปภาพ
          - @error: เหตุการณ์เมื่อเกิดข้อผิดพลาดในการอัปโหลด
        -->
        <ImageUpload
          label="Image Upload"
          v-model="uploadedImage"
          :max-size-mb="5"
          :hint="5"
          instruction="Instruction: ...."
          @change="onImageChange"
          @error="onImageError"
        />
      </div>
    </div>

    <!-- Row 3: Price Range -->
    <div>
      <!-- 
        PriceRange Props:
        - label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
        - v-model: ช่วงราคาที่เป็น [min, max]
        - min: ค่าต่ำสุดที่เลือกแสดง
        - max: ค่าสูงสุดที่เลือกแสดง
        - @change: เหตุการณ์เมื่อมีการเปลี่ยนแปลงช่วงราคา (มี debounce 1 วินาที)
      -->
      <PriceRange
        label="Price Range"
        v-model="priceRange"
        :min="0"
        :max="2000"
        @change="onPriceRangeChanged"
      />
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles specific only to layout containment in HelloWorld */
</style>
