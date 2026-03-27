<script setup lang="ts">
import ProductCard from "../components/ProductCard.vue";
import OrderCard from "../components/OrderCard.vue";
import { ref } from "vue";
import Dropdown, { type DropdownOption } from "../components/ui/Dropdown.vue";
import PriceRange from "../components/ui/PriceRange.vue";
import ImageUpload from "../components/ui/ImageUpload.vue";
import { debounce } from "../utils/debounce";
import ActionButton from "../components/ui/ActionButton.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";

const handleClickButton = () => alert("Pressed Button");
const handleSubmit = () =>
  alert("Submit Form\n\nYes, it's submit form button\n\nเชื่อเถอะ");

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
  <div class="flex flex-col gap-10 min-h-screen bg-[#F3F4F6] p-6 md:p-12">
    <!-- ปุ่ม -->
    <div class="flex flex-col gap-4 justify-center items-center">
      <div class="flex gap-2 items-center">
        <span class="style-body-1">Normal</span>
        <span class="style-body-1">Disable</span>
      </div>

      <!-- Button Primary -->
      <div class="flex gap-2 items-center">
        <!-- ใช้ @click="..." เพื่อกำหนดการทำงานเมื่อปุ่มถูกคลิก -->
        <ActionButton @click="handleClickButton">Button Primary</ActionButton>
        <ActionButton @click="handleClickButton" disabled>
          Button Primary
        </ActionButton>
      </div>
      <div class="flex gap-2 items-center">
        <ActionButton size="lg" @click="handleClickButton">
          Button Primary, Large
        </ActionButton>
        <ActionButton size="lg" @click="handleClickButton" disabled>
          Button Primary, Large
        </ActionButton>
      </div>

      <!-- Button Secondary -->
      <div class="flex gap-2 items-center">
        <ActionButton variant="secondary" @click="handleClickButton">
          Button Secondary
        </ActionButton>
        <ActionButton variant="secondary" @click="handleClickButton" disabled>
          Button Secondary
        </ActionButton>
      </div>
      <div class="flex gap-2 items-center">
        <ActionButton variant="secondary" size="lg" @click="handleClickButton">
          Button Secondary, Large
        </ActionButton>
        <ActionButton
          variant="secondary"
          size="lg"
          @click="handleClickButton"
          disabled
        >
          Button Secondary, Large
        </ActionButton>
      </div>

      <!-- Button Ghost -->
      <div class="flex gap-2 items-center">
        <ActionButton variant="ghost" @click="handleClickButton">
          Button Ghost
        </ActionButton>
        <ActionButton variant="ghost" @click="handleClickButton" disabled>
          Button Ghost
        </ActionButton>
      </div>

      <!-- ส่ง Form -->
      <form @submit="handleSubmit" class="flex flex-col">
        <ActionButton type="submit">Submit Button</ActionButton>
      </form>

      <!-- Navigation -->
      <NavigationButton to="/">Navigation Button</NavigationButton>

      <h5 class="style-headline-2">Button Width</h5>
      <div class="flex flex-col items-center gap-2 w-100 bg-blue-200 p-4">
        การขยายปุ่มให้เต็ม parent
        <span>With out <code>w-full</code></span>
        <ActionButton>Button Primary</ActionButton>
        <ActionButton size="lg">Button Primary</ActionButton>

        <span>With <code>w-full</code></span>
        <ActionButton class="w-full">Button Primary</ActionButton>
        <ActionButton size="lg" class="w-full">Button Primary</ActionButton>
      </div>
    </div>

    <div class="max-w-5xl mx-auto space-y-12">
      <!-- กล่องการ์ดด้านบนสุด -->
      <section>
        <ProductCard
          category="บริการทั่วไป"
          categoryVariant="blue"
          title="ทำความสะอาดทั่วไป"
          :price="500"
          ctaText="เลือกบริการ"
        />
      </section>

      <!-- กล่องรายการด้านล่าง 2 แถว -->
      <section class="space-y-5">
        <OrderCard
          orderId="รหัสรายการ"
          status="in-progress"
          statusLabel="กำลังดำเนินการ"
          date="23 เม.ย. 2021 | 11.00 น."
          staff="สมาน ไมตรี"
          :price="1550"
          :items="['ล้างแอร์ติดผนัง', 'ล้างแอร์ติดผนัง (เพิ่มเติม)']"
        />
        <OrderCard
          orderId="รหัสรายการ"
          status="completed"
          statusLabel="สำเร็จแล้ว"
          date="22 เม.ย. 2021 | 14.00 น."
          staff="สมาน ไมตรี"
          :price="800"
          :items="['ทำความสะอาดทั่วไป']"
        />
      </section>
    </div>

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
  </div>
</template>

<style scoped>
/* Scoped styles specific only to layout containment in HelloWorld */
</style>
