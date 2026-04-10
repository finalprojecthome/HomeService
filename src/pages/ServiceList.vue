<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";
import FilterBar from "../components/FilterBar.vue";
import ServiceCard from "../components/ServiceCard.vue";
import { useServiceFilters } from "../composables/useServiceFilters";
import { useScrollState } from "../composables/useScrollState";
import { fetchServices, type ServiceApiItem } from "../services/serviceApi";
import banner from "../assets/servicelist/banner.jpg";

const heroBgSrc =
  banner;

const query = ref("");
const selectedCategory = ref("");
const selectedPrice = ref("");
const selectedPriceRange = ref<[number, number]>([0, 2000]);
const selectedSort = ref("");
const { scrollDirection, scrollY } = useScrollState();
const router = useRouter();

const isHideNavbar = computed(
  () => scrollY.value > 60 && scrollDirection.value === "down",
);

const categoryOptions = computed(() => {
  const labels = new Set<string>();
  for (const s of serviceItems.value) {
    if (s.category) labels.add(s.category);
  }
  const sorted = [...labels].sort((a, b) => a.localeCompare(b, "th"));
  return [
    { value: "", label: "บริการทั้งหมด" },
    ...sorted.map((label) => ({ value: label, label })),
  ];
});

const sortOptions = [
  { value: "recommended", label: "บริการแนะนำ" },
  { value: "popular", label: "บริการยอดนิยม" },
  { value: "asc", label: "ตามตัวอักษร (Ascending)" },
  { value: "desc", label: "ตามตัวอักษร (Descending)" },
];

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  categoryVariant: "blue" | "purple" | "green";
  price: string;
  imageSrc: string;
};

const serviceItems = ref<ServiceItem[]>([]);
const isLoadingServices = ref(false);
const serviceLoadError = ref("");
const itemsPerPage = 9;
const currentPage = ref(1);

function mapCategoryVariant(
  category: string,
): "blue" | "purple" | "green" {
  if (category === "บริการติดตั้ง") return "purple";
  return "blue";
}

function mapApiService(item: ServiceApiItem): ServiceItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    categoryVariant: mapCategoryVariant(item.category),
    price: item.price,
    imageSrc: item.imageSrc,
  };
}

async function loadServices() {
  isLoadingServices.value = true;
  serviceLoadError.value = "";

  try {
    const apiItems = await fetchServices();
    serviceItems.value = apiItems.map(mapApiService);
  } catch (error) {
    serviceLoadError.value = "ไม่สามารถโหลดรายการบริการได้";
    console.error(error);
  } finally {
    isLoadingServices.value = false;
  }
}

const {
  displayedItems: displayedServiceItems,
  onSearch,
  resetSearch,
} = useServiceFilters<ServiceItem>(serviceItems);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(displayedServiceItems.value.length / itemsPerPage)),
);

const paginatedServiceItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return displayedServiceItems.value.slice(start, start + itemsPerPage);
});

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1),
);

watch(displayedServiceItems, () => {
  currentPage.value = 1;
});

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
}

onMounted(() => {
  void loadServices();
});

function clearFilters() {
  query.value = "";
  selectedCategory.value = "";
  selectedPrice.value = "";
  selectedPriceRange.value = [0, 2000];
  selectedSort.value = "";
  currentPage.value = 1;
  resetSearch();
}

function goToBooking(item: ServiceItem) {
  void router.push({
    name: "booking",
    query: { serviceId: item.id, serviceName: item.title },
  });
}
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
        class="w-full flex justify-center items-center border-y border-gray-200 bg-white sticky z-10 transition-[top] duration-300"
        :class="isHideNavbar ? 'top-0' : 'top-13 md:top-20'"
      >
        <div class="mx-auto">
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
            clear-button-text="ล้างตัวกรอง"
            @search="onSearch"
            @clear="clearFilters"
          />
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col">
        <div v-if="isLoadingServices" class="rounded-xl p-10 text-center">
          <p class="style-headline-5 text-gray-900">กำลังโหลดบริการ...</p>
        </div>

        <div v-else-if="serviceLoadError" class="rounded-xl p-10 text-center">
          <p class="style-headline-5 text-gray-900">{{ serviceLoadError }}</p>
        </div>

        <div v-else-if="displayedServiceItems.length === 0" class="rounded-xl  p-10 text-center">
          <p class="style-headline-5 text-gray-900">ไม่พบบริการ</p>
          <p class="mt-2 style-body-3 text-gray-500">ลองปรับคำค้นหา หมวดหมู่ หรือช่วงราคา แล้วค้นหาอีกครั้ง</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ">
          <ServiceCard
            v-for="(item, index) in paginatedServiceItems"
            :key="item.id || index"
            interactive
            :title="item.title"
            :category="item.category"
            :categoryVariant="item.categoryVariant"
            :price="item.price"
            :imageSrc="item.imageSrc"
            ctaText="เลือกบริการ"
            @cta-click="goToBooking(item)"
          />
        </div>
        <div
          v-if="!isLoadingServices && !serviceLoadError && displayedServiceItems.length > 0"
          class="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            class="px-3 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            ก่อนหน้า
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            class="min-w-10 px-3 py-2 rounded-md border text-sm"
            :class="
              page === currentPage
                ? 'bg-[#112A5A] text-white border-[#112A5A]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-md border border-gray-300 text-sm disabled:opacity-50"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            ถัดไป
          </button>
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
