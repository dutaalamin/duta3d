<script setup lang="ts">
import { t } from "../../../i18n/utils/translate";
import Social from "../../../components/Social.vue";
import Banner from "../../../components/Banner.vue";
</script>

<template>
  <div class="contact grid" id="contact">
    <div class="contact-content">
      <div class="contact-heading">
        <Banner class="contact-banner" copy="Contact" size="sm" animated />
        <h2 class="contact-title" v-html="t('lets-work-together')"></h2>
      </div>
      <Social variant="background" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact {
  width: 100%;
  max-width: calc(var(--svw) * 100);
  overflow: hidden;
  min-height: calc(var(--lvh) * 100);
  padding: var(--space-outer);
  /* Clears the fixed header so the title never sits under the logo. */
  padding-top: calc(var(--height-header) + var(--space-xl));
  position: relative;
  z-index: 10;

  &-content {
    position: relative;
    grid-column: 1 / 13;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);

    @include mixins.mq("sm") {
      grid-column: 1 / 8;
    }

    @include mixins.mq("md") {
      gap: var(--space-lg);
      grid-column: 1 / 6;
      padding-top: var(--space-lg);
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 6;
    }
  }

  /* Same treatment as the SELECTED badge on Projects: pinned to the top-left
     corner of the heading, tilted. */
  &-heading {
    position: relative;
    /* Tight enough that the badge sits just above the first line. */
    padding-top: var(--space-md);
  }

  &-banner {
    position: absolute;
    top: 0;
    left: -8px;
    transform: translate(0, -55%) rotate(-4deg);

    @include mixins.mq("lg") {
      left: -16px;
      transform: translate(0, -55%) rotate(-6deg);
    }
  }

  &-title {
    margin: 0;
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: var(--font-size-title-md);
    color: #ffffff;

    @include mixins.mq("sm") {
      font-size: var(--font-size-title-lg);
    }

    @include mixins.mq("xl") {
      font-size: var(--font-size-title-xl);
    }
  }
}
</style>
