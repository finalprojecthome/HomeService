<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Badge from './ui/Badge.vue';
import { TagIcon } from './icons/icons';
import cn from '../utils/cn';
import { baseStyle, sizes, variants } from '../constants/buttonVariant';

type CategoryVariant = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

const props = withDefaults(defineProps<{
  imageSrc?: string;
  category: string;
  categoryVariant?: CategoryVariant;
  title: string;
  price: number | string;
  ctaText?: string;
  /** Whole card is clickable and emits `cta-click` when true. */
  interactive?: boolean;
}>(), {
  categoryVariant: 'blue',
  ctaText: 'เลือกบริการ', // ตาม Figma
  interactive: false,
});

const imageLoadError = ref(false);

watch(
  () => props.imageSrc,
  () => {
    imageLoadError.value = false;
  },
);

const onImgError = () => {
  // Avoid flipping back/forth if fallback also errors.
  if (!imageLoadError.value) imageLoadError.value = true;
};

const placeholderKind = computed(() => {
  const t = String(props.title ?? '');
  if (t.includes('แอร์') || t.includes('ปรับอากาศ')) return 'ac';
  if (t.includes('ซักผ้า')) return 'washer';
  return 'clean';
});

const emit = defineEmits<{
  (e: 'cta-click'): void
}>();

const ctaSpanClass = computed(() =>
  cn(
    baseStyle,
    sizes.sm,
    variants.ghost,
    'mt-2 p-0 font-semibold underline underline-offset-2 pointer-events-none',
  ),
);

const rootClass = computed(() =>
  cn(
    'style-card-box style-shadow overflow-hidden w-full max-w-none sm:max-w-[340px] md:max-w-[320px] flex flex-col',
    props.interactive &&
      'cursor-pointer transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
  ),
);

function onCardActivate() {
  if (!props.interactive) return;
  emit('cta-click');
}

</script>

<template>
  <div
    :class="rootClass"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-label="interactive ? `${ctaText} — ${title}` : undefined"
    @click="onCardActivate"
    @keydown.enter.prevent="onCardActivate"
    @keydown.space.prevent="onCardActivate"
  >
    <div
      v-if="imageSrc && !imageLoadError"
      class="h-[150px] sm:h-[165px] md:h-[190px] w-full bg-gray-100 overflow-hidden"
    >
      <img
        :src="imageSrc"
        :alt="title"
        class="w-full h-full object-cover"
        @error="onImgError"
      />
    </div>

    <!-- ไม่มี URL: skeleton -->
    <div
      v-else-if="!imageSrc"
      class="h-[150px] sm:h-[165px] md:h-[190px] w-full bg-gray-200 animate-pulse"
      aria-hidden="true"
    />

    <!-- โหลดรูปไม่สำเร็จ: ไอคอน + พื้นหลัง -->
    <div
      v-else
      class="h-[150px] sm:h-[165px] md:h-[190px] w-full overflow-hidden flex items-center justify-center bg-linear-to-br from-[#DCE6FF] to-[#EAF2FF]"
    >
      <svg
        v-if="placeholderKind === 'clean'"
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-blue-700/90"
      >
        <path d="M4 20h4" />
        <path d="M14 4l6 6" />
        <path d="M13 5l-3 3" />
        <path d="M9 9l6 6" />
        <path d="M8 12l-4 4" />
        <path d="M16 8l-4 4" />
      </svg>
      <svg
        v-else-if="placeholderKind === 'ac'"
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-blue-700/90"
      >
        <rect x="4" y="7" width="16" height="8" rx="2" />
        <path d="M7 15l-2 3" />
        <path d="M17 15l2 3" />
        <path d="M8 11h8" />
      </svg>
      <svg
        v-else
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-blue-700/90"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M9 12h6" />
        <path d="M7 5l2 2" />
        <path d="M17 5l-2 2" />
        <path d="M12 3v2" />
      </svg>
    </div>
    
    <div class="p-4 sm:p-5 flex flex-col items-start gap-3">
      <Badge :variant="categoryVariant">{{ category }}</Badge>
      
      <h2 class="text-lg sm:text-xl font-bold text-gray-900 mt-1">{{ title }}</h2>
      
      <div class="flex items-center gap-1.5 text-[13px] sm:text-[15px] text-gray-500 mb-1">
        <TagIcon class="w-[18px] h-[18px] text-gray-400" /> 
        <span>ค่าบริการประมาณ {{ typeof price === 'number' ? price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price }} ฿</span>
      </div>
      
      <span :class="ctaSpanClass">{{ ctaText }}</span>
    </div>
  </div>
</template>
