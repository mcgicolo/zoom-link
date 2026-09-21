<template>
  <div class="flex min-h-[calc(100dvh-44px-env(safe-area-inset-top))] flex-col">
    <header
      class="flex flex-col px-4 pt-2 pb-6"
      :class="align === 'center' ? 'items-center text-center' : 'items-start text-left'"
    >
      <div v-if="$slots.hero" class="mb-4">
        <slot name="hero"></slot>
      </div>
      <p
        v-if="eyebrow"
        class="text-ios-footnote font-semibold uppercase tracking-wide text-ios-label-2"
      >
        {{ eyebrow }}
      </p>
      <h1 class="text-ios-large font-bold text-ios-label">{{ title }}</h1>
      <p v-if="subtitle" class="mt-2 text-ios-body text-ios-label-2">{{ subtitle }}</p>
    </header>

    <slot></slot>

    <div
      v-if="$slots.actions"
      class="sticky bottom-0 mt-auto flex flex-col gap-3 bg-ios-bar px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:origin-top after:scale-y-50 after:bg-ios-separator after:content-['']"
    >
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  align: {
    type: String,
    default: 'left'
  }
});
</script>
