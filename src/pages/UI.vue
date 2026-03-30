<script setup lang="ts">
import ProductCard from "../components/ProductCard.vue";
import OrderCard from "../components/OrderCard.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Dropdown, { type DropdownOption } from "../components/ui/Dropdown.vue";
import PriceRange from "../components/ui/PriceRange.vue";
import ImageUpload from "../components/ui/ImageUpload.vue";
import { debounce } from "../utils/debounce";
import ActionButton from "../components/ui/ActionButton.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import NavLinks from "../components/NavLinks.vue";
import {
  UserIcon,
  List,
  History,
  Logout,
  NotificationIcon,
} from "../components/icons";
import Sidebar from "../components/Sidebar.vue";
import CardRequest from "../components/CardRequest.vue";
import * as Icons from "../components/icons";

const iconsMap = Icons;

function copyIcon(name: string) {
  navigator.clipboard.writeText(`import { ${name} } from "@/components/icons";`);
}

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

const router = useRouter();

const navMenuLinks = [
  { id: 1, title: "ไปหน้า Home (Landing)", icon: UserIcon, path: "/" },
  { id: 2, title: "หน้า UI (หน้านี้)", icon: List, badge: 3, path: "/ui" },
  { id: 3, title: "ประวัติการใช้งาน", icon: History, path: "/history" },
  { id: 4, title: "ออกจากระบบ", icon: Logout, path: "/logout" },
];

const sidebarLinks = [
  {
    id: 1,
    title: "คำขอบริการซ่อม",
    icon: NotificationIcon,
    badge: 3,
    path: "/ui",
  },
  { id: 2, title: "รายการที่รอดำเนินการ", icon: List, path: "/pending" },
  { id: 3, title: "ประวัติการซ่อม", icon: History, path: "/history" },
  { id: 4, title: "ตั้งค่าบัญชีผู้ใช้", icon: UserIcon, path: "/settings" },
];

const bottomLink = { id: 5, title: "ออกจากระบบ", icon: Logout, path: "/" };

const handleMenuClick = (item: any) => {
  if (item.path) {
    console.log("กำลังเปลี่ยนหน้าไปยัง:", item.path);
    router.push(item.path);
  } else {
    console.log("ปุ่มนี้ไม่ได้ผูก Path ไว้:", item.title);
  }
};

const handleAcceptRequest = () => alert("รับงานเรียบร้อยแล้ว");
const handleRejectRequest = () => alert("ปฏิเสธงานแล้ว");
const handleViewMap = () => alert("กำลังเปิดแผนที่...");
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

    <div class="max-w-[1140px] mx-auto space-y-12">
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

    <div class="px-8 py-12 flex flex-col items-center gap-12">
      <!-- Row 1: Dropdowns -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div class="flex flex-row justify-center">
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
      <div class="grid grid-cols-1 md:grid-cols-1 gap-8 w-fit">
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

      <!-- Row 4: Nav Links -->
      <div>
        <h3 class="style-headline-3 mb-4">Nav Links Component</h3>
        <div>
          <!-- 
          NavLinks Props:
          - links: รายการ NavLink
          - @click: เหตุการณ์เมื่อมีการคลิก NavLink
        -->
          <NavLinks 
            :links="navMenuLinks" 
            @click="handleMenuClick" 
          />
        </div>
      </div>

      <!-- Row 5: Sidebar Component -->
      <div>
        <h3 class="style-headline-3 mb-4">Sidebar Component</h3>
        <div>
          <!-- 
          Sidebar Props:
          - links: รายการ NavLink
          - @click: เหตุการณ์เมื่อมีการคลิก NavLink
          - bottom-link: ลิงก์ด้านล่าง
          - @logout-click: เหตุการณ์เมื่อมีการคลิก Bottom Link
        -->
          <Sidebar
            :links="sidebarLinks"
            width="w-full"
            :bottom-link="bottomLink"
            @click="handleMenuClick"
            @logout-click="handleMenuClick"
          />
        </div>
      </div>

      <!-- Row 6: Card Request Component -->
      <div class="w-full max-w-[343px] md:max-w-[1120px] mx-auto">
        <h3 class="style-headline-3 mb-4">Card Request Component</h3>
        <div>
          <!-- 
          CardRequest Props:
          - title: หัวข้อ
          - date-str: วันที่
          - time: เวลา
          - service-name: รายการ
          - order-id: รหัสคำสั่งซ่อม
          - price: ราคารวม
          - location: สถานที่
          - date-label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - service-label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - order-id-label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - price-label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - location-label: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - cancel-text: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - accept-text: ข้อความแสดงหัวข้อ (มีหรือไม่มีก็ได้)
          - show-map-icon: แสดงไอคอนแผนที่ (มีหรือไม่มีก็ได้ ค่า default true)
          - @accept: เหตุการณ์เมื่อมีการคลิกปุ่มรับงาน
          - @reject: เหตุการณ์เมื่อมีการคลิกปุ่มปฏิเสธงาน
          - @view-map: เหตุการณ์เมื่อมีการคลิกปุ่มดูแผนที่
        -->
          <CardRequest
            title="ล้างแอร์"
            date-str="25/04/2563"
            time="13.00"
            service-name="ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง"
            order-id="AD04071205"
            price="1,550.00"
            location="444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ"
            @accept="handleAcceptRequest"
            @reject="handleRejectRequest"
            @view-map="handleViewMap"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Row 7: Icon Gallery -->
<div>
  <h3 class="style-headline-3 mb-4">Icon Gallery</h3>

  <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
    <div
      v-for="(Icon, name) in iconsMap"
      :key="name"
      class="flex flex-col items-center gap-2 p-3 border rounded-lg hover:shadow cursor-pointer"
      @click="copyIcon(name)"
    >
      <component :is="Icon" class="w-5 h-5 text-gray-700" />
      <span class="text-xs text-gray-500 text-center">
        {{ name }}
      </span>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Scoped styles specific only to layout containment in HelloWorld */
</style>
