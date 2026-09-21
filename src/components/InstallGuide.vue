<template>
  <IosSheet
    :open="guide.isOpen"
    labelledby="install-guide-title"
    :close-label="form.t('install.close')"
    @close="guide.snooze()"
  >
    <div class="px-5 pb-5 pt-2">
      <div class="flex items-center gap-3 pr-10">
        <img :src="iconSrc" alt="" class="size-14 shrink-0 rounded-[14px] shadow-sm">
        <div class="min-w-0">
          <h2 id="install-guide-title" class="text-ios-title3 font-semibold text-ios-label">{{ form.t('install.title') }}</h2>
          <p class="mt-0.5 text-ios-subhead text-ios-label-2">{{ form.t('install.subtitle') }}</p>
        </div>
      </div>

      <div v-if="guide.canInstallDirectly" class="mt-6 flex justify-center">
        <InstallAnimation platform="android" :step="3" :icon-src="iconSrc" />
      </div>

      <div v-else class="mt-6 flex items-center gap-3">
        <InstallAnimation :platform="guidePlatform" :step="step" :icon-src="iconSrc" class="shrink-0" />
        <ol class="min-w-0 flex-1 space-y-1">
          <li v-for="(item, index) in steps" :key="item.key">
            <button
              type="button"
              class="flex w-full items-start gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-300"
              :class="index === step ? 'bg-ios-card' : ''"
              :aria-current="index === step ? 'step' : undefined"
              @click="goTo(index)"
            >
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-full text-ios-footnote font-semibold transition-colors duration-300"
                :class="index === step ? 'bg-ios-tint text-white' : 'bg-ios-fill text-ios-label-2'"
              >
                {{ index + 1 }}
              </span>
              <span class="min-w-0">
                <span class="block text-ios-subhead" :class="index === step ? 'font-semibold text-ios-label' : 'text-ios-label-2'">
                  {{ form.t(item.key) }}
                </span>
                <span v-if="item.hint" class="mt-0.5 block text-ios-caption text-ios-label-2">{{ form.t(item.hint) }}</span>
              </span>
            </button>
          </li>
        </ol>
      </div>

      <div class="mt-6 flex flex-col gap-2">
        <IosButton v-if="guide.canInstallDirectly" @click="guide.promptInstall()">
          <template #icon><Download /></template>
          {{ form.t('install.installBtn') }}
        </IosButton>
        <IosButton v-else @click="guide.markDone()">{{ form.t('install.doneBtn') }}</IosButton>
        <IosButton variant="plain" @click="guide.snooze()">{{ form.t('install.notNow') }}</IosButton>
      </div>
    </div>
  </IosSheet>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { Download } from 'lucide-vue-next';
import IosSheet from './ios/IosSheet.vue';
import IosButton from './ios/IosButton.vue';
import InstallAnimation from './InstallAnimation.vue';
import { useInstallGuide } from '../composables/useInstallGuide';

const form = inject('zoomForm');
const guide = useInstallGuide();
const iconSrc = './pwa-192x192.png';

const guidePlatform = computed(() => (guide.platform === 'android' ? 'android' : 'ios'));
const steps = computed(() => (guidePlatform.value === 'android'
  ? [
      { key: 'install.androidStep1' },
      { key: 'install.androidStep2' },
      { key: 'install.androidStep3' },
      { key: 'install.finalStep' }
    ]
  : [
      { key: 'install.iosStep1', hint: 'install.iosStep1Hint' },
      { key: 'install.iosStep2' },
      { key: 'install.iosStep3' },
      { key: 'install.finalStep' }
    ]));

// The animation and the highlighted step advance together; tapping a step jumps there.
const step = ref(0);
const stepMs = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 4000 : 2400;
let timer = null;

function stopCycle() {
  clearInterval(timer);
  timer = null;
}

function startCycle() {
  stopCycle();
  timer = setInterval(() => {
    step.value = (step.value + 1) % steps.value.length;
  }, stepMs);
}

function goTo(index) {
  step.value = index;
  startCycle();
}

watch(() => guide.isOpen, (isOpen) => {
  if (isOpen) {
    step.value = 0;
    startCycle();
  } else {
    stopCycle();
  }
}, { immediate: true });

onBeforeUnmount(stopCycle);
</script>
