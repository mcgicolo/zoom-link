<template>
  <IosScreen :eyebrow="form.t('notice.indicator')" :title="form.t('notice.title')">
    <template #hero>
      <IosIconBadge color="orange" size="lg">
        <ShieldAlert />
      </IosIconBadge>
    </template>

    <IosSection>
      <IosRow :title="form.noticeMessage" />
    </IosSection>

    <IosSection v-if="form.contact?.phone">
      <IosRow
        as="a"
        :href="telHref"
        :title="callTitle"
        :subtitle="form.contact.phone"
        accessory="chevron"
      >
        <template #leading>
          <IosIconBadge color="green" size="sm">
            <Phone />
          </IosIconBadge>
        </template>
      </IosRow>
    </IosSection>

    <template #actions>
      <IosButton @click="form.nextStep()">{{ form.t('step1.continue') }}</IosButton>
    </template>
  </IosScreen>
</template>

<script setup>
import { computed, inject } from 'vue';
import { Phone, ShieldAlert } from 'lucide-vue-next';
import IosScreen from '../components/ios/IosScreen.vue';
import IosSection from '../components/ios/IosSection.vue';
import IosRow from '../components/ios/IosRow.vue';
import IosButton from '../components/ios/IosButton.vue';
import IosIconBadge from '../components/ios/IosIconBadge.vue';

const form = inject('zoomForm');

// Strips everything except digits and a leading "+", e.g. "0992 456 1943" -> "tel:09924561943".
function toTelHref(phone) {
  const trimmed = (phone || '').trim();
  const hasLeadingPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return `tel:${hasLeadingPlus ? '+' : ''}${digits}`;
}

const telHref = computed(() => toTelHref(form.contact?.phone));
const callTitle = computed(() => form.t('notice.call').replace(/\{name\}/g, form.contact?.name ?? ''));
</script>
