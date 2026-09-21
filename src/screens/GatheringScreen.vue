<template>
  <IosScreen
    :eyebrow="form.t('gathering.indicator')"
    :title="form.t('gathering.title')"
    :subtitle="form.t('gathering.subtitle')"
  >
    <IosSection>
      <div role="radiogroup" :aria-label="form.t('gathering.title')">
        <IosRow
          v-for="item in form.gatheringOptions"
          :key="item.code"
          as="button"
          role="radio"
          :aria-checked="form.gathering === item.code"
          :title="form.t(item.labelKey)"
          accessory="checkmark"
          :checked="form.gathering === item.code"
          @click="form.gathering = item.code"
        />
      </div>
    </IosSection>

    <IosSection v-if="form.gathering" :header="form.t('step3.namePreviewPrefix')">
      <IosRow>
        <span class="block text-ios-headline font-semibold">{{ form.previewName }}</span>
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton :disabled="!form.gathering" @click="form.nextStep()">
        {{ form.t('gathering.continue') }}
      </IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { inject } from 'vue';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';

const form = inject('zoomForm');
</script>
