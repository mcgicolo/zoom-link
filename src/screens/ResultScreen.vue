<template>
  <IosScreen
    align="center"
    :eyebrow="form.t('step5.indicator')"
    :title="form.t('step5.title')"
    :subtitle="form.t('step5.subtitle')"
  >
    <template #hero>
      <IosIconBadge color="green" size="lg">
        <Check />
      </IosIconBadge>
    </template>

    <IosSection>
      <IosRow>
        <div>
          <div class="text-ios-footnote text-ios-label-2">{{ form.t('step5.displayNameRow') }}</div>
          <div class="text-ios-body font-semibold">{{ form.generatedDisplayName }}</div>
        </div>
      </IosRow>
    </IosSection>

    <IosSection :header="form.t('step5.linkHeader')">
      <IosRow>
        <input
          type="text"
          readonly
          :value="form.generatedZoomLink"
          :aria-label="form.t('step5.linkHeader')"
          class="block w-full min-w-0 bg-transparent font-mono text-ios-footnote text-ios-label-2 outline-none"
          @focus="selectLink"
          @click="selectLink"
        >
      </IosRow>
    </IosSection>

    <div class="mx-4 mb-8">
      <IosButton as="a" :href="form.generatedZoomLink" target="_blank" rel="noopener noreferrer">
        <template #icon><Video /></template>
        {{ form.t('step5.joinBtn') }}
      </IosButton>
    </div>

    <IosSection v-if="installGuide.isAvailable">
      <IosRow
        as="button"
        accessory="chevron"
        :title="form.t('install.title')"
        :subtitle="form.t('install.cardSubtitle')"
        @click="installGuide.open()"
      >
        <template #leading>
          <img :src="'./pwa-192x192.png'" alt="" class="size-[29px] rounded-[7px]">
        </template>
      </IosRow>
    </IosSection>
  </IosScreen>
</template>

<script setup>
import { inject } from 'vue';
import { Check, Video } from 'lucide-vue-next';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosIconBadge from '../components/ios/IosIconBadge.vue';
import { useInstallGuide } from '../composables/useInstallGuide';

const form = inject('zoomForm');
const installGuide = useInstallGuide();

// Select the whole link on tap so it can be copied by hand (setSelectionRange works on iOS).
function selectLink(event) {
  event.target.setSelectionRange(0, event.target.value.length);
}
</script>
