import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue';
import enLocale from '../../locales/en.json';
import phLocale from '../../locales/ph.json';

const LOCALE_STORAGE_KEY = 'mcgiZoomLocale';
const FORM_STORAGE_KEY = 'mcgiZoomFormData';
const TOTAL_STEPS = 5;

const LOCALE_DATA = { en: enLocale, ph: phLocale };

export const guidelineKeys = [
  'step4.guideline1',
  'step4.guideline2',
  'step4.guideline3',
  'step4.guideline4',
  'step4.guideline5',
  'step4.guideline6',
  'step4.guideline7'
];

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

function capitalizeName(name) {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/).filter((word) => word.length > 0);
  return words
    .map((word) => {
      if (word.includes('.')) {
        return word
          .split('.')
          .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : ''))
          .join('.');
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function validateFullName(name) {
  const words = name.trim().split(/\s+/).filter((word) => word.length > 0);
  if (words.length < 2) return false;
  return words.every((word) => word.length >= 3);
}

export function useZoomForm() {
  const appConfig = inject('appConfig', { zoom: {}, contact: {}, localeList: [] });
  const zoomConfig = appConfig.zoom ?? {};
  const contact = appConfig.contact ?? {};
  const localeOptions = appConfig.localeList ?? [];

  const currentStep = ref(1);
  const currentLocale = ref(localStorage.getItem(LOCALE_STORAGE_KEY) || 'ph');
  const isInAppWarning = ref(false);
  const agreementChecked = ref(false);
  const showFullNameError = ref(false);
  const showLocaleError = ref(false);
  const showCopyNotificationBanner = ref(false);
  const generatedZoomLink = ref('');
  const generatedDisplayName = ref('');
  const fullNameInput = ref(null);
  const localeSelectInput = ref(null);

  const formData = reactive({ gender: '', fullName: '', localeName: '' });
  const translation = computed(() => LOCALE_DATA[currentLocale.value] || LOCALE_DATA.en);
  const isFullNameValid = computed(() => validateFullName(formData.fullName));
  const progress = computed(() => Math.min(100, (currentStep.value / TOTAL_STEPS) * 100));
  const noticeMessage = computed(() => {
    const msg = getNested(translation.value, 'notice.message') || '';
    return msg.replace(/\{name\}/g, contact?.name ?? '').replace(/\{phone\}/g, contact?.phone ?? '');
  });
  const previewName = computed(() => {
    const title = formData.gender === 'Sister' ? 'Sis.' : 'Bro.';
    return `${formData.localeName} ${title} ${capitalizeName(formData.fullName)}`.trim();
  });

  function t(path) {
    const value = getNested(translation.value, path);
    return value != null ? value : path;
  }

  function selectGender(gender) {
    formData.gender = gender;
  }

  async function nextStep() {
    if (currentStep.value === 3 && !isFullNameValid.value) {
      showFullNameError.value = true;
      return;
    }
    if (currentStep.value === 4 && !formData.localeName) {
      showLocaleError.value = true;
      return;
    }

    if (currentStep.value < 5) {
      currentStep.value += 1;
      await nextTick();
      if (currentStep.value === 3 && fullNameInput.value) fullNameInput.value.focus();
      if (currentStep.value === 4 && localeSelectInput.value) localeSelectInput.value.focus();
    }
  }

  function onFullNameEnter() {
    if (isFullNameValid.value && currentStep.value === 3) nextStep();
  }

  function handleAgreementClick(event) {
    const target = event.target;
    if (target instanceof HTMLElement && (target.closest('input') || target.closest('label'))) return;
    agreementChecked.value = !agreementChecked.value;
  }

  function generateLink() {
    const title = formData.gender === 'Sister' ? 'Sis.' : 'Bro.';
    const displayName = `[${formData.localeName}] ${title} ${capitalizeName(formData.fullName)}`;
    generatedDisplayName.value = displayName;
    generatedZoomLink.value = `https://us06web.zoom.us/j/${zoomConfig.meetingId}?uname=${encodeURIComponent(displayName)}&videooff=false&autoJoin=true&join=true `;
    currentStep.value = 6;
  }

  function showCopyNotification() {
    showCopyNotificationBanner.value = true;
    window.setTimeout(() => {
      showCopyNotificationBanner.value = false;
    }, 3000);
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      showCopyNotification();
    } catch (_err) {
      window.alert(t('common.copyError'));
    }

    document.body.removeChild(textArea);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopyNotification).catch(() => fallbackCopyToClipboard(text));
      return;
    }
    fallbackCopyToClipboard(text);
  }

  function copyLink() {
    copyText(generatedZoomLink.value);
  }

  function copyPageUrl() {
    copyText(window.location.href);
  }

  function checkInAppBrowser() {
    const params = new URLSearchParams(window.location.search);
    const forceInApp = params.get('inApp')?.toLowerCase() === 'true';
    const ua = navigator.userAgent || '';
    const isInAppBrowser = /FBAN|FBAV|Messenger|Instagram|Line\//i.test(ua)
      || /Twitter|Snapchat|TikTok|LinkedInApp/i.test(ua);
    isInAppWarning.value = Boolean(forceInApp || isInAppBrowser);
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      formData.gender = parsed.gender || '';
      formData.fullName = parsed.fullName || '';
      formData.localeName = parsed.localeName || '';
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }

  function applyDocumentLocale() {
    const resolved = LOCALE_DATA[currentLocale.value] ? currentLocale.value : 'en';
    document.title = getNested(LOCALE_DATA[resolved], 'common.pageTitle') || 'MCGI Zoom Meeting';
    document.documentElement.lang = resolved === 'ph' ? 'tl' : 'en';
  }

  watch(currentLocale, (value) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, LOCALE_DATA[value] ? value : 'en');
    applyDocumentLocale();
  });

  watch(formData, (value) => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
  }, { deep: true });

  onMounted(() => {
    if (!LOCALE_DATA[currentLocale.value]) currentLocale.value = 'en';
    loadFromLocalStorage();
    checkInAppBrowser();
    applyDocumentLocale();
  });

  return {
    agreementChecked,
    copyLink,
    copyPageUrl,
    currentLocale,
    currentStep,
    formData,
    fullNameInput,
    generateLink,
    generatedDisplayName,
    generatedZoomLink,
    handleAgreementClick,
    isFullNameValid,
    noticeMessage,
    isInAppWarning,
    localeOptions,
    localeSelectInput,
    nextStep,
    onFullNameEnter,
    previewName,
    progress,
    selectGender,
    showCopyNotificationBanner,
    showFullNameError,
    showLocaleError,
    t
  };
}
