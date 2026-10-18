<script setup lang="ts">
import Layout from "../../../components/Layout.vue";
import Hero from "./Hero.vue";
import Projects from "./Projects.vue";
import Contact from "./Contact.vue";
import { ref } from "vue";
import HeaderHome from "../../../components/HeaderHome.vue";
import { projectId } from "../../../composables/useRouteObserver";
import { isTransitioning } from "../../../composables/useProjectTransition";

const projectsLoaded = ref(false);

const handleProjectsLoaded = () => {
  projectsLoaded.value = true;
};
</script>

<template>
  <div
    :class="[
      'home-wrapper',
      typeof projectId === 'string' && isTransitioning && `home-wrapper-out`,
      typeof projectId !== 'string' && isTransitioning && `home-wrapper-in`,
    ]"
  >
    <!--
      One flat scroll: hero, projects and contact follow each other in normal
      document flow. Nothing is pinned or fixed any more — the earlier version
      stacked a fixed intro stage over the page, which made Projects slide over
      the hero instead of scrolling with it.
    -->
    <Layout>
      <div class="home-hero" id="home">
        <Hero />
      </div>

      <Projects id="projects" @loaded="handleProjectsLoaded" />
      <Contact id="contact" v-if="projectsLoaded" />
    </Layout>
  </div>
  <HeaderHome v-if="projectsLoaded" />
</template>

<style scoped lang="scss">
.home {
  &-wrapper {
    transform-origin: center center;
    position: relative;

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

  &-hero {
    position: relative;
    width: 100%;
    min-height: calc(var(--lvh) * 100);
    display: flex;
    align-items: center;
  }
}
</style>
