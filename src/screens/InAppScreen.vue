<template>
  <IosScreen :title="form.t('inApp.title')" :subtitle="form.t('inApp.header')">
    <template #hero>
      <IosIconBadge color="blue" size="lg">
        <Compass />
      </IosIconBadge>
    </template>

    <IosSection :footer="form.t('inApp.hint')">
      <IosRow :title="form.t('inApp.step1')">
        <template #leading>
          <span
            class="flex size-6 items-center justify-center rounded-full bg-ios-tint text-ios-footnote font-semibold text-white"
            aria-hidden="true"
          >1</span>
        </template>
      </IosRow>
      <IosRow :title="form.t('inApp.step2')">
        <template #leading>
          <span
            class="flex size-6 items-center justify-center rounded-full bg-ios-tint text-ios-footnote font-semibold text-white"
            aria-hidden="true"
          >2</span>
        </template>
      </IosRow>
    </IosSection>

    <IosSection>
      <IosRow :title="form.t('inApp.chrome')">
        <template #leading>
          <img src="/icons/chrome.svg" :alt="form.t('inApp.chrome')" class="size-[29px] rounded-[7px]">
        </template>
      </IosRow>
      <IosRow :title="form.t('inApp.safari')">
        <template #leading>
          <img src="/icons/safari.svg" :alt="form.t('inApp.safari')" class="size-[29px] rounded-[7px]">
        </template>
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton @click="form.copyPageUrl()">
        <template #icon><Copy /></template>
        {{ form.t('inApp.copyBtn') }}
      </IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { inject } from 'vue';
import { Compass, Copy } from 'lucide-vue-next';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosIconBadge from '../components/ios/IosIconBadge.vue';

const form = inject('zoomForm');
</script>
