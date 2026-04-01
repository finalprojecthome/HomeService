<script setup lang="ts">
import ProductCard from "../components/ui/ProductCard.vue";
import OrderCard from "../components/ui/OrderCard.vue";
import ServiceCard from "../components/ServiceCard.vue";
import ServiceOrderCard from "../components/ServiceOrderCard.vue";
import OrderSummary from "../components/OrderSummary.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Dropdown, { type DropdownOption } from "../components/ui/Dropdown.vue";
import PriceRange from "../components/ui/PriceRange.vue";
import ImageUpload from "../components/ui/ImageUpload.vue";
import RadioButton from "../components/ui/RadioButton.vue";
import RadioButtonWithInput from "../components/ui/RadioButtonWithInput.vue";
import Checkbox from "../components/ui/Checkbox.vue";
import SelectBox from "../components/ui/SelectBox.vue";
import SelectFilter from "../components/ui/SelectFilter.vue";
import PaymentSelection from "../components/PaymentSelection.vue";
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
  DetailIcon,
  CheckedCard,
} from "../components/icons";
import Sidebar from "../components/Sidebar.vue";
import CardRequest from "../components/CardRequest.vue";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import Skeleton from "../components/ui/Skeleton.vue";
import Avatar from "../components/ui/Avatar.vue";
import { NotificationFilledIcon, Pencil } from "../components/icons/icons";
import Stepper from "../components/Stepper.vue";
import StateList from "../components/StateList.vue";
import FilterBar from "../components/FilterBar.vue";
import QuantityList from "../components/QuantityList.vue";
import Input from "../components/ui/Input.vue";
import DatePicker from "../components/ui/DatePicker.vue";
import TimePicker from "../components/ui/TimePicker.vue";
import Breadcrumb, { type BreadcrumbItem } from "../components/ui/Breadcrumb.vue";
import Footer from "../components/Footer.vue";

const bookingTime = ref<string | null>(null);
const bookingDate = ref<string | null>(null);
const selectedService = ref<string | null>(null);

const selectServiceDemo = (serviceName: string) => {
  selectedService.value = serviceName;
};

const resetSelectedServiceDemo = () => {
  selectedService.value = null;
};
const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  {
    label: "บริการของเรา",
    clickable: !!selectedService.value,
    active: !selectedService.value,
  },
  ...(selectedService.value
    ? [
        {
          label: selectedService.value,
          active: true,
        },
      ]
    : []),
]);

const handleBreadcrumbNavigate = (index: number) => {
  if (index === 0) {
    resetSelectedServiceDemo();
  }
};
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
const radio1 = ref("selected");
const radioInput1 = ref("selected");
const inputText1 = ref("");
const inputText2 = ref("");
const inputText3 = ref("");
const checkbox1 = ref(false);
const checkbox2 = ref(false);
const checkbox3 = ref(true);
const selectBox1 = ref("selected");
const paymentMethod = ref("qr");
const filter1 = ref("");
const filterOptions = [
  { value: "selected", label: "Selected" },
  { value: "unselected", label: "Unselected" },
  { value: "hover", label: "Hover" },
];

// Demo Stepper / StateList / FilterBar
const steps = [
  { id: "services", label: "รายการ", icon: DetailIcon },
  { id: "detail", label: "กรอกข้อมูลบริการ", icon: Pencil },
  { id: "pay", label: "ชำระเงิน", icon: CheckedCard },
];
const activeStepIndex = ref(-1);

// Demo: Quantity list (like screenshot)
const quantityListItems = [
  {
    id: "wall",
    title: "9,000 - 18,000 BTU, แบบติดผนัง",
    pricePerUnit: 800,
    unitLabel: "เครื่อง",
  },
  {
    id: "ceiling",
    title: "9,000 - 18,000 BTU, แบบฝังฝ้า",
    pricePerUnit: 800,
    unitLabel: "เครื่อง",
  },
];

const quantityListQuantities = ref<number[]>([0, 0]);

const query = ref("");
const service = ref("");
const price = ref("");
const filterPriceRange = ref<[number, number]>([0, 2000]);
const sort = ref("");

const serviceOptions = [
  { value: "", label: "ทั้งหมด" },
  { value: "cleaning", label: "ทำความสะอาด" },
  { value: "repair", label: "ซ่อมบำรุง" },
];

