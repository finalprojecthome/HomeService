<script setup lang="ts">
import Badge from './ui/Badge.vue';
import Button from './ui/Button-card.vue';
import Icon from './ui/Icon.vue';

type CategoryVariant = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

const props = withDefaults(defineProps<{
  imageSrc?: string;
  category: string;
  categoryVariant?: CategoryVariant;
  title: string;
  price: number;
  ctaText?: string;
}>(), {
  categoryVariant: 'blue',
  ctaText: 'เลือกบริการ', // ตาม Figma
});

const emit = defineEmits<{
  (e: 'cta-click'): void
}>();

const tagIconPath = "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z";
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
        <Icon :path="tagIconPath" class="w-[18px] h-[18px] text-gray-400" /> 
        <span>฿ {{ price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
      </div>
      
      <Button variant="primary" @click="emit('cta-click')" class="mt-2 w-full text-center flex justify-center">
        {{ ctaText }}
      </Button>
    </div>
  </div>
</template>
