<template>
  <span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center text-white" :class="[colorClass, sizeClass]">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: { type: String, default: 'gray' },
  size: { type: String, default: 'sm' },
});

const colorMap = {
  blue: 'bg-ios-blue',
  green: 'bg-ios-green',
  indigo: 'bg-ios-tint',
  orange: 'bg-ios-orange',
  red: 'bg-ios-red',
  teal: 'bg-ios-teal',
  purple: 'bg-ios-purple',
  yellow: 'bg-ios-yellow',
  pink: 'bg-ios-pink',
  gray: 'bg-ios-gray',
};

const colorClass = computed(() => colorMap[props.color] || colorMap.gray);
const sizeClass = computed(() =>
  props.size === 'lg' ? 'size-16 rounded-[16px] [&>svg]:size-[36px]' : 'size-[29px] rounded-[7px] [&>svg]:size-[18px]'
);
</script>
