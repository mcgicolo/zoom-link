<template>
  <div
    aria-hidden="true"
    class="relative h-[280px] w-[150px] shrink-0 rounded-[26px] border-[5px] border-black/80 dark:border-white/20"
  >
    <div class="relative h-full w-full overflow-hidden rounded-[21px] bg-ios-bg">
      <Transition name="ia-frame" mode="out-in">
        <div :key="`${platform}-${step}`" class="absolute inset-0">
          <!-- Step 3: home screen (shared by both platforms) -->
          <div v-if="step === 3" class="grid grid-cols-4 gap-x-[6px] gap-y-[9px] p-2 pt-3">
            <div
              v-for="(color, i) in placeholderIcons"
              :key="i"
              class="size-6 rounded-[8px]"
              :class="color"
            ></div>
            <div class="ia-icon-pop relative flex flex-col items-center gap-[3px]">
              <img :src="iconSrc" alt="" class="size-6 rounded-[8px] object-cover ring-2 ring-ios-tint/60" />
              <span class="max-w-[30px] truncate text-[7px] leading-none text-ios-label">{{ appName }}</span>
            </div>
          </div>

          <!-- iOS step 0: web page + Safari toolbar -->
          <div v-else-if="platform === 'ios' && step === 0" class="flex h-full flex-col">
            <div class="relative flex-1 overflow-hidden">
              <div class="absolute inset-0 flex flex-col gap-[6px] p-2 pt-3">
                <div class="h-[10px] w-2/3 rounded bg-ios-fill"></div>
                <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                <div class="h-[6px] w-5/6 rounded bg-ios-fill"></div>
                <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                <div class="h-[6px] w-4/6 rounded bg-ios-fill"></div>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-ios-separator bg-ios-bar px-2 py-[6px]">
              <ChevronLeft class="size-3.5 text-ios-label-2" />
              <ChevronRight class="size-3.5 text-ios-label-2" />
              <span class="relative inline-flex items-center justify-center">
                <Share class="size-3.5 text-ios-tint" />
                <span class="ia-tap-ring size-4 bg-ios-tint"></span>
              </span>
              <BookOpen class="size-3.5 text-ios-label-2" />
              <Copy class="size-3.5 text-ios-label-2" />
            </div>
          </div>

          <!-- iOS step 1: share sheet -->
          <div v-else-if="platform === 'ios' && step === 1" class="relative h-full">
            <div class="flex h-full flex-col">
              <div class="relative flex-1 overflow-hidden">
                <div class="absolute inset-0 flex flex-col gap-[6px] p-2 pt-3">
                  <div class="h-[10px] w-2/3 rounded bg-ios-fill"></div>
                  <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                  <div class="h-[6px] w-5/6 rounded bg-ios-fill"></div>
                </div>
              </div>
              <div class="h-[24px] border-t border-ios-separator bg-ios-bar"></div>
            </div>
            <div class="ia-fade-in absolute inset-0 bg-black/30"></div>
            <div
              class="ia-sheet-in absolute inset-x-0 bottom-0 rounded-t-[10px] bg-ios-card px-2 pb-2 pt-1.5 shadow-[0_-2px_10px] shadow-black/25"
            >
              <div class="mx-auto mb-1.5 h-1 w-6 rounded-full bg-ios-label-3"></div>
              <div class="flex items-center gap-1.5 px-1 py-[3px]">
                <Copy class="size-3 text-ios-label-2" />
                <span class="text-[9px] text-ios-label">Copy</span>
              </div>
              <div class="flex items-center gap-1.5 px-1 py-[3px]">
                <BookOpen class="size-3 text-ios-label-2" />
                <span class="text-[9px] text-ios-label">Add to Reading List</span>
              </div>
              <div class="relative flex items-center gap-1.5 rounded-[6px] bg-ios-tint-soft px-1 py-[3px]">
                <span class="relative inline-flex size-3 items-center justify-center">
                  <SquarePlus class="size-3 text-ios-tint" />
                  <span class="ia-tap-ring size-4 bg-ios-tint"></span>
                </span>
                <span class="text-[9px] font-medium text-ios-tint">Add to Home Screen</span>
              </div>
            </div>
          </div>

          <!-- iOS step 2: Add to Home Screen confirmation -->
          <div v-else-if="platform === 'ios' && step === 2" class="flex h-full flex-col bg-ios-bg">
            <div class="flex items-center justify-between gap-1 border-b border-ios-separator px-2 py-[6px]">
              <span class="shrink-0 text-[8px] text-ios-tint">Cancel</span>
              <span class="min-w-0 truncate text-[8px] font-semibold text-ios-label">Add to Home Screen</span>
              <span class="relative inline-flex shrink-0 items-center justify-center">
                <span class="text-[8px] font-semibold text-ios-tint">Add</span>
                <span class="ia-tap-ring size-5 bg-ios-tint"></span>
              </span>
            </div>
            <div class="mx-2 mt-3 flex items-center gap-2 rounded-[10px] bg-ios-card px-2 py-2">
              <img :src="iconSrc" alt="" class="size-7 shrink-0 rounded-[7px] object-cover" />
              <span
                class="min-w-0 flex-1 truncate rounded-[6px] border border-ios-separator bg-ios-bg px-1.5 py-1 text-[8px] text-ios-label"
              >
                {{ appName }}
              </span>
            </div>
          </div>

          <!-- Android step 0: web page + Chrome top bar -->
          <div v-else-if="platform === 'android' && step === 0" class="flex h-full flex-col">
            <div class="flex items-center gap-1.5 border-b border-ios-separator bg-ios-bar px-2 py-[6px]">
              <div class="min-w-0 flex-1 truncate rounded-full bg-ios-fill px-2 py-[3px] text-[8px] text-ios-label-2">
                mcgicolo.github.io
              </div>
              <span class="relative inline-flex shrink-0 items-center justify-center">
                <EllipsisVertical class="size-3.5 text-ios-label" />
                <span class="ia-tap-ring size-4 bg-ios-tint"></span>
              </span>
            </div>
            <div class="relative flex-1 overflow-hidden">
              <div class="absolute inset-0 flex flex-col gap-[6px] p-2 pt-3">
                <div class="h-[10px] w-2/3 rounded bg-ios-fill"></div>
                <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                <div class="h-[6px] w-5/6 rounded bg-ios-fill"></div>
                <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                <div class="h-[6px] w-4/6 rounded bg-ios-fill"></div>
              </div>
            </div>
          </div>

          <!-- Android step 1: overflow dropdown menu -->
          <div v-else-if="platform === 'android' && step === 1" class="relative h-full">
            <div class="flex h-full flex-col">
              <div class="flex items-center gap-1.5 border-b border-ios-separator bg-ios-bar px-2 py-[6px]">
                <div
                  class="min-w-0 flex-1 truncate rounded-full bg-ios-fill px-2 py-[3px] text-[8px] text-ios-label-2"
                >
                  mcgicolo.github.io
                </div>
                <EllipsisVertical class="size-3.5 shrink-0 text-ios-label" />
              </div>
              <div class="relative flex-1 overflow-hidden">
                <div class="absolute inset-0 flex flex-col gap-[6px] p-2 pt-3">
                  <div class="h-[10px] w-2/3 rounded bg-ios-fill"></div>
                  <div class="h-[6px] w-full rounded bg-ios-fill"></div>
                </div>
              </div>
            </div>
            <div
              class="ia-menu-in absolute right-1.5 top-[24px] w-[96px] rounded-[8px] bg-ios-card py-1 shadow-[0_4px_14px] shadow-black/25"
            >
              <div class="px-2 py-[3px] text-[8px] text-ios-label">New tab</div>
              <div class="px-2 py-[3px] text-[8px] text-ios-label">Bookmarks</div>
              <div class="relative flex items-center justify-between gap-1 bg-ios-tint-soft px-2 py-[3px]">
                <span class="text-[8px] font-medium text-ios-tint">Add to Home screen</span>
                <span class="relative inline-flex size-2 shrink-0 items-center justify-center">
                  <span class="ia-tap-ring size-4 bg-ios-tint"></span>
                </span>
              </div>
              <div class="px-2 py-[3px] text-[8px] text-ios-label">Settings</div>
            </div>
          </div>

          <!-- Android step 2: install dialog -->
          <div v-else class="relative h-full">
            <div class="flex h-full flex-col">
              <div class="flex items-center gap-1.5 border-b border-ios-separator bg-ios-bar px-2 py-[6px]">
                <div
                  class="min-w-0 flex-1 truncate rounded-full bg-ios-fill px-2 py-[3px] text-[8px] text-ios-label-2"
                >
                  mcgicolo.github.io
                </div>
              </div>
              <div class="relative flex-1 overflow-hidden">
                <div class="absolute inset-0 flex flex-col gap-[6px] p-2 pt-3">
                  <div class="h-[10px] w-2/3 rounded bg-ios-fill"></div>
                </div>
              </div>
            </div>
            <div class="ia-fade-in absolute inset-0 bg-black/40"></div>
            <div
              class="ia-dialog-in absolute left-1/2 top-1/2 w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-ios-card p-2.5 shadow-[0_8px_24px] shadow-black/30"
            >
              <div class="flex flex-col items-center gap-1 text-center">
                <img :src="iconSrc" alt="" class="size-6 rounded-[7px] object-cover" />
                <span class="text-[8px] font-semibold text-ios-label">Install app</span>
                <span class="max-w-full truncate text-[8px] text-ios-label-2">{{ appName }}</span>
              </div>
              <div class="mt-2 flex items-center justify-end gap-2.5">
                <span class="text-[8px] text-ios-label-2">Cancel</span>
                <span class="relative inline-flex items-center justify-center">
                  <span class="text-[8px] font-semibold text-ios-tint">Install</span>
                  <span class="ia-tap-ring size-5 bg-ios-tint"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { Share, SquarePlus, EllipsisVertical, ChevronLeft, ChevronRight, BookOpen, Copy } from 'lucide-vue-next';

