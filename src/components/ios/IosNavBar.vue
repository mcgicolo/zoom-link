<template>
  <div
    class="sticky top-0 z-40 transition-colors duration-200"
    :class="
      scrolled
        ? [
            'bg-ios-bar backdrop-blur-xl backdrop-saturate-150',
            'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-bottom after:scale-y-50 after:bg-ios-separator after:content-[\'\']'
          ]
        : 'bg-transparent'
    "
    :style="{ paddingTop: 'env(safe-area-inset-top)' }"
  >
    <div class="relative flex h-11 items-center px-1">
      <div class="flex min-h-11 items-center">
        <button
          v-if="showBack"
          type="button"
          class="flex min-h-11 min-w-11 items-center gap-0.5 pl-2 pr-3 text-ios-tint active:opacity-50"
          :aria-label="backLabel"
          @click="emit('back')"
        >
          <ChevronLeft class="size-6" :stroke-width="2.5" />
          <span class="text-ios-body">{{ backLabel }}</span>
        </button>
      </div>

      <span
        class="pointer-events-none absolute left-1/2 max-w-[calc(100%-176px)] -translate-x-1/2 truncate text-center text-ios-headline font-semibold text-ios-label transition-opacity duration-200"
        :class="titleVisible ? 'opacity-100' : 'opacity-0'"
      >
        {{ title }}
      </span>

      <div class="ms-auto flex min-h-11 items-center pr-3">
        <slot name="trailing"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  },
  backLabel: {
    type: String,
    default: 'Back'
  }
});

const emit = defineEmits(['back']);

const scrolled = ref(false);
const titleVisible = ref(false);

let ticking = false;

function readScroll() {
  const y = window.scrollY;
  scrolled.value = y > 0;
  titleVisible.value = y > 40;
  ticking = false;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(readScroll);
}

onMounted(() => {
  readScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>
