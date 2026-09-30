<script setup lang="ts">
import Layout from "../../../components/Layout.vue";
import About from "./About.vue";
import Hero from "./Hero.vue";
//import AboutSections from "../features/about/Sections.vue";
import Projects from "./Projects.vue";
import Contact from "./Contact.vue";
import { ref, onMounted, onUnmounted, watchEffect, computed, watch } from "vue";
import { three } from "../../../three";
import { animations } from "../../../animations";
import HeaderHome from "../../../components/HeaderHome.vue";
import { preloaderVisible } from "../../../composables/usePreloader";
import { raycast } from "../../../three/utils/raycast";
import gsap from "gsap";
import { useAgent } from "../../../composables/useAgent";
import { projectId, projectVisible } from "../../../composables/useRouteObserver";
import { isTransitioning } from "../../../composables/useProjectTransition";
import { renderer } from "../../../three/core/renderer";

const introRef = ref<HTMLElement | null>(null);
const stickyObserver = ref<IntersectionObserver | null>(null);
const scrolledPastIntro = ref(true);
const projectsLoaded = ref(false);
const contactRef = ref<HTMLElement | null>(null);
const contactBottom = ref<number>(0);
const isHoveringObject3D = ref<boolean>(false);
const threeCanvasRef = ref<HTMLCanvasElement | null>(null);
const threeInitialized = ref<boolean>(false);
const { isTouch } = useAgent();

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  scrolledPastIntro.value = entries[0]?.isIntersecting ?? true;
};

const isStickyVisible = computed(() => {
  return scrolledPastIntro.value || !projectsLoaded.value;
});

const updateContactBottomOffset = () => {
  if (!contactRef.value) return;
  const bounding = contactRef.value.getBoundingClientRect();
  const documentBottom = document.documentElement.scrollHeight;
  const elementBottom = bounding.bottom + window.scrollY;
  // distance from bottom of document to bottom of contact section
  contactBottom.value = documentBottom - elementBottom;
};

watch([projectVisible, isTransitioning], () => {
  if (!projectVisible.value) {
    updateContactBottomOffset();
  }
});

watchEffect((onInvalidate) => {
  if (!contactRef.value || preloaderVisible.value) return;

  const resizeObserver = new ResizeObserver(updateContactBottomOffset);
  resizeObserver.observe(contactRef.value as HTMLElement);

  //const intersectionObserver = new IntersectionObserver(updateContactBottomOffset);
  //intersectionObserver.observe(contactRef.value as HTMLElement);

  onInvalidate(() => {
    resizeObserver.disconnect();
    //intersectionObserver.disconnect();
  });
});

const updateCursor = () => {
  if (isTouch.value) return;
  const hoveringBox = raycast.getHoveringBox();
  const shouldBePointer = !!hoveringBox;

  if (shouldBePointer !== isHoveringObject3D.value) {
    isHoveringObject3D.value = shouldBePointer;
    document.documentElement.style.cursor = shouldBePointer ? "pointer" : "";
  }
};

onMounted(() => {
  stickyObserver.value = new IntersectionObserver(handleIntersection);
  stickyObserver.value.observe(introRef.value as HTMLElement);

  if (threeCanvasRef.value && !threeInitialized.value) {
    three.init(threeCanvasRef.value);
    threeInitialized.value = true;
  }

  gsap.ticker.add(updateCursor);
});

onUnmounted(() => {
  stickyObserver.value?.disconnect();
  stickyObserver.value = null;

  three.destroy();

  document.documentElement.style.cursor = "";

  gsap.ticker.remove(updateCursor);
  animations.destroy();
});

const handleProjectsLoaded = () => {
  projectsLoaded.value = true;
};

watchEffect((onInvalidate) => {
  if (
    projectsLoaded &&
    threeInitialized &&
    //(projectId.value === null || isTransitioning.value) &&
    !preloaderVisible.value
  ) {
    animations.init();
  }

  onInvalidate(() => {
    animations.destroy();
  });
});

watch(
  projectVisible,
  (newVal) => {
    renderer.setIsActive(!newVal);
  },
  { immediate: true },
);
</script>

