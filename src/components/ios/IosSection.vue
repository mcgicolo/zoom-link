<template>
  <div class="mx-4 mb-8">
    <div v-if="header" class="px-4 pb-1.5 text-ios-footnote uppercase text-ios-label-2">{{ header }}</div>
    <div class="overflow-hidden rounded-ios bg-ios-card">
      <slot></slot>
    </div>
    <div
      v-if="footer || $slots.footer"
      class="px-4 pt-1.5 text-ios-footnote"
      :class="footerTone === 'error' ? 'text-ios-red' : 'text-ios-label-2'"
    >
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  header: { type: String, default: '' },
  footer: { type: String, default: '' },
  footerTone: { type: String, default: 'default' },
});
</script>
