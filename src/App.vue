<template>
  <div class="mx-auto min-h-dvh w-full max-w-[520px] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
    <IosNavBar
      :title="navTitle"
      :show-back="form.canGoBack && !form.isInAppWarning"
      :back-label="form.t('common.back')"
      @back="goBack"
    >
      <template #trailing>
        <div class="relative flex min-h-11 min-w-11 items-center justify-center gap-1 text-ios-tint">
          <Globe class="size-5" aria-hidden="true" />
          <span class="text-ios-subhead font-semibold">{{ form.currentLocale.toUpperCase() }}</span>
          <select
            v-model="form.currentLocale"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            :aria-label="form.t('common.language')"
          >
            <option value="ph">Tagalog</option>
            <option value="en">English</option>
          </select>
        </div>
      </template>
    </IosNavBar>

    <main class="grid overflow-x-clip">
      <Transition :name="form.direction === 'back' ? 'ios-pop' : 'ios-push'">
        <component :is="currentScreen" :key="screenKey" class="bg-ios-bg" />
      </Transition>
    </main>

    <IosHud :show="form.showCopyNotificationBanner" :text="form.t('copyNotification')" />
    <InstallGuide />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, provide, reactive, watch } from 'vue';
import { Globe } from 'lucide-vue-next';
import IosHud from './components/ios/IosHud.vue';
import IosNavBar from './components/ios/IosNavBar.vue';
import InstallGuide from './components/InstallGuide.vue';
import GatheringScreen from './screens/GatheringScreen.vue';
import GenderScreen from './screens/GenderScreen.vue';
import GuidelinesScreen from './screens/GuidelinesScreen.vue';
import InAppScreen from './screens/InAppScreen.vue';
import LocaleScreen from './screens/LocaleScreen.vue';
import NameScreen from './screens/NameScreen.vue';
import NoticeScreen from './screens/NoticeScreen.vue';
import ResultScreen from './screens/ResultScreen.vue';
import { useZoomForm } from './composables/useZoomForm';
import { useInstallGuide } from './composables/useInstallGuide';

const form = reactive(useZoomForm());
provide('zoomForm', form);

const installGuide = useInstallGuide();
let installGuideTimer = null;

const stepScreens = {
  1: NoticeScreen,
  2: GenderScreen,
  3: NameScreen,
  4: LocaleScreen,
  5: GatheringScreen,
  6: GuidelinesScreen,
  7: ResultScreen
};

const stepTitleKeys = {
  1: 'notice.title',
  2: 'step1.title',
  3: 'step2.title',
  4: 'step3.title',
  5: 'gathering.title',
  6: 'step4.title',
  7: 'step5.title'
};

const currentScreen = computed(() => (form.isInAppWarning ? InAppScreen : stepScreens[form.currentStep]));
const screenKey = computed(() => (form.isInAppWarning ? 'inApp' : form.currentStep));
const navTitle = computed(() => form.t(form.isInAppWarning ? 'inApp.title' : stepTitleKeys[form.currentStep]));

// The Back button only asks the browser to go back; the popstate handler below is the
// single place that actually mutates step/direction, so the history stack and the UI
// can never drift apart from each other.
function goBack() {
  history.back();
}

function handlePopState(event) {
  const targetStep = event.state?.step;
  if (typeof targetStep === 'number' && targetStep < form.currentStep) {
    form.direction = 'back';
    form.currentStep = targetStep;
  } else {
    history.replaceState({ step: form.currentStep }, '');
  }
}

// The installed app can sit in the background for days and resume where it left off, still
// showing the gatherings (or a link tagged with one) from the day it was opened. Start over on a new day.
const openedOn = new Date().toDateString();

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && new Date().toDateString() !== openedOn) {
    window.location.reload();
  }
}

watch(() => form.currentStep, (value, oldValue) => {
  window.scrollTo(0, 0);
  if (value > oldValue) {
    history.pushState({ step: value }, '');
  }
});

onMounted(() => {
  history.replaceState({ step: 1 }, '');
  window.addEventListener('popstate', handlePopState);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Offer the Home Screen guide shortly after the app opens, unless it's already installed,
  // snoozed, or we're inside an in-app browser (which can't add to the Home Screen).
  installGuideTimer = setTimeout(() => {
    if (installGuide.shouldAutoOpen && !form.isInAppWarning) installGuide.open();
  }, 1500);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handlePopState);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  clearTimeout(installGuideTimer);
});
</script>

<style>
main.grid > * {
  grid-area: 1 / 1;
}

.ios-push-enter-active,
.ios-push-leave-active,
.ios-pop-enter-active,
.ios-pop-leave-active {
  transition: transform 350ms cubic-bezier(0.32, 0.72, 0, 1), opacity 350ms, filter 350ms;
}

/* push (forward): the new screen slides in from the right, on top of the old one */
.ios-push-enter-active {
  z-index: 1;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.2);
}
.ios-push-enter-from {
  transform: translateX(100%);
}
.ios-push-enter-to {
  transform: translateX(0);
}

.ios-push-leave-active {
  z-index: 0;
}
.ios-push-leave-from {
  transform: translateX(0);
  opacity: 1;
  filter: brightness(1);
}
.ios-push-leave-to {
  transform: translateX(-30%);
  opacity: 0.75;
  filter: brightness(0.85);
}

/* pop (back): the reverse — the old (current) screen slides out to the right, on top */
.ios-pop-leave-active {
  z-index: 1;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.2);
}
.ios-pop-leave-from {
  transform: translateX(0);
}
.ios-pop-leave-to {
  transform: translateX(100%);
}

.ios-pop-enter-active {
  z-index: 0;
}
.ios-pop-enter-from {
  transform: translateX(-30%);
  opacity: 0.75;
  filter: brightness(0.85);
}
.ios-pop-enter-to {
  transform: translateX(0);
  opacity: 1;
  filter: brightness(1);
}

@media (prefers-reduced-motion: reduce) {
  .ios-push-enter-active,
  .ios-push-leave-active,
  .ios-pop-enter-active,
  .ios-pop-leave-active {
    transition: opacity 150ms linear;
    transform: none;
    filter: none;
    box-shadow: none;
    z-index: 0;
  }
  .ios-push-enter-from,
  .ios-pop-enter-from {
    opacity: 0;
    transform: none;
    filter: none;
  }
  .ios-push-enter-to,
  .ios-pop-enter-to,
  .ios-push-leave-from,
  .ios-pop-leave-from {
    opacity: 1;
    transform: none;
    filter: none;
  }
  .ios-push-leave-to,
  .ios-pop-leave-to {
    opacity: 0;
    transform: none;
    filter: none;
  }
}
</style>