<template>
  <div
    :class="[
      'home-wrapper',
      typeof projectId === 'string' && isTransitioning && `home-wrapper-out`,
      typeof projectId !== 'string' && isTransitioning && `home-wrapper-in`,
    ]"
  >
    <Layout>
      <!-- HOME + ABOUT berbagi satu panggung 3D: layar pertama menampilkan
           sapaan, layar kedua menampilkan profil karakter. -->
      <div class="intro-wrapper" ref="introRef">
        <div
          class="intro-sticky"
          :class="{ 'intro-sticky-visible': isStickyVisible }"
          :style="{ '--contact-bottom': `${contactBottom}px` }"
        >
          <canvas class="three-canvas" ref="threeCanvasRef"></canvas>

          <div class="intro-hero-layer">
            <Hero />
          </div>

          <div class="intro-about-container">
            <About :spacer-ref="introRef" />
          </div>
        </div>

        <!-- Penanda posisi untuk navigasi -->
        <span class="anchor anchor-home" id="home" aria-hidden="true"></span>
        <span class="anchor anchor-about" id="about" aria-hidden="true"></span>
      </div>

      <Projects id="projects" @loaded="handleProjectsLoaded" />
      <div ref="contactRef" class="home-contact">
        <Contact id="contact" v-if="projectsLoaded" />
      </div>
    </Layout>
  </div>
  <HeaderHome v-if="projectsLoaded" />
</template>

<style scoped lang="scss">
.three-canvas {
  /* Kanvas 3D menempel di layar (bukan mengikuti bagian intro), supaya
     karakter tetap terlihat di semua bagian: Home, About, dan Contact. */
  position: fixed;
  inset: 0;
  width: calc(var(--svw) * 100);
  height: calc(var(--lvh) * 100);
  max-height: calc(var(--lvh) * 100);
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.home {
  &-wrapper {
    transform-origin: center center;

    &-out {
      animation: home-wrapper-out var(--transition-route-duration) var(--transition-route-ease);
    }

    &-in {
      animation: home-wrapper-in var(--transition-route-duration) var(--transition-route-ease);
    }

    @keyframes home-wrapper-out {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.95);
      }
    }

    @keyframes home-wrapper-in {
      0% {
        transform: scale(0.95);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  &-contact {
    position: relative;
    z-index: 10;
    width: 100%;
    min-height: calc(var(--lvh) * 100);
    max-height: calc(var(--lvh) * 100);
  }
}

.about-spacer {
  max-height: calc(var(--lvh) * 100);
  min-height: calc(var(--lvh) * 100);
  pointer-events: none;
}

.intro-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* Dua layar: HOME lalu ABOUT, keduanya memakai panggung 3D yang sama. */
  min-height: calc(var(--lvh) * 200);
  position: relative;

  &-spacer {
    display: none;
    pointer-events: none;

    @include mixins.mq("md") {
      display: block;
      height: 200px;
    }
  }
}

/* Penanda posisi untuk tautan navigasi */
.anchor {
  display: block;
  width: 100%;
  height: calc(var(--lvh) * 100);
  pointer-events: none;

  &-home {
    position: absolute;
    top: 0;
  }

  &-about {
    position: absolute;
    top: calc(var(--lvh) * 100);
  }
}

.intro-hero-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 12;
}

.intro-hero {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-height: calc(var(--lvh) * 100);
  min-height: calc(var(--lvh) * 100);
  overflow: hidden;
  z-index: 10;
}

.intro-about-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.intro-about-hidden {
  visibility: hidden;
  pointer-events: none;
}

.intro-sticky {
  top: 0;
  left: 0;
  width: 100%;
  max-height: calc(var(--lvh) * 100);
  min-height: calc(var(--lvh) * 100);
  overflow: hidden;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  pointer-events: none;

  &-visible {
    position: sticky;
  }
}

.intro-sticky-content {
  width: calc(var(--svw) * 100);
  height: calc(var(--lvh) * 100);
  max-height: calc(var(--lvh) * 100);
  position: relative;
  overflow: hidden;

  &-contact {
    position: absolute;
    bottom: var(--contact-bottom);
    left: 0;
    width: 100%;
    height: calc(var(--lvh) * 100);
    max-height: calc(var(--lvh) * 100);
  }
}
</style>
