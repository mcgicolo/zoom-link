<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary'
  }
});

defineEmits(['click']);

const primaryClasses = 'inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-indigo-600 px-6 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-60 sm:text-base';
const secondaryClasses = 'inline-flex min-h-11 w-full items-center justify-center rounded-[10px] border-2 border-indigo-600 bg-transparent px-4 py-3 text-[15px] font-semibold text-indigo-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base';

const buttonClasses = computed(() => (props.variant === 'secondary' ? secondaryClasses : primaryClasses));
</script>
