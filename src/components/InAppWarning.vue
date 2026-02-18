<template>
  <div class="flex h-full flex-1 flex-col overflow-hidden">
    <div class="min-h-0 flex-1 overflow-y-auto pb-3 text-center">
      <h1 class="mb-8 mt-4 text-[22px] font-bold leading-[1.3] text-slate-800">
        {{ header }}
      </h1>

      <p class="mb-3 text-left text-[15px] text-slate-800">{{ step1 }}</p>
      <AppButton class="mx-auto mb-7 max-w-[200px]" @click="$emit('copy')">
        {{ copyLabel }}
      </AppButton>

      <p class="mb-3 text-left text-[15px] text-slate-800">{{ step2 }}</p>
      <p class="mb-4 text-left text-[13px] leading-[1.4] text-slate-500">{{ hint }}</p>

      <div class="flex flex-wrap justify-center gap-6">
        <div class="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
          <img src="/icons/chrome.svg" alt="Chrome" class="h-7 w-7 rounded-md">
          <span>{{ chromeLabel }}</span>
        </div>
        <div class="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
          <img src="/icons/safari.svg" alt="Safari" class="h-7 w-7 rounded-md">
          <span>{{ safariLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from './AppButton.vue';

defineProps({
  header: {
    type: String,
    required: true
  },
  step1: {
    type: String,
    required: true
  },
  copyLabel: {
    type: String,
    required: true
  },
  step2: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  chromeLabel: {
    type: String,
    required: true
  },
  safariLabel: {
    type: String,
    required: true
  }
});

defineEmits(['copy']);
</script>