defineProps({
  platform: { type: String, default: 'ios' },
  step: { type: Number, default: 0 },
  appName: { type: String, default: 'MCGI Zoom' },
  iconSrc: { type: String, default: './pwa-192x192.png' },
});

// Muted placeholder tiles that fill the mock home screen before the real icon pops in.
const placeholderIcons = [
  'bg-ios-fill',
  'bg-ios-blue/25',
  'bg-ios-green/25',
  'bg-ios-fill',
  'bg-ios-orange/25',
  'bg-ios-purple/25',
  'bg-ios-fill',
  'bg-ios-pink/25',
  'bg-ios-teal/25',
];
</script>

<style scoped>
.ia-tap-ring {
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 9999px;
  pointer-events: none;
  animation: ia-tap-pulse 1.2s ease-out infinite;
}

@keyframes ia-tap-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.55;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.ia-fade-in {
  animation: ia-fade 0.25s ease-out both;
}

@keyframes ia-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ia-sheet-in {
  animation: ia-sheet-slide 0.32s cubic-bezier(0.32, 0.72, 0, 1) both;
}

@keyframes ia-sheet-slide {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.ia-menu-in,
.ia-dialog-in {
  animation: ia-pop-in 0.22s ease-out both;
}

.ia-menu-in {
  transform-origin: top right;
}

@keyframes ia-pop-in {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.ia-icon-pop {
  animation: ia-icon-pop-frames 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}

@keyframes ia-icon-pop-frames {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.ia-frame-enter-active,
.ia-frame-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.ia-frame-enter-from,
.ia-frame-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .ia-tap-ring {
    display: none;
  }

  .ia-fade-in,
  .ia-sheet-in,
  .ia-menu-in,
  .ia-dialog-in,
  .ia-icon-pop {
    animation: none;
  }

  .ia-frame-enter-active,
  .ia-frame-leave-active {
    transition: none;
  }
}
</style>
