<template>
  <IosScreen
    :eyebrow="form.t('step4.indicator')"
    :title="form.t('step4.title')"
    :subtitle="form.t('step4.subtitle')"
  >
    <IosSection :header="form.t('step4.guidelinesHeading')">
      <IosRow
        v-for="item in guidelines"
        :key="item.key"
        :title="form.t(item.key)"
      >
        <template #leading>
          <IosIconBadge :color="item.color" size="sm">
            <component :is="item.icon" />
          </IosIconBadge>
        </template>
      </IosRow>
    </IosSection>

    <IosSection>
      <IosRow
        class="cursor-pointer"
        :title="form.t('step4.agreementLabel')"
        @click="form.agreementChecked = !form.agreementChecked"
      >
        <template #trailing>
          <IosSwitch v-model="form.agreementChecked" :label="form.t('step4.agreementLabel')" />
        </template>
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton :disabled="!form.agreementChecked" @click="form.generateLink()">
        {{ form.t('step4.generateBtn') }}
      </IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { inject } from 'vue';
import { Lock, Video, Shirt, Sun, Type, Users, ShieldCheck } from 'lucide-vue-next';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosSwitch from '../components/ios/IosSwitch.vue';
import IosIconBadge from '../components/ios/IosIconBadge.vue';
import { guidelineKeys } from '../composables/useZoomForm.js';

const form = inject('zoomForm');

const ICONS = [Lock, Video, Shirt, Sun, Type, Users, ShieldCheck];
const COLORS = ['blue', 'green', 'purple', 'yellow', 'indigo', 'teal', 'gray'];
const guidelines = guidelineKeys.map((key, index) => ({
  key,
  icon: ICONS[index],
  color: COLORS[index]
}));
</script>
