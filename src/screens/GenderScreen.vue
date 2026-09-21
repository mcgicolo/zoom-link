<template>
  <IosScreen
    :eyebrow="form.t('step1.indicator')"
    :title="form.t('step1.title')"
    :subtitle="form.t('step1.subtitle')"
  >
    <IosSection>
      <div role="radiogroup" :aria-label="form.t('step1.subtitle')">
        <IosRow
          as="button"
          role="radio"
          :aria-checked="form.formData.gender === 'Brother'"
          :title="form.t('step1.brother')"
          accessory="checkmark"
          :checked="form.formData.gender === 'Brother'"
          @click="form.selectGender('Brother')"
        />
        <IosRow
          as="button"
          role="radio"
          :aria-checked="form.formData.gender === 'Sister'"
          :title="form.t('step1.sister')"
          accessory="checkmark"
          :checked="form.formData.gender === 'Sister'"
          @click="form.selectGender('Sister')"
        />
      </div>
    </IosSection>

    <template #actions>
      <IosButton :disabled="!form.formData.gender" @click="form.nextStep()">
        {{ form.t('step1.continue') }}
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
