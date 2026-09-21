import { computed, reactive, ref } from 'vue';

const STORAGE_KEY = 'mcgiZoomInstallGuide';
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

function readState() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function writeState(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage can be unavailable (e.g. private mode); the guide then just shows again next time.
  }
}

function detectPlatform() {
  const ua = navigator.userAgent || '';
  // iPadOS reports itself as a Mac, so also check for touch support.
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

function detectStandalone() {
  return ['standalone', 'fullscreen', 'minimal-ui'].some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches)
    || window.navigator.standalone === true;
}

const platform = detectPlatform();
const isStandalone = detectStandalone();
// '' = never answered, 'done' = added to the Home Screen, digits = snoozed until that timestamp.
const state = ref(isStandalone ? 'done' : readState());
const deferredPrompt = ref(null);
const isOpen = ref(false);

if (isStandalone) writeState('done');

function markDone() {
  state.value = 'done';
  writeState('done');
  deferredPrompt.value = null;
  isOpen.value = false;
}

function snooze() {
  const until = String(Date.now() + SNOOZE_MS);
  state.value = until;
  writeState(until);
  isOpen.value = false;
}

function open() {
  isOpen.value = true;
}

// Chrome (Android and desktop) offers its own install prompt; keep it for our Install button
// instead of letting Chrome show its mini-infobar.
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt.value = event;
});

window.addEventListener('appinstalled', markDone);

async function promptInstall() {
  const prompt = deferredPrompt.value;
  if (!prompt) return;
  prompt.prompt();
  const { outcome } = await prompt.userChoice;
  deferredPrompt.value = null;
  if (outcome === 'accepted') markDone();
}

const canInstallDirectly = computed(() => Boolean(deferredPrompt.value));
// The guide only makes sense on phones/tablets, or anywhere the browser can install the app directly.
const isAvailable = computed(() => state.value !== 'done' && (platform !== 'other' || canInstallDirectly.value));
const isSnoozed = computed(() => /^\d+$/.test(state.value) && Number(state.value) > Date.now());
const shouldAutoOpen = computed(() => isAvailable.value && platform !== 'other' && !isSnoozed.value);

const guide = reactive({
  platform,
  isOpen,
  isAvailable,
  shouldAutoOpen,
  canInstallDirectly,
  open,
  snooze,
  markDone,
  promptInstall
});

export function useInstallGuide() {
  return guide;
}