const sortOptions = [
  { value: "", label: "ตรงตัวอัก..." },
  { value: "exact", label: "ตรงตัวอัก..." },
  { value: "recent", label: "ล่าสุด" },
];

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

  <!-- Main with Narbar -->
  <MainWithNarbar>
    <div
      class="flex flex-col items-center gap-10 min-h-screen bg-[#F3F4F6] p-2"
    >
      <h1 class="style-headline-1">^ Main with Navbar Up here ^</h1>
      <!-- ปุ่ม -->
      <h1 class="style-headline-1">Button</h1>
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
          <ActionButton
            variant="secondary"
            size="lg"
            @click="handleClickButton"
          >
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

        <div class="flex gap-2 items-center">
          <ActionButton variant="icon" @click="handleClickButton">
            <NotificationFilledIcon />
          </ActionButton>
          <ActionButton variant="icon" @click="handleClickButton" disabled>
            <NotificationFilledIcon />
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

      <!-- Skeleton -->
      <h1 class="style-headline-1">Skeleton</h1>
      <div class="flex gap-2 justify-center items-center">
        <Skeleton class="size-8" />
        <Skeleton class="size-12" />
        <Skeleton class="size-16" />
        <Skeleton class="h-16 w-32" />
        <Skeleton class="size-16 rounded-full" />
      </div>

      <!-- Avatar -->
      <h1 class="style-headline-1">Avatar</h1>
      <div class="flex gap-2 justify-center items-center">
        <Avatar />
        <Avatar class="size-20" />
        <Avatar
          src="https://izmkosofgpuwlopleptv.supabase.co/storage/v1/object/public/user-assets/87eb79fc-f79b-43b3-828b-76b6c845409e-20260328082723.jpeg"
          alt="User Avatar"
          class="size-20"
        />
        <Avatar :src="null" :fallback-icon="Pencil" class="size-20" />
        <Avatar :src="null" class="size-40" />
        <Avatar
          src="https://izmkosofgpuwlopleptv.supabase.co/storage/v1/object/public/user-assets/87eb79fc-f79b-43b3-828b-76b6c845409e-20260328082723.jpeg"
          alt="User Avatar"
          :fallback-icon="Pencil"
          class="size-40"
        />
      </div>

      <!-- Input -->
      <h1 class="style-headline-1">Input</h1>
      <div class="flex flex-col items-center gap-4">
        <Input name="input" placeholder="Place Holder" />
        <Input
          name="input-placeholder"
          value="Default Value"
          placeholder="Place Holder"
        />
        <Input
          name="input-error"
          value="Error Input"
          placeholder="Place Holder"
          :isError="true"
        />
        <Input name="input-disabled" placeholder="Place Holder" disabled />
        <Input
          name="input-adjust-size"
          value="Adjust Size"
          placeholder="Place Holder"
          class="w-100"
        />
        <Input
          name="input-adjust-size-error"
          value="Adjust Size But Error"
          placeholder="Place Holder"
          class="w-125"
          :isError="true"
        />
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
      <!-- Breadcrumb Section -->
      <section class="w-full max-w-5xl mx-auto space-y-6">
        <h2 class="style-headline-2 border-b pb-4">Breadcrumb</h2>

        <div class="space-y-4">
          <div class="space-y-2">
            <p class="style-body-2 text-gray-500">Size: md</p>
            <Breadcrumb
              :items="breadcrumbItems"
              size="md"
              @navigate="handleBreadcrumbNavigate"
            />
          </div>

          <div class="space-y-2">
            <p class="style-body-2 text-gray-500">Size: sm</p>
            <Breadcrumb
              :items="breadcrumbItems"
              size="sm"
              @navigate="handleBreadcrumbNavigate"
            />
          </div>

          <div class="flex flex-wrap gap-3">
            <ActionButton @click="selectServiceDemo('ล้างแอร์')">
              ล้างแอร์
            </ActionButton>

            <ActionButton variant="secondary" @click="selectServiceDemo('ซ่อมแอร์')">
              ซ่อมแอร์
            </ActionButton>

            <ActionButton variant="ghost" @click="resetSelectedServiceDemo">
              Reset
            </ActionButton>
          </div>
        </div>
      </section>

      <!-- New Components Section -->
      <div class="max-w-5xl mx-auto mt-12 space-y-12">
        <h2 class="style-headline-2 border-b pb-4">New UI Components (Service Cards & Order Summary)</h2>
        
        <section class="space-y-6">
          <h3 class="style-headline-3">ServiceCard</h3>
          <ServiceCard
            imageSrc="https://izmkosofgpuwlopleptv.supabase.co/storage/v1/object/public/user-assets/87eb79fc-f79b-43b3-828b-76b6c845409e-20260328082723.jpeg"
            category="บริการทั่วไป"
            categoryVariant="blue"
            title="ทำความสะอาดทั่วไป"
            price="500.00 - 1,000.00"
            ctaText="เลือกบริการ"
          />
        </section>

        <section class="space-y-6">
          <h3 class="style-headline-3">ServiceOrderCard</h3>
          <p class="text-sm text-gray-500 mb-4">Responsive Element: Resize window to see Mobile layout.</p>
          <ServiceOrderCard
            orderId="AD04071205"
            status="pending"
            statusLabel="รอดำเนินการ"
            date="25/04/2563 เวลา 13.00 น."
            staff="สมาน ไมตรี"
            :price="1550"
            :items="['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง']"
          />
        </section>

        <section class="space-y-6">
          <h3 class="style-headline-3">OrderSummary</h3>
          <OrderSummary
            :items="[
              { name: '9,000 - 18,000 BTU, แบบติดผนัง', quantity: 2 },
              { name: '9,000 - 18,000 BTU, แบบติดผนัง', quantity: 2 }
            ]"
            date="23 เม.ย. 2022"
            time="11.00 น."
            location="444/4 คอนโดศุภาลัย เสนานิคม จตุจักร กรุงเทพฯ"
            :discount="50"
            :totalPrice="1550"
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
        <div class="max-w-sm flex gap-100">
          <DatePicker v-model="bookingDate" />
        </div>
        <div class="max-w-sm">
        <TimePicker v-model="bookingTime" />
        <p class="mt-3 text-sm text-gray-600">Selected time: {{ bookingTime }}</p>
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

        <!-- Row 4: Nav Links -->
        <div>
          <h3 class="style-headline-3 mb-4">Nav Links Component</h3>
          <div>
            <!-- 
          NavLinks Props:
          - links: รายการ NavLink
          - @click: เหตุการณ์เมื่อมีการคลิก NavLink
        -->
            <NavLinks :links="navMenuLinks" @click="handleMenuClick" />
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

    <div class="p-8 max-w-5xl mx-auto bg-white">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <section>
          <h3 class="style-headline-4 text-gray-950 mb-6">Radio Button</h3>
          <div class="flex flex-col">
            <RadioButton
              v-model="radio1"
              value="default"
              label="Default"
              name="radio1"
            />
            <RadioButton
              v-model="radio1"
              value="hover"
              label="Hover"
              name="radio1"
            />
            <RadioButton
              v-model="radio1"
              value="selected"
              label="Selected"
              name="radio1"
            />
            <RadioButton
              value="disabled"
              label="Disable"
              name="radio1"
              disabled
            />
          </div>
        </section>

        <section>
          <h3 class="style-headline-4 text-gray-950 mb-6">
            Radio Button with Input
          </h3>
          <div class="flex flex-col">
            <RadioButtonWithInput
              v-model="radioInput1"
              v-model:input-value="inputText1"
              value="default"
              label="Default"
              name="radio-input1"
            />
            <RadioButtonWithInput
              v-model="radioInput1"
              v-model:input-value="inputText2"
              value="hover"
              label="Hover"
              name="radio-input1"
            />
            <RadioButtonWithInput
              v-model="radioInput1"
              v-model:input-value="inputText3"
              value="selected"
              label="Selected"
              name="radio-input1"
            />
            <RadioButtonWithInput
              value="disabled"
              label="Disable"
              name="radio-input1"
              disabled
            />
          </div>
        </section>

        <section>
          <h3 class="style-headline-4 text-gray-950 mb-6">Checkbox</h3>
          <div class="flex flex-col">
            <Checkbox v-model="checkbox1" label="Default" />
            <Checkbox v-model="checkbox2" label="Hover" />
            <Checkbox v-model="checkbox3" label="Selected" />
            <Checkbox :model-value="false" label="Disable" disabled />
          </div>
        </section>
      </div>

      <section class="mt-12">
        <h3 class="style-headline-4 text-gray-950 mb-6">Select Box</h3>
        <div class="flex gap-4 flex-wrap">
          <SelectBox v-model="selectBox1" value="default" label="Default" />
          <SelectBox v-model="selectBox1" value="hover" label="Hover" />
          <SelectBox v-model="selectBox1" value="selected" label="Selected" />
        </div>
      </section>

      <section class="mt-12">
        <h3 class="style-headline-4 text-gray-950 mb-6">Select Filter</h3>
        <div class="flex gap-6 flex-wrap">
          <SelectFilter
            v-model="filter1"
            :options="filterOptions"
            label="Default"
            placeholder="Selected"
          />
        </div>
      </section>
    </div>
    <div class="p-8 max-w-5xl mx-auto">
      <h1 class="style-headline-3 mb-4">Payment Selection</h1>
      <section class="mt-12">
        <PaymentSelection v-model="paymentMethod" />
      </section>

      <section class="mt-12">
        <h2 class="style-headline-3 mb-4">Stepper</h2>
        <Stepper
          :steps="steps"
          :active-index="activeStepIndex"
          @change="activeStepIndex = $event"
        />
      </section>

      <section class="mt-12">
        <h2 class="style-headline-3 mb-4">State List</h2>
        <StateList :items="steps" :active-index="activeStepIndex" />
      </section>

      <section class="mt-12">
        <h2 class="style-headline-3 mb-4">Quantity List</h2>
        <QuantityList
          title="เลือกจำนวนเครื่อง"
          :items="quantityListItems"
          v-model="quantityListQuantities"
        />
      </section>

      <section class="mt-12">
        <h2 class="style-headline-3 mb-4">Filter Bar</h2>
        <FilterBar
          v-model:query="query"
          v-model:service="service"
          v-model:price="price"
          v-model:priceRange="filterPriceRange"
          v-model:sort="sort"
          :service-options="serviceOptions"
          :sort-options="sortOptions"
          @search="(v) => console.log('filter bar search', v)"
        />
      </section>
    </div>
  </MainWithNarbar>
  <Footer />
</template>

<style scoped>
/* Scoped styles specific only to layout containment in HelloWorld */
</style>
