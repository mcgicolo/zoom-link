<template>
  <div
    class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="flex flex-col items-center gap-2 rounded-2xl bg-ios-bar backdrop-blur-xl px-5 py-4"
      >
        <Check class="size-8 text-ios-tint" />
        <p class="text-ios-subhead font-semibold">{{ text }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
});
</script>
