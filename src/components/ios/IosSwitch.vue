<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    class="relative inline-block h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40"
    :class="modelValue ? 'bg-ios-green' : 'bg-ios-fill'"
    @click.stop="toggle"
  >
    <span
      class="pointer-events-none absolute left-[2px] top-[2px] size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] transition-transform duration-200"
      :class="modelValue ? 'translate-x-[20px]' : 'translate-x-0'"
    ></span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

function toggle() {
  if (props.disabled) return;
  emit('update:modelValue', !props.modelValue);
}
</script>
