<template>
  <div class="flex w-full items-center gap-2">
    <input
      :id="inputId"
      ref="inputRef"
      :type="type"
      class="w-full bg-transparent text-ios-body text-ios-label placeholder:text-ios-label-3 outline-none"
      autocorrect="off"
      spellcheck="false"
      :placeholder="placeholder"
      :value="modelValue"
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :enterkeyhint="enterkeyhint"
      :maxlength="maxlength"
      :aria-invalid="invalid"
      :aria-describedby="describedby"
      :aria-label="label"
      @input="emit('update:modelValue', $event.target.value)"
      @keydown.enter="onEnter"
    />
    <button v-if="modelValue" type="button" class="shrink-0" :aria-label="clearLabel" @click="clear">
      <CircleX class="size-4 text-ios-label-3" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CircleX } from 'lucide-vue-next';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: undefined },
  autocapitalize: { type: String, default: undefined },
  enterkeyhint: { type: String, default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  invalid: { type: Boolean, default: false },
  inputId: { type: String, default: undefined },
  describedby: { type: String, default: undefined },
  label: { type: String, default: undefined },
  clearLabel: { type: String, default: 'Clear' },
});

const emit = defineEmits(['update:modelValue', 'enter']);

const inputRef = ref(null);

function clear() {
  emit('update:modelValue', '');
  inputRef.value?.focus();
}

function onEnter(event) {
  event.preventDefault();
  emit('enter');
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({ focus });
</script>
