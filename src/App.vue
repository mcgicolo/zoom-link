<template>
  <div class="flex w-full justify-center px-3 py-3 sm:px-5 sm:py-5">
    <div class="relative flex h-full max-h-[calc(100vh-24px)] max-h-[calc(100dvh-24px)] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:h-auto sm:max-h-[90vh] sm:px-8 sm:pt-10">
      <div v-if="!isInAppWarning" class="absolute left-0 top-0 h-1 bg-indigo-600 transition-all duration-300" :style="{ width: `${progress}%` }"></div>

      <div class="absolute right-4 top-4 z-10 flex items-center gap-2 whitespace-nowrap">
        <label for="langSelect" class="mb-0 inline-block text-[13px] font-semibold text-slate-500">{{ t('common.language') }}</label>
        <select
          id="langSelect"
          v-model="currentLocale"
          class="rounded-lg border-2 border-slate-200 bg-white px-2.5 py-1.5 text-[13px] font-semibold text-slate-700 outline-none transition-colors hover:border-indigo-600 focus:border-indigo-600"
        >
          <option value="ph">PH</option>
          <option value="en">EN</option>
        </select>
      </div>

      <InAppWarning
        v-if="isInAppWarning"
        :header="t('inApp.header')"
        :step1="t('inApp.step1')"
        :copy-label="t('inApp.copyBtn')"
        :step2="t('inApp.step2')"
        :hint="t('inApp.hint')"
        :chrome-label="t('inApp.chrome')"
        :safari-label="t('inApp.safari')"
        @copy="copyPageUrl"
      />

      <template v-else>
        <AppStep v-if="currentStep === 1" :indicator="t('notice.indicator')" :title="t('notice.title')" subtitle="">
          <div class="rounded-[10px] bg-slate-50 p-4 sm:p-5 text-[13px] leading-[1.5] text-slate-800 sm:text-sm">
            {{ noticeMessage }}
          </div>
          <template #actions><AppButton @click="nextStep">{{ t('step1.continue') }}</AppButton></template>
        </AppStep>

        <AppStep v-else-if="currentStep === 2" :indicator="t('step1.indicator')" :title="t('step1.title')" :subtitle="t('step1.subtitle')">
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              class="rounded-[10px] border-2 bg-white px-3 py-4 text-[15px] font-semibold transition-all duration-300 sm:px-4 sm:py-[18px] sm:text-base"
              :class="formData.gender === 'Brother' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-800 hover:border-indigo-600 hover:bg-indigo-50/20'"
              @click="selectGender('Brother')"
            >
              {{ t('step1.brother') }}
            </button>
            <button
              type="button"
              class="rounded-[10px] border-2 bg-white px-3 py-4 text-[15px] font-semibold transition-all duration-300 sm:px-4 sm:py-[18px] sm:text-base"
              :class="formData.gender === 'Sister' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-800 hover:border-indigo-600 hover:bg-indigo-50/20'"
              @click="selectGender('Sister')"
            >
              {{ t('step1.sister') }}
            </button>
          </div>
          <template #actions><AppButton :disabled="!formData.gender" @click="nextStep">{{ t('step1.continue') }}</AppButton></template>
        </AppStep>

        <AppStep v-else-if="currentStep === 3" :indicator="t('step2.indicator')" :title="t('step2.title')" :subtitle="t('step2.subtitle')">
          <div class="mb-3 sm:mb-5">
            <input
              ref="fullNameInput"
              v-model="formData.fullName"
              type="text"
              :placeholder="t('step2.placeholder')"
              class="w-full rounded-[10px] border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition-all duration-300 focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] sm:px-[18px] sm:py-3.5 sm:text-[17px]"
              @input="showFullNameError = false"
              @keypress.enter="onFullNameEnter"
            >
            <div v-if="showFullNameError" class="mt-1.5 text-xs text-rose-500">{{ t('step2.error') }}</div>
          </div>
          <template #actions><AppButton :disabled="!isFullNameValid" @click="nextStep">{{ t('step2.continue') }}</AppButton></template>
        </AppStep>

        <AppStep v-else-if="currentStep === 4" :indicator="t('step3.indicator')" :title="t('step3.title')" :subtitle="t('step3.subtitle')">
          <div class="mb-3 sm:mb-5">
            <select
              ref="localeSelectInput"
              v-model="formData.localeName"
              class="w-full cursor-pointer rounded-[10px] border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition-all duration-300 focus:border-indigo-600 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)] sm:px-[18px] sm:py-3.5 sm:text-[17px]"
              @change="showLocaleError = false"
            >
              <option value="">{{ t('step3.placeholder') }}</option>
              <option v-for="localeName in localeOptions" :key="localeName" :value="localeName">{{ localeName }}</option>
            </select>
            <div v-if="showLocaleError" class="mt-1.5 text-xs text-rose-500">{{ t('step3.error') }}</div>
          </div>
          <div v-if="formData.localeName" class="mt-3 rounded-md border-l-[3px] border-indigo-600 bg-indigo-50 px-3 py-3 text-xs text-slate-800 sm:mt-4 sm:px-3.5 sm:py-3.5 sm:text-[13px]">
            <span>{{ t('step3.namePreviewPrefix') }}</span>
            <strong class="ml-1 font-semibold text-indigo-600">{{ previewName }}</strong>
          </div>
          <template #actions><AppButton :disabled="!formData.localeName" @click="nextStep">{{ t('step3.continue') }}</AppButton></template>
        </AppStep>

        <AppStep v-else-if="currentStep === 5" :indicator="t('step4.indicator')" :title="t('step4.title')" :subtitle="t('step4.subtitle')">
          <div class="rounded-[10px] bg-slate-50 p-4 sm:p-5">
            <h2 class="mb-2.5 text-base font-bold text-slate-800 sm:mb-3 sm:text-lg">{{ t('step4.guidelinesHeading') }}</h2>
            <ul class="space-y-2 sm:space-y-2.5">
              <li v-for="(key, index) in guidelineKeys" :key="key" class="flex items-start text-[13px] leading-[1.4] text-slate-800 sm:text-sm">
                <span class="mr-2.5 text-base font-bold leading-none text-emerald-500">✓</span>
                <span>{{ t(`step4.guideline${index + 1}`) }}</span>
              </li>
            </ul>
          </div>
          <template #actions>
            <div class="mb-3 flex cursor-pointer items-start rounded-[10px] border-2 border-slate-200 bg-white p-3.5 transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50/20 sm:p-4" @click="handleAgreementClick">
              <input id="agreementCheckbox" v-model="agreementChecked" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer">
              <label for="agreementCheckbox" class="mb-0 ml-2.5 cursor-pointer text-[13px] font-medium leading-[1.4] text-slate-800 sm:text-sm">{{ t('step4.agreementLabel') }}</label>
            </div>
            <AppButton :disabled="!agreementChecked" @click="generateLink">{{ t('step4.generateBtn') }}</AppButton>
          </template>
        </AppStep>

        <AppStep v-else-if="currentStep === 6" :indicator="t('step5.indicator')" :title="t('step5.title')" :subtitle="t('step5.subtitle')">
          <div class="mb-4 rounded-[10px] bg-slate-50 p-4 sm:p-4">
            <div class="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-slate-500">{{ t('step5.resultLabel') }}</div>
            <div class="mb-3 max-h-20 overflow-y-auto break-all rounded-lg border-2 border-slate-200 bg-white p-3 font-mono text-[11px] text-indigo-600 sm:text-xs">{{ generatedZoomLink }}</div>
            <div class="grid grid-cols-2 gap-2">
              <a :class="joinButtonClass" :href="generatedZoomLink" target="_blank" rel="noopener noreferrer">{{ t('step5.joinBtn') }}</a>
              <AppButton variant="secondary" @click="copyLink">{{ t('step5.copyBtn') }}</AppButton>
            </div>
          </div>
          <div class="rounded-md border-l-[3px] border-indigo-600 bg-indigo-50 px-3 py-3 text-xs text-slate-800 sm:px-3.5 sm:py-3.5 sm:text-[13px]">
            <strong class="font-semibold text-indigo-600">{{ t('step5.displayNameLabel') }}</strong><br>
            <span>{{ generatedDisplayName }}</span>
          </div>
        </AppStep>
      </template>
    </div>

    <div class="pointer-events-none fixed right-4 top-4 z-[1000] rounded-[10px] bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all duration-300" :class="showCopyNotificationBanner ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'">
      {{ t('copyNotification') }}
    </div>
  </div>
</template>

<script setup>
import AppButton from './components/AppButton.vue';
import AppStep from './components/AppStep.vue';
import InAppWarning from './components/InAppWarning.vue';
import { guidelineKeys, localeOptions, useZoomForm } from './composables/useZoomForm';

const joinButtonClass = 'inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-indigo-600 px-4 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_6px_16px_rgba(79,70,229,0.3)] sm:text-base';

const {
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
  isInAppWarning,
  noticeMessage,
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
} = useZoomForm();
</script>
