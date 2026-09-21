<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="as === 'button' && disabled ? true : undefined"
    :href="as === 'a' && !disabled ? href : undefined"
    :target="as === 'a' ? target : undefined"
    :rel="as === 'a' ? rel : undefined"
    :aria-disabled="as === 'a' && disabled ? 'true' : undefined"
    class="inline-flex w-full min-h-[50px] items-center justify-center gap-2 rounded-full px-5 text-ios-headline font-semibold transition-opacity"
    :class="variantClasses"
    @click="onClick"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'filled' },
  as: { type: String, default: 'button' },
  href: { type: String, default: undefined },
  target: { type: String, default: undefined },
  rel: { type: String, default: undefined },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

// Each branch is a complete, static class string (never concatenated at
// runtime) so Tailwind's content scanner can see every class literally,
// and so the disabled state never leaves `active:opacity-70` in the mix
// (it has higher specificity than a plain `opacity-*` class and would
// otherwise win during a press).
const variantClasses = computed(() => {
  if (props.disabled) {
    return props.variant === 'filled' ? 'bg-ios-fill text-ios-label-3' : 'opacity-40';
  }
  switch (props.variant) {
    case 'tinted':
      return 'active:opacity-70 bg-ios-tint-soft text-ios-tint';
    case 'gray':
      return 'active:opacity-70 bg-ios-fill text-ios-label';
    case 'plain':
      return 'active:opacity-70 text-ios-tint';
    default:
      return 'active:opacity-70 bg-ios-tint text-white';
  }
});

function onClick(event) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>
