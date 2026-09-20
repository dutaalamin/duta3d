<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { aboutProgress } from "../../../animations/transitions/about";

const progressPercentage = ref(0);

const tick = () => {
  const newValue = Math.round(aboutProgress.value * 1000) / 10;
  if (newValue !== progressPercentage.value) {
    progressPercentage.value = newValue;
  }
};

onMounted(() => {
  gsap.ticker.add(tick);
});

onBeforeUnmount(() => {
  gsap.ticker.remove(tick);
});
</script>

<template>
  <div class="progress-count grid">
    <div class="progress-count-bar">
      <div class="progress-count-bar-fill" :style="{ width: `${progressPercentage}%` }"></div>
    </div>
    <p class="progress-count-percentage">{{ Math.round(progressPercentage) }}%</p>
  </div>
</template>

<style scoped lang="scss">
.progress-count {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text-300);
  font-family: "ProFontWindows";
  text-align: center;
  align-items: center;
  height: var(--count-height);
  will-change: transform, opacity;
  padding: 0 var(--space-lg);

  @include mixins.landscape {
    display: none;
  }

  &-bar {
    width: 100%;
    height: 2px;
    border-radius: var(--radius-md);
    grid-column: 2 / 10;
    background-color: rgba(44, 30, 36, 0.12);

    &-fill {
      background-color: var(--color-orange-400);
      height: 100%;
      border-radius: var(--radius-md);
    }
  }

  &-percentage {
    grid-column: 10 / 12;
    white-space: nowrap;
  }
}
</style>
