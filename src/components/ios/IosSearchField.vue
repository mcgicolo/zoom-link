<template>
  <div class="flex h-9 items-center gap-2 rounded-full bg-ios-fill px-3">
    <Search class="size-4 shrink-0 text-ios-label-2" />
    <input
      ref="inputRef"
      type="search"
      class="min-w-0 flex-1 bg-transparent text-ios-body text-ios-label placeholder:text-ios-label-3 outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      enterkeyhint="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" type="button" class="shrink-0" :aria-label="clearLabel" @click="clear">
      <CircleX class="size-4 text-ios-label-3" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Search, CircleX } from 'lucide-vue-next';

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  clearLabel: { type: String, default: 'Clear' },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);

function clear() {
  emit('update:modelValue', '');
  inputRef.value?.focus();
}
</script>
