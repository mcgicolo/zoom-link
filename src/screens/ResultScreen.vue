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
        <template #trailing>
          <button
            type="button"
            class="relative inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ios-tint-soft px-3.5 text-ios-subhead font-semibold text-ios-tint transition-opacity after:absolute after:-inset-1 after:content-[''] active:opacity-70"
            @click="form.copyLink()"
          >
            <Copy class="size-4" aria-hidden="true" />
            {{ form.t('step5.copyShort') }}
          </button>
        </template>
      </IosRow>
    </IosSection>

    <div class="mx-4 mb-8">
      <IosButton as="a" :href="form.generatedZoomLink" target="_blank" rel="noopener noreferrer">
        <template #icon><Video /></template>
        {{ form.t('step5.joinBtn') }}
      </IosButton>
    </div>
  </IosScreen>
</template>

<script setup>
import { inject } from 'vue';
import { Check, Video, Copy } from 'lucide-vue-next';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosIconBadge from '../components/ios/IosIconBadge.vue';

const form = inject('zoomForm');

// Select the whole link on tap so it can also be copied by hand (setSelectionRange works on iOS).
function selectLink(event) {
  event.target.setSelectionRange(0, event.target.value.length);
}
</script>
