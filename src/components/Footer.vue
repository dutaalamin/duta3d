<script setup lang="ts">
import Social from "./Social.vue";
import NotchSection from "./NotchSection.vue";
import ButtonRound from "./ButtonRound.vue";
import { lenis } from "../composables/useScroll";
import ArrowRightLong from "./icons/ArrowRightLong.vue";

interface Props {
  withSocial?: boolean;
}

const handleBackToTop = () => {
  if (!lenis.value) return;
  lenis.value.scrollTo(0);
};

const { withSocial = true } = defineProps<Props>();
</script>

<template>
  <footer class="footer">
    <NotchSection class="footer-notch" />
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-top-left">
          <Social v-if="withSocial" />
        </div>
        <div
          class="footer-back-to-top"
          tabindex="0"
          @click="handleBackToTop"
          @keydown.enter="handleBackToTop"
          data-cursor="circle-white"
          data-sound="click"
        >
          <ButtonRound renderAs="div" variant="border" class="children-unclickable" data-hoversound="hover">
            <ArrowRightLong class="footer-back-to-top-icon" />
          </ButtonRound>
        </div>
        <div class="footer-top-right"></div>
      </div>
      <div class="footer-credits">
        <p>© {{ new Date().getFullYear() }} Duta Alamin</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: var(--color-background-300, var(--color-beige-400));
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
    width: 100%;
    max-width: calc(var(--breakpoint-xxxl));
    padding: calc(var(--space-outer) + var(--space-sm)) var(--space-outer);
    position: relative;
  }

  &-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-lg);
    width: 100%;

    @include mixins.mq("md") {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }

    &-left {
      display: flex;
      justify-content: center;

      @include mixins.mq("md") {
        justify-content: flex-start;
      }
    }

    &-right {
      display: none;

      @include mixins.mq("md") {
        display: block;
      }
    }
  }

  &-back-to-top {
    cursor: pointer;
    display: flex;
    justify-content: center;

    &-icon {
      transform: rotate(-90deg);
    }
  }

  &-credits {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    font-size: var(--font-size-sm);
    text-align: center;
  }

  &-notch {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    color: var(--color-background-300, var(--color-beige-400));
    --icon-color: var(--color-background-300, var(--color-beige-400));
  }
}
</style>
