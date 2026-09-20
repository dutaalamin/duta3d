<script setup lang="ts">
import { t } from "../../../i18n/utils/translate";
import { ref, watchEffect, onBeforeUnmount } from "vue";
import gsap from "gsap";
import AppearingText from "../../../components/AppearingText.vue";
import { BREAKPOINTS } from "../../../utils/sizes";
import { Vector3 } from "three";
import PinIcon from "../../../components/icons/Pin.vue";
import ProjectedElement from "../../../components/ProjectedElement.vue";

const point = new Vector3(-0.76, 3.6, 6.75);

const wrapperRef = ref<HTMLDivElement | null>(null);
const timelines = ref<{ timeline: gsap.core.Timeline; delay: number }[]>([]);
let matchMedia: gsap.MatchMedia | null = null;

const emit = defineEmits<{
  "timeline:created": [timeline: gsap.core.Timeline];
}>();

watchEffect((onInvalidate) => {
  const wrapperEl = wrapperRef.value;
  if (!wrapperEl) return;

  // Clean up previous matchMedia
  if (matchMedia) {
    matchMedia.revert();
    matchMedia = null;
  }

  // Initialize GSAP matchMedia
  matchMedia = gsap.matchMedia();

  matchMedia.add(
    {
      isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
      isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
      isLandscape: `(min-aspect-ratio: 1)`,
    },
    (context) => {
      const { conditions } = context;
      const { isLandscape } = conditions as { isMobile: boolean; isDesktop: boolean; isLandscape: boolean };

      const tl = gsap.timeline({
        paused: true,
      });

      // Only animate clipPath on landscape (animations disabled on portrait)
      if (isLandscape) {
        tl.fromTo(
          wrapperEl,
          { clipPath: "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "none" },
          0,
        );
      } else {
        // On portrait, set clipPath immediately without animation
        gsap.set(wrapperEl, { clipPath: "inset(0% 0% 0% 0%)" });
      }

      // Only add timeline animations on landscape
      if (isLandscape) {
        for (let i = 0; i < timelines.value.length; i++) {
          const item = timelines.value[i];
          if (!item) continue;
          tl.add(() => {
            item.timeline.restart(true);
          }, item.delay + 0.25);
        }
      }

      emit("timeline:created", tl);

      // Return cleanup function
      return () => {
        tl.kill();
      };
    },
  );

  onInvalidate(() => {
    if (matchMedia) {
      matchMedia.revert();
      matchMedia = null;
    }
  });
});

onBeforeUnmount(() => {
  if (matchMedia) {
    matchMedia.revert();
  }
});

const handleTimelineCreated = (timeline: gsap.core.Timeline, delay: number) => {
  const updatedTimelines = [...timelines.value, { timeline, delay }];
  timelines.value = updatedTimelines;
};
</script>

<template>
  <ProjectedElement :point="point">
    <div ref="wrapperRef" class="box-details">
      <div class="box-details-content">
        <div class="box-details-hud-tag">// OPERATOR IDENT</div>
        <div class="box-details-header">
          <div class="box-details-title">
            <AppearingText
              text="Duta"
              :steps="1"
              :duration="0.35"
              @timeline:created="(tl: gsap.core.Timeline) => handleTimelineCreated(tl, 0)"
            />
          </div>
          <span class="box-details-badge">LVL 99</span>
        </div>
        <div class="box-details-items">
          <div class="box-details-item">
            <PinIcon class="box-details-icon" />
            <AppearingText
              v-if="t('germany')"
              class="box-details-content-copy"
              :text="t('germany')"
              :steps="3"
              :duration="0.35"
              @timeline:created="(tl: gsap.core.Timeline) => handleTimelineCreated(tl, 0.1)"
            />
          </div>
        </div>
      </div>
    </div>
  </ProjectedElement>
</template>

<style scoped lang="scss">
.box-details {
  --line-length: min(48px, calc(var(--svw) * 5));

  display: none;

  @include mixins.landscape {
    display: block;
    position: absolute;
    padding-bottom: 3px;
    padding-right: var(--line-length);
    width: 250px;
    max-width: calc(var(--svw) * 32);
    transform: translate(-100%, -50%);
  }

  @include mixins.landscape-large {
    width: 250px;
  }

  &::after,
  &::before {
    display: none;

    @include mixins.landscape {
      display: block;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 10px;
    height: 10px;
    background-color: var(--color-orange-400);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--color-orange-400);
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: var(--line-length);
    height: 0;
    border-bottom: 1px solid var(--color-orange-400);
    box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);
  }

  &-hud-tag {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--color-orange-400);
    margin-bottom: 2px;
    font-family: monospace;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &-badge {
    font-size: 9px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 3px;
    background: rgba(56, 189, 248, 0.15);
    color: var(--color-orange-400);
    border: 1px solid rgba(56, 189, 248, 0.4);
    letter-spacing: 1px;
    font-family: monospace;
  }

  &-content {
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-left: 3px solid var(--color-orange-400);
    border-radius: 6px;
    background: rgba(18, 22, 31, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    color: var(--color-text-400);
    gap: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-md);

    @include mixins.landscape {
      flex-direction: column;
      justify-content: flex-start;
      padding: var(--space-xs) var(--space-sm);
    }

    @include mixins.mq("md") {
      padding: var(--space-sm) var(--space-md);
    }
  }

  &-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    flex-direction: row;
    white-space: nowrap;
    height: var(--icon-size-sm);
  }

  &-icon {
    width: var(--icon-size-xxs);
    transform: translateY(-1px);
    --icon-color: var(--color-text-400);

    @include mixins.mq("md") {
      width: var(--icon-size-xs);
    }
  }

  &-title {
    font-size: var(--font-size-title-xxs);
    font-weight: 700;

    @include mixins.mq("md") {
      font-size: var(--font-size-title-sm);
    }
  }

  &-items {
    display: flex;
    font-size: var(--font-size-sm);
    flex-direction: column;

    @include mixins.mq("md") {
      font-size: var(--font-size-md);
    }

    &-copy {
      flex: 0.5;
    }
  }
}
</style>
