<script setup lang="ts">
import ProductCard from "../components/ServiceCard.vue";
import NavigationButton from "../components/ui/NavigationButton.vue";
import MainWithNarbar from "../components/layouts/MainWithNarbar.vue";

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
    price: "500 - 1,000",
    ctaText: "เลือกบริการ",
  },
  {
    category: "บริการช่างซ่อม",
    categoryVariant: "blue",
    title: "ล้างแอร์ติดผนัง",
    price: "800 - 1,500",
    ctaText: "เลือกบริการ",
  },
  {
    category: "บริการช่างซ่อม",
    categoryVariant: "blue",
    title: "ล้างเครื่องซักผ้า",
    price: "1,200 - 2,000",
    ctaText: "เลือกบริการ",
  },
] as const;

const heroClass = "absolute bottom-[-37px] right-[-18px] w-[280px] md:bottom-[-55px] md:right-[-18px] md:max-w-[520px]  lg:w-[400px] xl:w-[520px] lg:bottom-[-150px] lg:right-[-18px] 2xl:right-[100px] 2xl:bottom-[-150px]"
</script>



<template>
  <MainWithNarbar>
    <div class="w-full min-h-screen bg-[#F3F4F6]">
      <!-- Hero -->
      <section
        class="relative bg-blue-100 w-full h-[654px] md:h-[400px] lg:h-[540px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 pt-14 pb-8 md:pt-20 md:pb-10 overflow-hidden"
      >
        <div class="mx-auto ">
          <div
            class="flex flex-col"
          >
            <div class="flex flex-col 2xl:px-50">
              <h1
                class="text-[40px] sm:text-[34px] md:text-[44px] lg:text-[64px] font-bold text-blue-700 leading-[1.08]"
              >
                เรื่องบ้าน...ให้เราช่วยดูแลคุณ
              </h1>

              <p
                class="text-[20px] sm:text-[24px] md:text-[32px] lg:text-[42px] font-bold text-black mt-4 leading-[1.1]"
              >
                "สะดวก ราคาคุ้มค่า เชื่อถือได้"
              </p>

              <p
                class=" w-[290px] md:w-[400px] lg:w-[515px] text-[18px] md:text-[20px] lg:text-[24px] text-gray-700 mt-8 leading-relaxed"
              >
                ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน 
                โดยพนักงานแม่บ้าน และช่างมืออาชีพ
              </p>

              <div class="mt-8">
                <NavigationButton
                  to="/services"
                  size="lg"
                  class="w-fit"
                >
                  เช็คราคาบริการ
                </NavigationButton>
              </div>
            </div>

            <div
              class="relative w-full h-[230px] sm:h-[260px] md:h-auto flex justify-end"
            >
              <img
                :src="heroImgSrc"
                alt="HomeServices hero"
                :class="heroClass"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Featured services -->
      <section class="py-8 md:py-12">
        <div
          class="w-full lg:px-20 xl:px-32 2xl:px-40"
        >
          <h2 class="style-headline-2 text-blue-950 text-center">
            บริการยอดฮิตของเรา
          </h2>

          <div
            class="px-4 mt-8 sm:mt-10 flex flex-col md:flex-row gap-6 md:gap-8 justify-center"
          >
            <ProductCard
              class="cursor-pointer hover:scale-105 transition-all duration-300"
              v-for="(s, idx) in featuredServices"
              :key="idx"
              :category="s.category"
              :categoryVariant="s.categoryVariant"
              :title="s.title"
              :price="s.price"
              :ctaText="s.ctaText"
            />
          </div>

          <div class="mt-10 sm:mt-12 flex justify-center">
            <NavigationButton to="/services" size="lg">
              ดูบริการทั้งหมด
            </NavigationButton>
          </div>
        </div>
      </section>

      <!-- Job / partner banner -->
      <section class="relative bg-blue-600  md:max-h-[378px] overflow-hidden">
        <div class="flex flex-col md:flex-row gap-8 md:gap-6 lg:gap-32 items-stretch">
          <div>
            <img
              :src="jobImgSrc"
              alt="สมัครงาน HomeServices"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="text-white flex flex-col pl-6 md:pl-0 items-start lg:justify-center md:items-start h-[400px] md:h-auto">
            <h3 class="style-headline-1 md:style-headline-2 lg:style-headline-1 text-white mt-3 ">
              มาร่วมเป็นพนักงานซ่อม<br />
              กับ HomeServices
            </h3>

            <p class="style-headline-5 md:style-body-4 lg:style-headline-3 text-blue-100 mt-4 leading-relaxed">
              เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี!<br />
              และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
            </p>

            <div class="mt-7 flex flex-col lg:flex-row items-start gap-3">
              <p class="style-headline-2 lg:style-headline-1 text-blue-100">ติดต่อที่อีเมล</p>
              <a
                href="mailto:job@homeservices.co"
                class="style-headline-2 lg:style-headline-1 text-white font-semibold hover:underline"
              >
                job@homeservices.co
              </a>
            </div>
          </div>
        </div>
        <img
          src="../assets/icon/house.png"
          alt="House icon"
          class="absolute bottom-[-70px] right-[-60px] md:bottom-[-100px] md:right-[-80px] lg:bottom-[-45px] lg:right-[-100px] w-[306px] h-[306px] md:w-[400px] md:h-[400px] lg:w-[416px] lg:h-[416px] object-cover opacity-20 md:opacity-5 lg:opacity-40"
        />
      </section>
    </div>
  </MainWithNarbar>
</template>
