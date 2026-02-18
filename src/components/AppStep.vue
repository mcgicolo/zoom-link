<template>
  <div class="flex h-full flex-1 flex-col overflow-hidden">
    <div class="min-h-0 flex-1 overflow-y-auto pb-3">
      <div class="mb-1.5 text-[11px] font-medium tracking-[0.5px] text-slate-500 sm:mb-2.5 sm:text-xs">
        {{ indicator }}
      </div>
      <h1 class="mb-1 text-xl font-bold leading-tight text-slate-800 sm:mb-2 sm:text-[28px]">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mb-5 text-[13px] leading-[1.3] text-slate-500 sm:mb-8 sm:text-[15px]">
        {{ subtitle }}
      </p>

      <slot></slot>
    </div>

    <div v-if="$slots.actions" class="flex-none border-t border-slate-100 bg-white pt-3 sm:pt-5">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  indicator: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>
