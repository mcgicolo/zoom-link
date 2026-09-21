<template>
  <IosScreen
    :eyebrow="form.t('step2.indicator')"
    :title="form.t('step2.title')"
    :subtitle="form.t('step2.subtitle')"
  >
    <IosSection
      :header="form.t('step2.fieldLabel')"
      :footer="showNameHint ? form.t('step2.error') : undefined"
      :footer-tone="form.showFullNameError ? 'error' : 'default'"
    >
      <IosRow>
        <IosTextField
          ref="fullNameField"
          :model-value="form.formData.fullName"
          :placeholder="form.t('step2.fieldPlaceholder')"
          :label="form.t('step2.fieldLabel')"
          :clear-label="form.t('common.clear')"
          autocomplete="name"
          autocapitalize="words"
          enterkeyhint="next"
          :maxlength="60"
          :invalid="form.showFullNameError"
          @update:model-value="onFullNameInput"
          @enter="form.onFullNameEnter()"
        />
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton :disabled="!form.isFullNameValid" @click="form.nextStep()">
        {{ form.t('step2.continue') }}
      </IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosTextField from '../components/ios/IosTextField.vue';
import IosButton from '../components/ios/IosButton.vue';

const form = inject('zoomForm');
const fullNameField = ref(null);

// Show the name rule as a gray hint while what's typed doesn't meet it yet; it turns red
// once the person tries to continue.
const showNameHint = computed(() => form.showFullNameError
  || (form.formData.fullName.trim() !== '' && !form.isFullNameValid));

function onFullNameInput(value) {
  form.formData.fullName = value;
  form.showFullNameError = false;
}

onMounted(() => {
  nextTick(() => {
    fullNameField.value?.focus();
  });
});
</script>
