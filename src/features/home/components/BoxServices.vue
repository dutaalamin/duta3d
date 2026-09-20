<script setup lang="ts">
import { computed, ref, watchEffect, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { locale } from "../../../i18n/store";
import { t } from "../../../i18n/utils/translate";
import AppearingText from "../../../components/AppearingText.vue";
import { BREAKPOINTS } from "../../../utils/sizes";
import { Vector3 } from "three";
import ProjectedElement from "../../../components/ProjectedElement.vue";

const point = new Vector3(0.75, 2.75, 6.75);

const wrapperRef = ref<HTMLDivElement | null>(null);
const timelines = ref<{ timeline: gsap.core.Timeline; delay: number }[]>([]);
const subRefs = ref<HTMLParagraphElement[]>([]);
let matchMedia: gsap.MatchMedia | null = null;

const emit = defineEmits<{
  "timeline:created": [timeline: gsap.core.Timeline];
}>();

watchEffect((onInvalidate) => {
  const wrapperEl = wrapperRef.value;
  if (!wrapperEl) return;

  if (matchMedia) {
    matchMedia.revert();
    matchMedia = null;
  }

  matchMedia = gsap.matchMedia();

  matchMedia.add(
    {
      isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
      isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
    },
    (context) => {
      const { conditions } = context;
      const { isMobile } = conditions as { isMobile: boolean; isDesktop: boolean };

      const tl = gsap.timeline({
        paused: true,
      });

      // Only animate clipPath on desktop
      if (!isMobile) {
        tl.fromTo(
          wrapperEl,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "none" },
          0,
        );
      } else {
        // On mobile, ensure clipPath is set to visible immediately
        gsap.set(wrapperEl, { clipPath: "inset(0% 0% 0% 0%)" });
      }

      for (let i = 0; i < timelines.value.length; i++) {
        const item = timelines.value[i];
        if (!item) continue;
        tl.add(() => {
          item.timeline.restart(true);
        }, item.delay + 0.25);
      }

      // Only fade in on desktop
      if (!isMobile && subRefs.value.length > 0) {
        const subItems = subRefs.value.filter((ref) => ref !== null && ref !== undefined);
        if (subItems.length > 0) {
          tl.fromTo(subItems, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.1 }, 0.3);
        }
      } else if (isMobile && subRefs.value.length > 0) {
        // On mobile, ensure opacity is 1 immediately
        const subItems = subRefs.value.filter((ref) => ref !== null && ref !== undefined);
        if (subItems.length > 0) {
          gsap.set(subItems, { opacity: 1 });
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

const SERVICES_EN = [
  { name: "Three.js & WebGL" },
  { name: "Node.js & WebSockets" },
  { name: "React & Vue" },
  { name: "Kubernetes & Redis" },
  { name: "Real-time Multiplayer" },
] as const satisfies { name: string }[];

const SERVICES_DE = [
  { name: "Three.js & WebGL" },
  { name: "Node.js & WebSockets" },
  { name: "React & Vue" },
  { name: "Kubernetes & Redis" },
  { name: "Echtzeit-Mehrspieler" },
] as const satisfies { name: string }[];

const services = computed(() => {
  return locale.value === "en" ? SERVICES_EN : SERVICES_DE;
});
</script>

<template>
  <ProjectedElement :point="point">
    <div ref="wrapperRef" class="box-services">
      <div class="box-services-content">
        <div class="box-services-hud-tag">// ABILITIES // TECH STACK</div>
        <div class="box-services-title">
          <AppearingText
            :text="t('services')"
            :steps="1"
            :duration="0.35"
            @timeline:created="(tl: gsap.core.Timeline) => handleTimelineCreated(tl, 0)"
          />
        </div>
        <div class="box-services-list">
          <div class="box-services-list-item" v-for="(service, index) in services" :key="service.name">
            <div class="box-services-list-item-row">
              <span class="box-services-bullet">▸</span>
              <p class="box-services-list-item-name">
                <AppearingText
                  :text="service.name"
                  :steps="1"
                  :duration="0.35"
                  @timeline:created="(tl: gsap.core.Timeline) => handleTimelineCreated(tl, 0.15 + index * 0.1)"
                />
              </p>
              <span class="box-services-stat-tag">MAX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProjectedElement>
</template>

<style scoped lang="scss">
.box-services {
  --line-length: min(48px, calc(var(--svw) * 5));

  position: absolute;
  bottom: var(--count-height);
  width: calc(100% - var(--space-outer) * 2);
  left: var(--space-outer);

  @include mixins.landscape {
    width: 480px;
    max-width: calc(var(--svw) * 37);
    padding-left: var(--line-length);
    position: relative;
    left: 0;
    bottom: 0;
    padding-top: 3px;
    transform: translate(0, -50%);
  }

  @include mixins.landscape-large {
    width: 380px;
    max-width: calc(var(--svw) * 36);
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
    left: 0;
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
    left: 0;
    height: 0;
    border-top: 1px solid var(--color-orange-400);
    box-shadow: 0 0 6px rgba(56, 189, 248, 0.4);

    @include mixins.landscape {
      width: var(--line-length);
    }
  }

  &-hud-tag {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--color-orange-400);
    margin-bottom: 2px;
    font-family: monospace;
  }

  &-content {
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-right: 3px solid var(--color-orange-400);
    border-radius: 6px;
    background: rgba(18, 22, 31, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    color: var(--color-text-400);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);

    @include mixins.landscape {
      padding: var(--space-xs) var(--space-sm);
    }

    @include mixins.mq("md") {
      padding: var(--space-sm) var(--space-md);
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &-item {
      display: flex;
      flex-direction: column;

      &-row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }

      &-name {
        font-size: var(--font-size-md);
        flex: 1;

        @include mixins.landscape {
          font-size: var(--font-size-sm);
        }

        @include mixins.landscape-large {
          font-size: var(--font-size-md);
        }
      }
    }
  }

  &-bullet {
    color: var(--color-orange-400);
    font-size: 11px;
    line-height: 1;
  }

  &-stat-tag {
    font-size: 8px;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 2px;
    background: rgba(56, 189, 248, 0.12);
    color: var(--color-orange-400);
    border: 1px solid rgba(56, 189, 248, 0.3);
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  &-title {
    font-size: var(--font-size-title-xs);
    font-weight: 700;
    letter-spacing: 1px;

    @include mixins.landscape {
      font-size: var(--font-size-title-xxs);
    }

    @include mixins.landscape-large {
      font-size: var(--font-size-title-xs);
    }
  }
}
</style>
