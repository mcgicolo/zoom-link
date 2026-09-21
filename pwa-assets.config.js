import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config';

// The source artwork is a full-bleed square, so the maskable and Apple icons need no padding.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...preset,
    maskable: { ...preset.maskable, padding: 0 },
    apple: { ...preset.apple, padding: 0 }
  },
  images: ['public/favicon.svg']
});
