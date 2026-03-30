<script setup lang="ts">
import Badge from './ui/Badge.vue';
import ActionButton from './ui/ActionButton.vue';
import { TagIcon } from './icons/icons';

type CategoryVariant = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

const props = withDefaults(defineProps<{
  imageSrc?: string;
  category: string;
  categoryVariant?: CategoryVariant;
  title: string;
  price: number | string;
  ctaText?: string;
}>(), {
  categoryVariant: 'blue',
  ctaText: 'เลือกบริการ', // ตาม Figma
});

const emit = defineEmits<{
  (e: 'cta-click'): void
}>();


</script>

<template>
  <div class="style-card-box style-shadow overflow-hidden w-full max-w-[320px] flex flex-col">
    <div v-if="imageSrc" class="h-[190px] w-full bg-gray-100 overflow-hidden">
      <img :src="imageSrc" :alt="title" class="w-full h-full object-cover" />
    </div>
    <div v-else class="bg-[#DCE6FF] h-[190px] w-full"></div>
    
    <div class="p-5 flex flex-col items-start gap-4">
      <Badge :variant="categoryVariant">{{ category }}</Badge>
      
      <h2 class="text-xl font-bold text-gray-900 mt-1">{{ title }}</h2>
      
      <div class="flex items-center gap-1.5 text-[15px] text-gray-500 mb-2">
        <TagIcon class="w-[18px] h-[18px] text-gray-400" /> 
        <span>ค่าบริการประมาณ {{ typeof price === 'number' ? price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price }} ฿</span>
      </div>
      
      <ActionButton variant="ghost" @click="emit('cta-click')" class="mt-2 p-0 font-semibold underline underline-offset-2">
        {{ ctaText }}
      </ActionButton>
    </div>
  </div>
</template>
