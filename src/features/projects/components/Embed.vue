<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Link from "../../../components/Link.vue";
import { t } from "../../../i18n/utils/translate";

export interface Props {
  /** Live URL of the app rendered inside the frame. */
  src: string;
  /** Accessible name for the frame — assistive tech announces this. */
  title: string;
  caption?: string;
  /** CSS `aspect-ratio` of the frame; defaults to 16 / 9. */
  ratio?: string;
  index: number;
}

const { src, title, caption, ratio } = defineProps<Props>();

const wrapperRef = ref<HTMLDivElement | null>(null);
const frameRef = ref<HTMLIFrameElement | null>(null);
const isNear = ref(false);
const isPlaying = ref(false);

let observer: IntersectionObserver | null = null;

// An embed is a second document: it is only worth fetching once the reader is
// actually approaching it.
onMounted(() => {
  const element = wrapperRef.value;
  if (!element) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      isNear.value = true;
      observer?.disconnect();
      observer = null;
    },
    { rootMargin: "300px 0px" }
  );

  observer.observe(element);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

// The page is scrolled with Lenis, so a live frame would swallow the wheel.
// The demo only takes over input once the reader deliberately starts it, and
// the standalone link stays available in case the app refuses to be framed.
const startPlaying = () => {
  isPlaying.value = true;
  frameRef.value?.focus();
};
</script>

<template>
  <div class="project-embed" ref="wrapperRef">
    <div class="project-embed-bar">
      <p class="project-embed-bar-caption">{{ caption ?? t("interactive-demo") }}</p>
      <Link
        :href="src"
        external
        class="project-embed-bar-link"
        data-cursor="arrow-external"
        data-sound="click"
        data-hoversound="hover"
      >
        {{ t("open-demo") }}
      </Link>
    </div>

    <div class="project-embed-frame" :style="{ aspectRatio: ratio ?? '16 / 9' }">
      <iframe
        v-if="isNear"
        ref="frameRef"
        :src="src"
        :title="title"
        class="project-embed-frame-view"
        :class="{ 'is-playing': isPlaying }"
        loading="lazy"
        allow="fullscreen; gamepad"
        allowfullscreen
      />

      <button
        v-if="!isPlaying"
        type="button"
        class="project-embed-overlay"
        :aria-label="t('play-demo')"
        data-cursor="circle-white"
        data-sound="click"
        @click="startPlaying"
      >
        <span class="project-embed-overlay-label">{{ t("play-demo") }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-embed {
  width: 100%;
  grid-column: 1 / 13;
  max-width: 900px;
  justify-self: center;

  @include mixins.mq("md") {
    grid-column: 2 / 12;
  }

  @include mixins.mq("lg") {
    grid-column: 3 / 11;
  }

  &-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    padding-bottom: var(--space-xs);

    &-caption {
      font-size: var(--font-size-sm);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-300);
    }

    &-link {
      font-size: var(--font-size-sm);
      font-weight: 700;
      color: var(--color-orange-400);
      white-space: nowrap;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-frame {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background-color: var(--color-background-300);
    border: 1px solid var(--color-grayscale-400);

    &-view {
      width: 100%;
      height: 100%;
      border: 0;
      pointer-events: none;

      &.is-playing {
        pointer-events: auto;
      }
    }
  }

  &-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0;
    border: 0;
    background-color: rgba(6, 6, 8, 0.35);
    cursor: pointer;

    &-label {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      background-color: var(--color-orange-400);
      color: var(--color-white-400);
      font-size: var(--font-size-sm);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  }
}
</style>
