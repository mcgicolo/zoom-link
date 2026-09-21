<template>
  <IosScreen
    :eyebrow="form.t('step3.indicator')"
    :title="form.t('step3.title')"
    :subtitle="form.t('step3.subtitle')"
  >
    <div class="px-4 pb-4">
      <IosSearchField
        v-model="search"
        :placeholder="form.t('step3.search')"
        :clear-label="form.t('common.clear')"
      />
    </div>

    <IosSection :header="form.t('step3.listHeader')">
      <div role="radiogroup" :aria-label="form.t('step3.subtitle')">
        <IosRow
          v-for="name in filteredLocales"
          :key="name"
          as="button"
          role="radio"
          :aria-checked="form.formData.localeName === name"
          :title="name"
          accessory="checkmark"
          :checked="form.formData.localeName === name"
          @click="selectLocale(name)"
        />
        <IosRow v-if="filteredLocales.length === 0">
          <span class="block text-ios-label-2">{{ form.t('step3.noResults') }}</span>
        </IosRow>
      </div>
    </IosSection>

    <IosSection
      :footer="otherFooterText"
      :footer-tone="otherFooterText ? 'error' : 'default'"
    >
      <IosRow
        as="button"
        role="radio"
        :aria-checked="form.formData.localeName === form.OTHER_LOCALE"
        :title="form.t('step3.other')"
        accessory="checkmark"
        :checked="form.formData.localeName === form.OTHER_LOCALE"
        @click="selectOther"
      />
      <IosRow v-if="form.formData.localeName === form.OTHER_LOCALE">
        <IosTextField
          ref="otherInput"
          :model-value="form.formData.customLocale"
          :placeholder="form.t('step3.otherPlaceholder')"
          :label="form.t('step3.other')"
          autocapitalize="words"
          enterkeyhint="next"
          :maxlength="40"
          :clear-label="form.t('common.clear')"
          @update:model-value="onCustomLocaleInput"
          @enter="form.nextStep()"
        />
      </IosRow>
    </IosSection>

    <IosSection v-if="form.isLocaleValid" :header="form.t('step3.namePreviewPrefix')">
      <IosRow>
        <span class="block text-ios-headline font-semibold">{{ form.previewName }}</span>
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton :disabled="!form.isLocaleValid" @click="form.nextStep()">
        {{ form.t('step3.continue') }}
      </IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosSearchField from '../components/ios/IosSearchField.vue';
import IosTextField from '../components/ios/IosTextField.vue';

const form = inject('zoomForm');

const search = ref('');
const otherInput = ref(null);

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

const filteredLocales = computed(() => {
  const query = normalize(search.value);
  return form.localeOptions.filter((name) => normalize(name).includes(query));
});

const otherFooterText = computed(() => {
  const isOtherSelected = form.formData.localeName === form.OTHER_LOCALE;
  return isOtherSelected && form.showLocaleError && !form.isLocaleValid
    ? form.t('step3.otherError')
    : undefined;
});

function selectLocale(name) {
  form.formData.localeName = name;
  form.showLocaleError = false;
}

async function selectOther() {
  form.formData.localeName = form.OTHER_LOCALE;
  await nextTick();
  otherInput.value?.focus();
}

function onCustomLocaleInput(value) {
  form.formData.customLocale = value;
  form.showLocaleError = false;
}
</script>
