<script setup lang="ts">
import ProductCard from "../components/ServiceCard.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";

// Placeholder images:
// ให้คุณเปลี่ยน path ของรูปด้านล่างเป็นรูปของจริงภายหลัง
// ใช้ new URL(...) เพื่อให้ Vite จัดการ path รูปให้ถูกต้อง
const heroImgSrc = new URL(
  "../assets/homepage/herosection.png",
  import.meta.url,
).href;
const jobImgSrc = new URL("../assets/homepage/CTAsection.png", import.meta.url)
  .href;

const featuredServices = [
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
      <!-- Hero -->
      <section
        class="bg-[#EAF2FF] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 pt-14 md:pt-20"
      >
        <div class="">
          <div class="flex justify-center">
            <div class="flex flex-col justify-center">
              <h1 class="text-[64px] font-bold text-blue-700">
                เรื่องบ้าน...ให้เราช่วยดูแลคุณ
              </h1>
              <p class="text-[42px] font-bold text-black mt-3">
                "สะดวก ราคาคุ้มค่า เชื่อถือได้"
              </p>
              <p class="text-[24px] text-gray-700 mt-5 leading-relaxed">
                ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน <br />
                โดยพนักงานแม่บ้าน และช่างมืออาชีพ
              </p>

              <div class="mt-8">
                <NavigationButton to="/services" size="lg">
                  เริ่มค้นหาบริการ
                </NavigationButton>
              </div>
            </div>

            <div class="relative">
              <img
                :src="heroImgSrc"
                alt="HomeServices hero"
                class="w-full max-w-[520px] mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Featured services -->
      <section class="py-12 md:py-16">
        <div
          class="w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40"
        >
          <h2 class="style-headline-2 text-blue-950 text-center">
            บริการยอดฮิตของเรา
          </h2>

          <div class="mt-10 flex flex-wrap justify-center gap-6 md:gap-8">
          
              <ProductCard class="cursor-pointer hover:scale-105 transition-all duration-300"
                v-for="(s, idx) in featuredServices"
                :key="idx"
                :category="s.category"
                :categoryVariant="s.categoryVariant"
                :title="s.title"
                :price="s.price"
                :ctaText="s.ctaText"
              />
            
          </div>

          <div class="mt-12 flex justify-center">
            <NavigationButton to="/services" size="lg">
              ดูบริการทั้งหมด
            </NavigationButton>
          </div>
        </div>
      </section>

      <!-- Job / partner banner -->
      <section class="bg-blue-600 max-h-[378px]">
        <div class="flex gap-32 items-stretch">
          <div>
            <img
              :src="jobImgSrc"
              alt="สมัครงาน HomeServices"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="text-white flex flex-col justify-center">
            <h3 class="style-headline-1 text-white mt-3">
              มาร่วมเป็นพนักงานซ่อม<br />
              กับ HomeServices
            </h3>

            <p class="style-body-3 text-blue-100 mt-4 leading-relaxed">
              เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี!<br />
              และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
            </p>

            <div class="mt-7 flex items-center gap-3">
              <p class="style-headline-1 text-blue-100">ติดต่อที่อีเมล</p>
              <a
                href="mailto:job@homeservices.co"
                class="style-headline-1 text-white font-semibold hover:underline"
              >
                job@homeservices.co
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainWithNarbar>
</template>
