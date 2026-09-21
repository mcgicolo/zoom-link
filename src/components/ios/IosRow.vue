<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="as === 'button' && disabled ? true : undefined"
    :href="as === 'a' ? href : undefined"
    :target="as === 'a' ? target : undefined"
    :rel="as === 'a' ? rel : undefined"
    class="ios-row relative flex w-full min-h-11 items-center gap-3 bg-ios-card px-4 py-[11px] text-left text-ios-body text-ios-label"
    :class="[interactive ? 'active:bg-ios-pressed' : '', disabled ? 'pointer-events-none opacity-40' : '']"
    :style="$slots.leading ? { '--sep-inset': '57px' } : undefined"
  >
    <span v-if="$slots.leading" class="shrink-0">
      <slot name="leading"></slot>
    </span>

    <span class="min-w-0 flex-1">
      <slot>
        <span class="block text-ios-body text-ios-label">{{ title }}</span>
        <span v-if="subtitle" class="block text-ios-subhead text-ios-label-2">{{ subtitle }}</span>
      </slot>
    </span>

    <template v-if="$slots.trailing">
      <span class="shrink-0">
        <slot name="trailing"></slot>
      </span>
    </template>
    <template v-else>
      <span v-if="detail" class="shrink-0 whitespace-nowrap text-ios-body text-ios-label-2">{{ detail }}</span>
      <Check v-if="accessory === 'checkmark' && checked" class="size-5 shrink-0 text-ios-tint" stroke-width="2.5" />
      <ChevronRight v-if="accessory === 'chevron'" class="size-5 shrink-0 text-ios-label-3" />
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { Check, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  as: { type: String, default: 'div' },
  href: { type: String, default: undefined },
  target: { type: String, default: undefined },
  rel: { type: String, default: undefined },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  detail: { type: String, default: '' },
  accessory: { type: String, default: 'none' },
  checked: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const interactive = computed(() => props.as === 'button' || props.as === 'a' || props.as === 'label');
</script>
