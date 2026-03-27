<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import OrderCard from '../components/OrderCard.vue'
</script>

<template>
  <div class="min-h-screen bg-[#F3F4F6] p-6 md:p-12 font-sans">
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
  </div>
</template>
