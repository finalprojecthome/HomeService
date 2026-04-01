<template>
  <footer>
    
    <!-- Top -->
    <div class="flex flex-wrap justify-between bg-white lg:px-40 lg:gap-25 lg:pt-10 pb-5 gap-6 px-4 py-6">
      
      <!-- Left -->
      <div class="flex items-center gap-2 text-blue-600 style-headline-1">
        <img :src="homeIcon" alt="home" class="w-[40px] h-[40px]" />
        <span>HomeServices</span>
      </div>

      <!-- Center -->
      <div>
        <p class="style-headline-4 text-gray-950">
          บริษัท โฮมเซอร์วิสเซส จำกัด
        </p>
        <p class="style-body-3 text-gray-800">
          452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
        </p>
      </div>

      <!-- Right -->
      <div class="flex flex-col gap-2 style-body-1 text-gray-800">
        <div class="flex items-center gap-2">
          <Phone class="w-[18px] h-[18px]" />
          <span>080-540-6357</span>
        </div>

        <div class="flex items-center gap-2 style-body-1 text-gray-800">
          <MailIcon class="w-[18px] h-[18px]" />
          <span>contact@homeservices.co</span>
        </div>
      </div>

    </div>

    <!-- Bottom -->
    <div class="flex flex-wrap justify-between lg:gap-[102px] bg-gray-100 lg:py-4 lg:px-40 p-4 gap-4">
      
      <p class="style-body-4 text-gray-500 order-2 flex flex-wrap">
        copyright © 2021 HomeServices.com All rights reserved
      </p>

      <div class="flex gap-5 style-body-3 text-gray-700 lg:order-2 order-1 lg:flex-row flex-col">
        <a href="#" class="hover:underline">
          เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
        </a>
        <a href="#" class="hover:underline">
          นโยบายความเป็นส่วนตัว
        </a>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import homeIcon from "../assets/icon/house.png";
import { Phone, MailIcon } from "../components/icons/icons";
</script>