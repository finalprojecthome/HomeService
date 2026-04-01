<script setup lang="ts">
import { ref } from "vue";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import FilterBar, { type FilterBarState } from "../components/FilterBar.vue";
import ServiceCard from "../components/ServiceCard.vue";

const heroBgSrc =
  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80";

const query = ref("");
const selectedCategory = ref("");
const selectedPrice = ref("");
const selectedPriceRange = ref<[number, number]>([0, 2000]);
const selectedSort = ref("");

const categoryOptions = [
  { value: "", label: "บริการทั้งหมด" },
  { value: "cleaning", label: "บริการทั่วไป" },
  { value: "kitchen", label: "บริการห้องครัว" },
  { value: "bathroom", label: "บริการห้องน้ำ" },
];

const sortOptions = [
  { value: "recommended", label: "บริการแนะนำ" },
  { value: "popular", label: "บริการยอดนิยม" },
  { value: "asc", label: "ตามตัวอักษร (Ascending)" },
  { value: "desc", label: "ตามตัวอักษร (Descending)" },
];

function onSearch(filters: FilterBarState) {
  // Placeholder for backend filtering in next step.
  console.log("ServiceList filters:", filters);
}

const serviceItems = [
  {
    title: "ล้างแอร์",
    category: "บริการทั่วไป",
    categoryVariant: "blue" as const,
    price: "500.00 - 10,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ติดตั้งแอร์",
    category: "บริการทั่วไป",
    categoryVariant: "blue" as const,
    price: "2000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ซ่อมแอร์",
    category: "บริการทั่วไป",
    categoryVariant: "blue" as const,
    price: "4000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ทำความสะอาดทั่วไป",
    category: "บริการทั่วไป",
    categoryVariant: "blue" as const,
    price: "5000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ซ่อมเครื่องซักผ้า",
    category: "บริการทั่วไป",
    categoryVariant: "blue" as const,
    price: "500.00",
    imageSrc:
      "https://images.unsplash.com/photo-1626806787461-102c1a7f9f79?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ติดตั้งเตาแก๊ส",
    category: "บริการติดตั้ง",
    categoryVariant: "purple" as const,
    price: "1,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ติดตั้งเครื่องดูดควัน",
    category: "บริการติดตั้ง",
    categoryVariant: "purple" as const,
    price: "1,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ติดตั้งโถปัสสาวะ",
    category: "บริการติดตั้ง",
    categoryVariant: "green" as const,
    price: "1,000.00",
    imageSrc:
      "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ติดตั้งเครื่องทำน้ำอุ่น",
    category: "บริการติดตั้ง",
    categoryVariant: "green" as const,
    price: "500.00",
    imageSrc:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
  },
];
</script>

<template>
  <MainWithNarbar>
    <div class="min-h-screen bg-[#F3F4F6]">
      <section
        class="relative h-[240px] bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroBgSrc})` }"
      >
        <div class="absolute inset-0 bg-[#112A5A]/55"></div>
        <div
          class="relative z-10 h-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center text-white"
        >
          <h1 class="style-headline-2 md:style-headline-1 text-white">บริการของเรา</h1>
          <p class="style-body-3 md:style-body-1 mt-3 text-blue-100">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย <br>
โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
        </div>
      </section>

      <section
        class="w-full flex justify-center items-center border-y border-gray-200 bg-white sticky top-0 z-10"
      >
        <div class="max-w-[1200px] mx-auto">
          <FilterBar
            v-model:query="query"
            v-model:service="selectedCategory"
            v-model:price="selectedPrice"
            v-model:priceRange="selectedPriceRange"
            v-model:sort="selectedSort"
            :service-options="categoryOptions"
            :sort-options="sortOptions"
            service-label="หมวดหมู่บริการ"
            price-label="ราคา"
            sort-label="เรียงตาม"
            service-placeholder="บริการทั้งหมด"
            sort-placeholder="บริการแนะนำ"
            search-button-text="ค้นหา"
            @search="onSearch"
          />
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
          <ServiceCard
            v-for="(item, index) in serviceItems"
            :key="index"
            :title="item.title"
            :category="item.category"
            :categoryVariant="item.categoryVariant"
            :price="item.price"
            :imageSrc="item.imageSrc"
            ctaText="เลือกบริการ"
            class="cursor-pointer hover:scale-105 transition-all duration-300"
          />
        </div>
      </section>
      <section
        class="relative overflow-hidden w-full min-h-[400px] md:min-h-[284px] flex flex-col md:flex-row md:justify-center items-center border-t border-gray-200 bg-blue-600 pt-12 md:pt-0"
      >
        <h3 class="text-center style-headline-4 md:style-headline-3 text-white mx-auto max-w-[810px] w-[400px] md:w-full">
          เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร
          โดยทีมช่างมืออาชีพมากกว่า 100 ทีม 
          สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และ สร้างความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม. 
          มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
        </h3>
        <div class="absolute bottom-[-60px] md:top-7 md:-right-34 opacity-40">
          <img
            src="../assets/icon/house.png"
            alt="house"
            class="w-[250px] md:w-[416px] h-[250px] md:h-[416px]"
          >
        </div>
      </section>
    </div>
  </MainWithNarbar>
</template>
