<script setup lang="ts">
import ProductCard from "../components/ServiceCard.vue";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";

const services = [
  {
    category: "บริการช่างซ่อม",
    categoryVariant: "blue",
    title: "ทำความสะอาดทั่วไป",
    price: 500,
    ctaText: "เลือกบริการ",
  },
  {
    category: "บริการช่างซ่อม",
    categoryVariant: "blue",
    title: "ล้างแอร์ติดผนัง",
    price: 1000,
    ctaText: "เลือกบริการ",
  },
  {
    category: "บริการช่างซ่อม",
    categoryVariant: "blue",
    title: "ล้างเครื่องซักผ้า",
    price: 2000,
    ctaText: "เลือกบริการ",
  },
] as const;
</script>

<template>
  <MainWithNarbar>
    <div class="w-full min-h-screen bg-[#F3F4F6]">
      <section
        class="py-12 md:py-16"
      >
        <div
          class="w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40"
        >
          <h1 class="style-headline-2 text-blue-950 text-center">
            บริการทั้งหมด
          </h1>
          <p class="style-body-2 text-gray-600 text-center mt-3 max-w-2xl mx-auto">
            เลือกบริการที่ต้องการ ราคาโปร่งใส จัดการผ่าน HomeServices
          </p>

          <div class="mt-10 flex flex-wrap justify-center gap-6 md:gap-8">
            <ProductCard
              v-for="(s, idx) in services"
              :key="idx"
              class="cursor-pointer hover:scale-105 transition-all duration-300"
              :category="s.category"
              :categoryVariant="s.categoryVariant"
              :title="s.title"
              :price="s.price"
              :ctaText="s.ctaText"
            />
          </div>
        </div>
      </section>
    </div>
  </MainWithNarbar>
</template>
