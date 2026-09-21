<template>
  <Teleport to="body">
    <Transition name="ios-sheet" :duration="{ enter: 420, leave: 300 }">
      <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="ios-sheet-backdrop absolute inset-0 bg-black/40" @click="emit('close')"></div>
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelledby"
          tabindex="-1"
          class="ios-sheet-panel relative max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[20px] bg-ios-bg pb-[env(safe-area-inset-bottom)] outline-none"
        >
          <div class="flex justify-center pt-2 pb-1" aria-hidden="true">
            <span class="h-[5px] w-9 rounded-full bg-ios-label-3"></span>
          </div>
          <button
            v-if="closeLabel"
            type="button"
            class="absolute right-2 top-2 flex size-11 items-center justify-center"
            :aria-label="closeLabel"
            @click="emit('close')"
          >
            <span class="flex size-[30px] items-center justify-center rounded-full bg-ios-fill text-ios-label-2">
              <X class="size-4" :stroke-width="2.5" />
            </span>
          </button>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  open: { type: Boolean, default: false },
  labelledby: { type: String, default: undefined },
  closeLabel: { type: String, default: '' }
});

const emit = defineEmits(['close']);

const panel = ref(null);
let previouslyFocused = null;

function onKeydown(event) {
  if (event.key === 'Escape') emit('close');
}

function lock() {
  previouslyFocused = document.activeElement;
  document.documentElement.style.overflow = 'hidden';
  document.addEventListener('keydown', onKeydown);
  nextTick(() => panel.value?.focus());
}

function unlock() {
  document.documentElement.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
  previouslyFocused?.focus?.();
  previouslyFocused = null;
}

watch(() => props.open, (isOpen) => (isOpen ? lock() : unlock()));

onBeforeUnmount(() => {
  if (props.open) unlock();
});
</script>

<style>
.ios-sheet-enter-active .ios-sheet-backdrop,
.ios-sheet-leave-active .ios-sheet-backdrop {
  transition: opacity 300ms ease;
}

.ios-sheet-enter-active .ios-sheet-panel {
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
}

.ios-sheet-leave-active .ios-sheet-panel {
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

.ios-sheet-enter-from .ios-sheet-backdrop,
.ios-sheet-leave-to .ios-sheet-backdrop {
  opacity: 0;
}

.ios-sheet-enter-from .ios-sheet-panel,
.ios-sheet-leave-to .ios-sheet-panel {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .ios-sheet-enter-active .ios-sheet-panel,
  .ios-sheet-leave-active .ios-sheet-panel {
    transition: opacity 150ms linear;
  }

  .ios-sheet-enter-from .ios-sheet-panel,
  .ios-sheet-leave-to .ios-sheet-panel {
    transform: none;
    opacity: 0;
  }
}
</style>
