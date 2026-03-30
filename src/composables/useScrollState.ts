import { computed, onMounted, onUnmounted, ref } from "vue";

export type ScrollDirection = "up" | "down" | "idle";

const SCROLL_DIRECTION_THRESHOLD = 10;

const scrollY = ref(0);
const scrollDirection = ref<ScrollDirection>("idle");

let activeInstances = 0;
let isListening = false;
let previousScrollY = 0;
let animationFrameId: number | null = null;

function updateScrollState() {
  const nextScrollY = Math.max(window.scrollY || window.pageYOffset, 0);
  const delta = nextScrollY - previousScrollY;

  scrollY.value = nextScrollY;

  if (nextScrollY === 0) {
    scrollDirection.value = "idle";
    previousScrollY = 0;
    return;
  }

  if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD) {
    return;
  }

  scrollDirection.value = delta > 0 ? "down" : "up";
  previousScrollY = nextScrollY;
}

function onScroll() {
  if (animationFrameId !== null) {
    return;
  }

  animationFrameId = window.requestAnimationFrame(() => {
    updateScrollState();
    animationFrameId = null;
  });
}

function attachScrollListener() {
  if (isListening || typeof window === "undefined") {
    return;
  }

  previousScrollY = Math.max(window.scrollY || window.pageYOffset, 0);
  scrollY.value = previousScrollY;
  scrollDirection.value = "idle";

  window.addEventListener("scroll", onScroll, { passive: true });
  isListening = true;
}

function detachScrollListener() {
  if (!isListening || typeof window === "undefined") {
    return;
  }

  window.removeEventListener("scroll", onScroll);

  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  isListening = false;
}

export function useScrollState() {
  onMounted(() => {
    activeInstances += 1;
    attachScrollListener();
    updateScrollState();
  });

  onUnmounted(() => {
    activeInstances = Math.max(activeInstances - 1, 0);

    if (activeInstances === 0) {
      detachScrollListener();
    }
  });

  return {
    scrollY,
    scrollDirection,
    isAtTop: computed(() => scrollY.value === 0),
    isScrollingUp: computed(() => scrollDirection.value === "up"),
    isScrollingDown: computed(() => scrollDirection.value === "down"),
  };
}
